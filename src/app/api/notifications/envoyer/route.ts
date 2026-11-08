import { createClient } from '@supabase/supabase-js';
import type { Database, Json } from '@/lib/supabase/types';
import { secretValide } from '@/lib/notifications/secret';
import { traiterLot, type LigneEnvoi } from '@/lib/notifications/envoi';
import { creerEnvoyeur } from '@/lib/notifications/webpush';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** Appelée chaque minute par la tâche planifiée de Supabase (pg_cron + pg_net). */
export async function POST(request: Request) {
  const secret = process.env.ENVOI_SECRET;
  if (!secretValide(request.headers.get('authorization'), secret)) {
    return new Response('Non autorisé', { status: 401 });
  }
  // Client anonyme : les RPC d'envoi vérifient elles-mêmes le secret. Pas de clé de service ici.
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const reserve = await supabase.rpc('envoi_reserver', { p_secret: secret!, p_limite: 200 });
  if (reserve.error) {
    console.error('envoi_reserver', reserve.error.message);
    return new Response('Service indisponible', { status: 503 });
  }
  const lignes = (reserve.data ?? []) as unknown as LigneEnvoi[];
  if (lignes.length === 0) return Response.json({ traitees: 0 });
  const { resultats, expires } = await traiterLot(lignes, creerEnvoyeur(), new Date());
  const fin = await supabase.rpc('envoi_terminer', {
    p_secret: secret!, p_resultats: resultats as unknown as Json, p_expires: [...new Set(expires)],
  });
  if (fin.error) {
    // Les notifications restent réservées 2 minutes, puis repartent : rien n'est perdu.
    console.error('envoi_terminer', fin.error.message);
    return new Response('Service indisponible', { status: 503 });
  }
  return Response.json({ traitees: resultats.length });
}
