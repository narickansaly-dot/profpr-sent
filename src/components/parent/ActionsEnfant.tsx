'use client';

import { useActionState, useId, type ReactNode } from 'react';
import { annulerRetrait, delier, retirerAccord, type EtatAction } from '@/app/(app)/parent/actions';

type ActionServeur = (etat: EtatAction, form: FormData) => Promise<EtatAction>;

function FormulaireConfirme({ action, eleveId, titre, explication, libelleCase, bouton, danger }: {
  action: ActionServeur; eleveId: string; titre: string; explication: ReactNode; libelleCase: string; bouton: string; danger?: boolean;
}) {
  const [etat, envoyer, enCours] = useActionState<EtatAction, FormData>(action, {});
  const id = useId();
  const erreur = `${id}-erreur`;
  return (
    <form action={envoyer} className="formulaire carte formulaire-confirme" aria-labelledby={`${id}-titre`}>
      <h3 id={`${id}-titre`}>{titre}</h3>
      <p>{explication}</p>
      <input type="hidden" name="eleveId" value={eleveId} />
      <label className="case">
        <input type="checkbox" name="confirme" aria-describedby={etat.erreur ? erreur : undefined} aria-invalid={etat.erreur ? true : undefined} />
        {libelleCase}
      </label>
      {etat.erreur && <p id={erreur} role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className={`bouton bouton-secondaire${danger ? ' bouton-danger' : ''}`} disabled={enCours}>
        {enCours ? 'Enregistrement…' : bouton}
      </button>
    </form>
  );
}

type Props = { eleveId: string; nom: string; peutRetirer: boolean; retireParMoi: boolean };

export function ActionsEnfant({ eleveId, nom, peutRetirer, retireParMoi }: Props) {
  return (
    <section className="actions-enfant" aria-labelledby="titre-actions">
      <h2 id="titre-actions">Gérer le compte de {nom}</h2>
      {peutRetirer && (
        <FormulaireConfirme action={retirerAccord} eleveId={eleveId} titre="Retirer mon accord" danger
          explication="Le compte de votre enfant sera bloqué immédiatement, puis supprimé définitivement dans 30 jours. Vous pourrez annuler pendant ce délai."
          libelleCase="Je comprends que le compte sera bloqué puis supprimé." bouton="Retirer mon accord" />
      )}
      {retireParMoi && (
        <FormulaireConfirme action={annulerRetrait} eleveId={eleveId} titre="Annuler le retrait"
          explication="Le compte de votre enfant sera réactivé et sa suppression annulée."
          libelleCase="Je confirme vouloir rétablir mon accord." bouton="Annuler le retrait" />
      )}
      <FormulaireConfirme action={delier} eleveId={eleveId} titre="Ne plus suivre cet enfant" danger
        explication="Vous ne verrez plus sa progression. Pour le suivre de nouveau, il faudra un nouveau code."
        libelleCase="Je confirme ne plus vouloir suivre cet enfant." bouton="Ne plus suivre cet enfant" />
    </section>
  );
}
