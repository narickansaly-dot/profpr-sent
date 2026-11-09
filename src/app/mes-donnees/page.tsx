import Link from 'next/link';
import { redirect } from 'next/navigation';
import { lireProfil, lireUtilisateur } from '@/lib/supabase/utilisateur';
import { formaterDateSuppression } from '@/lib/donnees/suppression';
import { BoutonDeconnexion } from '@/components/BoutonDeconnexion';
import { SuppressionCompte } from '@/components/donnees/SuppressionCompte';

export const metadata = { title: 'Mes données' };

// Hors du groupe (app) : le layout de ce groupe redirige un élève sans accord parental vers /consentement,
// et cette page doit rester accessible (export et suppression sont un droit, pas une fonctionnalité du cours).
export default async function PageMesDonnees() {
  if (!(await lireUtilisateur())) redirect('/connexion');
  const profil = await lireProfil();
  if (!profil?.onboarding_termine) redirect('/bienvenue');
  return (
    <>
      <header className="en-tete">
        <Link href="/" className="logo">App lycée</Link>
        <BoutonDeconnexion prenom={profil.nom} />
      </header>
      <main className="conteneur">
        <h1>Mes données</h1>
        <section aria-labelledby="titre-export">
          <h2 id="titre-export">Télécharger mes données</h2>
          <p>Un fichier JSON avec tout ce que l’application garde sur toi.</p>
          <a className="bouton bouton-principal" href="/mes-donnees/export" download>Télécharger mes données</a>
        </section>
        <section aria-labelledby="titre-suppression">
          <h2 id="titre-suppression">Supprimer mon compte</h2>
          <SuppressionCompte enseignant={profil.role === 'enseignant'} dateSuppression={profil.suppression_demandee_le ? formaterDateSuppression(profil.suppression_demandee_le) : null} />
        </section>
        <p><Link href="/">Retour à l’accueil</Link></p>
      </main>
    </>
  );
}
