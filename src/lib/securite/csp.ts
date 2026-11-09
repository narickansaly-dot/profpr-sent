/** En-têtes de sécurité qui ne dépendent pas de la requête (posés par next.config.ts sur toutes les routes). */
export const ENTETES_SECURITE: { key: string; value: string }[] = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
];

/** Politique de sécurité du contenu d'une page, avec le nonce de la requête. */
export function politiqueContenu(o: { nonce: string; supabaseUrl: string; developpement: boolean; https: boolean }): string {
  const supabase = new URL(o.supabaseUrl).origin;
  const directives: [string, string[]][] = [
    ['default-src', ["'self'"]],
    ['script-src', ["'self'", `'nonce-${o.nonce}'`, "'strict-dynamic'", ...(o.developpement ? ["'unsafe-eval'"] : [])]],
    // Les attributs style (couleur du cours) n'acceptent pas de nonce : styles en ligne permis, scripts non.
    ['style-src', ["'self'", "'unsafe-inline'"]],
    ['img-src', ["'self'", 'data:', 'blob:', supabase]],
    ['font-src', ["'self'"]],
    ['connect-src', ["'self'", supabase, ...(o.developpement ? ['ws:'] : [])]],
    ['worker-src', ["'self'"]],
    ['manifest-src', ["'self'"]],
    ['frame-src', ["'none'"]],
    ['object-src', ["'none'"]],
    ['base-uri', ["'self'"]],
    // Connexion Google : l'action serveur redirige vers Supabase puis Google (Chrome applique form-action aux redirections).
    ['form-action', ["'self'", supabase, 'https://accounts.google.com']],
    ['frame-ancestors', ["'none'"]],
    ...(o.https ? [['upgrade-insecure-requests', []] as [string, string[]]] : []),
  ];
  return directives.map(([nom, valeurs]) => [nom, ...valeurs].join(' ')).join('; ');
}
