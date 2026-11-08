'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { lireProfil } from '@/lib/supabase/utilisateur';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lireFormulairePreferences, type ChampPreferences, type ValeursPreferences } from '@/lib/notifications/preferences';
import type { Json } from '@/lib/supabase/types';

export type EtatPreferences = { erreur?: string; champ?: ChampPreferences; valeurs?: ValeursPreferences; ok?: boolean };

const abonnementSchema = z.object({
  endpoint: z.string().url().startsWith('https://').max(1000),
  p256dh: z.string().min(20).max(200),
  auth: z.string().min(10).max(100),
});

export async function enregistrerAbonnement(abonnement: unknown, appareil: string): Promise<{ erreur?: string }> {
  await exigerEleve();
  const a = abonnementSchema.safeParse(abonnement);
  if (!a.success) return { erreur: messageErreur('abonnement_invalide') };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('enregistrer_abonnement_push', {
    p_endpoint: a.data.endpoint, p_p256dh: a.data.p256dh, p_auth: a.data.auth, p_appareil: String(appareil).slice(0, 80),
  });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/notifications');
  revalidatePath('/calendrier');
  return {};
}

export async function oublierAppareilCourant(endpoint: string): Promise<void> {
  // Appelée à la déconnexion, y compris par un compte non élève : on sort sans bruit (pas de 404).
  if ((await lireProfil())?.role !== 'eleve') return;
  if (typeof endpoint !== 'string' || endpoint.length > 1000) return;
  const supabase = await creerClientServeur();
  await supabase.rpc('supprimer_abonnement_push_endpoint', { p_endpoint: endpoint });
  revalidatePath('/notifications');
}

export async function retirerAppareil(form: FormData): Promise<void> {
  await exigerEleve();
  const id = z.string().uuid().safeParse(form.get('id'));
  if (!id.success) return;
  const supabase = await creerClientServeur();
  await supabase.rpc('supprimer_abonnement_push', { p_id: id.data });
  revalidatePath('/notifications');
  revalidatePath('/calendrier');
}

export async function enregistrerPreferences(_: EtatPreferences, form: FormData): Promise<EtatPreferences> {
  await exigerEleve();
  const lu = lireFormulairePreferences(form);
  if (!lu.ok) return { erreur: lu.erreur, champ: lu.champ, valeurs: lu.valeurs };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('enregistrer_preferences_notification', { p: lu.donnees as unknown as Json });
  if (error) return { erreur: messageErreur(error.message), valeurs: lu.valeurs };
  revalidatePath('/notifications');
  return { ok: true, valeurs: lu.valeurs };
}

export async function marquerRappelsLus(): Promise<void> {
  await exigerEleve();
  const supabase = await creerClientServeur();
  await supabase.rpc('marquer_rappels_lus');
  revalidatePath('/', 'layout');
}
