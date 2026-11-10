'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { codeClasseValide, normaliserCode } from '@/lib/classes/code';

export type EtatRejoindre = { erreur?: string; info?: string; code?: string };
export type EtatQuitter = { erreur?: string };

export async function rejoindreClasse(_: EtatRejoindre, form: FormData): Promise<EtatRejoindre> {
  const brut = String(form.get('code') ?? '');
  const code = normaliserCode(brut);
  if (!codeClasseValide(code)) {
    return { erreur: 'Le code fait 6 caractères : des lettres et des chiffres, sans O, I, L, 0 ni 1.', code };
  }
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('rejoindre_classe', { p_code: code });
  if (error) return { erreur: messageErreur(error.message), code };
  const r = data?.[0];
  if (!r) return { erreur: messageErreur(undefined), code };
  if (r.statut === 'ok' || r.statut === 'deja_inscrit') {
    revalidatePath('/classes');
    return { info: r.statut === 'ok' ? `Tu as rejoint « ${r.classe_nom} ».` : `Tu fais déjà partie de « ${r.classe_nom} ».` };
  }
  // Les statuts d'échec (code_invalide, trop_d_essais) ont leur message dans erreurs.ts.
  return { erreur: messageErreur(r.statut), code };
}

export async function quitterClasse(_: EtatQuitter, form: FormData): Promise<EtatQuitter> {
  const id = z.string().uuid().safeParse(form.get('classe'));
  if (!id.success) return { erreur: messageErreur('classe_introuvable') };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('quitter_classe', { p_classe: id.data });
  if (error) {
    // Déjà quittée ailleurs : la liste doit se mettre à jour malgré l'erreur.
    revalidatePath('/classes');
    return { erreur: messageErreur(error.message) };
  }
  revalidatePath('/classes');
  return {};
}
