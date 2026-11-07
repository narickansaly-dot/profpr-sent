import { notFound } from 'next/navigation';
import { lireProfil } from '@/lib/supabase/utilisateur';

/** Réserve une page ou une action aux comptes élèves. À appeler hors de tout try/catch (notFound lève une exception). */
export async function exigerEleve() {
  const profil = await lireProfil();
  if (profil?.role !== 'eleve') notFound();
  return profil;
}
