import Link from 'next/link';
import { exigerAdmin } from '@/lib/admin/garde';
import { creerClientServeur } from '@/lib/supabase/server';
import { NIVEAUX } from '@/lib/profil/onboarding';
import { FormulaireCours } from '@/components/admin/FormulaireCours';

export const metadata = { title: 'Nouveau cours' };

export default async function PageNouveauCours() {
  await exigerAdmin();
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.from('filiere').select('code, nom').order('ordre');
  if (error) throw new Error('Impossible de charger les filières.');
  return (
    <div className="page-admin">
      <p className="fil"><Link href="/admin" className="lien-action">← Retour au suivi du contenu</Link></p>
      <h1>Nouveau cours</h1>
      <section className="carte" aria-labelledby="titre-formulaire">
        <h2 id="titre-formulaire" className="sr-only">Informations du cours</h2>
        <FormulaireCours filieres={data ?? []} niveaux={NIVEAUX} />
      </section>
    </div>
  );
}
