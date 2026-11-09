import { describe, expect, it } from 'vitest';
import { schemaCoursImport, type CoursImport } from '../format-import';
import { harmoniserTypoAnciennes, insecable } from './typo-anciennes';

const NB = ' ';

function cours(): CoursImport {
  const q = (source: string, enonce: string, explication: string) => ({
    source, enonce, type: 'qcm_unique', propositions: ['Vrai : oui ?', 'Faux'], bonnes_reponses: [0], difficulte: 2, explication, statut: 'valide', notion: 'Foie',
  });
  return schemaCoursImport.parse({
    slug: 'bph', filiere: 'ST2S', niveau: '1re', matiere: 'BPH', titre: 'BPH',
    chapitres: [{ slug: 'ch1', numero: 1, titre: 'C1', objectifs: [], sections: [], questions: [
      q('bph:ch1:quiz:0', 'Quel organe ?', 'Voilà : le foie ; bravo !'),
      q('bph:ch1:bis:1', 'Déjà bon.', 'Rien'),
      q('bph:ch1:banque:001', 'Nouvelle ?', 'Garde : tout !'),
    ] }],
  });
}

describe('harmoniserTypoAnciennes', () => {
  it('remplace uniquement U+0020 avant ? : ; !', () => {
    expect(insecable('a ? b : c ; d ! e f')).toBe(`a${NB}? b${NB}: c${NB}; d${NB}! e f`);
    expect(insecable('a  ?')).toBe(`a ${NB}?`);
  });

  it('ne touche que enonce et explication des sources quiz/bis', () => {
    const avant = cours();
    const copie = JSON.stringify(avant);
    const { cours: apres, modifiees } = harmoniserTypoAnciennes(avant);
    const [q0, q1, q2] = apres.chapitres[0].questions;
    expect(modifiees).toBe(1);
    expect(q0.enonce).toBe(`Quel organe${NB}?`);
    expect(q0.explication).toBe(`Voilà${NB}: le foie${NB}; bravo${NB}!`);
    expect('propositions' in q0 && q0.propositions).toEqual(['Vrai : oui ?', 'Faux']);
    expect(q1).toEqual(avant.chapitres[0].questions[1]);
    expect(q2).toEqual(avant.chapitres[0].questions[2]);
    expect(JSON.stringify(avant)).toBe(copie);
  });

  it('est idempotente', () => {
    const une = harmoniserTypoAnciennes(cours());
    const deux = harmoniserTypoAnciennes(une.cours);
    expect(deux.modifiees).toBe(0);
    expect(deux.cours).toEqual(une.cours);
  });
});
