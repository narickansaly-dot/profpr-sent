import { notFound } from 'next/navigation';
import { lireProfil } from '@/lib/supabase/utilisateur';

/** Réserve une page ou une action aux comptes admin de contenu. À appeler hors de tout try/catch (notFound lève une exception). */
export async function exigerAdmin() {
  const profil = await lireProfil();
  if (profil?.role !== 'admin_contenu') notFound();
  return profil;
}
