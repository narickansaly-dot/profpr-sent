import { describe, expect, it } from 'vitest';
import { formaterDuree } from './temps';

describe('formaterDuree', () => {
  it('écrit minutes et secondes', () => {
    expect(formaterDuree(60 * 60 * 1000)).toBe('60:00');
    expect(formaterDuree(65_400)).toBe('1:06');
  });
  it('ne descend pas sous zéro', () => {
    expect(formaterDuree(-5000)).toBe('0:00');
  });
});
