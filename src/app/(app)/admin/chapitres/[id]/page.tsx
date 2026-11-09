import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerAdmin } from '@/lib/admin/garde';
import { lireChapitreAdmin, lireCoursAdmin } from '@/lib/admin/requetes';
import { EditeurChapitre } from '@/components/admin/EditeurChapitre';
import { MessageStatut } from '@/components/admin/MessageStatut';
import { BoutonPublier } from '@/components/admin/BoutonPublier';

export const metadata = { title: 'Modifier le chapitre' };

type Section = { id: string; titre: string; html: string };

export default async function PageModifierChapitre({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ enregistre?: string }> }) {
  await exigerAdmin();
  const { id } = await params;
  const { enregistre } = await searchParams;
  const ch = await lireChapitreAdmin(id);
  if (!ch) notFound();
  const cours = await lireCoursAdmin(ch.cours_id);
  if (!cours) notFound();
  const sections = (Array.isArray(ch.sections) ? ch.sections : []) as Section[];
  const titre = `Ch. ${ch.numero} — ${ch.titre}`;
  return (
    <div className="page-admin">
      <p className="fil"><Link href="/admin" className="lien-action">← Retour au suivi du contenu</Link></p>
      <div className="entete-bloc">
        <h1>Modifier le chapitre</h1>
        <div className="actions-bloc">
          <span className={`statut ${ch.publie ? 'statut-publie' : 'statut-brouillon'}`}>{ch.publie ? 'Publié' : 'Brouillon'}</span>
          <BoutonPublier type="chapitre" id={ch.id} publie={ch.publie} nom={titre} />
          <Link href={`/cours/${cours.slug}/${ch.slug}`} className="bouton bouton-secondaire">Voir la page élève</Link>
        </div>
      </div>
      <MessageStatut texte={enregistre === '1' ? 'Le chapitre est enregistré.' : ''} />
      <section className="carte" aria-labelledby="titre-editeur">
        <h2 id="titre-editeur" className="sr-only">Contenu du chapitre</h2>
        <EditeurChapitre key={ch.modifie_le} coursId={cours.id} coursSlug={cours.slug} couleur={cours.couleur} chapitreId={ch.id} initial={{
          slug: ch.slug, numero: String(ch.numero), titre: ch.titre, titre_court: ch.titre_court ?? '', duree: ch.duree ?? '',
          resume: ch.resume ?? '', chapeau: ch.chapeau ?? '', objectifs: ch.objectifs.join('\n'), sections, a_retenir: ch.a_retenir ?? '',
        }} />
      </section>
    </div>
  );
}
