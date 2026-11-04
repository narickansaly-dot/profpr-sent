'use client';

import { useEffect, useRef } from 'react';

/**
 * Région de statut toujours présente : le texte n'est inséré qu'après le montage,
 * ce qui le fait annoncer même quand la page vient d'être chargée par une redirection.
 * `cle` (un compteur ou un horodatage de l'URL) force une nouvelle annonce quand le même texte revient :
 * la région est vidée, puis le texte est réinséré.
 */
export function MessageStatut({ texte, cle }: { texte: string; cle?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (cle === undefined || !texte) { el.textContent = texte; return; }
    el.textContent = '';
    const t = setTimeout(() => { el.textContent = texte; }, 60);
    return () => clearTimeout(t);
  }, [texte, cle]);
  return <p ref={ref} role="status" className="message-info" />;
}
