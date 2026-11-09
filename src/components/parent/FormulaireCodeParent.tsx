'use client';

import { useActionState, useId } from 'react';
import { relierParCode, type EtatCode } from '@/app/(app)/parent/actions';

export function FormulaireCodeParent() {
  const [etat, envoyer, enCours] = useActionState<EtatCode, FormData>(relierParCode, {});
  const id = useId();
  const aide = `${id}-aide`;
  const erreur = `${id}-erreur`;
  return (
    <form action={envoyer} className="formulaire formulaire-code-parent" aria-labelledby={`${id}-titre`}>
      <h2 id={`${id}-titre`}>Relier un enfant</h2>
      <label>
        Code de votre enfant
        <input type="text" name="code" autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="ABCD-EFGH"
          defaultValue={etat.code ?? ''} key={`c-${etat.code ?? ''}-${etat.info ?? ''}`}
          aria-describedby={etat.erreur ? `${aide} ${erreur}` : aide} aria-invalid={etat.erreur ? true : undefined} />
      </label>
      <p id={aide} className="aide-champ">Votre enfant le trouve dans son espace, sur la page de son compte. Les tirets et les espaces sont ignorés.</p>
      {etat.erreur && <p id={erreur} role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>{enCours ? 'Vérification…' : 'Relier cet enfant'}</button>
    </form>
  );
}
