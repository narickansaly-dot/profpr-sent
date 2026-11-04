import { describe, expect, it } from 'vitest';
import { lireFormulaireOnboarding } from './onboarding';

function formulaire(champs: Record<string, string>) {
  const f = new FormData();
  Object.entries(champs).forEach(([k, v]) => f.set(k, v));
  return f;
}

describe('lireFormulaireOnboarding', () => {
  const filiereId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

  it('lit un formulaire complet', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: ' Léa ', filiereId, niveau: '1re', moinsDe15Ans: 'on' }));
    expect(r.success && r.data).toEqual({ nom: 'Léa', filiereId, niveau: '1re', moinsDe15Ans: true });
  });
  it('considère une case non cochée comme « non »', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: 'Léa', filiereId, niveau: 'Tle' }));
    expect(r.success && r.data.moinsDe15Ans).toBe(false);
  });
  it('exige une filière', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: 'Léa', filiereId: '', niveau: '1re' }));
    expect(r.error?.issues[0].message).toBe('Choisis ta filière.');
  });
  it('refuse un niveau inconnu', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: 'Léa', filiereId, niveau: '3e' }));
    expect(r.error?.issues[0].message).toBe('Choisis ton niveau.');
  });
  it('refuse un prénom d’une seule lettre', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: 'L', filiereId, niveau: '1re' }));
    expect(r.error?.issues[0].message).toBe('Indique ton prénom.');
  });
  it('refuse un prénom de plus de 60 caractères', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: 'L'.repeat(61), filiereId, niveau: '1re' }));
    expect(r.error?.issues[0].message).toBe('Ton prénom est trop long.');
  });
});
