import { describe, expect, it } from 'vitest';
import { contraste, couleurCoursAcceptable } from './couleur';

describe('contraste', () => {
  it('vaut 21 entre noir et blanc', () => {
    expect(contraste('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });
  it('vaut 1 entre deux couleurs identiques', () => {
    expect(contraste('#2563eb', '#2563eb')).toBeCloseTo(1, 5);
  });
  it('est symétrique', () => {
    expect(contraste('#2563eb', '#ffffff')).toBeCloseTo(contraste('#ffffff', '#2563eb'), 5);
  });
  it('accepte la majuscule', () => {
    expect(contraste('#FFFFFF', '#000000')).toBeCloseTo(21, 1);
  });
});

describe('couleurCoursAcceptable', () => {
  it('accepte le bleu par défaut et la couleur de BPH', () => {
    expect(contraste('#2563eb', '#ffffff')).toBeGreaterThanOrEqual(3);
    expect(couleurCoursAcceptable('#2563eb')).toBe(true);
    expect(couleurCoursAcceptable('#0f766e')).toBe(true);
  });
  it('refuse le jaune, trop clair sur fond blanc', () => {
    expect(couleurCoursAcceptable('#ffff00')).toBe(false);
  });
});
