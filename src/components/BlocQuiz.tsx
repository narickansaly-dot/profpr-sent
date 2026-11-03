import Link from 'next/link';
import { infosQuizChapitre } from '@/lib/quiz/requetes';
import { LONGUEURS_QUIZ, MIN_QUESTIONS_QUIZ, SEUIL_REUSSITE } from '@/lib/quiz/regles';
import { formaterNote } from '@/lib/quiz/reponse';
import { FormulaireQuiz } from './FormulaireQuiz';

export async function BlocQuiz({ chapitreId }: { chapitreId: string }) {
  const { disponibles, progression, tentativeEnCours } = await infosQuizChapitre(chapitreId);
  // Un quiz de 30 sur un chapitre de 20 questions donnerait 20 : on ne propose que les longueurs atteignables.
  const longueurs = LONGUEURS_QUIZ.filter((n) => n <= disponibles);
  return (
    <section id="quiz" className="carte bloc-quiz" aria-labelledby="titre-quiz">
      <h2 id="titre-quiz">Quiz du chapitre</h2>
      {progression?.valide && <p className="badge-valide">Chapitre validé</p>}
      {progression?.meilleure_note != null && (
        <p>Ta meilleure note : <strong>{formaterNote(Number(progression.meilleure_note))}</strong></p>
      )}
      {tentativeEnCours ? (
        <>
          <p>Tu as un quiz en cours sur ce chapitre.</p>
          <Link className="bouton bouton-principal" href={`/tentative/${tentativeEnCours}`}>Reprendre ton quiz</Link>
        </>
      ) : disponibles < MIN_QUESTIONS_QUIZ ? (
        <p>Ce quiz arrive bientôt : il faut au moins {MIN_QUESTIONS_QUIZ} questions.</p>
      ) : (
        <>
          <p>Questions tirées au hasard parmi {disponibles}. Il faut {SEUIL_REUSSITE} % pour valider le chapitre.</p>
          <FormulaireQuiz chapitreId={chapitreId} longueurs={[...longueurs]} />
        </>
      )}
    </section>
  );
}
