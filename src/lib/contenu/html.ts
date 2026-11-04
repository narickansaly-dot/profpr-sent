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

/** Origine des images autorisées. Variable absente : base locale (comme les tests). Variable vide : aucune image. */
function origineSchemas(): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';
  if (!base) return '';
  return `${base.replace(/\/$/, '')}/storage/v1/object/public/schemas/`;
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
  const avant = html.replace(/<(script|style|foreignobject)\b[\s\S]*?<\/\1\s*>/gi, '');
  const origine = origineSchemas();
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
        if (tagName === 'a' && sortie.href !== undefined) {
          if (sortie.target === '_blank') sortie.rel = 'noopener noreferrer';
          else delete sortie.rel;
        } else if (tagName === 'a') {
          delete sortie.target;
          delete sortie.rel;
        }
        return { tagName, attribs: sortie };
      },
    },
    exclusiveFilter: (frame) => {
      if (frame.tag !== 'img') return false;
      const src = frame.attribs.src ?? '';
      return !origine || !src.startsWith(origine) || src.includes('..');
    },
  });
}
