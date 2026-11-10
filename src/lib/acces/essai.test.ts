import { describe, expect, it } from 'vitest';
import { DUREE_ESSAI_JOURS, joursAvant } from './essai';

const fin = new Date('2026-11-10T10:00:00Z');

describe('joursAvant', () => {
  it('l’essai dure 7 jours', () => {
    expect(DUREE_ESSAI_JOURS).toBe(7);
  });
  it('vaut 7 le jour de l’inscription', () => {
    expect(joursAvant(fin, new Date('2026-11-03T12:00:00Z'))).toBe(7);
  });
  it('arrondit à la journée supérieure', () => {
    expect(joursAvant(fin, new Date('2026-11-09T09:00:00Z'))).toBe(2);
  });
  it('vaut 0 une fois la fin passée', () => {
    expect(joursAvant(fin, new Date('2026-11-10T10:00:00Z'))).toBe(0);
    expect(joursAvant(fin, new Date('2026-12-01T00:00:00Z'))).toBe(0);
  });
});
