import { describe, expect, it } from 'vitest';
import { notesEnCsv, slugFichier } from './csv';

describe('notesEnCsv', () => {
  const entree = {
    chapitres: [{ id: 'c1', numero: 1, titre: 'Organisation' }, { id: 'c2', numero: 2, titre: 'Le « cœur »; ses rôles' }],
    eleves: [
      { id: 'e1', nom: 'Alix', notes: { c1: 80, c2: null }, evaluation: 75.5 },
      { id: 'e2', nom: 'Sam "le grand"', notes: { c1: 66.67, c2: 90 }, evaluation: null },
    ],
  };
  it('écrit un CSV au point-virgule, avec BOM, virgule décimale et champs échappés', () => {
    expect(notesEnCsv(entree)).toBe(
      '﻿Élève;Ch. 1 – Organisation;"Ch. 2 – Le « cœur »; ses rôles";Évaluation\r\n'
      + 'Alix;80;;75,5\r\n'
      + '"Sam ""le grand""";66,67;90;\r\n',
    );
  });
  it('neutralise les formules dans les noms', () => {
    const csv = notesEnCsv({ chapitres: [], eleves: [{ id: 'x', nom: '=HYPERLINK("x")', notes: {}, evaluation: null }] });
    expect(csv.split('\r\n')[1]).toBe('"\'=HYPERLINK(""x"")";');
  });
});

describe('slugFichier', () => {
  it('retire accents, majuscules et caractères spéciaux', () => {
    expect(slugFichier('Classe 1re ST2S B')).toBe('classe-1re-st2s-b');
    expect(slugFichier('Biologie et physiopathologie humaines — 1re')).toBe('biologie-et-physiopathologie-humaines-1re');
    expect(slugFichier('///')).toBe('export');
  });
});
