'use client';

import { useState } from 'react';
import { regenererCode } from '@/app/(app)/enseignant/actions';

export function CodeClasse({ classeId, code }: { classeId: string; code: string }) {
  const [statut, setStatut] = useState('');

  async function copier() {
    const lien = `${window.location.origin}/classes?code=${code}`;
    try {
      await navigator.clipboard.writeText(lien);
      setStatut('Lien copié');
    } catch {
      setStatut(`Copie impossible. Copie ce lien à la main : ${lien}`);
    }
  }

  return (
    <div className="code-classe">
      <p className="etiquette">Code d’invitation</p>
      <p className="code-grand" aria-label={`Code ${code.split('').join(' ')}`}>{code}</p>
      <div className="actions-code">
        <button type="button" className="bouton bouton-principal" onClick={copier}>Copier le lien d’invitation</button>
        <form
          action={regenererCode}
          onSubmit={(e) => {
            if (!window.confirm('Créer un nouveau code ? L’ancien code ne fonctionnera plus.')) e.preventDefault();
          }}
        >
          <input type="hidden" name="classe" value={classeId} />
          <button type="submit" className="bouton bouton-secondaire">Nouveau code</button>
        </form>
      </div>
      <p role="status" className="message-info statut-copie">{statut}</p>
    </div>
  );
}
