import { describe, expect, it } from 'vitest';
import { schemaCoursImport, schemaQuestionImport } from './format-import';
import { versDonneesCours, versDonneesQuestion } from './donnees-question';

const q = (o: object) => schemaQuestionImport.parse({ source: 'x:1', enonce: 'Q ?', ...o });

describe('versDonneesQuestion', () => {
  it('convertit un QCM', () => {
    expect(versDonneesQuestion(q({ type: 'qcm_unique', propositions: ['a', 'b'], bonnes_reponses: [1], notion: 'N' }))).toEqual({
      source: 'x:1', type: 'qcm_unique', enonce: 'Q ?', notion: 'N', difficulte: 2, statut: 'a_relire', explication: '',
      propositions: ['a', 'b'], bonnes_reponses: [1], reponses_acceptees: [], marge: null, marge_relative: false,
    });
  });
  it('convertit un QCM multiple', () => {
    const r = versDonneesQuestion(q({ type: 'qcm_multiple', propositions: ['a', 'b', 'c'], bonnes_reponses: [0, 2] }));
    expect(r).toMatchObject({ propositions: ['a', 'b', 'c'], bonnes_reponses: [0, 2], notion: null });
  });
  it('convertit un vrai/faux', () => {
    expect(versDonneesQuestion(q({ type: 'vrai_faux', bonne_reponse: false }))).toMatchObject({
      propositions: [], bonnes_reponses: [false], reponses_acceptees: [], marge: null,
    });
  });
  it('convertit une réponse courte', () => {
    expect(versDonneesQuestion(q({ type: 'reponse_courte', reponses_acceptees: ['70'], marge: 0.1, marge_relative: true }))).toMatchObject({
      propositions: [], bonnes_reponses: [], reponses_acceptees: ['70'], marge: 0.1, marge_relative: true,
    });
    expect(versDonneesQuestion(q({ type: 'reponse_courte', reponses_acceptees: ['FC'] })).marge).toBeNull();
  });
});

describe('versDonneesCours', () => {
  const cours = schemaCoursImport.parse({
    slug: 'c', filiere: 'st2s', niveau: '1re', matiere: 'BPH', titre: 'T', couleur: '#0F766E',
    chapitres: [{
      slug: 'ch', numero: 1, titre: 'Ch',
      sections: [{ id: 's-1', titre: 'S', html: '<p>ok</p><script>alert(1)</script>' }],
      a_retenir: '<p>x</p><script>y</script>',
      questions: [{ source: 'x:1', type: 'vrai_faux', enonce: 'Q', bonne_reponse: true }],
    }],
  });
  it('nettoie le HTML, met la couleur en minuscules et remplit les valeurs absentes', () => {
    const r = versDonneesCours(cours);
    expect(r.couleur).toBe('#0f766e');
    expect(r.chapitres[0].sections[0].html).not.toContain('script');
    expect(r.chapitres[0].sections[0].html).toContain('<p>ok</p>');
    expect(r.chapitres[0].a_retenir).not.toContain('script');
    expect(r.chapitres[0]).toMatchObject({ titre_court: '', duree: '', resume: '', chapeau: '', objectifs: [] });
    expect(r.chapitres[0].questions).toHaveLength(1);
  });
});

describe('versDonneesCours avec garderStatuts', () => {
  const coursMinimal = schemaCoursImport.parse({
    slug: 'exemple', filiere: 'ST2S', niveau: '1re', matiere: 'Exemple', titre: 'Exemple', couleur: '#112233',
    chapitres: [{ slug: 'ch1', numero: 1, titre: 'Chapitre', sections: [],
      questions: [{ source: 'x:1', enonce: 'Q ?', type: 'vrai_faux', bonne_reponse: true }] }],
  });
  it('ajoute garder_statut aux questions seulement si demandé', () => {
    const sans = versDonneesCours(coursMinimal);
    const avec = versDonneesCours(coursMinimal, { garderStatuts: true });
    expect(sans.chapitres[0].questions[0]).not.toHaveProperty('garder_statut');
    expect(avec.chapitres[0].questions[0]).toMatchObject({ garder_statut: true });
  });
});
