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
    ['<p id="__next_f">x</p>', '<p>x</p>'],
    ['<p id="__NEXT_DATA__">x</p>', '<p>x</p>'],
    ['<p id="a_b">x</p>', '<p>x</p>'],
    ['<p id="ok-1">x</p>', '<p id="ok-1">x</p>'],
    ['<label for="__next_f imc-a">x</label>', '<label for="imc-a">x</label>'],
    ['<label for="__next_f">x</label>', '<label>x</label>'],
    ['<p aria-describedby="__next imc-a">x</p>', '<p aria-describedby="imc-a">x</p>'],
    ['<a href="https://e" target="_top">x</a>', '<a href="https://e">x</a>'],
    ['<svg></p><style><a id="</style><img src=1 onerror=alert(1)>">', '<svg><p></p>"&gt;</svg>'],
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
  it.each([
    'a/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/auth/v1/x',
    'a/%2e%2e/%2E%2E/autre/x.png',
    'a/.%2e/x.png',
    'a/%2e./x.png',
    'a/../../x.png',
    'a\\..\\x.png',
    'a/%2f/x.png',
  ])('refuse une image avec un segment encodé ou remonté : %s', (fin) => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';
    expect(nettoyerHtml(`<img src="${base}/storage/v1/object/public/schemas/${fin}" alt="x">`)).toBe('');
  });
  it('refuse les images d’un autre chemin, d’un autre hôte ou avec identifiants', () => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';
    const h = new URL(base).host;
    for (const src of [`${base}/storage/v1/object/public/autre/a.png`, `${base}.evil.com/storage/v1/object/public/schemas/a.png`,
      `http://u:p@${h}/storage/v1/object/public/schemas/a.png`, `http://${h}@evil.com/storage/v1/object/public/schemas/a.png`,
      ` ${base}/storage/v1/object/public/schemas/a.png/../b`, 'pas une url'])
      expect(nettoyerHtml(`<img src="${src}">`)).toBe('');
  });
  it('traite 300 Ko d’entrée adverse en moins de 200 ms', () => {
    for (const unite of ['<script', '<ScRiPt>', '<style', '<foreignObject', '<svg<script']) {
      const entree = unite.repeat(Math.ceil(300_000 / unite.length));
      const debut = performance.now();
      nettoyerHtml(entree);
      expect(performance.now() - debut).toBeLessThan(200);
    }
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
