import { cache } from 'react';
import { creerClientServeur } from './server';

/** Utilisateur connecté, vérifié auprès du serveur Auth une seule fois par rendu. */
export const lireUtilisateur = cache(async () => {
  const supabase = await creerClientServeur();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

/** Profil mis en cache pour la durée d'une requête : après une modification du profil dans une server action, ne pas relire avec cette fonction. */
export const lireProfil = cache(async () => {
  const user = await lireUtilisateur();
  if (!user) return null;
  const supabase = await creerClientServeur();
  const { data } = await supabase.from('profil')
    .select('id, nom, role, filiere_id, niveau_code, onboarding_termine, inscrit_le, demande_enseignant, suppression_demandee_le')
    .eq('id', user.id).single();
  return data;
});
