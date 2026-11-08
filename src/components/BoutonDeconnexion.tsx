'use client';

import { useRef, useState } from 'react';
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
  const etape = useRef<'repos' | 'nettoyage' | 'pret'>('repos');
  const [attente, setAttente] = useState(false);
  async function surEnvoi(e: React.FormEvent<HTMLFormElement>) {
    if (etape.current === 'pret') return; // envoi après nettoyage : l'action du serveur part
    e.preventDefault();
    if (etape.current === 'nettoyage') return; // double appui : un seul nettoyage, un seul envoi
    etape.current = 'nettoyage';
    setAttente(true);
    const form = e.currentTarget;
    await auPlus(2000, Promise.all([viderCachePages(), oublierCetAppareil()]).then(() => undefined));
    etape.current = 'pret';
    if (typeof form.requestSubmit === 'function') form.requestSubmit();
    else form.submit();
  }
  return (
    <form action={deconnecter} onSubmit={surEnvoi}>
      <button type="submit" className="bouton bouton-secondaire bouton-compte" disabled={attente}>
        <span className="nom-compte">{prenom ?? 'Mon compte'}</span>
        <span aria-hidden="true">·</span>
        <span>Se déconnecter</span>
      </button>
    </form>
  );
}
