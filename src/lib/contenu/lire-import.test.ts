import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { analyserImport, formaterProbleme, TAILLE_MAX_IMPORT } from './lire-import';

const question = { source: 's:1', type: 'qcm_unique', enonce: 'Q ?', propositions: ['a', 'b'], bonnes_reponses: [0] };
const cours = (q: unknown) => ({ slug: 'c', filiere: 'ST2S', niveau: '1re', matiere: 'M', titre: 'T',
  chapitres: [{ slug: 'a', numero: 1, titre: 'A', sections: [], questions: [] }, { slug: 'b', numero: 2, titre: 'B', sections: [], questions: [q] }] });

describe('formaterProbleme', () => {
  it('numérote les chapitres et les questions à partir de 1', () => {
    expect(formaterProbleme({ path: ['chapitres', 2, 'questions', 11, 'enonce'], message: 'Trop court' })).toBe('Chapitre 3, question 12, énoncé : Trop court');
  });
  it('décrit une section', () => {
    expect(formaterProbleme({ path: ['chapitres', 0, 'sections', 1, 'id'], message: 'x' })).toBe('Chapitre 1, section 2, identifiant : x');
  });
  it('gère un champ du cours, un tableau et la racine', () => {
    expect(formaterProbleme({ path: ['couleur'], message: 'm' })).toBe('couleur : m');
    expect(formaterProbleme({ path: ['chapitres', 0, 'objectifs', 2], message: 'm' })).toBe('Chapitre 1, objectifs (n° 3) : m');
    expect(formaterProbleme({ path: [], message: 'm' })).toBe('Fichier : m');
  });
});

describe('analyserImport', () => {
  it('refuse un JSON mal formé sans lever', () => {
    expect(analyserImport('{ pas du json')).toEqual({ erreurs: [expect.stringContaining('pas du JSON valide')] });
  });
  it('refuse autre chose qu’un objet', () => {
    expect(analyserImport('[1]')).toHaveProperty('erreurs');
    expect(analyserImport('null')).toHaveProperty('erreurs');
  });
  it('refuse un texte trop gros avant de le lire', () => {
    const r = analyserImport(' '.repeat(TAILLE_MAX_IMPORT + 1));
    expect(r).toEqual({ erreurs: ['Le fichier dépasse la limite de 3 Mo.'] });
  });
  it('compte les octets, pas les caractères', () => {
    expect(analyserImport('é'.repeat(TAILLE_MAX_IMPORT / 2 + 1))).toEqual({ erreurs: ['Le fichier dépasse la limite de 3 Mo.'] });
  });
  it('donne un chemin lisible et un message en français', () => {
    const r = analyserImport(JSON.stringify(cours({ ...question, enonce: '' })));
    expect(r).toHaveProperty('erreurs');
    const e = (r as { erreurs: string[] }).erreurs;
    expect(e[0]).toMatch(/^Chapitre 2, question 1, énoncé : /);
    expect(e.join(' ')).not.toMatch(/Too small|Invalid input/);
    expect(e[0]).toBe('Chapitre 2, question 1, énoncé : Ce champ ne peut pas être vide.');
  });
  it('traduit une erreur de type', () => {
    const r = analyserImport(JSON.stringify({ ...cours(question), titre: 12 })) as { erreurs: string[] };
    expect(r.erreurs[0]).toMatch(/^titre : /);
    expect(r.erreurs[0]).not.toMatch(/Invalid/);
  });
  it('ne change pas la langue des autres schémas zod (pas de configuration globale)', () => {
    expect(z.string().safeParse(1).error?.issues[0].message).toMatch(/^Invalid input/);
  });
  it('garde une marge sous la limite des actions serveur (4 Mo, enveloppe comprise)', () => {
    expect(TAILLE_MAX_IMPORT).toBe(3 * 1024 * 1024);
  });
  it('accepte le cours BPH', () => {
    const r = analyserImport(readFileSync('contenu/1re-st2s/bph.json', 'utf8'));
    expect(r).toHaveProperty('cours');
  });
});
