'use client';

import { useActionState, useId } from 'react';
import { delierParent, genererCodeParent, type EtatParents } from '@/app/mes-donnees/actions';
import { formaterCodeParent } from '@/lib/donnees/parents';

export type ParentRelie = { id: string; nom: string; lieLe: string };

function DelierParent({ parent }: { parent: ParentRelie }) {
  const [etat, envoyer, enCours] = useActionState<EtatParents, FormData>(delierParent, {});
  const id = useId();
  const erreur = `${id}-erreur`;
  return (
    <form action={envoyer} className="formulaire" aria-label={`Ne plus partager avec ${parent.nom}`}>
      <input type="hidden" name="parent" value={parent.id} />
      <label className="case">
        <input type="checkbox" name="comprends" value="oui" required
          aria-invalid={etat.erreur ? true : undefined} aria-describedby={etat.erreur ? erreur : undefined} />
        Je confirme que {parent.nom} ne verra plus ma progression
      </label>
      {etat.erreur && <p id={erreur} role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
      <button type="submit" className="bouton bouton-secondaire" disabled={enCours}>
        {enCours ? 'Envoi…' : 'Ne plus partager avec ce parent'}<span className="sr-only"> ({parent.nom})</span>
      </button>
    </form>
  );
}

function CodeParent() {
  const [etat, envoyer, enCours] = useActionState<EtatParents, FormData>(genererCodeParent, {});
  const id = useId();
  const erreur = `${id}-erreur`;
  return (
    <form action={envoyer} className="formulaire">
      {etat.code && (
        <div role="status">
          <p className="code-parent"><strong>{formaterCodeParent(etat.code)}</strong></p>
          <p>Donne ce code à ton parent. Il est valable 48 heures et ne sert qu’une fois.</p>
        </div>
      )}
      {etat.erreur && <p id={erreur} role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}
        aria-describedby={etat.erreur ? erreur : undefined}>
        {enCours ? 'Création…' : etat.code ? 'Créer un nouveau code' : 'Créer un code pour un parent'}
      </button>
    </form>
  );
}

export function ParentsRelies({ parents, peutGerer }: { parents: ParentRelie[]; peutGerer: boolean }) {
  return (
    <>
      {parents.length === 0 ? <p>Aucun parent n’est relié à ton compte.</p> : (
        <ul className="liste-parents">
          {parents.map((p) => (
            <li key={p.id}>
              <p><strong>{p.nom}</strong>, relié le {p.lieLe}</p>
              {peutGerer && <DelierParent parent={p} />}
            </li>
          ))}
        </ul>
      )}
      {peutGerer
        ? <CodeParent />
        : <p>Ton parent se relie à ton compte avec l’adresse qui a reçu la demande d’accord.</p>}
    </>
  );
}
