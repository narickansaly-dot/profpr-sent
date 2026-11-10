import { describe, expect, it } from 'vitest';
import { basculerChoix, estRepondue, formaterNote, texteReponse } from './reponse';

describe('basculerChoix', () => {
  it('ajoute puis retire une case, triée', () => {
    expect(basculerChoix([2], 0)).toEqual([0, 2]);
    expect(basculerChoix([0, 2], 2)).toEqual([0]);
  });
  it('renvoie null quand plus rien n’est coché', () => {
    expect(basculerChoix([1], 1)).toBeNull();
  });
});

describe('estRepondue', () => {
  it('reconnaît une réponse vide', () => {
    expect(estRepondue(null)).toBe(false);
    expect(estRepondue([])).toBe(false);
    expect(estRepondue(['   '])).toBe(false);
  });
  it('reconnaît une réponse donnée', () => {
    expect(estRepondue([0])).toBe(true);
    expect(estRepondue([false])).toBe(true);
    expect(estRepondue(['FC'])).toBe(true);
  });
});

describe('texteReponse', () => {
  const propositions = ['Le cœur', 'Le foie', 'Les poumons'];
  it('affiche les propositions choisies', () => {
    expect(texteReponse('qcm_multiple', propositions, [0, 2])).toBe('Le cœur ; Les poumons');
  });
  it('affiche vrai ou faux', () => {
    expect(texteReponse('vrai_faux', [], [false])).toBe('Faux');
  });
  it('affiche le texte saisi ou l’absence de réponse', () => {
    expect(texteReponse('reponse_courte', [], ['FC'])).toBe('FC');
    expect(texteReponse('qcm_unique', propositions, null)).toBe('Pas de réponse');
  });
});

describe('formaterNote', () => {
  it('écrit la note en pourcentage à la française', () => {
    expect(formaterNote(75)).toBe('75 %');
    expect(formaterNote(66.67)).toBe('66,7 %');
  });
});
