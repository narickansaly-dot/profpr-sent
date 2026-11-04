import { cache } from 'react';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { lireProfil } from '@/lib/supabase/utilisateur';
import { etatEvaluation, type StatutTentative } from './regles';
import type { ReponseAffichee, TypeQuestion } from './reponse';

const estUuid = (id: string) => z.string().uuid().safeParse(id).success;

export type QuestionAffichee = {
  ordre: number; question_id: string; type: TypeQuestion; enonce: string;
  propositions: string[]; reponse: ReponseAffichee | null;
};

export const lireTentative = cache(async (id: string) => {
  if (!estUuid(id)) return null;
  const supabase = await creerClientServeur();
  // Appelée en premier : elle clôt la tentative si son temps est écoulé.
  const { data: questions, error } = await supabase.rpc('questions_tentative', { p_tentative: id });
  if (error || !questions) return null;
  const { data: t } = await supabase.from('tentative')
    .select('id, type, statut, nb_questions, date_limite, note, reussie, fin, cours(slug, titre, couleur), chapitre(id, slug, titre)')
    .eq('id', id).single();
  if (!t) return null;
  return { ...t, questions: questions as unknown as QuestionAffichee[] };
});

/**
 * Statut d'une tentative lu directement dans la table (RLS : ses propres lignes seulement).
 * Sert de repli quand `lireTentative` ou `lireCorrection` échouent, sans passer par une RPC qui refuse les tentatives terminées.
 */
export async function lireStatutTentative(id: string) {
  if (!estUuid(id)) return null;
  const supabase = await creerClientServeur();
  const { data: t } = await supabase.from('tentative')
    .select('statut, cours_id, cours(slug, titre, couleur)').eq('id', id).maybeSingle();
  if (!t) return null;
  let evaluationOuverte = false;
  if (t.statut !== 'en_cours') {
    const { data: ouverte } = await supabase.from('tentative').select('id')
      .eq('type', 'evaluation_cours').eq('statut', 'en_cours').eq('cours_id', t.cours_id).limit(1);
    evaluationOuverte = (ouverte?.length ?? 0) > 0;
  }
  return { statut: t.statut, cours: t.cours, evaluationOuverte };
}

export type LigneCorrection = {
  ordre: number; type: TypeQuestion; enonce: string; propositions: string[];
  reponse: ReponseAffichee | null; bonnes_reponses: ReponseAffichee | null;
  reponses_acceptees: string[]; explication: string; correcte: boolean;
};

export async function lireCorrection(id: string) {
  if (!estUuid(id)) return null;
  const supabase = await creerClientServeur();
  const { data: lignes, error } = await supabase.rpc('correction_tentative', { p_tentative: id });
  if (error || !lignes) return null;
  const { data: t } = await supabase.from('tentative')
    .select('id, type, statut, nb_questions, note, reussie, fin, cours(slug, titre, couleur), chapitre(id, slug, titre)')
    .eq('id', id).single();
  // La RPC renvoie du Json brut : on le type ici, en un seul endroit.
  return t ? { ...t, lignes: lignes as unknown as LigneCorrection[] } : null;
}

export async function infosQuizChapitre(chapitreId: string) {
  const supabase = await creerClientServeur();
  const [{ count, error: e1 }, { data: progression, error: e2 }, { data: enCours, error: e3 }] = await Promise.all([
    // Les élèves ne peuvent lire que id, chapitre_id, notion_id, type, statut, difficulte sur question.
    supabase.from('question').select('id', { count: 'exact', head: true }).eq('chapitre_id', chapitreId).eq('statut', 'valide'),
    supabase.from('progression_chapitre').select('meilleure_note, valide, lu').eq('chapitre_id', chapitreId).maybeSingle(),
    supabase.from('tentative').select('id').eq('chapitre_id', chapitreId).eq('statut', 'en_cours').maybeSingle(),
  ]);
  if (e1 || e2 || e3) throw new Error('Impossible de charger ce quiz.');
  return { disponibles: count ?? 0, progression, tentativeEnCours: enCours?.id ?? null };
}

export async function progressionDuCours(coursId: string, chapitreIds: string[]) {
  const supabase = await creerClientServeur();
  // Au mieux : une erreur ici ne doit pas bloquer l'affichage.
  await supabase.rpc('cloturer_mes_tentatives_expirees');
  const [{ data: chapitres, error: e1 }, { data: cours, error: e2 }, { data: essais, error: e3 }] = await Promise.all([
    supabase.from('progression_chapitre').select('chapitre_id, meilleure_note, valide').in('chapitre_id', chapitreIds),
    supabase.from('progression_cours').select('meilleure_note, valide, essais').eq('cours_id', coursId).maybeSingle(),
    supabase.from('tentative').select('id, statut, fin, note').eq('cours_id', coursId).eq('type', 'evaluation_cours')
      .order('debut', { ascending: false }),
  ]);
  if (e1 || e2 || e3) throw new Error('Impossible de charger ta progression.');
  const parChapitre = new Map((chapitres ?? []).map((p) => [p.chapitre_id, p]));
  const nbValides = chapitreIds.filter((id) => parChapitre.get(id)?.valide).length;
  return {
    parChapitre, nbValides, cours, essais: essais ?? [],
    evaluation: etatEvaluation({
      nbChapitres: chapitreIds.length, nbValides,
      essais: (essais ?? []).map((e) => ({ id: e.id, statut: e.statut as StatutTentative, fin: e.fin })),
      maintenant: new Date(),
    }),
  };
}

export async function lireTableauDeBord() {
  const profil = await lireProfil();
  if (!profil) return null;
  const supabase = await creerClientServeur();
  // Au mieux : une erreur ici ne doit pas bloquer l'affichage.
  await supabase.rpc('cloturer_mes_tentatives_expirees');
  const [valides, examens, derniers, faibles, serie] = await Promise.all([
    supabase.from('progression_chapitre').select('chapitre!inner(cours_id)').eq('valide', true),
    supabase.from('progression_cours').select('meilleure_note, valide, essais, dernier_essai, cours(slug, titre, couleur)')
      .order('dernier_essai', { ascending: false, nullsFirst: false }),
    supabase.from('tentative').select('id, type, note, reussie, fin, cours(slug, titre, couleur), chapitre(titre)')
      .neq('statut', 'en_cours').order('fin', { ascending: false }).limit(5),
    supabase.rpc('points_faibles', { p_limite: 5 }),
    supabase.rpc('serie_jours'),
  ]);
  if (valides.error || examens.error || derniers.error || faibles.error || serie.error) {
    throw new Error('Impossible de charger ton tableau de bord.');
  }
  const validesParCours = new Map<string, number>();
  for (const v of valides.data ?? []) {
    const coursId = v.chapitre.cours_id;
    validesParCours.set(coursId, (validesParCours.get(coursId) ?? 0) + 1);
  }
  return {
    prenom: profil.nom,
    validesParCours,
    examens: examens.data ?? [],
    derniers: derniers.data ?? [],
    pointsFaibles: faibles.data ?? [],
    serie: serie.data ?? 0,
  };
}
