'use client';

import { useActionState, useId } from 'react';
import { definirEcheance, type EtatEcheance } from '@/app/(app)/enseignant/actions';

type Props = { classeId: string; coursId: string; titre: string; ouverture: string; limite: string };

export function FormulaireEcheance({ classeId, coursId, titre, ouverture, limite }: Props) {
  const [etat, envoyer, enCours] = useActionState<EtatEcheance, FormData>(definirEcheance, {});
  const id = useId();
  return (
    <form action={envoyer} className="formulaire formulaire-echeance" aria-labelledby={`${id}-titre`}>
      <h3 id={`${id}-titre`}>{titre}</h3>
      <input type="hidden" name="classe" value={classeId} />
      <input type="hidden" name="cours" value={coursId} />
      <div className="ligne-champs">
        <label>
          Ouverture
          <input type="datetime-local" name="ouverture" defaultValue={etat.ouverture ?? ouverture} key={`o-${etat.ouverture ?? ouverture}`} />
        </label>
        <label>
          Date limite
          <input type="datetime-local" name="limite" defaultValue={etat.limite ?? limite} key={`l-${etat.limite ?? limite}`} />
        </label>
      </div>
      <p className="aide-champ">Laisse les deux champs vides pour retirer l’échéance. Heures de Paris.</p>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
      <button type="submit" className="bouton bouton-secondaire" disabled={enCours}>
        {enCours ? 'Enregistrement…' : 'Enregistrer'}<span className="sr-only"> l’échéance de {titre}</span>
      </button>
    </form>
  );
}
