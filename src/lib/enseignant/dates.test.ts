import { describe, expect, it } from 'vitest';
import { heureParisVersIso, isoVersHeureParis } from './dates';

describe('heureParisVersIso', () => {
  it('convertit une heure d’hiver (UTC+1)', () => {
    expect(heureParisVersIso('2026-11-20T18:00')).toBe('2026-11-20T17:00:00.000Z');
  });
  it('convertit une heure d’été (UTC+2)', () => {
    expect(heureParisVersIso('2026-06-20T18:00')).toBe('2026-06-20T16:00:00.000Z');
  });
  it('gère le jour du passage à l’heure d’été (29 mars 2026)', () => {
    expect(heureParisVersIso('2026-03-29T01:00')).toBe('2026-03-29T00:00:00.000Z');
    expect(heureParisVersIso('2026-03-29T10:00')).toBe('2026-03-29T08:00:00.000Z');
  });
  it('gère le jour du retour à l’heure d’hiver (25 octobre 2026)', () => {
    expect(heureParisVersIso('2026-10-25T10:00')).toBe('2026-10-25T09:00:00.000Z');
  });
  it('fige le choix pour une heure inexistante (02:30 le 29 mars) : décalage d’hiver, soit 03:30 à Paris', () => {
    expect(heureParisVersIso('2026-03-29T02:30')).toBe('2026-03-29T01:30:00.000Z');
  });
  it('fige le choix pour une heure ambiguë (02:30 le 25 octobre) : seconde occurrence, heure d’hiver', () => {
    expect(heureParisVersIso('2026-10-25T02:30')).toBe('2026-10-25T01:30:00.000Z');
  });
  it('renvoie null pour une valeur vide', () => {
    expect(heureParisVersIso('')).toBeNull();
    expect(heureParisVersIso('   ')).toBeNull();
  });
  it('renvoie null pour une valeur invalide', () => {
    expect(heureParisVersIso('demain')).toBeNull();
    expect(heureParisVersIso('2026-13-40T99:00')).toBeNull();
    expect(heureParisVersIso('2026-02-30T10:00')).toBeNull();
  });
});

describe('isoVersHeureParis', () => {
  it('reconvertit en valeur datetime-local à l’heure de Paris', () => {
    expect(isoVersHeureParis('2026-11-20T17:00:00.000Z')).toBe('2026-11-20T18:00');
    expect(isoVersHeureParis('2026-06-20T16:00:00+00:00')).toBe('2026-06-20T18:00');
  });
  it('renvoie une chaîne vide si la valeur est absente ou invalide', () => {
    expect(isoVersHeureParis(null)).toBe('');
    expect(isoVersHeureParis('xx')).toBe('');
  });
});
