'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { LONGUEURS_QUIZ } from '@/lib/quiz/regles';
import { appelerAvecRelance } from '@/lib/supabase/rpc';
import { messageErreur } from '@/lib/erreurs';
import type { ReponseAffichee } from '@/lib/quiz/reponse';

export type EtatLancement = { erreur?: string };

const schemaLancement = z.object({
  chapitreId: z.string().uuid(),
  nb: z.coerce.number().refine((n) => (LONGUEURS_QUIZ as readonly number[]).includes(n)),
  revision: z.boolean(),
});

export async function lancerQuiz(_: EtatLancement, form: FormData): Promise<EtatLancement> {
  const r = schemaLancement.safeParse({
    chapitreId: form.get('chapitreId'), nb: form.get('nb'), revision: form.get('revision') === '1',
  });
  if (!r.success) return { erreur: 'Choisis un quiz de 15, 20 ou 30 questions.' };
  const supabase = await creerClientServeur();
  const { data, error } = await appelerAvecRelance(() => supabase.rpc('demarrer_quiz', {
    p_chapitre: r.data.chapitreId, p_nb: r.data.nb, p_revision: r.data.revision,
  }));
  if (error || !data) return { erreur: messageErreur(error?.message) };
  redirect(`/tentative/${data}`);
}

export async function lancerEvaluation(_: EtatLancement, form: FormData): Promise<EtatLancement> {
  const coursId = z.string().uuid().safeParse(form.get('coursId'));
  if (!coursId.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { data, error } = await appelerAvecRelance(() => supabase.rpc('demarrer_evaluation', { p_cours: coursId.data }));
  if (error || !data) return { erreur: messageErreur(error?.message) };
  redirect(`/tentative/${data}`);
}

const schemaReponse = z.union([
  z.array(z.number().int().min(0)).min(1).max(10),
  z.array(z.boolean()).length(1),
  z.array(z.string().max(200)).length(1),
]).nullable();

export type ResultatReponse = { statut: 'ok' | 'temps_ecoule' | 'terminee' } | { erreur: string };

export async function enregistrerReponse(tentativeId: string, questionId: string, reponse: ReponseAffichee | null): Promise<ResultatReponse> {
  const ids = z.tuple([z.string().uuid(), z.string().uuid()]).safeParse([tentativeId, questionId]);
  const valeur = schemaReponse.safeParse(reponse);
  if (!ids.success || !valeur.success) return { erreur: messageErreur('reponse_invalide') };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('repondre', {
    p_tentative: tentativeId, p_question: questionId, p_reponse: valeur.data,
  });
  if (error || !data) return { erreur: messageErreur(error?.message) };
  const statut = z.enum(['ok', 'temps_ecoule', 'terminee']).safeParse(data);
  if (!statut.success) return { erreur: messageErreur(undefined) };
  return { statut: statut.data };
}

export async function terminerTentative(tentativeId: string) {
  if (!z.string().uuid().safeParse(tentativeId).success) redirect('/');
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('terminer_tentative', { p_tentative: tentativeId });
  if (error) redirect(`/tentative/${tentativeId}?erreur=fin`);
  redirect(`/tentative/${tentativeId}/resultat`);
}

export async function marquerChapitreLu(chapitreId: string) {
  if (!z.string().uuid().safeParse(chapitreId).success) return;
  const supabase = await creerClientServeur();
  await supabase.rpc('marquer_chapitre_lu', { p_chapitre: chapitreId });
}
