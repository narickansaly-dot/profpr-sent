'use client';

import { useActionState } from 'react';
import { lancerQuiz } from '@/app/(app)/tentative/actions';

type Props = { chapitreId: string; longueurs: number[]; revision?: boolean; libelle?: string };

export function FormulaireQuiz({ chapitreId, longueurs, revision = false, libelle = 'Lancer le quiz' }: Props) {
  const [etat, envoyer, enCours] = useActionState(lancerQuiz, {});
  return (
    <form action={envoyer} className="formulaire">
      <input type="hidden" name="chapitreId" value={chapitreId} />
      {revision && <input type="hidden" name="revision" value="1" />}
      {longueurs.length > 1 ? (
        <fieldset className="choix-longueur">
          <legend>Nombre de questions</legend>
          {longueurs.map((n, i) => (
            <label key={n}><input type="radio" name="nb" value={n} defaultChecked={i === 0} /> {n}</label>
          ))}
        </fieldset>
      ) : <input type="hidden" name="nb" value={longueurs[0]} />}
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>{enCours ? 'Préparation…' : libelle}</button>
    </form>
  );
}
