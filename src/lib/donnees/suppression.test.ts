import { describe, expect, it } from 'vitest';
import { dateSuppression, formaterDateSuppression } from './suppression';

describe('suppression du compte', () => {
  it('prévoit la suppression 30 jours après la demande', () => {
    expect(dateSuppression('2026-12-01T10:00:00Z').toISOString()).toBe('2026-12-31T10:00:00.000Z');
  });
  it('écrit la date en français', () => {
    expect(formaterDateSuppression('2026-12-01T10:00:00Z')).toBe('31 décembre 2026');
  });
});
