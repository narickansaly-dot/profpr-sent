'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';

export type EtatRejoindre = { erreur?: string; info?: string; code?: string };

const MESSAGES_STATUT: Record<string, string> = {
  code_invalide: 'Ce code ne correspond à aucune classe. Vérifie-le auprès de ton enseignant.',
  trop_d_essais: 'Trop de codes incorrects. Réessaie dans une heure.',
};

export async function rejoindreClasse(_: EtatRejoindre, form: FormData): Promise<EtatRejoindre> {
  const code = String(form.get('code') ?? '');
  if (!/^[A-Za-z0-9\s]{6,12}$/.test(code)) return { erreur: 'Le code fait 6 caractères.', code };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('rejoindre_classe', { p_code: code });
  if (error) return { erreur: messageErreur(error.message), code };
  const r = data?.[0];
  if (!r) return { erreur: messageErreur(undefined), code };
  if (r.statut === 'ok' || r.statut === 'deja_inscrit') {
    revalidatePath('/classes');
    return { info: r.statut === 'ok' ? `Tu as rejoint « ${r.classe_nom} ».` : `Tu fais déjà partie de « ${r.classe_nom} ».` };
  }
  return { erreur: MESSAGES_STATUT[r.statut] ?? messageErreur(undefined), code };
}

export async function quitterClasse(form: FormData) {
  const id = z.string().uuid().safeParse(form.get('classe'));
  if (!id.success) return;
  const supabase = await creerClientServeur();
  await supabase.rpc('quitter_classe', { p_classe: id.data });
  revalidatePath('/classes');
}
