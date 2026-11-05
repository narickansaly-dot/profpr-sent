import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/types';

process.loadEnvFile('.env.local');
// Garde « base locale » (identique à celle du script d'import) : la clé service_role ne doit jamais partir ailleurs.
let hote: string;
try {
  hote = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname;
} catch {
  throw new Error('Refusé : NEXT_PUBLIC_SUPABASE_URL est absente ou invalide (la clé service_role est utilisée).');
}
if (!['localhost', '127.0.0.1', '[::1]'].includes(hote)) {
  throw new Error('Refusé : NEXT_PUBLIC_SUPABASE_URL doit pointer vers la base locale (la clé service_role est utilisée).');
}
export const db = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

/**
 * Bonnes réponses d'une tentative, dans l'ordre d'affichage (QCM et vrai ou faux) : réservé aux tests (clé service_role).
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
  const { data: types, error: erreurTypes } = await db.from('question').select('id, type').in('id', lignes.map((l) => l.question_id));
  if (erreurTypes || !types) throw erreurTypes ?? new Error('types introuvables');
  const typeDe = new Map(types.map((t) => [t.id, t.type]));
  const parQuestion = new Map(corriges.map((c) => [c.question_id, c.bonnes_reponses as (number | boolean)[]]));
  return lignes.map((ligne) => {
    const bonnes = parQuestion.get(ligne.question_id);
    if (!bonnes) throw new Error(`corrigé manquant pour ${ligne.question_id}`);
    // Vrai ou faux : « Vrai » est affiché en premier (indice 0), « Faux » en second, sans permutation.
    if (typeDe.get(ligne.question_id) === 'vrai_faux') return [bonnes[0] === true ? 0 : 1];
    return (bonnes as number[]).map((origine) => ligne.permutation.indexOf(origine));
  });
}

export async function validerTousLesChapitres(email: string, coursSlug: string) {
  const eleveId = await idProfil(email);
  const { data: cours } = await db.from('cours').select('chapitre(id)').eq('slug', coursSlug).single();
  if (!cours) throw new Error('cours introuvable');
  const lignes = cours.chapitre.map((c) => ({ eleve_id: eleveId, chapitre_id: c.id, meilleure_note: 100, valide: true }));
  const { error } = await db.from('progression_chapitre').upsert(lignes);
  if (error) throw error;
}

export async function idProfil(email: string): Promise<string> {
  const { data, error } = await db.from('profil').select('id').eq('email', email).single();
  if (error || !data) throw error ?? new Error(`profil introuvable : ${email}`);
  return data.id;
}

/** Passe le profil à admin_contenu (réservé aux tests : clé service_role, base locale uniquement). */
export async function rendreAdmin(email: string) {
  const { error } = await db.from('profil').update({ role: 'admin_contenu' }).eq('email', email);
  if (error) throw error;
}

/** Passe le profil à enseignant, comme après la validation d'une demande par l'admin (réservé aux tests). */
export async function rendreEnseignant(email: string) {
  const { error } = await db.from('profil').update({ role: 'enseignant', onboarding_termine: true, etablissement: 'Lycée de test' }).eq('email', email);
  if (error) throw error;
}

/** Questions d'une tentative, dans l'ordre d'affichage, avec leur type (réservé aux tests). */
export async function questionsDeTentative(tentativeId: string): Promise<{ id: string; type: string; propositions: string[] }[]> {
  const { data: lignes, error } = await db.from('tentative_question')
    .select('ordre, question_id').eq('tentative_id', tentativeId).order('ordre');
  if (error || !lignes) throw error ?? new Error('tentative introuvable');
  const { data: questions, error: erreurQuestions } = await db.from('question')
    .select('id, type, propositions').in('id', lignes.map((l) => l.question_id));
  if (erreurQuestions || !questions) throw erreurQuestions ?? new Error('questions introuvables');
  const parId = new Map(questions.map((q) => [q.id, q]));
  return lignes.map((l) => {
    const q = parId.get(l.question_id);
    if (!q) throw new Error(`question manquante : ${l.question_id}`);
    return { id: q.id, type: q.type, propositions: q.propositions as string[] };
  });
}
