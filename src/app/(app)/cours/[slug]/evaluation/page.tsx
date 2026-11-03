import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lireCours } from '@/lib/contenu/requetes';
import { progressionDuCours } from '@/lib/quiz/requetes';
import { EVALUATION, SEUIL_REUSSITE } from '@/lib/quiz/regles';
import { formaterNote } from '@/lib/quiz/reponse';
import { CarteEvaluation } from '@/components/CarteEvaluation';
import { FormulaireEvaluation } from '@/components/FormulaireEvaluation';

export const metadata = { title: 'Évaluation du cours' };
const dateCourte = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

export default async function PageEvaluation({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cours = await lireCours(slug);
  if (!cours || cours.chapitre.length === 0) notFound();
  let p: Awaited<ReturnType<typeof progressionDuCours>> | null = null;
  try {
    p = await progressionDuCours(cours.id, cours.chapitre.map((c) => c.id));
  } catch {
    p = null;
  }
  const meilleure = p?.cours?.meilleure_note != null ? Number(p.cours.meilleure_note) : null;
  const essaisTermines = p ? p.essais.filter((e) => e.statut !== 'en_cours') : [];
  return (
    <div style={{ '--couleur-cours': cours.couleur } as React.CSSProperties}>
      <Link href={`/cours/${cours.slug}`}>← {cours.titre}</Link>
      <h1>Évaluation : {cours.titre}</h1>
      <div className="carte">
        <h2>Comment ça marche</h2>
        <ul>
          <li>{EVALUATION.nbQuestions} questions tirées dans tous les chapitres.</li>
          <li>{EVALUATION.dureeMinutes} minutes. Le chrono continue même si tu fermes la page : tes réponses sont enregistrées au fur et à mesure.</li>
          <li>Il faut {SEUIL_REUSSITE} % pour réussir. Tu as {EVALUATION.essais} essais, avec {EVALUATION.delaiHeures} heures entre deux essais. On garde ta meilleure note.</li>
        </ul>
        {p?.evaluation.etat === 'disponible' && <FormulaireEvaluation coursId={cours.id} />}
      </div>
      {!p && <p className="vide">Impossible de charger ton évaluation pour le moment. Réessaie dans un instant.</p>}
      {p && p.evaluation.etat !== 'disponible' && <CarteEvaluation coursSlug={cours.slug} etat={p.evaluation} meilleureNote={meilleure} />}
      {essaisTermines.length > 0 && (
        <section>
          <h2>Tes essais</h2>
          <ul className="liste-essais">
            {essaisTermines.map((e) => (
              <li key={e.id}>
                <Link href={`/tentative/${e.id}/resultat`}>
                  {e.fin ? dateCourte.format(new Date(e.fin)) : ''} : {formaterNote(Number(e.note ?? 0))}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
