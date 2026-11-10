import { describe, expect, it } from 'vitest';
import { MESSAGES, destinataireDuRole, messageErreur } from './erreurs';

describe('messageErreur', () => {
  it('traduit les codes de la base', () => {
    expect(messageErreur('quiz_indisponible')).toBe('Ce quiz n’a pas encore assez de questions. Reviens bientôt\u00a0!');
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
      question_utilisee: 'Cette question a déjà servi dans des quiz\u00a0: elle ne peut pas être supprimée. Repasse-la en brouillon.',
      transition_invalide: 'Ce changement de statut n’est pas possible\u00a0: une question passe par «\u00a0à relire\u00a0» avant d’être validée.',
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
      .toBe('Cette question a un signalement ouvert\u00a0: traite-le avant de la supprimer.');
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
  it('traduit l’erreur de la sélection en lot', () => {
    expect(messageErreur('trop_de_questions')).toBe('Sélectionne au plus 200 questions à la fois.');
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

describe('messageErreur, consentement parental', () => {
  it('traduit les codes du consentement', () => {
    expect(messageErreur('consentement_requis')).toBe('L’accord d’un parent est nécessaire avant de choisir un cours.');
    expect(messageErreur('age_verrouille')).toBe('Ton âge ne peut plus être modifié après l’inscription.');
    expect(messageErreur('consentement_inutile')).toBe('L’accord d’un parent n’est demandé qu’aux élèves de moins de 15 ans.');
    expect(messageErreur('email_parent_invalide')).toBe('Indique une adresse e-mail valide pour ton parent.');
    expect(messageErreur('consentement_deja_donne')).toBe('Ton parent a déjà donné son accord.');
    expect(messageErreur('envoi_trop_rapproche')).toBe('Attends 10 minutes avant d’envoyer un nouvel e-mail.');
    expect(messageErreur('envois_epuises')).toBe('Trop de demandes d’accord ont été envoyées aujourd’hui (5 par élève, 3 vers une même adresse). Réessaie demain.');
    expect(messageErreur('lien_consentement_invalide')).toBe('Ce lien n’est plus valable. Demandez à votre enfant de vous en envoyer un nouveau.');
  });
  it('aucun code n’est sous-chaîne d’un autre', () => {
    const codes = ['consentement_requis', 'age_verrouille', 'consentement_inutile', 'email_parent_invalide', 'consentement_deja_donne', 'envoi_trop_rapproche', 'envois_epuises', 'lien_consentement_invalide'];
    const autres = Object.keys(MESSAGES);
    for (const c of codes) {
      for (const a of autres) {
        if (a !== c) expect(a.includes(c) || c.includes(a)).toBe(false);
      }
    }
  });
});

describe('messageErreur, mes données', () => {
  it('traduit dernier_admin sans collision avec un autre code', () => {
    expect(messageErreur('dernier_admin')).toBe('Tu es le seul administrateur du contenu\u00a0: désigne-en un autre avant de demander la suppression de ton compte.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'dernier_admin') expect(a.includes('dernier_admin') || 'dernier_admin'.includes(a)).toBe(false);
    }
  });
});

describe('messageErreur, retour bloqué', () => {
  it('traduit retour_bloque sans collision avec un autre code', () => {
    expect(messageErreur('retour_bloque')).toBe('Tu ne fais plus partie de cette classe. Tu pourras la rejoindre de nouveau dans 24 heures.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'retour_bloque') expect(a.includes('retour_bloque') || 'retour_bloque'.includes(a)).toBe(false);
    }
  });
});

describe('messageErreur, comptes parents', () => {
  it('traduit pas_parent sans collision avec un autre code', () => {
    expect(messageErreur('pas_parent')).toBe('Cette page est réservée aux comptes parents.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'pas_parent') expect(a.includes('pas_parent') || 'pas_parent'.includes(a)).toBe(false);
    }
  });
  it('traduit deja_inscrit sans collision avec un autre code', () => {
    expect(messageErreur('deja_inscrit')).toBe('Ce compte a déjà commencé comme élève\u00a0: il ne peut pas devenir un compte parent.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'deja_inscrit') expect(a.includes('deja_inscrit') || 'deja_inscrit'.includes(a)).toBe(false);
    }
  });
  it('traduit nom_parent_invalide sans collision avec un autre code', () => {
    expect(messageErreur('nom_parent_invalide')).toBe('Indiquez votre prénom (2 à 60 caractères).');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'nom_parent_invalide') expect(a.includes('nom_parent_invalide') || 'nom_parent_invalide'.includes(a)).toBe(false);
    }
  });
  it('traduit trop_de_parents sans collision avec un autre code', () => {
    expect(messageErreur('trop_de_parents')).toBe('Ce compte élève est déjà relié à deux parents.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'trop_de_parents') expect(a.includes('trop_de_parents') || 'trop_de_parents'.includes(a)).toBe(false);
    }
  });
  it('traduit reserve_15_ans sans collision avec un autre code', () => {
    expect(messageErreur('reserve_15_ans')).toBe('Avant 15 ans, c’est ton parent qui crée le lien, avec l’adresse qui a reçu la demande d’accord.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'reserve_15_ans') expect(a.includes('reserve_15_ans') || 'reserve_15_ans'.includes(a)).toBe(false);
    }
  });
  it('traduit code_parent_invalide sans collision avec un autre code', () => {
    expect(messageErreur('code_parent_invalide')).toBe('Ce code n’est pas valable ou a expiré. Demandez un nouveau code à votre enfant.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'code_parent_invalide') expect(a.includes('code_parent_invalide') || 'code_parent_invalide'.includes(a)).toBe(false);
    }
  });
  it('traduit essais_code_epuises sans collision avec un autre code', () => {
    expect(messageErreur('essais_code_epuises')).toBe('Trop d’essais. Réessayez dans une heure.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'essais_code_epuises') expect(a.includes('essais_code_epuises') || 'essais_code_epuises'.includes(a)).toBe(false);
    }
  });
  it('traduit deliaison_interdite sans collision avec un autre code', () => {
    expect(messageErreur('deliaison_interdite')).toBe('Avant 15 ans, seul ton parent peut retirer ce lien.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'deliaison_interdite') expect(a.includes('deliaison_interdite') || 'deliaison_interdite'.includes(a)).toBe(false);
    }
  });
  it('traduit lien_introuvable sans collision avec un autre code', () => {
    expect(messageErreur('lien_introuvable')).toBe('Ce lien n’existe pas ou a déjà été retiré.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'lien_introuvable') expect(a.includes('lien_introuvable') || 'lien_introuvable'.includes(a)).toBe(false);
    }
  });
  it('traduit retrait_impossible sans collision avec un autre code', () => {
    expect(messageErreur('retrait_impossible')).toBe('Ce retrait n’est pas possible pour ce compte.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'retrait_impossible') expect(a.includes('retrait_impossible') || 'retrait_impossible'.includes(a)).toBe(false);
    }
  });
  it('traduit consentement_retire sans collision avec un autre code', () => {
    expect(messageErreur('consentement_retire')).toBe('Ton parent a retiré son accord\u00a0: tu ne peux pas faire de nouvelle demande.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'consentement_retire') expect(a.includes('consentement_retire') || 'consentement_retire'.includes(a)).toBe(false);
    }
  });
  it('traduit suppression_imposee sans collision avec un autre code', () => {
    expect(messageErreur('suppression_imposee')).toBe('La suppression a été demandée par ton parent\u00a0: seul ton parent peut l’annuler.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'suppression_imposee') expect(a.includes('suppression_imposee') || 'suppression_imposee'.includes(a)).toBe(false);
    }
  });
  it('traduit retrait_en_cours sans collision avec un autre code', () => {
    expect(messageErreur('retrait_en_cours')).toBe('Annulez d’abord le retrait de votre accord. Sinon, le compte de votre enfant sera supprimé à la date prévue.');
    for (const a of Object.keys(MESSAGES)) {
      if (a !== 'retrait_en_cours') expect(a.includes('retrait_en_cours') || 'retrait_en_cours'.includes(a)).toBe(false);
    }
  });
  it('choisit la variante vouvoyée pour un parent sans changer celle des élèves', () => {
    expect(messageErreur('boom', 'parent')).toBe('Une erreur est survenue. Réessayez dans un instant.');
    expect(messageErreur(undefined, 'parent')).toBe('Une erreur est survenue. Réessayez dans un instant.');
    expect(messageErreur('non_connecte', 'parent')).toBe('Votre session a expiré. Reconnectez-vous.');
    expect(messageErreur('lien_introuvable', 'parent')).toBe('Ce lien n’existe pas ou a déjà été retiré.');
    expect(messageErreur('boom', 'eleve')).toBe('Une erreur est survenue. Réessaie dans un instant.');
    expect(messageErreur('boom')).toBe('Une erreur est survenue. Réessaie dans un instant.');
    expect(messageErreur('non_connecte')).toBe('Ta session a expiré. Reconnecte-toi.');
  });
  it('n’a aucune espace normale avant « : ; ! ? » dans les textes visibles', () => {
    for (const [code, texte] of Object.entries(MESSAGES)) {
      expect(texte, code).not.toMatch(/ [:;!?]/);
    }
  });
  it('choisit le destinataire selon le rôle', () => {
    expect(destinataireDuRole('parent')).toBe('parent');
    for (const r of ['eleve', 'enseignant', 'admin', null, undefined]) expect(destinataireDuRole(r)).toBe('eleve');
  });
});

describe('messageErreur, consentement_retire sur la page d’accord', () => {
  it('garde le tutoiement pour l’élève', () => {
    expect(messageErreur('consentement_retire')).toBe('Ton parent a retiré son accord\u00a0: tu ne peux pas faire de nouvelle demande.');
  });
  it('vouvoie le parent', () => {
    expect(messageErreur('consentement_retire', 'parent')).toBe('L’accord a été retiré\u00a0: cette page ne permet plus de le donner.');
  });
});
