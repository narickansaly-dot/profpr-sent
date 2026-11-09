import type { CoursImport, QuestionImport } from '../format-import';
import type { FichierBanque } from './format';

/** Sérialisation de bph.json : 2 espaces, saut de ligne final, ordre des clés conservé. */
export function serialiserCours(cours: CoursImport): string {
  return `${JSON.stringify(cours, null, 2)}\n`;
}

function canonique(valeur: unknown): string {
  return JSON.stringify(valeur, (_cle, v: unknown) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
      : v);
}

/** Contenu d'une question sans son statut : l'enseignant peut l'avoir validée sans que le contenu ait changé. */
const contenu = (q: QuestionImport) => canonique({ ...q, statut: undefined });

/**
 * Ajoute les questions du fichier de travail au chapitre N, au statut `a_relire`.
 * Une source déjà présente avec le même contenu est ignorée (fusion rejouable) ; avec un contenu différent, la fusion est refusée.
 * Ne modifie pas `cours` : renvoie une copie, qui garde l'ordre des clés du cours reçu.
 */
export function fusionnerBanque(cours: CoursImport, f: FichierBanque): CoursImport {
  const position = cours.chapitres.findIndex((c) => c.numero === f.chapitre);
  if (position < 0) throw new Error(`chapitre ${f.chapitre} absent du cours`);
  const chapitre = cours.chapitres[position];
  const presentes = new Map(chapitre.questions.map((q) => [q.source, q]));
  const ajoutees: QuestionImport[] = [];
  for (const q of f.questions) {
    const deja = presentes.get(q.source);
    if (deja) {
      if (contenu(deja) !== contenu(q)) throw new Error(`source déjà présente avec un contenu différent : ${q.source}`);
      continue;
    }
    const nouvelle = { ...q, statut: 'a_relire' } as QuestionImport;
    presentes.set(q.source, nouvelle);
    ajoutees.push(nouvelle);
  }
  const chapitres = cours.chapitres.map((c, i) => (i === position ? { ...c, questions: [...c.questions, ...ajoutees] } : c));
  return { ...cours, chapitres };
}
