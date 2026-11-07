import { describe, expect, it } from 'vitest';
import {
  ajouterJours, ajouterMois, debutJourParis, debutSemaine, estJourValide, grilleMois, heureParis, jourParis,
  jourSemaineIso, libelleJour, libellePeriode, lireVue, naviguer, periodeVue,
} from './dates';

describe('dates du calendrier', () => {
  it('donne le jour de Paris d’un instant', () => {
    expect(jourParis(new Date('2026-12-01T23:30:00Z'))).toBe('2026-12-02');
    expect(jourParis(new Date('2026-07-01T21:59:00Z'))).toBe('2026-07-01');
  });
  it('donne l’heure de Paris', () => {
    expect(heureParis('2026-12-07T16:00:00Z')).toBe('17:00');
    expect(heureParis('2027-03-28T15:00:00Z')).toBe('17:00');
  });
  it('calcule jours et semaines', () => {
    expect(ajouterJours('2026-12-31', 1)).toBe('2027-01-01');
    expect(jourSemaineIso('2026-12-01')).toBe(2);
    expect(jourSemaineIso('2026-12-06')).toBe(7);
    expect(debutSemaine('2026-12-06')).toBe('2026-11-30');
    expect(ajouterMois('2026-12-15', 1)).toBe('2027-01-01');
    expect(estJourValide('2026-02-30')).toBe(false);
    expect(estJourValide('2026-12-01')).toBe(true);
  });
  it('construit une grille de mois de 42 jours qui commence un lundi', () => {
    const g = grilleMois('2026-12-15');
    expect(g).toHaveLength(42);
    expect(g[0]).toBe('2026-11-30');
    expect(g[41]).toBe('2027-01-10');
  });
  it('donne minuit à Paris, changements d’heure compris', () => {
    expect(debutJourParis('2026-12-01')).toBe('2026-11-30T23:00:00.000Z');
    expect(debutJourParis('2027-03-28')).toBe('2027-03-27T23:00:00.000Z');
    expect(debutJourParis('2027-03-29')).toBe('2027-03-28T22:00:00.000Z');
  });
  it('donne la période d’une vue', () => {
    expect(periodeVue('jour', '2026-12-01')).toEqual({ jours: ['2026-12-01'], de: '2026-11-30T23:00:00.000Z', a: '2026-12-01T23:00:00.000Z' });
    const semaine = periodeVue('semaine', '2026-12-03');
    expect(semaine.jours[0]).toBe('2026-11-30');
    expect(semaine.jours).toHaveLength(7);
    expect(semaine.a).toBe('2026-12-06T23:00:00.000Z');
  });
  it('lit la vue demandée, ou la semaine d’aujourd’hui', () => {
    const maintenant = new Date('2026-12-01T08:00:00Z');
    expect(lireVue({ vue: 'mois', date: '2026-12-20' }, maintenant)).toEqual({ vue: 'mois', jour: '2026-12-20' });
    expect(lireVue({ vue: 'annee', date: 'hier' }, maintenant)).toEqual({ vue: 'semaine', jour: '2026-12-01' });
  });
  it('navigue d’une période à l’autre', () => {
    expect(naviguer('jour', '2026-12-01', -1)).toBe('2026-11-30');
    expect(naviguer('semaine', '2026-12-01', 1)).toBe('2026-12-08');
    expect(naviguer('mois', '2026-12-20', 1)).toBe('2027-01-01');
  });
  it('écrit les libellés en français', () => {
    expect(libelleJour('2026-12-01')).toBe('mardi 1 décembre');
    expect(libellePeriode('semaine', '2026-12-03')).toBe('Semaine du 30 novembre');
    expect(libellePeriode('mois', '2026-12-03')).toBe('décembre 2026');
    expect(libellePeriode('jour', '2026-12-03')).toBe('jeudi 3 décembre 2026');
  });
});
