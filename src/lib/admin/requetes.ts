import { cache } from 'react';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

const estUuid = (id: string) => z.string().uuid().safeParse(id).success;

type Retour<F extends keyof Database['public']['Functions']> =
  Database['public']['Functions'][F]['Returns'] extends (infer L)[] ? L : never;
// Les types générés ignorent les colonnes nullables des fonctions SQL : on les rétablit ici.
type Nullable<T, K extends keyof T> = Omit<T, K> & { [P in K]: T[P] | null };

export type LigneSuiviContenu = Nullable<Retour<'suivi_contenu'>,
  'chapitre_id' | 'numero' | 'chapitre_titre' | 'chapitre_publie' | 'valides' | 'a_relire' | 'brouillons' | 'signalements'>;
export type QuestionAdmin = Nullable<Retour<'questions_chapitre_admin'>, 'notion' | 'marge' | 'version_de'>;
export type SignalementAdmin = Nullable<Retour<'signalements_admin'>, 'reponse' | 'auteur_nom' | 'auteur_email' | 'traite_le'>;
export type MonSignalement = Nullable<Retour<'mes_signalements'>, 'reponse' | 'traite_le'>;

export const lireSuiviContenu = cache(async (): Promise<LigneSuiviContenu[]> => {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('suivi_contenu');
  if (error) throw new Error('Impossible de charger le suivi du contenu.');
  return (data ?? []) as LigneSuiviContenu[];
});

export const lireCoursAdmin = cache(async (id: string) => {
  if (!estUuid(id)) return null;
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.from('cours')
    .select('id, slug, titre, matiere, niveau_code, filiere_id, couleur, publie, ordre, chapitre(id, slug, numero, titre, publie)')
    .eq('id', id).order('numero', { referencedTable: 'chapitre' }).maybeSingle();
  if (error) throw new Error('Impossible de charger ce cours.');
  return data;
});

export const lireChapitreAdmin = cache(async (id: string) => {
  if (!estUuid(id)) return null;
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.from('chapitre')
    .select('id, cours_id, slug, numero, titre, titre_court, duree, resume, chapeau, objectifs, sections, a_retenir, publie, modifie_le')
    .eq('id', id).maybeSingle();
  if (error) throw new Error('Impossible de charger ce chapitre.');
  return data;
});

export async function lireQuestionsChapitre(chapitreId: string): Promise<QuestionAdmin[]> {
  if (!estUuid(chapitreId)) return [];
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('questions_chapitre_admin', { p_chapitre: chapitreId });
  if (error) throw new Error('Impossible de charger les questions du chapitre.');
  return (data ?? []) as QuestionAdmin[];
}

export async function lireNotionsChapitre(chapitreId: string): Promise<string[]> {
  if (!estUuid(chapitreId)) return [];
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('notions_chapitre', { p_chapitre: chapitreId });
  if (error) throw new Error('Impossible de charger les notions du chapitre.');
  return data ?? [];
}

/** `statut` : « ouvert », « traite », « rejete » ou `null` pour tout voir (la valeur par défaut de la fonction SQL est « ouvert » : il faut envoyer null explicitement). */
export async function lireSignalementsAdmin(statut: string | null = 'ouvert'): Promise<SignalementAdmin[]> {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('signalements_admin', { p_statut: statut as string });
  if (error) throw new Error('Impossible de charger les signalements.');
  return (data ?? []) as SignalementAdmin[];
}

export async function lireMesSignalements(): Promise<MonSignalement[]> {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('mes_signalements');
  if (error) throw new Error('Impossible de charger tes signalements.');
  return (data ?? []) as MonSignalement[];
}
