import { describe, expect, it } from 'vitest';
import { abonne, coursOuvert, doitChoisirCours, lireAbonnement, type MonAcces } from './etat';

const base: MonAcces = {
  role: 'eleve', enEssai: false, finEssai: '2026-12-01T10:00:00Z', coursGratuitId: null,
  changementPossibleJusquAu: null, consentementRequis: false, emailParent: null, consentementEnvoyeLe: null,
  abonnement: null, consentementRetireLe: null, suppressionPrevueLe: null,
};

describe('accès', () => {
  it('pendant l’essai, tout est ouvert et rien n’est à choisir', () => {
    const a = { ...base, enEssai: true };
    expect(coursOuvert(a, 'x')).toBe(true);
    expect(doitChoisirCours(a)).toBe(false);
  });
  it('après l’essai sans choix : tout est fermé, il faut choisir', () => {
    expect(coursOuvert(base, 'x')).toBe(false);
    expect(doitChoisirCours(base)).toBe(true);
  });
  it('après le choix : seul le cours gratuit est ouvert', () => {
    const a = { ...base, coursGratuitId: 'x' };
    expect(coursOuvert(a, 'x')).toBe(true);
    expect(coursOuvert(a, 'y')).toBe(false);
    expect(doitChoisirCours(a)).toBe(false);
  });
  it('sans accord parental, rien n’est ouvert et rien n’est à choisir', () => {
    const a = { ...base, enEssai: true, consentementRequis: true, finEssai: null };
    expect(coursOuvert(a, 'x')).toBe(false);
    expect(doitChoisirCours({ ...a, enEssai: false })).toBe(false);
  });
  it('un enseignant voit tout', () => {
    expect(coursOuvert({ ...base, role: 'enseignant' }, 'x')).toBe(true);
    expect(doitChoisirCours({ ...base, role: 'enseignant' })).toBe(false);
  });
  it('un cours gratuit dépublié (id nul) oblige à choisir de nouveau', () => {
    const a = { ...base, coursGratuitId: null, changementPossibleJusquAu: null };
    expect(doitChoisirCours(a)).toBe(true);
  });
  it('un abonné voit tout et n’a rien à choisir, même après l’essai', () => {
    const a = { ...base, abonnement: { formule: 'mensuelle' as const, statut: 'actif', finPeriode: '2027-01-01T00:00:00Z', finGrace: null, actif: true } };
    expect(abonne(a)).toBe(true);
    expect(coursOuvert(a, 'x')).toBe(true);
    expect(doitChoisirCours(a)).toBe(false);
  });
  it('un abonnement inactif ne change rien', () => {
    const a = { ...base, abonnement: { formule: 'mensuelle' as const, statut: 'expire', finPeriode: '2026-01-01T00:00:00Z', finGrace: null, actif: false } };
    expect(abonne(a)).toBe(false);
    expect(doitChoisirCours(a)).toBe(true);
  });
  it('lit le JSON d’abonnement de la base', () => {
    expect(lireAbonnement({ formule: 'annuelle', statut: 'actif', fin_periode: '2027-01-01T00:00:00Z', fin_grace: null, actif: true }))
      .toEqual({ formule: 'annuelle', statut: 'actif', finPeriode: '2027-01-01T00:00:00Z', finGrace: null, actif: true });
  });
  it('renvoie null pour un JSON d’abonnement inattendu', () => {
    expect(lireAbonnement({ formule: 'x' })).toBeNull();
    expect(lireAbonnement('n’importe quoi')).toBeNull();
    expect(lireAbonnement(null)).toBeNull();
  });
});
