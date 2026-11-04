/** Luminance relative WCAG 2.1 d'une couleur `#rrggbb`. */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const canaux = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * canaux[0] + 0.7152 * canaux[1] + 0.0722 * canaux[2];
}

/** Rapport de contraste WCAG entre deux couleurs `#rrggbb` (de 1 à 21). */
export function contraste(a: string, b: string): number {
  const [clair, sombre] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (clair + 0.05) / (sombre + 0.05);
}

/** La couleur du cours sert de bordure ou d'accent : 3:1 minimum contre le blanc (WCAG 1.4.11). */
export function couleurCoursAcceptable(hex: string): boolean {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return false;
  return contraste(hex, '#ffffff') >= 3;
}
