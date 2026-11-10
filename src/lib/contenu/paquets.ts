/** Découpe une liste en paquets d'au plus `taille` éléments (taille entière >= 1). */
export function paquets<T>(liste: readonly T[], taille: number): T[][] {
  if (!Number.isInteger(taille) || taille < 1) throw new RangeError('taille invalide');
  const r: T[][] = [];
  for (let i = 0; i < liste.length; i += taille) r.push(liste.slice(i, i + taille));
  return r;
}
