import { describe, expect, it } from 'vitest';
import { formaterDuree, formaterEcheance } from './temps';

describe('formaterDuree', () => {
  it('écrit minutes et secondes', () => {
    expect(formaterDuree(60 * 60 * 1000)).toBe('60:00');
    expect(formaterDuree(65_400)).toBe('1:06');
  });
  it('ne descend pas sous zéro', () => {
    expect(formaterDuree(-5000)).toBe('0:00');
  });
});

describe('formaterEcheance', () => {
  it('affiche la date et l’heure de Paris (hiver)', () => {
    expect(formaterEcheance(new Date('2026-11-20T17:00:00Z'))).toMatch(/^20 novembre.*18:00$/);
  });
  it('affiche l’heure d’été de Paris', () => {
    expect(formaterEcheance(new Date('2026-07-01T16:00:00Z'))).toMatch(/^1(er)? juillet.*18:00$/);
  });
});
