import * as webpush from 'web-push';
import type { Envoyer } from './envoi';

/**
 * Même règle que la base (`enregistrer_abonnement_push`) : https seulement, ni identifiants ni port,
 * hôte en minuscules fait de lettres, chiffres et tirets séparés par des points simples, et service push connu.
 * Défense en profondeur contre la falsification de requête côté serveur.
 */
export function hoteDePushAutorise(endpoint: string): boolean {
  if (typeof endpoint !== 'string' || /[\\\s\u0000-\u001f\u007f]/.test(endpoint)) return false;
  const hote = /^https:\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)*)(?:[/?#]|$)/.exec(endpoint.toLowerCase())?.[1];
  if (!hote) return false;
  return hote === 'fcm.googleapis.com' || hote === 'updates.push.services.mozilla.com'
    || hote.endsWith('.push.services.mozilla.com') || hote.endsWith('.push.apple.com') || hote.endsWith('.notify.windows.com');
}

/** Envoi réel (serveur seulement) : clés VAPID lues dans l'environnement. */
export function creerEnvoyeur(): Envoyer {
  webpush.setVapidDetails(process.env.VAPID_SUJET!, process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);
  return async (a, charge) => {
    // Un point d'envoi hors liste n'est jamais appelé : l'abonnement est retiré.
    if (!hoteDePushAutorise(a.endpoint)) return { ok: false, expire: true, temporaire: false };
    try {
      await webpush.sendNotification({ endpoint: a.endpoint, keys: { p256dh: a.p256dh, auth: a.auth } }, charge,
        { TTL: 3600, urgency: 'normal', timeout: 10_000 });
      return { ok: true };
    } catch (e) {
      const statut = (e as { statusCode?: number }).statusCode;
      return {
        ok: false,
        expire: statut === 404 || statut === 410,
        temporaire: statut === undefined || statut === 429 || statut >= 500,
      };
    }
  };
}
