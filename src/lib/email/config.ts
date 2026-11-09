export type ConfigSmtp = { hote: string; port: number; utilisateur?: string; motDePasse?: string; expediteur: string };

/** Configuration SMTP lue dans l'environnement ; null si incomplète. */
export function lireConfigSmtp(env: Record<string, string | undefined>): ConfigSmtp | null {
  const port = Number(env.SMTP_PORT);
  if (!env.SMTP_HOTE || !env.EMAIL_EXPEDITEUR || !Number.isInteger(port) || port < 1 || port > 65535) return null;
  if (Boolean(env.SMTP_UTILISATEUR) !== Boolean(env.SMTP_MOT_DE_PASSE)) return null;
  return {
    hote: env.SMTP_HOTE, port, utilisateur: env.SMTP_UTILISATEUR || undefined,
    motDePasse: env.SMTP_MOT_DE_PASSE || undefined, expediteur: env.EMAIL_EXPEDITEUR,
  };
}
