import { describe, expect, it } from 'vitest';
import { lireFormulaireEvenement } from './schema-evenement';

const COURS = '20000000-0000-4000-8000-000000000001';
const CHAP = '30000000-0000-4000-8000-000000000001';

function formulaire(champs: Record<string, string | string[]>) {
  const f = new FormData();
  for (const [cle, valeur] of Object.entries(champs)) for (const v of [valeur].flat()) f.append(cle, v);
  return f;
}
const valide = { type: 'devoir', titre: ' Exposé ', jour: '2026-12-07', heure: '17:00', duree: '60', repetition: 'aucune' };

describe('lireFormulaireEvenement', () => {
  it('convertit l’heure de Paris en ISO UTC', () => {
    const r = lireFormulaireEvenement(formulaire(valide));
    expect(r).toMatchObject({ ok: true, donnees: {
      type: 'devoir', titre: 'Exposé', debut: '2026-12-07T16:00:00.000Z', duree_minutes: 60, cours_id: null, chapitres: [],
      repetition: 'aucune', jours_semaine: null, repeter_jusqu_au: null,
    } });
  });
  it('garde les jours et la date de fin d’une répétition', () => {
    const r = lireFormulaireEvenement(formulaire({ ...valide, repetition: 'jours', jours: ['1', '3'], jusqu: '2027-01-31' }));
    expect(r).toMatchObject({ ok: true, donnees: { repetition: 'jours', jours_semaine: [1, 3], repeter_jusqu_au: '2027-01-31' } });
  });
  it('refuse une répétition sans jour choisi', () => {
    expect(lireFormulaireEvenement(formulaire({ ...valide, repetition: 'jours', jusqu: '2027-01-31' })))
      .toMatchObject({ ok: false, champ: 'jours', erreur: 'Choisis au moins un jour.' });
  });
  it('refuse une date de fin avant le début', () => {
    expect(lireFormulaireEvenement(formulaire({ ...valide, repetition: 'quotidienne', jusqu: '2026-12-01' })))
      .toMatchObject({ ok: false, champ: 'jusqu', erreur: 'La répétition doit finir après le début, dans l’année qui suit.' });
  });
  it('refuse des chapitres sans cours', () => {
    expect(lireFormulaireEvenement(formulaire({ ...valide, chapitres: [CHAP] })))
      .toMatchObject({ ok: false, champ: 'cours', erreur: 'Choisis d’abord le cours de ces chapitres.' });
  });
  it('refuse une heure invalide et renvoie la saisie', () => {
    const r = lireFormulaireEvenement(formulaire({ ...valide, heure: '25:00', cours: COURS }));
    expect(r).toMatchObject({ ok: false, champ: 'heure', valeurs: { titre: ' Exposé ', cours: COURS } });
  });
  it('lit le rappel choisi', () => {
    const r = lireFormulaireEvenement(formulaire({ ...valide, rappel: '60' }));
    expect(r.ok && r.rappel).toBe(60);
  });
  it('sans rappel, renvoie null', () => {
    const r = lireFormulaireEvenement(formulaire(valide));
    expect(r.ok && r.rappel).toBeNull();
  });
  it('refuse un rappel hors liste', () => {
    expect(lireFormulaireEvenement(formulaire({ ...valide, rappel: '30' })))
      .toMatchObject({ ok: false, champ: 'rappel', erreur: 'Choisis un rappel dans la liste.' });
  });
  it('refuse un titre vide', () => {
    expect(lireFormulaireEvenement(formulaire({ ...valide, titre: '  ' })))
      .toMatchObject({ ok: false, champ: 'titre', erreur: 'Donne un titre à l’événement.' });
  });
});
