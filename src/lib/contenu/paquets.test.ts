import { describe, expect, it } from 'vitest';
import { paquets } from './paquets';

describe('paquets', () => {
  it('découpe en paquets courts', () => {
    expect(paquets([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(paquets([], 3)).toEqual([]);
    expect(paquets([1, 2], 5)).toEqual([[1, 2]]);
  });
  it('refuse une taille invalide', () => {
    expect(() => paquets([1], 0)).toThrow(RangeError);
  });
});
