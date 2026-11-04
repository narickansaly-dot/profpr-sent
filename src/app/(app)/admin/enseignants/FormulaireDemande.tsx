'use client';

import { useActionState } from 'react';
import { traiterDemande, type EtatDemande } from './actions';

export function FormulaireDemande({ profil, nom }: { profil: string; nom: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatDemande, FormData>(traiterDemande, {});
  return (
    <form action={envoyer} className="actions-demande">
      <input type="hidden" name="profil" value={profil} />
      <button type="submit" name="decision" value="accepter" className="bouton bouton-principal" disabled={enCours}>
        Valider<span className="sr-only"> la demande de {nom}</span>
      </button>
      <button type="submit" name="decision" value="refuser" className="bouton bouton-secondaire" disabled={enCours}>
        Refuser<span className="sr-only"> la demande de {nom}</span>
      </button>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
    </form>
  );
}
