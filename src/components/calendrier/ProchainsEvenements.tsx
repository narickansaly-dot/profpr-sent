import Link from 'next/link';
import { prochainsEvenements, type OccurrenceCalendrier } from '@/lib/calendrier/requetes';
import { ItemCalendrier } from './ItemCalendrier';

export async function ProchainsEvenements() {
  let liste: OccurrenceCalendrier[] | null;
  try {
    liste = await prochainsEvenements(new Date());
  } catch (e) {
    console.error('prochains événements', e);
    liste = null;
  }
  return (
    <section aria-labelledby="titre-prochains">
      <h2 id="titre-prochains">Prochains événements</h2>
      {liste === null ? <p className="vide">Ton calendrier n’a pas pu se charger. Recharge la page dans un instant.</p>
        : liste.length === 0 ? <p className="vide">Rien de prévu dans les 14 prochains jours. <Link href="/calendrier/nouveau">Ajoute un devoir ou un examen</Link>.</p>
        : <ul className="liste-calendrier">{liste.map((o) => <ItemCalendrier key={o.cle} o={o} avecJour />)}</ul>}
      <p><Link href="/calendrier" className="lien-action">Voir mon calendrier</Link></p>
    </section>
  );
}
