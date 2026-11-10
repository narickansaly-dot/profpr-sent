import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lireEvenement, optionsCours } from '@/lib/calendrier/requetes';
import { isoVersHeureParis } from '@/lib/enseignant/dates';
import { RAPPELS } from '@/lib/calendrier/schema-evenement';
import { FormulaireEvenement } from '@/components/calendrier/FormulaireEvenement';
import { FormulaireRevisionGenerale } from '@/components/calendrier/FormulaireRevisionGenerale';
import { BoutonSupprimerEvenement } from '@/components/calendrier/BoutonSupprimerEvenement';

export const metadata = { title: 'Événement' };

export default async function PageEvenement({ params }: { params: Promise<{ id: string }> }) {
  await exigerEleve();
  const { id } = await params;
  const e = await lireEvenement(id);
  if (!e) notFound();
  const local = isoVersHeureParis(e.debut);
  const chapitres = e.evenement_chapitre.flatMap((ec) => (ec.chapitre ? [ec.chapitre] : [])).sort((a, b) => a.numero - b.numero);
  const cours = await optionsCours();
  const libelleRappel = RAPPELS.find((r) => r.valeur !== '' && r.valeur === String(e.delai_rappel_minutes))
    ?.libelle.replace(' (24 heures avant)', '').toLowerCase();
  return (
    <div className="page-evenement">
      <p><Link className="lien-action" href={`/calendrier?vue=semaine&date=${local.slice(0, 10)}`}>← Mon calendrier</Link></p>
      <h1>{e.titre}</h1>
      {libelleRappel && <p>Rappel&nbsp;: {libelleRappel}</p>}
      {e.revision_generale && (
        <section aria-labelledby="titre-generale">
          <h2 id="titre-generale">Révision générale</h2>
          <p>Un quiz de 30 questions au plus sur tous les chapitres de ton examen.</p>
          <FormulaireRevisionGenerale evenementId={e.id} />
        </section>
      )}
      {e.type === 'examen_reel' && e.cours_id && (
        <p><Link className="bouton bouton-secondaire" href={`/calendrier/${e.id}/planning`}>Planning de révision</Link></p>
      )}
      {e.type === 'revision' && !e.revision_generale && chapitres.length > 0 && e.cours && (
        <section aria-labelledby="titre-reviser">
          <h2 id="titre-reviser">Réviser</h2>
          <ul className="liste-tdb">
            {chapitres.map((ch) => (
              <li key={ch.id} className="carte ligne-tdb">
                <Link href={`/cours/${e.cours!.slug}/${ch.slug}`}>Ch. {ch.numero} · {ch.titre}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section aria-labelledby="titre-modifier">
        <h2 id="titre-modifier">Modifier</h2>
        <FormulaireEvenement id={e.id} cours={cours} initial={{
          type: e.type, titre: e.titre, jour: local.slice(0, 10), heure: local.slice(11, 16), duree: String(e.duree_minutes),
          cours: e.cours_id ?? '', chapitres: chapitres.map((c) => c.id), repetition: e.repetition,
          jours: (e.jours_semaine ?? []).map(String), jusqu: e.repeter_jusqu_au ?? '', rappel: String(e.delai_rappel_minutes ?? ''),
        }} />
      </section>
      <BoutonSupprimerEvenement id={e.id} titre={e.titre} examen={e.type === 'examen_reel'} />
    </div>
  );
}
