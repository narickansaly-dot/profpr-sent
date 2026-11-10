'use client';

import { useActionState, useEffect, useId, useRef } from 'react';
import { choisirCoursGratuit, type EtatChoix } from '@/app/(app)/choisir-cours/actions';

type Props = { cours: { id: string; titre: string; matiere: string }[]; coursActuelId: string | null };

export function FormulaireCoursGratuit({ cours, coursActuelId }: Props) {
  const [etat, envoyer, enCours] = useActionState<EtatChoix, FormData>(choisirCoursGratuit, {});
  const id = useId();
  const erreur = `${id}-erreur`;
  const alerte = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (etat.erreur) alerte.current?.focus(); }, [etat]);
  const choisi = etat.cours ?? coursActuelId;
  return (
    <form
      action={envoyer}
      className="formulaire"
      onSubmit={(e) => {
        if (coursActuelId && !window.confirm('Changer de cours gratuit ? Ce sera ton dernier changement.')) e.preventDefault();
      }}
    >
      <fieldset key={choisi ?? 'aucun'} role="radiogroup" aria-describedby={etat.erreur ? erreur : undefined}>
        <legend>Cours</legend>
        {cours.map((c) => (
          <label key={c.id} className="choix-cours">
            <input type="radio" name="cours" value={c.id} defaultChecked={c.id === choisi} required />
            <span><strong>{c.titre}</strong> <small>({c.matiere})</small></span>
          </label>
        ))}
      </fieldset>
      {etat.erreur && <p id={erreur} ref={alerte} tabIndex={-1} role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Un instant…' : 'Choisir ce cours'}
      </button>
    </form>
  );
}
