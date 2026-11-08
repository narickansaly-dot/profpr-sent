// Service worker : lecture hors connexion des chapitres déjà ouverts.
// Changer VERSION à chaque modification de ce fichier : les caches des autres versions sont supprimés à l'activation.
const VERSION = 'v2';
const CACHE_STATIQUE = `statique-${VERSION}`;
// Préfixe « pages- » : vidé par l'application à la déconnexion (src/lib/pwa/cache.ts).
const CACHE_PAGES = `pages-${VERSION}`;
// Cache à part, jamais limité ni vidé par l'application : c'est la page de repli.
const CACHE_HORS_LIGNE = `hors-ligne-${VERSION}`;
const HORS_LIGNE = '/hors-ligne';
const MAX_PAGES = 30;
const MAX_STATIQUES = 300;
// Pages de chapitre : /cours/<cours>/<chapitre>, sauf la page d'évaluation.
const CHAPITRE = /^\/cours\/[^/]+\/(?!evaluation$)[^/]+$/;

self.addEventListener('install', (evenement) => {
  evenement.waitUntil((async () => {
    const cache = await caches.open(CACHE_HORS_LIGNE);
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

// Une réponse n'est mise en cache que si elle est un succès complet (200), non redirigé.
// (Set-Cookie n'est jamais visible depuis un service worker : on ne peut pas le tester ici.)
function cacheable(reponse) {
  return reponse.status === 200 && !reponse.redirected;
}

function cleChapitre(url) {
  return url.origin + url.pathname;
}

// Mise en cache demandée par la page elle-même : les chapitres ouverts par un lien de l'application
// (navigation côté client, données RSC) ne passent pas par une navigation interceptée.
self.addEventListener('message', (evenement) => {
  const donnees = evenement.data;
  if (!donnees || donnees.type !== 'mettre-en-cache' || typeof donnees.url !== 'string') return;
  let url;
  try { url = new URL(donnees.url, self.location.origin); } catch { return; }
  if (url.origin !== self.location.origin || !CHAPITRE.test(url.pathname)) return;
  evenement.waitUntil((async () => {
    try {
      const reponse = await fetch(new Request(url.origin + url.pathname, { credentials: 'same-origin', headers: { Accept: 'text/html' } }));
      if (!cacheable(reponse)) return;
      const cache = await caches.open(CACHE_PAGES);
      await cache.put(cleChapitre(url), reponse);
      await limiter(cache, MAX_PAGES);
    } catch {
      // Hors connexion : rien à mettre en cache.
    }
  })());
});

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET') return;
  const url = new URL(requete.url);
  if (url.origin !== self.location.origin) return;
  // Données RSC (flight) : jamais de cache ni de détour.
  if (requete.headers.has('RSC') || url.searchParams.has('_rsc')) return;
  if (url.pathname.startsWith('/_next/static/')) {
    evenement.respondWith(cacheDAbord(evenement, requete));
  } else if (requete.mode === 'navigate') {
    evenement.respondWith(CHAPITRE.test(url.pathname) ? reseauDAbord(evenement, requete, url) : reseauOuHorsLigne(requete));
  }
  // Le reste (données RSC, actions serveur, /api, /auth, /ical) passe par le réseau, sans cache.
});

// Fichiers de build : leur nom change à chaque version, ils ne changent jamais de contenu.
async function cacheDAbord(evenement, requete) {
  const cache = await caches.open(CACHE_STATIQUE);
  const enCache = await cache.match(requete);
  if (enCache) return enCache;
  const reponse = await fetch(requete);
  if (cacheable(reponse)) {
    const copie = reponse.clone();
    evenement.waitUntil((async () => { await cache.put(requete, copie); await limiter(cache, MAX_STATIQUES); })());
  }
  return reponse;
}

async function reseauDAbord(evenement, requete, url) {
  const cle = cleChapitre(url);
  const cache = await caches.open(CACHE_PAGES);
  try {
    const reponse = await fetch(requete);
    // Seulement une vraie page de chapitre : pas une redirection vers la connexion, pas une erreur.
    if (cacheable(reponse)) {
      const copie = reponse.clone();
      evenement.waitUntil((async () => { await cache.put(cle, copie); await limiter(cache, MAX_PAGES); })());
    }
    return reponse;
  } catch {
    return (await cache.match(cle)) ?? (await repli()) ?? Response.error();
  }
}

async function reseauOuHorsLigne(requete) {
  try {
    return await fetch(requete);
  } catch {
    return (await repli()) ?? Response.error();
  }
}

// Les clés sont rendues dans l'ordre d'insertion (une clé réécrite passe à la fin) : on retire les plus anciennes.
async function limiter(cache, max) {
  const cles = await cache.keys();
  await Promise.all(cles.slice(0, Math.max(0, cles.length - max)).map((c) => cache.delete(c)));
}

async function repli() {
  const cache = await caches.open(CACHE_HORS_LIGNE);
  return cache.match(HORS_LIGNE);
}

// Notifications Web Push. Charge envoyée par la route d'envoi : { id, titre, corps, url }.
function lienInterne(url) {
  if (typeof url !== 'string' || !url.startsWith('/') || /[\u0000-\u001f\u007f\\]/.test(url)) return '/';
  try {
    const u = new URL(url, self.location.origin);
    return u.origin === self.location.origin ? u.pathname + u.search + u.hash : '/';
  } catch {
    return '/';
  }
}

self.addEventListener('push', (evenement) => {
  let donnees = {};
  try {
    donnees = evenement.data ? evenement.data.json() : {};
  } catch {
    donnees = {};
  }
  if (!donnees || typeof donnees !== 'object') donnees = {};
  const titre = typeof donnees.titre === 'string' && donnees.titre ? donnees.titre : 'App lycée';
  evenement.waitUntil(self.registration.showNotification(titre, {
    body: typeof donnees.corps === 'string' ? donnees.corps : '',
    icon: '/icones/192.png',
    badge: '/icones/192.png',
    lang: 'fr',
    tag: typeof donnees.id === 'string' ? donnees.id : undefined,
    data: { url: lienInterne(donnees.url) },
  }));
});

self.addEventListener('notificationclick', (evenement) => {
  evenement.notification.close();
  const cible = new URL(lienInterne(evenement.notification.data && evenement.notification.data.url), self.location.origin).href;
  evenement.waitUntil((async () => {
    const fenetres = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const fenetre of fenetres) {
      if (fenetre.url === cible && 'focus' in fenetre) return fenetre.focus();
    }
    for (const fenetre of fenetres) {
      if (new URL(fenetre.url).origin !== self.location.origin || !('focus' in fenetre) || !('navigate' in fenetre)) continue;
      try {
        await fenetre.focus();
        await fenetre.navigate(cible);
        return;
      } catch {
        // On essaie d'ouvrir une nouvelle fenêtre.
      }
    }
    return self.clients.openWindow(cible);
  })());
});
