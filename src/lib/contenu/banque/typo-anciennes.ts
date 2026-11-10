import type { CoursImport } from '../format-import';

const ANCIENNE = /:(quiz|bis):/;
const ESPACE_AVANT_SIGNE = / (?=[?:;!])/g;

/** Remplace l'espace U+0020 placée juste avant « ? : ; ! » par une espace insécable U+00A0. */
export function insecable(texte: string): string {
  return texte.replace(ESPACE_AVANT_SIGNE, ' ');
}

/**
 * Harmonise la typographie des anciennes questions (source contenant `:quiz:` ou `:bis:`) :
 * uniquement `enonce` et `explication`, jamais les propositions ni les réponses acceptées
 * (les modifier créerait une nouvelle version de la question). Idempotente ; ne modifie pas `cours`.
 * Renvoie une copie (ordre des clés conservé) et le nombre de questions modifiées.
 */
export function harmoniserTypoAnciennes(cours: CoursImport): { cours: CoursImport; modifiees: number } {
  let modifiees = 0;
  const chapitres = cours.chapitres.map((c) => ({
    ...c,
    questions: c.questions.map((q) => {
      if (!ANCIENNE.test(q.source)) return q;
      const enonce = insecable(q.enonce);
      const explication = q.explication === undefined ? undefined : insecable(q.explication);
      if (enonce === q.enonce && explication === q.explication) return q;
      modifiees += 1;
      return { ...q, enonce, ...(explication === undefined ? {} : { explication }) } as typeof q;
    }),
  }));
  return { cours: { ...cours, chapitres }, modifiees };
}
