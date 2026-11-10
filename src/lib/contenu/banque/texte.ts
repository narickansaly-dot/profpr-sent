import type { CoursImport } from '../format-import';

const ENTITES: Record<string, string> = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", laquo: '«', raquo: '»', hellip: '…',
  rarr: '→', larr: '←', rsquo: '’', lsquo: '‘', ndash: '–', mdash: '—', deg: '°', micro: 'µ', plusmn: '±', times: '×',
};

function decoder(texte: string): string {
  return texte.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (tout, nom: string) => {
    if (nom[0] === '#') {
      const code = nom[1].toLowerCase() === 'x' ? parseInt(nom.slice(2), 16) : parseInt(nom.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : tout;
    }
    return ENTITES[nom.toLowerCase()] ?? tout;
  });
}

/** Texte brut d'un fragment HTML : sans balises, entités décodées, une ligne par bloc, puces « - » pour les listes. */
export function htmlVersTexte(html: string): string {
  const t = html
    .replace(/<(svg|script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<(td|th)\b[^>]*>/gi, ' | ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|ul|ol|tr|table|figure|figcaption|h[1-6]|blockquote|section)>/gi, '\n')
    .replace(/<[^>]*>/g, '');
  return decoder(t)
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Texte brut du chapitre : titre, chapeau, objectifs, sections (avec leur titre) et « Je retiens ». */
export function texteChapitre(cours: CoursImport, numero: number): string {
  const ch = cours.chapitres.find((c) => c.numero === numero);
  if (!ch) throw new Error(`chapitre ${numero} absent du cours`);
  const blocs: string[] = [`Chapitre ${ch.numero} : ${ch.titre}`];
  if (ch.chapeau) blocs.push(htmlVersTexte(ch.chapeau));
  if (ch.objectifs.length > 0) blocs.push(['Objectifs', ...ch.objectifs.map((o) => `- ${htmlVersTexte(o)}`)].join('\n'));
  for (const s of ch.sections) blocs.push(`## ${s.titre}\n\n${htmlVersTexte(s.html)}`);
  if (ch.a_retenir) blocs.push(`## Je retiens\n\n${htmlVersTexte(ch.a_retenir)}`);
  return `${blocs.filter((b) => b.length > 0).join('\n\n')}\n`;
}
