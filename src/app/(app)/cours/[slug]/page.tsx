import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lireCours } from '@/lib/contenu/requetes';
import { progressionDuCours } from '@/lib/quiz/requetes';
import { formaterNote } from '@/lib/quiz/reponse';
import { BarreProgression } from '@/components/BarreProgression';
import { CarteEvaluation } from '@/components/CarteEvaluation';

export default async function PageCours({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cours = await lireCours(slug);
  if (!cours) notFound();
  let progression: Awaited<ReturnType<typeof progressionDuCours>> | null = null;
  let erreurProgression = false;
  if (cours.chapitre.length > 0) {
    // La liste des chapitres reste affichée même si la progression ne se charge pas.
    try {
      progression = await progressionDuCours(cours.id, cours.chapitre.map((c) => c.id));
    } catch {
      erreurProgression = true;
    }
  }
  return (
    <div style={{ '--couleur-cours': cours.couleur } as React.CSSProperties}>
      <p className="pastille">{cours.matiere}</p>
      <h1>{cours.titre}</h1>
      {cours.chapitre.length === 0 ? (
        <p className="carte">Ton essai est terminé : ce cours n’est plus accessible pour le moment.</p>
      ) : (
        <>
        {erreurProgression && <p className="vide">Ta progression n’a pas pu être chargée. Recharge la page dans un instant.</p>}
        {progression && (
          <div className="progression-cours">
            <p>{progression.nbValides} / {cours.chapitre.length} chapitres validés</p>
            <BarreProgression valeur={progression.nbValides} max={cours.chapitre.length} libelle="Chapitres validés" />
          </div>
        )}
        <ol className="liste-chapitres">
          {cours.chapitre.map((ch) => (
            <li key={ch.slug}>
              <Link href={`/cours/${cours.slug}/${ch.slug}`} className="carte">
                <span className="numero-chapitre">{ch.numero}</span>
                <span>
                  <strong>{ch.titre}</strong><br /><small>{ch.resume}</small>
                  {(() => {
                    const p = progression?.parChapitre.get(ch.id);
                    if (p?.valide) return <><br /><span className="badge-valide">Validé</span></>;
                    if (p?.meilleure_note != null) return <><br /><span className="badge-note">{formaterNote(Number(p.meilleure_note))}</span></>;
                    return null;
                  })()}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        {progression && (
          <CarteEvaluation coursSlug={cours.slug} etat={progression.evaluation}
            meilleureNote={progression.cours?.meilleure_note != null ? Number(progression.cours.meilleure_note) : null} />
        )}
        </>
      )}
    </div>
  );
}
