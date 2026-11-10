import { notFound } from 'next/navigation';
import { lireProfil } from '@/lib/supabase/utilisateur';

/** Réserve une page ou une action aux comptes enseignants. À appeler hors de tout try/catch (notFound lève une exception). */
export async function exigerEnseignant() {
  const profil = await lireProfil();
  if (profil?.role !== 'enseignant') notFound();
  return profil;
}
