'use client';

import { useActionState } from 'react';
import { creerClasse, definirCours, retirerEleve, type EtatClasse, type EtatCours } from '@/app/(app)/enseignant/actions';

export type GroupeCours = { nom: string; cours: { id: string; titre: string }[] };

function ChoixCours({ groupes, coches }: { groupes: GroupeCours[]; coches?: string[] }) {
  return (
    <>
      {groupes.map((g) => (
        <fieldset key={g.nom} className="groupe-cours">
          <legend>{g.nom}</legend>
          {g.cours.map((c) => (
            <label key={c.id} className="case">
              <input type="checkbox" name="cours" value={c.id} defaultChecked={coches?.includes(c.id)} />
              {c.titre}
            </label>
          ))}
        </fieldset>
      ))}
    </>
  );
}

export function FormulaireClasse({ groupes, filieres, niveaux }: {
  groupes: GroupeCours[]; filieres: { id: string; nom: string }[]; niveaux: readonly string[];
}) {
  const [etat, envoyer, enCours] = useActionState<EtatClasse, FormData>(creerClasse, {});
  return (
    <form action={envoyer} className="formulaire formulaire-classe">
      <label>
        Nom de la classe
        <input name="nom" type="text" required minLength={2} maxLength={60} autoComplete="off" defaultValue={etat.nom ?? ''} />
      </label>
      <div className="ligne-champs">
        <label>
          Filière (facultatif)
          <select name="filiereId" defaultValue="">
            <option value="">Aucune</option>
            {filieres.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
          </select>
        </label>
        <label>
          Niveau (facultatif)
          <select name="niveau" defaultValue="">
            <option value="">Aucun</option>
            {niveaux.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>
      <div className="choix-cours">
        <p className="titre-choix">Cours de la classe</p>
        <ChoixCours groupes={groupes} />
      </div>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>{enCours ? 'Création…' : 'Créer la classe'}</button>
    </form>
  );
}

export function FormulaireCours({ classeId, groupes, coches }: { classeId: string; groupes: GroupeCours[]; coches: string[] }) {
  const [etat, envoyer, enCours] = useActionState<EtatCours, FormData>(definirCours, {});
  return (
    <form action={envoyer} className="formulaire">
      <input type="hidden" name="classe" value={classeId} />
      <ChoixCours groupes={groupes} coches={coches} />
      <p className="aide-champ">Retirer un cours supprime aussi son échéance.</p>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>{enCours ? 'Enregistrement…' : 'Enregistrer les cours'}</button>
    </form>
  );
}

export function BoutonRetirerEleve({ classeId, eleveId, nom }: { classeId: string; eleveId: string; nom: string }) {
  return (
    <form
      action={retirerEleve}
      onSubmit={(e) => {
        if (!window.confirm(`Retirer ${nom} de la classe ? Tu ne verras plus sa progression.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="classe" value={classeId} />
      <input type="hidden" name="eleve" value={eleveId} />
      <button type="submit" className="bouton bouton-secondaire bouton-compact">
        Retirer<span className="sr-only"> {nom} de la classe</span>
      </button>
    </form>
  );
}
