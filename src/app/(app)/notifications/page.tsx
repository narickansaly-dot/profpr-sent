import Link from 'next/link';
import { exigerEleve } from '@/lib/calendrier/garde';
import { creerClientServeur } from '@/lib/supabase/server';
import { PREFERENCES_PAR_DEFAUT, versValeurs, type Preferences } from '@/lib/notifications/preferences';
import { ActivationPush } from '@/components/notifications/ActivationPush';
import { FormulairePreferences } from '@/components/notifications/FormulairePreferences';
import { ListeAppareils } from '@/components/notifications/ListeAppareils';

export const metadata = { title: 'Notifications' };

export default async function PageNotifications() {
  await exigerEleve();
  const supabase = await creerClientServeur();
  const [prefs, appareils] = await Promise.all([
    supabase.from('preferences_notification')
      .select('rappel_evenement, echeance_proche, nouvel_essai, revision_du_jour, inactivite, silence_debut, silence_fin, jours_inactivite')
      .maybeSingle(),
    supabase.from('abonnement_push').select('id, appareil, cree_le').order('cree_le', { ascending: false }).order('id'),
  ]);
  // Une erreur de lecture ne doit pas afficher les valeurs par défaut : l'élève les enregistrerait par-dessus ses vrais réglages.
  const preferences: Preferences = prefs.data ?? PREFERENCES_PAR_DEFAUT;
  return (
    <div className="page-notifications">
      <p><Link href="/rappels">← Mes rappels</Link></p>
      <h1>Notifications</h1>
      <section className="carte" aria-labelledby="appareil-titre">
        <h2 id="appareil-titre">Sur cet appareil</h2>
        <ActivationPush clePublique={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''} />
      </section>
      <section className="carte" aria-labelledby="reglages-titre">
        <h2 id="reglages-titre">Ce que tu reçois</h2>
        {prefs.error
          ? <p className="message-erreur" role="alert">Tes réglages n’ont pas pu être chargés. Recharge la page.</p>
          : <FormulairePreferences initial={versValeurs(preferences)} />}
      </section>
      <section className="carte" aria-labelledby="appareils-titre">
        <h2 id="appareils-titre">Tes appareils</h2>
        <ListeAppareils appareils={appareils.data ?? []} />
      </section>
    </div>
  );
}
