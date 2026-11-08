import { describe, expect, it } from 'vitest';
import { lireFormulairePreferences, PREFERENCES_PAR_DEFAUT, versValeurs } from './preferences';

function formulaire(valeurs: Record<string, string | string[]>) {
  const f = new FormData();
  for (const [cle, v] of Object.entries(valeurs)) (Array.isArray(v) ? v : [v]).forEach((x) => f.append(cle, x));
  return f;
}

describe('lireFormulairePreferences', () => {
  it('lit les types cochés, le silence et les jours', () => {
    const r = lireFormulairePreferences(formulaire({
      types: ['rappel_evenement', 'nouvel_essai'], silence_debut: '21:30', silence_fin: '07:15', jours_inactivite: '5',
    }));
    expect(r).toEqual({
      ok: true,
      donnees: {
        rappel_evenement: true, echeance_proche: false, nouvel_essai: true, revision_du_jour: false, inactivite: false,
        silence_debut: '21:30', silence_fin: '07:15', jours_inactivite: 5,
      },
      valeurs: { types: ['rappel_evenement', 'nouvel_essai'], silence_debut: '21:30', silence_fin: '07:15', jours_inactivite: '5' },
    });
  });
  it('refuse une heure invalide, sur le bon champ', () => {
    const r = lireFormulairePreferences(formulaire({ silence_debut: '25:00', silence_fin: '07:00', jours_inactivite: '3' }));
    expect(r).toMatchObject({ ok: false, champ: 'silence_debut', erreur: 'Indique une heure valide, par exemple 22:00.' });
  });
  it('refuse une heure de fin invalide, avec son exemple', () => {
    const r = lireFormulairePreferences(formulaire({ silence_debut: '22:00', silence_fin: '7h', jours_inactivite: '3' }));
    expect(r).toMatchObject({ ok: false, champ: 'silence_fin', erreur: 'Indique une heure valide, par exemple 07:00.' });
  });
  it('refuse un nombre de jours hors de 1 à 14', () => {
    const r = lireFormulairePreferences(formulaire({ silence_debut: '22:00', silence_fin: '07:00', jours_inactivite: '30' }));
    expect(r).toMatchObject({ ok: false, champ: 'jours_inactivite', erreur: 'Choisis entre 1 et 14 jours.' });
  });
  it('ignore un type inconnu', () => {
    const r = lireFormulairePreferences(formulaire({ types: ['espion'], silence_debut: '22:00', silence_fin: '07:00', jours_inactivite: '3' }));
    expect(r.ok && Object.values(r.donnees).filter((v) => v === true)).toEqual([]);
  });
});

describe('versValeurs', () => {
  it('prépare le formulaire depuis les réglages lus en base', () => {
    expect(versValeurs({ ...PREFERENCES_PAR_DEFAUT, silence_debut: '22:00:00', inactivite: false })).toEqual({
      types: ['rappel_evenement', 'echeance_proche', 'nouvel_essai', 'revision_du_jour'],
      silence_debut: '22:00', silence_fin: '07:00', jours_inactivite: '3',
    });
  });
});
