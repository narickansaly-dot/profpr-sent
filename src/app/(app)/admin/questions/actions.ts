'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { exigerAdmin } from '@/lib/admin/garde';
import { versDonneesQuestion } from '@/lib/contenu/donnees-question';
import { lireSaisieQuestion, type ErreurSaisie, type SaisieQuestion } from '@/lib/contenu/schema-question-editeur';

export type EtatQuestion = Partial<ErreurSaisie>;
export type EtatStatut = { erreur?: string };

const uuid = z.string().uuid();
const saisie = z.object({
  type: z.string().max(40), enonce: z.string().max(10000),
  propositions: z.array(z.object({ texte: z.string().max(5000), bonne: z.boolean() })).max(30),
  vraiFaux: z.enum(['', 'vrai', 'faux']), acceptees: z.string().max(20000), marge: z.string().max(40), margeRelative: z.boolean(),
  notion: z.string().max(1000), difficulte: z.string().max(5), explication: z.string().max(40000),
});
const STATUTS = ['brouillon', 'a_relire', 'valide'] as const;

/** `questionId` : `null` pour une création. Le statut ne vient jamais du navigateur : la fonction SQL l'impose. */
export async function enregistrerQuestion(chapitreId: string, questionId: string | null, brut: SaisieQuestion): Promise<EtatQuestion> {
  await exigerAdmin();
  const c = uuid.safeParse(chapitreId);
  const q = questionId === null ? null : uuid.safeParse(questionId);
  const s = saisie.safeParse(brut);
  if (!c.success || (q && !q.success) || !s.success) return { erreur: messageErreur(undefined) };
  const r = lireSaisieQuestion(s.data);
  if (!('question' in r)) return r;
  // `statut` et `source` sont ignorés par l'éditeur côté SQL (création en brouillon, statut conservé, source gardée).
  const { source: _source, ...donnees } = versDonneesQuestion({ ...r.question, statut: 'brouillon' });
  void _source;
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('enregistrer_question', {
    p_chapitre: c.data, p_question: (q?.data ?? null) as string, p_donnees: donnees,
  });
  if (error || !data) return { erreur: messageErreur(error?.message) };
  revalidatePath(`/admin/chapitres/${c.data}/questions`);
  const code = questionId === null ? 'cree' : data === questionId ? 'modifiee' : 'version';
  redirect(`/admin/questions/${data}?enregistre=${code}`);
}

export async function changerStatut(_: EtatStatut, form: FormData): Promise<EtatStatut> {
  await exigerAdmin();
  const id = uuid.safeParse(form.get('id'));
  const statut = z.enum(STATUTS).safeParse(form.get('statut'));
  if (!id.success || !statut.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('changer_statut_question', { p_question: id.data, p_statut: statut.data });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/admin', 'layout');
  redirect(`/admin/questions/${id.data}?enregistre=${statut.data}`);
}

export async function supprimerQuestion(_: EtatStatut, form: FormData): Promise<EtatStatut> {
  await exigerAdmin();
  const id = uuid.safeParse(form.get('id'));
  const chapitre = uuid.safeParse(form.get('chapitre'));
  if (!id.success || !chapitre.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('supprimer_question', { p_question: id.data });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/admin', 'layout');
  redirect(`/admin/chapitres/${chapitre.data}/questions?supprimee=1`);
}
