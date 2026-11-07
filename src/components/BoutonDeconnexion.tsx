'use client';

import { deconnecter } from '@/app/(auth)/actions';
import { viderCachePages } from '@/lib/pwa/cache';

export function BoutonDeconnexion({ prenom }: { prenom: string | null }) {
  // L'action reste celle du serveur (elle marche sans JavaScript) ; le cache est vidé juste avant, quand c'est possible.
  return (
    <form action={deconnecter} onSubmit={() => { void viderCachePages(); }}>
      <button type="submit" className="bouton bouton-secondaire bouton-compte">
        <span className="nom-compte">{prenom ?? 'Mon compte'}</span>
        <span aria-hidden="true">·</span>
        <span>Se déconnecter</span>
      </button>
    </form>
  );
}
