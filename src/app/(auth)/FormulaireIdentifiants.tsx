'use client';

import { useActionState } from 'react';
import type { EtatFormulaire } from './actions';

type Props = {
  action: (etat: EtatFormulaire, form: FormData) => Promise<EtatFormulaire>;
  libelle: string;
  autocompleteMotDePasse: 'current-password' | 'new-password';
};

export function FormulaireIdentifiants({ action, libelle, autocompleteMotDePasse }: Props) {
  const [etat, envoyer, enCours] = useActionState(action, {});
  return (
    <form action={envoyer} className="formulaire">
      <label>
        Adresse e-mail
        <input key={etat.email} name="email" type="email" autoComplete="email" defaultValue={etat.email} required />
      </label>
      <label>
        Mot de passe
        <input name="motDePasse" type="password" autoComplete={autocompleteMotDePasse} minLength={8} required />
      </label>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Un instant…' : libelle}
      </button>
    </form>
  );
}
