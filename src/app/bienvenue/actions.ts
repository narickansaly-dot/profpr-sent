'use server';

import { redirect } from 'next/navigation';
import { creerClientServeur } from '@/lib/supabase/server';
import { lireUtilisateur } from '@/lib/supabase/utilisateur';
import { cheminSuiteSur } from '@/lib/routes';
import { messageErreur } from '@/lib/erreurs';
import { lireFormulaireOnboarding } from '@/lib/profil/onboarding';

export type ValeursBienvenue = { nom: string; filiereId: string; niveau: string; moinsDe15Ans: boolean };
export type EtatBienvenue = { erreur?: string; valeurs?: ValeursBienvenue; essai?: number };

export async function terminerOnboarding(etat: EtatBienvenue, form: FormData): Promise<EtatBienvenue> {
  const valeurs: ValeursBienvenue = {
    nom: String(form.get('nom') ?? ''),
    filiereId: String(form.get('filiereId') ?? ''),
    niveau: String(form.get('niveau') ?? ''),
    moinsDe15Ans: form.get('moinsDe15Ans') === 'on',
  };
  const essai = (etat.essai ?? 0) + 1;
  const r = lireFormulaireOnboarding(form);
  if (!r.success) return { erreur: r.error.issues[0].message, valeurs, essai };
  // Task 8 : branche enseignant (aucune interface n'envoie encore ce profil).
  if (r.data.profil !== 'eleve') return { erreur: messageErreur(undefined), valeurs, essai };
  const eleve = r.data;
  const user = await lireUtilisateur();
  if (!user) redirect('/connexion');
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.from('profil').update({
    nom: eleve.nom,
    filiere_id: eleve.filiereId,
    niveau_code: eleve.niveau,
    moins_de_15_ans: eleve.moinsDe15Ans,
    onboarding_termine: true,
  }).eq('id', user.id).select('id');
  if (error || !data || data.length === 0) {
    return { erreur: 'Impossible d’enregistrer ton profil. Réessaie.', valeurs, essai };
  }
  redirect(cheminSuiteSur(form.get('suite')) ?? '/');
}
