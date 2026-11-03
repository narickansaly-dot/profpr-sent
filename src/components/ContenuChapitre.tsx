import type { Section } from '@/lib/contenu/requetes';

export function ContenuChapitre({ sections, aRetenir }: { sections: Section[]; aRetenir: string | null }) {
  return (
    <div className="contenu-chapitre">
      {sections.map((s) => (
        <section key={s.id} id={s.id}>
          <h2>{s.titre}</h2>
          <div dangerouslySetInnerHTML={{ __html: s.html }} />
        </section>
      ))}
      {aRetenir && (
        <section id="a-retenir" className="carte a-retenir">
          <h2>Je retiens</h2>
          <div dangerouslySetInnerHTML={{ __html: aRetenir }} />
        </section>
      )}
    </div>
  );
}
