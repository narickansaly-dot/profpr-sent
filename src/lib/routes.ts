export const ROUTES_PUBLIQUES = ['/connexion', '/inscription', '/auth/callback', '/auth/confirm'];
const ROUTES_INVITE = ['/connexion', '/inscription'];

function correspond(chemin: string, route: string) {
  return chemin === route || chemin.startsWith(route + '/');
}

/** Page vers laquelle rediriger, ou null pour laisser passer. */
export function redirectionPour(chemin: string, connecte: boolean): string | null {
  if (!connecte) return ROUTES_PUBLIQUES.some((r) => correspond(chemin, r)) ? null : '/connexion';
  return ROUTES_INVITE.some((r) => correspond(chemin, r)) ? '/' : null;
}
