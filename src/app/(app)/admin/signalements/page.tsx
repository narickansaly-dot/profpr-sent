import Link from 'next/link';
import { exigerAdmin } from '@/lib/admin/garde';
import { lireSignalementsAdmin } from '@/lib/admin/requetes';
import { CLASSE_STATUT, LIBELLE_STATUT, tronquer } from '@/lib/admin/questions';
import { MessageStatut } from '@/components/admin/MessageStatut';
import { FormulaireDecision } from '@/components/admin/FormulaireDecision';

export const metadata = { title: 'Signalements' };

const FILTRES = [
  { code: 'ouvert', libelle: 'Ouverts' }, { code: 'traite', libelle: 'Traités' },
  { code: 'rejete', libelle: 'Rejetés' }, { code: 'tout', libelle: 'Tous' },
] as const;
const CONFIRMATIONS: Record<string, string> = { traite: 'Signalement marqué comme traité.', rejete: 'Signalement rejeté : la question est conservée.' };
const LIBELLE_DECISION: Record<string, string> = { ouvert: 'Ouvert', traite: 'Traité', rejete: 'Rejeté' };
const VIDES: Record<string, string> = {
  ouvert: 'Aucun signalement ouvert. Tout est à jour.', traite: 'Aucun signalement traité.', rejete: 'Aucun signalement rejeté.', tout: 'Aucun signalement pour l’instant.',
};
const date = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
const un = (v: string | string[] | undefined) => (typeof v === 'string' ? v : undefined);

export default async function PageSignalements({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await exigerAdmin();
  const p = await searchParams;
  const filtre = FILTRES.find((f) => f.code === un(p.statut))?.code ?? 'ouvert';
  const decision = un(p.decision);
  const confirmation = decision ? CONFIRMATIONS[decision] : undefined;
  const signalements = await lireSignalementsAdmin(filtre === 'tout' ? null : filtre);
  return (
    <div className="page-admin">
      <h1>Signalements de questions</h1>
      <MessageStatut texte={confirmation ?? ''} cle={un(p.n)} />
      <nav aria-label="Filtrer les signalements" className="filtres-signalements">
        <ul>
          {FILTRES.map((f) => (
            <li key={f.code}>
              <Link href={`/admin/signalements?statut=${f.code}`} aria-current={f.code === filtre ? 'page' : undefined}
                className={`bouton ${f.code === filtre ? 'bouton-principal' : 'bouton-secondaire'}`}>{f.libelle}</Link>
            </li>
          ))}
        </ul>
      </nav>
      {signalements.length === 0 ? (
        <p className="vide">{VIDES[filtre]}</p>
      ) : (
        <ul className="liste-signalements">
          {signalements.map((s) => {
            const apercu = tronquer(s.enonce, 60);
            return (
              <li key={s.id} className="carte carte-signalement">
                <div className="entete-signalement">
                  <p className="chemin-signalement">{s.cours_titre} › {s.chapitre_titre}</p>
                  <div className="etats-signalement">
                    <span className={`statut ${CLASSE_STATUT[s.statut_question] ?? 'statut-brouillon'}`}>Question : {LIBELLE_STATUT[s.statut_question] ?? s.statut_question}</span>
                    {s.statut !== 'ouvert' && <span className="statut statut-publie">{LIBELLE_DECISION[s.statut] ?? s.statut}</span>}
                  </div>
                </div>
                {/* Titre court pour la navigation par titres ; l'énoncé complet suit s'il a été coupé. */}
                <h2 className="enonce-signalement">{tronquer(s.enonce, 80)}</h2>
                {tronquer(s.enonce, 80) !== s.enonce && <p className="enonce-complet">{s.enonce}</p>}
                <blockquote className="commentaire-signalement">{s.commentaire}</blockquote>
                <p className="meta-signalement">
                  Signalé par <strong>{s.auteur_nom ?? 'Compte supprimé'}</strong>{s.auteur_email ? <> ({s.auteur_email})</> : null}, le {date.format(new Date(s.cree_le))}
                </p>
                {s.statut !== 'ouvert' && (
                  <p className="meta-signalement">
                    {s.traite_le ? `Décision du ${date.format(new Date(s.traite_le))}.` : null}{s.reponse ? <> Réponse : « {s.reponse} »</> : ' Aucune réponse écrite.'}
                  </p>
                )}
                <p className="meta-signalement">
                  <Link href={`/admin/questions/${s.question_id}`} className="lien-modifier-question">Modifier la question<span className="sr-only"> : {apercu}</span></Link>
                </p>
                {s.statut === 'ouvert' && <FormulaireDecision id={s.id} filtre={filtre} apercu={apercu} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
