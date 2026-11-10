'use client';

import { useActionState, useId } from 'react';
import { definirEcheance, type EtatEcheance } from '@/app/(app)/enseignant/actions';

type Props = { classeId: string; coursId: string; titre: string; ouverture: string; limite: string };

export function FormulaireEcheance({ classeId, coursId, titre, ouverture, limite }: Props) {
  const [etat, envoyer, enCours] = useActionState<EtatEcheance, FormData>(definirEcheance, {});
  const id = useId();
  const aide = `${id}-aide`;
  const erreur = `${id}-erreur`;
  // Chaque champ annonce l'aide (heures de Paris) et, s'il y en a une, l'erreur du formulaire.
  const decrit = etat.erreur ? `${aide} ${erreur}` : aide;
  return (
    <form action={envoyer} className="formulaire formulaire-echeance" aria-labelledby={`${id}-titre`}>
      <h3 id={`${id}-titre`}>{titre}</h3>
      <input type="hidden" name="classe" value={classeId} />
      <input type="hidden" name="cours" value={coursId} />
      <div className="ligne-champs">
        <label>
          Ouverture
          <input type="datetime-local" name="ouverture" defaultValue={etat.ouverture ?? ouverture} key={`o-${etat.ouverture ?? ouverture}`}
            aria-describedby={decrit} aria-invalid={etat.champ === 'ouverture' ? true : undefined} />
        </label>
        <label>
          Date limite
          <input type="datetime-local" name="limite" defaultValue={etat.limite ?? limite} key={`l-${etat.limite ?? limite}`}
            aria-describedby={decrit} aria-invalid={etat.champ === 'limite' ? true : undefined} />
        </label>
      </div>
      <p id={aide} className="aide-champ">Laisse les deux champs vides pour retirer l’échéance. Heures de Paris.</p>
      {etat.erreur && <p id={erreur} role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
      <button type="submit" className="bouton bouton-secondaire" disabled={enCours}>
        {enCours ? 'Enregistrement…' : 'Enregistrer'}<span className="sr-only"> l’échéance de {titre}</span>
      </button>
    </form>
  );
}
