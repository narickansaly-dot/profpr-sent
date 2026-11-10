'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { appelerAvecRelance } from '@/lib/supabase/rpc';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lirePlanning } from '@/lib/calendrier/requetes';
import { lireFormulaireEvenement, type ChampEvenement, type ValeursEvenement } from '@/lib/calendrier/schema-evenement';
import { jourParis } from '@/lib/calendrier/dates';
import { genererPlanning, type Planning, type Reglages } from '@/lib/planning/generer';
import { lireReglages, versReglagesRpc, type ChampReglages } from '@/lib/planning/reglages';
import { urlDuSite } from '@/lib/site';
import type { Json } from '@/lib/supabase/types';

export type EtatEvenement = { erreur?: string; champ?: ChampEvenement; valeurs?: ValeursEvenement };
/** Saisie du formulaire de réglages, renvoyée telle quelle pour ne rien faire perdre à l'élève. */
export type ValeursPlanning = { sessions: string; duree: string; jours: string[]; heure: string };
export type EtatPlanning = { erreur?: string; champ?: ChampReglages; apercu?: Planning; reglages?: Reglages; valeurs?: ValeursPlanning };
export type EtatLien = { erreur?: string; lien?: string };
export type EtatSimple = { erreur?: string };

const uuid = z.string().uuid();

function valeursPlanning(form: FormData): ValeursPlanning {
  return {
    sessions: String(form.get('sessions') ?? ''), duree: String(form.get('duree') ?? ''),
    jours: form.getAll('jours').map(String), heure: String(form.get('heure') ?? ''),
  };
}

function revaliderCalendrier() {
  revalidatePath('/calendrier', 'layout');
  revalidatePath('/');
}

export async function enregistrerEvenement(_: EtatEvenement, form: FormData): Promise<EtatEvenement> {
  await exigerEleve();
  const idBrut = form.get('id');
  const id = idBrut ? uuid.safeParse(idBrut) : null;
  const lu = lireFormulaireEvenement(form);
  if (id && !id.success) return { erreur: messageErreur(undefined), valeurs: lu.valeurs };
  if (!lu.ok) return { erreur: lu.erreur, champ: lu.champ, valeurs: lu.valeurs };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('enregistrer_evenement', {
    // La fonction SQL accepte null (création) ; les types générés l'ignorent.
    p_id: (id?.data ?? null) as string,
    p: lu.donnees as unknown as Json,
  });
  if (error || !data) {
    const champ: ChampEvenement | undefined = error?.message.includes('repetition_invalide') ? 'jusqu'
      : error?.message.includes('cours_indisponible') ? 'cours'
      : error?.message.includes('chapitres_invalides') ? 'chapitres' : undefined;
    return { erreur: messageErreur(error?.message), champ, valeurs: lu.valeurs };
  }
  // Le rappel se règle à part ; l'événement est déjà enregistré, un échec ici n'est pas bloquant.
  const rappel = await supabase.rpc('regler_rappel_evenement', { p_id: data, p_delai: lu.rappel as number });
  if (rappel.error) console.error('regler_rappel_evenement', rappel.error.message);
  revaliderCalendrier();
  if (!id && lu.donnees.type === 'examen_reel' && lu.donnees.cours_id) redirect(`/calendrier/${data}/planning`);
  redirect(`/calendrier?vue=semaine&date=${lu.valeurs.jour}`);
}

