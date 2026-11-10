import { describe, expect, it } from 'vitest';
import { assemblerNotes } from './assembler-notes';

const COURS = 'c1';
const suivi = (eleve_id: string, nom: string | null, note: number | null, validee: boolean, cours_id = COURS) => ({
  eleve_id, nom, cours_id, cours_titre: 'Cours', chapitres_valides: 0, chapitres_total: 0,
  note_evaluation: note, evaluation_validee: validee, essais_evaluation: 0, derniere_activite: null,
});

describe('assemblerNotes', () => {
  it('liste les élèves inscrits même sans chapitre publié', () => {
    const r = assemblerNotes(COURS, [], [suivi('e1', 'Léa', 72, true), suivi('e2', null, null, false)]);
    expect(r.chapitres).toEqual([]);
    expect(r.eleves.map((e) => [e.nom, e.evaluation, e.evaluationValidee])).toEqual([
      ['Élève sans prénom', null, false],
      ['Léa', 72, true],
    ]);
  });
  it('ignore les lignes de suivi des autres cours', () => {
    const r = assemblerNotes(COURS, [], [suivi('e1', 'Léa', 72, true, 'autre')]);
    expect(r.eleves).toEqual([]);
  });
  it('complète avec les notes par chapitre, triées par numéro', () => {
    const r = assemblerNotes(COURS, [
      { eleve_id: 'e1', nom: 'Léa', chapitre_id: 'ch2', chapitre_numero: 2, chapitre_titre: 'Deux', meilleure_note: null, valide: false },
      { eleve_id: 'e1', nom: 'Léa', chapitre_id: 'ch1', chapitre_numero: 1, chapitre_titre: 'Un', meilleure_note: 85, valide: true },
    ], [suivi('e1', 'Léa', null, false)]);
    expect(r.chapitres.map((c) => c.numero)).toEqual([1, 2]);
    expect(r.eleves[0].notes).toEqual({ ch1: 85, ch2: null });
    expect(r.eleves[0].valides).toEqual({ ch1: true, ch2: false });
  });
});
