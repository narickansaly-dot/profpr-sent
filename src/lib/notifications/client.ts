// Abonnement Web Push côté navigateur. Le service worker n'est enregistré qu'en production.

export type EtatPush = 'non_supporte' | 'iphone_installer' | 'refuse' | 'actif' | 'inactif';
export type AbonnementNavigateur = { endpoint: string; p256dh: string; auth: string };

/** Clé VAPID publique (base64 URL) → octets attendus par `applicationServerKey`. */
export function base64UrlVersOctets(base64: string): Uint8Array<ArrayBuffer> {
  const rembourre = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const brut = atob(rembourre.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(brut, (c) => c.charCodeAt(0));
}

/** iPhone ou iPad hors écran d'accueil : le Web Push n'y est possible qu'après installation (iOS 16.4+). */
export function estIphoneHorsEcranAccueil(userAgent: string, autonome: boolean, pointsTactiles: number): boolean {
  // iPadOS se présente comme un Mac : on le reconnaît à l'écran tactile.
  const ios = /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && pointsTactiles > 1);
  return ios && !autonome;
}

/** Libellé lisible de l'appareil, sans version ni détail identifiant. */
export function nomAppareil(userAgent: string): string {
  const navigateur = /Edg\//.test(userAgent) ? 'Edge' : /Firefox\//.test(userAgent) ? 'Firefox'
    : /Chrome\//.test(userAgent) ? 'Chrome' : /Safari\//.test(userAgent) ? 'Safari' : 'Navigateur';
  const systeme = /iPhone/.test(userAgent) ? 'iPhone' : /iPad/.test(userAgent) ? 'iPad' : /Android/.test(userAgent) ? 'Android' : 'ordinateur';
  return `${navigateur} sur ${systeme}`;
}

function autonome(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

async function abonnementActuel(): Promise<PushSubscription | null> {
  const reg = await navigator.serviceWorker.getRegistration();
  return (await reg?.pushManager.getSubscription()) ?? null;
}

export async function lireEtatPush(): Promise<EtatPush> {
  if (estIphoneHorsEcranAccueil(navigator.userAgent, autonome(), navigator.maxTouchPoints ?? 0)) return 'iphone_installer';
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'non_supporte';
  if (Notification.permission === 'denied') return 'refuse';
  return (await abonnementActuel()) ? 'actif' : 'inactif';
}

/** Service worker prêt, ou `null` s'il n'en vient aucun en 5 s (développement, enregistrement échoué). */
async function serviceWorkerPret(): Promise<ServiceWorkerRegistration | null> {
  let minuteur: ReturnType<typeof setTimeout> | undefined;
  const delai = new Promise<null>((resolve) => { minuteur = setTimeout(() => resolve(null), 5000); });
  try {
    return await Promise.race([navigator.serviceWorker.ready, delai]);
  } finally {
    clearTimeout(minuteur);
  }
}

export async function activerPush(clePublique: string): Promise<AbonnementNavigateur | 'refuse' | 'ignore' | 'indisponible'> {
  // Premier appel, avant tout await : Safari exige que la demande parte du geste de l'utilisateur.
  const demande = Notification.requestPermission();
  const permission = await demande;
  if (permission === 'denied') return 'refuse';
  if (permission !== 'granted') return 'ignore';
  if (!clePublique) return 'indisponible';
  const reg = await serviceWorkerPret();
  if (!reg) return 'indisponible';
  const abonnement = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64UrlVersOctets(clePublique),
  });
  const json = abonnement.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) return 'indisponible';
  return { endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth };
}

export async function desactiverPush(): Promise<string | null> {
  const abonnement = await abonnementActuel();
  if (!abonnement) return null;
  const endpoint = abonnement.endpoint;
  await abonnement.unsubscribe();
  return endpoint;
}
