import { describe, expect, it } from 'vitest';
import { bonneReponseTexte, typeDepuisCorrige } from './question';

describe('typeDepuisCorrige', () => {
  it('reconnaît un vrai/faux à son booléen', () => {
    expect(typeDepuisCorrige([], [true])).toBe('vrai_faux');
    expect(typeDepuisCorrige([], [false])).toBe('vrai_faux');
  });
  it('reconnaît un QCM unique et multiple', () => {
    expect(typeDepuisCorrige(['a', 'b', 'c'], [1])).toBe('qcm_unique');
    expect(typeDepuisCorrige(['a', 'b', 'c'], [0, 2])).toBe('qcm_multiple');
  });
  it('retombe sur la réponse courte sans bonne réponse indexée', () => {
    expect(typeDepuisCorrige([], [])).toBe('reponse_courte');
    expect(typeDepuisCorrige(null, null)).toBe('reponse_courte');
  });
});

describe('bonneReponseTexte', () => {
  it('rédige un QCM sur les propositions d’origine', () => {
    expect(bonneReponseTexte(['a', 'b', 'c'], [0, 2], [])).toBe('a ; c');
  });
  it('rédige un vrai/faux', () => {
    expect(bonneReponseTexte([], [false], [])).toBe('Faux');
  });
  it('liste les réponses acceptées d’une réponse courte', () => {
    expect(bonneReponseTexte([], [], ['12', 'douze'])).toBe('12 ; douze');
  });
});
