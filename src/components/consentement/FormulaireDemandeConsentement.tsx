'use client';

import { useActionState, useId } from 'react';
import { demanderConsentement, type EtatDemande } from '@/app/consentement/actions';

type Props = { emailConnu: string | null };

export function FormulaireDemandeConsentement({ emailConnu }: Props) {
  const [etat, envoyer, enCours] = useActionState<EtatDemande, FormData>(demanderConsentement, {});
  const id = useId();
  const erreur = `${id}-erreur`;
  const valeur = etat.email ?? emailConnu ?? '';
  const dejaEnvoye = Boolean(emailConnu) || etat.envoye;
  return (
    <form action={envoyer} className="formulaire" aria-labelledby={`${id}-titre`}>
      <h2 id={`${id}-titre`} className="sr-only">Demande d’accord</h2>
      <label>
        Adresse e-mail de ton parent
        <input type="email" name="email" required autoComplete="off" defaultValue={valeur} key={valeur}
          aria-invalid={etat.erreur ? true : undefined} aria-describedby={etat.erreur ? erreur : undefined} />
      </label>
      {etat.erreur && <p id={erreur} role="alert" className="message-erreur">{etat.erreur}</p>}
      <p role="status" className="message-info">{etat.envoye ? `E-mail envoyé à ${etat.email}.` : ''}</p>
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Envoi…' : dejaEnvoye ? 'Renvoyer' : 'Envoyer la demande'}
      </button>
    </form>
  );
}
