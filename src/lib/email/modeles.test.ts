import { describe, expect, it } from 'vitest';
import { emailConsentement } from './modeles';

describe('emailConsentement', () => {
  const m = emailConsentement({ prenom: 'Léa', lien: 'https://app.example.fr/accord-parental/abc' });
  it('vouvoie le parent et donne le lien', () => {
    expect(m.sujet).toBe('Léa a besoin de votre accord pour utiliser App lycée');
    expect(m.texte).toContain('https://app.example.fr/accord-parental/abc');
    expect(m.texte).toContain('Ce lien est valable 7 jours.');
    expect(m.html).toContain('href="https://app.example.fr/accord-parental/abc"');
  });
  it('échappe le prénom dans le HTML', () => {
    const x = emailConsentement({ prenom: '<b>Léa</b>', lien: 'https://a.fr/accord-parental/x' });
    expect(x.html).not.toContain('<b>Léa</b>');
    expect(x.html).toContain('&lt;b&gt;Léa&lt;/b&gt;');
  });
  it('n’accepte qu’un lien https ou local', () => {
    expect(() => emailConsentement({ prenom: 'Léa', lien: 'javascript:alert(1)' })).toThrow();
  });
});
