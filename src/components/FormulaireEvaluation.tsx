'use client';

import { useActionState } from 'react';
import { lancerEvaluation } from '@/app/(app)/tentative/actions';

export function FormulaireEvaluation({ coursId }: { coursId: string }) {
  const [etat, envoyer, enCours] = useActionState(lancerEvaluation, {});
  return (
    <form action={envoyer} className="formulaire">
      <input type="hidden" name="coursId" value={coursId} />
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>{enCours ? 'Préparation…' : 'Commencer l’évaluation'}</button>
    </form>
  );
}
