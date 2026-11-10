// Sans zod : importé par le composant client (zod tente `new Function`, ce que la CSP signale comme violation « eval »).

function repere(q: { source?: string | null; enonce: string }): string {
  const source = q.source?.trim();
  return source || Array.from(q.enonce.trim()).slice(0, 40).join('').trim();
}

/** Libellé caché d'une case : stable, il ne dépend pas de la position dans la liste. */
export function libelleCase(q: { source?: string | null; enonce: string }): string {
  return `Sélectionner la question ${repere(q)}`;
}

/** Libellé caché du lien « Modifier » : même repère stable que la case. */
export function libelleModifier(q: { source?: string | null; enonce: string }): string {
  return `Modifier la question ${repere(q)}`;
}

/** « Tout cocher » reflète l'état réel : vrai seulement si la liste n'est pas vide et que chaque question est cochée. */
export function toutEstCoche(ids: readonly string[], cochees: ReadonlySet<string>): boolean {
  return ids.length > 0 && ids.every((id) => cochees.has(id));
}
