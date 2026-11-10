import { creerClientServeur } from '@/lib/supabase/server';

export async function compterRappelsNonLus(): Promise<number> {
  const supabase = await creerClientServeur();
  const { count } = await supabase.from('notification_planifiee')
    .select('id', { count: 'exact', head: true })
    .is('lue_le', null)
    .lte('envoi_prevu', new Date().toISOString());
  return count ?? 0;
}
