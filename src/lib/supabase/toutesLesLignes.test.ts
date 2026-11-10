import { describe, expect, it, vi } from 'vitest';
import { toutesLesLignes } from './toutesLesLignes';

const lignes = (n: number, depart = 0) => Array.from({ length: n }, (_, i) => ({ i: depart + i }));

describe('toutesLesLignes', () => {
  it('enchaîne les pages jusqu’à une page incomplète', async () => {
    const page = vi.fn(async (de: number) => ({
      data: de === 0 ? lignes(1000) : de === 1000 ? lignes(1000, 1000) : lignes(3, 2000), error: null,
    }));
    const r = await toutesLesLignes(page);
    expect(r.error).toBeNull();
    expect(r.data).toHaveLength(2003);
    expect(r.data![2002]).toEqual({ i: 2002 });
    expect(page.mock.calls).toEqual([[0, 999], [1000, 1999], [2000, 2999]]);
  });
  it('lit une page de plus quand la dernière est exactement pleine', async () => {
    const page = vi.fn(async (de: number) => ({ data: de === 0 ? lignes(1000) : [], error: null }));
    expect((await toutesLesLignes(page)).data).toHaveLength(1000);
    expect(page).toHaveBeenCalledTimes(2);
  });
  it('remonte l’erreur d’une page sans la masquer', async () => {
    const erreur = { message: 'jeton_inconnu' };
    const page = vi.fn(async (de: number) => (de === 0 ? { data: lignes(1000), error: null } : { data: null, error: erreur }));
    const r = await toutesLesLignes(page);
    expect(r.data).toBeNull();
    expect(r.error).toBe(erreur);
  });
});
