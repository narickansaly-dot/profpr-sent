// Enregistre l'empreinte du secret d'envoi (le secret lui-même va dans Supabase Vault) et (re)crée la tâche planifiée
// qui appelle la route chaque minute ; enregistre aussi l'empreinte du secret de consentement parental.
// Utilise la clé de service : base locale seulement, sauf si CONFIGURER_PRODUCTION=1 est fixé explicitement.
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const secret = process.env.ENVOI_SECRET;
const cible = process.env.ENVOI_URL;
const secretConsentement = process.env.CONSENTEMENT_SECRET;

if ((!secret || !cible) && !secretConsentement) {
  console.log('ENVOI_SECRET, ENVOI_URL et CONSENTEMENT_SECRET absents de .env.local : rien à configurer (npm run cles:notifications).');
  process.exit(0);
}
let hote = '';
try { hote = new URL(url).hostname; } catch { /* vérifié ci-dessous */ }
if (!['localhost', '127.0.0.1', '[::1]'].includes(hote) && process.env.CONFIGURER_PRODUCTION !== '1') {
  console.error('Refusé : NEXT_PUBLIC_SUPABASE_URL ne pointe pas vers la base locale (fixer CONFIGURER_PRODUCTION=1 pour la production).');
  process.exit(1);
}
if (cible && process.env.CONFIGURER_PRODUCTION === '1' && (!cible.startsWith('https://') || /host\.docker\.internal|localhost|127\.0\.0\.1/.test(cible))) {
  console.error('Refusé : en production, ENVOI_URL doit commencer par https:// et ne pas viser host.docker.internal, localhost ou 127.0.0.1.');
  process.exit(1);
}
// Pas d'await au niveau du module : les scripts sont exécutés en CommonJS par tsx (voir importer-contenu.ts).
async function main() {
  const db = createClient<Database>(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  if (secret && cible) {
    const { error } = await db.rpc('configurer_envoi', { p_url: cible, p_secret: secret });
    if (error) throw new Error(error.message);
    console.log('Tâche d’envoi configurée (chaque minute).');
  } else {
    console.log('ENVOI_SECRET ou ENVOI_URL absent : tâche d’envoi non configurée (npm run cles:notifications).');
  }
  if (secretConsentement) {
    const { error } = await db.rpc('configurer_consentement', { p_secret: secretConsentement });
    if (error) throw new Error(error.message);
    console.log('Secret du consentement parental configuré.');
  } else {
    console.log('CONSENTEMENT_SECRET absent : consentement parental impossible (npm run cles:notifications).');
  }
}

main().catch((e) => {
  console.error('Configuration impossible :', e instanceof Error ? e.message : String(e));
  process.exit(1);
});
