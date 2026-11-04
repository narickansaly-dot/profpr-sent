import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { schemaCoursImport, schemaQuestionImport } from './format-import';

describe('schemaQuestionImport', () => {
  it('accepte un QCM à une réponse et met les valeurs par défaut', () => {
    const r = schemaQuestionImport.parse({
      source: 'x:1', type: 'qcm_unique', enonce: 'Q ?', propositions: ['a', 'b'], bonnes_reponses: [1],
    });
    expect(r).toMatchObject({ difficulte: 2, statut: 'a_relire', explication: '' });
  });
  it('refuse un QCM à une réponse avec deux bonnes réponses', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:1', type: 'qcm_unique', enonce: 'Q ?', propositions: ['a', 'b'], bonnes_reponses: [0, 1],
    }).success).toBe(false);
  });
  it('refuse un indice de bonne réponse hors des propositions', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:1', type: 'qcm_multiple', enonce: 'Q ?', propositions: ['a', 'b'], bonnes_reponses: [2],
    }).success).toBe(false);
  });
  it('refuse une bonne réponse en double dans un QCM à plusieurs réponses', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:4', type: 'qcm_multiple', enonce: 'Q ?', propositions: ['a', 'b', 'c'], bonnes_reponses: [0, 0],
    }).success).toBe(false);
  });
  it('refuse une marge relative sans marge', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:5', type: 'reponse_courte', enonce: 'Q', reponses_acceptees: ['70'], marge_relative: true,
    }).success).toBe(false);
  });
  it('accepte une marge relative avec une marge', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:6', type: 'reponse_courte', enonce: 'Q', reponses_acceptees: ['70'], marge: 0.1, marge_relative: true,
    }).success).toBe(true);
  });
  it('accepte vrai/faux et réponse courte', () => {
    expect(schemaQuestionImport.safeParse({ source: 'x:2', type: 'vrai_faux', enonce: 'Q', bonne_reponse: true }).success).toBe(true);
    expect(schemaQuestionImport.safeParse({
      source: 'x:3', type: 'reponse_courte', enonce: 'Q', reponses_acceptees: ['FC', 'fréquence cardiaque'],
    }).success).toBe(true);
  });
});

describe('schemaCoursImport', () => {
  it('refuse deux chapitres avec le même slug', () => {
    const chapitre = { slug: 'ch1', numero: 1, titre: 'T', sections: [], questions: [] };
    expect(schemaCoursImport.safeParse({
      slug: 'c', filiere: 'ST2S', niveau: '1re', matiere: 'BPH', titre: 'C', chapitres: [chapitre, chapitre],
    }).success).toBe(false);
  });
});

const chap = (o: object = {}) => ({ slug: 'ch1', numero: 1, titre: 'T', sections: [], questions: [], ...o });
const cours = (o: object = {}) => ({ slug: 'c', filiere: 'st2s', niveau: '1re', matiere: 'BPH', titre: 'C', chapitres: [chap()], ...o });
const qv = (source: string) => ({ source, type: 'vrai_faux', enonce: 'Q', bonne_reponse: true });

describe('renforcement du format', () => {
  it('refuse deux sections avec le même id dans un chapitre', () => {
    const s = { id: 'a', titre: 'S', html: '' };
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ sections: [s, s] })] })).success).toBe(false);
  });
  it('refuse un id de section mal formé', () => {
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ sections: [{ id: 'A b', titre: 'S', html: '' }] })] })).success).toBe(false);
  });
  it('refuse une source en double dans le fichier, même entre deux chapitres', () => {
    expect(schemaCoursImport.safeParse(cours({ chapitres: [
      chap({ questions: [qv('x:1')] }), chap({ slug: 'ch2', numero: 2, questions: [qv('x:1')] }),
    ] })).success).toBe(false);
  });
  it('refuse un QCM avec moins de 2 ou plus de 10 propositions, ou une proposition trop longue', () => {
    const base = { source: 'x:1', type: 'qcm_unique', enonce: 'Q', bonnes_reponses: [0] };
    expect(schemaQuestionImport.safeParse({ ...base, propositions: ['a'] }).success).toBe(false);
    expect(schemaQuestionImport.safeParse({ ...base, propositions: Array(11).fill('a') }).success).toBe(false);
    expect(schemaQuestionImport.safeParse({ ...base, propositions: Array(10).fill('a') }).success).toBe(true);
    expect(schemaQuestionImport.safeParse({ ...base, propositions: ['a', 'b'.repeat(501)] }).success).toBe(false);
  });
  it('refuse un énoncé de plus de 2000 caractères', () => {
    expect(schemaQuestionImport.safeParse({ ...qv('x:1'), enonce: 'a'.repeat(2001) }).success).toBe(false);
    expect(schemaQuestionImport.safeParse({ ...qv('x:1'), enonce: 'a'.repeat(2000) }).success).toBe(true);
  });
  it('met la couleur en minuscules', () => {
    expect(schemaCoursImport.parse(cours({ couleur: '#0F766E' })).couleur).toBe('#0f766e');
  });
  it('refuse une couleur trop claire avec le message prévu', () => {
    const r = schemaCoursImport.safeParse(cours({ couleur: '#ffff00' }));
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe('Couleur trop claire : contraste insuffisant avec le fond blanc.');
  });
  it('contenu/1re-st2s/bph.json est valide', () => {
    const brut = JSON.parse(readFileSync('contenu/1re-st2s/bph.json', 'utf8'));
    const r = schemaCoursImport.safeParse(brut);
    expect(r.error?.issues ?? []).toEqual([]);
  });
});
