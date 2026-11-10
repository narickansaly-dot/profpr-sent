export type SectionParents = 'eleve_15_ans' | 'eleve_moins_15_ans' | 'enfants_suivis' | null;

/** Quelle section « parents » afficher sur /mes-donnees. L'âge inconnu compte comme moins de 15 ans, comme côté base. */
export function sectionParents(role: string, moins15: boolean | null): SectionParents {
  if (role === 'eleve') return moins15 === false ? 'eleve_15_ans' : 'eleve_moins_15_ans';
  if (role === 'parent') return 'enfants_suivis';
  return null;
}

/** Affiche un code parent par groupes de 4 (ABCD-EFGH). */
export function formaterCodeParent(code: string): string {
  const net = code.replace(/[\s-]/g, '').toUpperCase();
  return net.match(/.{1,4}/g)?.join('-') ?? '';
}

export const PARENTS_MAX = 2;

/** Le bouton de création de code n'apparaît que tant que l'élève a moins de deux parents reliés. */
export function peutCreerCode(nbParents: number): boolean {
  return nbParents < PARENTS_MAX;
}
