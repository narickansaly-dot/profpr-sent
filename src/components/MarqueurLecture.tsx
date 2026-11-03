'use client';

import { useEffect, useRef } from 'react';
import { marquerChapitreLu } from '@/app/(app)/tentative/actions';

/** Marque le chapitre comme lu quand la fin du texte devient visible. Indicatif : rien n'est bloqué. */
export function MarqueurLecture({ chapitreId }: { chapitreId: string }) {
  const repere = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = repere.current;
    if (!element) return;
    const observateur = new IntersectionObserver(([entree]) => {
      if (entree.isIntersecting) {
        void marquerChapitreLu(chapitreId);
        observateur.disconnect();
      }
    });
    observateur.observe(element);
    return () => observateur.disconnect();
  }, [chapitreId]);
  return <div ref={repere} aria-hidden="true" />;
}
