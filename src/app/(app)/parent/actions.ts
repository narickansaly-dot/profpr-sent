'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { normaliserCode } from '@/lib/parent/format';

export type EtatCode = { erreur?: string; info?: string; code?: string };
export type EtatAction = { erreur?: string };

const schemaCode = z.string().min(8).max(12);
const uuid = z.string().uuid();

export async function relierParCode(_: EtatCode, form: FormData): Promise<EtatCode> {
  const saisie = String(form.get('code') ?? '');
  const r = schemaCode.safeParse(normaliserCode(saisie));
  if (!r.success) return { erreur: messageErreur('code_parent_invalide'), code: saisie };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('lier_par_code', { p_code: r.data });
  if (error) return { erreur: messageErreur(error.message), code: saisie };
  if (data !== 'lie') return { erreur: messageErreur(data ?? undefined), code: saisie };
  revalidatePath('/parent');
  return { info: 'Votre enfant est maintenant relié à votre compte.' };
}

/** Case de confirmation obligatoire + identifiant valide : renvoie l'identifiant ou l'erreur à afficher. */
function lireDemande(form: FormData): { id: string } | { erreur: string } {
  if (form.get('confirme') !== 'on') return { erreur: 'Cochez la case pour confirmer.' };
  const id = uuid.safeParse(form.get('eleveId'));
  if (!id.success) return { erreur: messageErreur('lien_introuvable') };
  return { id: id.data };
}

export async function retirerAccord(_: EtatAction, form: FormData): Promise<EtatAction> {
  const d = lireDemande(form);
  if ('erreur' in d) return d;
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('retirer_consentement', { p_eleve: d.id });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/parent');
  revalidatePath(`/parent/enfant/${d.id}`);
  redirect(`/parent/enfant/${d.id}`);
}

export async function annulerRetrait(_: EtatAction, form: FormData): Promise<EtatAction> {
  const d = lireDemande(form);
  if ('erreur' in d) return d;
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('annuler_retrait_consentement', { p_eleve: d.id });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/parent');
  revalidatePath(`/parent/enfant/${d.id}`);
  redirect(`/parent/enfant/${d.id}`);
}

export async function delier(_: EtatAction, form: FormData): Promise<EtatAction> {
  const d = lireDemande(form);
  if ('erreur' in d) return d;
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('delier_parent', { p_autre: d.id });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/parent');
  redirect('/parent');
}
