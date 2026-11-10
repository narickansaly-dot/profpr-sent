import { describe, expect, it } from 'vitest';
import { etatConsentement, explicationDeliaison, normaliserCode, resumeDepuisResultat, resumeProgression } from './format';

describe('espace parent', () => {
  it('normalise le code saisi', () => {
    expect(normaliserCode(' abcd-efgh ')).toBe('ABCDEFGH');
    expect(normaliserCode('ab cd ef gh')).toBe('ABCDEFGH');
  });
  it('décrit le consentement', () => {
    expect(etatConsentement({ moins15: false, donneLe: null, retireLe: null, suppressionPrevueLe: null }))
      .toBe('Plus de 15 ans : aucun accord n’est nécessaire.');
    expect(etatConsentement({ moins15: true, donneLe: '2026-12-01T10:00:00Z', retireLe: null, suppressionPrevueLe: null }))
      .toBe('Accord donné le 1 décembre 2026.');
    expect(etatConsentement({ moins15: true, donneLe: '2026-12-01T10:00:00Z', retireLe: '2026-12-20T10:00:00Z', suppressionPrevueLe: '2027-01-19T10:00:00Z' }))
      .toBe('Accord retiré le 20 décembre 2026. Le compte sera supprimé le 19 janvier 2027.');
  });
  it('résume la progression', () => {
    expect(resumeProgression([
      { chapitresValides: 1, chapitresTotal: 4, derniereActivite: '2026-12-10T10:00:00Z' },
      { chapitresValides: 2, chapitresTotal: 2, derniereActivite: null },
    ])).toEqual({ valides: 3, total: 6, derniereActivite: '2026-12-10T10:00:00Z' });
  });
  it('signale une progression indisponible quand la lecture a échoué', async () => {
    const [ok, ko] = await Promise.allSettled([
      Promise.resolve([{ chapitresValides: 1, chapitresTotal: 2, derniereActivite: null }]),
      Promise.reject(new Error('lien_introuvable')),
    ]);
    expect(resumeDepuisResultat(ok)).toEqual({ valides: 1, total: 2, derniereActivite: null });
    expect(resumeDepuisResultat(ko)).toBeNull();
  });
  it('explique la déliaison selon l’âge de l’enfant', () => {
    expect(explicationDeliaison(true)).toBe('Vous ne verrez plus la progression de cet enfant. Ce lien ne pourra pas être recréé automatiquement.');
    expect(explicationDeliaison(false)).toBe('Vous ne verrez plus la progression de cet enfant. Pour le suivre de nouveau, il faudra un nouveau code.');
  });
});
