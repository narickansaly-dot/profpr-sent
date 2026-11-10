'use client';

import { useEffect } from 'react';

/** Enregistre le service worker, en production seulement : en développement, il gênerait le rechargement à chaud. */
export function EnregistrementSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(process.env.NEXT_PUBLIC_VERSION_APP ?? 'dev')}`, { scope: '/', updateViaCache: 'none' }).catch(() => {
      // Sans service worker, l'application marche normalement, sans lecture hors connexion.
    });
  }, []);
  return null;
}
