import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerAdmin } from '@/lib/admin/garde';
import { lireCoursAdmin } from '@/lib/admin/requetes';
import { creerClientServeur } from '@/lib/supabase/server';
import { NIVEAUX } from '@/lib/profil/onboarding';
import { FormulaireCours } from '@/components/admin/FormulaireCours';

export const metadata = { title: 'Modifier le cours' };

export default async function PageModifierCours({ params }: { params: Promise<{ id: string }> }) {
  await exigerAdmin();
  const { id } = await params;
  const cours = await lireCoursAdmin(id);
  if (!cours) notFound();
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.from('filiere').select('id, code, nom').order('ordre');
  if (error) throw new Error('Impossible de charger les filières.');
  const filieres = data ?? [];
  const initial = {
    slug: cours.slug, filiere: filieres.find((f) => f.id === cours.filiere_id)?.code ?? '', niveau: cours.niveau_code ?? '',
    matiere: cours.matiere, titre: cours.titre, couleur: cours.couleur, ordre: String(cours.ordre),
  };
  return (
    <div className="page-admin">
      <p className="fil"><Link href="/admin" className="lien-action">← Retour au suivi du contenu</Link></p>
      <h1>Modifier le cours</h1>
      <section className="carte" aria-labelledby="titre-formulaire">
        <h2 id="titre-formulaire" className="sr-only">Informations du cours</h2>
        <FormulaireCours coursId={cours.id} initial={initial} filieres={filieres} niveaux={NIVEAUX} />
      </section>
      <p><Link href={`/admin/cours/${cours.id}/chapitres/nouveau`} className="bouton bouton-secondaire">Nouveau chapitre</Link></p>
    </div>
  );
}
