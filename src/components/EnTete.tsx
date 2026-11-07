import Link from 'next/link';
import { BoutonDeconnexion } from '@/components/BoutonDeconnexion';

// « attente » : demande enseignant en cours de vérification, aucune page n'est encore accessible.
type Role = 'eleve' | 'parent' | 'enseignant' | 'admin_contenu' | 'attente';

const LIENS: Record<Role, { href: string; libelle: string }[]> = {
  attente: [],
  eleve: [{ href: '/', libelle: 'Mes cours' }, { href: '/calendrier', libelle: 'Calendrier' }, { href: '/classes', libelle: 'Mes classes' }],
  parent: [{ href: '/', libelle: 'Mes cours' }],
  enseignant: [{ href: '/enseignant', libelle: 'Mes classes' }, { href: '/cours', libelle: 'Cours' }, { href: '/enseignant/signalements', libelle: 'Signalements' }],
  admin_contenu: [
    { href: '/admin', libelle: 'Contenu' }, { href: '/admin/import', libelle: 'Import' },
    { href: '/admin/signalements', libelle: 'Signalements' }, { href: '/admin/enseignants', libelle: 'Demandes' },
  ],
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
      <BoutonDeconnexion prenom={prenom} />
    </header>
  );
}
