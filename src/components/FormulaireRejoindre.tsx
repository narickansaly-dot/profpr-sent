'use client';

import { useActionState } from 'react';
import { rejoindreClasse, quitterClasse } from '@/app/(app)/classes/actions';

export function FormulaireRejoindre({ codeInitial }: { codeInitial: string }) {
  const [etat, envoyer, enCours] = useActionState(rejoindreClasse, {});
  return (
    <form action={envoyer} className="formulaire formulaire-code">
      <label>
        Code de la classe
        <input
          name="code" type="text" required minLength={6} maxLength={12}
          autoComplete="off" autoCapitalize="characters" inputMode="text" spellCheck={false}
          defaultValue={etat.code ?? (etat.info ? '' : codeInitial)}
          aria-describedby="aide-code"
        />
      </label>
      <p id="aide-code" className="aide-code">6 caractères, donnés par ton enseignant.</p>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>{enCours ? 'Vérification…' : 'Rejoindre'}</button>
    </form>
  );
}

export function BoutonQuitter({ classeId, nom }: { classeId: string; nom: string }) {
  return (
    <form
      action={quitterClasse}
      onSubmit={(e) => {
        if (!window.confirm('Quitter cette classe ? Ton enseignant ne verra plus ta progression.')) e.preventDefault();
      }}
    >
      <input type="hidden" name="classe" value={classeId} />
      <button type="submit" className="bouton bouton-secondaire" aria-label={`Quitter la classe ${nom}`}>Quitter</button>
    </form>
  );
}
