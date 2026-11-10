/** Délai entre la demande de suppression et la suppression effective (la même durée est codée dans prive.purges_quotidiennes). */
export const JOURS_AVANT_SUPPRESSION = 30;

/** Date de suppression effective d'un compte dont la suppression a été demandée à `demandeeLe`. */
export function dateSuppression(demandeeLe: string | Date): Date {
  const date = new Date(demandeeLe);
  date.setUTCDate(date.getUTCDate() + JOURS_AVANT_SUPPRESSION);
  return date;
}

const formatJour = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' });

export function formaterDateSuppression(demandeeLe: string | Date): string {
  return formatJour.format(dateSuppression(demandeeLe));
}
