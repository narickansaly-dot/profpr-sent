import { describe, expect, it } from 'vitest';
import { COURS_BANQUE, lireCoursArgument, quotasPour } from './cours';

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
    expect(() => lireCoursArgument(['3', '--cours'])).toThrow('--cours attend un nom : bph ou stss');
    expect(() => lireCoursArgument(['3', '--cours', 'svt'])).toThrow('cours inconnu : svt (attendu bph ou stss)');
  });
  it('décrit les deux cours', () => {
    expect(COURS_BANQUE.bph).toEqual({ nom: 'bph', fichier: 'contenu/1re-st2s/bph.json', prefixe: 'bph', total: 130 });
    expect(COURS_BANQUE.stss).toEqual({ nom: 'stss', fichier: 'contenu/1re-st2s/stss.json', prefixe: 'stss', total: 150 });
  });
});
