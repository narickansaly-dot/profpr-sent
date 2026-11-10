'use client';

import { useId, useRef } from 'react';
import { DepotSchema } from './DepotSchema';

export type SectionSaisie = { cle: string; id: string; titre: string; html: string };

const MODELES: { nom: string; html: string }[] = [
  { nom: 'Définition', html: '<div class="def"><b class="t">Définition</b><p>…</p></div>' },
  { nom: 'Attention', html: '<div class="warn"><b class="t">Attention</b><p>…</p></div>' },
  { nom: 'Tableau', html: '<div class="tbl"><table><thead><tr><th>…</th></tr></thead><tbody><tr><td>…</td></tr></tbody></table></div>' },
  { nom: 'Schéma SVG', html: '<figure class="fig"><div class="scroll"><svg viewBox="0 0 400 200" role="img" aria-label="…"></svg></div><figcaption>…</figcaption></figure>' },
];

type Props = {
  section: SectionSaisie; position: number; total: number; coursSlug: string;
  /** Vrai quand l'erreur d'enregistrement porte sur cette section (le message est dans #erreur-chapitre). */
  enErreur?: boolean;
  onChange: (p: Partial<SectionSaisie>) => void; onMonter: () => void; onDescendre: () => void; onSupprimer: () => void;
};

/** Insère `texte` à la position du curseur (ou remplace la sélection) et donne la nouvelle valeur et la place du curseur. */
export function inserer(valeur: string, debut: number, fin: number, texte: string): { valeur: string; curseur: number } {
  return { valeur: valeur.slice(0, debut) + texte + valeur.slice(fin), curseur: debut + texte.length };
}

export function EditeurSection({ section, position, total, coursSlug, enErreur = false, onChange, onMonter, onDescendre, onSupprimer }: Props) {
  const zone = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const n = position + 1;
  // Nom accessible : numéro et titre, pour que « Monter » ne soit jamais ambigu.
  const nom = `section ${n}${section.titre ? ` « ${section.titre} »` : ''}`;
  function insererTexte(texte: string) {
    const z = zone.current;
    if (!z) return;
    // On part de la valeur actuelle de la zone (pas d'une copie d'un rendu précédent) : une frappe pendant un envoi reste.
    const r = inserer(z.value, z.selectionStart, z.selectionEnd, texte);
    onChange({ html: r.valeur });
    requestAnimationFrame(() => { z.focus(); z.setSelectionRange(r.curseur, r.curseur); });
  }
  return (
    <fieldset className="section-editeur">
      <legend>Section {n}{section.titre ? ` — ${section.titre}` : ''}</legend>
      <div className="ligne-champs">
        <label>
          Titre de la section {n}
          <input id={`titre-${section.cle}`} aria-invalid={enErreur || undefined} aria-describedby={enErreur ? 'erreur-chapitre' : undefined}
            type="text" required maxLength={200} autoComplete="off" value={section.titre} onChange={(e) => onChange({ titre: e.target.value })} />
        </label>
        <label>
          Identifiant de la section {n}
          <input type="text" required maxLength={64} pattern="[a-z][a-z0-9\-]{0,63}" autoComplete="off" spellCheck={false}
            value={section.id} onChange={(e) => onChange({ id: e.target.value })} />
        </label>
      </div>
      <div className="barre-insertion" role="group" aria-label={`Insérer dans la ${nom}`}>
        <span className="etiquette" aria-hidden="true">Insérer</span>
        {MODELES.map((m) => (
          <button key={m.nom} type="button" className="bouton bouton-secondaire bouton-compact" onClick={() => insererTexte(m.html)}>
            {m.nom}<span className="sr-only"> dans la section {n}</span>
          </button>
        ))}
        <DepotSchema coursSlug={coursSlug} libelle={`section ${n}`} onInsere={insererTexte} />
      </div>
      <label htmlFor={`${id}-html`}>HTML de la section {n}</label>
      <textarea id={`${id}-html`} ref={zone} className="zone-html" rows={16} spellCheck={false} value={section.html}
        onChange={(e) => onChange({ html: e.target.value })} />
      <div className="actions-formulaire">
        <button id={`monter-${section.cle}`} type="button" className="bouton bouton-secondaire bouton-compact" onClick={onMonter} disabled={position === 0}>
          Monter<span className="sr-only"> la {nom}</span>
        </button>
        <button id={`descendre-${section.cle}`} type="button" className="bouton bouton-secondaire bouton-compact" onClick={onDescendre} disabled={position === total - 1}>
          Descendre<span className="sr-only"> la {nom}</span>
        </button>
        <button type="button" className="bouton bouton-secondaire bouton-compact bouton-danger"
          onClick={() => { if (confirm(`Supprimer la ${nom} ?`)) onSupprimer(); }}>Supprimer<span className="sr-only"> la {nom}</span></button>
      </div>
    </fieldset>
  );
}
