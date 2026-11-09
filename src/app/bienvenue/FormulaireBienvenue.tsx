'use client';

import { useActionState, useState } from 'react';
import { terminerOnboarding, type EtatBienvenue } from './actions';

const VOIES = { generale: 'Voie générale', technologique: 'Voie technologique', professionnelle: 'Voie professionnelle' } as const;
type Filiere = { id: string; voie: keyof typeof VOIES; nom: string };

export function FormulaireBienvenue({ filieres, suite }: { filieres: Filiere[]; suite?: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatBienvenue, FormData>(terminerOnboarding, {});
  const v = etat.valeurs;
  const [profil, setProfil] = useState<'eleve' | 'enseignant'>(v?.profil ?? 'eleve');
  const enseignant = profil === 'enseignant';
  // Le champ en cause porte l'erreur : état invalide et lien vers le message.
  const liaison = (champ: NonNullable<EtatBienvenue['champ']>) =>
    etat.champ === champ ? { 'aria-invalid': true as const, 'aria-describedby': 'bienvenue-erreur' } : {};
  return (
    <form key={etat.essai ?? 0} action={envoyer} className="formulaire">
      {suite && <input type="hidden" name="suite" value={suite} />}
      <fieldset>
        <legend>Tu es…</legend>
        <label><input type="radio" name="profil" value="eleve" checked={!enseignant} onChange={() => setProfil('eleve')} /> Je suis élève</label>
        <label><input type="radio" name="profil" value="enseignant" checked={enseignant} onChange={() => setProfil('enseignant')} /> J’enseigne</label>
      </fieldset>
      <label>Ton prénom<input name="nom" autoComplete="given-name" defaultValue={v?.nom} required {...liaison('nom')} /></label>
      <div className="champs-eleve" hidden={enseignant}>
        <label>
          Ta filière
          <select name="filiereId" required={!enseignant} disabled={enseignant} defaultValue={v?.filiereId ?? ''} {...liaison('filiereId')}>
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
        <fieldset disabled={enseignant}>
          <legend>Ton niveau</legend>
          <label><input type="radio" name="niveau" value="2de" defaultChecked={v?.niveau === '2de'} required={!enseignant} {...liaison('niveau')} /> Seconde</label>
          <label><input type="radio" name="niveau" value="1re" defaultChecked={v?.niveau === '1re'} {...liaison('niveau')} /> Première</label>
          <label><input type="radio" name="niveau" value="Tle" defaultChecked={v?.niveau === 'Tle'} {...liaison('niveau')} /> Terminale</label>
        </fieldset>
        <label className="case"><input type="checkbox" name="moinsDe15Ans" disabled={enseignant} defaultChecked={v?.moinsDe15Ans} /> J’ai moins de 15 ans</label>
      </div>
      <label className="champ-enseignant" hidden={!enseignant}>
        Ton établissement
        <input name="etablissement" autoComplete="organization" maxLength={120} defaultValue={v?.etablissement}
          required={enseignant} disabled={!enseignant} {...liaison('etablissement')} />
      </label>
      {etat.erreur && <p id="bienvenue-erreur" role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>C’est parti !</button>
    </form>
  );
}
