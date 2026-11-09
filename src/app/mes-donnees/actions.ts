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

export type EtatParents = { erreur?: string; code?: string; info?: string };

export async function genererCodeParent(_: EtatParents): Promise<EtatParents> {
  if (!(await lireUtilisateur())) return { erreur: messageErreur('non_connecte') };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('generer_code_parent');
  if (error || !data) return { erreur: messageErreur(error?.message) };
  // Le code n'est renvoyé qu'à ce formulaire : il n'est ni stocké ni journalisé.
  return { code: data };
}

export async function delierParent(_: EtatParents, form: FormData): Promise<EtatParents> {
  if (form.get('comprends') !== 'oui') return { erreur: 'Coche la case pour confirmer.' };
  const parent = form.get('parent');
  if (typeof parent !== 'string' || !parent) return { erreur: messageErreur('lien_introuvable') };
  if (!(await lireUtilisateur())) return { erreur: messageErreur('non_connecte') };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('delier_parent', { p_autre: parent });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/mes-donnees');
  return { info: 'Ce parent ne voit plus ta progression.' };
}
