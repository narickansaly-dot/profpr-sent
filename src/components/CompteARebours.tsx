'use client';

import { useEffect, useRef, useState } from 'react';
import { formaterDuree } from '@/lib/quiz/temps';

type Props = { dateLimite: string; serveurMaintenant: number; onFin: () => void };

/** Décompte calé sur l'horloge du serveur ; le serveur reste seul juge de la limite. */
export function CompteARebours({ dateLimite, serveurMaintenant, onFin }: Props) {
  const [restant, setRestant] = useState<number | null>(null);
  const finAppelee = useRef(false);
  const [annonce, setAnnonce] = useState('');
  // Seuils déjà annoncés (en minutes ; 0 = fin) : chacun l'est une seule fois.
  const annonces = useRef(new Set<number>());
  const initialise = useRef(false);
  const rappel = useRef(onFin);
  useEffect(() => { rappel.current = onFin; });

  useEffect(() => {
    const ecart = serveurMaintenant - Date.now();
    const fin = new Date(dateLimite).getTime();
    const tic = () => {
      const r = fin - (Date.now() + ecart);
      setRestant(r);
      // Seuils franchis (en minutes ; 0 = fin), chacun annoncé une seule fois. À l'arrivée sur la page,
      // un seuil déjà dépassé de plus d'une seconde est considéré comme connu et n'est pas annoncé.
      const franchis = [10, 5, 1, 0].filter((m) => r <= m * 60000 && !annonces.current.has(m));
      const premier = !initialise.current;
      initialise.current = true;
      for (const m of franchis) annonces.current.add(m);
      const aAnnoncer = franchis.filter((m) => !premier || r > m * 60000 - 1000).pop();
      if (aAnnoncer !== undefined) {
        setAnnonce(aAnnoncer === 0 ? 'Temps écoulé, correction en cours.' : `Il reste ${aAnnoncer} minute${aAnnoncer > 1 ? 's' : ''}.`);
      }
      if (r <= 0 && !finAppelee.current) {
        finAppelee.current = true;
        rappel.current();
      }
    };
    tic();
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, [dateLimite, serveurMaintenant]);

  // Région vocale toujours présente : un lecteur d'écran n'annonce que les changements de son contenu.
  const region = <span className="sr-only" aria-live="polite" aria-atomic="true">{annonce}</span>;
  if (restant === null) return <><span className="compte-a-rebours">⏱ …</span>{region}</>;
  const minutes = Math.max(0, Math.ceil(restant / 60000));
  const bientot = restant <= 5 * 60000;
  return (
    <>
      <span className={`compte-a-rebours${bientot ? ' bientot' : ''}`} role="timer"
        aria-label={`Temps restant : environ ${minutes} minute${minutes > 1 ? 's' : ''}`}>
        ⏱ {formaterDuree(restant)}{bientot && <span className="precision" aria-hidden="true"> (moins de 5 min)</span>}
      </span>
      {region}
    </>
  );
}
