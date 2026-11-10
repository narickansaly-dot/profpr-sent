'use client';

import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { signaler, type EtatSignalement } from '@/app/(app)/enseignant/signalements/actions';

/**
 * `libelle` (par exemple « question 3 ») complète le nom accessible du bouton : avec plusieurs questions sur la page,
 * chaque bouton « Signaler une erreur » reste distinct pour un lecteur d'écran. Purement présentationnel.
 */
export function BoutonSignaler({ questionId, libelle }: { questionId: string; libelle: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatSignalement, FormData>(signaler, {});
  const [ouvert, setOuvert] = useState(false);
  // Compteur lié à l'état de l'action : après une erreur, le formulaire repart du commentaire renvoyé.
  const [compte, setCompte] = useState<{ pour: EtatSignalement; n: number }>({ pour: etat, n: etat.commentaire?.length ?? 0 });
  const longueur = compte.pour === etat ? compte.n : etat.commentaire?.length ?? 0;
  const uid = useId();
  const erreurRef = useRef<HTMLParagraphElement>(null);
  const confirmationRef = useRef<HTMLParagraphElement>(null);
  const texteRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (etat.erreur) erreurRef.current?.focus();
    // Après l'envoi, le bouton et le formulaire disparaissent : le focus va sur la confirmation.
    else if (etat.ok) confirmationRef.current?.focus();
  }, [etat]);
  // À l'ouverture, le focus entre dans le formulaire (il apparaît après le bouton).
  useEffect(() => { if (ouvert) texteRef.current?.focus(); }, [ouvert]);
  const champ = `signaler-${uid}`;
  const panneau = `panneau-${uid}`;
  const basculer = () => {
    // Le champ est recréé à la réouverture avec le dernier commentaire renvoyé : le compteur repart de là.
    setCompte({ pour: etat, n: etat.commentaire?.length ?? 0 });
    setOuvert(!ouvert);
  };
  return (
    <div className="signaler">
      {/* Région toujours présente et rendue (masquée visuellement si vide) : la confirmation est annoncée. */}
      <p ref={confirmationRef} tabIndex={-1} role="status" className="message-info">
        {etat.ok ? 'Merci : la question est retirée des quiz le temps de la relecture.' : ''}
      </p>
      {!etat.ok && (
        <>
          <button type="button" className="bouton bouton-secondaire" aria-expanded={ouvert}
            aria-controls={ouvert ? panneau : undefined} onClick={basculer}>
            Signaler une erreur<span className="sr-only"> : {libelle}</span>
          </button>
          {ouvert && (
            <form id={panneau} action={envoyer} className="formulaire formulaire-signaler" aria-label={`Signaler une erreur : ${libelle}`}>
              <input type="hidden" name="question" value={questionId} />
              <div className="champ">
                <label htmlFor={champ}>Qu’est-ce qui ne va pas ?</label>
                <textarea ref={texteRef} id={champ} name="commentaire" rows={3} minLength={5} maxLength={1000} required
                  defaultValue={etat.commentaire ?? ''} onChange={(e) => setCompte({ pour: etat, n: e.target.value.length })}
                  aria-describedby={`${champ}-aide`} />
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
