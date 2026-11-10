export function formaterDuree(ms: number): string {
  const secondes = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(secondes / 60)}:${String(secondes % 60).padStart(2, '0')}`;
}

const dateEcheance = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

/** Date et heure d'une échéance, à l'heure de Paris : « 20 novembre à 18:00 ». */
export function formaterEcheance(date: Date): string {
  return dateEcheance.format(date);
}
