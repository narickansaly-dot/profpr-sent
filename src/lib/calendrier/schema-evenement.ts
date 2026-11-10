import '@/lib/zod-sans-eval';
import { z } from 'zod';
import { heureParisVersIso } from '@/lib/enseignant/dates';
import { ajouterJours, estJourValide } from './dates';

import { TYPES_EVENEMENT, REPETITIONS, DUREES_EVENEMENT, RAPPELS } from './constantes';

export { TYPES_EVENEMENT, REPETITIONS, DUREES_EVENEMENT, RAPPELS };

export type ChampEvenement = 'type' | 'titre' | 'jour' | 'heure' | 'duree' | 'cours' | 'chapitres' | 'repetition' | 'jours' | 'jusqu' | 'rappel';
export type ValeursEvenement = {
  type: string; titre: string; jour: string; heure: string; duree: string; cours: string;
  chapitres: string[]; repetition: string; jours: string[]; jusqu: string; rappel: string;
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
  cours: z.string().uuid({ error: 'Choisis un cours dans la liste.' }).optional(),
  chapitres: z.array(z.string().uuid({ error: 'Choisis des chapitres dans la liste.' })).max(30, 'Choisis 30 chapitres au plus.'),
  repetition: z.enum(REPETITIONS, { error: 'Choisis une répétition dans la liste.' }),
  jours: z.array(z.coerce.number({ error: 'Choisis des jours entre lundi et dimanche.' }).int('Choisis des jours entre lundi et dimanche.').min(1, 'Choisis des jours entre lundi et dimanche.').max(7, 'Choisis des jours entre lundi et dimanche.')),
  jusqu: z.string().optional(),
  rappel: z.enum(['', '10', '60', '1440'], { error: 'Choisis un rappel dans la liste.' }),
});

export function lireFormulaireEvenement(form: FormData):
  | { ok: true; donnees: DonneesEvenement; rappel: 10 | 60 | 1440 | null; valeurs: ValeursEvenement }
  | { ok: false; erreur: string; champ: ChampEvenement; valeurs: ValeursEvenement } {
  const texte = (cle: string) => String(form.get(cle) ?? '');
  const valeurs: ValeursEvenement = {
    type: texte('type'), titre: texte('titre'), jour: texte('jour'), heure: texte('heure'), duree: texte('duree'),
    cours: texte('cours'), chapitres: form.getAll('chapitres').map(String), repetition: texte('repetition') || 'aucune',
    jours: form.getAll('jours').map(String), jusqu: texte('jusqu'), rappel: texte('rappel'),
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
    rappel: d.rappel ? (Number(d.rappel) as 10 | 60 | 1440) : null,
    donnees: {
      type: d.type, titre: d.titre, debut, duree_minutes: d.duree, cours_id: d.cours ?? null, chapitres: d.chapitres,
      repetition: d.repetition,
      jours_semaine: d.repetition === 'jours' ? [...new Set(d.jours)].sort((a, b) => a - b) : null,
      repeter_jusqu_au: d.repetition === 'aucune' ? null : d.jusqu ?? null,
    },
  };
}
