import { redirect } from 'next/navigation';
import { lireProfil, lireUtilisateur } from '@/lib/supabase/utilisateur';
import { joursEssaiRestants } from '@/lib/acces/essai';
import { EnTete } from '@/components/EnTete';
import { BanniereEssai } from '@/components/BanniereEssai';
import { AttenteValidation } from '@/components/AttenteValidation';

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  if (!(await lireUtilisateur())) redirect('/connexion');
  const profil = await lireProfil();
  if (!profil?.onboarding_termine) redirect('/bienvenue');
  if (profil.role === 'eleve' && profil.demande_enseignant) {
    return (
      <>
        <EnTete prenom={profil.nom} role="attente" />
        <main className="conteneur"><AttenteValidation prenom={profil.nom} /></main>
      </>
    );
  }
  const eleve = profil.role === 'eleve';
  return (
    <>
      <EnTete prenom={profil.nom} role={profil.role} />
      {eleve && <BanniereEssai joursRestants={joursEssaiRestants(new Date(profil.inscrit_le), new Date())} />}
      <main className="conteneur">{children}</main>
    </>
  );
}
