'use client';

import { useActionState } from 'react';
import { supprimerEvenement, type EtatSimple } from '@/app/(app)/calendrier/actions';

export function BoutonSupprimerEvenement({ id, titre, examen }: { id: string; titre: string; examen: boolean }) {
  const [etat, envoyer, enCours] = useActionState<EtatSimple, FormData>(supprimerEvenement, {});
  const question = examen
    ? 'Supprimer cet examen ? Les sessions à venir de son planning seront supprimées aussi.'
    : 'Supprimer cet événement ? S’il se répète, toute la série est supprimée.';
  return (
    <form action={envoyer} onSubmit={(e) => { if (!window.confirm(question)) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="bouton bouton-secondaire" disabled={enCours}>
        Supprimer<span className="sr-only"> « {titre} »</span>
      </button>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
    </form>
  );
}
