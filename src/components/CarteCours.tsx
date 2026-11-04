import Link from 'next/link';
import { BarreProgression } from './BarreProgression';

// sansProgression : catalogue de l'enseignant ou de l'admin, qui n'ont pas de progression propre.
type Props = { slug: string; titre: string; matiere: string; couleur: string; nbChapitres: number; nbValides?: number; sansProgression?: boolean };

export function CarteCours({ slug, titre, matiere, couleur, nbChapitres, nbValides = 0, sansProgression = false }: Props) {
  return (
    <Link href={`/cours/${slug}`} className="carte carte-cours" style={{ '--couleur-cours': couleur } as React.CSSProperties}>
      <span className="pastille">{matiere}</span>
      <h3>{titre}</h3>
      {sansProgression ? (
        <p>{nbChapitres} chapitre{nbChapitres > 1 ? 's' : ''}</p>
      ) : (
        <>
          <BarreProgression valeur={nbValides} max={nbChapitres} libelle={`Progression en ${matiere}`} />
          <p>{nbValides} / {nbChapitres} chapitre{nbChapitres > 1 ? 's' : ''} validé{nbChapitres > 1 ? 's' : ''}</p>
        </>
      )}
    </Link>
  );
}
