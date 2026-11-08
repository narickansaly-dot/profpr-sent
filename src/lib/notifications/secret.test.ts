import { describe, expect, it } from 'vitest';
import { secretValide } from './secret';

const s = 'x'.repeat(43);

describe('secretValide', () => {
  it('accepte le bon secret', () => expect(secretValide(`Bearer ${s}`, s)).toBe(true));
  it('refuse un secret faux ou de longueur différente', () => {
    expect(secretValide(`Bearer ${'y'.repeat(43)}`, s)).toBe(false);
    expect(secretValide('Bearer court', s)).toBe(false);
  });
  it('refuse sans en-tête ou sans secret configuré', () => {
    expect(secretValide(null, s)).toBe(false);
    expect(secretValide(`Bearer ${s}`, undefined)).toBe(false);
    expect(secretValide('Bearer ', '')).toBe(false);
  });
  it('refuse un secret configuré trop court', () => expect(secretValide('Bearer abc', 'abc')).toBe(false));
});
