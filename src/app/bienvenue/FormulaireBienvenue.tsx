'use client';

import { useActionState } from 'react';
import { terminerOnboarding, type EtatBienvenue } from './actions';

const VOIES = { generale: 'Voie générale', technologique: 'Voie technologique', professionnelle: 'Voie professionnelle' } as const;
type Filiere = { id: string; voie: keyof typeof VOIES; nom: string };

export function FormulaireBienvenue({ filieres, suite }: { filieres: Filiere[]; suite?: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatBienvenue, FormData>(terminerOnboarding, {});
  const v = etat.valeurs;
  return (
    <form key={etat.essai ?? 0} action={envoyer} className="formulaire">
      {suite && <input type="hidden" name="suite" value={suite} />}
      <label>Ton prénom<input name="nom" autoComplete="given-name" defaultValue={v?.nom} required /></label>
      <label>
        Ta filière
        <select name="filiereId" required defaultValue={v?.filiereId ?? ''}>
          <option value="" disabled>Choisis…</option>
          {(Object.keys(VOIES) as (keyof typeof VOIES)[]).map((voie) => {
            const liste = filieres.filter((f) => f.voie === voie);
            return liste.length > 0 && (
              <optgroup key={voie} label={VOIES[voie]}>
                {liste.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
              </optgroup>
            );
          })}
        </select>
      </label>
      <fieldset>
        <legend>Ton niveau</legend>
        <label><input type="radio" name="niveau" value="2de" defaultChecked={v?.niveau === '2de'} required /> Seconde</label>
        <label><input type="radio" name="niveau" value="1re" defaultChecked={v?.niveau === '1re'} /> Première</label>
        <label><input type="radio" name="niveau" value="Tle" defaultChecked={v?.niveau === 'Tle'} /> Terminale</label>
      </fieldset>
      <label className="case"><input type="checkbox" name="moinsDe15Ans" defaultChecked={v?.moinsDe15Ans} /> J’ai moins de 15 ans</label>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>C’est parti !</button>
    </form>
  );
}
