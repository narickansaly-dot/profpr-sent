import { describe, expect, it } from 'vitest';
import { redirectionPour } from './routes';

describe('redirectionPour', () => {
  it('envoie un visiteur non connecté vers la connexion', () => {
    expect(redirectionPour('/', false)).toBe('/connexion');
    expect(redirectionPour('/cours/bph-1re-st2s', false)).toBe('/connexion');
  });
  it('laisse un visiteur non connecté sur les pages publiques', () => {
    expect(redirectionPour('/connexion', false)).toBeNull();
    expect(redirectionPour('/inscription', false)).toBeNull();
    expect(redirectionPour('/auth/callback', false)).toBeNull();
    expect(redirectionPour('/auth/confirm', false)).toBeNull();
  });
  it('renvoie un élève connecté vers l’accueil depuis connexion et inscription', () => {
    expect(redirectionPour('/connexion', true)).toBe('/');
    expect(redirectionPour('/inscription', true)).toBe('/');
  });
  it('laisse passer un élève connecté ailleurs', () => {
    expect(redirectionPour('/cours/bph-1re-st2s', true)).toBeNull();
    expect(redirectionPour('/bienvenue', true)).toBeNull();
  });
  it('ne confond pas un préfixe avec une page publique', () => {
    expect(redirectionPour('/connexionx', false)).toBe('/connexion');
  });
});
