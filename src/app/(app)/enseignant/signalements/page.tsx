import Link from 'next/link';
import { exigerEnseignant } from '@/lib/enseignant/garde';
import { lireMesSignalements } from '@/lib/admin/requetes';
import { tronquer } from '@/lib/admin/questions';

export const metadata = { title: 'Mes signalements' };

const LIBELLE: Record<string, string> = { ouvert: 'Ouvert', traite: 'Traité', rejete: 'Rejeté' };
// « Rejeté » n'est pas une validation : badge neutre, le vert est réservé à « Traité ».
const CLASSE: Record<string, string> = { ouvert: 'statut-brouillon', traite: 'statut-publie', rejete: 'statut-clos' };
const date = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

export default async function PageMesSignalements() {
  await exigerEnseignant();
  const signalements = await lireMesSignalements();
  return (
    <div className="page-enseignant">
      <p className="fil"><Link href="/enseignant" className="lien-action">← Mes classes</Link></p>
      <h1>Mes signalements</h1>
      {signalements.length === 0 ? (
        <p className="vide">Tu n’as encore signalé aucune question. Utilise « Signaler une erreur » dans la correction d’un quiz ou dans le suivi d’une classe.</p>
      ) : (
        <ul className="liste-signalements">
          {signalements.map((s) => (
            <li key={s.id} className="carte carte-signalement">
              <div className="entete-signalement">
                <p className="chemin-signalement">{s.cours_titre} › {s.chapitre_titre}</p>
                <span className={`statut ${CLASSE[s.statut] ?? 'statut-brouillon'}`}>{LIBELLE[s.statut] ?? s.statut}</span>
              </div>
              {/* Titre court pour la navigation par titres ; l'énoncé complet suit s'il a été coupé. */}
              <h2 className="enonce-signalement">{tronquer(s.enonce, 80)}</h2>
              {tronquer(s.enonce, 80) !== s.enonce && <p className="enonce-complet">{s.enonce}</p>}
              <blockquote className="commentaire-signalement">{s.commentaire}</blockquote>
              <p className="meta-signalement">Signalé le {date.format(new Date(s.cree_le))}.</p>
              {s.statut !== 'ouvert' && (
                <p className="meta-signalement">
                  {s.traite_le ? `Décision du ${date.format(new Date(s.traite_le))}.` : null}{' '}
                  {s.reponse ? <>Réponse de l’administration : « {s.reponse} »</> : 'Aucune réponse écrite.'}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
