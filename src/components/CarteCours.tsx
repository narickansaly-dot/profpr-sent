import Link from 'next/link';
import { BarreProgression } from './BarreProgression';

type Props = { slug: string; titre: string; matiere: string; couleur: string; nbChapitres: number; nbValides: number };

export function CarteCours({ slug, titre, matiere, couleur, nbChapitres, nbValides }: Props) {
  return (
    <Link href={`/cours/${slug}`} className="carte carte-cours" style={{ '--couleur-cours': couleur } as React.CSSProperties}>
      <span className="pastille">{matiere}</span>
      <h3>{titre}</h3>
      <BarreProgression valeur={nbValides} max={nbChapitres} libelle={`Progression en ${matiere}`} />
      <p>{nbValides} / {nbChapitres} chapitre{nbChapitres > 1 ? 's' : ''} validé{nbValides > 1 ? 's' : ''}</p>
    </Link>
  );
}
