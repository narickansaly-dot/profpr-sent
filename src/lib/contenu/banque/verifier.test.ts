import { describe, expect, it } from 'vitest';
import type { QuestionImport } from '../format-import';
import { fabriquer } from './fabrique';
import type { FichierBanque } from './format';
import {
  QUOTAS_DIFFICULTE, QUOTAS_TYPES, SEUIL_LONGUEUR, SEUIL_POSITION, SEUIL_SIMILARITE, SEUIL_VRAI_FAUX, TOLERANCE,
  similarite, verifierBanque,
} from './verifier';

type Q = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** n-ième question d'un type, modifiable : les tests altèrent une seule chose à la fois. */
function question(f: FichierBanque, type: string, n = 0): Q {
  return f.questions.filter((q) => q.type === type)[n] as Q;
}

describe('constantes', () => {
  it('portent les valeurs de la spec', () => {
    expect(TOLERANCE).toBe(3);
    expect(SEUIL_POSITION).toBe(0.4);
    expect(SEUIL_LONGUEUR).toBe(0.4);
    expect(SEUIL_SIMILARITE).toBe(0.8);
    expect(SEUIL_VRAI_FAUX).toBe(0.6);
    expect(QUOTAS_TYPES).toEqual({ qcm_unique: 65, qcm_multiple: 26, vrai_faux: 26, reponse_courte: 13 });
    expect(QUOTAS_DIFFICULTE).toEqual({ 1: 52, 2: 52, 3: 26 });
  });
});

