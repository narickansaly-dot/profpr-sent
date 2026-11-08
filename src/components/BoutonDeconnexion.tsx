'use client';

import { useRef } from 'react';
import { deconnecter } from '@/app/(auth)/actions';
import { oublierAppareilCourant } from '@/app/(app)/notifications/actions';
import { desactiverPush } from '@/lib/notifications/client';
import { viderCachePages } from '@/lib/pwa/cache';

/** Sur un appareil partagé, la personne suivante ne doit pas recevoir les rappels : on désabonne l'appareil, sans jamais bloquer la déconnexion. */
async function oublierCetAppareil(): Promise<void> {
  try {
    const endpoint = await desactiverPush();
    if (endpoint) await oublierAppareilCourant(endpoint);
  } catch { /* la déconnexion continue */ }
}

function auPlus(ms: number, tache: Promise<void>): Promise<void> {
  return Promise.race([tache, new Promise<void>((resolve) => setTimeout(resolve, ms))]);
}

export function BoutonDeconnexion({ prenom }: { prenom: string | null }) {
  // L'action reste celle du serveur (elle marche sans JavaScript). Le cache est vidé et l'appareil désabonné juste avant, quand c'est possible (2 s au plus).
  const nettoye = useRef(false);
  async function surEnvoi(e: React.FormEvent<HTMLFormElement>) {
    if (nettoye.current) return; // deuxième envoi, après le nettoyage : on laisse l'action du serveur partir
    e.preventDefault();
    const form = e.currentTarget;
    await auPlus(2000, Promise.all([viderCachePages(), oublierCetAppareil()]).then(() => undefined));
    nettoye.current = true;
    form.requestSubmit();
  }
  return (
    <form action={deconnecter} onSubmit={surEnvoi}>
      <button type="submit" className="bouton bouton-secondaire bouton-compte">
        <span className="nom-compte">{prenom ?? 'Mon compte'}</span>
        <span aria-hidden="true">·</span>
        <span>Se déconnecter</span>
      </button>
    </form>
  );
}
