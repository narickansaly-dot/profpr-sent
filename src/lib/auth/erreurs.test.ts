import { describe, expect, it } from 'vitest';
import { traduireErreurAuth } from './erreurs';

describe('traduireErreurAuth', () => {
  it('traduit les erreurs connues', () => {
    expect(traduireErreurAuth('Invalid login credentials')).toBe('E-mail ou mot de passe incorrect.');
    expect(traduireErreurAuth('User already registered')).toBe('Un compte existe déjà avec cet e-mail.');
  });
  it('donne un message générique sinon', () => {
    expect(traduireErreurAuth('boom')).toBe('Une erreur est survenue. Réessaie dans un instant.');
  });
});
