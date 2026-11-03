import { describe, expect, it } from 'vitest';
import { convertirBph, type ChapitreBph } from './convertir';
import { schemaCoursImport } from '../../src/lib/contenu/format-import';

const chapitre: ChapitreBph = {
  id: 'ch1', num: '1', short: 'Organisation', title: "Organisation générale de l'organisme humain",
  duree: '5 semaines', summary: 'Résumé', lead: 'Chapeau', objectifs: ['nommer les niveaux ;'],
  sections: [{ id: 'niveaux', titre: "Les niveaux d'organisation", html: '<p>Texte</p>' }],
  retenir: '<p>À retenir</p>',
  quiz: [{ q: 'Quel organite produit l’ATP ?', c: ['Ribosome', 'Mitochondrie'], a: 1, e: 'La mitochondrie.' }],
};

describe('convertirBph', () => {
  const cours = convertirBph([chapitre], { ch1: [{ q: 'Bis ?', c: ['x', 'y'], a: 0, e: 'Car.' }] });

  it('produit un cours valide pour le format d’import', () => {
    expect(schemaCoursImport.safeParse(cours).success).toBe(true);
  });
  it('reprend les champs du chapitre', () => {
    expect(cours.chapitres[0]).toMatchObject({
      slug: 'ch1', numero: 1, titre: "Organisation générale de l'organisme humain", titre_court: 'Organisation',
      resume: 'Résumé', chapeau: 'Chapeau', a_retenir: '<p>À retenir</p>',
    });
  });
  it('fusionne le quiz et la deuxième série, avec des sources stables et le statut validé', () => {
    expect(cours.chapitres[0].questions).toEqual([
      { source: 'bph:ch1:quiz:0', type: 'qcm_unique', enonce: 'Quel organite produit l’ATP ?',
        propositions: ['Ribosome', 'Mitochondrie'], bonnes_reponses: [1], explication: 'La mitochondrie.',
        difficulte: 2, statut: 'valide' },
      { source: 'bph:ch1:bis:0', type: 'qcm_unique', enonce: 'Bis ?', propositions: ['x', 'y'],
        bonnes_reponses: [0], explication: 'Car.', difficulte: 2, statut: 'valide' },
    ]);
  });
  it('trie les chapitres par numéro', () => {
    const c = convertirBph([{ ...chapitre, id: 'ch2', num: '2' }, chapitre], {});
    expect(c.chapitres.map((ch) => ch.slug)).toEqual(['ch1', 'ch2']);
  });
});
