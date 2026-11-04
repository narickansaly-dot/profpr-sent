import { describe, expect, it } from 'vitest';
import { etatEvaluation, fenetreEvaluation } from './regles';

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
  it('en cours prime même si l’évaluation est verrouillée', () => {
    expect(etatEvaluation({ nbChapitres: 7, nbValides: 2, essais: [{ id: 'x', statut: 'en_cours', fin: null }], maintenant }))
      .toEqual({ etat: 'en_cours', tentativeId: 'x' });
  });
  it('attente mesurée depuis la dernière fin avec deux essais', () => {
    const essais = [
      { id: 'a', statut: 'terminee' as const, fin: '2026-11-10T08:00:00Z' },
      { id: 'b', statut: 'terminee' as const, fin: '2026-11-08T00:00:00Z' },
    ];
    expect(etatEvaluation({ nbChapitres: 7, nbValides: 7, essais, maintenant }))
      .toEqual({ etat: 'attente', disponibleLe: new Date('2026-11-11T08:00:00Z'), essaisRestants: 1 });
  });
  it('exactement 24 heures après : disponible', () => {
    expect(etatEvaluation({ nbChapitres: 7, nbValides: 7, essais: [{ id: 'a', statut: 'terminee', fin: '2026-11-09T12:00:00Z' }], maintenant }))
      .toEqual({ etat: 'disponible', essaisRestants: 2 });
  });
});

describe('fenetreEvaluation', () => {
  const m = new Date('2026-11-17T12:00:00Z');
  it('ok sans échéance', () => expect(fenetreEvaluation([], m)).toEqual({ etat: 'ok' }));
  it('pas encore ouverte', () => {
    expect(fenetreEvaluation([{ ouverture: '2026-11-18T08:00:00Z', limite: null }], m))
      .toEqual({ etat: 'pas_ouverte', ouverture: new Date('2026-11-18T08:00:00Z') });
  });
  it('ouverte avec une limite, renvoyée pour l’affichage', () => {
    expect(fenetreEvaluation([{ ouverture: null, limite: '2026-11-20T18:00:00Z' }], m))
      .toEqual({ etat: 'ok', limite: new Date('2026-11-20T18:00:00Z') });
  });
  it('close quand toutes les limites sont passées', () => {
    expect(fenetreEvaluation([{ ouverture: null, limite: '2026-11-10T18:00:00Z' }], m))
      .toEqual({ etat: 'close', limite: new Date('2026-11-10T18:00:00Z') });
  });
  it('ouverte si au moins une classe l’ouvre', () => {
    expect(fenetreEvaluation([
      { ouverture: null, limite: '2026-11-10T18:00:00Z' },
      { ouverture: '2026-11-16T08:00:00Z', limite: null },
    ], m)).toEqual({ etat: 'ok' });
  });
});

describe('etatEvaluation et fenêtre', () => {
  const m = new Date('2026-11-17T12:00:00Z');
  it('pas_ouverte après le verrouillage des chapitres', () => {
    expect(etatEvaluation({ nbChapitres: 2, nbValides: 2, essais: [], maintenant: m,
      fenetre: { etat: 'pas_ouverte', ouverture: new Date('2026-11-18T08:00:00Z') } }))
      .toEqual({ etat: 'pas_ouverte', ouverture: new Date('2026-11-18T08:00:00Z') });
  });
  it('une évaluation en cours prime sur une limite passée', () => {
    expect(etatEvaluation({ nbChapitres: 2, nbValides: 2, essais: [{ id: 'x', statut: 'en_cours', fin: null }], maintenant: m,
      fenetre: { etat: 'close', limite: new Date('2026-11-10T18:00:00Z') } })).toEqual({ etat: 'en_cours', tentativeId: 'x' });
  });
  it('disponible porte la limite', () => {
    expect(etatEvaluation({ nbChapitres: 1, nbValides: 1, essais: [], maintenant: m,
      fenetre: { etat: 'ok', limite: new Date('2026-11-20T18:00:00Z') } }))
      .toEqual({ etat: 'disponible', essaisRestants: 3, limite: new Date('2026-11-20T18:00:00Z') });
  });
});
