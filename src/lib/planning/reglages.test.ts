import { describe, expect, it } from 'vitest';
import { lireReglages, versReglagesRpc } from './reglages';

function formulaire(champs: Record<string, string | string[]>) {
  const f = new FormData();
  for (const [cle, valeur] of Object.entries(champs)) for (const v of [valeur].flat()) f.append(cle, v);
  return f;
}

describe('lireReglages', () => {
  it('lit des réglages valides', () => {
    const r = lireReglages(formulaire({ sessions: '3', duree: '45', jours: ['1', '3', '3'], heure: '17:30' }));
    expect(r).toEqual({ ok: true, reglages: { sessionsParSemaine: 3, dureeMinutes: 45, joursPreferes: [1, 3], heureDebut: '17:30' } });
  });
  it('exige au moins un jour', () => {
    expect(lireReglages(formulaire({ sessions: '3', duree: '45', heure: '17:30' })))
      .toEqual({ ok: false, champ: 'jours', erreur: 'Choisis au moins un jour.' });
  });
  it('refuse une heure après 21 h', () => {
    expect(lireReglages(formulaire({ sessions: '3', duree: '45', jours: ['1'], heure: '21:30' })))
      .toEqual({ ok: false, champ: 'heure', erreur: 'Choisis une heure de début entre 6 h et 21 h.' });
  });
  it('refuse une heure qui n’existe pas', () => {
    for (const heure of ['25:00', '12:60', '99:99']) {
      expect(lireReglages(formulaire({ sessions: '3', duree: '45', jours: ['1'], heure })))
        .toMatchObject({ ok: false, champ: 'heure' });
    }
  });
  it('répond en français à un jour falsifié', () => {
    for (const faux of ['0', '8', '1.5', 'abc']) {
      expect(lireReglages(formulaire({ sessions: '3', duree: '45', jours: [faux], heure: '17:30' })), faux)
        .toMatchObject({ ok: false, champ: 'jours', erreur: 'Choisis des jours entre lundi et dimanche.' });
    }
  });
  it('prépare les réglages pour la base', () => {
    expect(versReglagesRpc({ sessionsParSemaine: 2, dureeMinutes: 60, joursPreferes: [6, 7], heureDebut: '10:00' }))
      .toEqual({ sessions_par_semaine: 2, duree_minutes: 60, jours_preferes: [6, 7], heure_debut: '10:00' });
  });
});
