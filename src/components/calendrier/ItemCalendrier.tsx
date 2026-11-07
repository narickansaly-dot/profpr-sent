import Link from 'next/link';
import type { CSSProperties } from 'react';
import { heureParis, jourParis, libelleJour } from '@/lib/calendrier/dates';
import type { OccurrenceCalendrier } from '@/lib/calendrier/requetes';

const LIBELLES = { revision: 'Révision', devoir: 'Devoir', examen_reel: 'Examen', echeance: 'Échéance de ta classe' } as const;

export function ItemCalendrier({ o, avecJour = false }: { o: OccurrenceCalendrier; avecJour?: boolean }) {
  const style = o.couleur ? ({ '--couleur-cours': o.couleur } as CSSProperties) : undefined;
  const horaire = o.debut === o.fin ? heureParis(o.debut) : `${heureParis(o.debut)} – ${heureParis(o.fin)}`;
  const contenu = (
    <>
      <span className="item-horaire">{avecJour && <span className="item-jour">{libelleJour(jourParis(new Date(o.debut)))} · </span>}{horaire}</span>
      <span className="item-titre">{o.titre}</span>
      <span className="item-type">{LIBELLES[o.type]}{o.classe_nom ? ` · ${o.classe_nom}` : ''}{o.lecture_seule && <span className="sr-only"> (lecture seule)</span>}</span>
    </>
  );
  if (o.type === 'echeance') {
    return (
      <li className="item-calendrier item-echeance" style={style}>
        {o.cours_slug ? <Link href={`/cours/${o.cours_slug}/evaluation`}>{contenu}</Link> : <div>{contenu}</div>}
      </li>
    );
  }
  return (
    <li className={`item-calendrier item-${o.type}`} style={style}>
      <Link href={`/calendrier/${o.evenement_id}`}>{contenu}</Link>
    </li>
  );
}
