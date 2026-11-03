export const DUREE_ESSAI_JOURS = 7;
const JOUR_MS = 24 * 60 * 60 * 1000;

export function joursEssaiRestants(inscritLe: Date, maintenant: Date): number {
  const fin = inscritLe.getTime() + DUREE_ESSAI_JOURS * JOUR_MS;
  return Math.max(0, Math.ceil((fin - maintenant.getTime()) / JOUR_MS));
}
