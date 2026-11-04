import { describe, expect, it } from 'vitest';
import { grouperParFiliere } from './catalogue';

describe('grouperParFiliere', () => {
  it('groupe les cours par filière, dans l’ordre des filières', () => {
    const groupes = grouperParFiliere([
      { id: 'a', titre: 'A', filiere: { code: 'STL', nom: 'STL', ordre: 2 } },
      { id: 'b', titre: 'B', filiere: { code: 'ST2S', nom: 'ST2S', ordre: 1 } },
      { id: 'c', titre: 'C', filiere: { code: 'STL', nom: 'STL', ordre: 2 } },
      { id: 'd', titre: 'D', filiere: null },
    ]);
    expect(groupes).toEqual([
      { nom: 'ST2S', cours: [{ id: 'b', titre: 'B' }] },
      { nom: 'STL', cours: [{ id: 'a', titre: 'A' }, { id: 'c', titre: 'C' }] },
      { nom: 'Autres cours', cours: [{ id: 'd', titre: 'D' }] },
    ]);
  });
});
