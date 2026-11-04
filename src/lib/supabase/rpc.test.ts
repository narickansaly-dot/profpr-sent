import { describe, expect, it, vi } from 'vitest';
import { appelerAvecRelance } from './rpc';

describe('appelerAvecRelance', () => {
  it('relance une fois sur une violation d’unicité', async () => {
    const appel = vi.fn()
      .mockResolvedValueOnce({ data: null, error: { code: '23505', message: 'duplicate key' } })
      .mockResolvedValueOnce({ data: 'id-1', error: null });
    await expect(appelerAvecRelance(appel)).resolves.toEqual({ data: 'id-1', error: null });
    expect(appel).toHaveBeenCalledTimes(2);
  });
  it('ne relance pas les autres erreurs', async () => {
    const appel = vi.fn().mockResolvedValue({ data: null, error: { code: 'P0001', message: 'quiz_indisponible' } });
    await appelerAvecRelance(appel);
    expect(appel).toHaveBeenCalledTimes(1);
  });
  it('ne relance qu’une seule fois', async () => {
    const appel = vi.fn().mockResolvedValue({ data: null, error: { code: '23505', message: 'duplicate key' } });
    await appelerAvecRelance(appel);
    expect(appel).toHaveBeenCalledTimes(2);
  });
});
