import Link from 'next/link';
import { exigerEleve } from '@/lib/calendrier/garde';
import { creerClientServeur } from '@/lib/supabase/server';
import { heureParis, jourParis, libelleJour } from '@/lib/calendrier/dates';
import { MarquerRappelsLus } from '@/components/notifications/MarquerRappelsLus';

export const metadata = { title: 'Rappels' };

export default async function PageRappels() {
  await exigerEleve();
  const supabase = await creerClientServeur();
  const { data } = await supabase.from('notification_planifiee')
    .select('id, titre, corps, url, envoi_prevu, lue_le')
    .lte('envoi_prevu', new Date().toISOString())
    .order('envoi_prevu', { ascending: false }).order('id')
    .limit(50);
  const rappels = data ?? [];
  const nonLus = rappels.filter((r) => !r.lue_le).length;
  return (
    <div className="page-rappels">
      <h1>Rappels</h1>
      <p><Link href="/notifications">Régler mes notifications</Link></p>
      {rappels.length === 0 ? <p>Aucun rappel pour l’instant.</p> : (
        <ul className="liste-rappels">
          {rappels.map((r) => (
            <li key={r.id} className={r.lue_le ? 'carte' : 'carte rappel-nouveau'}>
              {!r.lue_le && <span className="pastille-nouveau">Nouveau</span>}
              <Link href={r.url}><strong>{r.titre}</strong></Link>
              <p>{r.corps}</p>
              <p className="aide-champ">{libelleJour(jourParis(new Date(r.envoi_prevu)))} à {heureParis(r.envoi_prevu)}</p>
            </li>
          ))}
        </ul>
      )}
      <MarquerRappelsLus nonLus={nonLus} />
    </div>
  );
}
