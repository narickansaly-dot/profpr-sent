import Link from 'next/link';

// Pages publiques : lisibles sans connexion (voir ROUTES_PUBLIQUES). Le pied de page vient du layout racine.
export default function LayoutLegal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="en-tete">
        <Link href="/" className="logo">App lycée</Link>
      </header>
      <main id="contenu" tabIndex={-1} className="page-legale">{children}</main>
    </>
  );
}
