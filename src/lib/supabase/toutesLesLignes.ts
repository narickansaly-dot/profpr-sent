const TAILLE_PAGE = 1000; // max_rows de PostgREST (supabase/config.toml)

type Page<T> = { data: T[] | null; error: { message: string } | null };

/**
 * Lit une RPC page par page : PostgREST tronque en silence à 1000 lignes.
 * `page(de, a)` doit renvoyer la requête avec `.range(de, a)` ; la RPC doit avoir un ordre total.
 * Une erreur sur n'importe quelle page est renvoyée telle quelle.
 */
export async function toutesLesLignes<T, E extends { message: string }>(
  page: (de: number, a: number) => PromiseLike<{ data: T[] | null; error: E | null }>,
): Promise<{ data: T[]; error: null } | { data: null; error: E }> {
  const lignes: T[] = [];
  for (let de = 0; ; de += TAILLE_PAGE) {
    const { data, error } = await (page(de, de + TAILLE_PAGE - 1) as PromiseLike<Page<T> & { error: E | null }>);
    if (error) return { data: null, error };
    const recues = data ?? [];
    lignes.push(...recues);
    if (recues.length < TAILLE_PAGE) return { data: lignes, error: null };
  }
}
