'use client';

import { useActionState } from 'react';
import { lancerRevisionGenerale, type EtatSimple } from '@/app/(app)/calendrier/actions';

export function FormulaireRevisionGenerale({ evenementId }: { evenementId: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatSimple, FormData>(lancerRevisionGenerale, {});
  return (
    <form action={envoyer}>
      <input type="hidden" name="evenement" value={evenementId} />
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Préparation…' : 'Lancer la révision générale'}
      </button>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
    </form>
  );
}
