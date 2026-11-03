import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/types';

process.loadEnvFile('.env.local');
export const db = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

/**
 * Bonnes réponses d'une tentative, dans l'ordre d'affichage : réservé aux tests (clé service_role).
 * Deux requêtes plutôt qu'une jointure imbriquée : question_corrige n'est pas lisible par les élèves,
 * et on évite de dépendre de la détection de relation de PostgREST.
 */
export async function bonnesReponsesAffichees(tentativeId: string): Promise<number[][]> {
  const { data: lignes, error } = await db.from('tentative_question')
    .select('ordre, question_id, permutation').eq('tentative_id', tentativeId).order('ordre');
  if (error || !lignes) throw error ?? new Error('tentative introuvable');
  const { data: corriges, error: erreurCorriges } = await db.from('question_corrige')
    .select('question_id, bonnes_reponses').in('question_id', lignes.map((l) => l.question_id));
  if (erreurCorriges || !corriges) throw erreurCorriges ?? new Error('corrigés introuvables');
  const parQuestion = new Map(corriges.map((c) => [c.question_id, c.bonnes_reponses as number[]]));
  return lignes.map((ligne) => {
    const bonnes = parQuestion.get(ligne.question_id);
    if (!bonnes) throw new Error(`corrigé manquant pour ${ligne.question_id}`);
    return bonnes.map((origine) => ligne.permutation.indexOf(origine));
  });
}

export async function validerTousLesChapitres(email: string, coursSlug: string) {
  const { data: profil } = await db.from('profil').select('id').eq('email', email).single();
  const { data: cours } = await db.from('cours').select('chapitre(id)').eq('slug', coursSlug).single();
  if (!profil || !cours) throw new Error('profil ou cours introuvable');
  const lignes = cours.chapitre.map((c) => ({ eleve_id: profil.id, chapitre_id: c.id, meilleure_note: 100, valide: true }));
  const { error } = await db.from('progression_chapitre').upsert(lignes);
  if (error) throw error;
}
