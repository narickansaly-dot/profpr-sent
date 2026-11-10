import Link from 'next/link';

export function PiedDePage() {
  return (
    <footer className="pied-de-page">
      <nav aria-label="Informations légales">
        <ul>
          <li><Link href="/mentions-legales">Mentions légales</Link></li>
          <li><Link href="/confidentialite">Confidentialité</Link></li>
          <li><Link href="/conditions-utilisation">Conditions d’utilisation</Link></li>
          <li><Link href="/conditions-vente">Conditions de vente</Link></li>
          <li><Link href="/mes-donnees">Mes données</Link></li>
        </ul>
      </nav>
    </footer>
  );
}
