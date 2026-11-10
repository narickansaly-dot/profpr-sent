const formatParis = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Paris', hourCycle: 'h23',
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

/** Décalage (ms) de Paris par rapport à UTC à l'instant donné : +1 h en hiver, +2 h en été. */
function decalageParis(instant: number): number {
  const p = Object.fromEntries(formatParis.formatToParts(new Date(instant)).map((x) => [x.type, Number(x.value)]));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(instant / 1000) * 1000;
}

const MOTIF = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

/**
 * Convertit la valeur d'un champ `datetime-local` (heure de Paris) en date ISO UTC.
 * Une valeur vide ou invalide donne null.
 */
export function heureParisVersIso(valeur: string): string | null {
  const m = MOTIF.exec(valeur.trim());
  if (!m) return null;
  const [annee, mois, jour, heure, minute] = m.slice(1).map(Number);
  const local = Date.UTC(annee, mois - 1, jour, heure, minute);
  const controle = new Date(local);
  if (controle.getUTCFullYear() !== annee || controle.getUTCMonth() !== mois - 1 || controle.getUTCDate() !== jour
    || controle.getUTCHours() !== heure || controle.getUTCMinutes() !== minute) return null;
  // Deux passes : le décalage dépend de l'instant, lui-même dépendant du décalage (jours de changement d'heure).
  let instant = local - decalageParis(local);
  instant = local - decalageParis(instant);
  return new Date(instant).toISOString();
}

/** Inverse : date ISO → valeur `datetime-local` à l'heure de Paris, ou chaîne vide. */
export function isoVersHeureParis(iso: string | null | undefined): string {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  return new Date(t + decalageParis(t)).toISOString().slice(0, 16);
}
