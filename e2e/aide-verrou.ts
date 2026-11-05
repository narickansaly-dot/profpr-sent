import { mkdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DOSSIER = join(tmpdir(), 'app-lycee-e2e-contenu.verrou');
const PERIME_MS = 10 * 60 * 1000;

/**
 * Exclusion mutuelle entre processus de test (le projet mobile et le projet ordinateur partagent la même base) :
 * le parcours de contenu modifie le cours BPH et le réimporte, ce que deux exécutions simultanées se disputeraient.
 * Un verrou plus vieux que 10 minutes est considéré comme abandonné.
 */
export async function avecVerrou<T>(travail: () => Promise<T>): Promise<T> {
  for (;;) {
    try {
      await mkdir(DOSSIER);
      break;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e;
      const age = await stat(DOSSIER).then((s) => Date.now() - s.mtimeMs).catch(() => 0);
      if (age > PERIME_MS) await rm(DOSSIER, { recursive: true, force: true });
      else await new Promise((r) => setTimeout(r, 1000));
    }
  }
  try {
    return await travail();
  } finally {
    await rm(DOSSIER, { recursive: true, force: true });
  }
}
