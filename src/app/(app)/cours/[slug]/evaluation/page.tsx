import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lireCours } from '@/lib/contenu/requetes';
import { progressionDuCours } from '@/lib/quiz/requetes';
import { EVALUATION, SEUIL_REUSSITE } from '@/lib/quiz/regles';
import { formaterNote } from '@/lib/quiz/reponse';
import { formaterEcheance } from '@/lib/quiz/temps';
import { CarteEvaluation } from '@/components/CarteEvaluation';
import { FormulaireEvaluation } from '@/components/FormulaireEvaluation';

export const metadata = { title: 'Évaluation du cours' };
const dateCourte = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

function libelleEcheance(e: { ouverture: string | null; limite: string | null }): string {
  const ouverture = e.ouverture ? formaterEcheance(new Date(e.ouverture)) : null;
  const limite = e.limite ? formaterEcheance(new Date(e.limite)) : null;
  if (ouverture && limite) return `du ${ouverture} au ${limite}`;
  if (limite) return `avant le ${limite}`;
  if (ouverture) return `à partir du ${ouverture}, sans date limite`;
  return 'sans date limite';
}

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
        <ul className="regles">
          <li>{EVALUATION.nbQuestions} questions tirées dans tous les chapitres.</li>
          <li>{EVALUATION.dureeMinutes} minutes. Le chrono continue même si tu fermes la page : tes réponses sont enregistrées au fur et à mesure.</li>
          <li>Il faut {SEUIL_REUSSITE} % pour réussir. Tu as {EVALUATION.essais} essais, avec {EVALUATION.delaiHeures} heures entre deux essais. On garde ta meilleure note.</li>
        </ul>
        {p && p.echeances.length > 0 && (
          <>
            <h3 className="titre-echeances">Date{p.echeances.length > 1 ? 's' : ''} de ta classe</h3>
            <ul className="regles liste-echeances">
              {p.echeances.map((e, i) => <li key={`${e.classe_nom}-${i}`}>{e.classe_nom} : {libelleEcheance(e)}.</li>)}
            </ul>
          </>
        )}
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
                  {e.fin ? dateCourte.format(new Date(e.fin)) : '—'} — note : {e.note != null ? formaterNote(Number(e.note)) : '—'}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
