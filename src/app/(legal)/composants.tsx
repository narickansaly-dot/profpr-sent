/** Donnée réelle de l’éditeur que le texte ne peut pas inventer : repérable à l’écran et par recherche (« À compléter »). */
export function ACompleter({ children }: { children: React.ReactNode }) {
  return <strong className="a-completer">[À&nbsp;compléter&nbsp;: {children}]</strong>;
}

export function NoteJuriste() {
  return (
    <p role="note" className="note-juriste">
      Trame à compléter et à faire relire par un juriste avant la mise en vente.
    </p>
  );
}
