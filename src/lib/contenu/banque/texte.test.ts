import { describe, expect, it } from 'vitest';
import { schemaCoursImport } from '../format-import';
import { htmlVersTexte, texteChapitre } from './texte';

const cours = schemaCoursImport.parse({
  slug: 'bph', filiere: 'ST2S', niveau: '1re', matiere: 'BPH', titre: 'BPH',
  chapitres: [{
    slug: 'ch1', numero: 1, titre: 'Organisation', chapeau: 'Le corps est <em>organisé</em>.', objectifs: ['nommer les niveaux ;', 'définir le milieu intérieur.'],
    sections: [
      { id: 'a', titre: 'Les niveaux', html: '<p>Cellule&nbsp;: unité &amp; base.</p><figure><svg viewBox="0 0 1 1"><text>BRUIT</text></svg><figcaption>Schéma</figcaption></figure>' },
      { id: 'b', titre: 'Les tissus', html: '<ul><li>Épithélial</li><li>Nerveux</li></ul>' },
    ],
    a_retenir: '<p>Retenir <strong>ceci</strong>.</p>', questions: [],
  }],
});

describe('htmlVersTexte', () => {
  it('retire les balises et décode les entités', () => {
    const t = htmlVersTexte('<p>Cellule&nbsp;: unité &amp; base &lt;3 &#233;.</p>');
    expect(t).toBe('Cellule : unité & base <3 é.');
  });
  it('retire les schémas SVG et garde les légendes', () => {
    expect(htmlVersTexte('<svg><text>BRUIT</text></svg><figcaption>Légende</figcaption>')).toBe('Légende');
  });
  it('met les listes en puces', () => {
    expect(htmlVersTexte('<ul><li>un</li><li>deux</li></ul>')).toBe('- un\n- deux');
  });
});

describe('texteChapitre', () => {
  const t = texteChapitre(cours, 1);
  it('contient titre, chapeau, objectifs, titres de section et « Je retiens »', () => {
    expect(t.split('\n')[0]).toBe('Chapitre 1 : Organisation');
    expect(t).toContain('Le corps est organisé.');
    expect(t).toContain('- nommer les niveaux ;');
    expect(t).toContain('## Les niveaux');
    expect(t).toContain('## Les tissus');
    expect(t).toContain('## Je retiens');
    expect(t).toContain('Retenir ceci.');
  });
  it('ne contient aucune balise et décode les entités', () => {
    expect(t).not.toMatch(/<[a-z/]/i);
    expect(t).toContain('Cellule : unité & base.');
    expect(t).not.toContain('BRUIT');
  });
  it('refuse un chapitre inconnu', () => {
    expect(() => texteChapitre(cours, 9)).toThrow('chapitre 9 absent du cours');
  });
});
