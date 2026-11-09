import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerAdmin } from '@/lib/admin/garde';
import { lireChapitreAdmin, lireCoursAdmin, lireQuestionsChapitre } from '@/lib/admin/requetes';
import { LIBELLE_STATUT, TYPES_QUESTION } from '@/lib/admin/questions';
import { couleurCoursAcceptable } from '@/lib/contenu/couleur';
import { ListeQuestionsAdmin } from '@/components/admin/ListeQuestionsAdmin';
import { RelectureQuestions } from '@/components/admin/RelectureQuestions';
import { MessageStatut } from '@/components/admin/MessageStatut';

export const metadata = { title: 'Questions du chapitre' };

type Params = { statut?: string; type?: string; signalees?: string; q?: string; supprimee?: string; relecture?: string };
const un = (v: string | string[] | undefined) => (typeof v === 'string' ? v : undefined);

export default async function PageQuestionsChapitre({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await exigerAdmin();
  const { id } = await params;
  const brut = await searchParams;
  const f: Params = { statut: un(brut.statut), type: un(brut.type), signalees: un(brut.signalees), q: un(brut.q), supprimee: un(brut.supprimee), relecture: un(brut.relecture) };
  const ch = await lireChapitreAdmin(id);
  if (!ch) notFound();
  const [cours, toutes] = await Promise.all([lireCoursAdmin(ch.cours_id), lireQuestionsChapitre(id)]);
  if (!cours) notFound();
  const statut = f.statut && Object.hasOwn(LIBELLE_STATUT, f.statut) ? f.statut : '';
  const type = TYPES_QUESTION.some(([v]) => v === f.type) ? f.type! : '';
  const recherche = (f.q ?? '').trim().slice(0, 100);
  const aiguille = recherche.toLocaleLowerCase('fr');
  const signalees = f.signalees === '1';
  const visibles = toutes.filter((q) => (!statut || q.statut === statut) && (!type || q.type === type)
    && (!signalees || q.signalements_ouverts > 0) && (!aiguille || q.enonce.toLocaleLowerCase('fr').includes(aiguille)));
  const filtre = !!(statut || type || signalees || recherche);
  const nb = (s: string) => toutes.filter((q) => q.statut === s).length;
  const relecture = f.relecture === '1';
  const aRelire = toutes.filter((q) => q.statut === 'a_relire');
  const couleur = couleurCoursAcceptable(cours.couleur) ? cours.couleur : undefined;
  return (
    <div className="page-admin" style={couleur ? ({ '--couleur-cours': couleur } as React.CSSProperties) : undefined}>
      <p className="fil"><Link href="/admin" className="lien-action">← Retour au suivi du contenu</Link></p>
      <div className="entete-bloc">
        <div>
          <p className="etiquette">{cours.titre}</p>
          <h1>Questions · Ch. {ch.numero} — {ch.titre}</h1>
        </div>
        <Link href={`/admin/chapitres/${id}/questions/nouvelle`} className="bouton bouton-principal">Nouvelle question</Link>
      </div>
      <MessageStatut texte={f.supprimee === '1' ? 'La question est supprimée.' : ''} />
      <ul className="compteurs-statut" aria-label="Nombre de questions par statut">
        {(['valide', 'a_relire', 'brouillon'] as const).map((s) => (
          <li key={s}><span className={`statut ${s === 'valide' ? 'statut-publie' : s === 'a_relire' ? 'statut-relire' : 'statut-brouillon'}`}>{LIBELLE_STATUT[s]}</span> <strong>{nb(s)}</strong></li>
        ))}
        <li><span className="etiquette">Total</span> <strong>{toutes.length}</strong></li>
      </ul>
      {relecture ? (
        <>
          <p><Link className="lien-action" href={`/admin/chapitres/${id}/questions`}>Retour à la liste</Link></p>
          <RelectureQuestions chapitreId={id} questions={aRelire} />
        </>
      ) : (<>
      {aRelire.length > 0 && (
        <p><Link href={`/admin/chapitres/${id}/questions?relecture=1`} className="bouton bouton-secondaire">Relire les questions à relire ({aRelire.length})</Link></p>
      )}
      <form method="get" className="formulaire filtres-questions" role="search" aria-label="Filtrer les questions">
        <div className="champ-question">
          <label htmlFor="filtre-statut">Statut</label>
          <select id="filtre-statut" name="statut" defaultValue={statut}>
            <option value="">Tous</option>
            {Object.entries(LIBELLE_STATUT).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="champ-question">
          <label htmlFor="filtre-type">Type</label>
          <select id="filtre-type" name="type" defaultValue={type}>
            <option value="">Tous</option>
            {TYPES_QUESTION.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="champ-question champ-recherche">
          <label htmlFor="filtre-q">Rechercher dans l’énoncé</label>
          <input id="filtre-q" name="q" type="search" defaultValue={recherche} maxLength={100} autoComplete="off" />
        </div>
        <label className="case-bonne" htmlFor="filtre-signalees">
          <input id="filtre-signalees" type="checkbox" name="signalees" value="1" defaultChecked={signalees} />
          <span>Signalées seulement</span>
        </label>
        <div className="actions-formulaire">
          <button type="submit" className="bouton bouton-secondaire">Filtrer</button>
          {filtre && <Link href={`/admin/chapitres/${id}/questions`} className="bouton bouton-secondaire">Effacer les filtres</Link>}
        </div>
      </form>
      <p role="status" className="aide-champ">
        {filtre ? `${visibles.length} question${visibles.length > 1 ? 's' : ''} sur ${toutes.length}.` : `${toutes.length} question${toutes.length > 1 ? 's' : ''}.`}
      </p>
      <ListeQuestionsAdmin questions={visibles}
        vide={filtre ? 'Aucune question ne correspond à ces filtres.' : 'Ce chapitre n’a pas encore de question. Crée la première.'} />
      </>)}
    </div>
  );
}
