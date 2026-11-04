import { notesEnCsv, slugFichier } from '@/lib/enseignant/csv';
import { chargerNotesCours } from '@/lib/enseignant/notes-cours';
import { lireProfil } from '@/lib/supabase/utilisateur';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; coursId: string }> }) {
  const reponse = (corps: string, status: number) => new Response(corps, { status, headers: { 'cache-control': 'no-store' } });
  const profil = await lireProfil();
  if (profil?.role !== 'enseignant') return reponse('Introuvable', 404);
  const { id, coursId } = await params;
  let donnees: Awaited<ReturnType<typeof chargerNotesCours>>;
  try {
    donnees = await chargerNotesCours(id, coursId);
  } catch {
    // Pas de page d'erreur générique (ni de mise en cache) pour des données d'élèves mineurs.
    return reponse('Export indisponible pour le moment.', 500);
  }
  if (!donnees) return reponse('Introuvable', 404);

  const csv = notesEnCsv({
    chapitres: donnees.chapitres,
    eleves: donnees.eleves.map((e) => ({ id: e.id, nom: e.nom, notes: e.notes, evaluation: e.evaluation })),
  });
  const fichier = `notes-${slugFichier(donnees.classe.nom)}-${slugFichier(donnees.cours)}.csv`;
  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${fichier}"`,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
