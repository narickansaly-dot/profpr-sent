import Link from 'next/link';
import { redirect } from 'next/navigation';
import { lireProfil, lireUtilisateur } from '@/lib/supabase/utilisateur';
import { lireMonAcces } from '@/lib/acces/requetes';
import { BoutonDeconnexion } from '@/components/BoutonDeconnexion';
import { FormulaireDemandeConsentement } from '@/components/consentement/FormulaireDemandeConsentement';

export const metadata = { title: 'Accord d’un parent' };

const formatDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Paris' });
const formatJour = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' });

// Hors du groupe (app) : le layout de ce groupe redirige vers cette page, elle ne doit donc pas en dépendre.
export default async function PageConsentement() {
  if (!(await lireUtilisateur())) redirect('/connexion');
  const profil = await lireProfil();
  if (!profil?.onboarding_termine) redirect('/bienvenue');
  const acces = profil.role === 'eleve' ? await lireMonAcces() : null;
  if (!acces?.consentementRequis) redirect('/');
  if (acces.consentementRetireLe) {
    return (
      <>
        <header className="en-tete">
          <Link href="/" className="logo">App lycée</Link>
          <BoutonDeconnexion prenom={profil.nom} />
        </header>
        <main className="page-auth">
          <h1>Ton parent a retiré son accord</h1>
          <p>
            Ton compte est bloqué{acces.suppressionPrevueLe ? ` et sera supprimé le ${formatJour.format(new Date(acces.suppressionPrevueLe))}` : ''}.
            Tu peux encore télécharger tes données.
          </p>
          <p><Link href="/mes-donnees">Mes données</Link></p>
        </main>
      </>
    );
  }
  return (
    <>
      <header className="en-tete">
        <Link href="/" className="logo">App lycée</Link>
        <BoutonDeconnexion prenom={profil.nom} />
      </header>
      <main className="page-auth">
        <h1>Il nous faut l’accord d’un parent</h1>
        <p>
          Comme tu as moins de 15 ans, un parent ou ton représentant légal doit accepter que tu utilises App lycée.
          Indique son adresse e-mail&nbsp;: nous lui envoyons un lien.
        </p>
        {acces.emailParent && acces.consentementEnvoyeLe && (
          <p>
            Dernière demande pour {acces.emailParent} le {formatDate.format(new Date(acces.consentementEnvoyeLe))}.
            Le lien est valable 7 jours.
          </p>
        )}
        <FormulaireDemandeConsentement emailConnu={acces.emailParent} />
        <p>
          <Link href="/confidentialite">Politique de confidentialité</Link> · <Link href="/mes-donnees">Mes données</Link>
        </p>
      </main>
    </>
  );
}
