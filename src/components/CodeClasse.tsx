'use client';

import { useActionState, useId, useState } from 'react';
import { regenererCode, type EtatSimple } from '@/app/(app)/enseignant/actions';

export function CodeClasse({ classeId, code }: { classeId: string; code: string }) {
  const [statut, setStatut] = useState('');
  const [etat, envoyer, enCours] = useActionState<EtatSimple, FormData>(regenererCode, {});
  const etiquette = useId();

  // Vider puis réécrire au rendu suivant : une seconde copie redonne le même texte, qui ne serait pas réannoncé.
  function annoncer(texte: string) {
    setStatut('');
    requestAnimationFrame(() => setStatut(texte));
  }

  async function copier() {
    const lien = `${window.location.origin}/classes?code=${code}`;
    try {
      await navigator.clipboard.writeText(lien);
      annoncer('Lien copié');
    } catch {
      annoncer(`Copie impossible. Copie ce lien à la main : ${lien}`);
    }
  }

  return (
    <div className="code-classe" role="group" aria-labelledby={etiquette}>
      <p id={etiquette} className="etiquette">Code d’invitation</p>
      <p className="code-grand"><span aria-hidden="true">{code}</span><span className="sr-only">{code.split('').join(' ')}</span></p>
      <div className="actions-code">
        <button type="button" className="bouton bouton-principal" onClick={copier}>Copier le lien d’invitation</button>
        <form
          action={envoyer}
          onSubmit={(e) => {
            if (!window.confirm('Créer un nouveau code ? L’ancien code ne fonctionnera plus.')) e.preventDefault();
          }}
        >
          <input type="hidden" name="classe" value={classeId} />
          <button type="submit" className="bouton bouton-secondaire" disabled={enCours}>Nouveau code</button>
        </form>
      </div>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      <p role="status" className="message-info statut-copie">{statut}</p>
    </div>
  );
}
