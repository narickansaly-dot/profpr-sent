import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lireCours } from '@/lib/contenu/requetes';

export default async function PageCours({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cours = await lireCours(slug);
  if (!cours) notFound();
  return (
    <div style={{ '--couleur-cours': cours.couleur } as React.CSSProperties}>
      <p className="pastille">{cours.matiere}</p>
      <h1>{cours.titre}</h1>
      {cours.chapitre.length === 0 ? (
        <p className="carte">Ton essai est terminé : ce cours n’est plus accessible pour le moment.</p>
      ) : (
        <ol className="liste-chapitres">
          {cours.chapitre.map((ch) => (
            <li key={ch.slug}>
              <Link href={`/cours/${cours.slug}/${ch.slug}`} className="carte">
                <span className="numero-chapitre">{ch.numero}</span>
                <span><strong>{ch.titre}</strong><br /><small>{ch.resume}</small></span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
