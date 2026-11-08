export const ROUTES_PUBLIQUES = ['/connexion', '/inscription', '/auth/callback', '/auth/confirm', '/ical', '/hors-ligne', '/api/notifications/envoyer'];
const ROUTES_INVITE = ['/connexion', '/inscription'];

function correspond(chemin: string, route: string) {
  return chemin === route || chemin.startsWith(route + '/');
}

/**
 * Seule barrière contre les redirections ouvertes : ne renvoie que des chemins relatifs
 * à ce site, sinon null. Un `/%2F%2Fexemple.com` est accepté : il reste un chemin de ce site
 * (le navigateur ne décode pas %2F en séparateur d’hôte).
 */
export function cheminSuiteSur(valeur: unknown): string | null {
  if (typeof valeur !== 'string') return null;
  if (!valeur.startsWith('/') || valeur.startsWith('//')) return null;
  // Backslash et caractères de contrôle : les navigateurs les normalisent (`/\x` ou `/<tab>/x` deviennent `//x`).
  if (valeur.includes('\\') || /[\u0000-\u001f\u007f]/.test(valeur)) return null;
  const pathname = valeur.split(/[?#]/)[0];
  if (ROUTES_INVITE.some((r) => correspond(pathname, r))) return null;
  return valeur;
}

/** Page vers laquelle rediriger, ou null pour laisser passer. */
export function redirectionPour(chemin: string, connecte: boolean): { pathname: string; suite?: string } | null {
  if (!connecte) {
    if (ROUTES_PUBLIQUES.some((r) => correspond(chemin, r))) return null;
    return chemin === '/' ? { pathname: '/connexion' } : { pathname: '/connexion', suite: chemin };
  }
  return ROUTES_INVITE.some((r) => correspond(chemin, r)) ? { pathname: '/' } : null;
}
