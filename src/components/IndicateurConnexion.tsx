'use client';

import { useSyncExternalStore } from 'react';

function abonner(rappel: () => void) {
  window.addEventListener('online', rappel);
  window.addEventListener('offline', rappel);
  return () => {
    window.removeEventListener('online', rappel);
    window.removeEventListener('offline', rappel);
  };
}

/** Région de statut toujours présente (pour que le changement soit annoncé), visible seulement hors connexion. */
export function IndicateurConnexion() {
  const enLigne = useSyncExternalStore(abonner, () => navigator.onLine, () => true);
  return (
    <div role="status" className={enLigne ? 'sr-only' : 'bandeau-hors-ligne'}>
      {enLigne ? '' : 'Tu es hors connexion. Les chapitres déjà ouverts restent lisibles, les quiz et les évaluations demandent une connexion.'}
    </div>
  );
}
