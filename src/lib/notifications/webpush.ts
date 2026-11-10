import * as webpush from 'web-push';
import type { Envoyer } from './envoi';
import { hoteDePushAutorise } from './hote';

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