describe('verifierBanque', () => {
  it('accepte un fichier valide', () => {
    expect(verifierBanque(fabriquer(), [])).toEqual([]);
  });

  it('1. signale une question refusée par le validateur d\'import', () => {
    const f = fabriquer();
    const q = question(f, 'qcm_multiple');
    q.bonnes_reponses = [0, 9];
    const erreurs = verifierBanque(f, []);
    expect(erreurs).toContain(`question ${q.source} : Une bonne réponse ne correspond à aucune proposition.`);
  });

  it('2. signale une source en double', () => {
    const f = fabriquer();
    f.questions[3].source = f.questions[2].source;
    expect(verifierBanque(f, [])).toContain('source en double : bph:ch1:banque:003');
  });

  it('3. signale une source hors format', () => {
    const f = fabriquer();
    f.questions[0].source = 'bph:ch1:quiz:1';
    expect(verifierBanque(f, [])).toContain('source invalide : bph:ch1:quiz:1 (attendu bph:ch1:banque:NNN)');
  });

  it('4. signale un numéro de chapitre de source différent du chapitre', () => {
    const f = fabriquer();
    f.questions[0].source = 'bph:ch2:banque:001';
    expect(verifierBanque(f, [])).toContain('source invalide : bph:ch2:banque:001 (attendu bph:ch1:banque:NNN)');
  });

  it('5. signale une répartition des types hors tolérance', () => {
    const f = fabriquer();
    for (const q of f.questions.filter((x) => x.type === 'vrai_faux').slice(0, 5)) {
      Object.assign(q, { type: 'qcm_unique', propositions: ['Choix A', 'Choix B', 'Choix C', 'Choix D'], bonnes_reponses: [2] });
    }
    expect(verifierBanque(f, [])).toContain('répartition des types : qcm_unique 70 (attendu 65 ± 3)');
  });

  it('6. signale une répartition des difficultés hors tolérance', () => {
    const f = fabriquer();
    for (const q of f.questions.filter((x) => x.difficulte === 2).slice(0, 4)) q.difficulte = 3;
    expect(verifierBanque(f, [])).toContain('répartition des difficultés : 3 → 30 (attendu 26 ± 3)');
  });

  it('7. signale une explication vide ou absente', () => {
    const f = fabriquer();
    f.questions[9].explication = '  ';
    delete (f.questions[10] as Q).explication;
    const erreurs = verifierBanque(f, []);
    expect(erreurs).toContain('explication manquante : bph:ch1:banque:010');
    expect(erreurs).toContain('explication manquante : bph:ch1:banque:011');
  });

  it('8. signale une notion hors liste', () => {
    const f = fabriquer();
    f.questions[10].notion = 'Foie';
    expect(verifierBanque(f, [])).toContain('notion inconnue « Foie » : bph:ch1:banque:011');
  });

  it('9. signale une notion absente', () => {
    const f = fabriquer();
    delete f.questions[11].notion;
    expect(verifierBanque(f, [])).toContain('notion manquante : bph:ch1:banque:012');
  });

  it('10. signale une proposition interdite, sans égard à la casse ni aux accents', () => {
    const f = fabriquer();
    question(f, 'qcm_unique', 0).propositions[3] = 'TOUTES LES REPONSES CI-DESSUS';
    question(f, 'qcm_unique', 1).propositions[3] = 'Aucune des réponses';
    const erreurs = verifierBanque(f, []);
    expect(erreurs).toContain(`proposition interdite : ${question(f, 'qcm_unique', 0).source}`);
    expect(erreurs).toContain(`proposition interdite : ${question(f, 'qcm_unique', 1).source}`);
  });

  it('11. signale un qcm_multiple avec 1 ou 4 bonnes réponses', () => {
    const f = fabriquer();
    question(f, 'qcm_multiple', 0).bonnes_reponses = [0];
    question(f, 'qcm_multiple', 1).bonnes_reponses = [0, 1, 2, 3];
    const erreurs = verifierBanque(f, []);
    expect(erreurs).toContain(`qcm_multiple avec 1 bonne réponse (attendu 2 ou 3) : ${question(f, 'qcm_multiple', 0).source}`);
    expect(erreurs).toContain(`qcm_multiple avec 4 bonnes réponses (attendu 2 ou 3) : ${question(f, 'qcm_multiple', 1).source}`);
  });

  it('12. signale un qcm_multiple sans la mention', () => {
    const f = fabriquer();
    const q = question(f, 'qcm_multiple');
    q.enonce = 'Que sait-on du foie ?';
    expect(verifierBanque(f, [])).toContain(`mention « Coche toutes les réponses exactes. » absente : ${q.source}`);
  });

  it('13. signale un biais de position', () => {
    const f = fabriquer();
    question(f, 'qcm_unique', 0); // 65 QCM : 29 en position 0, les autres réparties sur 1, 2, 3
    f.questions.filter((q) => q.type === 'qcm_unique').forEach((q, k) => { (q as Q).bonnes_reponses = [k < 29 ? 0 : 1 + (k % 3)]; });
    expect(verifierBanque(f, [])).toContain('biais de position : la position 1 porte 45 % des bonnes réponses (40 % au plus)');
  });

  it('14. signale un biais de longueur', () => {
    const f = fabriquer();
    f.questions.filter((q) => q.type === 'qcm_unique').slice(0, 27).forEach((q) => {
      const p = (q as Q).propositions as string[];
      p[(q as Q).bonnes_reponses[0]] += ' et plus encore';
    });
    expect(verifierBanque(f, [])).toContain('biais de longueur : la bonne réponse est la plus longue dans 42 % des QCM (moins de 40 %)');
  });

  it('15. signale deux énoncés presque identiques, entre eux ou avec une existante', () => {
    const f = fabriquer();
    f.questions[20].enonce = f.questions[19].enonce;
    f.questions[30].enonce = `${f.questions[40].enonce}`;
    const existante = { ...(f.questions[50] as Q), source: 'bph:ch1:quiz:3', enonce: f.questions[50].enonce.replace('Que', 'Quoi') } as QuestionImport;
    f.questions[50].enonce = 'Quel organe produit la bile, et par où passe-t-elle ?';
    existante.enonce = 'Quel organe produit la bile et par où passe t-elle ?';
    const erreurs = verifierBanque(f, [existante]);
    expect(erreurs.some((e) => /^énoncés trop proches \(1,00\) : bph:ch1:banque:020 et bph:ch1:banque:021$/.test(e))).toBe(true);
    expect(erreurs.some((e) => /^énoncés trop proches \(\d,\d\d\) : bph:ch1:banque:051 et bph:ch1:quiz:3$/.test(e))).toBe(true);
  });

  it('15 bis. ignore l\'existante qui porte la même source (fusion déjà faite)', () => {
    const f = fabriquer();
    expect(verifierBanque(f, f.questions)).toEqual([]);
  });

  it('16. signale un vrai/faux déséquilibré', () => {
    const f = fabriquer();
    f.questions.filter((q) => q.type === 'vrai_faux').forEach((q, k) => { (q as Q).bonne_reponse = k < 20; });
    expect(verifierBanque(f, [])).toContain('vrai/faux déséquilibrés : 20 vrais sur 26 (60 % au plus)');
    f.questions.filter((q) => q.type === 'vrai_faux').forEach((q, k) => { (q as Q).bonne_reponse = k >= 20; });
    expect(verifierBanque(f, [])).toContain('vrai/faux déséquilibrés : 20 faux sur 26 (60 % au plus)');
  });

  it('17. signale une espace normale avant « : ; ! ? »', () => {
    const f = fabriquer();
    f.questions[15].enonce = 'Que sait-on du foie ?';
    f.questions[16].explication = 'Voici : une règle.';
    question(f, 'qcm_unique', 5).propositions[0] = 'Vrai ; faux';
    const erreurs = verifierBanque(f, []);
    expect(erreurs).toContain('espace insécable manquante : bph:ch1:banque:016');
    expect(erreurs).toContain('espace insécable manquante : bph:ch1:banque:017');
    expect(erreurs).toContain(`espace insécable manquante : ${question(f, 'qcm_unique', 5).source}`);
  });
});

describe('similarite', () => {
  it('vaut 1 pour deux énoncés identiques', () => {
    expect(similarite('Quel organe produit la bile ?', 'Quel organe produit la bile ?')).toBe(1);
  });
  it('est faible pour deux énoncés sans rapport', () => {
    expect(similarite('Quel organe produit la bile ?', 'Combien de semaines dure la gestation chez la femme ?')).toBeLessThan(0.3);
  });
  it('ignore les accents, la casse et la ponctuation', () => {
    expect(similarite('Quel organe produit la bile ?', 'quel ORGANE produit la bilé')).toBe(1);
    expect(similarite('Où est le foie ?', 'Ou est le foie')).toBe(1);
  });
});
