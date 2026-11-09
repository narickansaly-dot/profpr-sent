'use client';

import { useActionState, useEffect, useId, useRef, type MouseEvent } from 'react';
import { delierParent, genererCodeParent, type EtatParents } from '@/app/mes-donnees/actions';
import { formaterCodeParent, peutCreerCode } from '@/lib/donnees/parents';

export type ParentRelie = { id: string; nom: string; lieLe: string };

type EtatDelier = EtatParents & { parent?: string };

function DelierParent({ parent, etat, envoyer, enCours }: {
  parent: ParentRelie; etat: EtatDelier; envoyer: (form: FormData) => void; enCours: boolean;
}) {
  const id = useId();
  const erreur = `${id}-erreur`;
  const monErreur = etat.parent === parent.id ? etat.erreur : undefined;
  return (
    <form action={envoyer} className="formulaire" aria-label={`Ne plus partager avec ${parent.nom}`}>
      <input type="hidden" name="parent" value={parent.id} />
      <label className="case">
        <input type="checkbox" name="comprends" value="oui" required
          aria-invalid={monErreur ? true : undefined} aria-describedby={monErreur ? erreur : undefined} />
        Je confirme que {parent.nom} ne verra plus ma progression
      </label>
      {monErreur && <p id={erreur} role="alert" className="message-erreur">{monErreur}</p>}
      <button type="submit" className="bouton bouton-secondaire" aria-disabled={enCours || undefined}
        onClick={(e: MouseEvent<HTMLButtonElement>) => { if (enCours) e.preventDefault(); }}>
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
      <button type="submit" className="bouton bouton-principal" aria-disabled={enCours || undefined}
        onClick={(e: MouseEvent<HTMLButtonElement>) => { if (enCours) e.preventDefault(); }}
        aria-describedby={etat.erreur ? erreur : undefined}>
        {enCours ? 'Création…' : etat.code ? 'Créer un nouveau code' : 'Créer un code pour un parent'}
      </button>
    </form>
  );
}

export function ParentsRelies({ parents, peutGerer }: { parents: ParentRelie[]; peutGerer: boolean }) {
  // L'état de la déliaison vit ici, hors de la liste : le message survit à la disparition du parent délié.
  const [etat, envoyer, enCours] = useActionState<EtatDelier, FormData>(
    async (precedent, form) => ({ ...(await delierParent(precedent, form)), parent: String(form.get('parent') ?? '') }),
    {},
  );
  const statut = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (etat.info) statut.current?.focus();
  }, [etat]);
  return (
    <>
      <div role="status" tabIndex={-1} ref={statut} className="message-info">{etat.info ?? ''}</div>
      {parents.length === 0 ? <p>Aucun parent n’est relié à ton compte.</p> : (
        <ul className="liste-parents">
          {parents.map((p) => (
            <li key={p.id}>
              <p><strong>{p.nom}</strong>, relié le {p.lieLe}</p>
              {peutGerer && <DelierParent parent={p} etat={etat} envoyer={envoyer} enCours={enCours} />}
            </li>
          ))}
        </ul>
      )}
      {!peutGerer
        ? <p>Ton parent se relie à ton compte avec l’adresse qui a reçu la demande d’accord.</p>
        : peutCreerCode(parents.length)
          ? <CodeParent />
          : <p>Tu es déjà relié à deux parents.</p>}
    </>
  );
}
