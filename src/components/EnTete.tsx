import Link from 'next/link';
import { deconnecter } from '@/app/(auth)/actions';

// « attente » : demande enseignant en cours de vérification, aucune page n'est encore accessible.
type Role = 'eleve' | 'parent' | 'enseignant' | 'admin_contenu' | 'attente';

const LIENS: Record<Role, { href: string; libelle: string }[]> = {
  attente: [],
  eleve: [{ href: '/', libelle: 'Mes cours' }, { href: '/classes', libelle: 'Mes classes' }],
  parent: [{ href: '/', libelle: 'Mes cours' }],
  enseignant: [{ href: '/enseignant', libelle: 'Mes classes' }, { href: '/cours', libelle: 'Cours' }],
  admin_contenu: [{ href: '/cours', libelle: 'Cours' }, { href: '/admin/enseignants', libelle: 'Demandes' }],
};

export function EnTete({ prenom, role }: { prenom: string | null; role: Role }) {
  return (
    <header className="en-tete">
      <Link href="/" className="logo">App lycée</Link>
      {LIENS[role].length > 0 && (
        <nav aria-label="Navigation principale">
          {LIENS[role].map((l) => <Link key={l.href} href={l.href}>{l.libelle}</Link>)}
        </nav>
      )}
      <form action={deconnecter}>
        <button type="submit" className="bouton bouton-secondaire bouton-compte">
          <span className="nom-compte">{prenom ?? 'Mon compte'}</span>
          <span aria-hidden="true">·</span>
          <span>Se déconnecter</span>
        </button>
      </form>
    </header>
  );
}
