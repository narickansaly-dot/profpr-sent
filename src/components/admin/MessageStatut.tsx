'use client';

import { useEffect, useRef } from 'react';

/**
 * Région de statut toujours présente : le texte n'est inséré qu'après le montage,
 * ce qui le fait annoncer même quand la page vient d'être chargée par une redirection.
 */
export function MessageStatut({ texte }: { texte: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.textContent = texte;
  }, [texte]);
  return <p ref={ref} role="status" className="message-info" />;
}
