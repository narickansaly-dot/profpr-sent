import { redirect } from 'next/navigation';
import { lireProfil } from '@/lib/supabase/utilisateur';
import { creerClientServeur } from '@/lib/supabase/server';
import { lireEnfants, lireProgressionEnfant } from '@/lib/parent/requetes';
import { resumeDepuisResultat } from '@/lib/parent/format';
import { CarteEnfant } from '@/components/parent/CarteEnfant';
import { FormulaireCodeParent } from '@/components/parent/FormulaireCodeParent';

export const metadata = { title: 'Mes enfants' };

export default async function PageParent() {
  const profil = await lireProfil();
  if (profil?.role !== 'parent') redirect('/');
  // Relie les enfants dont l'adresse a reçu la demande d'accord : idempotent, le nombre renvoyé est ignoré.
  const supabase = await creerClientServeur();
  await supabase.rpc('lier_par_email');
  const enfants = await lireEnfants();
  // Une lecture en échec n'abat que la carte concernée, pas la page.
  const resumes = (await Promise.allSettled(enfants.map((e) => lireProgressionEnfant(e.eleveId)))).map(resumeDepuisResultat);
  return (
    <div className="page-parent">
      <h1>Mes enfants</h1>
      {enfants.length === 0 ? (
        <p className="vide">Aucun enfant n’est relié à votre compte pour l’instant.</p>
      ) : (
        <ul className="liste-enfants">
          {enfants.map((e, i) => <CarteEnfant key={e.eleveId} enfant={e} resume={resumes[i]} />)}
        </ul>
      )}
      <section className="carte" aria-label="Relier un enfant">
        <FormulaireCodeParent />
        <p className="aide-champ">Votre enfant a moins de 15 ans&nbsp;? Il est relié automatiquement si vous avez créé ce compte avec l’adresse qui a reçu la demande d’accord.</p>
      </section>
    </div>
  );
}
