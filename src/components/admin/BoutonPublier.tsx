'use client';

import { useActionState } from 'react';
import { publierChapitre, publierCours, type EtatPublication } from '@/app/(app)/admin/actions';

type Props = { type: 'cours' | 'chapitre'; id: string; publie: boolean; nom: string; compact?: boolean };

export function BoutonPublier({ type, id, publie, nom, compact }: Props) {
  const [etat, envoyer, enCours] = useActionState<EtatPublication, FormData>(type === 'cours' ? publierCours : publierChapitre, {});
  const verbe = publie ? 'Dépublier' : 'Publier';
  const erreurId = `erreur-publier-${type}-${id}`;
  return (
    <form action={envoyer} className="formulaire-publier">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="publie" value={String(!publie)} />
      <button type="submit" className={`bouton ${publie ? 'bouton-secondaire' : 'bouton-principal'} ${compact ? 'bouton-compact' : ''}`}
        disabled={enCours} aria-describedby={etat.erreur ? erreurId : undefined}>
        {enCours ? '…' : verbe}<span className="sr-only"> {type === 'cours' ? 'le cours' : 'le chapitre'} {nom}</span>
      </button>
      {etat.erreur && <p id={erreurId} role="alert" className="message-erreur">{etat.erreur}</p>}
    </form>
  );
}
