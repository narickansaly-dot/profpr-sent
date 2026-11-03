'use client';

import { basculerChoix, type ReponseAffichee, type TypeQuestion } from '@/lib/quiz/reponse';

type Props = {
  questionId: string; type: TypeQuestion; propositions: string[];
  reponse: ReponseAffichee | null;
  onChange: (reponse: ReponseAffichee | null, enregistrerTout: boolean) => void;
  onBlur?: () => void;
};

export function ChampReponse({ questionId, type, propositions, reponse, onChange, onBlur }: Props) {
  switch (type) {
    case 'qcm_unique':
      return (
        <div className="choix">
          {propositions.map((p, i) => (
            <label key={i} className="option">
              <input type="radio" name={questionId} checked={(reponse as number[] | null)?.[0] === i} onChange={() => onChange([i], true)} />
              <span>{p}</span>
            </label>
          ))}
        </div>
      );
    case 'qcm_multiple':
      return (
        <div className="choix">
          <p className="aide">Plusieurs réponses possibles : coche toutes les bonnes.</p>
          {propositions.map((p, i) => (
            <label key={i} className="option">
              <input type="checkbox" checked={(reponse as number[] | null)?.includes(i) ?? false}
                onChange={() => onChange(basculerChoix(reponse as number[] | null, i), true)} />
              <span>{p}</span>
            </label>
          ))}
        </div>
      );
    case 'vrai_faux':
      return (
        <div className="choix choix-vrai-faux">
          {[true, false].map((v) => (
            <label key={String(v)} className="option">
              <input type="radio" name={questionId} checked={(reponse as boolean[] | null)?.[0] === v} onChange={() => onChange([v], true)} />
              <span>{v ? 'Vrai' : 'Faux'}</span>
            </label>
          ))}
        </div>
      );
    case 'reponse_courte':
      return (
        <label className="reponse-courte">
          Ta réponse
          <input type="text" maxLength={200} autoComplete="off" autoCapitalize="off" spellCheck={false}
            value={(reponse as string[] | null)?.[0] ?? ''} onBlur={onBlur}
            onChange={(e) => onChange(e.target.value === '' ? null : [e.target.value], false)} />
        </label>
      );
  }
}
