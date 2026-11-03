import { describe, expect, it } from 'vitest';
import { etatEvaluation } from './regles';

const maintenant = new Date('2026-11-10T12:00:00Z');

describe('etatEvaluation', () => {
  it('verrouillée tant que des chapitres ne sont pas validés', () => {
    expect(etatEvaluation({ nbChapitres: 7, nbValides: 5, essais: [], maintenant }))
      .toEqual({ etat: 'verrouillee', chapitresRestants: 2 });
  });
  it('disponible avec 3 essais quand tout est validé', () => {
    expect(etatEvaluation({ nbChapitres: 7, nbValides: 7, essais: [], maintenant }))
      .toEqual({ etat: 'disponible', essaisRestants: 3 });
  });
  it('en cours prime sur tout le reste', () => {
    expect(etatEvaluation({ nbChapitres: 7, nbValides: 7, essais: [{ id: 'x', statut: 'en_cours', fin: null }], maintenant }))
      .toEqual({ etat: 'en_cours', tentativeId: 'x' });
  });
  it('attente de 24 heures après un essai', () => {
    expect(etatEvaluation({ nbChapitres: 7, nbValides: 7, essais: [{ id: 'a', statut: 'terminee', fin: '2026-11-10T02:00:00Z' }], maintenant }))
      .toEqual({ etat: 'attente', disponibleLe: new Date('2026-11-11T02:00:00Z'), essaisRestants: 2 });
  });
  it('disponible de nouveau après 24 heures', () => {
    expect(etatEvaluation({ nbChapitres: 7, nbValides: 7, essais: [{ id: 'a', statut: 'expiree', fin: '2026-11-09T11:00:00Z' }], maintenant }))
      .toEqual({ etat: 'disponible', essaisRestants: 2 });
  });
  it('épuisée après 3 essais', () => {
    const essais = ['a', 'b', 'c'].map((id) => ({ id, statut: 'terminee' as const, fin: '2026-11-01T00:00:00Z' }));
    expect(etatEvaluation({ nbChapitres: 7, nbValides: 7, essais, maintenant })).toEqual({ etat: 'epuisee' });
  });
});
