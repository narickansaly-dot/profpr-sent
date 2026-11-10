'use client';

import { useEffect, useRef } from 'react';

/** Délai avant l'insertion : les lecteurs d'écran ignorent parfois une région modifiée juste après le chargement. */
const DELAI_ANNONCE = 300;

/**
 * Région de statut toujours présente : le texte n'est inséré qu'après le montage et un court délai,
 * ce qui le fait annoncer même quand la page vient d'être chargée par une redirection.
 * `cle` (un compteur ou un horodatage de l'URL) force une nouvelle annonce quand le même texte revient :
 * la région est vidée, puis le texte est réinséré.
 */
export function MessageStatut({ texte, cle }: { texte: string; cle?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = '';
    if (!texte) return;
    const t = setTimeout(() => { el.textContent = texte; }, DELAI_ANNONCE);
    return () => clearTimeout(t);
  }, [texte, cle]);
  return <p ref={ref} role="status" className="message-info" />;
}
