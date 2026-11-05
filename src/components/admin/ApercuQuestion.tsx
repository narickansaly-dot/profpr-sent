'use client';

import { useState, type CSSProperties } from 'react';
import { ChampReponse } from '@/components/ChampReponse';
import type { ReponseAffichee, TypeQuestion } from '@/lib/quiz/reponse';

/**
 * Aperçu élève : hors du formulaire de l'éditeur, pour qu'Entrée dans « Ta réponse » ne l'envoie jamais.
 * L'éditeur le remonte (clé) quand le type ou la liste des propositions change : la réponse d'essai repart de zéro.
 */
export function ApercuQuestion({ type, enonce, propositions, couleur }: {
  type: TypeQuestion; enonce: string; propositions: string[]; couleur: string;
}) {
  const [reponse, setReponse] = useState<ReponseAffichee | null>(null);
  return (
    <section className="panneau-apercu apercu-question" aria-labelledby="titre-apercu-question"
      style={{ '--couleur-cours': couleur } as CSSProperties}>
      <h2 id="titre-apercu-question">Aperçu élève</h2>
      <p className="aide-champ">Voici comment l’élève verra la question pendant un quiz. Tu peux y répondre pour essayer ; rien n’est enregistré.</p>
      <div className="question carte">
        <p className="question-enonce">{enonce.trim() || 'Énoncé de la question'}</p>
        <div role="group" aria-label="Réponses de l’aperçu">
          <ChampReponse questionId="apercu-question" type={type} propositions={propositions.map((t, i) => t.trim() || `Proposition ${i + 1}`)}
            reponse={reponse} onChange={(r) => setReponse(r)} />
        </div>
      </div>
    </section>
  );
}
