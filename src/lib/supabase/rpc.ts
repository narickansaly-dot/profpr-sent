type Reponse<T> = { data: T | null; error: { code?: string; message: string } | null };

/**
 * Deux démarrages simultanés peuvent heurter l'index « une tentative ouverte » (23505) :
 * le second appel renvoie alors la tentative ouverte par le premier.
 */
export async function appelerAvecRelance<T>(appel: () => PromiseLike<Reponse<T>>): Promise<Reponse<T>> {
  const premiere = await appel();
  if (premiere.error?.code !== '23505') return premiere;
  return appel();
}
