'use server';

import { revalidatePath } from 'next/cache';
import { creerClientServeur } from '@/lib/supabase/server';
import { lireUtilisateur } from '@/lib/supabase/utilisateur';
import { messageErreur } from '@/lib/erreurs';

export type EtatSuppression = { erreur?: string };

export async function demanderSuppression(_: EtatSuppression, form: FormData): Promise<EtatSuppression> {
  if (form.get('comprends') !== 'oui') return { erreur: 'Coche la case pour confirmer que tu as compris.' };
  if (!(await lireUtilisateur())) return { erreur: messageErreur('non_connecte') };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('demander_suppression_compte');
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/', 'layout');
  return {};
}

export async function annulerSuppression(): Promise<EtatSuppression> {
  if (!(await lireUtilisateur())) return { erreur: messageErreur('non_connecte') };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('annuler_suppression_compte');
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/', 'layout');
  return {};
}
