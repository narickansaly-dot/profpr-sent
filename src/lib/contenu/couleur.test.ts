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

describe('contraste (valeurs intermédiaires)', () => {
  it('suit la linéarisation sRGB', () => {
    expect(contraste('#777777', '#ffffff')).toBeCloseTo(4.48, 1);
    expect(contraste('#2563eb', '#ffffff')).toBeCloseTo(5.17, 1);
  });
});

describe('couleurCoursAcceptable', () => {
  it('accepte le bleu par défaut et la couleur de BPH (texte blanc lisible, ≥ 4,5:1)', () => {
    expect(contraste('#2563eb', '#ffffff')).toBeGreaterThanOrEqual(4.5);
    expect(contraste('#0f766e', '#ffffff')).toBeGreaterThanOrEqual(4.5);
    expect(couleurCoursAcceptable('#2563eb')).toBe(true);
    expect(couleurCoursAcceptable('#0f766e')).toBe(true);
  });
  it('refuse le jaune, trop clair sur fond blanc', () => {
    expect(couleurCoursAcceptable('#ffff00')).toBe(false);
  });
  it('refuse les couleurs entre 3:1 et 4,5:1 (texte blanc illisible sur le bouton principal)', () => {
    expect(couleurCoursAcceptable('#0ca678')).toBe(false); // ≈ 3,12
    expect(couleurCoursAcceptable('#1098ad')).toBe(false); // ≈ 3,43
    expect(couleurCoursAcceptable('#e8590c')).toBe(false); // ≈ 3,58
  });
  it('respecte la limite de 4,5:1', () => {
    expect(couleurCoursAcceptable('#757575')).toBe(true); // ≈ 4,61
    expect(couleurCoursAcceptable('#777777')).toBe(false); // ≈ 4,48
  });
  it('refuse un format invalide sans lever d’exception', () => {
    expect(couleurCoursAcceptable('#zz')).toBe(false);
  });
});
