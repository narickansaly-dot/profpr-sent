'use client';

import { useEffect } from 'react';

/** Demande au service worker de garder ce chapitre pour la lecture hors connexion, même s'il a été ouvert par un lien de l'application. */
export function MiseEnCachePage() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.controller?.postMessage({ type: 'mettre-en-cache', url: location.pathname });
  }, []);
  return null;
}
