import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lireChapitre } from '@/lib/contenu/requetes';
import { ContenuChapitre } from '@/components/ContenuChapitre';
import { MarqueurLecture } from '@/components/MarqueurLecture';
import { BlocQuiz } from '@/components/BlocQuiz';
import { MiseEnCachePage } from '@/components/MiseEnCachePage';

type Params = { params: Promise<{ slug: string; chapitre: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug, chapitre } = await params;
  const r = await lireChapitre(slug, chapitre);
  return { title: r?.chapitre.titre ?? 'Chapitre' };
}

export default async function PageChapitre({ params }: Params) {
  const { slug, chapitre } = await params;
  const r = await lireChapitre(slug, chapitre);
  if (!r) notFound();
  const { cours, chapitre: ch, precedent, suivant } = r;
  return (
    <article style={{ '--couleur-cours': cours.couleur } as React.CSSProperties}>
      <Link href={`/cours/${cours.slug}`}>← {cours.titre}</Link>
      <p className="pastille">Chapitre {ch.numero}{ch.duree ? ` · ${ch.duree}` : ''}</p>
      <h1>{ch.titre}</h1>
      {ch.chapeau && <p><strong>{ch.chapeau}</strong></p>}
      {ch.objectifs.length > 0 && (
        <div className="carte">
          <h2>À la fin du chapitre, tu sais :</h2>
          <ul>{ch.objectifs.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
      )}
      <ContenuChapitre sections={ch.sections} aRetenir={ch.a_retenir} />
      <MiseEnCachePage />
      <MarqueurLecture chapitreId={ch.id} />
      <BlocQuiz chapitreId={ch.id} />
      <nav className="navigation-chapitres" aria-label="Chapitres">
        {precedent ? <Link className="bouton bouton-secondaire" href={`/cours/${cours.slug}/${precedent.slug}`}>← {precedent.titre_court ?? precedent.titre}</Link> : <span />}
        {suivant && <Link className="bouton bouton-principal" href={`/cours/${cours.slug}/${suivant.slug}`}>{suivant.titre_court ?? suivant.titre} →</Link>}
      </nav>
    </article>
  );
}
