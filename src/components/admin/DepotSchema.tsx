'use client';

import { useId, useRef, useState } from 'react';
import { creerClientNavigateur } from '@/lib/supabase/client';

const TAILLE_MAX = 2 * 1024 * 1024;
const TYPES: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

const echapper = (t: string) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Dépose une image dans le bucket public « schemas » et renvoie la figure à insérer dans la section.
 * `libelle` (par exemple « section 2 ») complète les noms accessibles quand plusieurs sections sont affichées.
 */
export function DepotSchema({ coursSlug, libelle, onInsere }: { coursSlug: string; libelle: string; onInsere: (html: string) => void }) {
  const [ouvert, setOuvert] = useState(false);
  const [alt, setAlt] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);
  const fichier = useRef<HTMLInputElement>(null);
  const declencheur = useRef<HTMLButtonElement>(null);
  const id = useId();

  const fermer = () => {
    setOuvert(false);
    setErreur('');
    requestAnimationFrame(() => declencheur.current?.focus());
  };

  async function deposer() {
    setErreur('');
    const f = fichier.current?.files?.[0];
    if (!f) return setErreur('Choisis d’abord une image.');
    const ext = TYPES[f.type];
    if (!ext) return setErreur('Ce type de fichier n’est pas accepté : choisis une image PNG, JPEG ou WebP.');
    if (f.size > TAILLE_MAX) return setErreur('Cette image est trop lourde : elle doit faire 2 Mo au maximum.');
    if (!alt.trim()) return setErreur('Décris l’image dans le texte alternatif : il est obligatoire.');
    setEnCours(true);
    try {
      const supabase = creerClientNavigateur();
      const chemin = `${coursSlug}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from('schemas').upload(chemin, f, { contentType: f.type, upsert: false });
      if (error) return setErreur('L’envoi a échoué. Vérifie ta connexion et réessaie.');
      const { data } = supabase.storage.from('schemas').getPublicUrl(chemin);
      // Pas de légende recopiée de l'alt : l'enseignant ajoute un <figcaption> s'il en veut une.
      onInsere(`<figure class="fig small"><img src="${data.publicUrl}" alt="${echapper(alt.trim())}" loading="lazy"></figure>`);
      setAlt('');
      if (fichier.current) fichier.current.value = '';
      setOuvert(false);
    } catch {
      setErreur('L’envoi a échoué. Vérifie ta connexion et réessaie.');
    } finally {
      setEnCours(false);
    }
  }

  return (
    <>
      <button ref={declencheur} type="button" className="bouton bouton-secondaire bouton-compact" aria-expanded={ouvert} aria-controls={`${id}-p`}
        onClick={() => { setOuvert(true); requestAnimationFrame(() => fichier.current?.focus()); }}>
        Image…<span className="sr-only"> dans la {libelle}</span>
      </button>
      {ouvert && (
        <div id={`${id}-p`} className="depot-schema" role="group" aria-labelledby={`${id}-t`}>
          <p id={`${id}-t`} className="etiquette">Déposer une image dans la {libelle} (PNG, JPEG ou WebP, 2 Mo au maximum)</p>
          <label htmlFor={`${id}-f`}>Fichier</label>
          <input id={`${id}-f`} ref={fichier} type="file" accept="image/png,image/jpeg,image/webp" />
          <label htmlFor={`${id}-a`}>Texte alternatif (obligatoire)</label>
          <input id={`${id}-a`} type="text" value={alt} maxLength={300} autoComplete="off" onChange={(e) => setAlt(e.target.value)} />
          {erreur && <p role="alert" className="message-erreur">{erreur}</p>}
          <div className="actions-formulaire">
            <button type="button" className="bouton bouton-principal bouton-compact" onClick={deposer} disabled={enCours}>{enCours ? 'Envoi…' : 'Déposer et insérer'}</button>
            <button type="button" className="bouton bouton-secondaire bouton-compact" onClick={fermer} disabled={enCours}>Annuler</button>
          </div>
        </div>
      )}
    </>
  );
}
