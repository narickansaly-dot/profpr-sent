import { describe, expect, it } from 'vitest';
import { schemaIdentifiants } from './identifiants';

describe('schemaIdentifiants', () => {
  it('accepte un e-mail et un mot de passe de 8 caractères', () => {
    expect(schemaIdentifiants.safeParse({ email: 'lea@exemple.fr', motDePasse: '12345678' }).success).toBe(true);
  });
  it('refuse un e-mail invalide avec un message en français', () => {
    const r = schemaIdentifiants.safeParse({ email: 'lea', motDePasse: '12345678' });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe('Saisis une adresse e-mail valide.');
  });
  it('refuse un mot de passe trop court', () => {
    const r = schemaIdentifiants.safeParse({ email: 'lea@exemple.fr', motDePasse: '1234' });
    expect(r.error?.issues[0].message).toBe('Ton mot de passe doit contenir au moins 8 caractères.');
  });
});
