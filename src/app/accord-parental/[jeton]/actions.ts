'use server';

import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';

export type EtatAccord = { erreur?: string; prenom?: string };

export async function donnerAccord(jeton: string, _: EtatAccord, form: FormData): Promise<EtatAccord> {
  if (form.get('confirme') !== 'on') {
    return { erreur: 'Cochez la case pour confirmer que vous êtes son parent ou son représentant légal.' };
  }
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('donner_consentement', { p_jeton: jeton });
  // Le jeton n'est jamais journalisé ; l'erreur reste générique.
  if (error) {
    return { erreur: error.message.includes('lien_consentement_invalide') ? messageErreur(error.message) : 'Une erreur est survenue. Réessayez dans un instant.' };
  }
  return { prenom: data ?? '' };
}
