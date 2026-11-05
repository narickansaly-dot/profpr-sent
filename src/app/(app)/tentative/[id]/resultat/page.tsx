import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { lireCorrection, lireStatutTentative } from '@/lib/quiz/requetes';
import { LONGUEURS_QUIZ, SEUIL_REUSSITE } from '@/lib/quiz/regles';
import { messageErreur } from '@/lib/erreurs';
import { formaterNote } from '@/lib/quiz/reponse';
import { ListeCorrection } from '@/components/ListeCorrection';
import { lireProfil } from '@/lib/supabase/utilisateur';
import { FormulaireQuiz } from '@/components/FormulaireQuiz';

export const metadata = { title: 'Résultat' };

export default async function PageResultat({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const correction = await lireCorrection(id);
  if (!correction) {
    // Repli : on lit le statut directement, lireTentative refuse les tentatives terminées.
    const t = await lireStatutTentative(id);
    if (!t) notFound();
    if (t.statut === 'en_cours') redirect(`/tentative/${id}`);
    const lienCours = t.cours ? `/cours/${t.cours.slug}` : '/';
    return (
      <div style={{ '--couleur-cours': t.cours?.couleur } as React.CSSProperties}>
        <section className="carte">
          {t.evaluationOuverte ? (
            <>
              <h1>Correction indisponible</h1>
              <p>{messageErreur('evaluation_en_cours')}</p>
            </>
          ) : (
            <p>La correction n’a pas pu se charger. Recharge la page dans un instant.</p>
          )}
          <Link className="bouton bouton-secondaire" href={lienCours}>Retour au cours</Link>
        </section>
      </div>
    );
  }
  const profil = await lireProfil();
  const note = Number(correction.note ?? 0);
  const reussi = correction.reussie ?? note >= SEUIL_REUSSITE;
  const evaluation = correction.type === 'evaluation_cours';
  const justes = correction.lignes.filter((l) => l.correcte).length;
  return (
    <div style={{ '--couleur-cours': correction.cours?.couleur } as React.CSSProperties}>
      <section className={`carte resultat ${reussi ? 'reussi' : 'rate'}`}>
        <p className="pastille">{evaluation ? `Évaluation · ${correction.cours?.titre}` : `Quiz · ${correction.chapitre?.titre}`}</p>
        <h1>{reussi ? <>{evaluation ? 'Évaluation réussie' : 'Quiz réussi'} <span aria-hidden="true">🎉</span></> : 'Pas encore…'}</h1>
        <p className="resultat-note">{formaterNote(note)}</p>
        <p>{justes} bonne{justes > 1 ? 's' : ''} réponse{justes > 1 ? 's' : ''} sur {correction.lignes.length}.
          {correction.statut === 'expiree' && ' Le temps était écoulé : tes réponses déjà données ont été corrigées.'}
          {!reussi && ` Il faut ${SEUIL_REUSSITE} % pour valider.`}</p>
        <div className="resultat-actions">
          {!evaluation && correction.chapitre && (
            <FormulaireQuiz chapitreId={correction.chapitre.id} longueurs={[LONGUEURS_QUIZ[0]]}
              libelle={reussi ? 'Refaire un quiz' : 'Retenter avec de nouvelles questions'} />
          )}
          <Link className="bouton bouton-secondaire" href={correction.cours ? `/cours/${correction.cours.slug}` : '/'}>Retour au cours</Link>
        </div>
      </section>
      <h2>Correction</h2>
      <ListeCorrection lignes={correction.lignes} peutSignaler={profil?.role === 'enseignant'} />
    </div>
  );
}
