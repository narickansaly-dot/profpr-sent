import { describe, expect, it } from 'vitest';
import { codeClasseValide, normaliserCode } from './code';

describe('normaliserCode', () => {
  it('met en majuscules et retire espaces et symboles', () => {
    expect(normaliserCode(' ab-cd ef ')).toBe('ABCDEF');
  });
  it('limite à 12 caractères', () => {
    expect(normaliserCode('a'.repeat(30))).toBe('A'.repeat(12));
  });
  it('neutralise une valeur piégée', () => {
    expect(normaliserCode('"><script>x</script>')).toBe('SCRIPTXSCRIPT'.slice(0, 12));
  });
});

describe('codeClasseValide', () => {
  it('accepte 6 caractères de l’alphabet sans ambiguïté, sans tenir compte de la casse', () => {
    expect(codeClasseValide('abcdef')).toBe(true);
    expect(codeClasseValide('A2B3C4')).toBe(true);
  });
  it('refuse les caractères ambigus et les mauvaises longueurs', () => {
    expect(codeClasseValide('ABCDE0')).toBe(false);
    expect(codeClasseValide('ABCDEI')).toBe(false);
    expect(codeClasseValide('ABCDE')).toBe(false);
    expect(codeClasseValide('ABCDEFG')).toBe(false);
  });
});
