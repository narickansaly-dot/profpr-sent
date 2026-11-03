'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { enregistrerReponse, terminerTentative } from '@/app/(app)/tentative/actions';
import { estRepondue, type ReponseAffichee } from '@/lib/quiz/reponse';
import type { QuestionAffichee } from '@/lib/quiz/requetes';
import { BarreProgression } from './BarreProgression';
import { ChampReponse } from './ChampReponse';
import { CompteARebours } from './CompteARebours';

type Props = { tentativeId: string; questions: QuestionAffichee[]; dateLimite: string | null; serveurMaintenant: number };
type Sauvegarde = 'ok' | 'en_cours' | 'erreur';
const LIBELLES: Record<Sauvegarde, string> = { ok: 'Réponses enregistrées', en_cours: 'Enregistrement…', erreur: 'Non enregistré : vérifie ta connexion' };

export function LecteurTentative({ tentativeId, questions, dateLimite, serveurMaintenant }: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(() => Math.max(0, questions.findIndex((q) => !estRepondue(q.reponse))));
  const [reponses, setReponses] = useState<Record<string, ReponseAffichee | null>>(
    () => Object.fromEntries(questions.map((q) => [q.question_id, q.reponse])),
  );
  const [sauvegarde, setSauvegarde] = useState<Sauvegarde>('ok');
  const [enFin, demarrerFin] = useTransition();
  // Enregistrements en vol : la fin du quiz les attend pour ne perdre aucune réponse.
  const enVol = useRef(new Set<Promise<void>>());
  const question = questions[index];
  const nbRepondues = questions.filter((q) => estRepondue(reponses[q.question_id])).length;

  function sauver(questionId: string, reponse: ReponseAffichee | null): Promise<void> {
    const promesse = envoyer(questionId, reponse).finally(() => enVol.current.delete(promesse));
    enVol.current.add(promesse);
    return promesse;
  }

  async function envoyer(questionId: string, reponse: ReponseAffichee | null) {
    setSauvegarde('en_cours');
    for (let essai = 0; essai < 3; essai++) {
      const r = await enregistrerReponse(tentativeId, questionId, reponse);
      if ('statut' in r) {
        if (r.statut !== 'ok') router.replace(`/tentative/${tentativeId}/resultat`);
        else setSauvegarde('ok');
        return;
      }
      await new Promise((ok) => setTimeout(ok, 800 * (essai + 1)));
    }
    setSauvegarde('erreur');
  }

  function changer(reponse: ReponseAffichee | null, enregistrerTout: boolean) {
    setReponses((r) => ({ ...r, [question.question_id]: reponse }));
    if (enregistrerTout) void sauver(question.question_id, reponse);
  }

  async function enregistrerTexteEnCours() {
    if (question.type === 'reponse_courte') await sauver(question.question_id, reponses[question.question_id] ?? null);
  }

  function aller(cible: number) {
    void enregistrerTexteEnCours();
    setIndex(cible);
  }

  function terminer(demanderConfirmation: boolean) {
    const manquantes = questions.length - nbRepondues;
    if (demanderConfirmation && manquantes > 0
      && !window.confirm(`Il te reste ${manquantes} question${manquantes > 1 ? 's' : ''} sans réponse. Terminer quand même ?`)) return;
    demarrerFin(async () => {
      await enregistrerTexteEnCours();
      await Promise.all([...enVol.current]);
      await terminerTentative(tentativeId);
    });
  }

  const derniere = index === questions.length - 1;
  return (
    <div className="lecteur">
      <div className="lecteur-barre">
        <span className="lecteur-position">Question {index + 1} / {questions.length}</span>
        {dateLimite && <CompteARebours dateLimite={dateLimite} serveurMaintenant={serveurMaintenant} onFin={() => terminer(false)} />}
        <span className={`sauvegarde sauvegarde-${sauvegarde}`} role="status">{LIBELLES[sauvegarde]}</span>
      </div>
      <BarreProgression valeur={nbRepondues} max={questions.length} libelle="Questions répondues" />

      <fieldset className="carte question" key={question.question_id}>
        <legend className="question-enonce">{question.enonce}</legend>
        <ChampReponse questionId={question.question_id} type={question.type} propositions={question.propositions}
          reponse={reponses[question.question_id] ?? null} onChange={changer} />
      </fieldset>

      <div className="lecteur-navigation">
        <button type="button" className="bouton bouton-secondaire" disabled={index === 0 || enFin} onClick={() => aller(index - 1)}>← Précédente</button>
        {derniere
          ? <button type="button" className="bouton bouton-principal" disabled={enFin} onClick={() => terminer(true)}>{enFin ? 'Correction…' : 'Terminer'}</button>
          : <button type="button" className="bouton bouton-principal" disabled={enFin} onClick={() => aller(index + 1)}>Suivante →</button>}
      </div>

      <nav aria-label="Aller à une question">
        <ol className="pastilles-questions">
          {questions.map((q, i) => {
            const repondue = estRepondue(reponses[q.question_id]);
            return (
              <li key={q.question_id}>
                <button type="button" className={repondue ? 'repondue' : undefined} aria-current={i === index ? 'step' : undefined}
                  aria-label={`Question ${i + 1}${repondue ? ', répondue' : ''}`} onClick={() => aller(i)}>{i + 1}</button>
              </li>
            );
          })}
        </ol>
      </nav>
      {!derniere && <button type="button" className="bouton bouton-secondaire" disabled={enFin} onClick={() => terminer(true)}>Terminer maintenant</button>}
    </div>
  );
}
