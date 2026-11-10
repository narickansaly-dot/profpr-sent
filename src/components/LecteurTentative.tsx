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
  const [erreurFin, setErreurFin] = useState(false);
  const [enFin, demarrerFin] = useTransition();
  // Enregistrements en vol : la fin du quiz les attend pour ne perdre aucune réponse.
  const enVol = useRef(new Set<Promise<void>>());
  // Une file par question : le dernier envoi part toujours en dernier et l'emporte.
  const chaines = useRef(new Map<string, Promise<void>>());
  const enregistre = useRef(new Map<string, string>(questions.map((q) => [q.question_id, JSON.stringify(q.reponse ?? null)])));
  // Copie en état de `enregistre` : les pastilles ne passent à « répondue » que lorsque la valeur est sauvegardée.
  const [enregistreEtat, setEnregistreEtat] = useState<Record<string, string>>(() => Object.fromEntries(enregistre.current));
  const reponsesRef = useRef(reponses);
  useEffect(() => { reponsesRef.current = reponses; });
  const finEnCours = useRef(false);
  const monte = useRef(true);
  const fieldset = useRef<HTMLFieldSetElement>(null);
  const indexPrecedent = useRef(index);
  const question = questions[index];
  const nbRepondues = questions.filter((q) => estRepondue(reponses[q.question_id])).length;

  useEffect(() => {
    monte.current = true;
    return () => { monte.current = false; };
  }, []);

  // Après un changement de question, le focus suit (lecteurs d'écran et clavier).
  useEffect(() => {
    if (indexPrecedent.current === index) return;
    indexPrecedent.current = index;
    fieldset.current?.focus({ preventScroll: true });
    fieldset.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [index]);

  // Meilleur effort : réponses pas encore enregistrées quand l'onglet se ferme ou que le réseau revient.
  useEffect(() => {
    const quitter = () => { void renvoyerNonEnregistrees(); };
    // Retour de la connexion : on renvoie tout ce qui n'a pas pu partir.
    const revenu = () => { void renvoyerNonEnregistrees(); };
    window.addEventListener('pagehide', quitter);
    window.addEventListener('online', revenu);
    return () => {
      window.removeEventListener('pagehide', quitter);
      window.removeEventListener('online', revenu);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne lit que des refs et des fonctions stables à l'usage
  }, []);

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
        const valeur = JSON.stringify(reponse ?? null);
        enregistre.current.set(questionId, valeur);
        if (monte.current) setEnregistreEtat((e) => ({ ...e, [questionId]: valeur }));
        if (r.statut !== 'ok') { if (monte.current) router.replace(`/tentative/${tentativeId}/resultat`); }
        // L'alerte reste affichée tant qu'une autre réponse n'est pas enregistrée.
        else if (monte.current && toutEnregistre()) setErreurSauvegarde(false);
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

  const differe = (questionId: string) =>
    JSON.stringify(reponsesRef.current[questionId] ?? null) !== enregistre.current.get(questionId);
  const toutEnregistre = () => questions.every((q) => !differe(q.question_id));

  /**
   * Renvoie toute réponse (de n'importe quel type) qui diffère du dernier enregistrement réussi.
   * Une question dont l'envoi est déjà en vol est laissée : sa file porte déjà la dernière valeur.
   */
  function renvoyerNonEnregistrees(seulement?: string): Promise<void> {
    const envois = questions
      .filter((q) => (seulement === undefined || q.question_id === seulement) && differe(q.question_id) && !chaines.current.has(q.question_id))
      .map((q) => sauver(q.question_id, reponsesRef.current[q.question_id] ?? null));
    return Promise.allSettled(envois).then(() => undefined);
  }

  function aller(cible: number) {
    void renvoyerNonEnregistrees(question.question_id);
    setIndex(cible);
  }

  function terminer(demanderConfirmation: boolean) {
    if (finEnCours.current) return;
    const manquantes = questions.length - nbRepondues;
    if (demanderConfirmation && manquantes > 0
      && !window.confirm(`Il te reste ${manquantes} question${manquantes > 1 ? 's' : ''} sans réponse. Terminer quand même ?`)) return;
    finEnCours.current = true;
    setErreurFin(false);
    demarrerFin(async () => {
      try {
        await renvoyerNonEnregistrees();
        await Promise.allSettled([...enVol.current]);
        // Fin manuelle : on laisse l'élève décider s'il perd des réponses. Fin du temps : on termine, le serveur tranche.
        if (demanderConfirmation && !toutEnregistre()
          && !window.confirm('Certaines réponses ne sont pas encore enregistrées. Terminer quand même ?')) return;
        await terminerTentative(tentativeId);
      } catch {
        if (monte.current) setErreurFin(true);
      } finally {
        // Si la fin échoue (retour sur ?erreur=fin), on doit pouvoir réessayer.
        finEnCours.current = false;
      }
    });
  }

  const sauvegardeLibelle = erreurSauvegarde ? 'Non enregistré : vérifie ta connexion'
    : enVolNb > 0 ? 'Enregistrement…' : 'Réponses enregistrées';

  const derniere = index === questions.length - 1;
  return (
    <div className="lecteur">
      {erreurFin && <p role="alert" className="message-erreur">La correction n’a pas pu se lancer. Réessaie de terminer le quiz.</p>}
      <div className="lecteur-barre">
        <span className="lecteur-position" aria-live="polite" aria-atomic="true">
          Question {index + 1}<span aria-hidden="true"> / </span><span className="sr-only"> sur </span>{questions.length}
        </span>
        {dateLimite && <CompteARebours dateLimite={dateLimite} serveurMaintenant={serveurMaintenant} onFin={() => terminer(false)} />}
        {erreurSauvegarde
          ? <p role="alert" className="sauvegarde sauvegarde-erreur">{sauvegardeLibelle}</p>
          : <span className="sauvegarde">{sauvegardeLibelle}</span>}
      </div>
      <BarreProgression valeur={nbRepondues} max={questions.length} libelle="Questions répondues" />

      <fieldset className="carte question" key={question.question_id} ref={fieldset} tabIndex={-1} disabled={enFin}>
        <legend className="question-enonce">{question.enonce}</legend>
        <ChampReponse questionId={question.question_id} type={question.type} propositions={question.propositions}
          reponse={reponses[question.question_id] ?? null} onChange={changer}
          onBlur={() => { void renvoyerNonEnregistrees(question.question_id); }} />
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
            const locale = estRepondue(reponses[q.question_id]);
            // « Répondue » seulement une fois la valeur enregistrée ; sinon « en attente ».
            const sauvee = enregistreEtat[q.question_id] === JSON.stringify(reponses[q.question_id] ?? null);
            const repondue = locale && sauvee;
            const enAttente = locale && !sauvee;
            return (
              <li key={q.question_id}>
                <button type="button" className={repondue ? 'repondue' : enAttente ? 'en-attente' : undefined} aria-current={i === index ? 'step' : undefined}
                  aria-label={`Question ${i + 1}${repondue ? ', répondue' : enAttente ? ', en attente d’enregistrement' : ''}`} onClick={() => aller(i)}>{i + 1}</button>
              </li>
            );
          })}
        </ol>
      </nav>
      {!derniere && <button type="button" className="bouton bouton-secondaire" disabled={enFin} onClick={() => terminer(true)}>Terminer maintenant</button>}
    </div>
  );
}
