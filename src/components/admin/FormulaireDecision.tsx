'use client';

import { useActionState, useEffect, useRef } from 'react';
import { traiterSignalement, type EtatDecision } from '@/app/(app)/admin/signalements/actions';

export function FormulaireDecision({ id, filtre, apercu }: { id: string; filtre: string; apercu: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatDecision, FormData>(traiterSignalement, {});
  const erreurRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (etat.erreur) erreurRef.current?.focus(); }, [etat]);
  const champ = `reponse-${id}`;
  return (
    <form action={envoyer} className="formulaire formulaire-decision" key={etat.erreur ? `e-${etat.reponse}` : 'v'}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="filtre" value={filtre} />
      <div className="champ">
        <label htmlFor={champ}>Réponse à l’enseignant (facultatif)</label>
        <textarea id={champ} name="reponse" rows={3} maxLength={1000} defaultValue={etat.reponse ?? ''} aria-describedby={`aide-${id}`} />
        <span id={`aide-${id}`} className="aide-champ">1000 caractères au plus. L’enseignant la lira avec la décision.</span>
      </div>
      {etat.erreur && <p ref={erreurRef} tabIndex={-1} role="alert" className="message-erreur">{etat.erreur}</p>}
      <div className="actions-formulaire">
        <button type="submit" name="decision" value="traite" className="bouton bouton-principal" disabled={enCours}>
          Marquer comme traité<span className="sr-only"> : {apercu}</span>
        </button>
        <button type="submit" name="decision" value="rejete" className="bouton bouton-secondaire" disabled={enCours}>
          Rejeter (la question est juste)<span className="sr-only"> : {apercu}</span>
        </button>
      </div>
    </form>
  );
}
