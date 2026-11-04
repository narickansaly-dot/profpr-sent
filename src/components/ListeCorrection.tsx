import { texteReponse } from '@/lib/quiz/reponse';
import type { LigneCorrection as Ligne } from '@/lib/quiz/requetes';

export function ListeCorrection({ lignes }: { lignes: Ligne[] }) {
  return (
    <ol className="liste-correction">
      {lignes.map((l) => {
        const bonne = l.type === 'reponse_courte' ? l.reponses_acceptees.join(' ou ') : texteReponse(l.type, l.propositions, l.bonnes_reponses);
        return (
          <li key={l.ordre} className={`carte correction ${l.correcte ? 'juste' : 'faux'}`}>
            <p className="correction-verdict">{l.correcte ? '✓ Juste' : '✗ À revoir'}</p>
            <p className="correction-enonce"><strong>{l.enonce}</strong></p>
            <p>Ta réponse : {texteReponse(l.type, l.propositions, l.reponse)}</p>
            {!l.correcte && <p>Bonne réponse : <strong>{bonne}</strong></p>}
            {l.explication && <p className="correction-explication">{l.explication}</p>}
          </li>
        );
      })}
    </ol>
  );
}
