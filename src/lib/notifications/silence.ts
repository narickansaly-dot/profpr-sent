import { ajouterJours, heureParis, jourParis } from '@/lib/calendrier/dates';
import { heureParisVersIso } from '@/lib/enseignant/dates';

/** Plage de silence, à l'heure de Paris (`HH:MM` ou `HH:MM:SS`). Début égal à la fin : pas de silence. */
export type Silence = { debut: string; fin: string };

const minutes = (heure: string) => {
  const [h, m] = heure.slice(0, 5).split(':').map(Number);
  return h * 60 + m;
};

/**
 * Une notification qui tombe pendant le silence est décalée à la fin de la plage, jamais supprimée.
 * Le début de la plage est silencieux, la fin ne l'est pas.
 */
export function decalerSilence(instant: Date, silence: Silence): Date {
  const debut = minutes(silence.debut);
  const fin = minutes(silence.fin);
  if (debut === fin) return instant;
  const m = minutes(heureParis(instant.toISOString()));
  const dedans = debut < fin ? m >= debut && m < fin : m >= debut || m < fin;
  if (!dedans) return instant;
  const jour = jourParis(instant);
  // Plage à cheval sur minuit, notification avant minuit : la fin est le lendemain.
  const jourFin = debut > fin && m >= debut ? ajouterJours(jour, 1) : jour;
  const iso = heureParisVersIso(`${jourFin}T${silence.fin.slice(0, 5)}`);
  return iso ? new Date(iso) : instant;
}
