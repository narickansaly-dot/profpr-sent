import { z } from 'zod';
import { heureParisVersIso } from '@/lib/enseignant/dates';
import { ajouterJours, estJourValide } from './dates';

export const TYPES_EVENEMENT = ['revision', 'devoir', 'examen_reel'] as const;
export const REPETITIONS = ['aucune', 'quotidienne', 'hebdomadaire', 'jours'] as const;
export const DUREES_EVENEMENT = [15, 30, 45, 60, 90, 120, 180] as const;

export type ChampEvenement = 'type' | 'titre' | 'jour' | 'heure' | 'duree' | 'cours' | 'chapitres' | 'repetition' | 'jours' | 'jusqu';
export type ValeursEvenement = {
  type: string; titre: string; jour: string; heure: string; duree: string; cours: string;
  chapitres: string[]; repetition: string; jours: string[]; jusqu: string;
};
/** Objet envoyé tel quel à la RPC enregistrer_evenement. */
export type DonneesEvenement = {
  type: (typeof TYPES_EVENEMENT)[number]; titre: string; debut: string; duree_minutes: number; cours_id: string | null;
  chapitres: string[]; repetition: (typeof REPETITIONS)[number]; jours_semaine: number[] | null; repeter_jusqu_au: string | null;
};

const schema = z.object({
  type: z.enum(TYPES_EVENEMENT, { error: 'Choisis le type d’événement.' }),
  titre: z.string().trim().min(1, 'Donne un titre à l’événement.').max(120, 'Le titre ne doit pas dépasser 120 caractères.'),
  jour: z.string().refine(estJourValide, 'Choisis une date valide.'),
  heure: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Choisis une heure valide.'),
  duree: z.coerce.number().refine((d) => (DUREES_EVENEMENT as readonly number[]).includes(d), 'Choisis une durée dans la liste.'),
  cours: z.string().uuid().optional(),
  chapitres: z.array(z.string().uuid()).max(30),
  repetition: z.enum(REPETITIONS, { error: 'Choisis une répétition dans la liste.' }),
  jours: z.array(z.coerce.number().int().min(1).max(7)),
  jusqu: z.string().optional(),
});

export function lireFormulaireEvenement(form: FormData):
  | { ok: true; donnees: DonneesEvenement; valeurs: ValeursEvenement }
  | { ok: false; erreur: string; champ: ChampEvenement; valeurs: ValeursEvenement } {
  const texte = (cle: string) => String(form.get(cle) ?? '');
  const valeurs: ValeursEvenement = {
    type: texte('type'), titre: texte('titre'), jour: texte('jour'), heure: texte('heure'), duree: texte('duree'),
    cours: texte('cours'), chapitres: form.getAll('chapitres').map(String), repetition: texte('repetition') || 'aucune',
    jours: form.getAll('jours').map(String), jusqu: texte('jusqu'),
  };
  const echec = (champ: ChampEvenement, erreur: string) => ({ ok: false as const, erreur, champ, valeurs });
  const r = schema.safeParse({
    ...valeurs, cours: valeurs.cours || undefined, jusqu: valeurs.jusqu || undefined,
  });
  if (!r.success) {
    const issue = r.error.issues[0];
    return echec((issue?.path[0] as ChampEvenement) ?? 'titre', issue?.message ?? 'Vérifie le formulaire.');
  }
  const d = r.data;
  const debut = heureParisVersIso(`${d.jour}T${d.heure}`);
  if (!debut) return echec('heure', 'Choisis une heure valide.');
  if (d.chapitres.length > 0 && !d.cours) return echec('cours', 'Choisis d’abord le cours de ces chapitres.');
  if (d.repetition !== 'aucune') {
    if (!d.jusqu || !estJourValide(d.jusqu) || d.jusqu < d.jour || d.jusqu > ajouterJours(d.jour, 366)) {
      return echec('jusqu', 'La répétition doit finir après le début, dans l’année qui suit.');
    }
    if (d.repetition === 'jours' && d.jours.length === 0) return echec('jours', 'Choisis au moins un jour.');
  }
  return {
    ok: true,
    valeurs,
    donnees: {
      type: d.type, titre: d.titre, debut, duree_minutes: d.duree, cours_id: d.cours ?? null, chapitres: d.chapitres,
      repetition: d.repetition,
      jours_semaine: d.repetition === 'jours' ? [...new Set(d.jours)].sort((a, b) => a - b) : null,
      repeter_jusqu_au: d.repetition === 'aucune' ? null : d.jusqu ?? null,
    },
  };
}
