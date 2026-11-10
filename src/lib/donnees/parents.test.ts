import { describe, expect, it } from 'vitest';
import { formaterCodeParent, peutCreerCode, sectionParents } from './parents';

describe('formaterCodeParent', () => {
  it('groupe le code par 4', () => {
    expect(formaterCodeParent('ABCDEFGH')).toBe('ABCD-EFGH');
  });
  it('ignore la casse, les espaces et les tirets déjà présents', () => {
    expect(formaterCodeParent('abcd efgh')).toBe('ABCD-EFGH');
    expect(formaterCodeParent('ABCD-EFGH')).toBe('ABCD-EFGH');
  });
  it('laisse un code incomplet groupé sans tiret final', () => {
    expect(formaterCodeParent('ABCD')).toBe('ABCD');
    expect(formaterCodeParent('')).toBe('');
  });
});

describe('sectionParents', () => {
  it('élève de 15 ans ou plus : gestion complète', () => {
    expect(sectionParents('eleve', false)).toBe('eleve_15_ans');
  });
  it('élève de moins de 15 ans : explication seulement', () => {
    expect(sectionParents('eleve', true)).toBe('eleve_moins_15_ans');
  });
  it('âge inconnu : traité comme moins de 15 ans (comme la base)', () => {
    expect(sectionParents('eleve', null)).toBe('eleve_moins_15_ans');
  });
  it('parent : enfants suivis', () => {
    expect(sectionParents('parent', null)).toBe('enfants_suivis');
  });
  it('autres rôles : aucune section', () => {
    expect(sectionParents('enseignant', false)).toBeNull();
    expect(sectionParents('admin', false)).toBeNull();
  });
});

describe('peutCreerCode', () => {
  it('masque le bouton à partir de deux parents', () => {
    expect(peutCreerCode(0)).toBe(true);
    expect(peutCreerCode(1)).toBe(true);
    expect(peutCreerCode(2)).toBe(false);
  });
});
