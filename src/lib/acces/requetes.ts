import 'server-only';
import { cache } from 'react';
import { creerClientServeur } from '@/lib/supabase/server';
import type { MonAcces } from './etat';

/** Accès de l'utilisateur, lu une seule fois par rendu. Après une action qui le change, ne pas relire avec cette fonction. */
export const lireMonAcces = cache(async (): Promise<MonAcces | null> => {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('mon_acces');
  const l = data?.[0];
  if (error || !l) return null;
  return {
    role: l.role,
    enEssai: l.en_essai,
    finEssai: l.fin_essai,
    coursGratuitId: l.cours_gratuit_id,
    changementPossibleJusquAu: l.changement_possible_jusqu_au,
    consentementRequis: l.consentement_requis,
    emailParent: l.email_parent,
    consentementEnvoyeLe: l.consentement_envoye_le,
  };
});

/** Décision de la base (peut_lire_cours) : c'est elle qui ferme ou ouvre un cours. */
export const peutLireCours = cache(async (coursId: string): Promise<boolean> => {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('peut_lire_cours', { p_cours: coursId });
  if (error) throw new Error('Accès au cours illisible');
  return data === true;
});
