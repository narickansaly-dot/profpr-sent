export const metadata = { title: 'Hors connexion' };
// Pas de rendu statique : le nonce de la CSP doit figurer sur les scripts de chaque réponse (le layout racine le force).

export default function PageHorsLigne() {
  return (
    <main id="contenu" tabIndex={-1} className="page-auth">
      <h1>Tu es hors connexion</h1>
      <p>Cette page n’a pas encore été ouverte sur cet appareil : elle n’est pas disponible sans réseau.</p>
      <p>Les chapitres que tu as déjà ouverts restent lisibles. Les quiz et les évaluations demandent une connexion.</p>
      {/* Lien classique (pas de navigation côté client) : il recharge vraiment la page. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <p><a href="/" className="bouton bouton-principal">Réessayer</a></p>
    </main>
  );
}
