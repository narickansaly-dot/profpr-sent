'use client';

import { useEffect, useRef, useState } from 'react';
import { formaterDuree } from '@/lib/quiz/temps';

type Props = { dateLimite: string; serveurMaintenant: number; onFin: () => void };

/** Décompte calé sur l'horloge du serveur ; le serveur reste seul juge de la limite. */
export function CompteARebours({ dateLimite, serveurMaintenant, onFin }: Props) {
  const [restant, setRestant] = useState<number | null>(null);
  const finAppelee = useRef(false);
  const rappel = useRef(onFin);
  useEffect(() => { rappel.current = onFin; });

  useEffect(() => {
    const ecart = serveurMaintenant - Date.now();
    const fin = new Date(dateLimite).getTime();
    const tic = () => {
      const r = fin - (Date.now() + ecart);
      setRestant(r);
      if (r <= 0 && !finAppelee.current) {
        finAppelee.current = true;
        rappel.current();
      }
    };
    tic();
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, [dateLimite, serveurMaintenant]);

  if (restant === null) return <span className="compte-a-rebours">⏱ …</span>;
  const minutes = Math.max(0, Math.ceil(restant / 60000));
  return (
    <span className={`compte-a-rebours${restant <= 5 * 60000 ? ' bientot' : ''}`} role="timer"
      aria-label={`Temps restant : environ ${minutes} minute${minutes > 1 ? 's' : ''}`}>
      ⏱ {formaterDuree(restant)}
    </span>
  );
}
