import type { LigneNote, LigneSuivi } from './requetes';

export type EleveNotes = {
  id: string; nom: string; notes: Record<string, number | null>; valides: Record<string, boolean>;
  evaluation: number | null; evaluationValidee: boolean;
};
export type ChapitreNotes = { id: string; numero: number; titre: string };

/**
 * Tableau des notes d'un cours. Les élèves viennent du suivi (une ligne par élève inscrit et cours de la classe) :
 * un cours sans chapitre publié n'a aucune ligne dans notes_classe, mais ses élèves doivent quand même apparaître.
 */
export function assemblerNotes(coursId: string, notes: LigneNote[], suivi: LigneSuivi[]) {
  const eleves = new Map<string, EleveNotes>();
  for (const l of suivi) {
    if (l.cours_id !== coursId) continue;
    eleves.set(l.eleve_id, {
      id: l.eleve_id, nom: l.nom?.trim() || 'Élève sans prénom', notes: {}, valides: {},
      evaluation: l.note_evaluation, evaluationValidee: l.evaluation_validee,
    });
  }
  const chapitres = new Map<string, ChapitreNotes>();
  for (const n of notes) {
    chapitres.set(n.chapitre_id, { id: n.chapitre_id, numero: n.chapitre_numero, titre: n.chapitre_titre });
    const e = eleves.get(n.eleve_id);
    if (!e) continue;
    e.notes[n.chapitre_id] = n.meilleure_note;
    e.valides[n.chapitre_id] = n.valide;
  }
  return {
    chapitres: [...chapitres.values()].sort((a, b) => a.numero - b.numero),
    eleves: [...eleves.values()].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')),
  };
}
