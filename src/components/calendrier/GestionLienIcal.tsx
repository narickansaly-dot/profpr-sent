'use client';

import { useActionState, useId, useState } from 'react';
import { creerLienIcal, revoquerLienIcal, type EtatLien } from '@/app/(app)/calendrier/actions';

const formatDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });

export function GestionLienIcal({ actifDepuis }: { actifDepuis: string | null }) {
  const [creation, creer, enCreation] = useActionState<EtatLien, FormData>(creerLienIcal, {});
  const [revocation, revoquer, enRevocation] = useActionState<EtatLien, FormData>(revoquerLienIcal, {});
  const [copie, setCopie] = useState('');
  const uid = useId();
  const erreur = creation.erreur ?? revocation.erreur;
  // actifDepuis vient du serveur (revalidé après chaque action) : après une révocation, le lien affiché disparaît.
  const lien = actifDepuis ? creation.lien : undefined;
  const copier = async (valeur: string) => {
    try {
      await navigator.clipboard.writeText(valeur);
      setCopie('Lien copié.');
    } catch {
      setCopie('Copie impossible : sélectionne le lien et copie-le.');
    }
  };
  return (
    <div className="gestion-ical">
      {lien ? (
        <div className="carte lien-ical">
          <label htmlFor={`${uid}-lien`}><strong>Ton lien privé</strong></label>
          <input id={`${uid}-lien`} readOnly value={lien} onFocus={(e) => e.currentTarget.select()} aria-describedby={`${uid}-aide`} />
          <div className="actions-banniere">
            <button type="button" className="bouton bouton-principal" onClick={() => copier(lien)}>Copier le lien</button>
            <a className="bouton bouton-secondaire" href={lien.replace(/^https?:/, 'webcal:')}>Ouvrir dans mon agenda</a>
          </div>
          <p id={`${uid}-aide`} className="aide-champ">Copie-le maintenant&nbsp;: pour ta sécurité, il ne sera plus affiché. Tu pourras toujours en créer un nouveau.</p>
        </div>
      ) : actifDepuis ? (
        <p>Un lien est actif depuis le {formatDate.format(new Date(actifDepuis))}. Pour en avoir un nouveau, crée-le&nbsp;: l’ancien cessera de fonctionner.</p>
      ) : (
        <p>Aucun lien actif.</p>
      )}
      <p role="status" className="aide-champ">{copie}</p>
      <div className="actions-banniere">
        <form action={creer}>
          <button type="submit" className="bouton bouton-principal" disabled={enCreation}>{actifDepuis ? 'Créer un nouveau lien' : 'Créer mon lien'}</button>
        </form>
        {actifDepuis && (
          <form action={revoquer} onSubmit={(e) => { if (!window.confirm('Révoquer le lien ? Les agendas abonnés ne recevront plus tes événements.')) e.preventDefault(); }}>
            <button type="submit" className="bouton bouton-secondaire" disabled={enRevocation}>Révoquer le lien</button>
          </form>
        )}
      </div>
      {erreur && <p role="alert" className="message-erreur">{erreur}</p>}
    </div>
  );
}
