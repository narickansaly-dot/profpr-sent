import { describe, expect, it } from 'vitest';
import { lireSaisieQuestion, type SaisieQuestion } from './schema-question-editeur';

const base: SaisieQuestion = {
  type: 'qcm_unique', enonce: 'Quelle est la charge du sodium ?',
  propositions: [{ texte: 'Na+', bonne: true }, { texte: 'Cl-', bonne: false }],
  vraiFaux: '', acceptees: '', marge: '', margeRelative: false, notion: '', difficulte: '2', explication: '',
};

const champ = (r: ReturnType<typeof lireSaisieQuestion>) => ('champ' in r ? r.champ : undefined);

describe('lireSaisieQuestion', () => {
  it('accepte un QCM valide sans source', () => {
    const r = lireSaisieQuestion(base);
    expect('question' in r && r.question.type).toBe('qcm_unique');
  });
  it('signale une proposition vide', () => {
    const r = lireSaisieQuestion({ ...base, propositions: [{ texte: 'A', bonne: true }, { texte: ' ', bonne: false }] });
    expect(r).toEqual({ erreur: 'La proposition 2 est vide ou trop longue (500 caractères au maximum).', champ: 'proposition-1' });
  });
  it('demande une bonne réponse', () => {
    const r = lireSaisieQuestion({ ...base, propositions: base.propositions.map((p) => ({ ...p, bonne: false })) });
    expect(r).toEqual({ erreur: 'Choisis la bonne réponse.', champ: 'bonne-0' });
  });
  it('refuse deux bonnes réponses pour un QCM unique', () => {
    const r = lireSaisieQuestion({ ...base, propositions: base.propositions.map((p) => ({ ...p, bonne: true })) });
    expect(champ(r)).toBe('bonne-0');
  });
  it('exige vrai ou faux', () => {
    expect(lireSaisieQuestion({ ...base, type: 'vrai_faux' })).toEqual({ erreur: 'Indique si l’affirmation est vraie ou fausse.', champ: 'vrai' });
  });
  it('lit une réponse courte avec marge à virgule', () => {
    const r = lireSaisieQuestion({ ...base, type: 'reponse_courte', acceptees: 'Na+\n\n sodium ', marge: '0,5' });
    expect('question' in r && r.question).toMatchObject({ reponses_acceptees: ['Na+', 'sodium'], marge: 0.5, marge_relative: false });
  });
  it('convertit une marge relative saisie en pourcentage', () => {
    const r = lireSaisieQuestion({ ...base, type: 'reponse_courte', acceptees: '100', marge: '5', margeRelative: true });
    expect('question' in r && r.question).toMatchObject({ marge: 0.05, marge_relative: true });
  });
  it('refuse une marge relative sans valeur et une marge illisible', () => {
    expect(champ(lireSaisieQuestion({ ...base, type: 'reponse_courte', acceptees: '1', margeRelative: true }))).toBe('marge');
    expect(champ(lireSaisieQuestion({ ...base, type: 'reponse_courte', acceptees: '1', marge: 'abc' }))).toBe('marge');
  });
  it('plafonne la marge', () => {
    expect(champ(lireSaisieQuestion({ ...base, type: 'reponse_courte', acceptees: '1', marge: '500', margeRelative: true }))).toBe('marge');
    expect(champ(lireSaisieQuestion({ ...base, type: 'reponse_courte', acceptees: '1', marge: '2000000' }))).toBe('marge');
    expect('question' in lireSaisieQuestion({ ...base, type: 'reponse_courte', acceptees: '1', marge: '100', margeRelative: true })).toBe(true);
  });
  it('exige une réponse acceptée', () => {
    expect(champ(lireSaisieQuestion({ ...base, type: 'reponse_courte', acceptees: '  \n' }))).toBe('acceptees');
  });
});
