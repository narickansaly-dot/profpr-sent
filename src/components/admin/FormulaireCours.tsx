'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { enregistrerCours, type ChampCours, type EtatCours, type ValeursCours } from '@/app/(app)/admin/actions';

type Filiere = { code: string; nom: string };

const VIDE: ValeursCours = { slug: '', filiere: '', niveau: '', matiere: '', titre: '', couleur: '#2563eb', ordre: '0' };

export function FormulaireCours({ coursId, initial, filieres, niveaux }: {
  coursId?: string; initial?: ValeursCours; filieres: Filiere[]; niveaux: readonly string[];
}) {
  const [etat, envoyer, enCours] = useActionState<EtatCours, FormData>(enregistrerCours, {});
  const v = etat.valeurs ?? initial ?? VIDE;
  const [saisie, setSaisie] = useState<{ cle: string; couleur: string; titre: string; matiere: string }>({ cle: '', couleur: '', titre: '', matiere: '' });
  // Après une erreur serveur, React réinitialise les champs non contrôlés : on repart de la valeur renvoyée.
  const cle = JSON.stringify(etat.valeurs ?? null);
  const courant = saisie.cle === cle ? saisie : { cle, couleur: v.couleur, titre: v.titre, matiere: v.matiere };
  const maj = (p: Partial<typeof courant>) => setSaisie({ ...courant, ...p });
  const hexValide = /^#[0-9a-f]{6}$/i.test(courant.couleur);
  const erreurs = etat.erreurs ?? {};
  const formRef = useRef<HTMLFormElement>(null);
  // Après une erreur, le formulaire est remonté : le focus va au premier champ invalide, ou au message général.
  useEffect(() => {
    if (!etat.valeurs) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], #erreur-generale')?.focus();
  }, [etat]);
  const decrit = (c: ChampCours, aide?: string) => [erreurs[c] ? `erreur-${c}` : '', aide ?? ''].filter(Boolean).join(' ') || undefined;
  const champ = (c: ChampCours, aide?: string) => ({ 'aria-invalid': erreurs[c] ? true : undefined, 'aria-describedby': decrit(c, aide) });
  const erreur = (c: ChampCours) => erreurs[c] ? <p id={`erreur-${c}`} role="alert" className="message-erreur">{erreurs[c]}</p> : null;

  return (
    <form action={envoyer} className="formulaire formulaire-cours" key={cle} ref={formRef}>
      {coursId && <input type="hidden" name="id" value={coursId} />}
      <div className="champ">
        <label htmlFor="champ-titre">Titre du cours</label>
        <input id="champ-titre" name="titre" type="text" required maxLength={200} autoComplete="off" defaultValue={v.titre}
          onChange={(e) => maj({ titre: e.target.value })} {...champ('titre')} />
        {erreur('titre')}
      </div>
      <div className="ligne-champs">
        <div className="champ">
          <label htmlFor="champ-filiere">Filière</label>
          <select id="champ-filiere" name="filiere" required defaultValue={v.filiere} {...champ('filiere')}>
            <option value="" disabled>Choisir…</option>
            {filieres.map((f) => <option key={f.code} value={f.code}>{f.nom}</option>)}
          </select>
          {erreur('filiere')}
        </div>
        <div className="champ">
          <label htmlFor="champ-niveau">Niveau</label>
          <select id="champ-niveau" name="niveau" required defaultValue={v.niveau} {...champ('niveau')}>
            <option value="" disabled>Choisir…</option>
            {niveaux.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {erreur('niveau')}
        </div>
      </div>
      <div className="ligne-champs">
        <div className="champ">
          <label htmlFor="champ-matiere">Matière</label>
          <input id="champ-matiere" name="matiere" type="text" required maxLength={120} autoComplete="off" defaultValue={v.matiere}
            onChange={(e) => maj({ matiere: e.target.value })} {...champ('matiere')} />
          {erreur('matiere')}
        </div>
        <div className="champ">
          <label htmlFor="champ-ordre">Ordre d’affichage</label>
          <input id="champ-ordre" name="ordre" type="number" inputMode="numeric" min={0} max={9999} step={1} required defaultValue={v.ordre} {...champ('ordre')} />
          {erreur('ordre')}
        </div>
      </div>
      <div className="champ">
        <label htmlFor="champ-slug">Identifiant d’URL (slug)</label>
        <input id="champ-slug" name="slug" type="text" required maxLength={80} pattern="[a-z0-9\-]{1,80}" autoComplete="off" spellCheck={false}
          defaultValue={v.slug} {...champ('slug', 'aide-slug')} />
        <span id="aide-slug" className="aide-champ">Lettres minuscules, chiffres et tirets, par exemple bph-1re-st2s.</span>
        {erreur('slug')}
      </div>
      <div className="champ champ-couleur">
        <label htmlFor="couleur-texte">Couleur du cours</label>
        <div className="ligne-couleur">
          <input type="color" aria-label="Choisir la couleur avec le sélecteur" className="selecteur-couleur"
            value={hexValide ? courant.couleur.toLowerCase() : '#2563eb'} onChange={(e) => maj({ couleur: e.target.value })} />
          <input id="couleur-texte" name="couleur" type="text" required maxLength={7} autoComplete="off" spellCheck={false}
            className="saisie-couleur" value={courant.couleur} onChange={(e) => maj({ couleur: e.target.value })}
            {...champ('couleur', 'aide-couleur')} />
        </div>
        <span id="aide-couleur" className="aide-champ">Format #rrggbb. Elle sert de bordure et d’accent : assez foncée pour être lisible sur fond blanc.</span>
        {erreur('couleur')}
      </div>
      <div className="apercu-cours">
        <p className="etiquette">Aperçu de la carte du cours</p>
        <div className="carte carte-cours apercu-carte" style={{ ['--couleur-cours' as string]: hexValide ? courant.couleur : '#2563eb' }}>
          <span className="pastille">{courant.matiere || 'Matière'}</span>
          <h3>{courant.titre || 'Titre du cours'}</h3>
        </div>
      </div>
      {etat.erreur && <p id="erreur-generale" tabIndex={-1} role="alert" className="message-erreur">{etat.erreur}</p>}
      <div className="actions-formulaire">
        <button type="submit" className="bouton bouton-principal" disabled={enCours}>{enCours ? 'Enregistrement…' : 'Enregistrer le cours'}</button>
        <Link href="/admin" className="bouton bouton-secondaire">Annuler</Link>
      </div>
    </form>
  );
}
