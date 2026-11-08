'use client';

import { useEffect } from 'react';
import { viderCachePages } from '@/lib/pwa/cache';
import { desactiverPush } from '@/lib/notifications/client';

/**
 * Sur la page de connexion : aucune page de chapitre d'un compte précédent ne doit rester en cache,
 * et l'appareil ne garde pas l'abonnement push du compte précédent (l'endpoint mort est supprimé au prochain envoi).
 */
export function ViderCachePages() {
  useEffect(() => {
    void viderCachePages();
    void (async () => { try { await desactiverPush(); } catch { /* au mieux */ } })();
  }, []);
  return null;
}
