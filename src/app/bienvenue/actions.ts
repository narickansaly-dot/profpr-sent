'use server';

import { redirect } from 'next/navigation';
import { creerClientServeur } from '@/lib/supabase/server';
import { lireFormulaireOnboarding } from '@/lib/profil/onboarding';

export async function terminerOnboarding(_: { erreur?: string }, form: FormData): Promise<{ erreur?: string }> {
  const r = lireFormulaireOnboarding(form);
  if (!r.success) return { erreur: r.error.issues[0].message };
  const supabase = await creerClientServeur();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');
  const { error } = await supabase.from('profil').update({
    nom: r.data.nom,
    filiere_id: r.data.filiereId,
    niveau_code: r.data.niveau,
    moins_de_15_ans: r.data.moinsDe15Ans,
    onboarding_termine: true,
  }).eq('id', user.id);
  if (error) return { erreur: 'Impossible d’enregistrer ton profil. Réessaie.' };
  redirect('/');
}
