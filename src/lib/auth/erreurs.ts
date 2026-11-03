const TRADUCTIONS: [RegExp, string][] = [
  [/invalid login credentials/i, 'E-mail ou mot de passe incorrect.'],
  [/already registered|already exists/i, 'Un compte existe déjà avec cet e-mail.'],
  [/email not confirmed/i, 'Confirme d’abord ton adresse e-mail grâce au lien reçu.'],
  [/rate limit/i, 'Trop de tentatives. Patiente quelques minutes.'],
];

export function traduireErreurAuth(message: string): string {
  return TRADUCTIONS.find(([motif]) => motif.test(message))?.[1]
    ?? 'Une erreur est survenue. Réessaie dans un instant.';
}
