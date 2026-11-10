import { describe, expect, it } from 'vitest';
import { bonneReponseTexte } from './question';

describe('bonneReponseTexte', () => {
  it('rédige un QCM sur les propositions d’origine', () => {
    expect(bonneReponseTexte('qcm_multiple', ['a', 'b', 'c'], [0, 2], [])).toBe('a ; c');
    expect(bonneReponseTexte('qcm_unique', ['a', 'b', 'c'], [1], [])).toBe('b');
  });
  it('rédige un vrai/faux', () => {
    expect(bonneReponseTexte('vrai_faux', [], [false], [])).toBe('Faux');
  });
  it('liste les réponses acceptées d’une réponse courte', () => {
    expect(bonneReponseTexte('reponse_courte', [], [], ['12', 'douze'])).toBe('12 ; douze');
  });
  it('signale un corrigé absent', () => {
    expect(bonneReponseTexte('reponse_courte', null, null, [])).toBe('Non disponible');
  });
  it('suit le type de la question, pas la forme du corrigé', () => {
    // Un QCM multiple à une seule bonne réponse reste un QCM multiple.
    expect(bonneReponseTexte('qcm_multiple', ['a', 'b'], [1], [])).toBe('b');
  });
});
