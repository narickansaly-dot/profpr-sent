import { creerClientServeur } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Les données de l'appelant uniquement : la fonction de la base lit auth.uid(), aucun identifiant n'est accepté en entrée.
export async function GET() {
  const supabase = await creerClientServeur();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Connecte-toi pour télécharger tes données.', { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const { data, error } = await supabase.rpc('exporter_mes_donnees');
  if (error) return new Response('Export impossible pour le moment.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  const jour = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="mes-donnees-${jour}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
