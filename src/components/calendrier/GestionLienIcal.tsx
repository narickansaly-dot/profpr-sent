'use client';

import { useActionState, useId, useState } from 'react';
import { creerLienIcal, revoquerLienIcal, type EtatLien } from '@/app/(app)/calendrier/actions';

const formatDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });

export function GestionLienIcal({ actifDepuis }: { actifDepuis: string | null }) {
  // Un seul état pour les deux actions : une révocation réussie efface l'erreur et le lien créé, une création efface l'erreur précédente.
  const [etat, agir, enCours] = useActionState<EtatLien, FormData>(
    async (precedent, form) => {
      if (form.get('operation') === 'revoquer') {
        const r = await revoquerLienIcal();
        return r.erreur ? { ...precedent, erreur: r.erreur } : {};
      }
      return creerLienIcal();
    },
    {},
  );
  // La copie est liée au lien pour lequel elle a été faite : un nouveau lien repart sans message.
  const [copie, setCopie] = useState<{ pour: string; message: string } | null>(null);
  const uid = useId();
  const erreur = etat.erreur;
  // actifDepuis vient du serveur (revalidé après chaque action) : sans lien actif, rien n'est affiché.
  const lien = actifDepuis ? etat.lien : undefined;
  const copier = async (valeur: string) => {
    try {
      await navigator.clipboard.writeText(valeur);
      setCopie({ pour: valeur, message: 'Lien copié.' });
    } catch {
      setCopie({ pour: valeur, message: 'Copie impossible : sélectionne le lien et copie-le.' });
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
      <p role="status" className="aide-champ">{lien && copie?.pour === lien ? copie.message : ''}</p>
      <div className="actions-banniere">
        <form action={agir}>
          <input type="hidden" name="operation" value="creer" />
          <button type="submit" className="bouton bouton-principal" disabled={enCours}>{actifDepuis ? 'Créer un nouveau lien' : 'Créer mon lien'}</button>
        </form>
        {actifDepuis && (
          <form action={agir} onSubmit={(e) => { if (!window.confirm('Révoquer le lien ? Les agendas abonnés ne recevront plus tes événements.')) e.preventDefault(); }}>
            <input type="hidden" name="operation" value="revoquer" />
            <button type="submit" className="bouton bouton-secondaire" disabled={enCours}>Révoquer le lien</button>
          </form>
        )}
      </div>
      {erreur && <p role="alert" className="message-erreur">{erreur}</p>}
    </div>
  );
}
