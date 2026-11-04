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
});
