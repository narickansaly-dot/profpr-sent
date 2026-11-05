import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerAdmin } from '@/lib/admin/garde';
import { lireCoursAdmin } from '@/lib/admin/requetes';
import { EditeurChapitre } from '@/components/admin/EditeurChapitre';

export const metadata = { title: 'Nouveau chapitre' };

export default async function PageNouveauChapitre({ params }: { params: Promise<{ id: string }> }) {
  await exigerAdmin();
  const { id } = await params;
  const cours = await lireCoursAdmin(id);
  if (!cours) notFound();
  const suivant = Math.min(99, Math.max(0, ...cours.chapitre.map((c) => c.numero)) + 1);
  return (
    <div className="page-admin">
      <p className="fil"><Link href="/admin">← Retour au suivi du contenu</Link></p>
      <h1>Nouveau chapitre — {cours.titre}</h1>
      <section className="carte" aria-labelledby="titre-editeur">
        <h2 id="titre-editeur" className="sr-only">Contenu du chapitre</h2>
        <EditeurChapitre coursId={cours.id} coursSlug={cours.slug} couleur={cours.couleur} initial={{
          slug: '', numero: String(suivant), titre: '', titre_court: '', duree: '', resume: '', chapeau: '', objectifs: '',
          sections: [{ id: 'introduction', titre: 'Introduction', html: '<p>…</p>' }], a_retenir: '',
        }} />
      </section>
    </div>
  );
}
