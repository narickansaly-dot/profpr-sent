'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { marquerRappelsLus } from '@/app/(app)/notifications/actions';

/** Marque les rappels comme lus après l'affichage, puis met à jour le compteur de l'en-tête. */
export function MarquerRappelsLus({ nonLus }: { nonLus: number }) {
  const router = useRouter();
  useEffect(() => {
    if (nonLus === 0) return;
    marquerRappelsLus().then(() => router.refresh()).catch(() => {});
  }, [nonLus, router]);
  return null;
}
