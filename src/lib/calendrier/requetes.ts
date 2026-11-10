import { cache } from 'react';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { toutesLesLignes } from '@/lib/supabase/toutesLesLignes';
import { listerCoursDuProfil } from '@/lib/contenu/requetes';
import type { ChapitrePlan, Creneau } from '@/lib/planning/generer';

export type TypeOccurrence = 'revision' | 'devoir' | 'examen_reel' | 'echeance';
export type ChapitreLie = { id: string; slug: string; titre: string; numero: number };
export type OccurrenceCalendrier = {
  cle: string; evenement_id: string | null; type: TypeOccurrence; titre: string; debut: string; fin: string;
  cours_id: string | null; cours_titre: string | null; couleur: string | null; cours_slug: string | null;
  lecture_seule: boolean; revision_generale: boolean; plan_id: string | null; classe_nom: string | null;
  chapitres: ChapitreLie[];
};

const estUuid = (id: string) => z.string().uuid().safeParse(id).success;

export async function lireCalendrier(de: string, a: string): Promise<OccurrenceCalendrier[]> {
  const supabase = await creerClientServeur();
  const { data, error } = await toutesLesLignes((debut, fin) => supabase.rpc('mon_calendrier', { p_de: de, p_a: a }).range(debut, fin));
  if (error) throw new Error('Impossible de charger ton calendrier.');
  // chapitres arrive en Json brut et type en texte : on les type ici, en un seul endroit.
  return (data ?? []) as unknown as OccurrenceCalendrier[];
}

/** Les prochains événements et échéances des 14 jours à venir (ceux en cours compris). */
export async function prochainsEvenements(maintenant: Date, nombre = 5) {
  const a = new Date(maintenant.getTime() + 14 * 86_400_000).toISOString();
  return (await lireCalendrier(maintenant.toISOString(), a)).slice(0, nombre);
}

export const lireEvenement = cache(async (id: string) => {
  if (!estUuid(id)) return null;
  const supabase = await creerClientServeur();
  const { data } = await supabase.from('evenement')
    // Une seule chaîne littérale : supabase-js en déduit le type du résultat.
    .select('id, type, titre, debut, duree_minutes, cours_id, repetition, jours_semaine, repeter_jusqu_au, plan_id, revision_generale, delai_rappel_minutes, cours(slug, titre, couleur), evenement_chapitre(chapitre(id, slug, titre, numero))')
    .eq('id', id).maybeSingle();
  return data;
});

export async function chapitresDesCours(coursIds: string[]) {
  if (coursIds.length === 0) return [];
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.from('chapitre').select('id, cours_id, numero, titre')
    .in('cours_id', coursIds).eq('publie', true).order('numero');
  if (error) throw new Error('Impossible de charger les chapitres.');
  return data ?? [];
}

/** Tout ce qu'il faut pour calculer un planning : examen, plan existant, chapitres concernés et créneaux occupés. */
export async function lirePlanning(examenId: string, maintenant: Date) {
  const examen = await lireEvenement(examenId);
  if (!examen || examen.type !== 'examen_reel' || !examen.cours_id) return null;
  const passe = Date.parse(examen.debut) <= maintenant.getTime();
  const tropLoin = Date.parse(examen.debut) > maintenant.getTime() + 365 * 86_400_000;
  const supabase = await creerClientServeur();
  const [plan, chapitres, occupes] = await Promise.all([
    supabase.from('plan_revision').select('id, statut, sessions_par_semaine, duree_minutes, jours_preferes, heure_debut')
      .eq('examen_id', examenId).maybeSingle(),
    supabase.from('chapitre').select('id, numero, titre, progression_chapitre(valide, meilleure_note, valide_le)')
      .eq('cours_id', examen.cours_id).eq('publie', true).order('numero'),
    passe || tropLoin
      ? Promise.resolve({ data: [], error: null })
      : toutesLesLignes((de, a) => supabase.rpc('mes_creneaux_occupes', { p_de: maintenant.toISOString(), p_a: examen.debut }).range(de, a)),
  ]);
  if (plan.error || chapitres.error || occupes.error) throw new Error('Impossible de charger ton planning.');
  const sessions = plan.data
    ? await supabase.from('evenement').select('id, titre, debut, duree_minutes, revision_generale')
        .eq('plan_id', plan.data.id).gt('debut', maintenant.toISOString()).order('debut')
    : { data: [], error: null };
  if (sessions.error) throw new Error('Impossible de charger ton planning.');
  const choisis = new Set(examen.evenement_chapitre.map((ec) => ec.chapitre?.id).filter(Boolean));
  const liste: ChapitrePlan[] = (chapitres.data ?? [])
    .filter((c) => choisis.size === 0 || choisis.has(c.id))
    .map((c) => {
      const p = c.progression_chapitre[0];
      return {
        id: c.id, numero: c.numero, titre: c.titre, valide: p?.valide ?? false,
        meilleureNote: p?.meilleure_note == null ? null : Number(p.meilleure_note), valideLe: p?.valide_le ?? null,
      };
    });
  // Les sessions de ce plan ne bloquent pas : une réorganisation les remplace.
  const creneaux: Creneau[] = (occupes.data ?? [])
    .filter((o) => !plan.data || o.plan_id !== plan.data.id)
    .map((o) => ({ debut: o.debut, fin: o.fin }));
  return { examen, plan: plan.data, chapitres: liste, occupes: creneaux, passe, tropLoin, sessionsAVenir: sessions.data ?? [] };
}

export async function plansAReorganiser() {
  const supabase = await creerClientServeur();
  const { data } = await supabase.rpc('plans_a_reorganiser');
  // Au mieux : une erreur ici ne doit pas bloquer la page.
  return data ?? [];
}

export async function dateLienIcal(): Promise<string | null> {
  const supabase = await creerClientServeur();
  const { data } = await supabase.rpc('mon_jeton_ical');
  return data ?? null;
}

export type CoursOption = { id: string; titre: string; chapitres: { id: string; numero: number; titre: string }[] };

/** Cours de la filière de l'élève, avec leurs chapitres publiés, pour le formulaire d'événement. */
export async function optionsCours(): Promise<CoursOption[]> {
  const cours = await listerCoursDuProfil();
  const chapitres = await chapitresDesCours(cours.map((c) => c.id));
  return cours.map((c) => ({
    id: c.id, titre: c.titre,
    chapitres: chapitres.filter((ch) => ch.cours_id === c.id).map(({ id, numero, titre }) => ({ id, numero, titre })),
  }));
}
