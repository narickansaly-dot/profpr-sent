import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerEnseignant } from '@/lib/enseignant/garde';
import { chargerNotesCours } from '@/lib/enseignant/notes-cours';
import { bonneReponseTexte } from '@/lib/enseignant/question';
import { formaterNote } from '@/lib/quiz/reponse';
import { BoutonSignaler } from '@/components/BoutonSignaler';
import { SEUIL_REUSSITE } from '@/lib/quiz/regles';

type Params = { params: Promise<{ id: string; coursId: string }> };

export async function generateMetadata({ params }: Params) {
  const { id, coursId } = await params;
  const d = await chargerNotesCours(id, coursId).catch(() => null);
  return { title: d ? `Notes : ${d.cours} — ${d.classe.nom}` : 'Notes du cours' };
}

function Note({ valeur, valide }: { valeur: number | null | undefined; valide: boolean | undefined }) {
  if (valeur == null) return <td className="cellule-vide"><span aria-hidden="true">—</span><span className="sr-only">Pas de note</span></td>;
  const ok = valide ?? false;
  return (
    <td className={`note-cellule ${ok ? 'note-validee' : 'note-a-revoir'}`}>
      {ok && <span aria-hidden="true">✓ </span>}{formaterNote(valeur)}
      <span className="sr-only">{ok ? ', validé' : ', non validé'}</span>
    </td>
  );
}

export default async function PageNotesCours({ params }: Params) {
  await exigerEnseignant();
  const { id, coursId } = await params;
  const d = await chargerNotesCours(id, coursId);
  if (!d) notFound();
  const { classe, cours, chapitres, eleves, ratees } = d;

  const moyenne = (valeurs: (number | null | undefined)[]) => {
    const n = valeurs.filter((v): v is number => v != null);
    return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null;
  };

  return (
    <div className="page-enseignant page-notes-cours">
      <p className="fil"><Link href={`/enseignant/classes/${classe.id}`}>← {classe.nom}</Link></p>
      <h1>{cours} — {classe.nom}</h1>

      <section aria-labelledby="titre-notes">
        <div className="entete-section">
          <h2 id="titre-notes">Notes</h2>
          {eleves.length > 0 && (
            <a className="bouton bouton-secondaire" href={`/enseignant/classes/${classe.id}/cours/${coursId}/export`} download>
              Exporter les notes (CSV)
            </a>
          )}
        </div>
        {eleves.length === 0 ? (
          <p className="vide">Aucun élève dans cette classe pour l’instant.</p>
        ) : (
          <>
            <p className="attenue">✓ = validé (au moins {SEUIL_REUSSITE} %). Meilleure note de chaque élève.</p>
            <div className="defilement" tabIndex={0} role="region" aria-label={`Notes de ${cours}, défile horizontalement`}>
              <table className="tableau-suivi tableau-notes">
                <caption className="sr-only">Meilleures notes par chapitre pour la classe {classe.nom}</caption>
                <thead>
                  <tr>
                    <th scope="col" className="col-eleve">Élève</th>
                    {chapitres.map((c) => <th key={c.id} scope="col" className="num" title={c.titre}>Ch. {c.numero}<span className="sr-only"> : {c.titre}</span></th>)}
                    <th scope="col" className="num">Évaluation</th>
                  </tr>
                </thead>
                <tbody>
                  {eleves.map((e) => (
                    <tr key={e.id}>
                      <th scope="row" className="col-eleve">{e.nom}</th>
                      {chapitres.map((c) => <Note key={c.id} valeur={e.notes[c.id]} valide={e.valides[c.id]} />)}
                      <Note valeur={e.evaluation} valide={e.evaluationValidee} />
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" className="col-eleve">Moyenne de la classe</th>
                    {chapitres.map((c) => {
                      const m = moyenne(eleves.map((e) => e.notes[c.id]));
                      return <td key={c.id} className="num">{m == null ? <><span aria-hidden="true">—</span><span className="sr-only">Pas de note</span></> : formaterNote(m)}</td>;
                    })}
                    <td className="num">{(() => { const m = moyenne(eleves.map((e) => e.evaluation)); return m == null ? <><span aria-hidden="true">—</span><span className="sr-only">Pas de note</span></> : formaterNote(m); })()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <ul className="legende-chapitres attenue">
              {chapitres.map((c) => <li key={c.id}>Ch. {c.numero} : {c.titre}</li>)}
            </ul>
          </>
        )}
      </section>

      <section aria-labelledby="titre-ratees">
        <h2 id="titre-ratees">Questions les plus ratées</h2>
        {ratees.length === 0 ? (
          <p className="vide">Pas encore assez de réponses (au moins 5 par question, de 3 élèves différents).</p>
        ) : (
          <ol className="liste-ratees">
            {ratees.map((q) => (
              <li key={q.question_id} className="carte question-ratee">
                <p className="etiquette">{q.chapitre_titre}</p>
                <p className="enonce-ratee">{q.enonce}</p>
                <div className="taux-erreur">
                  <p className="taux-texte"><strong>{q.taux_erreur} % d’erreurs</strong> · {q.reponses} réponses</p>
                  <div className="barre-erreur" role="img" aria-label={`${q.taux_erreur} % de réponses fausses sur ${q.reponses}`}>
                    <span style={{ width: `${q.taux_erreur}%` }} />
                  </div>
                </div>
                <details>
                  <summary>Voir la bonne réponse</summary>
                  <p className="bonne-reponse">{bonneReponseTexte(q.type, q.propositions, q.bonnes_reponses, q.reponses_acceptees ?? [])}</p>
                </details>
                <BoutonSignaler questionId={q.question_id} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
