'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { exigerEnseignant } from '@/lib/enseignant/garde';

export type EtatSignalement = { erreur?: string; ok?: boolean; commentaire?: string };

const saisie = z.object({ question: z.string().uuid(), commentaire: z.string().trim().min(5).max(1000) });

export async function signaler(_: EtatSignalement, form: FormData): Promise<EtatSignalement> {
  await exigerEnseignant();
  const brut = typeof form.get('commentaire') === 'string' ? (form.get('commentaire') as string) : '';
  const s = saisie.safeParse({ question: form.get('question'), commentaire: brut });
  if (!s.success) return { erreur: messageErreur('commentaire_invalide'), commentaire: brut.slice(0, 5000) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('signaler_question', { p_question: s.data.question, p_commentaire: s.data.commentaire });
  if (error) return { erreur: messageErreur(error.message), commentaire: s.data.commentaire };
  revalidatePath('/enseignant/signalements');
  return { ok: true };
}
