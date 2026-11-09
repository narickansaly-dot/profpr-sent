import { describe, expect, it } from 'vitest';
import { cheminSuiteSur, redirectionPour } from './routes';

describe('redirectionPour', () => {
  it('laisse la tâche planifiée appeler la route d’envoi sans session', () => {
    expect(redirectionPour('/api/notifications/envoyer', false)).toBeNull();
  });
  it('ne rend publique que la route d’envoi, pas le reste de /api/notifications', () => {
    expect(redirectionPour('/api/notifications/autre', false)).toEqual({ pathname: '/connexion', suite: '/api/notifications/autre' });
  });
  it('envoie un visiteur non connecté vers la connexion', () => {
    expect(redirectionPour('/', false)).toEqual({ pathname: '/connexion' });
    expect(redirectionPour('/cours/bph-1re-st2s', false)).toEqual({
      pathname: '/connexion',
      suite: '/cours/bph-1re-st2s',
    });
  });
  it('laisse un visiteur non connecté sur les pages publiques', () => {
    expect(redirectionPour('/connexion', false)).toBeNull();
    expect(redirectionPour('/inscription', false)).toBeNull();
    expect(redirectionPour('/auth/callback', false)).toBeNull();
    expect(redirectionPour('/auth/confirm', false)).toBeNull();
    expect(redirectionPour('/ical/abc.ics', false)).toBeNull();
    expect(redirectionPour('/hors-ligne', false)).toBeNull();
  });
  it('laisse un parent sans session ouvrir la page d’accord, et seulement elle', () => {
    expect(redirectionPour('/accord-parental/xyz', false)).toBeNull();
    expect(redirectionPour('/accord-parentalx', false)).toEqual({ pathname: '/connexion', suite: '/accord-parentalx' });
    expect(redirectionPour('/consentement', false)).toEqual({ pathname: '/connexion', suite: '/consentement' });
  });
  it('laisse lire les pages légales sans session, et seulement elles', () => {
    for (const chemin of ['/mentions-legales', '/confidentialite', '/conditions-utilisation']) {
      expect(redirectionPour(chemin, false)).toBeNull();
      expect(redirectionPour(chemin, true)).toBeNull();
      expect(redirectionPour(chemin + 'x', false)).toEqual({ pathname: '/connexion', suite: chemin + 'x' });
    }
    expect(redirectionPour('/mes-donnees', false)).toEqual({ pathname: '/connexion', suite: '/mes-donnees' });
  });
  it('ne renvoie pas un élève connecté hors de /consentement', () => {
    expect(redirectionPour('/consentement', true)).toBeNull();
  });
  it('renvoie un élève connecté vers l’accueil depuis connexion et inscription', () => {
    expect(redirectionPour('/connexion', true)).toEqual({ pathname: '/' });
    expect(redirectionPour('/inscription', true)).toEqual({ pathname: '/' });
  });
  it('laisse passer un élève connecté ailleurs', () => {
    expect(redirectionPour('/cours/bph-1re-st2s', true)).toBeNull();
    expect(redirectionPour('/bienvenue', true)).toBeNull();
  });
  it('ne confond pas un préfixe avec une page publique', () => {
    expect(redirectionPour('/connexionx', false)).toEqual({ pathname: '/connexion', suite: '/connexionx' });
  });
});

describe('cheminSuiteSur', () => {
  it('accepte un chemin relatif de l’application', () => {
    expect(cheminSuiteSur('/cours/bph-1re-st2s/ch1')).toBe('/cours/bph-1re-st2s/ch1');
    expect(cheminSuiteSur('/classes?code=ABC')).toBe('/classes?code=ABC');
  });
  it('refuse les adresses externes et les chemins dangereux', () => {
    expect(cheminSuiteSur('https://exemple.com')).toBeNull();
    expect(cheminSuiteSur('//exemple.com')).toBeNull();
    expect(cheminSuiteSur('/\\exemple.com')).toBeNull();
    expect(cheminSuiteSur('javascript:alert(1)')).toBeNull();
    expect(cheminSuiteSur('/connexion')).toBeNull();
    expect(cheminSuiteSur(null)).toBeNull();
  });
  it('refuse ce qui n’est pas une chaîne, un backslash, un schéma ou une page d’invité', () => {
    expect(cheminSuiteSur(undefined)).toBeNull();
    expect(cheminSuiteSur(42)).toBeNull();
    expect(cheminSuiteSur('')).toBeNull();
    expect(cheminSuiteSur('cours/ch1')).toBeNull();
    expect(cheminSuiteSur('/cours\\ch1')).toBeNull();
    expect(cheminSuiteSur('/a:b')).toBe('/a:b');
    expect(cheminSuiteSur('/connexion?suite=/x')).toBeNull();
    expect(cheminSuiteSur('/inscription/')).toBeNull();
    expect(cheminSuiteSur('/inscription#x')).toBeNull();
    expect(cheminSuiteSur('/connexionx')).toBe('/connexionx');
    expect(cheminSuiteSur('/\t/exemple.com')).toBeNull();
    expect(cheminSuiteSur('/\n/exemple.com')).toBeNull();
  });
  // `/%2F%2Fexemple.com` reste un chemin de CE site (le navigateur ne décode pas %2F en
  // séparateur d’hôte) : l’accepter est sans danger, on documente ce comportement.
  it('accepte un double slash encodé, qui reste sur la même origine', () => {
    expect(cheminSuiteSur('/%2F%2Fexemple.com')).toBe('/%2F%2Fexemple.com');
  });
});
