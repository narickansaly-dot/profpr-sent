import { describe, expect, it } from 'vitest';
import { balisesRetirees, schemaChapitreEditeur } from './schema-editeur';

const ok = { slug: 'ch-1', numero: 1, titre: 'Titre', objectifs: [], sections: [{ id: 'intro', titre: 'Intro', html: '<p>a</p>' }] };

describe('schemaChapitreEditeur', () => {
  it('accepte un chapitre sans questions', () => expect(schemaChapitreEditeur.safeParse(ok).success).toBe(true));
  it('refuse un identifiant de section invalide', () => {
    expect(schemaChapitreEditeur.safeParse({ ...ok, sections: [{ id: '_x', titre: 'A', html: '' }] }).success).toBe(false);
    expect(schemaChapitreEditeur.safeParse({ ...ok, sections: [{ id: '1a', titre: 'A', html: '' }] }).success).toBe(false);
  });
  it('réserve l’identifiant a-retenir au bloc « Je retiens »', () => {
    const r = schemaChapitreEditeur.safeParse({ ...ok, sections: [{ id: 'a-retenir', titre: 'A', html: '' }] });
    expect(!r.success && r.error.issues[0].message).toBe('L’identifiant « a-retenir » est réservé au bloc « Je retiens ».');
  });
  it('refuse deux sections au même identifiant, en français', () => {
    const s = { id: 'a', titre: 'A', html: '' };
    const r = schemaChapitreEditeur.safeParse({ ...ok, sections: [s, s] });
    expect(r.success).toBe(false);
    expect(!r.success && r.error.issues[0].message).toBe('L’identifiant « a » est déjà utilisé par une autre section.');
    expect(!r.success && r.error.issues[0].path).toEqual(['sections', 1, 'id']);
  });
});

describe('balisesRetirees', () => {
  it('signale les balises disparues', () => {
    expect(balisesRetirees('<p>a</p><script>x</script><img src="x">', '<p>a</p>')).toEqual(['script ×1', 'img ×1', 'attribut src ×1']);
  });
  it('signale les attributs et styles retirés', () => {
    expect(balisesRetirees('<p onclick="x" class="a" style="color:red;behavior:url(x)">a</p>', '<p class="a" style="color:red">a</p>'))
      .toEqual(['attribut onclick ×1', 'style behavior ×1']);
  });
  it('reste linéaire sur une balise ouverte suivie d’espaces sans fin', () => {
    const debut = performance.now();
    balisesRetirees('<p' + ' '.repeat(200_000), '');
    balisesRetirees('<a'.repeat(100_000), '');
    expect(performance.now() - debut).toBeLessThan(200);
  });
  it('ne signale rien quand tout est conservé', () => expect(balisesRetirees('<P>a</P><br>', '<p>a</p><br />')).toEqual([]));
});
