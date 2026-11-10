// Constantes sans dépendance : importables depuis les composants client sans embarquer zod.
export const TYPES_NOTIFICATION = [
  { cle: 'rappel_evenement', libelle: 'Rappels avant tes événements' },
  { cle: 'echeance_proche', libelle: 'Évaluation qui ferme bientôt' },
  { cle: 'nouvel_essai', libelle: 'Nouvel essai d’évaluation disponible' },
  { cle: 'revision_du_jour', libelle: 'Séances de révision du jour (7 h 30)' },
  { cle: 'inactivite', libelle: 'Relance après quelques jours sans réviser (17 h)' },
] as const;
