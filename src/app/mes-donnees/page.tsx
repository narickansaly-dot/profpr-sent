import Link from 'next/link';
import { redirect } from 'next/navigation';
import { creerClientServeur } from '@/lib/supabase/server';
import { lireProfil, lireUtilisateur } from '@/lib/supabase/utilisateur';
import { formaterDateSuppression } from '@/lib/donnees/suppression';
import { BoutonDeconnexion } from '@/components/BoutonDeconnexion';
import { lireEnfants } from '@/lib/parent/requetes';
import { sectionParents } from '@/lib/donnees/parents';
import { ParentsRelies, type ParentRelie } from '@/components/donnees/ParentsRelies';
import { SuppressionCompte } from '@/components/donnees/SuppressionCompte';

export const metadata = { title: 'Mes données' };

const formatJour = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' });

// Hors du groupe (app) : le layout de ce groupe redirige un élève sans accord parental vers /consentement,
// et cette page doit rester accessible (export et suppression sont un droit, pas une fonctionnalité du cours).
export default async function PageMesDonnees() {
  if (!(await lireUtilisateur())) redirect('/connexion');
  const profil = await lireProfil();
  if (!profil?.onboarding_termine) redirect('/bienvenue');
  const section = sectionParents(profil.role, profil.moins_de_15_ans);
  let parents: ParentRelie[] = [];
  if (section === 'eleve_15_ans' || section === 'eleve_moins_15_ans') {
    const supabase = await creerClientServeur();
    const { data } = await supabase.rpc('parents_de_l_eleve');
    parents = (data ?? []).map((p) => ({ id: p.parent_id, nom: p.nom?.trim() || 'Parent', lieLe: formatJour.format(new Date(p.lie_le)) }));
  }
  const parent = profil.role === 'parent';
  const enfants = section === 'enfants_suivis' ? await lireEnfants() : [];
  return (
    <>
      <header className="en-tete">
        <Link href="/" className="logo">App lycée</Link>
        <BoutonDeconnexion prenom={profil.nom} />
      </header>
      <main id="contenu" tabIndex={-1} className="conteneur">
        <h1>Mes données</h1>
        <section aria-labelledby="titre-export">
          <h2 id="titre-export">Télécharger mes données</h2>
          <p>Un fichier JSON avec tout ce que l’application garde sur {parent ? 'vous' : 'toi'}.</p>
          <a className="bouton bouton-principal" href="/mes-donnees/export" download>Télécharger mes données</a>
        </section>
        {(section === 'eleve_15_ans' || section === 'eleve_moins_15_ans') && (
          <section aria-labelledby="titre-parents">
            <h2 id="titre-parents">Parents reliés</h2>
            <ParentsRelies parents={parents} peutGerer={section === 'eleve_15_ans'} />
          </section>
        )}
        {section === 'enfants_suivis' && (
          <section aria-labelledby="titre-enfants">
            <h2 id="titre-enfants">Enfants suivis</h2>
            {enfants.length === 0 ? <p>Aucun enfant n’est relié à votre compte.</p> : (
              <ul>{enfants.map((e) => <li key={e.eleveId}>{e.nom}</li>)}</ul>
            )}
            <p><Link href="/parent" className="lien-action">Suivre la progression de vos enfants</Link></p>
          </section>
        )}
        <section aria-labelledby="titre-suppression">
          <h2 id="titre-suppression">Supprimer mon compte</h2>
          <SuppressionCompte parent={parent} imposee={profil.suppression_imposee} enseignant={profil.role === 'enseignant'} dateSuppression={profil.suppression_demandee_le ? formaterDateSuppression(profil.suppression_demandee_le) : null} />
        </section>
        <p><Link href="/" className="lien-action">Retour à l’accueil</Link></p>
      </main>
    </>
  );
}
