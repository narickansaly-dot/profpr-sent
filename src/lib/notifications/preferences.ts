import '@/lib/zod-sans-eval';
import { z } from 'zod';

export const TYPES_NOTIFICATION = [
  { cle: 'rappel_evenement', libelle: 'Rappels avant tes événements' },
  { cle: 'echeance_proche', libelle: 'Évaluation qui ferme bientôt' },
  { cle: 'nouvel_essai', libelle: 'Nouvel essai d’évaluation disponible' },
  { cle: 'revision_du_jour', libelle: 'Séances de révision du jour (7 h 30)' },
  { cle: 'inactivite', libelle: 'Relance après quelques jours sans réviser (17 h)' },
] as const;
export type TypeNotification = (typeof TYPES_NOTIFICATION)[number]['cle'];

export type Preferences = Record<TypeNotification, boolean> & {
  silence_debut: string; silence_fin: string; jours_inactivite: number;
};
export type ValeursPreferences = { types: string[]; silence_debut: string; silence_fin: string; jours_inactivite: string };
export type ChampPreferences = 'silence_debut' | 'silence_fin' | 'jours_inactivite';

export const PREFERENCES_PAR_DEFAUT: Preferences = {
  rappel_evenement: true, echeance_proche: true, nouvel_essai: true, revision_du_jour: true, inactivite: true,
  silence_debut: '22:00', silence_fin: '07:00', jours_inactivite: 3,
};

const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
const schema = z.object({
  silence_debut: z.string().regex(HEURE, 'Indique une heure valide, par exemple 22:00.'),
  silence_fin: z.string().regex(HEURE, 'Indique une heure valide, par exemple 07:00.'),
  jours_inactivite: z.coerce.number().int('Choisis entre 1 et 14 jours.').min(1, 'Choisis entre 1 et 14 jours.')
    .max(14, 'Choisis entre 1 et 14 jours.'),
});

export function versValeurs(p: Preferences): ValeursPreferences {
  return {
    types: TYPES_NOTIFICATION.filter((t) => p[t.cle]).map((t) => t.cle),
    silence_debut: p.silence_debut.slice(0, 5), silence_fin: p.silence_fin.slice(0, 5),
    jours_inactivite: String(p.jours_inactivite),
  };
}

export function lireFormulairePreferences(form: FormData):
  | { ok: true; donnees: Preferences; valeurs: ValeursPreferences }
  | { ok: false; erreur: string; champ: ChampPreferences; valeurs: ValeursPreferences } {
  const valeurs: ValeursPreferences = {
    types: form.getAll('types').map(String),
    silence_debut: String(form.get('silence_debut') ?? ''), silence_fin: String(form.get('silence_fin') ?? ''),
    jours_inactivite: String(form.get('jours_inactivite') ?? ''),
  };
  const r = schema.safeParse(valeurs);
  if (!r.success) {
    const issue = r.error.issues[0];
    return { ok: false, erreur: issue?.message ?? 'Vérifie tes réglages.', champ: (issue?.path[0] as ChampPreferences) ?? 'silence_debut', valeurs };
  }
  const coches = new Set(valeurs.types);
  const types = Object.fromEntries(TYPES_NOTIFICATION.map((t) => [t.cle, coches.has(t.cle)])) as Record<TypeNotification, boolean>;
  return { ok: true, donnees: { ...types, ...r.data }, valeurs };
}
