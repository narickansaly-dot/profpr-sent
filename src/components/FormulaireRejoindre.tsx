'use client';

import { useActionState } from 'react';
import { rejoindreClasse, quitterClasse } from '@/app/(app)/classes/actions';

export function FormulaireRejoindre({ codeInitial }: { codeInitial: string }) {
  const [etat, envoyer, enCours] = useActionState(rejoindreClasse, {});
  return (
    <form action={envoyer} className="formulaire formulaire-code">
      <label>
        Code de la classe
        <input
          name="code" type="text" required maxLength={12}
          autoComplete="off" autoCapitalize="characters" inputMode="text" spellCheck={false}
          defaultValue={etat.code ?? (etat.info ? '' : codeInitial)}
          aria-describedby={etat.erreur ? 'aide-code erreur-code' : 'aide-code'}
          aria-invalid={etat.erreur ? true : undefined}
        />
      </label>
      <p id="aide-code" className="aide-code">6 caractères (lettres et chiffres, majuscules ou minuscules), donnés par la personne qui t’enseigne.</p>
      {etat.erreur && <p id="erreur-code" role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
      {/* Juste avant le bouton : un lien d'invitation préremplit le code, un seul clic suffit à partager ses résultats. */}
      <p id="info-confidentialite" className="info-confidentialite">
        En rejoignant une classe, tu partages avec la personne qui t’enseigne ta progression et tes notes pour les cours de la classe, y compris tes résultats antérieurs sur ces cours. Tes réponses détaillées et ton calendrier restent privés.
      </p>
      <button type="submit" className="bouton bouton-principal" disabled={enCours} aria-describedby="info-confidentialite">{enCours ? 'Vérification…' : 'Rejoindre'}</button>
    </form>
  );
}

export function BoutonQuitter({ classeId, nom }: { classeId: string; nom: string }) {
  const [etat, envoyer, enCours] = useActionState(quitterClasse, {});
  return (
    <form
      action={envoyer}
      className="quitter-classe"
      onSubmit={(e) => {
        if (!window.confirm('Quitter cette classe ? Tu ne seras plus suivi·e dans cette classe et ta progression ne sera plus visible.')) e.preventDefault();
      }}
    >
      <input type="hidden" name="classe" value={classeId} />
      <button type="submit" className="bouton bouton-secondaire" disabled={enCours} aria-label={`Quitter la classe ${nom}`}>Quitter</button>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
    </form>
  );
}
