'use client';

import { useActionState, useId } from 'react';
import { donnerAccord, type EtatAccord } from '@/app/accord-parental/[jeton]/actions';

export function FormulaireAccord({ jeton }: { jeton: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatAccord, FormData>(donnerAccord.bind(null, jeton), {});
  const id = useId();
  const erreur = `${id}-erreur`;
  if (etat.prenom !== undefined) {
    return (
      <p role="status" className="message-info">
        Merci, votre accord est enregistré. {etat.prenom || 'Votre enfant'} peut maintenant utiliser l’application.
      </p>
    );
  }
  return (
    <form action={envoyer} className="formulaire">
      <label className="case">
        <input type="checkbox" name="confirme" required aria-invalid={etat.erreur ? true : undefined}
          aria-describedby={etat.erreur ? erreur : undefined} />
        Je suis son parent ou son représentant légal et j’accepte qu’il ou elle utilise App lycée.
      </label>
      {etat.erreur && <p id={erreur} role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Enregistrement…' : 'Je donne mon accord'}
      </button>
    </form>
  );
}
