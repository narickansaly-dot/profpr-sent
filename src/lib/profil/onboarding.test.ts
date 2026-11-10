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
    const r = lireFormulaireOnboarding(formulaire({ profil: 'eleve', nom: ' Léa ', filiereId, niveau: '1re', moinsDe15Ans: 'on' }));
    expect(r.success && r.data).toEqual({ profil: 'eleve', nom: 'Léa', filiereId, niveau: '1re', moinsDe15Ans: true });
  });
  it('vouvoie le parent qui oublie son prénom ou le saisit mal', () => {
    expect(lireFormulaireOnboarding(formulaire({ profil: 'parent', nom: ' ' })).error?.issues[0].message).toBe('Indiquez votre prénom.');
    expect(lireFormulaireOnboarding(formulaire({ profil: 'parent', nom: 'a'.repeat(61) })).error?.issues[0].message).toBe('Votre prénom est trop long.');
    expect(lireFormulaireOnboarding(formulaire({ profil: 'parent', nom: 'Lé\u202Ea' })).error?.issues[0].message).toBe('Votre prénom contient des caractères non autorisés.');
    expect(lireFormulaireOnboarding(formulaire({ profil: 'enseignant', nom: ' ', etablissement: 'Lycée' })).error?.issues[0].message).toBe('Indique ton prénom.');
  });
  it('refuse un prénom avec caractère de contrôle ou bidi, comme la base', () => {
    for (const nom of ['Lé\u202Ea', 'Lé\na', 'Lé\u2066a']) {
      const r = lireFormulaireOnboarding(formulaire({ nom, filiereId, niveau: '1re' }));
      expect(r.error?.issues[0].message).toBe('Ton prénom contient des caractères non autorisés.');
    }
  });
  it('limite le prénom à 60 caractères, comme la base', () => {
    expect(lireFormulaireOnboarding(formulaire({ nom: 'a'.repeat(60), filiereId, niveau: '1re' })).success).toBe(true);
    const r = lireFormulaireOnboarding(formulaire({ nom: 'a'.repeat(61), filiereId, niveau: '1re' }));
    expect(r.error?.issues[0].message).toBe('Ton prénom est trop long.');
  });
  it('compte le prénom en caractères, pas en unités UTF-16', () => {
    expect(lireFormulaireOnboarding(formulaire({ nom: '😀', filiereId, niveau: '1re' })).error?.issues[0].message).toBe('Indique ton prénom.');
    expect(lireFormulaireOnboarding(formulaire({ nom: '😀😀', filiereId, niveau: '1re' })).success).toBe(true);
    expect(lireFormulaireOnboarding(formulaire({ nom: '😀'.repeat(60), filiereId, niveau: '1re' })).success).toBe(true);
  });
  it('lit un formulaire sans profil comme un profil élève', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: 'Léa', filiereId, niveau: '1re' }));
    expect(r.success && r.data.profil).toBe('eleve');
  });
  it('lit un profil enseignant sans filière ni niveau', () => {
    const r = lireFormulaireOnboarding(formulaire({ profil: 'enseignant', nom: 'Camille', etablissement: 'Lycée Pasteur' }));
    expect(r.success && r.data).toEqual({ profil: 'enseignant', nom: 'Camille', etablissement: 'Lycée Pasteur' });
  });
  it('exige l’établissement d’un profil enseignant', () => {
    const r = lireFormulaireOnboarding(formulaire({ profil: 'enseignant', nom: 'Camille', etablissement: '' }));
    expect(r.error?.issues[0].message).toBe('Indique ton établissement.');
  });
  it('considère une case non cochée comme « non »', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: 'Léa', filiereId, niveau: 'Tle' }));
    expect(r.success && r.data.profil === 'eleve' && r.data.moinsDe15Ans).toBe(false);
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
  it('lit un profil parent avec son seul prénom', () => {
    const r = lireFormulaireOnboarding(formulaire({ profil: 'parent', nom: 'Camille' }));
    expect(r.success && r.data).toEqual({ profil: 'parent', nom: 'Camille' });
  });
  it('exige le prénom d’un parent', () => {
    const r = lireFormulaireOnboarding(formulaire({ profil: 'parent', nom: '' }));
    expect(r.error?.issues[0].message).toBe('Indiquez votre prénom.');
  });
});
