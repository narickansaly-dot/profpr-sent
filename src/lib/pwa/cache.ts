/** Préfixe du cache des pages de chapitre : doit correspondre à CACHE_PAGES dans public/sw.js. */
export const PREFIXE_CACHE_PAGES = 'pages-';

/** Vide les pages de chapitre mises en cache : sur un appareil partagé, rien ne reste après la déconnexion. */
export async function viderCachePages(): Promise<void> {
  if (typeof caches === 'undefined') return;
  try {
    const cles = await caches.keys();
    await Promise.all(cles.filter((c) => c.startsWith(PREFIXE_CACHE_PAGES)).map((c) => caches.delete(c)));
  } catch {
    // Cache API indisponible (navigation privée, stockage bloqué) : rien à vider.
  }
}
