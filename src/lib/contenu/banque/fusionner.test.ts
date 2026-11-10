import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { schemaCoursImport, type CoursImport, type QuestionImport } from '../format-import';
import type { FichierBanque } from './format';
import { fusionnerBanque, serialiserCours } from './fusionner';

const qcm = (source: string, enonce = 'Quel organe ?', statut: 'valide' | 'a_relire' = 'a_relire'): QuestionImport => ({
  source, enonce, type: 'qcm_unique', propositions: ['A', 'B'], bonnes_reponses: [0], difficulte: 2, explication: 'Parce que.', statut,
  notion: 'Foie',
} as QuestionImport);

function cours(): CoursImport {
  const chapitre = (numero: number) => ({
    slug: `ch${numero}`, numero, titre: `Chapitre ${numero}`, objectifs: [], sections: [], questions: [qcm(`bph:ch${numero}:quiz:0`, 'Existante ?', 'valide')],
  });
  return schemaCoursImport.parse({ slug: 'bph', filiere: 'ST2S', niveau: '1re', matiere: 'BPH', titre: 'BPH', chapitres: [chapitre(1), chapitre(2)] });
}

const fichier = (...questions: QuestionImport[]): FichierBanque => ({ chapitre: 1, notions: ['Foie'], questions });

describe('fusionnerBanque', () => {
  it('ajoute les questions au chapitre N, à relire, sans toucher au reste', () => {
    const avant = cours();
    const copie = JSON.stringify(avant);
    const apres = fusionnerBanque(avant, fichier(qcm('bph:ch1:banque:001', 'Nouvelle ?', 'valide')));
    expect(apres.chapitres[0].questions.map((q) => q.source)).toEqual(['bph:ch1:quiz:0', 'bph:ch1:banque:001']);
    expect(apres.chapitres[0].questions[1].statut).toBe('a_relire');
    expect(apres.chapitres[0].questions[0]).toEqual(avant.chapitres[0].questions[0]);
    expect(apres.chapitres[1]).toEqual(avant.chapitres[1]);
    expect(JSON.stringify(avant)).toBe(copie);
  });

  it('ignore une source déjà présente au contenu identique (fusion rejouable)', () => {
    const f = fichier(qcm('bph:ch1:banque:001'), qcm('bph:ch1:banque:002', 'Autre ?'));
    const une = fusionnerBanque(cours(), f);
    const deux = fusionnerBanque(une, f);
    expect(deux).toEqual(une);
    expect(deux.chapitres[0].questions).toHaveLength(3);
  });

  it('refuse une source déjà présente au contenu différent', () => {
    const une = fusionnerBanque(cours(), fichier(qcm('bph:ch1:banque:004')));
    expect(() => fusionnerBanque(une, fichier(qcm('bph:ch1:banque:004', 'Énoncé modifié ?'))))
      .toThrow('source déjà présente avec un contenu différent : bph:ch1:banque:004');
  });

  it('refuse un chapitre inconnu', () => {
    expect(() => fusionnerBanque(cours(), { ...fichier(), chapitre: 9 })).toThrow('chapitre 9 absent du cours');
  });
});

describe('serialiserCours', () => {
  const chemin = 'contenu/1re-st2s/bph.json';
  it('rend bph.json à l\'octet près : 2 espaces, saut de ligne final, ordre des clés', () => {
    const texte = readFileSync(chemin, 'utf8');
    expect(serialiserCours(JSON.parse(texte))).toBe(texte);
  });
  it('une fusion sans question laisse bph.json inchangé', () => {
    const texte = readFileSync(chemin, 'utf8');
    expect(serialiserCours(fusionnerBanque(JSON.parse(texte), fichier()))).toBe(texte);
  });
});
