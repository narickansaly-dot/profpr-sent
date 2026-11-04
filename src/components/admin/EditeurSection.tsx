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
  onChange: (p: Partial<SectionSaisie>) => void; onMonter: () => void; onDescendre: () => void; onSupprimer: () => void;
};

/** Insère `texte` à la position du curseur (ou remplace la sélection) et remet le curseur après l'insertion. */
export function inserer(zone: HTMLTextAreaElement | null, valeur: string, texte: string): { valeur: string; curseur: number } {
  const debut = zone?.selectionStart ?? valeur.length;
  const fin = zone?.selectionEnd ?? valeur.length;
  return { valeur: valeur.slice(0, debut) + texte + valeur.slice(fin), curseur: debut + texte.length };
}

export function EditeurSection({ section, position, total, coursSlug, onChange, onMonter, onDescendre, onSupprimer }: Props) {
  const zone = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const n = position + 1;
  function insererTexte(texte: string) {
    const r = inserer(zone.current, section.html, texte);
    onChange({ html: r.valeur });
    requestAnimationFrame(() => { zone.current?.focus(); zone.current?.setSelectionRange(r.curseur, r.curseur); });
  }
  return (
    <fieldset className="section-editeur">
      <legend>Section {n}{section.titre ? ` — ${section.titre}` : ''}</legend>
      <div className="ligne-champs">
        <label>
          Titre de la section
          <input type="text" required maxLength={200} autoComplete="off" value={section.titre} onChange={(e) => onChange({ titre: e.target.value })} />
        </label>
        <label>
          Identifiant
          <input type="text" required maxLength={64} pattern="[a-z][a-z0-9\-]{0,63}" autoComplete="off" spellCheck={false}
            value={section.id} onChange={(e) => onChange({ id: e.target.value })} />
        </label>
      </div>
      <div className="barre-insertion" role="toolbar" aria-label={`Insérer dans la section ${n}`}>
        <span className="etiquette">Insérer</span>
        {MODELES.map((m) => (
          <button key={m.nom} type="button" className="bouton bouton-secondaire bouton-compact" onClick={() => insererTexte(m.html)}>{m.nom}</button>
        ))}
        <DepotSchema coursSlug={coursSlug} onInsere={insererTexte} />
      </div>
      <label htmlFor={`${id}-html`}>HTML de la section {n}</label>
      <textarea id={`${id}-html`} ref={zone} className="zone-html" rows={16} spellCheck={false} value={section.html}
        onChange={(e) => onChange({ html: e.target.value })} />
      <div className="actions-formulaire">
        <button type="button" className="bouton bouton-secondaire bouton-compact" onClick={onMonter} disabled={position === 0}>Monter<span className="sr-only"> la section {n}</span></button>
        <button type="button" className="bouton bouton-secondaire bouton-compact" onClick={onDescendre} disabled={position === total - 1}>Descendre<span className="sr-only"> la section {n}</span></button>
        <button type="button" className="bouton bouton-secondaire bouton-compact bouton-danger"
          onClick={() => { if (confirm(`Supprimer la section ${n} (« ${section.titre || 'sans titre'} ») ?`)) onSupprimer(); }}>Supprimer<span className="sr-only"> la section {n}</span></button>
      </div>
    </fieldset>
  );
}
