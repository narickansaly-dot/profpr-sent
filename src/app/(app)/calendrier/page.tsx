import Link from 'next/link';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lireCalendrier, plansAReorganiser } from '@/lib/calendrier/requetes';
import { jourParis, libellePeriode, lireVue, naviguer, periodeVue, VUES, type Vue } from '@/lib/calendrier/dates';
import { BanniereReorganiser } from '@/components/calendrier/BanniereReorganiser';
import { InvitationRappels } from '@/components/notifications/InvitationRappels';
import { creerClientServeur } from '@/lib/supabase/server';
import { VueCalendrier } from '@/components/calendrier/VueCalendrier';

export const metadata = { title: 'Calendrier' };

const NOMS: Record<Vue, string> = { jour: 'Jour', semaine: 'Semaine', mois: 'Mois' };
const PRECEDENT: Record<Vue, string> = { jour: 'Jour précédent', semaine: 'Semaine précédente', mois: 'Mois précédent' };
const SUIVANT: Record<Vue, string> = { jour: 'Jour suivant', semaine: 'Semaine suivante', mois: 'Mois suivant' };

export default async function PageCalendrier({ searchParams }: { searchParams: Promise<{ vue?: string; date?: string }> }) {
  await exigerEleve();
  const maintenant = new Date();
  const { vue, jour } = lireVue(await searchParams, maintenant);
  const { jours, de, a } = periodeVue(vue, jour);
  const supabase = await creerClientServeur();
  const [occurrences, aReorganiser, evenements, appareils] = await Promise.all([
    lireCalendrier(de, a), plansAReorganiser(),
    supabase.from('evenement').select('id', { count: 'exact', head: true }),
    supabase.from('abonnement_push').select('id', { count: 'exact', head: true }),
  ]);
  const nbEvenements = evenements.count ?? 0;
  const nbAppareils = appareils.count ?? 0;
  return (
    <div className="calendrier">
      <header className="calendrier-entete">
        <h1>Mon calendrier</h1>
        <Link className="bouton bouton-principal" href={`/calendrier/nouveau?jour=${jour}`}>Ajouter</Link>
      </header>
      {aReorganiser.map((p) => (
        <BanniereReorganiser key={p.plan_id} planId={p.plan_id} examenId={p.examen_id} examenTitre={p.examen_titre} />
      ))}
      {nbEvenements > 0 && <InvitationRappels clePublique={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''} sansAppareil={nbAppareils === 0} />}
      <nav aria-label="Vue du calendrier" className="choix-vue">
        {VUES.map((v) => (
          <Link key={v} href={`/calendrier?vue=${v}&date=${jour}`} aria-current={v === vue ? 'page' : undefined}>{NOMS[v]}</Link>
        ))}
      </nav>
      <div className="navigation-periode">
        <Link href={`/calendrier?vue=${vue}&date=${naviguer(vue, jour, -1)}`} aria-label={PRECEDENT[vue]}><span aria-hidden="true">←</span></Link>
        <h2>{libellePeriode(vue, jour)}</h2>
        <Link href={`/calendrier?vue=${vue}&date=${naviguer(vue, jour, 1)}`} aria-label={SUIVANT[vue]}><span aria-hidden="true">→</span></Link>
        <Link href={`/calendrier?vue=${vue}`} className="lien-aujourdhui">Aujourd’hui</Link>
      </div>
      <VueCalendrier vue={vue} jour={jour} jours={jours} occurrences={occurrences} aujourdhui={jourParis(maintenant)} />
      <p className="lien-partage">
        <Link href="/calendrier/partage">Ajouter mon calendrier à un autre agenda</Link>
        {' · '}
        <Link href="/notifications">Notifications</Link>
      </p>
    </div>
  );
}
