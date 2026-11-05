'use client';

import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { signaler, type EtatSignalement } from '@/app/(app)/enseignant/signalements/actions';

export function BoutonSignaler({ questionId }: { questionId: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatSignalement, FormData>(signaler, {});
  const [ouvert, setOuvert] = useState(false);
  const [longueur, setLongueur] = useState(0);
  const uid = useId();
  const erreurRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (etat.erreur) erreurRef.current?.focus(); }, [etat]);
  const champ = `signaler-${uid}`;
  const panneau = `panneau-${uid}`;
  return (
    <div className="signaler">
      {/* Région toujours présente : l'annonce de la confirmation est lue au changement de contenu. */}
      <p role="status" className="message-info">{etat.ok ? 'Merci : la question est retirée des quiz le temps de la relecture.' : ''}</p>
      {!etat.ok && (
        <>
          <button type="button" className="bouton bouton-secondaire" aria-expanded={ouvert} aria-controls={panneau} onClick={() => setOuvert(!ouvert)}>
            Signaler une erreur
          </button>
          {ouvert && (
            <form id={panneau} action={envoyer} className="formulaire formulaire-signaler">
              <input type="hidden" name="question" value={questionId} />
              <div className="champ">
                <label htmlFor={champ}>Qu’est-ce qui ne va pas ?</label>
                <textarea id={champ} name="commentaire" rows={3} maxLength={1000} required defaultValue={etat.commentaire ?? ''}
                  onChange={(e) => setLongueur(e.target.value.length)} aria-describedby={`${champ}-aide`} />
                <span id={`${champ}-aide`} className="aide-champ">{longueur} / 1000 caractères (5 au moins).</span>
              </div>
              {etat.erreur && <p ref={erreurRef} tabIndex={-1} role="alert" className="message-erreur">{etat.erreur}</p>}
              <button type="submit" className="bouton bouton-principal" disabled={enCours}>Envoyer le signalement</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
