// Sans zod : importé par le composant client (zod tente `new Function`, ce que la CSP signale comme violation « eval »).

/** Libellé caché d'une case : stable, il ne dépend pas de la position dans la liste. */
export function libelleCase(q: { source?: string | null; enonce: string }): string {
  const source = q.source?.trim();
  const repere = source || Array.from(q.enonce.trim()).slice(0, 40).join('').trim();
  return `Sélectionner la question ${repere}`;
}

/** « Tout cocher » reflète l'état réel : vrai seulement si la liste n'est pas vide et que chaque question est cochée. */
export function toutEstCoche(ids: readonly string[], cochees: ReadonlySet<string>): boolean {
  return ids.length > 0 && ids.every((id) => cochees.has(id));
}
