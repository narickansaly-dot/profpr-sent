export const MESSAGES: Record<string, string> = {
  dernier_admin: 'Tu es le seul administrateur du contenu\u00a0: désigne-en un autre avant de demander la suppression de ton compte.',
  non_connecte: 'Ta session a expiré. Reconnecte-toi.',
  acces_refuse: 'Tu n’as pas accès à ce cours pour le moment.',
  longueur_invalide: 'Choisis un quiz de 15, 20 ou 30 questions.',
  quiz_indisponible: 'Ce quiz n’a pas encore assez de questions. Reviens bientôt\u00a0!',
  evaluation_verrouillee: 'Valide d’abord tous les quiz des chapitres pour débloquer l’évaluation.',
  essais_epuises: 'Tu as utilisé tes 3 essais pour cette évaluation.',
  delai_attente: 'Patiente 24 heures entre deux essais de l’évaluation.',
  tentative_introuvable: 'Ce quiz est introuvable.',
  question_hors_tentative: 'Cette question ne fait pas partie de ton quiz.',
  reponse_invalide: 'Ta réponse n’a pas pu être lue. Réessaie.',
  tentative_terminee: 'Ce quiz est terminé.',
  tentative_en_cours: 'Termine d’abord ce quiz pour voir la correction.',
  evaluation_en_cours: 'Termine d’abord ton évaluation en cours : les quiz de ce cours sont fermés pendant l’évaluation.',
  evaluation_pas_ouverte: 'L’évaluation n’est pas encore ouverte pour ta classe.',
  evaluation_close: 'La date limite de l’évaluation est passée.',
  dates_invalides: 'La date d’ouverture doit être avant la date limite.',
  cours_invalide: 'Choisis au moins un cours publié.',
  nom_invalide: 'Le nom de la classe doit faire entre 2 et 60 caractères.',
  classe_introuvable: 'Cette classe est introuvable.',
  classe_reservee_eleves: 'Seuls les comptes élèves peuvent rejoindre une classe.',
  code_invalide: 'Ce code ne correspond à aucune classe. Vérifie-le auprès de la personne qui te l’a donné.',
  trop_d_essais: 'Trop de codes incorrects. Réessaie dans une heure.',
  demande_introuvable: 'Cette demande a déjà été traitée.',
  decision_invalide: 'Choisis de valider ou de refuser la demande.',
  question_invalide: 'Cette question est incomplète ou mal formée.',
  question_introuvable: 'Cette question n’existe plus.',
  question_archivee: 'Cette question a été remplacée par une nouvelle version.',
  question_autre_chapitre: 'Cette source est déjà utilisée dans un autre chapitre.',
  source_deja_prise: 'Cette source est déjà utilisée par une autre question.',
  question_utilisee: 'Cette question a déjà servi dans des quiz\u00a0: elle ne peut pas être supprimée. Repasse-la en brouillon.',
  transition_invalide: 'Ce changement de statut n’est pas possible\u00a0: une question passe par «\u00a0à relire\u00a0» avant d’être validée.',
  chapitre_invalide: 'Ce chapitre est incomplet ou mal formé (vérifie le slug et les identifiants de section).',
  chapitre_introuvable: 'Ce chapitre n’existe plus.',
  cours_introuvable: 'Ce cours n’existe plus.',
  cours_mal_forme: 'Ce cours est incomplet ou mal formé.',
  reponse_trop_longue: 'La réponse ne doit pas dépasser 1000 caractères.',
  slug_deja_pris: 'Cet identifiant d’URL est déjà utilisé.',
  numero_deja_pris: 'Ce numéro est déjà utilisé par un autre chapitre du cours.',
  question_signalee: 'Cette question a un signalement ouvert\u00a0: traite-le avant de la supprimer.',
  filiere_inconnue: 'Filière inconnue.',
  import_invalide: 'Le fichier d’import est incomplet ou mal formé.',
  commentaire_invalide: 'Ton commentaire doit faire entre 5 et 1000 caractères.',
  deja_signalee: 'Tu as déjà signalé cette question.',
  trop_de_signalements: 'Tu as atteint la limite de 20 signalements par jour.',
  trop_de_questions: 'Sélectionne au plus 200 questions à la fois.',
  signalement_introuvable: 'Ce signalement a déjà été traité.',
  reserve_eleves: 'Réservé aux comptes élèves.',
  evenement_invalide: 'Cet événement est incomplet : vérifie le titre, la date et la durée.',
  repetition_invalide: 'La répétition doit finir après le début, dans l’année qui suit.',
  cours_indisponible: 'Ce cours n’est pas disponible pour toi.',
  chapitres_invalides: 'Choisis des chapitres du cours sélectionné.',
  evenement_introuvable: 'Cet événement n’existe plus.',
  type_non_modifiable: 'Le type d’un événement ne change pas après sa création.',
  trop_d_evenements: 'Ton calendrier est plein (500 événements). Supprime d’anciens événements.',
  periode_invalide: 'Cette période ne peut pas être affichée.',
  examen_introuvable: 'Cet examen n’existe plus.',
  examen_passe: 'Cet examen est déjà passé.',
  planning_invalide: 'Ce planning n’a pas pu être enregistré. Recalcule l’aperçu et réessaie.',
  plan_introuvable: 'Ce planning n’existe plus.',
  abonnement_invalide: 'Cet appareil n’a pas pu être enregistré. Réessaie.',
  preferences_invalides: 'Tes réglages n’ont pas pu être lus. Vérifie les heures et réessaie.',
  rappel_invalide: 'Choisis un rappel dans la liste.',
  essai_en_cours: 'Ton essai n’est pas terminé : tous les cours sont encore ouverts.',
  choix_definitif: 'Ton choix de cours gratuit est définitif.',
  cours_hors_filiere: 'Ce cours n’appartient pas à ta filière ou à ton niveau.',
  consentement_requis: 'L’accord d’un parent est nécessaire avant de choisir un cours.',
  age_verrouille: 'Ton âge ne peut plus être modifié après l’inscription.',
  consentement_inutile: 'L’accord d’un parent n’est demandé qu’aux élèves de moins de 15 ans.',
  email_parent_invalide: 'Indique une adresse e-mail valide pour ton parent.',
  consentement_deja_donne: 'Ton parent a déjà donné son accord.',
  envoi_trop_rapproche: 'Attends 10 minutes avant d’envoyer un nouvel e-mail.',
  envois_epuises: 'Trop de demandes d’accord ont été envoyées aujourd’hui (5 par élève, 3 vers une même adresse). Réessaie demain.',
  lien_consentement_invalide: 'Ce lien n’est plus valable. Demandez à votre enfant de vous en envoyer un nouveau.',
  retour_bloque: 'Tu ne fais plus partie de cette classe. Tu pourras la rejoindre de nouveau dans 24 heures.',
  pas_parent: 'Cette page est réservée aux comptes parents.',
  deja_inscrit: 'Ce compte a déjà commencé comme élève\u00a0: il ne peut pas devenir un compte parent.',
  nom_parent_invalide: 'Indiquez votre prénom (2 à 60 caractères).',
  trop_de_parents: 'Ce compte élève est déjà relié à deux parents.',
  reserve_15_ans: 'Avant 15 ans, c’est ton parent qui crée le lien, avec l’adresse qui a reçu la demande d’accord.',
  code_parent_invalide: 'Ce code n’est pas valable ou a expiré. Demandez un nouveau code à votre enfant.',
  essais_code_epuises: 'Trop d’essais. Réessayez dans une heure.',
  deliaison_interdite: 'Avant 15 ans, seul ton parent peut retirer ce lien.',
  lien_introuvable: 'Ce lien n’existe pas ou a déjà été retiré.',
  retrait_impossible: 'Ce retrait n’est pas possible pour ce compte.',
  consentement_retire: 'Ton parent a retiré son accord\u00a0: tu ne peux pas faire de nouvelle demande.',
  retrait_en_cours: 'Annulez d’abord le retrait de votre accord. Sinon, le compte de votre enfant sera supprimé à la date prévue.',
  suppression_imposee: 'La suppression a été demandée par ton parent\u00a0: seul ton parent peut l’annuler.',
};

// Variante vouvoyée pour les comptes parents (aucun texte élève ou enseignant n'est modifié).
const MESSAGES_PARENT: Record<string, string> = {
  non_connecte: 'Votre session a expiré. Reconnectez-vous.',
};

export type Destinataire = 'eleve' | 'parent';

/** Les comptes parents sont vouvoyés ; tous les autres rôles gardent le tutoiement. */
export function destinataireDuRole(role: string | null | undefined): Destinataire {
  return role === 'parent' ? 'parent' : 'eleve';
}

export function messageErreur(message: string | undefined, destinataire: Destinataire = 'eleve'): string {
  const code = Object.keys(MESSAGES).find((c) => message?.includes(c));
  if (destinataire === 'parent') {
    if (code && MESSAGES_PARENT[code]) return MESSAGES_PARENT[code];
    return code ? MESSAGES[code] : 'Une erreur est survenue. Réessayez dans un instant.';
  }
  return code ? MESSAGES[code] : 'Une erreur est survenue. Réessaie dans un instant.';
}
