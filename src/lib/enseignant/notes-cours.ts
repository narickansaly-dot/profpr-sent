import { cache } from 'react';
import { z } from 'zod';
import { lireCatalogue, lireClasseEnseignant, lireNotesCours, lireSuivi } from './requetes';
import { assemblerNotes } from './assembler-notes';

export type { EleveNotes } from './assembler-notes';

/**
 * Données communes à la page de suivi et à l'export CSV. null = classe ou cours introuvable pour cette classe.
 * Mis en cache pour la durée d'un rendu : la page et son titre (generateMetadata) partagent le même chargement.
 */
export const chargerNotesCours = cache(async (classeId: string, coursId: string) => {
  const classe = await lireClasseEnseignant(classeId);
  if (!classe || !z.string().uuid().safeParse(coursId).success || !classe.cours_ids.includes(coursId)) return null;
  const [{ notes, ratees }, suivi, catalogue] = await Promise.all([
    lireNotesCours(classe.id, coursId), lireSuivi(classe.id), lireCatalogue(),
  ]);
  const cours = catalogue.find((c) => c.id === coursId)?.titre ?? suivi.find((l) => l.cours_id === coursId)?.cours_titre ?? 'Cours';
  return { classe, cours, ratees, ...assemblerNotes(coursId, notes, suivi) };
});
