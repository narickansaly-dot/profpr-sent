import Link from 'next/link';

type Props = { slug: string; titre: string; matiere: string; couleur: string; nbChapitres: number };

export function CarteCours({ slug, titre, matiere, couleur, nbChapitres }: Props) {
  return (
    <Link href={`/cours/${slug}`} className="carte carte-cours" style={{ '--couleur-cours': couleur } as React.CSSProperties}>
      <span className="pastille">{matiere}</span>
      <h2>{titre}</h2>
      <p>{nbChapitres} chapitre{nbChapitres > 1 ? 's' : ''}</p>
    </Link>
  );
}
