import { describe, expect, it } from 'vitest';
import { messageErreurQuiz } from './erreurs';

describe('messageErreurQuiz', () => {
  it('traduit les codes de la base', () => {
    expect(messageErreurQuiz('quiz_indisponible')).toBe('Ce quiz n’a pas encore assez de questions. Reviens bientôt !');
    expect(messageErreurQuiz('delai_attente')).toBe('Patiente 24 heures entre deux essais de l’évaluation.');
  });
  it('traduit evaluation_en_cours', () => {
    expect(messageErreurQuiz('evaluation_en_cours')).toBe('Termine d’abord ton évaluation en cours : les quiz de ce cours sont fermés pendant l’évaluation.');
  });
  it('donne un message générique sinon', () => {
    expect(messageErreurQuiz('boom')).toBe('Une erreur est survenue. Réessaie dans un instant.');
    expect(messageErreurQuiz(undefined)).toBe('Une erreur est survenue. Réessaie dans un instant.');
  });
});
