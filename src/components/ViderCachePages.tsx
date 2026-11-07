'use client';

import { useEffect } from 'react';
import { viderCachePages } from '@/lib/pwa/cache';

/** Sur la page de connexion : aucune page de chapitre d'un compte précédent ne doit rester en cache. */
export function ViderCachePages() {
  useEffect(() => { void viderCachePages(); }, []);
  return null;
}
