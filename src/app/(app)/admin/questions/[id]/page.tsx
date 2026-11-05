import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerAdmin } from '@/lib/admin/garde';
import { lireChapitreAdmin, lireCoursAdmin, lireNotionsChapitre, lireQuestionsChapitre, lireSignalementsAdmin } from '@/lib/admin/requetes';
import { CLASSE_STATUT, CONFIRMATIONS_QUESTION, LIBELLE_STATUT, tronquer } from '@/lib/admin/questions';
import { couleurCoursAcceptable } from '@/lib/contenu/couleur';
import { creerClientServeur } from '@/lib/supabase/server';
import { FormulaireQuestion, type QuestionInitiale } from '@/components/admin/FormulaireQuestion';
import { BoutonsStatutQuestion } from '@/components/admin/BoutonsStatutQuestion';
import { MessageStatut } from '@/components/admin/MessageStatut';

export const metadata = { title: 'Modifier la question' };

const dateFr = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Paris' });

export default async function PageQuestion({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ enregistre?: string | string[] }> }) {
  await exigerAdmin();
  const { id: idBrut } = await params;
  const id = idBrut.toLowerCase();
  const { enregistre } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await creerClientServeur();
  const { data: ligne } = await supabase.from('question').select('chapitre_id').eq('id', id).maybeSingle();
  if (!ligne) notFound();
  const chapitreId = ligne.chapitre_id;
  const [ch, questions, notions] = await Promise.all([lireChapitreAdmin(chapitreId), lireQuestionsChapitre(chapitreId), lireNotionsChapitre(chapitreId)]);
  // Une question archivée (remplacée par une version) n'est plus dans la liste : la page n'existe plus.
  const q = questions.find((x) => x.id === id);
  if (!ch || !q) notFound();
  const cours = await lireCoursAdmin(ch.cours_id);
  if (!cours) notFound();
  const signalements = (await lireSignalementsAdmin('ouvert')).filter((s) => s.question_id === id);
  const props = Array.isArray(q.propositions) ? (q.propositions as string[]) : [];
  const bonnes = Array.isArray(q.bonnes_reponses) ? (q.bonnes_reponses as (number | boolean)[]) : [];
  const relative = q.marge_relative && q.marge !== null;
  const initial: QuestionInitiale = {
    type: q.type, enonce: q.enonce,
    propositions: props.length ? props.map((texte, i) => ({ texte, bonne: bonnes.includes(i) })) : [1, 2].map(() => ({ texte: '', bonne: false })),
    vraiFaux: q.type === 'vrai_faux' ? (bonnes[0] === true ? 'vrai' : bonnes[0] === false ? 'faux' : '') : '',
    acceptees: q.reponses_acceptees.join('\n'),
    marge: q.marge === null ? '' : String(relative ? Number((q.marge * 100).toPrecision(12)) : q.marge).replace('.', ','),
    margeRelative: q.marge_relative, notion: q.notion ?? '', difficulte: String(q.difficulte), explication: q.explication,
  };
  const retour = `/admin/chapitres/${chapitreId}/questions`;
  const code = typeof enregistre === 'string' ? enregistre : '';
  return (
    <div className="page-admin">
      <p className="fil"><Link href={retour}>← Retour aux questions du chapitre {ch.numero}</Link></p>
      <div className="entete-bloc">
        <div>
          <p className="etiquette">{cours.titre} · Ch. {ch.numero}</p>
          <h1>Modifier la question</h1>
        </div>
        <span className={`statut ${CLASSE_STATUT[q.statut]}`}>{LIBELLE_STATUT[q.statut] ?? q.statut}</span>
      </div>
      <MessageStatut texte={CONFIRMATIONS_QUESTION[code] ?? ''} />
      {q.version_de && <p className="aide-champ">Cette question est une nouvelle version d’une question déjà utilisée.</p>}
      <BoutonsStatutQuestion id={q.id} chapitreId={chapitreId} statut={q.statut} utilisee={q.utilisee} />
      {signalements.length > 0 && (
        <section className="carte signalements-question" aria-labelledby="titre-signalements-question">
          <h2 id="titre-signalements-question">{signalements.length} signalement{signalements.length > 1 ? 's' : ''} ouvert{signalements.length > 1 ? 's' : ''}</h2>
          <ul>
            {signalements.map((s) => (
              <li key={s.id}>
                <p>{tronquer(s.commentaire, 600)}</p>
                <p className="aide-champ">{dateFr.format(new Date(s.cree_le))}</p>
              </li>
            ))}
          </ul>
          <p><Link href="/admin/signalements">Traiter les signalements</Link></p>
        </section>
      )}
      <section className="carte" aria-labelledby="titre-form-question">
        <h2 id="titre-form-question" className="sr-only">Contenu de la question</h2>
        <FormulaireQuestion key={q.modifie_le} chapitreId={chapitreId} questionId={q.id} utilisee={q.utilisee} statut={q.statut}
          couleur={couleurCoursAcceptable(cours.couleur) ? cours.couleur : '#2563eb'} notions={notions} annulerHref={retour} initial={initial} />
      </section>
    </div>
  );
}
