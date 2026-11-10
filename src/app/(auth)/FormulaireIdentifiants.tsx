'use client';

import { useActionState } from 'react';
import type { EtatFormulaire } from './actions';

type Props = {
  action: (etat: EtatFormulaire, form: FormData) => Promise<EtatFormulaire>;
  libelle: string;
  autocompleteMotDePasse: 'current-password' | 'new-password';
  suite?: string;
};

export function FormulaireIdentifiants({ action, libelle, autocompleteMotDePasse, suite }: Props) {
  const [etat, envoyer, enCours] = useActionState(action, {});
  const aide = autocompleteMotDePasse === 'new-password';
  return (
    <form action={envoyer} className="formulaire">
      {suite && <input type="hidden" name="suite" value={suite} />}
      <label>
        Adresse e-mail
        <input key={etat.email} name="email" type="email" autoComplete="email" defaultValue={etat.email} required
          aria-invalid={etat.champ === 'email' || undefined}
          aria-describedby={etat.champ === 'email' ? 'identifiants-erreur' : undefined} />
      </label>
      <label>
        Mot de passe
        <input name="motDePasse" type="password" autoComplete={autocompleteMotDePasse} minLength={8} required
          aria-invalid={etat.champ === 'motDePasse' || undefined}
          aria-describedby={[aide ? 'mot-de-passe-aide' : null, etat.champ === 'motDePasse' ? 'identifiants-erreur' : null].filter(Boolean).join(' ') || undefined} />
      </label>
      {aide && <p id="mot-de-passe-aide" className="aide-champ">8 caractères au moins.</p>}
      {etat.erreur && <p id="identifiants-erreur" role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Un instant…' : libelle}
      </button>
    </form>
  );
}
