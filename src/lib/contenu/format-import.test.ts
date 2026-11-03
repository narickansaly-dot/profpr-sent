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
