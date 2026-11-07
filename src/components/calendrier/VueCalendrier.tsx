import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ItemCalendrier } from './ItemCalendrier';
import { jourParis, libelleJour, type Vue } from '@/lib/calendrier/dates';
import type { OccurrenceCalendrier } from '@/lib/calendrier/requetes';

const JOURS_COURTS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
const JOURS_LONGS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

/** Occurrences rangées par jour de début (heure de Paris). */
function parJour(occurrences: OccurrenceCalendrier[]) {
  const groupes = new Map<string, OccurrenceCalendrier[]>();
  for (const o of occurrences) {
    const jour = jourParis(new Date(o.debut));
    groupes.set(jour, [...(groupes.get(jour) ?? []), o]);
  }
  return groupes;
}

type Props = { vue: Vue; jour: string; jours: string[]; occurrences: OccurrenceCalendrier[]; aujourdhui: string };

export function VueCalendrier({ vue, jour, jours, occurrences, aujourdhui }: Props) {
  const groupes = parJour(occurrences);
  if (vue === 'mois') {
    const mois = jour.slice(0, 7);
    const semaines = Array.from({ length: 6 }, (_, i) => jours.slice(i * 7, i * 7 + 7));
    return (
      <table className="grille-mois">
        <caption className="sr-only">Événements du mois. Choisis un jour pour voir son détail.</caption>
        <thead>
          <tr>{JOURS_COURTS.map((j, i) => <th key={j} scope="col"><abbr title={JOURS_LONGS[i]}>{j}</abbr></th>)}</tr>
        </thead>
        <tbody>
          {semaines.map((semaine) => (
            <tr key={semaine[0]}>
              {semaine.map((d) => {
                const items = groupes.get(d) ?? [];
                const classes = [d.slice(0, 7) !== mois && 'hors-mois', d === aujourdhui && 'aujourdhui'].filter(Boolean).join(' ');
                return (
                  <td key={d} className={classes || undefined}>
                    <Link href={`/calendrier?vue=jour&date=${d}`} aria-current={d === aujourdhui ? 'date' : undefined}
                      aria-label={`${libelleJour(d)}${items.length > 0 ? `, ${items.length} événement${items.length > 1 ? 's' : ''}` : ''}`}>
                      {Number(d.slice(8))}
                    </Link>
                    {items.length > 0 && (
                      <ul className="points-mois" aria-hidden="true">
                        {items.slice(0, 3).map((o) => (
                          <li key={o.cle} className={`point point-${o.type}`}
                            style={o.couleur ? ({ '--couleur-cours': o.couleur } as CSSProperties) : undefined}>
                            <span className="titre-mois">{o.type === 'echeance' ? `Échéance · ${o.titre}` : o.titre}</span>
                          </li>
                        ))}
                        {items.length > 3 && <li className="plus">+{items.length - 3}</li>}
                      </ul>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return (
    <ol className="agenda">
      {jours.map((d) => {
        const items = groupes.get(d) ?? [];
        return (
          <li key={d} className={d === aujourdhui ? 'jour-agenda aujourdhui' : 'jour-agenda'}>
            <h3>
              {libelleJour(d)}
              {d === aujourdhui && <span className="badge-aujourdhui"> · aujourd’hui</span>}
            </h3>
            {items.length === 0
              ? <p className="vide">Rien de prévu.</p>
              : <ul className="liste-calendrier">{items.map((o) => <ItemCalendrier key={o.cle} o={o} />)}</ul>}
          </li>
        );
      })}
    </ol>
  );
}
