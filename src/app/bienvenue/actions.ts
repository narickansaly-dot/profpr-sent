'use server';

import { redirect } from 'next/navigation';
import { creerClientServeur } from '@/lib/supabase/server';
import { lireUtilisateur } from '@/lib/supabase/utilisateur';
import { cheminSuiteSur } from '@/lib/routes';
import { lireFormulaireOnboarding } from '@/lib/profil/onboarding';

export type ValeursBienvenue = { profil: 'eleve' | 'enseignant'; nom: string; filiereId: string; niveau: string; moinsDe15Ans: boolean; etablissement: string };
export type EtatBienvenue = { erreur?: string; valeurs?: ValeursBienvenue; essai?: number; champ?: 'nom' | 'filiereId' | 'niveau' | 'etablissement' };

export async function terminerOnboarding(etat: EtatBienvenue, form: FormData): Promise<EtatBienvenue> {
  const valeurs: ValeursBienvenue = {
    profil: form.get('profil') === 'enseignant' ? 'enseignant' : 'eleve',
    nom: String(form.get('nom') ?? ''),
    filiereId: String(form.get('filiereId') ?? ''),
    niveau: String(form.get('niveau') ?? ''),
    moinsDe15Ans: form.get('moinsDe15Ans') === 'on',
    etablissement: String(form.get('etablissement') ?? ''),
  };
  const essai = (etat.essai ?? 0) + 1;
  const r = lireFormulaireOnboarding(form);
  if (!r.success) {
    const champ = r.error.issues[0].path[0];
    return {
      erreur: r.error.issues[0].message, valeurs, essai,
      champ: champ === 'nom' || champ === 'filiereId' || champ === 'niveau' || champ === 'etablissement' ? champ : undefined,
    };
  }
  const user = await lireUtilisateur();
  if (!user) redirect('/connexion');
  const supabase = await creerClientServeur();
  if (r.data.profil === 'enseignant') {
    const { data, error } = await supabase.from('profil').update({
      nom: r.data.nom,
      etablissement: r.data.etablissement,
      demande_enseignant: true,
      onboarding_termine: true,
    }).eq('id', user.id).select('id');
    if (error || !data || data.length === 0) {
      return { erreur: 'Impossible d’enregistrer ta demande. Réessaie.', valeurs, essai };
    }
    redirect('/');
  }
  const eleve = r.data;
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
