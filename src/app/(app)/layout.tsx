import { redirect } from 'next/navigation';
import { lireProfil, lireUtilisateur } from '@/lib/supabase/utilisateur';
import { joursEssaiRestants } from '@/lib/acces/essai';
import { EnTete } from '@/components/EnTete';
import { BanniereEssai } from '@/components/BanniereEssai';

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  if (!(await lireUtilisateur())) redirect('/connexion');
  const profil = await lireProfil();
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
