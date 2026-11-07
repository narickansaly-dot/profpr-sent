import { describe, expect, it } from 'vitest';
import { genererPlanning, trierParPriorite, type ChapitrePlan, type Reglages } from './generer';

const c1: ChapitrePlan = { id: 'c1', numero: 1, titre: 'Un', valide: true, meilleureNote: 90, valideLe: '2026-11-20T10:00:00Z' };
const c2: ChapitrePlan = { id: 'c2', numero: 2, titre: 'Deux', valide: false, meilleureNote: 40, valideLe: null };
const c3: ChapitrePlan = { id: 'c3', numero: 3, titre: 'Trois', valide: false, meilleureNote: null, valideLe: null };
const reglages: Reglages = { sessionsParSemaine: 3, dureeMinutes: 60, joursPreferes: [1, 3, 5], heureDebut: '17:00' };
const base = { maintenant: new Date('2026-12-01T08:00:00Z'), examenDebut: '2026-12-11T08:00:00Z', chapitres: [c1, c2, c3], reglages, occupes: [] };

describe('trierParPriorite', () => {
  it('met les non validés d’abord, puis la note la plus basse, puis les validés depuis le plus longtemps', () => {
    const ancien = { ...c1, id: 'ancien', numero: 4, meilleureNote: 80, valideLe: '2026-10-01T00:00:00Z' };
    const recent = { ...c1, id: 'recent', numero: 5, meilleureNote: 80, valideLe: '2026-11-01T00:00:00Z' };
    expect(trierParPriorite([c1, recent, c2, ancien, c3]).map((c) => c.id)).toEqual(['c3', 'c2', 'ancien', 'recent', 'c1']);
  });
});

describe('genererPlanning', () => {
  it('répartit un chapitre par session sur les jours préférés, puis prévoit la révision générale la veille', () => {
    const p = genererPlanning(base);
    expect(p.regroupe).toBe(false);
    expect(p.avertissements).toEqual([]);
    expect(p.sessions.map((s) => [s.debut, s.chapitres])).toEqual([
      ['2026-12-02T16:00:00.000Z', ['c3']],
      ['2026-12-04T16:00:00.000Z', ['c2']],
      ['2026-12-07T16:00:00.000Z', ['c1']],
      ['2026-12-10T16:00:00.000Z', ['c1', 'c2', 'c3']],
    ]);
    expect(p.sessions[0].titre).toBe('Révision · Ch. 3 Trois');
    expect(p.sessions[3]).toMatchObject({ titre: 'Révision générale', revisionGenerale: true, dureeMinutes: 60 });
  });

  it('regroupe les chapitres et prévient quand les créneaux manquent', () => {
    const p = genererPlanning({ ...base, reglages: { ...reglages, sessionsParSemaine: 1 } });
    expect(p.regroupe).toBe(true);
    expect(p.avertissements).toEqual(['Pas assez de créneaux\u00a0: jusqu’à 2 chapitres par session.']);
    expect(p.sessions.map((s) => [s.debut, s.chapitres, s.titre])).toEqual([
      ['2026-12-02T16:00:00.000Z', ['c3', 'c2'], 'Révision · Ch. 2 et 3'],
      ['2026-12-07T16:00:00.000Z', ['c1'], 'Révision · Ch. 1 Un'],
      ['2026-12-10T16:00:00.000Z', ['c1', 'c2', 'c3'], 'Révision générale'],
    ]);
  });

  it('utilise tous les créneaux quand il y en a moins que de chapitres (7 chapitres, 6 créneaux)', () => {
    const chapitres = [1, 2, 3, 4, 5, 6, 7].map((k) => ({ ...c2, id: `k${k}`, numero: k, meilleureNote: 10 * k }));
    const p = genererPlanning({
      maintenant: new Date('2026-11-07T10:00:00Z'), examenDebut: '2026-11-23T09:00:00Z', chapitres, occupes: [],
      reglages: { sessionsParSemaine: 3, dureeMinutes: 60, joursPreferes: [1, 2, 3, 4, 5], heureDebut: '17:30' },
    });
    const normales = p.sessions.filter((s) => !s.revisionGenerale);
    expect(normales).toHaveLength(6);
    expect(p.sessions.filter((s) => s.revisionGenerale)).toHaveLength(1);
    expect(normales.map((s) => s.chapitres.length)).toEqual([2, 1, 1, 1, 1, 1]);
    expect(normales.map((s) => s.debut.slice(0, 10))).toEqual([
      '2026-11-09', '2026-11-10', '2026-11-11', '2026-11-16', '2026-11-17', '2026-11-18',
    ]);
    expect(p.regroupe).toBe(true);
    expect(p.avertissements).toEqual(['Pas assez de créneaux\u00a0: jusqu’à 2 chapitres par session.']);
  });

  it('décale une session qui chevauche un événement existant', () => {
    const p = genererPlanning({ ...base, occupes: [{ debut: '2026-12-02T16:00:00Z', fin: '2026-12-02T17:00:00Z' }] });
    expect(p.sessions[0].debut).toBe('2026-12-02T17:00:00.000Z');
  });

  it('ne place pas de session qui commence dans moins de 30 minutes', () => {
    const p = genererPlanning({ ...base, maintenant: new Date('2026-12-02T15:45:00Z') });
    expect(p.sessions[0].debut).toBe('2026-12-02T17:00:00.000Z');
  });

  it('garde l’heure de Paris après le passage à l’heure d’été', () => {
    const p = genererPlanning({
      maintenant: new Date('2027-03-26T06:00:00Z'), examenDebut: '2027-03-31T07:00:00Z', occupes: [],
      chapitres: [{ ...c2, id: 'a', numero: 1, meilleureNote: 30 }, { ...c2, id: 'b', numero: 2, meilleureNote: 50 }],
      reglages: { sessionsParSemaine: 7, dureeMinutes: 60, joursPreferes: [1, 2, 3, 4, 5, 6, 7], heureDebut: '17:00' },
    });
    expect(p.sessions.map((s) => s.debut)).toEqual(['2027-03-26T16:00:00.000Z', '2027-03-28T15:00:00.000Z', '2027-03-30T15:00:00.000Z']);
  });

  it('ne prévoit que la révision générale quand l’examen est demain', () => {
    const p = genererPlanning({ ...base, maintenant: new Date('2026-12-10T08:00:00Z') });
    expect(p.avertissements).toEqual(['Aucun créneau libre avant l’examen\u00a0: seule la révision générale est prévue.']);
    expect(p.sessions).toHaveLength(1);
    expect(p.sessions[0].revisionGenerale).toBe(true);
  });

  it('ne prévoit rien quand l’examen est aujourd’hui', () => {
    const p = genererPlanning({ ...base, maintenant: new Date('2026-12-11T06:00:00Z') });
    expect(p.sessions).toEqual([]);
    expect(p.avertissements).toEqual([
      'Aucun créneau libre avant l’examen\u00a0: seule la révision générale est prévue.',
      'Pas de créneau libre la veille de l’examen pour la révision générale.',
    ]);
  });

  it('prévient quand il n’y a aucun chapitre', () => {
    expect(genererPlanning({ ...base, chapitres: [] })).toEqual({ sessions: [], regroupe: false, avertissements: ['Aucun chapitre à réviser.'] });
  });
});
