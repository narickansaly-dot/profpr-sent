import { createClient } from '@supabase/supabase-js';
import { genererIcal } from '@/lib/calendrier/ical';
import type { Database } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

// Accès sans session : le jeton est la seule preuve, vérifiée par la RPC calendrier_ical (ouverte à anon).
// `jeton_inconnu` (jeton absent, mal formé, révoqué) devient un 404, jamais montré à un utilisateur.
export async function GET(_requete: Request, { params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.rpc('calendrier_ical', { p_jeton: jeton.replace(/\.ics$/, '') });
  const texte = { 'Content-Type': 'text/plain; charset=utf-8' };
  if (error?.message.includes('jeton_inconnu')) return new Response('Calendrier introuvable.', { status: 404, headers: texte });
  if (error || !data) return new Response('Service momentanément indisponible.', { status: 503, headers: texte });
  return new Response(genererIcal(data, new Date()), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="calendrier.ics"',
      'Cache-Control': 'private, max-age=300',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex',
    },
  });
}
