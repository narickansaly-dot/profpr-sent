import { describe, expect, it } from 'vitest';
import { COURS_BANQUE, cheminBanque, coursDepuisChemin, lireCoursArgument, optionCours, quotasPour } from './cours';

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
    expect(() => lireCoursArgument(['3', '--cours'])).toThrow('--cours attend un nom (bph ou stss) ou le chemin d’un cours');
    expect(() => lireCoursArgument(['3', '--cours', 'svt'])).toThrow('cours inconnu : svt');
  });
  it('décrit les deux cours nommés', () => {
    expect(COURS_BANQUE.bph).toEqual({ nom: 'bph', fichier: 'contenu/1re-st2s/bph.json', banques: 'contenu/1re-st2s/banques', prefixe: 'bph', total: 130 });
    expect(COURS_BANQUE.stss).toEqual({ nom: 'stss', fichier: 'contenu/1re-st2s/stss.json', banques: 'contenu/1re-st2s/banques', prefixe: 'stss', total: 150 });
    expect(cheminBanque(COURS_BANQUE.stss, 4)).toBe('contenu/1re-st2s/banques/stss-ch4.json');
  });
  it('accepte le chemin d’un cours : préfixe et dossier des banques en découlent', () => {
    const svt = lireCoursArgument(['2', '--cours', 'contenu/1re-gen/svt.json']);
    expect(svt).toEqual({ nom: 'contenu/1re-gen/svt.json', fichier: 'contenu/1re-gen/svt.json', banques: 'contenu/1re-gen/banques', prefixe: 'svt', total: 150 });
    expect(cheminBanque(svt, 12)).toBe('contenu/1re-gen/banques/svt-ch12.json');
    expect(coursDepuisChemin('contenu/2de-gen/histoire-geo.json').prefixe).toBe('histoire-geo');
    expect(optionCours(svt)).toBe(' --cours contenu/1re-gen/svt.json');
    expect(optionCours(COURS_BANQUE.bph)).toBe('');
  });
  it('refuse un chemin qui n’est pas celui d’un cours', () => {
    for (const mauvais of ['contenu/1re-gen/svt', 'contenu/1re-gen/SVT.json', '../hors/svt.json', 'contenu/../svt.json', 'contenu/1re-gen/svt.json/']) {
      expect(() => coursDepuisChemin(mauvais)).toThrow('cours inconnu');
    }
  });
});
