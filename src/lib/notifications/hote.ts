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
