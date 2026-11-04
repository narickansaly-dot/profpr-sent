// Règles de la spec. La base les applique ; ces constantes servent à l'affichage.
export const SEUIL_REUSSITE = 75;
export const LONGUEURS_QUIZ = [15, 20, 30] as const;
export const MIN_QUESTIONS_QUIZ = 15;
export const EVALUATION = { nbQuestions: 40, dureeMinutes: 60, essais: 3, delaiHeures: 24 } as const;

export type StatutTentative = 'en_cours' | 'terminee' | 'expiree';
export type EtatEvaluation =
  | { etat: 'verrouillee'; chapitresRestants: number }
  | { etat: 'en_cours'; tentativeId: string }
  | { etat: 'pas_ouverte'; ouverture: Date }
  | { etat: 'close'; limite: Date }
  | { etat: 'disponible'; essaisRestants: number; limite?: Date }
  | { etat: 'attente'; disponibleLe: Date; essaisRestants: number }
  | { etat: 'epuisee' };

export type FenetreEvaluation =
  | { etat: 'ok'; limite?: Date }
  | { etat: 'pas_ouverte'; ouverture: Date }
  | { etat: 'close'; limite: Date };

/**
 * Fenêtre d'évaluation d'un élève, d'après les échéances de ses classes.
 * Sans échéance, l'évaluation est libre. Une seule fenêtre ouverte suffit.
 */
export function fenetreEvaluation(
  echeances: { ouverture: string | null; limite: string | null }[],
  maintenant: Date,
): FenetreEvaluation {
  if (echeances.length === 0) return { etat: 'ok' };
  const t = maintenant.getTime();
  const fenetres = echeances.map((e) => ({
    ouverture: e.ouverture ? new Date(e.ouverture) : null,
    limite: e.limite ? new Date(e.limite) : null,
  }));
  const ouvertes = fenetres.filter((f) =>
    (f.ouverture == null || f.ouverture.getTime() <= t) && (f.limite == null || t <= f.limite.getTime()));
  if (ouvertes.length > 0) {
    const limites = ouvertes.flatMap((f) => (f.limite ? [f.limite.getTime()] : []));
    if (limites.length === 0) return { etat: 'ok' };
    return { etat: 'ok', limite: new Date(Math.max(...limites)) };
  }
  const futures = fenetres.flatMap((f) => (f.ouverture && f.ouverture.getTime() > t ? [f.ouverture.getTime()] : []));
  if (futures.length > 0) return { etat: 'pas_ouverte', ouverture: new Date(Math.min(...futures)) };
  const passees = fenetres.flatMap((f) => (f.limite ? [f.limite.getTime()] : []));
  return { etat: 'close', limite: new Date(Math.max(...passees)) };
}

type Entree = {
  nbChapitres: number;
  nbValides: number;
  essais: { id: string; statut: StatutTentative; fin: string | null }[];
  maintenant: Date;
  fenetre?: FenetreEvaluation;
};

/**
 * Précondition : l'appelant a déjà clos les tentatives expirées
 * (rpc cloturer_mes_tentatives_expirees), sinon une tentative périmée reste « en_cours ».
 */
export function etatEvaluation({ nbChapitres, nbValides, essais, maintenant, fenetre = { etat: 'ok' } }: Entree): EtatEvaluation {
  const enCours = essais.find((e) => e.statut === 'en_cours');
  if (enCours) return { etat: 'en_cours', tentativeId: enCours.id };
  if (nbChapitres === 0 || nbValides < nbChapitres) {
    return { etat: 'verrouillee', chapitresRestants: nbChapitres - nbValides };
  }
  if (fenetre.etat === 'pas_ouverte') return { etat: 'pas_ouverte', ouverture: fenetre.ouverture };
  if (fenetre.etat === 'close') return { etat: 'close', limite: fenetre.limite };
  const essaisRestants = EVALUATION.essais - essais.length;
  if (essaisRestants <= 0) return { etat: 'epuisee' };
  const fins = essais.map((e) => (e.fin ? new Date(e.fin).getTime() : 0));
  const derniere = fins.length > 0 ? Math.max(...fins) : 0;
  const disponibleLe = new Date(derniere + EVALUATION.delaiHeures * 3600 * 1000);
  if (derniere > 0 && disponibleLe > maintenant) return { etat: 'attente', disponibleLe, essaisRestants };
  return fenetre.limite ? { etat: 'disponible', essaisRestants, limite: fenetre.limite } : { etat: 'disponible', essaisRestants };
}
