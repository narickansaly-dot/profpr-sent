import Link from 'next/link';
import { deconnecter } from '@/app/(auth)/actions';

export function EnTete({ prenom }: { prenom: string | null }) {
  return (
    <header className="en-tete">
      <Link href="/" className="logo">App lycée</Link>
      <nav aria-label="Navigation principale"><Link href="/">Mes cours</Link></nav>
      <form action={deconnecter}>
        <button type="submit" className="bouton bouton-secondaire" aria-label="Se déconnecter">
          {prenom ?? 'Mon compte'} · Quitter
        </button>
      </form>
    </header>
  );
}
