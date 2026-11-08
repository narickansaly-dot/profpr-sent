'use client';

import { useActionState, useState } from 'react';
import { enregistrerPreferences, type EtatPreferences } from '@/app/(app)/notifications/actions';
import { TYPES_NOTIFICATION, type ValeursPreferences } from '@/lib/notifications/preferences';

export function FormulairePreferences({ initial }: { initial: ValeursPreferences }) {
  const [modifie, setModifie] = useState(false);
  const [etat, envoyer, enCours] = useActionState<EtatPreferences, FormData>(async (precedent, form) => {
    setModifie(false);
    return enregistrerPreferences(precedent, form);
  }, {});
  const v = etat.valeurs ?? initial;
  const aria = (champ: string, aide?: string) => ({
    'aria-invalid': etat.champ === champ || undefined,
    'aria-describedby': [aide, etat.champ === champ ? 'preferences-erreur' : null].filter(Boolean).join(' ') || undefined,
  });
  return (
    <form action={envoyer} className="formulaire formulaire-preferences" onChange={() => setModifie(true)}>
      {/* key : React 19 vide les champs après une action ; seuls les champs sont remontés, pas la région d'état. */}
      <div className="champs-preferences" key={JSON.stringify(v)}>
      <fieldset>
        <legend>Notifications à recevoir</legend>
        {TYPES_NOTIFICATION.map((t) => (
          <label key={t.cle} className="case">
            <input type="checkbox" name="types" value={t.cle} defaultChecked={v.types.includes(t.cle)} /> {t.libelle}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Heures de silence</legend>
        <p id="silence-aide" className="aide-champ">Pendant le silence, les notifications attendent la fin de la plage. Mets la même heure deux fois pour ne jamais être en silence.</p>
        <div className="ligne-champs">
          <label>Début du silence
            <input type="time" name="silence_debut" defaultValue={v.silence_debut} required {...aria('silence_debut', 'silence-aide')} />
          </label>
          <label>Fin du silence
            <input type="time" name="silence_fin" defaultValue={v.silence_fin} required {...aria('silence_fin', 'silence-aide')} />
          </label>
        </div>
      </fieldset>
      <label>Relance après
        <select name="jours_inactivite" defaultValue={v.jours_inactivite} {...aria('jours_inactivite')}>
          {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'jour' : 'jours'} sans réviser</option>)}
        </select>
      </label>
      </div>
      {etat.erreur && <p id="preferences-erreur" className="message-erreur" role="alert">{etat.erreur}</p>}
      <p role="status" className="message-info">{etat.ok && !modifie ? 'Réglages enregistrés.' : ''}</p>
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Enregistrement…' : 'Enregistrer mes réglages'}
      </button>
    </form>
  );
}