export async function supprimerEvenement(_: EtatSimple, form: FormData): Promise<EtatSimple> {
  await exigerEleve();
  const id = uuid.safeParse(form.get('id'));
  if (!id.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('supprimer_evenement', { p_id: id.data });
  if (error) return { erreur: messageErreur(error.message) };
  revaliderCalendrier();
  redirect('/calendrier');
}

/** Recalcule le planning côté serveur : l'aperçu et l'acceptation passent par le même calcul. */
async function calculer(form: FormData): Promise<
  { ok: false; etat: EtatPlanning } | { ok: true; examenId: string; reglages: Reglages; planning: Planning; valeurs: ValeursPlanning }> {
  const valeurs = valeursPlanning(form);
  const examen = uuid.safeParse(form.get('examen'));
  if (!examen.success) return { ok: false, etat: { erreur: messageErreur('examen_introuvable'), valeurs } };
  const r = lireReglages(form);
  if (!r.ok) return { ok: false, etat: { erreur: r.erreur, champ: r.champ, valeurs } };
  const maintenant = new Date();
  const donnees = await lirePlanning(examen.data, maintenant);
  if (!donnees) return { ok: false, etat: { erreur: messageErreur('examen_introuvable'), valeurs } };
  if (donnees.passe) return { ok: false, etat: { erreur: messageErreur('examen_passe'), reglages: r.reglages, valeurs } };
  if (donnees.tropLoin) {
    return { ok: false, etat: { erreur: 'Ton examen est dans plus d’un an. Reviens plus tard pour ton planning.', reglages: r.reglages, valeurs } };
  }
  const planning = genererPlanning({
    maintenant, examenDebut: donnees.examen.debut, chapitres: donnees.chapitres, reglages: r.reglages, occupes: donnees.occupes,
  });
  return { ok: true, examenId: examen.data, reglages: r.reglages, planning, valeurs };
}

export async function apercuPlanning(_: EtatPlanning, form: FormData): Promise<EtatPlanning> {
  await exigerEleve();
  const c = await calculer(form);
  if (!c.ok) return c.etat;
  return { apercu: c.planning, reglages: c.reglages, valeurs: c.valeurs };
}

export async function accepterPlanning(_: EtatPlanning, form: FormData): Promise<EtatPlanning> {
  await exigerEleve();
  const c = await calculer(form);
  if (!c.ok) return c.etat;
  if (c.planning.sessions.length === 0) return { erreur: 'Ce planning ne contient aucune session.', apercu: c.planning, reglages: c.reglages, valeurs: c.valeurs };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('accepter_plan_revision', {
    p_examen: c.examenId,
    p_reglages: versReglagesRpc(c.reglages),
    p_sessions: c.planning.sessions.map((s) => ({
      titre: s.titre, debut: s.debut, duree_minutes: s.dureeMinutes, chapitres: s.chapitres, revision_generale: s.revisionGenerale,
    })),
  });
  if (error) return { erreur: messageErreur(error.message), apercu: c.planning, reglages: c.reglages, valeurs: c.valeurs };
  revaliderCalendrier();
  redirect(`/calendrier?vue=semaine&date=${jourParis(new Date(c.planning.sessions[0].debut))}`);
}

export async function refuserPlanning(_: EtatPlanning, form: FormData): Promise<EtatPlanning> {
  await exigerEleve();
  const examen = uuid.safeParse(form.get('examen'));
  const r = lireReglages(form);
  if (!examen.success || !r.ok) return { erreur: r.ok ? messageErreur(undefined) : r.erreur, champ: r.ok ? undefined : r.champ, valeurs: valeursPlanning(form) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('refuser_plan_revision', { p_examen: examen.data, p_reglages: versReglagesRpc(r.reglages) });
  if (error) return { erreur: messageErreur(error.message), valeurs: valeursPlanning(form) };
  revaliderCalendrier();
  redirect('/calendrier');
}

export async function ignorerReorganisation(form: FormData): Promise<void> {
  await exigerEleve();
  const plan = uuid.safeParse(form.get('plan'));
  if (!plan.success) return;
  const supabase = await creerClientServeur();
  await supabase.rpc('ignorer_reorganisation', { p_plan: plan.data });
  revaliderCalendrier();
}

export async function lancerRevisionGenerale(_: EtatSimple, form: FormData): Promise<EtatSimple> {
  await exigerEleve();
  const id = uuid.safeParse(form.get('evenement'));
  if (!id.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { data, error } = await appelerAvecRelance(() => supabase.rpc('demarrer_revision_generale', { p_evenement: id.data }));
  if (error || !data) return { erreur: messageErreur(error?.message) };
  redirect(`/tentative/${data}`);
}

export async function creerLienIcal(): Promise<EtatLien> {
  await exigerEleve();
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('creer_jeton_ical');
  if (error || !data) return { erreur: messageErreur(error?.message) };
  revalidatePath('/calendrier/partage');
  return { lien: `${await urlDuSite()}/ical/${data}.ics` };
}

export async function revoquerLienIcal(): Promise<EtatLien> {
  await exigerEleve();
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('revoquer_jeton_ical');
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/calendrier/partage');
  return {};
}
