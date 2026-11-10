/** Durée de l'essai, côté interface. La base reste la seule à décider (prive.fin_essai) ; garder la même valeur. */
export const DUREE_ESSAI_JOURS = 7;
const JOUR_MS = 24 * 60 * 60 * 1000;

/** Jours entiers (arrondis au-dessus) avant `fin`, 0 une fois passée. */
export function joursAvant(fin: Date, maintenant: Date): number {
  return Math.max(0, Math.ceil((fin.getTime() - maintenant.getTime()) / JOUR_MS));
}
