import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { nettoyerHtml } from './html';

const bph = JSON.parse(readFileSync('contenu/1re-st2s/bph.json', 'utf8')) as {
  chapitres: { sections: { html: string }[]; a_retenir?: string }[];
};
const morceaux = bph.chapitres.flatMap((c) => [...c.sections.map((s) => s.html), c.a_retenir ?? '']);

/** Inventaire « balise@attribut » d'un fragment, pour vérifier que rien d'utile n'est retiré. */
function inventaire(html: string): string[] {
  const sortie: string[] = [];
  for (const m of html.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g)) {
    sortie.push(m[1]);
    for (const a of m[2].matchAll(/([a-zA-Z:-]+)=/g)) sortie.push(`${m[1]}@${a[1]}`);
  }
  return sortie.sort();
}

describe('nettoyerHtml', () => {
  it('garde intact tout le contenu BPH (balises et attributs)', () => {
    for (const html of morceaux) expect(inventaire(nettoyerHtml(html))).toEqual(inventaire(html));
  });
  it('garde viewBox et linearGradient avec leur casse', () => {
    const svg = '<svg viewBox="0 0 10 10" role="img" aria-label="x"><defs><linearGradient id="g"><stop offset="0" /></linearGradient></defs></svg>';
    expect(nettoyerHtml(svg)).toContain('viewBox="0 0 10 10"');
    expect(nettoyerHtml(svg)).toContain('<linearGradient');
  });
  it.each([
    ['<script>alert(1)</script><p>ok</p>', '<p>ok</p>'],
    ['<img src="x" onerror="alert(1)">', ''],
    ['<a href="javascript:alert(1)">x</a>', '<a>x</a>'],
    ['<svg><script>alert(1)</script></svg>', '<svg></svg>'],
    ['<svg><foreignObject><p>x</p></foreignObject></svg>', '<svg></svg>'],
    ['<iframe src="https://exemple.fr"></iframe>', ''],
    ['<style>body{display:none}</style>', ''],
    ['<p style="background:url(https://x.fr/a.png)">x</p>', '<p>x</p>'],
    ['<line marker-end="url(https://x.fr/m.svg#a)" />', '<line></line>'],
    ['<svg><use href="https://x.fr/s.svg#a" /></svg>', '<svg></svg>'],
    ['<form action="https://x.fr"><input name="a"></form>', '<input />'],
    // Cas limites XSS : casse mixte (lowerCaseTags est désactivé), SVG animé, entités, attributs sans guillemets, styles.
    ['<ScRiPt>alert(1)</ScRiPt><p>ok</p>', '<p>ok</p>'],
    ['<SCRIPT>alert(1)</SCRIPT>', ''],
    ['<ScRiPt src=x>', ''],
    ['<svg><a href="javascript:alert(1)"><text>x</text></a></svg>', '<svg><a><text>x</text></a></svg>'],
    ['<svg><animate attributeName="href" to="javascript:alert(1)"/></svg>', '<svg></svg>'],
    ['<svg><set attributeName="href" to="javascript:alert(1)"/></svg>', '<svg></svg>'],
    ['<svg><a xlink:href="javascript:alert(1)">x</a></svg>', '<svg><a>x</a></svg>'],
    ['<a href="javascript&colon;alert(1)">x</a>', '<a>x</a>'],
    ['<a href="jav&#x09;ascript:alert(1)">x</a>', '<a>x</a>'],
    ['<a href="//evil.fr">x</a>', '<a>x</a>'],
    ['<img src=x onerror=alert(1)>', ''],
    ['<p style="width:expression(alert(1))">x</p>', '<p>x</p>'],
    ['<p style="background:url(javascript:alert(1))">x</p>', '<p>x</p>'],
    ['<p style="fill:url(https://x.fr/a.svg#a)">x</p>', '<p>x</p>'],
    ['<p style="fill:url( #a)">x</p>', '<p>x</p>'],
    ['<p style="fill:red;position:fixed">x</p>', '<p style="fill:red">x</p>'],
    ['<p ONCLICK="a()" onclick="a()">x</p>', '<p>x</p>'],
    ['<svg onload=alert(1)><circle r="1"/></svg>', '<svg><circle r="1"></circle></svg>'],
    ['<svg><style>*{fill:red}</style><circle r="1"/></svg>', '<svg><circle r="1"></circle></svg>'],
    ['<math><mi>x</mi></math>', 'x'],
    ['<p>a<!-- <script>x</script> -->b</p>', '<p>ab</p>'],
  ])('retire ce qui est dangereux : %s', (entree, attendu) => {
    expect(nettoyerHtml(entree).replace(/\s+/g, ' ').trim()).toBe(attendu);
  });
  it('ne laisse aucun gestionnaire d’événement ni schéma javascript dans les sorties dangereuses', () => {
    const vecteurs = ['<ScRiPt>x</ScRiPt>', '<svg onload=a()>', '<img src=x onerror=a()>', '<a href="javascript:a()">x</a>',
      '<input type="text" onfocus="a()" autofocus>'];
    for (const v of vecteurs) expect(nettoyerHtml(v)).not.toMatch(/<script|\son\w+\s*=|javascript:/i);
  });
  it('garde fill:url(#id) dans un style', () => {
    expect(nettoyerHtml('<path style="fill:url(#g);stroke:var(--muted)" />')).toBe('<path style="fill:url(#g);stroke:var(--muted)"></path>');
  });
  it('garde marker-end="url(#id)"', () => {
    expect(nettoyerHtml('<line marker-end="url(#fleche)" />')).toContain('marker-end="url(#fleche)"');
  });
  it('ajoute rel="noopener noreferrer" aux liens https', () => {
    expect(nettoyerHtml('<a href="https://eduscol.education.fr" target="_blank">x</a>'))
      .toBe('<a href="https://eduscol.education.fr" target="_blank" rel="noopener noreferrer">x</a>');
  });
  it('accepte une image du bucket schemas et refuse les autres', () => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';
    const bonne = `${base}/storage/v1/object/public/schemas/bph/a.png`;
    expect(nettoyerHtml(`<img src="${bonne}" alt="Coeur">`)).toContain(`src="${bonne}"`);
    expect(nettoyerHtml('<img src="https://ailleurs.fr/a.png" alt="x">')).toBe('');
  });
});
