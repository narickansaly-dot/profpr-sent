'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';

export type EtatDemande = { erreur?: string };

export async function traiterDemande(_: EtatDemande, form: FormData): Promise<EtatDemande> {
  const r = z.object({ profil: z.string().uuid(), decision: z.enum(['accepter', 'refuser']) })
    .safeParse({ profil: form.get('profil'), decision: form.get('decision') });
  if (!r.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('traiter_demande_enseignant', { p_profil: r.data.profil, p_accepter: r.data.decision === 'accepter' });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/admin/enseignants');
  // La carte traitée disparaît de la liste : la confirmation s'affiche dans la région de statut de la page.
  redirect(`/admin/enseignants?traite=${r.data.decision === 'accepter' ? 'accepte' : 'refuse'}`);
}
