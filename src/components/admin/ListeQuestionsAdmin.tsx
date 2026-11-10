import Link from 'next/link';
import type { QuestionAdmin } from '@/lib/admin/requetes';
import { CLASSE_STATUT, LIBELLE_DIFFICULTE, LIBELLE_STATUT, LIBELLE_TYPE, tronquer } from '@/lib/admin/questions';

export function ListeQuestionsAdmin({ questions, vide }: { questions: QuestionAdmin[]; vide: string }) {
  if (questions.length === 0) return <p className="vide">{vide}</p>;
  return (
    <ul className="liste-questions">
      {questions.map((q) => (
        <li key={q.id} className="carte ligne-question">
          <div className="ligne-question-tete">
            <span className={`statut ${CLASSE_STATUT[q.statut]}`}>{LIBELLE_STATUT[q.statut] ?? q.statut}</span>
            <span className="etiquette">{LIBELLE_TYPE[q.type]}</span>
            {q.utilisee && <span className="marque-question">Déjà utilisée</span>}
            {q.signalements_ouverts > 0 && (
              <Link href="/admin/signalements" className="marque-question marque-signalee">
                {q.signalements_ouverts} signalement{q.signalements_ouverts > 1 ? 's' : ''} ouvert{q.signalements_ouverts > 1 ? 's' : ''}
              </Link>
            )}
          </div>
          <p className="ligne-question-enonce">{tronquer(q.enonce, 140)}</p>
          <p className="ligne-question-meta">
            <span>Notion : {q.notion ?? 'aucune'}</span>
            <span>Difficulté : {LIBELLE_DIFFICULTE[q.difficulte] ?? q.difficulte}</span>
          </p>
          <Link href={`/admin/questions/${q.id}`} className="lien-modifier-question">
            Modifier<span className="sr-only"> la question : {tronquer(q.enonce, 60)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
