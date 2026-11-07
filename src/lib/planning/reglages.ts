import { z } from 'zod';
import type { Reglages } from './generer';

export const DUREES_SESSION = [30, 45, 60, 90] as const;
export const REGLAGES_PAR_DEFAUT: Reglages = { sessionsParSemaine: 3, dureeMinutes: 45, joursPreferes: [1, 2, 3, 4, 5], heureDebut: '17:30' };
export type ChampReglages = 'sessions' | 'duree' | 'jours' | 'heure';

const schema = z.object({
  sessions: z.coerce.number().int().min(1, 'Choisis entre 1 et 7 sessions par semaine.').max(7, 'Choisis entre 1 et 7 sessions par semaine.'),
  duree: z.coerce.number().refine((d) => (DUREES_SESSION as readonly number[]).includes(d), 'Choisis une durée dans la liste.'),
  jours: z.array(z.coerce.number().int().min(1).max(7)).min(1, 'Choisis au moins un jour.'),
  heure: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Choisis une heure de début entre 6 h et 21 h.')
    .refine((h) => h >= '06:00' && h <= '21:00', 'Choisis une heure de début entre 6 h et 21 h.'),
});

export function lireReglages(form: FormData):
  | { ok: true; reglages: Reglages } | { ok: false; champ: ChampReglages; erreur: string } {
  const r = schema.safeParse({
    sessions: form.get('sessions'), duree: form.get('duree'), jours: form.getAll('jours'), heure: String(form.get('heure') ?? ''),
  });
  if (!r.success) {
    const issue = r.error.issues[0];
    return { ok: false, champ: (issue?.path[0] as ChampReglages) ?? 'sessions', erreur: issue?.message ?? 'Vérifie les réglages.' };
  }
  return {
    ok: true,
    reglages: {
      sessionsParSemaine: r.data.sessions, dureeMinutes: r.data.duree,
      joursPreferes: [...new Set(r.data.jours)].sort((a, b) => a - b), heureDebut: r.data.heure,
    },
  };
}

export function versReglagesRpc(r: Reglages) {
  return { sessions_par_semaine: r.sessionsParSemaine, duree_minutes: r.dureeMinutes, jours_preferes: r.joursPreferes, heure_debut: r.heureDebut };
}
