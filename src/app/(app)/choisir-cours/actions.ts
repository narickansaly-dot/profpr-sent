'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { exigerEleve } from '@/lib/calendrier/garde';
import { messageErreur } from '@/lib/erreurs';

export type EtatChoix = { erreur?: string; cours?: string };

export async function choisirCoursGratuit(_: EtatChoix, form: FormData): Promise<EtatChoix> {
  await exigerEleve();
  const brut = form.get('cours');
  const cours = z.string().uuid().safeParse(brut);
  if (!cours.success) return { erreur: 'Choisis un cours dans la liste.' };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('choisir_cours_gratuit', { p_cours: cours.data });
  if (error) return { erreur: messageErreur(error.message), cours: cours.data };
  revalidatePath('/', 'layout');
  redirect('/');
}
