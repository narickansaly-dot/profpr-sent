import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MESSAGE_COULEUR, schemaCoursImport, schemaQuestionImport } from './format-import';

describe('schemaQuestionImport', () => {
  it('accepte un QCM à une réponse et met les valeurs par défaut', () => {
    const r = schemaQuestionImport.parse({
      source: 'x:1', type: 'qcm_unique', enonce: 'Q ?', propositions: ['a', 'b'], bonnes_reponses: [1],
    });
    expect(r).toMatchObject({ difficulte: 2, statut: 'a_relire', explication: '' });
  });
  it('refuse un QCM à une réponse avec deux bonnes réponses', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:1', type: 'qcm_unique', enonce: 'Q ?', propositions: ['a', 'b'], bonnes_reponses: [0, 1],
    }).success).toBe(false);
  });
  it('refuse un indice de bonne réponse hors des propositions', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:1', type: 'qcm_multiple', enonce: 'Q ?', propositions: ['a', 'b'], bonnes_reponses: [2],
    }).success).toBe(false);
  });
  it('refuse une bonne réponse en double dans un QCM à plusieurs réponses', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:4', type: 'qcm_multiple', enonce: 'Q ?', propositions: ['a', 'b', 'c'], bonnes_reponses: [0, 0],
    }).success).toBe(false);
  });
  it('refuse une marge relative sans marge', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:5', type: 'reponse_courte', enonce: 'Q', reponses_acceptees: ['70'], marge_relative: true,
    }).success).toBe(false);
  });
  it('accepte une marge relative avec une marge', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:6', type: 'reponse_courte', enonce: 'Q', reponses_acceptees: ['70'], marge: 0.1, marge_relative: true,
    }).success).toBe(true);
  });
  it('accepte vrai/faux et réponse courte', () => {
    expect(schemaQuestionImport.safeParse({ source: 'x:2', type: 'vrai_faux', enonce: 'Q', bonne_reponse: true }).success).toBe(true);
    expect(schemaQuestionImport.safeParse({
      source: 'x:3', type: 'reponse_courte', enonce: 'Q', reponses_acceptees: ['FC', 'fréquence cardiaque'],
    }).success).toBe(true);
  });
});

describe('schemaCoursImport', () => {
  it('refuse deux chapitres avec le même slug', () => {
    const chapitre = { slug: 'ch1', numero: 1, titre: 'T', sections: [], questions: [] };
    expect(schemaCoursImport.safeParse({
      slug: 'c', filiere: 'ST2S', niveau: '1re', matiere: 'BPH', titre: 'C', chapitres: [chapitre, chapitre],
    }).success).toBe(false);
  });
});

const chap = (o: object = {}) => ({ slug: 'ch1', numero: 1, titre: 'T', sections: [], questions: [], ...o });
const cours = (o: object = {}) => ({ slug: 'c', filiere: 'st2s', niveau: '1re', matiere: 'BPH', titre: 'C', chapitres: [chap()], ...o });
const qv = (source: string) => ({ source, type: 'vrai_faux', enonce: 'Q', bonne_reponse: true });

