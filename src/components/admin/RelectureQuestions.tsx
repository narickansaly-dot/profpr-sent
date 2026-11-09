'use client';

import { useActionState, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { changerStatutSelection, type EtatLot } from '@/app/(app)/admin/questions/actions';
import type { QuestionAdmin } from '@/lib/admin/requetes';
import { LIBELLE_DIFFICULTE, LIBELLE_TYPE } from '@/lib/admin/questions';

const ETAT_INITIAL: EtatLot = {};

function Corrige({ q }: { q: QuestionAdmin }) {
  if (q.type === 'vrai_faux') {
    return <p className="relecture-reponse">Réponse&nbsp;: {(q.bonnes_reponses as unknown as boolean[])[0] === true ? 'Vrai' : 'Faux'}</p>;
  }
  if (q.type === 'reponse_courte') {
    return (
      <p className="relecture-reponse">
        Réponses acceptées&nbsp;: {q.reponses_acceptees.join(' ; ')}
        {q.marge != null && <> (marge {q.marge}{q.marge_relative ? ' %' : ''})</>}
      </p>
    );
  }
  const bonnes = q.bonnes_reponses as unknown as number[];
  const propositions = q.propositions as unknown as string[];
  return (
    <ul className="relecture-propositions">
      {propositions.map((texte, i) => (
        <li key={i}>
          {texte}
          {bonnes.includes(i) && <strong className="relecture-bonne"> Bonne réponse</strong>}
        </li>
      ))}
    </ul>
  );
}

export function RelectureQuestions({ chapitreId, questions }: { chapitreId: string; questions: QuestionAdmin[] }) {
  const [etat, action, enCours] = useActionState(changerStatutSelection, ETAT_INITIAL);
  const [toutCoche, setToutCoche] = useState(false);
  const cases = (form: HTMLFormElement) => Array.from(form.querySelectorAll<HTMLInputElement>('input[name="ids"]'));
  const surChangement = (e: FormEvent<HTMLFormElement>) => {
    const c = cases(e.currentTarget);
    setToutCoche(c.length > 0 && c.every((x) => x.checked));
  };
  return (
    <form action={action} className="relecture" onChange={surChangement} aria-label="Relecture des questions">
      <input type="hidden" name="chapitre" value={chapitreId} />
      <p role="status" className="message-info">{etat.message ?? ''}</p>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      {questions.length === 0 ? (
        <p className="vide">Aucune question à relire dans ce chapitre.</p>
      ) : (
        <>
          <div className="actions-formulaire">
            <button type="button" className="bouton bouton-secondaire" disabled={enCours}
              onClick={(e) => {
                const c = cases(e.currentTarget.form!);
                const cocher = !c.every((x) => x.checked);
                c.forEach((x) => { x.checked = cocher; });
                setToutCoche(cocher);
              }}>
              {toutCoche ? 'Tout décocher' : 'Tout cocher'}
            </button>
          </div>
          <div className="relecture-liste">
            {questions.map((q, i) => (
              <article key={q.id} className="carte carte-relecture">
                <header className="carte-relecture-tete">
                  <label className="case-relecture">
                    <input type="checkbox" name="ids" value={q.id} />
                    <span className="sr-only">Sélectionner la question {i + 1}</span>
                    <span aria-hidden="true">Question {i + 1}</span>
                  </label>
                  <span className="etiquette">{LIBELLE_TYPE[q.type] ?? q.type}</span>
                  <span className="relecture-meta">Notion&nbsp;: {q.notion ?? 'aucune'}</span>
                  <span className="relecture-meta">Difficulté&nbsp;: {(LIBELLE_DIFFICULTE[q.difficulte] ?? String(q.difficulte)).toLocaleLowerCase('fr')}</span>
                </header>
                <p className="ligne-question-enonce">{q.enonce}</p>
                <Corrige q={q} />
                {q.explication && <p className="relecture-explication"><strong>Explication&nbsp;:</strong> {q.explication}</p>}
                <Link href={`/admin/questions/${q.id}`} className="lien-modifier-question">
                  Modifier<span className="sr-only"> la question {i + 1}</span>
                </Link>
              </article>
            ))}
          </div>
          <div className="actions-formulaire relecture-actions">
            <button type="submit" name="statut" value="valide" className="bouton bouton-principal" disabled={enCours}>Valider la sélection</button>
            <button type="submit" name="statut" value="brouillon" className="bouton bouton-secondaire" disabled={enCours}>Repasser en brouillon</button>
          </div>
        </>
      )}
    </form>
  );
}
