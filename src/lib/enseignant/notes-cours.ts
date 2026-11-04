import { z } from 'zod';
import { lireCatalogue, lireClasseEnseignant, lireNotesCours, lireSuiviClasse } from './requetes';

export type EleveNotes = { id: string; nom: string; notes: Record<string, number | null>; valides: Record<string, boolean>; evaluation: number | null };

/** Données communes à la page de suivi et à l'export CSV. null = classe ou cours introuvable pour cette classe. */
export async function chargerNotesCours(classeId: string, coursId: string) {
  const classe = await lireClasseEnseignant(classeId);
  if (!classe || !z.string().uuid().safeParse(coursId).success || !classe.cours_ids.includes(coursId)) return null;
  const [{ notes, ratees }, { suivi }, catalogue] = await Promise.all([
    lireNotesCours(classe.id, coursId), lireSuiviClasse(classe.id), lireCatalogue(),
  ]);
  const cours = catalogue.find((c) => c.id === coursId)?.titre ?? suivi.find((l) => l.cours_id === coursId)?.cours_titre ?? 'Cours';

  const chapitres = new Map<string, { id: string; numero: number; titre: string }>();
  const eleves = new Map<string, EleveNotes>();
  const evaluations = new Map(suivi.filter((l) => l.cours_id === coursId).map((l) => [l.eleve_id, l.note_evaluation]));
  for (const n of notes) {
    chapitres.set(n.chapitre_id, { id: n.chapitre_id, numero: n.chapitre_numero, titre: n.chapitre_titre });
    const e = eleves.get(n.eleve_id) ?? {
      id: n.eleve_id, nom: n.nom?.trim() || 'Élève sans prénom', notes: {}, valides: {}, evaluation: evaluations.get(n.eleve_id) ?? null,
    };
    e.notes[n.chapitre_id] = n.meilleure_note;
    e.valides[n.chapitre_id] = n.valide;
    eleves.set(n.eleve_id, e);
  }
  return {
    classe, cours, ratees,
    chapitres: [...chapitres.values()].sort((a, b) => a.numero - b.numero),
    eleves: [...eleves.values()].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')),
  };
}
