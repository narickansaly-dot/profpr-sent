import { notesEnCsv, slugFichier } from '@/lib/enseignant/csv';
import { chargerNotesCours } from '@/lib/enseignant/notes-cours';
import { lireProfil } from '@/lib/supabase/utilisateur';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; coursId: string }> }) {
  const introuvable = () => new Response('Introuvable', { status: 404, headers: { 'cache-control': 'no-store' } });
  const profil = await lireProfil();
  if (profil?.role !== 'enseignant') return introuvable();
  const { id, coursId } = await params;
  const donnees = await chargerNotesCours(id, coursId);
  if (!donnees) return introuvable();

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
    },
  });
}
