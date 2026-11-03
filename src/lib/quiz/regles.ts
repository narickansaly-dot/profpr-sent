// Règles de la spec. La base les applique ; ces constantes servent à l'affichage.
export const SEUIL_REUSSITE = 75;
export const LONGUEURS_QUIZ = [15, 20, 30] as const;
export const MIN_QUESTIONS_QUIZ = 15;
export const EVALUATION = { nbQuestions: 40, dureeMinutes: 60, essais: 3, delaiHeures: 24 } as const;

export type StatutTentative = 'en_cours' | 'terminee' | 'expiree';
export type EtatEvaluation =
  | { etat: 'verrouillee'; chapitresRestants: number }
  | { etat: 'en_cours'; tentativeId: string }
  | { etat: 'disponible'; essaisRestants: number }
  | { etat: 'attente'; disponibleLe: Date; essaisRestants: number }
  | { etat: 'epuisee' };

type Entree = {
  nbChapitres: number;
  nbValides: number;
  essais: { id: string; statut: StatutTentative; fin: string | null }[];
  maintenant: Date;
};

export function etatEvaluation({ nbChapitres, nbValides, essais, maintenant }: Entree): EtatEvaluation {
  const enCours = essais.find((e) => e.statut === 'en_cours');
  if (enCours) return { etat: 'en_cours', tentativeId: enCours.id };
  if (nbChapitres === 0 || nbValides < nbChapitres) {
    return { etat: 'verrouillee', chapitresRestants: nbChapitres - nbValides };
  }
  const essaisRestants = EVALUATION.essais - essais.length;
  if (essaisRestants <= 0) return { etat: 'epuisee' };
  const fins = essais.map((e) => (e.fin ? new Date(e.fin).getTime() : 0));
  const derniere = fins.length > 0 ? Math.max(...fins) : 0;
  const disponibleLe = new Date(derniere + EVALUATION.delaiHeures * 3600 * 1000);
  if (derniere > 0 && disponibleLe > maintenant) return { etat: 'attente', disponibleLe, essaisRestants };
  return { etat: 'disponible', essaisRestants };
}
