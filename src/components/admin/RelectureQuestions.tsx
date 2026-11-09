'use client';

import { useActionState, useEffect, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { changerStatutSelection, type EtatLot } from '@/app/(app)/admin/questions/actions';
import type { QuestionAdmin } from '@/lib/admin/requetes';
import { LIBELLE_DIFFICULTE, LIBELLE_TYPE } from '@/lib/admin/questions';
import { libelleCase, toutEstCoche } from '@/lib/admin/relecture';

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
  const [cochees, setCochees] = useState<ReadonlySet<string>>(new Set());
  const statut = useRef<HTMLDivElement>(null);
  const ids = questions.map((q) => q.id);
  const toutCoche = toutEstCoche(ids, cochees);
  // Après chaque action, le focus revient sur la région de statut.
  useEffect(() => {
    if (etat !== ETAT_INITIAL) statut.current?.focus();
  }, [etat]);
  // Pendant l'envoi, les boutons restent focalisables (aria-disabled) : on ignore simplement le double envoi.
  const ignorerSiEnCours = (e: MouseEvent<HTMLButtonElement>) => { if (enCours) e.preventDefault(); };
  const basculer = (id: string, coche: boolean) => setCochees((avant) => {
    const apres = new Set(avant);
    if (coche) apres.add(id); else apres.delete(id);
    return apres;
  });
  return (
    <form action={action} className="relecture" aria-label="Relecture des questions">
      <input type="hidden" name="chapitre" value={chapitreId} />
      <div role="status" tabIndex={-1} ref={statut} className="message-info">{etat.message ?? ''}</div>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      {questions.length === 0 ? (
        <p className="vide">Aucune question à relire dans ce chapitre.</p>
      ) : (
        <>
          <div className="actions-formulaire">
            <button type="button" className="bouton bouton-secondaire" aria-disabled={enCours || undefined}
              onClick={() => { if (!enCours) setCochees(toutCoche ? new Set() : new Set(ids)); }}>
              {toutCoche ? 'Tout décocher' : 'Tout cocher'}
            </button>
          </div>
          <div className="relecture-liste">
            {questions.map((q, i) => (
              <article key={q.id} className="carte carte-relecture">
                <header className="carte-relecture-tete">
                  <label className="case-relecture">
                    <input type="checkbox" name="ids" value={q.id} checked={cochees.has(q.id)}
                      onChange={(e) => basculer(q.id, e.target.checked)} />
                    <span className="sr-only">{libelleCase(q)}</span>
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
            <button type="submit" name="statut" value="valide" className="bouton bouton-principal" aria-disabled={enCours || undefined} onClick={ignorerSiEnCours}>Valider la sélection</button>
            <button type="submit" name="statut" value="brouillon" className="bouton bouton-secondaire" aria-disabled={enCours || undefined} onClick={ignorerSiEnCours}>Repasser en brouillon</button>
          </div>
        </>
      )}
    </form>
  );
}
