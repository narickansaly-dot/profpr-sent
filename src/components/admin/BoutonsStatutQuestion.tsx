'use client';

import { useActionState, type FormEvent } from 'react';
import { changerStatut, supprimerQuestion, type EtatStatut } from '@/app/(app)/admin/questions/actions';

const ACTIONS: Record<string, { statut: string; libelle: string; principal?: boolean }[]> = {
  brouillon: [{ statut: 'a_relire', libelle: 'Envoyer en relecture', principal: true }],
  a_relire: [{ statut: 'valide', libelle: 'Valider', principal: true }, { statut: 'brouillon', libelle: 'Repasser en brouillon' }],
  valide: [{ statut: 'a_relire', libelle: 'Renvoyer en relecture' }, { statut: 'brouillon', libelle: 'Repasser en brouillon' }],
};

export function BoutonsStatutQuestion({ id, chapitreId, statut, utilisee }: { id: string; chapitreId: string; statut: string; utilisee: boolean }) {
  const [etat, envoyer, enCours] = useActionState<EtatStatut, FormData>(changerStatut, {});
  const [etatSuppr, supprimer, supprEnCours] = useActionState<EtatStatut, FormData>(supprimerQuestion, {});
  const erreur = etat.erreur ?? etatSuppr.erreur;
  const confirmer = (e: FormEvent) => {
    if (!window.confirm('Supprimer définitivement cette question ?')) e.preventDefault();
  };
  return (
    <div className="boutons-statut">
      <div className="actions-bloc">
        {(ACTIONS[statut] ?? []).map((a) => (
          <form key={a.statut} action={envoyer}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="statut" value={a.statut} />
            <button type="submit" disabled={enCours || supprEnCours} aria-describedby={erreur ? 'erreur-statut-question' : undefined}
              className={`bouton ${a.principal ? 'bouton-principal' : 'bouton-secondaire'}`}>{a.libelle}</button>
          </form>
        ))}
        {!utilisee && (
          <form action={supprimer} onSubmit={confirmer}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="chapitre" value={chapitreId} />
            <button type="submit" disabled={enCours || supprEnCours} className="bouton bouton-secondaire bouton-danger">Supprimer</button>
          </form>
        )}
      </div>
      {erreur && <p id="erreur-statut-question" role="alert" className="message-erreur">{erreur}</p>}
    </div>
  );
}
