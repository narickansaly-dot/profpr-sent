import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerAdmin } from '@/lib/admin/garde';
import { lireChapitreAdmin, lireCoursAdmin, lireNotionsChapitre } from '@/lib/admin/requetes';
import { couleurCoursAcceptable } from '@/lib/contenu/couleur';
import { FormulaireQuestion } from '@/components/admin/FormulaireQuestion';

export const metadata = { title: 'Nouvelle question' };

export default async function PageNouvelleQuestion({ params }: { params: Promise<{ id: string }> }) {
  await exigerAdmin();
  const { id } = await params;
  const ch = await lireChapitreAdmin(id);
  if (!ch) notFound();
  const [cours, notions] = await Promise.all([lireCoursAdmin(ch.cours_id), lireNotionsChapitre(id)]);
  if (!cours) notFound();
  const retour = `/admin/chapitres/${id}/questions`;
  return (
    <div className="page-admin">
      <p className="fil"><Link href={retour}>← Retour aux questions du chapitre {ch.numero}</Link></p>
      <h1>Nouvelle question</h1>
      <p className="aide-champ">Elle sera créée en brouillon : tu pourras ensuite l’envoyer en relecture puis la valider.</p>
      <section className="carte" aria-labelledby="titre-form-question">
        <h2 id="titre-form-question" className="sr-only">Contenu de la question</h2>
        <FormulaireQuestion chapitreId={id} utilisee={false} couleur={couleurCoursAcceptable(cours.couleur) ? cours.couleur : '#2563eb'}
          notions={notions} annulerHref={retour} initial={{
            type: 'qcm_unique', enonce: '', propositions: [1, 2, 3, 4].map(() => ({ texte: '', bonne: false })), vraiFaux: '',
            acceptees: '', marge: '', margeRelative: false, notion: '', difficulte: '2', explication: '',
          }} />
      </section>
    </div>
  );
}
