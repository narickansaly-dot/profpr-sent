import { z } from 'zod';
import { schemaCoursImport, type CoursImport } from './format-import';

import { TAILLE_MAX_IMPORT, TAILLE_MAX_LIBELLE } from './limite-import';

export { TAILLE_MAX_IMPORT, TAILLE_MAX_LIBELLE };

// Messages par défaut de zod en français pour cette analyse seulement (aucune configuration globale de zod).
const ERREURS_FR = z.locales.fr().localeError;

type Probleme = { path: readonly PropertyKey[]; message: string };

const nom = (c: PropertyKey) => String(c);
const CHAMPS: Record<string, string> = {
  slug: 'identifiant (slug)', numero: 'numéro', titre: 'titre', titre_court: 'titre court', duree: 'durée', resume: 'résumé',
  chapeau: 'chapeau', objectifs: 'objectifs', sections: 'sections', a_retenir: 'à retenir', questions: 'questions', source: 'source',
  enonce: 'énoncé', type: 'type', propositions: 'propositions', bonnes_reponses: 'bonnes réponses', bonne_reponse: 'bonne réponse',
  reponses_acceptees: 'réponses acceptées', marge: 'marge', marge_relative: 'marge relative', difficulte: 'difficulté',
  explication: 'explication', statut: 'statut', notion: 'notion', html: 'contenu HTML', id: 'identifiant', filiere: 'filière',
  niveau: 'niveau', matiere: 'matière', couleur: 'couleur', chapitres: 'chapitres',
};

/** « Chapitre 3, question 12, énoncé : message » à partir d'un chemin zod. Les numéros sont ceux de la position dans le fichier (à partir de 1). */
export function formaterProbleme({ path, message }: Probleme): string {
  const morceaux: string[] = [];
  let i = 0;
  const chemin = [...path];
  if (chemin[0] === 'chapitres' && typeof chemin[1] === 'number') {
    morceaux.push(`Chapitre ${chemin[1] + 1}`);
    i = 2;
    if (chemin[i] === 'questions' && typeof chemin[i + 1] === 'number') { morceaux.push(`question ${Number(chemin[i + 1]) + 1}`); i += 2; }
    else if (chemin[i] === 'sections' && typeof chemin[i + 1] === 'number') { morceaux.push(`section ${Number(chemin[i + 1]) + 1}`); i += 2; }
  }
  const reste = chemin.slice(i);
  if (reste.length > 0) {
    const [tete, ...suite] = reste;
    const champ = CHAMPS[nom(tete)] ?? nom(tete);
    morceaux.push(suite.length > 0 ? `${champ} (${suite.map((c) => typeof c === 'number' ? `n° ${c + 1}` : nom(c)).join(', ')})` : champ);
  }
  return `${morceaux.length > 0 ? morceaux.join(', ') : 'Fichier'} : ${message}`;
}

export function formaterProblemes(problemes: readonly Probleme[]): string[] {
  return [...new Set(problemes.map(formaterProbleme))];
}

export type AnalyseImport = { cours: CoursImport } | { erreurs: string[] };

/** Analyse un texte JSON sans jamais lever : taille bornée avant toute lecture, JSON.parse protégé, puis schéma complet. */
export function analyserImport(texte: string): AnalyseImport {
  if (texte.length > TAILLE_MAX_IMPORT || new TextEncoder().encode(texte).length > TAILLE_MAX_IMPORT) {
    return { erreurs: [`Le fichier dépasse la limite de ${TAILLE_MAX_LIBELLE}.`] };
  }
  let brut: unknown;
  try {
    brut = JSON.parse(texte);
  } catch {
    return { erreurs: ['Ce fichier n’est pas du JSON valide (une virgule, une accolade ou un guillemet est mal placé).'] };
  }
  if (brut === null || typeof brut !== 'object' || Array.isArray(brut)) {
    return { erreurs: ['Le fichier doit contenir un objet JSON décrivant un cours.'] };
  }
  const lu = schemaCoursImport.safeParse(brut, { error: ERREURS_FR });
  return lu.success ? { cours: lu.data } : { erreurs: formaterProblemes(lu.error.issues) };
}
