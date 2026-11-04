const MESSAGES: Record<string, string> = {
  non_connecte: 'Ta session a expiré. Reconnecte-toi.',
  acces_refuse: 'Tu n’as pas accès à ce cours pour le moment.',
  longueur_invalide: 'Choisis un quiz de 15, 20 ou 30 questions.',
  quiz_indisponible: 'Ce quiz n’a pas encore assez de questions. Reviens bientôt !',
  evaluation_verrouillee: 'Valide d’abord tous les quiz des chapitres pour débloquer l’évaluation.',
  essais_epuises: 'Tu as utilisé tes 3 essais pour cette évaluation.',
  delai_attente: 'Patiente 24 heures entre deux essais de l’évaluation.',
  tentative_introuvable: 'Ce quiz est introuvable.',
  question_hors_tentative: 'Cette question ne fait pas partie de ton quiz.',
  reponse_invalide: 'Ta réponse n’a pas pu être lue. Réessaie.',
  tentative_terminee: 'Ce quiz est terminé.',
  tentative_en_cours: 'Termine d’abord ce quiz pour voir la correction.',
  evaluation_en_cours: 'Termine d’abord ton évaluation en cours : les quiz de ce cours sont fermés pendant l’évaluation.',
  evaluation_pas_ouverte: 'L’évaluation n’est pas encore ouverte pour ta classe.',
  evaluation_close: 'La date limite de l’évaluation est passée.',
  dates_invalides: 'La date d’ouverture doit être avant la date limite.',
  cours_invalide: 'Choisis au moins un cours publié.',
  nom_invalide: 'Le nom de la classe doit faire entre 2 et 60 caractères.',
  classe_introuvable: 'Cette classe est introuvable.',
  demande_introuvable: 'Cette demande a déjà été traitée.',
};

export function messageErreur(message: string | undefined): string {
  const code = Object.keys(MESSAGES).find((c) => message?.includes(c));
  return code ? MESSAGES[code] : 'Une erreur est survenue. Réessaie dans un instant.';
}
