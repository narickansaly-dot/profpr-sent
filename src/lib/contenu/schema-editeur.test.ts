import { describe, expect, it } from 'vitest';
import { balisesRetirees, schemaChapitreEditeur } from './schema-editeur';

const ok = { slug: 'ch-1', numero: 1, titre: 'Titre', objectifs: [], sections: [{ id: 'intro', titre: 'Intro', html: '<p>a</p>' }] };

describe('schemaChapitreEditeur', () => {
  it('accepte un chapitre sans questions', () => expect(schemaChapitreEditeur.safeParse(ok).success).toBe(true));
  it('refuse un identifiant de section invalide', () => {
    expect(schemaChapitreEditeur.safeParse({ ...ok, sections: [{ id: '_x', titre: 'A', html: '' }] }).success).toBe(false);
    expect(schemaChapitreEditeur.safeParse({ ...ok, sections: [{ id: '1a', titre: 'A', html: '' }] }).success).toBe(false);
  });
  it('refuse deux sections au même identifiant', () => {
    const s = { id: 'a', titre: 'A', html: '' };
    expect(schemaChapitreEditeur.safeParse({ ...ok, sections: [s, s] }).success).toBe(false);
  });
});

describe('balisesRetirees', () => {
  it('signale les balises disparues', () => {
    expect(balisesRetirees('<p>a</p><script>x</script><img src="x">', '<p>a</p>')).toEqual(['script ×1', 'img ×1']);
  });
  it('ne signale rien quand tout est conservé', () => expect(balisesRetirees('<P>a</P><br>', '<p>a</p><br />')).toEqual([]));
});
