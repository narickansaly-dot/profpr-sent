import { redirect } from 'next/navigation';
import { lireProfil, lireUtilisateur } from '@/lib/supabase/utilisateur';
import { lireMonAcces } from '@/lib/acces/requetes';
import { listerCoursDuProfil } from '@/lib/contenu/requetes';
import { compterRappelsNonLus } from '@/lib/notifications/requetes';
import { EnTete } from '@/components/EnTete';
import { BanniereEssai } from '@/components/BanniereEssai';
import { IndicateurConnexion } from '@/components/IndicateurConnexion';
import { AttenteValidation } from '@/components/AttenteValidation';

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  if (!(await lireUtilisateur())) redirect('/connexion');
  const profil = await lireProfil();
  if (!profil?.onboarding_termine) redirect('/bienvenue');
  if (profil.role === 'eleve' && profil.demande_enseignant) {
    return (
      <>
        <EnTete prenom={profil.nom} role="attente" />
        <IndicateurConnexion />
        <main className="conteneur"><AttenteValidation prenom={profil.nom} /></main>
      </>
    );
  }
  const eleve = profil.role === 'eleve';
  const acces = eleve ? await lireMonAcces() : null;
  // La base reste la barrière ; cette redirection évite seulement une page vide.
  if (acces?.consentementRequis) redirect('/consentement');
  const titreCoursGratuit = acces?.coursGratuitId
    ? (await listerCoursDuProfil()).find((c) => c.id === acces.coursGratuitId)?.titre ?? null
    : null;
  const rappelsNonLus = eleve ? await compterRappelsNonLus() : 0;
  return (
    <>
      <EnTete prenom={profil.nom} role={profil.role} rappelsNonLus={rappelsNonLus} />
      <IndicateurConnexion />
      {acces && <BanniereEssai acces={acces} titreCoursGratuit={titreCoursGratuit} />}
      <main className="conteneur">{children}</main>
    </>
  );
}
