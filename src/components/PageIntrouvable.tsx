import Link from 'next/link';

// Rendu côté serveur, sans donnée de session. `avecMain` : faux quand un layout fournit déjà le <main> (pages de l'espace connecté).
export function PageIntrouvable({ avecMain }: { avecMain: boolean }) {
  const contenu = (
    <>
      <h1>Page introuvable</h1>
      <p>Cette page n’existe pas ou a été déplacée.</p>
      <p><Link href="/" className="bouton bouton-principal">Retour à l’accueil</Link></p>
    </>
  );
  return avecMain
    ? <main id="contenu" tabIndex={-1} className="page-auth">{contenu}</main>
    : <div className="page-auth"><title>Page introuvable · App lycée</title>{contenu}</div>;
}
