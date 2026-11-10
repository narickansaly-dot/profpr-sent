import { describe, expect, it } from 'vitest';
import { decalerSilence } from './silence';

const nuit = { debut: '22:00', fin: '07:00' };

describe('decalerSilence', () => {
  it('laisse passer une heure hors silence', () => {
    const midi = new Date('2026-12-10T11:00:00Z'); // 12 h à Paris
    expect(decalerSilence(midi, nuit)).toEqual(midi);
  });
  it('décale une notification du soir au lendemain 7 h', () => {
    expect(decalerSilence(new Date('2026-12-10T22:00:00Z'), nuit).toISOString()).toBe('2026-12-11T06:00:00.000Z');
  });
  it('décale une notification de la nuit au matin du même jour', () => {
    expect(decalerSilence(new Date('2026-12-11T04:00:00Z'), nuit).toISOString()).toBe('2026-12-11T06:00:00.000Z');
  });
  it('le début de la plage est silencieux, la fin ne l’est pas', () => {
    expect(decalerSilence(new Date('2026-12-10T21:00:00Z'), nuit).toISOString()).toBe('2026-12-11T06:00:00.000Z');
    const septHeures = new Date('2026-12-11T06:00:00Z');
    expect(decalerSilence(septHeures, nuit)).toEqual(septHeures);
  });
  it('gère une plage dans la journée', () => {
    const plage = { debut: '13:00', fin: '14:00' };
    expect(decalerSilence(new Date('2026-12-10T12:30:00Z'), plage).toISOString()).toBe('2026-12-10T13:00:00.000Z');
  });
  it('une plage vide ne décale rien', () => {
    const t = new Date('2026-12-10T23:00:00Z');
    expect(decalerSilence(t, { debut: '00:00', fin: '00:00' })).toEqual(t);
  });
  it('accepte les heures renvoyées par la base (HH:MM:SS)', () => {
    expect(decalerSilence(new Date('2026-12-10T22:00:00Z'), { debut: '22:00:00', fin: '07:00:00' }).toISOString())
      .toBe('2026-12-11T06:00:00.000Z');
  });
  it('tient compte du passage à l’heure d’été', () => {
    // Samedi 27 mars 2027, 23 h 30 à Paris → dimanche 28 mars, 7 h (heure d’été, UTC+2).
    expect(decalerSilence(new Date('2027-03-27T22:30:00Z'), nuit).toISOString()).toBe('2027-03-28T05:00:00.000Z');
  });
});
