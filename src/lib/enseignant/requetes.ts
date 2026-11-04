import { cache } from 'react';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

const estUuid = (id: string) => z.string().uuid().safeParse(id).success;

type Retour<F extends keyof Database['public']['Functions']> =
  Database['public']['Functions'][F]['Returns'] extends (infer L)[] ? L : never;
// Les types générés ignorent les colonnes nullables des fonctions SQL : on les rétablit ici.
type Nullable<T, K extends keyof T> = Omit<T, K> & { [P in K]: T[P] | null };

export type ClasseEnseignant = Nullable<Retour<'classes_enseignant'>, 'filiere_id' | 'niveau_code'>;
export type ClasseEleve = Nullable<Retour<'classes_eleve'>, 'enseignant_nom'>;
export type LigneSuivi = Nullable<Retour<'suivi_classe'>, 'note_evaluation' | 'derniere_activite'>;
export type EcheanceClasse = Nullable<Retour<'echeances_classe'>, 'ouverture' | 'limite'>;
export type LigneNote = Nullable<Retour<'notes_classe'>, 'meilleure_note'>;

export const lireClassesEnseignant = cache(async (): Promise<ClasseEnseignant[]> => {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('classes_enseignant');
  if (error) throw new Error('Impossible de charger tes classes.');
  return data ?? [];
});

export const lireClasseEnseignant = cache(async (id: string): Promise<ClasseEnseignant | null> => {
  if (!estUuid(id)) return null;
  const classes = await lireClassesEnseignant();
  return classes.find((c) => c.id === id) ?? null;
});

export async function lireSuiviClasse(id: string): Promise<{ suivi: LigneSuivi[]; echeances: EcheanceClasse[] }> {
  const supabase = await creerClientServeur();
  const [suivi, echeances] = await Promise.all([
    supabase.rpc('suivi_classe', { p_classe: id }),
    supabase.rpc('echeances_classe', { p_classe: id }),
  ]);
  if (suivi.error || echeances.error) throw new Error('Impossible de charger le suivi de la classe.');
  return { suivi: suivi.data ?? [], echeances: echeances.data ?? [] };
}

export async function lireNotesCours(classeId: string, coursId: string) {
  const supabase = await creerClientServeur();
  const [notes, ratees] = await Promise.all([
    supabase.rpc('notes_classe', { p_classe: classeId, p_cours: coursId }),
    supabase.rpc('questions_ratees_classe', { p_classe: classeId, p_cours: coursId, p_limite: 10 }),
  ]);
  if (notes.error || ratees.error) throw new Error('Impossible de charger les notes.');
  return { notes: (notes.data ?? []) as LigneNote[], ratees: ratees.data ?? [] };
}

export async function lireClassesEleve(): Promise<ClasseEleve[]> {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('classes_eleve');
  if (error) throw new Error('Impossible de charger tes classes.');
  return data ?? [];
}

export async function lireCatalogue() {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.from('cours')
    .select('id, slug, titre, matiere, couleur, niveau_code, filiere(code, nom, ordre), chapitre(count)')
    .eq('publie', true).order('ordre');
  if (error) throw new Error('Impossible de charger le catalogue.');
  return (data ?? []).map((c) => ({ ...c, nbChapitres: c.chapitre[0]?.count ?? 0 }));
}

export async function lireDemandesEnseignant() {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('demandes_enseignant');
  if (error) throw new Error('Impossible de charger les demandes.');
  return data ?? [];
}
