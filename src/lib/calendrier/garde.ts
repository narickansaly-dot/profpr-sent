import { notFound, redirect } from 'next/navigation';
import { lireProfil, lireUtilisateur } from '@/lib/supabase/utilisateur';

/** Réserve une page ou une action aux comptes élèves. À appeler hors de tout try/catch (redirect et notFound lèvent une exception). */
export async function exigerEleve() {
  if (!(await lireUtilisateur())) redirect('/connexion');
  const profil = await lireProfil();
  if (profil?.role !== 'eleve') notFound();
  return profil;
}
