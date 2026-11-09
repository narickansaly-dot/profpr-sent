type Env = Record<string, string | undefined>;

const NOTIFICATIONS = ['NEXT_PUBLIC_VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_SUJET', 'ENVOI_SECRET'] as const;

function estUrl(valeur: string | undefined, protocoles: string[]): boolean {
  if (!valeur) return false;
  try {
    return protocoles.includes(new URL(valeur).protocol);
  } catch {
    return false;
  }
}

/** Vérifie les variables d'environnement : erreurs bloquantes et avertissements. Fonction pure, testée. */
export function verifierEnvironnement(env: Env): { erreurs: string[]; avertissements: string[] } {
  const erreurs: string[] = [];
  const avertissements: string[] = [];
  if (!estUrl(env.NEXT_PUBLIC_SUPABASE_URL, ['http:', 'https:'])) erreurs.push('NEXT_PUBLIC_SUPABASE_URL doit être une URL http(s).');
  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) erreurs.push('NEXT_PUBLIC_SUPABASE_ANON_KEY est absente.');
  if (env.VERCEL_ENV === 'production' && !estUrl(env.NEXT_PUBLIC_SITE_URL, ['https:'])) {
    erreurs.push('NEXT_PUBLIC_SITE_URL doit être une adresse https en production.');
  }
  const absentes = NOTIFICATIONS.filter((cle) => !env[cle]);
  if (absentes.length === NOTIFICATIONS.length) {
    avertissements.push(`Notifications désactivées : ${absentes.join(', ')} absentes.`);
  } else if (absentes.length > 0) {
    avertissements.push(`Notifications désactivées : ${absentes.join(', ')} ${absentes.length > 1 ? 'absentes' : 'absente'}.`);
  } else if ((env.ENVOI_SECRET ?? '').length < 32) {
    avertissements.push('Notifications désactivées : ENVOI_SECRET doit compter au moins 32 caractères.');
  } else if (!/^(mailto:|https:)/.test(env.VAPID_SUJET ?? '')) {
    avertissements.push('Notifications désactivées : VAPID_SUJET doit commencer par mailto: ou https:.');
  }
  return { erreurs, avertissements };
}
