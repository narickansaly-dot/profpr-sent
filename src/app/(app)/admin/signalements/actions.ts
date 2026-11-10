'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { exigerAdmin } from '@/lib/admin/garde';

export type EtatDecision = { erreur?: string; reponse?: string };

const FILTRES = ['ouvert', 'traite', 'rejete', 'tout'] as const;
const saisie = z.object({
  id: z.string().uuid(),
  decision: z.enum(['traite', 'rejete']),
  filtre: z.enum(FILTRES),
  reponse: z.string().trim().max(1000, 'La réponse ne doit pas dépasser 1000 caractères.'),
});

export async function traiterSignalement(_: EtatDecision, form: FormData): Promise<EtatDecision> {
  await exigerAdmin();
  const brut = typeof form.get('reponse') === 'string' ? (form.get('reponse') as string) : '';
  const s = saisie.safeParse({ id: form.get('id'), decision: form.get('decision'), filtre: form.get('filtre'), reponse: brut });
  if (!s.success) {
    const trop = s.error.issues.find((i) => i.path[0] === 'reponse');
    return { erreur: trop ? trop.message : messageErreur(undefined), reponse: brut.slice(0, 5000) };
  }
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('traiter_signalement', {
    p_signalement: s.data.id, p_decision: s.data.decision, ...(s.data.reponse ? { p_reponse: s.data.reponse } : {}),
  });
  if (error) return { erreur: messageErreur(error.message), reponse: s.data.reponse };
  revalidatePath('/admin', 'layout');
  // `n` change à chaque décision : le message de confirmation est réannoncé même si le texte est identique.
  redirect(`/admin/signalements?statut=${s.data.filtre}&decision=${s.data.decision}&n=${Date.now()}`);
}
