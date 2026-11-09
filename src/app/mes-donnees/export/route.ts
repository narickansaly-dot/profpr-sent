import { creerClientServeur } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Les données de l'appelant uniquement : la fonction de la base lit auth.uid(), aucun identifiant n'est accepté en entrée.
export async function GET() {
  const supabase = await creerClientServeur();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Connecte-toi pour télécharger tes données.', { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const { data, error } = await supabase.rpc('exporter_mes_donnees');
  // Pendant une évaluation ouverte, la base refuse l'export (il révélerait les corrections).
  if (error?.message.includes('evaluation_en_cours')) {
    return new Response('Une évaluation est en cours\u00a0: tu pourras télécharger tes données quand elle sera terminée.', { status: 409, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
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
