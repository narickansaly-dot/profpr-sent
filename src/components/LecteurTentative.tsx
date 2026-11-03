'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { enregistrerReponse, terminerTentative } from '@/app/(app)/tentative/actions';
import { estRepondue, type ReponseAffichee } from '@/lib/quiz/reponse';
import type { QuestionAffichee } from '@/lib/quiz/requetes';
import { BarreProgression } from './BarreProgression';
import { ChampReponse } from './ChampReponse';
import { CompteARebours } from './CompteARebours';

type Props = { tentativeId: string; questions: QuestionAffichee[]; dateLimite: string | null; serveurMaintenant: number };

export function LecteurTentative({ tentativeId, questions, dateLimite, serveurMaintenant }: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(() => Math.max(0, questions.findIndex((q) => !estRepondue(q.reponse))));
  const [reponses, setReponses] = useState<Record<string, ReponseAffichee | null>>(
    () => Object.fromEntries(questions.map((q) => [q.question_id, q.reponse])),
  );
  const [enVolNb, setEnVolNb] = useState(0);
  const [erreurSauvegarde, setErreurSauvegarde] = useState(false);
  const [enFin, demarrerFin] = useTransition();
  // Enregistrements en vol : la fin du quiz les attend pour ne perdre aucune réponse.
  const enVol = useRef(new Set<Promise<void>>());
  // Une file par question : le dernier envoi part toujours en dernier et l'emporte.
  const chaines = useRef(new Map<string, Promise<void>>());
  const enregistre = useRef(new Map<string, string>(questions.map((q) => [q.question_id, JSON.stringify(q.reponse ?? null)])));
  const reponsesRef = useRef(reponses);
  reponsesRef.current = reponses;
  const finEnCours = useRef(false);
  const monte = useRef(true);
  const fieldset = useRef<HTMLFieldSetElement>(null);
  const premierRendu = useRef(true);
  const question = questions[index];
  const nbRepondues = questions.filter((q) => estRepondue(reponses[q.question_id])).length;

  useEffect(() => {
    monte.current = true;
    return () => { monte.current = false; };
  }, []);

  // Après un changement de question, le focus suit (lecteurs d'écran et clavier).
  useEffect(() => {
    if (premierRendu.current) { premierRendu.current = false; return; }
    fieldset.current?.focus({ preventScroll: true });
    fieldset.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [index]);

  // Meilleur effort : texte pas encore enregistré quand l'onglet se ferme.
  useEffect(() => {
    const quitter = () => { void enregistrerTextesModifies(); };
    window.addEventListener('pagehide', quitter);
    return () => window.removeEventListener('pagehide', quitter);
  });

  /** Ne rejette jamais : une exception est traitée comme une erreur, avec les mêmes reprises. */
  async function envoyer(questionId: string, reponse: ReponseAffichee | null) {
    for (let essai = 0; essai < 3; essai++) {
      let r: Awaited<ReturnType<typeof enregistrerReponse>>;
      try {
        r = await enregistrerReponse(tentativeId, questionId, reponse);
      } catch {
        r = { erreur: 'reseau' };
      }
      if ('statut' in r) {
        enregistre.current.set(questionId, JSON.stringify(reponse ?? null));
        if (r.statut !== 'ok') { if (monte.current) router.replace(`/tentative/${tentativeId}/resultat`); }
        else if (monte.current) setErreurSauvegarde(false);
        return;
      }
      if (essai < 2) await new Promise((ok) => setTimeout(ok, 800 * (essai + 1)));
    }
    if (monte.current) setErreurSauvegarde(true);
  }

  function sauver(questionId: string, reponse: ReponseAffichee | null): Promise<void> {
    if (monte.current) setEnVolNb((n) => n + 1);
    const precedente = chaines.current.get(questionId) ?? Promise.resolve();
    const promesse: Promise<void> = precedente.then(() => envoyer(questionId, reponse)).finally(() => {
      enVol.current.delete(promesse);
      if (chaines.current.get(questionId) === promesse) chaines.current.delete(questionId);
      if (monte.current) setEnVolNb((n) => n - 1);
    });
    chaines.current.set(questionId, promesse);
    enVol.current.add(promesse);
    return promesse;
  }

  function changer(reponse: ReponseAffichee | null, enregistrerTout: boolean) {
    setReponses((r) => ({ ...r, [question.question_id]: reponse }));
    if (enregistrerTout) void sauver(question.question_id, reponse);
  }

  /** N'envoie un texte que s'il a changé depuis le dernier enregistrement réussi. */
  function enregistrerTextesModifies(seulement?: string): Promise<void> {
    const envois = questions
      .filter((q) => q.type === 'reponse_courte' && (seulement === undefined || q.question_id === seulement))
      .filter((q) => JSON.stringify(reponsesRef.current[q.question_id] ?? null) !== enregistre.current.get(q.question_id))
      .map((q) => sauver(q.question_id, reponsesRef.current[q.question_id] ?? null));
    return Promise.all(envois).then(() => undefined);
  }

  function aller(cible: number) {
    void enregistrerTextesModifies(question.question_id);
    setIndex(cible);
  }

  function terminer(demanderConfirmation: boolean) {
    if (finEnCours.current) return;
    const manquantes = questions.length - nbRepondues;
    if (demanderConfirmation && manquantes > 0
      && !window.confirm(`Il te reste ${manquantes} question${manquantes > 1 ? 's' : ''} sans réponse. Terminer quand même ?`)) return;
    finEnCours.current = true;
    demarrerFin(async () => {
      await enregistrerTextesModifies();
      await Promise.allSettled([...enVol.current]);
      await terminerTentative(tentativeId);
    });
  }

  const sauvegardeLibelle = erreurSauvegarde ? 'Non enregistré : vérifie ta connexion'
    : enVolNb > 0 ? 'Enregistrement…' : 'Réponses enregistrées';

  const derniere = index === questions.length - 1;
  return (
    <div className="lecteur">
      <div className="lecteur-barre">
        <span className="lecteur-position">Question {index + 1} / {questions.length}</span>
        {dateLimite && <CompteARebours dateLimite={dateLimite} serveurMaintenant={serveurMaintenant} onFin={() => terminer(false)} />}
        <span className={`sauvegarde${erreurSauvegarde ? ' sauvegarde-erreur' : ''}`} role={erreurSauvegarde ? 'alert' : undefined}>{sauvegardeLibelle}</span>
      </div>
      <BarreProgression valeur={nbRepondues} max={questions.length} libelle="Questions répondues" />

      <fieldset className="carte question" key={question.question_id} ref={fieldset} tabIndex={-1} disabled={enFin}>
        <legend className="question-enonce">{question.enonce}</legend>
        <ChampReponse questionId={question.question_id} type={question.type} propositions={question.propositions}
          reponse={reponses[question.question_id] ?? null} onChange={changer}
          onBlur={() => { void enregistrerTextesModifies(question.question_id); }} />
      </fieldset>

      <div className="lecteur-navigation">
        <button type="button" className="bouton bouton-secondaire" disabled={enFin} aria-disabled={index === 0 || undefined} onClick={() => { if (index > 0) aller(index - 1); }}>← Précédente</button>
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
