// Service worker : lecture hors connexion des chapitres déjà ouverts.
// Changer VERSION à chaque modification de ce fichier : les caches des autres versions sont supprimés à l'activation.
const VERSION = 'v1';
const CACHE_STATIQUE = `statique-${VERSION}`;
// Préfixe « pages- » : vidé par l'application à la déconnexion (src/lib/pwa/cache.ts).
const CACHE_PAGES = `pages-${VERSION}`;
const HORS_LIGNE = '/hors-ligne';
const MAX_PAGES = 30;
const MAX_STATIQUES = 300;
// Pages de chapitre : /cours/<cours>/<chapitre>, sauf la page d'évaluation.
const CHAPITRE = /^\/cours\/[^/]+\/(?!evaluation$)[^/]+$/;

self.addEventListener('install', (evenement) => {
  evenement.waitUntil((async () => {
    const cache = await caches.open(CACHE_STATIQUE);
    await cache.add(new Request(HORS_LIGNE, { cache: 'reload' }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil((async () => {
    const cles = await caches.keys();
    await Promise.all(cles.filter((c) => !c.endsWith(`-${VERSION}`)).map((c) => caches.delete(c)));
    await self.clients.claim();
  })());
});

// Une réponse n'est mise en cache que si elle est un succès complet (200), sans cookie posé.
function cacheable(reponse) {
  return reponse.status === 200 && !reponse.redirected && !reponse.headers.has('set-cookie');
}

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET') return;
  const url = new URL(requete.url);
  if (url.origin !== self.location.origin) return;
  // Données RSC (flight) : jamais de cache ni de détour.
  if (requete.headers.has('RSC') || url.searchParams.has('_rsc')) return;
  if (url.pathname.startsWith('/_next/static/')) {
    evenement.respondWith(cacheDAbord(requete));
  } else if (requete.mode === 'navigate') {
    evenement.respondWith(CHAPITRE.test(url.pathname) ? reseauDAbord(requete, url) : reseauOuHorsLigne(requete));
  }
  // Le reste (données RSC, actions serveur, /api, /auth, /ical) passe par le réseau, sans cache.
});

// Fichiers de build : leur nom change à chaque version, ils ne changent jamais de contenu.
async function cacheDAbord(requete) {
  const cache = await caches.open(CACHE_STATIQUE);
  const enCache = await cache.match(requete);
  if (enCache) return enCache;
  const reponse = await fetch(requete);
  if (cacheable(reponse)) {
    await cache.put(requete, reponse.clone());
    await limiter(cache, MAX_STATIQUES);
  }
  return reponse;
}

async function reseauDAbord(requete, url) {
  const cle = url.origin + url.pathname;
  const cache = await caches.open(CACHE_PAGES);
  try {
    const reponse = await fetch(requete);
    // Seulement une vraie page de chapitre : pas une redirection vers la connexion, pas une erreur.
    if (cacheable(reponse)) {
      await cache.put(cle, reponse.clone());
      await limiter(cache, MAX_PAGES);
    }
    return reponse;
  } catch {
    return (await cache.match(cle)) ?? (await caches.match(HORS_LIGNE)) ?? Response.error();
  }
}

async function reseauOuHorsLigne(requete) {
  try {
    return await fetch(requete);
  } catch {
    return (await caches.match(HORS_LIGNE)) ?? Response.error();
  }
}

// Les clés sont rendues dans l'ordre d'insertion (une clé réécrite passe à la fin) : on retire les plus anciennes.
async function limiter(cache, max) {
  const cles = await cache.keys();
  await Promise.all(cles.slice(0, Math.max(0, cles.length - max)).map((c) => cache.delete(c)));
}
