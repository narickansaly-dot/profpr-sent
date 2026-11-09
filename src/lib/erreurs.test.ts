import { describe, expect, it } from 'vitest';
import { messageErreur } from './erreurs';

describe('messageErreur', () => {
  it('traduit les codes de la base', () => {
    expect(messageErreur('quiz_indisponible')).toBe('Ce quiz n’a pas encore assez de questions. Reviens bientôt !');
    expect(messageErreur('delai_attente')).toBe('Patiente 24 heures entre deux essais de l’évaluation.');
  });
  it('traduit evaluation_en_cours', () => {
    // Espace insécable (U+00A0) avant le deux-points, comme dans les autres textes.
    expect(messageErreur('evaluation_en_cours')).toBe('Termine d’abord ton évaluation en cours\u00a0: les quiz de ce cours sont fermés pendant l’évaluation.');
  });
  it('traduit tentative_terminee', () => {
    expect(messageErreur('tentative_terminee')).toBe('Ce quiz est terminé.');
  });
  it('reconnaît le code dans un message Postgres complet', () => {
    expect(messageErreur('ERROR:  delai_attente (P0001)')).toBe('Patiente 24 heures entre deux essais de l’évaluation.');
  });
  it('traduit les codes de l’espace enseignant', () => {
    expect(messageErreur('evaluation_pas_ouverte')).toBe('L’évaluation n’est pas encore ouverte pour ta classe.');
    expect(messageErreur('evaluation_close')).toBe('La date limite de l’évaluation est passée.');
    expect(messageErreur('dates_invalides')).toBe('La date d’ouverture doit être avant la date limite.');
  });
  it('donne un message générique sinon', () => {
    expect(messageErreur('boom')).toBe('Une erreur est survenue. Réessaie dans un instant.');
    expect(messageErreur(undefined)).toBe('Une erreur est survenue. Réessaie dans un instant.');
  });
});

describe('messageErreur, espace classes', () => {
  it('parle de la classe, pas du cours, quand la classe est hors de portée', () => {
    expect(messageErreur('classe_introuvable')).toBe('Cette classe est introuvable.');
  });
  it('explique qu’une classe se rejoint avec un compte élève', () => {
    expect(messageErreur('classe_reservee_eleves')).toBe('Seuls les comptes élèves peuvent rejoindre une classe.');
  });
  it('traduit une décision manquante sur une demande enseignant', () => {
    expect(messageErreur('decision_invalide')).toBe('Choisis de valider ou de refuser la demande.');
  });
  it('traduit chaque code que les RPC de classe peuvent lever', () => {
    for (const code of ['acces_refuse', 'classe_introuvable', 'classe_reservee_eleves', 'code_invalide', 'trop_d_essais']) {
      expect(messageErreur(code)).not.toMatch(/Une erreur est survenue/);
    }
  });
  it('traduit les codes de la gestion du contenu', () => {
    const attendus: Record<string, string> = {
      question_invalide: 'Cette question est incomplète ou mal formée.',
      question_introuvable: 'Cette question n’existe plus.',
      question_archivee: 'Cette question a été remplacée par une nouvelle version.',
      question_autre_chapitre: 'Cette source est déjà utilisée dans un autre chapitre.',
      source_deja_prise: 'Cette source est déjà utilisée par une autre question.',
      question_utilisee: 'Cette question a déjà servi dans des quiz : elle ne peut pas être supprimée. Repasse-la en brouillon.',
      transition_invalide: 'Ce changement de statut n’est pas possible : une question passe par « à relire » avant d’être validée.',
      chapitre_invalide: 'Ce chapitre est incomplet ou mal formé (vérifie le slug et les identifiants de section).',
      chapitre_introuvable: 'Ce chapitre n’existe plus.',
      cours_introuvable: 'Ce cours n’existe plus.',
      slug_deja_pris: 'Cet identifiant d’URL est déjà utilisé.',
      filiere_inconnue: 'Filière inconnue.',
      import_invalide: 'Le fichier d’import est incomplet ou mal formé.',
      commentaire_invalide: 'Ton commentaire doit faire entre 5 et 1000 caractères.',
      deja_signalee: 'Tu as déjà signalé cette question.',
      trop_de_signalements: 'Tu as atteint la limite de 20 signalements par jour.',
      signalement_introuvable: 'Ce signalement a déjà été traité.',
    };
    for (const [code, texte] of Object.entries(attendus)) expect(messageErreur(code)).toBe(texte);
  });
  it('traduit les codes de la vague finale (numéro de chapitre, question signalée)', () => {
    expect(messageErreur('numero_deja_pris')).toBe('Ce numéro est déjà utilisé par un autre chapitre du cours.');
    expect(messageErreur('question_signalee'))
      .toBe('Cette question a un signalement ouvert : traite-le avant de la supprimer.');
  });
  it('garde decision_invalide de l’étape 3a', () => {
    expect(messageErreur('decision_invalide')).toBe('Choisis de valider ou de refuser la demande.');
  });
  it('traduit les codes renommés de l’admin sans toucher aux anciens', () => {
    expect(messageErreur('cours_mal_forme')).toBe('Ce cours est incomplet ou mal formé.');
    expect(messageErreur('reponse_trop_longue')).toBe('La réponse ne doit pas dépasser 1000 caractères.');
    expect(messageErreur('cours_invalide')).toBe('Choisis au moins un cours publié.');
    expect(messageErreur('reponse_invalide')).toBe('Ta réponse n’a pas pu être lue. Réessaie.');
  });
});

describe('messageErreur, calendrier et planning', () => {
  it('traduit chaque code levé par les RPC du calendrier', () => {
    const attendu: Record<string, string> = {
      reserve_eleves: 'Réservé aux comptes élèves.',
      evenement_invalide: 'Cet événement est incomplet\u00a0: vérifie le titre, la date et la durée.',
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
    };
    for (const [code, texte] of Object.entries(attendu)) expect(messageErreur(code)).toBe(texte);
  });
  it('traduit les erreurs des notifications', () => {
    expect(messageErreur('abonnement_invalide')).toBe('Cet appareil n’a pas pu être enregistré. Réessaie.');
    expect(messageErreur('preferences_invalides')).toBe('Tes réglages n’ont pas pu être lus. Vérifie les heures et réessaie.');
    expect(messageErreur('rappel_invalide')).toBe('Choisis un rappel dans la liste.');
  });
  it('garde les codes déjà traduits que le calendrier peut lever', () => {
    for (const code of ['non_connecte', 'acces_refuse', 'quiz_indisponible', 'evaluation_en_cours']) {
      expect(messageErreur(code)).not.toBe('Une erreur est survenue. Réessaie dans un instant.');
    }
  });
});

describe('messageErreur, accès gratuit', () => {
  it('traduit les codes du cours gratuit', () => {
    expect(messageErreur('essai_en_cours')).toBe('Ton essai n’est pas terminé\u00a0: tous les cours sont encore ouverts.');
    expect(messageErreur('choix_definitif')).toBe('Ton choix de cours gratuit est définitif.');
    expect(messageErreur('cours_hors_filiere')).toBe('Ce cours n’appartient pas à ta filière ou à ton niveau.');
  });
});
