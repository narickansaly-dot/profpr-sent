'use client';

type Champs = { acceptees: string; marge: string; margeRelative: boolean };

/** Champs propres à la réponse courte : réponses acceptées, marge et marge relative. */
export function GroupeReponseCourte({ acceptees, marge, margeRelative, erreurAcceptees, erreurMarge, onChange }: Champs & {
  erreurAcceptees: boolean; erreurMarge: boolean; onChange: (p: Partial<Champs>) => void;
}) {
  const desc = (erreur: boolean, aide: string) => [erreur ? 'erreur-question' : '', aide].filter(Boolean).join(' ');
  return (
    <fieldset className="groupe-propositions">
      <legend>Réponse courte</legend>
      <div className="champ-question">
        <label htmlFor="champ-acceptees">Réponses acceptées (une par ligne)</label>
        <textarea id="champ-acceptees" {...(erreurAcceptees ? { 'aria-invalid': true as const } : {})} aria-describedby={desc(erreurAcceptees, 'aide-acceptees')}
          rows={3} spellCheck={false} value={acceptees} onChange={(e) => onChange({ acceptees: e.target.value })} />
        <p id="aide-acceptees" className="aide-champ">
          Guide des auteurs (<code>docs/guide-auteurs.md</code>) : la casse, les accents et la ponctuation de fin sont ignorés,
          mais les signes + − % ° = &lt; &gt; comptent. « Na+ » et « Na » sont donc deux réponses différentes ; liste les variantes acceptables.
        </p>
      </div>
      <div className="ligne-champs">
        <div className="champ-question">
          <label htmlFor="champ-marge">Marge de tolérance (réponses numériques)</label>
          <input id="champ-marge" {...(erreurMarge ? { 'aria-invalid': true as const } : {})} aria-describedby={desc(erreurMarge, 'aide-marge')}
            type="text" inputMode="decimal" autoComplete="off" value={marge} onChange={(e) => onChange({ marge: e.target.value })} />
          <p id="aide-marge" className="aide-champ">Facultatif. La virgule est acceptée ; en relatif, de 0 à 100. Une réponse numérique est juste si elle est à cette distance d’une valeur acceptée.</p>
        </div>
        <label className="case-bonne case-marge" htmlFor="champ-marge-relative">
          <input id="champ-marge-relative" type="checkbox" checked={margeRelative} onChange={(e) => onChange({ margeRelative: e.target.checked })} />
          <span>Marge relative (en %)</span>
        </label>
      </div>
    </fieldset>
  );
}
