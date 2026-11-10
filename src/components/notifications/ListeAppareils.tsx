import { retirerAppareil } from '@/app/(app)/notifications/actions';
import { jourParis, libelleJour } from '@/lib/calendrier/dates';

export type Appareil = { id: string; appareil: string; cree_le: string };

export function ListeAppareils({ appareils }: { appareils: Appareil[] }) {
  if (appareils.length === 0) return <p>Aucun appareil ne reçoit tes notifications pour l’instant.</p>;
  return (
    <ul className="liste-appareils">
      {appareils.map((a) => (
        <li key={a.id}>
          <span>{a.appareil || 'Appareil'}<span className="aide-champ"> · ajouté le {libelleJour(jourParis(new Date(a.cree_le)))}</span></span>
          <form action={retirerAppareil}>
            <input type="hidden" name="id" value={a.id} />
            <button type="submit" className="bouton bouton-secondaire">Retirer<span className="sr-only"> {a.appareil || 'Appareil'}, ajouté le {libelleJour(jourParis(new Date(a.cree_le)))}</span></button>
          </form>
        </li>
      ))}
    </ul>
  );
}