describe('renforcement du format', () => {
  it('refuse deux sections avec le même id dans un chapitre', () => {
    const s = { id: 'a', titre: 'S', html: '' };
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ sections: [s, s] })] })).success).toBe(false);
  });
  it('refuse un id de section mal formé', () => {
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ sections: [{ id: 'A b', titre: 'S', html: '' }] })] })).success).toBe(false);
  });
  it('refuse une source en double dans le fichier, même entre deux chapitres', () => {
    expect(schemaCoursImport.safeParse(cours({ chapitres: [
      chap({ questions: [qv('x:1')] }), chap({ slug: 'ch2', numero: 2, questions: [qv('x:1')] }),
    ] })).success).toBe(false);
  });
  it('refuse un QCM avec moins de 2 ou plus de 10 propositions, ou une proposition trop longue', () => {
    const base = { source: 'x:1', type: 'qcm_unique', enonce: 'Q', bonnes_reponses: [0] };
    expect(schemaQuestionImport.safeParse({ ...base, propositions: ['a'] }).success).toBe(false);
    expect(schemaQuestionImport.safeParse({ ...base, propositions: Array.from({ length: 11 }, (_, i) => `p${i}`) }).success).toBe(false);
    expect(schemaQuestionImport.safeParse({ ...base, propositions: Array.from({ length: 10 }, (_, i) => `p${i}`) }).success).toBe(true);
    expect(schemaQuestionImport.safeParse({ ...base, propositions: ['a', 'b'.repeat(501)] }).success).toBe(false);
  });
  it('refuse un énoncé de plus de 2000 caractères', () => {
    expect(schemaQuestionImport.safeParse({ ...qv('x:1'), enonce: 'a'.repeat(2001) }).success).toBe(false);
    expect(schemaQuestionImport.safeParse({ ...qv('x:1'), enonce: 'a'.repeat(2000) }).success).toBe(true);
  });
  it('met la couleur en minuscules', () => {
    expect(schemaCoursImport.parse(cours({ couleur: '#0F766E' })).couleur).toBe('#0f766e');
  });
  it('refuse une couleur trop claire avec le message prévu', () => {
    const r = schemaCoursImport.safeParse(cours({ couleur: '#ffff00' }));
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe(MESSAGE_COULEUR);
  });
  it('contenu/1re-st2s/bph.json est valide', () => {
    const brut = JSON.parse(readFileSync('contenu/1re-st2s/bph.json', 'utf8'));
    const r = schemaCoursImport.safeParse(brut);
    expect(r.error?.issues ?? []).toEqual([]);
  });
  it('refuse deux chapitres avec le même numéro', () => {
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap(), chap({ slug: 'ch2' })] })).error?.issues[0].message)
      .toBe('Deux chapitres ont le même numéro.');
  });
  it('signale les sections et sources en double par un message précis', () => {
    const s = { id: 'a', titre: 'S', html: '' };
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ sections: [s, s] })] })).error?.issues[0].message)
      .toBe('Deux sections ont le même identifiant.');
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ questions: [qv('x:1'), qv('x:1')] })] })).error?.issues[0].message)
      .toBe('Deux questions ont la même source.');
  });
  it('met #2563eb par défaut quand la couleur est omise', () => {
    expect(schemaCoursImport.parse(cours()).couleur).toBe('#2563eb');
  });
  it('donne une erreur de format, sans erreur de contraste, pour une couleur mal formée', () => {
    const messages = schemaCoursImport.safeParse(cours({ couleur: '#zz' })).error?.issues.map((i) => i.message) ?? [];
    expect(messages).toHaveLength(1);
    expect(messages[0]).not.toContain('trop claire');
  });
  it('refuse un énoncé ou une proposition faits d’espaces (la base les refuserait)', () => {
    expect(schemaQuestionImport.safeParse({ ...qv('x:1'), enonce: '   ' }).success).toBe(false);
    expect(schemaQuestionImport.safeParse({ source: 'x:1', type: 'qcm_unique', enonce: 'Q', propositions: ['a', '  '], bonnes_reponses: [0] }).success).toBe(false);
  });
  it('rogne les espaces autour de l’énoncé', () => {
    expect(schemaQuestionImport.parse({ ...qv('x:1'), enonce: '  Q ?  ' }).enonce).toBe('Q ?');
  });
  it('reprend les limites de la base', () => {
    expect(schemaCoursImport.safeParse(cours({ slug: 'a'.repeat(81) })).success).toBe(false);
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ resume: 'a'.repeat(1001) })] })).success).toBe(false);
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ a_retenir: 'a'.repeat(50001) })] })).success).toBe(false);
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({
      sections: Array.from({ length: 41 }, (_, i) => ({ id: `s${i}`, titre: 'S', html: '' })) })] })).success).toBe(false);
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ sections: [{ id: 'a', titre: 'S', html: 'a'.repeat(200001) }] })] })).success).toBe(false);
  });
  it('refuse un id de section qui commence par un chiffre ou qui reprend « a-retenir »', () => {
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ sections: [{ id: '1-intro', titre: 'S', html: '' }] })] })).success).toBe(false);
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ sections: [{ id: 'a-retenir', titre: 'S', html: '' }] })] })).success).toBe(false);
    expect(schemaCoursImport.safeParse(cours({ chapitres: [chap({ sections: [{ id: 'a'.repeat(65), titre: 'S', html: '' }] })] })).success).toBe(false);
  });
  it('limite les réponses acceptées comme la base (20 au plus, 200 caractères chacune)', () => {
    const rc = { source: 'x:1', type: 'reponse_courte', enonce: 'Q' };
    expect(schemaQuestionImport.safeParse({ ...rc, reponses_acceptees: Array(21).fill('a') }).success).toBe(false);
    expect(schemaQuestionImport.safeParse({ ...rc, reponses_acceptees: Array.from({ length: 20 }, (_, i) => `r${i}`) }).success).toBe(true);
    expect(schemaQuestionImport.safeParse({ ...rc, reponses_acceptees: ['a'.repeat(201)] }).success).toBe(false);
  });
  it('refuse deux propositions identiques après rognage', () => {
    const r = schemaQuestionImport.safeParse({ source: 'x:1', type: 'qcm_unique', enonce: 'Q', propositions: ['a', ' a '], bonnes_reponses: [0] });
    expect(r.error?.issues[0].message).toBe('Deux propositions sont identiques.');
  });
  it('refuse une réponse acceptée faite seulement de ponctuation (la base la réduirait à rien)', () => {
    const rc = { source: 'x:1', type: 'reponse_courte', enonce: 'Q' };
    for (const vide of ['…', '« »', '?!', '(', '...']) {
      expect(schemaQuestionImport.safeParse({ ...rc, reponses_acceptees: [vide] }).error?.issues[0].message)
        .toBe('Une réponse acceptée ne contient que de la ponctuation.');
    }
    for (const garde of ['Na+', 'Cl-', '70 %', ')(', '- -']) {
      expect(schemaQuestionImport.safeParse({ ...rc, reponses_acceptees: [garde] }).success).toBe(true);
    }
  });
  it('plafonne la marge comme l’éditeur (100 % en relatif, 1 000 000 en absolu)', () => {
    const rc = { source: 'x:1', type: 'reponse_courte', enonce: 'Q', reponses_acceptees: ['70'] };
    expect(schemaQuestionImport.safeParse({ ...rc, marge: 5, marge_relative: true }).success).toBe(false);
    expect(schemaQuestionImport.safeParse({ ...rc, marge: 1, marge_relative: true }).success).toBe(true);
    expect(schemaQuestionImport.safeParse({ ...rc, marge: 1_000_001 }).success).toBe(false);
  });
});
