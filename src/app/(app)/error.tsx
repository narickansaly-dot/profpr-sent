'use client';

export default function ErreurApplication({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="carte" role="alert">
      <h1>Oups, quelque chose n’a pas marché.</h1>
      <p>Réessaie dans un instant.</p>
      <button type="button" className="bouton bouton-principal" onClick={() => reset()}>Réessayer</button>
    </section>
  );
}
