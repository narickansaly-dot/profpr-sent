import { describe, expect, it } from 'vitest';
import { emailConsentement } from './modeles';

describe('emailConsentement', () => {
  const m = emailConsentement({ prenom: 'Léa', lien: 'https://app.example.fr/accord-parental/abc', origine: 'https://app.example.fr' });
  it('vouvoie le parent et donne le lien', () => {
    expect(m.sujet).toBe('Un accord parental est demandé pour App lycée');
    expect(m.texte).toContain('https://app.example.fr/accord-parental/abc');
    expect(m.texte).toContain('Ce lien est valable 7 jours.');
    expect(m.html).toContain('href="https://app.example.fr/accord-parental/abc"');
  });
  it('échappe le prénom dans le HTML', () => {
    const x = emailConsentement({ prenom: '<b>Léa</b>', lien: 'https://a.fr/accord-parental/x', origine: 'https://a.fr' });
    expect(x.html).not.toContain('<b>Léa</b>');
    expect(x.html).toContain('&lt;b&gt;Léa&lt;/b&gt;');
  });
  it('ne met pas le prénom dans le sujet, et le limite à 50 caractères dans le corps', () => {
    const x = emailConsentement({ prenom: 'Z'.repeat(80), lien: 'https://a.fr/x', origine: 'https://a.fr' });
    expect(x.sujet).toBe('Un accord parental est demandé pour App lycée');
    expect(x.texte).toContain(`${'Z'.repeat(50)} s’est inscrit`);
    expect(x.texte).not.toContain('Z'.repeat(51));
  });
  it('accepte http sur l’hôte local, sans origine configurée', () => {
    expect(() => emailConsentement({ prenom: 'Léa', lien: 'http://localhost:3000/accord-parental/x' })).not.toThrow();
  });
  it.each([
    ['javascript', 'javascript:alert(1)', 'https://a.fr'],
    ['ftp', 'ftp://a.fr/x', 'https://a.fr'],
    ['http hors local', 'http://a.fr/x', 'http://a.fr'],
    ['saut de ligne', 'https://a.fr/x\nBcc: x@y.fr', 'https://a.fr'],
    ['origine différente', 'https://autre.fr/x', 'https://a.fr'],
    ['hôte non local sans origine', 'https://a.fr/x', undefined],
  ])('refuse un lien invalide (%s)', (_n, lien, origine) => {
    expect(() => emailConsentement({ prenom: 'Léa', lien, origine })).toThrow();
  });
});
