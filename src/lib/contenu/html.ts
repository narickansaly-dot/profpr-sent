import sanitizeHtml from 'sanitize-html';

// Liste blanche établie d'après l'inventaire du contenu BPH (voir html.test.ts). SVG en ligne compris.
// Tout ce qui n'y figure pas est supprimé, quelle que soit la casse (le parseur ne met pas les noms en minuscules).
const BALISES_HTML = ['p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 'sub', 'sup', 'small', 'span', 'div',
  'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'table', 'caption', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'figure', 'figcaption', 'img', 'a', 'label', 'input', 'output'];
const BALISES_SVG = ['svg', 'g', 'defs', 'marker', 'pattern', 'linearGradient', 'radialGradient', 'stop',
  'line', 'polyline', 'polygon', 'path', 'rect', 'circle', 'ellipse', 'text', 'tspan', 'title', 'desc'];
const ATTRIBUTS_SVG = ['x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'dx', 'dy', 'width', 'height',
  'd', 'points', 'viewBox', 'preserveAspectRatio', 'transform', 'fill', 'stroke', 'stroke-width', 'stroke-dasharray',
  'stroke-linecap', 'stroke-linejoin', 'opacity', 'fill-opacity', 'text-anchor', 'dominant-baseline', 'font-size',
  'font-weight', 'marker-start', 'marker-mid', 'marker-end', 'markerWidth', 'markerHeight', 'refX', 'refY', 'orient',
  'markerUnits', 'patternUnits', 'gradientUnits', 'offset', 'stop-color', 'stop-opacity'];
const COMMUNS = ['class', 'id', 'style', 'role', 'aria-label', 'aria-hidden', 'aria-describedby', 'title', 'data-ch'];
/** Valeur de style sûre : pas d'expression(), et url() seulement vers une ancre interne (url(#id)). */
const STYLE_SUR = /^(?!.*expression\s*\()(?!.*url\s*\((?!#[\w-]+\)))[#\w\s.,%()+-]+$/i;
const PROPRIETES_STYLE = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linejoin', 'stroke-linecap', 'stop-color', 'stop-opacity', 'opacity', 'font-size', 'font-weight',
  'font-style', 'text-anchor', 'text-align', 'vertical-align', 'color', 'background', 'background-color', 'width',
  'max-width', 'min-width', 'height', 'margin', 'padding', 'border', 'display'];
/** Une référence SVG interne uniquement : url(#identifiant). */
const URL_INTERNE = /^url\(#[\w-]+\)$/;

const CHEMIN_SCHEMAS = '/storage/v1/object/public/schemas/';
/** Identifiant de contenu : minuscules, chiffres, tirets ; jamais de « _ » initial (anti DOM clobbering, ex. __next_f). */
const ID_SUR = /^[a-z][a-z0-9-]{0,63}$/;

/** Origine Supabase configurée. Variable absente : base locale hors production seulement. Vide ou invalide : null (aucune image). */
function origineSupabase(): URL | null {
  const brute = process.env.NEXT_PUBLIC_SUPABASE_URL
    ?? (process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:54321' : '');
  try {
    return brute ? new URL(brute) : null;
  } catch {
    return null;
  }
}

/** Vrai si `src` vise exactement le bucket schemas de l'origine Supabase (contrôle sur l'URL analysée). */
function imageAutorisee(src: string, origine: URL | null): boolean {
  if (!origine || /%2e|%2f|%5c|\\|\.\./i.test(src)) return false;
  try {
    const u = new URL(src);
    return u.origin === origine.origin && u.username === '' && u.password === '' && u.pathname.startsWith(CHEMIN_SCHEMAS);
  } catch {
    return false;
  }
}

/** Ne garde que les jetons d'identifiant valides d'une liste séparée par des espaces (`for`, `aria-describedby`). */
function jetonsSurs(valeur: string): string {
  return valeur.split(/\s+/).filter((j) => ID_SUR.test(j)).join(' ');
}

const BALISES_A_COUPER = ['script', 'style', 'foreignobject'];
const MINUSCULES = (t: string) => t.replace(/[A-Z]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 32));

/**
 * Retire <script>, <style> et <foreignObject> (toute casse) avec leur contenu. Linéaire : chaque balise fermante
 * est cherchée par indexOf, et une recherche sans résultat n'est jamais refaite pour le même nom.
 */
function couperBalises(html: string): string {
  const bas = MINUSCULES(html);
  const sansFermeture = new Set<string>();
  let sortie = '';
  let curseur = 0;
  for (const m of bas.matchAll(/<(script|style|foreignobject)\b/g)) {
    const debut = m.index;
    const nom = m[1];
    if (debut < curseur || sansFermeture.has(nom) || !BALISES_A_COUPER.includes(nom)) continue;
    const fermeture = bas.indexOf(`</${nom}`, debut);
    const fin = fermeture === -1 ? -1 : bas.indexOf('>', fermeture);
    if (fin === -1) {
      sansFermeture.add(nom);
      continue;
    }
    sortie += html.slice(curseur, debut);
    curseur = fin + 1;
  }
  return sortie + html.slice(curseur);
}

const ATTRIBUTS_AUTORISES: sanitizeHtml.IOptions['allowedAttributes'] = {
  '*': COMMUNS,
  ...Object.fromEntries(BALISES_SVG.map((b) => [b, [...COMMUNS, ...ATTRIBUTS_SVG]])),
  a: [...COMMUNS, 'href', { name: 'target', values: ['_blank'] }, 'rel'],
  img: [...COMMUNS, 'src', 'alt', 'width', 'height', { name: 'loading', values: ['lazy', 'eager'] }],
  td: [...COMMUNS, 'rowspan', 'colspan'],
  th: [...COMMUNS, 'rowspan', 'colspan', { name: 'scope', values: ['col', 'row'] }],
  label: [...COMMUNS, 'for'],
  output: [...COMMUNS, 'for', { name: 'aria-live', values: ['polite', 'assertive', 'off'] }],
  input: ['id', 'class', 'style', 'min', 'max', 'step', 'value', 'inputmode',
    { name: 'type', values: ['number', 'range', 'text'] }, 'aria-label', 'aria-describedby', 'aria-hidden'],
};

export function nettoyerHtml(html: string): string {
  // Ceinture : <script>, <style> et <foreignObject> en toute casse sont retirés avec leur contenu (le parseur
  // ne reconnaît que les minuscules pour ses balises « texte brut »).
  const avant = couperBalises(html);
  const origine = origineSupabase();
  return sanitizeHtml(avant, {
    allowedTags: [...BALISES_HTML, ...BALISES_SVG],
    allowedAttributes: ATTRIBUTS_AUTORISES,
    allowedSchemes: ['https', 'mailto'],
    allowedSchemesByTag: { img: ['https', 'http'] },
    allowProtocolRelative: false,
    allowedStyles: { '*': Object.fromEntries(PROPRIETES_STYLE.map((p) => [p, [STYLE_SUR]])) },
    parser: { lowerCaseTags: false, lowerCaseAttributeNames: false },
    transformTags: {
      '*': (tagName, attribs) => {
        const sortie: Record<string, string> = {};
        for (const [nom, valeur] of Object.entries(attribs)) {
          // Hors style (filtré à part) : toute valeur contenant « url( » doit être une référence interne.
          if (nom !== 'style' && /url\s*\(/i.test(valeur) && !URL_INTERNE.test(valeur)) continue;
          sortie[nom] = valeur;
        }
        for (const cle of ['id', 'for', 'aria-describedby']) {
          if (sortie[cle] === undefined) continue;
          const v = cle === 'id' ? (ID_SUR.test(sortie.id) ? sortie.id : '') : jetonsSurs(sortie[cle]);
          if (v) sortie[cle] = v;
          else delete sortie[cle];
        }
        if (tagName === 'a') {
          if (sortie.target !== '_blank') delete sortie.target;
          if (sortie.href !== undefined && sortie.target === '_blank') sortie.rel = 'noopener noreferrer';
          else delete sortie.rel;
        }
        return { tagName, attribs: sortie };
      },
    },
    exclusiveFilter: (frame) => frame.tag === 'img' && !imageAutorisee(frame.attribs.src ?? '', origine),
  });
}
