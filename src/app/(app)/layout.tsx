import { redirect } from 'next/navigation';
import { creerClientServeur } from '@/lib/supabase/server';
import { joursEssaiRestants } from '@/lib/acces/essai';
import { EnTete } from '@/components/EnTete';
import { BanniereEssai } from '@/components/BanniereEssai';

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const supabase = await creerClientServeur();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');
  const { data: profil } = await supabase.from('profil')
    .select('nom, role, onboarding_termine, inscrit_le').eq('id', user.id).single();
  if (!profil?.onboarding_termine) redirect('/bienvenue');
  const eleve = profil.role === 'eleve';
  return (
    <>
      <EnTete prenom={profil.nom} />
      {eleve && <BanniereEssai joursRestants={joursEssaiRestants(new Date(profil.inscrit_le), new Date())} />}
      <main className="conteneur">{children}</main>
    </>
  );
}
