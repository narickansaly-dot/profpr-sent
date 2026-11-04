import Link from 'next/link';
import type { EtatEvaluation } from '@/lib/quiz/regles';
import { EVALUATION } from '@/lib/quiz/regles';
import { formaterNote } from '@/lib/quiz/reponse';
import { formaterEcheance } from '@/lib/quiz/temps';

const dateHeure = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

export function CarteEvaluation({ coursSlug, etat, meilleureNote }: { coursSlug: string; etat: EtatEvaluation; meilleureNote: number | null }) {
  return (
    <section className="carte carte-evaluation" aria-labelledby="titre-evaluation">
      <h2 id="titre-evaluation">Évaluation du cours</h2>
      <p>{EVALUATION.nbQuestions} questions sur tout le cours, {EVALUATION.dureeMinutes} minutes, {EVALUATION.essais} essais.</p>
      {meilleureNote != null && <p>Ta meilleure note : <strong>{formaterNote(meilleureNote)}</strong></p>}
      {etat.etat === 'verrouillee' && (
        <p><span aria-hidden="true">🔒</span> Valide encore {etat.chapitresRestants} chapitre{etat.chapitresRestants > 1 ? 's' : ''} pour la débloquer.</p>
      )}
      {etat.etat === 'en_cours' && <Link className="bouton bouton-principal" href={`/tentative/${etat.tentativeId}`}>Reprendre l’évaluation</Link>}
      {etat.etat === 'disponible' && (
        <>
          {etat.limite && <p><span aria-hidden="true">⏳</span> À passer avant le {formaterEcheance(etat.limite)}</p>}
          <Link className="bouton bouton-principal" href={`/cours/${coursSlug}/evaluation`}>
            Passer l’évaluation ({etat.essaisRestants} essai{etat.essaisRestants > 1 ? 's' : ''} restant{etat.essaisRestants > 1 ? 's' : ''})
          </Link>
        </>
      )}
      {etat.etat === 'attente' && <p><span aria-hidden="true">⏳</span> Prochain essai possible {dateHeure.format(etat.disponibleLe)}.</p>}
      {etat.etat === 'pas_ouverte' && <p><span aria-hidden="true">🔒</span> Ouverture le {formaterEcheance(etat.ouverture)}</p>}
      {etat.etat === 'close' && <p>La date limite est passée : c’était le {formaterEcheance(etat.limite)}.</p>}
      {etat.etat === 'epuisee' && <p>Tu as utilisé tes {EVALUATION.essais} essais.</p>}
    </section>
  );
}
