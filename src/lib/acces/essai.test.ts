import { describe, expect, it } from 'vitest';
import { joursEssaiRestants } from './essai';

const inscription = new Date('2026-11-03T10:00:00Z');

describe('joursEssaiRestants', () => {
  it('vaut 7 le jour de l’inscription', () => {
    expect(joursEssaiRestants(inscription, new Date('2026-11-03T12:00:00Z'))).toBe(7);
  });
  it('arrondit à la journée supérieure', () => {
    expect(joursEssaiRestants(inscription, new Date('2026-11-09T09:00:00Z'))).toBe(2);
  });
  it('vaut 0 une fois l’essai terminé', () => {
    expect(joursEssaiRestants(inscription, new Date('2026-11-10T10:00:00Z'))).toBe(0);
    expect(joursEssaiRestants(inscription, new Date('2026-12-01T00:00:00Z'))).toBe(0);
  });
});
