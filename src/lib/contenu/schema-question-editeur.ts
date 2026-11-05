import { z } from 'zod';
import { controlesQuestion, variantesQuestionImport, type QuestionImport } from './format-import';

/** Schéma de l'éditeur : celui de l'import, avec une source facultative (le serveur en attribue une ou garde l'actuelle). */
const facultative = { source: z.string().optional() };
const [qcmUnique, qcmMultiple, vraiFaux, reponseCourte] = variantesQuestionImport;
export const schemaQuestionEditeur = controlesQuestion.reduce(
  (schema, c) => schema.refine(c.verifie, { message: c.message }),
  z.discriminatedUnion('type', [
    qcmUnique.omit({ source: true }).extend(facultative),
    qcmMultiple.omit({ source: true }).extend(facultative),
    vraiFaux.omit({ source: true }).extend(facultative),
    reponseCourte.omit({ source: true }).extend(facultative),
  ]),
);

/** Ce que le navigateur envoie : tout est du texte, le serveur convertit et valide. */
export type SaisieQuestion = {
  type: string; enonce: string;
  propositions: { texte: string; bonne: boolean }[];
  vraiFaux: '' | 'vrai' | 'faux';
  acceptees: string; marge: string; margeRelative: boolean;
  notion: string; difficulte: string; explication: string;
};

/** `champ` : identifiant du champ en cause (le champ du DOM est `champ-<champ>`). */
export type ErreurSaisie = { erreur: string; champ: string };

const TYPES = ['qcm_unique', 'qcm_multiple', 'vrai_faux', 'reponse_courte'];

/** Lit un nombre saisi avec virgule ou point ; `undefined` si vide, `NaN` si invalide. */
function lireNombre(t: string): number | undefined {
  const s = t.trim().replace(',', '.');
  if (s === '') return undefined;
  return /^\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
}

/** Convertit la saisie du formulaire en question de l'éditeur, ou renvoie la première erreur (en français). */
export function lireSaisieQuestion(s: SaisieQuestion): { question: QuestionImport } | ErreurSaisie {
  if (!TYPES.includes(s.type)) return { erreur: 'Choisis un type de question.', champ: 'type' };
  const brut: Record<string, unknown> = {
    type: s.type, enonce: s.enonce, notion: s.notion.trim() || undefined,
    difficulte: Number(s.difficulte), explication: s.explication,
  };
  if (s.type === 'qcm_unique' || s.type === 'qcm_multiple') {
    brut.propositions = s.propositions.map((p) => p.texte);
    brut.bonnes_reponses = s.propositions.flatMap((p, i) => (p.bonne ? [i] : []));
  } else if (s.type === 'vrai_faux') {
    brut.bonne_reponse = s.vraiFaux === '' ? undefined : s.vraiFaux === 'vrai';
  } else {
    brut.reponses_acceptees = s.acceptees.split('\n').map((l) => l.trim()).filter(Boolean);
    const m = lireNombre(s.marge);
    if (Number.isNaN(m)) return { erreur: 'La marge est un nombre positif (la virgule est acceptée).', champ: 'marge' };
    if (m !== undefined && m > (s.margeRelative ? 100 : 1_000_000)) {
      return { erreur: s.margeRelative ? 'Une marge relative va de 0 à 100 %.' : 'La marge est trop grande (1 000 000 au maximum).', champ: 'marge' };
    }
    // En mode relatif, la saisie est en pourcentage ; la base garde une fraction (5 % -> 0,05).
    brut.marge = m === undefined ? undefined : s.margeRelative ? Number((m / 100).toPrecision(12)) : m;
    brut.marge_relative = s.margeRelative;
  }
  const r = schemaQuestionEditeur.safeParse(brut);
  if (r.success) return { question: { ...r.data, source: r.data.source ?? '' } as QuestionImport };
  const i = r.error.issues[0];
  const cle = String(i.path[0] ?? '');
  if (cle === 'propositions' && typeof i.path[1] === 'number') {
    return { erreur: `La proposition ${i.path[1] + 1} est vide ou trop longue (500 caractères au maximum).`, champ: `proposition-${i.path[1]}` };
  }
  switch (cle) {
    case 'enonce': return { erreur: 'Écris l’énoncé de la question (2 000 caractères au maximum).', champ: 'enonce' };
    case 'propositions': return { erreur: 'Une question à choix compte de 2 à 10 propositions.', champ: 'proposition-0' };
    case 'bonnes_reponses':
      return { erreur: s.type === 'qcm_unique' ? 'Choisis la bonne réponse.' : 'Coche au moins une bonne réponse.', champ: 'bonne-0' };
    case 'bonne_reponse': return { erreur: 'Indique si l’affirmation est vraie ou fausse.', champ: 'vrai' };
    case 'reponses_acceptees': return { erreur: 'Écris au moins une réponse acceptée (une par ligne).', champ: 'acceptees' };
    case 'marge': return { erreur: 'La marge est un nombre positif (la virgule est acceptée).', champ: 'marge' };
    case 'notion': return { erreur: 'La notion est trop longue (120 caractères au maximum).', champ: 'notion' };
    case 'difficulte': return { erreur: 'Choisis une difficulté.', champ: 'difficulte' };
    case 'explication': return { erreur: 'L’explication est trop longue (4 000 caractères au maximum).', champ: 'explication' };
  }
  if (i.message === controlesQuestion[2].message) return { erreur: 'Une marge relative demande une valeur de marge.', champ: 'marge' };
  if (i.message === controlesQuestion[0].message || i.message === controlesQuestion[1].message) {
    return { erreur: 'Les bonnes réponses ne correspondent pas aux propositions.', champ: 'bonne-0' };
  }
  return { erreur: 'Cette question est incomplète ou mal formée.', champ: 'enonce' };
}
