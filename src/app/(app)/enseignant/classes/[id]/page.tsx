import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerEnseignant } from '@/lib/enseignant/garde';
import { lireCatalogue, lireClasseEnseignant, lireEcheances, lireSuivi } from '@/lib/enseignant/requetes';
import { grouperParFiliere } from '@/lib/enseignant/catalogue';
import { isoVersHeureParis } from '@/lib/enseignant/dates';
import { formaterEcheance } from '@/lib/quiz/temps';
import { formaterNote } from '@/lib/quiz/reponse';
import { BarreProgression } from '@/components/BarreProgression';
import { CodeClasse } from '@/components/CodeClasse';
import { BoutonRetirerEleve, FormulaireCours } from '@/components/FormulaireClasse';
import { FormulaireEcheance } from '@/components/FormulaireEcheance';

export const metadata = { title: 'Ma classe' };
const jourCourt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'Europe/Paris' });

export default async function PageClasse({ params }: { params: Promise<{ id: string }> }) {
  await exigerEnseignant();
  const { id } = await params;
  const classe = await lireClasseEnseignant(id);
  if (!classe) notFound();
  const [suivi, echeances, catalogue] = await Promise.all([lireSuivi(classe.id), lireEcheances(classe.id), lireCatalogue()]);

  const titres = new Map(catalogue.map((c) => [c.id, c.titre]));
  for (const l of suivi) titres.set(l.cours_id, l.cours_titre);
  const coursClasse = classe.cours_ids.filter((c) => titres.has(c));

  const eleves = new Map<string, { nom: string; lignes: Map<string, (typeof suivi)[number]> }>();
  for (const l of suivi) {
    const e = eleves.get(l.eleve_id) ?? { nom: l.nom?.trim() || 'Élève sans prénom', lignes: new Map() };
    e.lignes.set(l.cours_id, l);
    eleves.set(l.eleve_id, e);
  }
  const listeEleves = [...eleves.entries()].sort((a, b) => a[1].nom.localeCompare(b[1].nom, 'fr'));

  const groupes = grouperParFiliere(catalogue);
  const echeanceDe = new Map(echeances.map((e) => [e.cours_id, e]));

  return (
    <div className="page-enseignant page-classe-ens">
      <p className="fil"><Link href="/enseignant" className="lien-action">← Mes classes</Link></p>
      <h1>{classe.nom}</h1>

      <section className="carte" aria-labelledby="titre-code">
        <h2 id="titre-code">Inviter des élèves</h2>
        <CodeClasse classeId={classe.id} code={classe.code} />
      </section>

      <section aria-labelledby="titre-eleves">
        <h2 id="titre-eleves">Élèves</h2>
        {listeEleves.length === 0 ? (
          <p className="vide">Aucun élève pour l’instant. Partage le code {classe.code} ou le lien d’invitation.</p>
        ) : (
          <div className="defilement" tabIndex={0} role="region" aria-label="Suivi des élèves, défile horizontalement">
            <table className="tableau-suivi">
              <caption>Suivi des {listeEleves.length} {listeEleves.length > 1 ? 'élèves' : 'élève'} de la classe {classe.nom}</caption>
              {/* Un groupe de 4 colonnes par cours : l'en-tête de cours (scope="colgroup") couvre Chapitres, Note, Essais, Activité. */}
              <colgroup />
              {coursClasse.map((c) => <colgroup key={c} span={4} />)}
              <colgroup />
              <thead>
                <tr>
                  <th scope="col" rowSpan={2} className="col-eleve">Élève</th>
                  {coursClasse.map((c) => <th key={c} scope="colgroup" colSpan={4} className="groupe-cours-tete">{titres.get(c)}</th>)}
                  <th scope="col" rowSpan={2}><span className="sr-only">Actions</span></th>
                </tr>
                <tr>
                  {coursClasse.flatMap((c) => [
                    <th key={`${c}-ch`} scope="col">Chapitres validés</th>,
                    <th key={`${c}-no`} scope="col">Note</th>,
                    <th key={`${c}-es`} scope="col">Essais</th>,
                    <th key={`${c}-ac`} scope="col">Dernière activité</th>,
                  ])}
                </tr>
              </thead>
              <tbody>
                {listeEleves.map(([eleveId, e]) => (
                  <tr key={eleveId}>
                    <th scope="row" className="col-eleve">{e.nom}</th>
                    {coursClasse.flatMap((c) => {
                      const l = e.lignes.get(c);
                      if (!l) return [<td key={`${c}-vide`} colSpan={4} className="cellule-vide"><span aria-hidden="true">—</span><span className="sr-only">Pas de données</span></td>];
                      return [
                        <td key={`${c}-ch`}>
                          <span className="fraction">{l.chapitres_valides} / {l.chapitres_total}</span>
                          <BarreProgression valeur={l.chapitres_valides} max={l.chapitres_total} libelle={`Chapitres validés par ${e.nom} : ${titres.get(c)}`} />
                        </td>,
                        <td key={`${c}-no`} className="num">{l.note_evaluation == null ? <><span aria-hidden="true">—</span><span className="sr-only">Pas de note</span></> : formaterNote(l.note_evaluation)}</td>,
                        <td key={`${c}-es`} className="num">{l.essais_evaluation}</td>,
                        <td key={`${c}-ac`}>{l.derniere_activite ? jourCourt.format(new Date(l.derniere_activite)) : <><span aria-hidden="true">—</span><span className="sr-only">Aucune activité</span></>}</td>,
                      ];
                    })}
                    <td><BoutonRetirerEleve classeId={classe.id} eleveId={eleveId} nom={e.nom} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {coursClasse.length > 0 && (
          <ul className="liens-notes">
            {coursClasse.map((c) => (
              <li key={c}>
                <Link href={`/enseignant/classes/${classe.id}/cours/${c}`}>
                  Notes et questions ratées<span className="sr-only"> : {titres.get(c)}</span>
                </Link>
                <span className="attenue"> · {titres.get(c)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="carte" aria-labelledby="titre-cours">
        <h2 id="titre-cours">Cours de la classe</h2>
        <FormulaireCours classeId={classe.id} groupes={groupes} coches={classe.cours_ids} />
      </section>

      <section aria-labelledby="titre-echeances">
        <h2 id="titre-echeances">Échéances</h2>
        <p className="attenue">Sans échéance, les élèves passent l’évaluation quand ils veulent.</p>
        {coursClasse.length === 0 ? (
          <p className="vide">Ajoute d’abord un cours à la classe.</p>
        ) : (
          <ul className="liste-echeances-ens">
            {coursClasse.map((c) => {
              const e = echeanceDe.get(c);
              return (
                <li key={c} className="carte">
                  <FormulaireEcheance
                    classeId={classe.id} coursId={c} titre={titres.get(c) ?? ''}
                    ouverture={isoVersHeureParis(e?.ouverture)} limite={isoVersHeureParis(e?.limite)}
                  />
                  {e?.limite && <p className="attenue echeance-actuelle">Date limite actuelle : {formaterEcheance(new Date(e.limite))}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
