import { verifierEnvironnement } from '@/lib/env';

/** Appelée une fois au démarrage du serveur : une configuration incomplète arrête le démarrage. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { erreurs, avertissements } = verifierEnvironnement(process.env);
  for (const a of avertissements) console.warn(`[configuration] ${a}`);
  if (erreurs.length > 0) {
    throw new Error(`Configuration invalide :\n- ${erreurs.join('\n- ')}`);
  }
}
