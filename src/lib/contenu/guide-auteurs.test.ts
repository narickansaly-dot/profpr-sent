import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { schemaCoursImport } from './format-import';
import { formaterProblemes } from './lire-import';

/** Extrait le contenu de chaque bloc ```json du guide. */
function exemplesJson(markdown: string): string[] {
  return [...markdown.matchAll(/^```json\r?\n([\s\S]*?)^```/gm)].map((m) => m[1]);
}

/** Un exemple qui n'est qu'une question est placé dans un cours minimal. */
function enCours(exemple: unknown): unknown {
  if (exemple && typeof exemple === 'object' && 'type' in exemple && !('chapitres' in exemple)) {
    return { slug: 'exemple', filiere: 'ST2S', niveau: '1re', matiere: 'Exemple', titre: 'Exemple',
      chapitres: [{ slug: 'ch1', numero: 1, titre: 'Chapitre', sections: [], questions: [exemple] }] };
  }
  return exemple;
}

describe('guide des auteurs', () => {
  const exemples = exemplesJson(readFileSync('docs/guide-auteurs.md', 'utf8'));

  it('contient un exemple pour chaque type de question et un cours complet', () => {
    expect(exemples.length).toBeGreaterThanOrEqual(6);
    const types = exemples.map((e) => (JSON.parse(e) as { type?: string }).type);
    for (const t of ['qcm_unique', 'qcm_multiple', 'vrai_faux', 'reponse_courte']) expect(types).toContain(t);
    expect(exemples.some((e) => 'chapitres' in (JSON.parse(e) as object))).toBe(true);
  });

  it.each(exemples.map((e, i) => [i + 1, e] as const))('l’exemple JSON n° %i est valide', (_, texte) => {
    const r = schemaCoursImport.safeParse(enCours(JSON.parse(texte)));
    expect(r.success ? [] : formaterProblemes(r.error.issues)).toEqual([]);
  });
});
