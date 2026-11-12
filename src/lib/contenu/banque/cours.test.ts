import { describe, expect, it } from 'vitest';
import { COURS_BANQUE, cheminBanque, configPourChemin, lireCoursArgument, optionCours, quotasPour } from './cours';

describe('configuration des cours', () => {
  it('garde les quotas de BPH pour 130 questions', () => {
    expect(quotasPour(130)).toEqual({
      types: { qcm_unique: 65, qcm_multiple: 26, vrai_faux: 26, reponse_courte: 13 },
      difficultes: { 1: 52, 2: 52, 3: 26 },
    });
  });
  it('met les quotas à l’échelle pour 150 questions', () => {
    expect(quotasPour(150)).toEqual({
      types: { qcm_unique: 75, qcm_multiple: 30, vrai_faux: 30, reponse_courte: 15 },
      difficultes: { 1: 60, 2: 60, 3: 30 },
    });
  });
  it('lit --cours, bph par défaut', () => {
    expect(lireCoursArgument(['3'])).toBe(COURS_BANQUE.bph);
    expect(lireCoursArgument(['3', '--cours', 'stss'])).toBe(COURS_BANQUE.stss);
    expect(() => lireCoursArgument(['3', '--cours'])).toThrow('--cours attend un nom (bph, stss) ou un chemin (1re-gen/espagnol)');
    expect(() => lireCoursArgument(['3', '--cours', '--autre'])).toThrow('--cours attend un nom');
    expect(() => lireCoursArgument(['3', '--cours', 'svt'])).toThrow('cours inconnu : svt (attendu bph, stss ou un chemin comme 1re-gen/espagnol)');
  });
  it('accepte un cours désigné par son chemin', () => {
    const attendu = { nom: '1re-gen/espagnol', fichier: 'contenu/1re-gen/espagnol.json', banques: 'contenu/1re-gen/banques', prefixe: 'espagnol', total: 150 };
    expect(lireCoursArgument(['3', '--cours', '1re-gen/espagnol'])).toEqual(attendu);
    expect(configPourChemin('contenu/1re-gen/espagnol.json')).toEqual(attendu);
    expect(configPourChemin('./contenu/1re-gen/espagnol.json')).toEqual(attendu);
    expect(configPourChemin('2de-gen/svt').fichier).toBe('contenu/2de-gen/svt.json');
    expect(() => configPourChemin('../secret/x')).toThrow('cours inconnu');
    expect(() => configPourChemin('1re-gen/Espagnol')).toThrow('cours inconnu');
  });
  it('donne le chemin du fichier de travail et l’option à répéter', () => {
    expect(cheminBanque(COURS_BANQUE.stss, 2)).toBe('contenu/1re-st2s/banques/stss-ch2.json');
    expect(cheminBanque(configPourChemin('1re-gen/espagnol'), 6)).toBe('contenu/1re-gen/banques/espagnol-ch6.json');
    expect(optionCours(COURS_BANQUE.bph)).toBe('');
    expect(optionCours(configPourChemin('1re-gen/espagnol'))).toBe(' --cours 1re-gen/espagnol');
  });
  it('décrit les deux cours', () => {
    expect(COURS_BANQUE.bph).toEqual({ nom: 'bph', fichier: 'contenu/1re-st2s/bph.json', banques: 'contenu/1re-st2s/banques', prefixe: 'bph', total: 130 });
    expect(COURS_BANQUE.stss).toEqual({ nom: 'stss', fichier: 'contenu/1re-st2s/stss.json', banques: 'contenu/1re-st2s/banques', prefixe: 'stss', total: 150 });
  });
});
