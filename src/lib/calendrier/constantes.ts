// Constantes sans dépendance : importables depuis les composants client sans embarquer zod.
export const TYPES_EVENEMENT = ['revision', 'devoir', 'examen_reel'] as const;
export const REPETITIONS = ['aucune', 'quotidienne', 'hebdomadaire', 'jours'] as const;
export const DUREES_EVENEMENT = [15, 30, 45, 60, 90, 120, 180] as const;
export const RAPPELS = [
  { valeur: '', libelle: 'Aucun rappel' }, { valeur: '10', libelle: '10 minutes avant' },
  { valeur: '60', libelle: '1 heure avant' }, { valeur: '1440', libelle: 'La veille (24 heures avant)' },
] as const;
