'use client';

import { useActionState, useId } from 'react';
import { annulerSuppression, demanderSuppression, type EtatSuppression } from '@/app/mes-donnees/actions';

type Props = { dateSuppression: string | null; enseignant?: boolean; imposee?: boolean; parent?: boolean };

export function SuppressionCompte({ dateSuppression, enseignant = false, imposee = false, parent = false }: Props) {
  const [etatDemande, demander, demandeEnCours] = useActionState<EtatSuppression, FormData>(demanderSuppression, {});
  const [etatAnnulation, annuler, annulationEnCours] = useActionState<EtatSuppression, FormData>(annulerSuppression, {});
  const id = useId();
  const erreurId = `${id}-erreur`;

  if (dateSuppression && imposee) {
    return <p role="status">Ton compte sera supprimé à partir du {dateSuppression}. La suppression a été demandée par ton parent.</p>;
  }
  if (dateSuppression) {
    return (
      <form action={annuler} className="formulaire">
        <p role="status">{parent ? 'Votre' : 'Ton'} compte sera supprimé à partir du {dateSuppression}.</p>
        {etatAnnulation.erreur && <p role="alert" className="message-erreur">{etatAnnulation.erreur}</p>}
        <button type="submit" className="bouton bouton-principal" disabled={annulationEnCours}>
          {annulationEnCours ? 'Annulation…' : 'Annuler la suppression'}
        </button>
      </form>
    );
  }
  return (
    <form action={demander} className="formulaire">
      {parent
        ? <p>Votre compte sera supprimé 30 jours après votre demande. Vous pouvez annuler jusque-là en vous reconnectant.</p>
        : <p>Ton compte et tous tes résultats seront supprimés 30 jours après ta demande. Tu peux annuler jusque-là en te reconnectant.</p>}
      {enseignant && <p>Tes classes seront aussi supprimées&nbsp;: tes élèves en seront retirés et leurs échéances disparaîtront.</p>}
      <label className="case">
        <input type="checkbox" name="comprends" value="oui" required
          aria-invalid={etatDemande.erreur ? true : undefined} aria-describedby={etatDemande.erreur ? erreurId : undefined} />
        Je comprends que la suppression sera définitive
      </label>
      {etatDemande.erreur && <p id={erreurId} role="alert" className="message-erreur">{etatDemande.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={demandeEnCours}>
        {demandeEnCours ? 'Envoi…' : 'Demander la suppression'}
      </button>
    </form>
  );
}
