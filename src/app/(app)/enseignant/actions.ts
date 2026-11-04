'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { exigerEnseignant } from '@/lib/enseignant/garde';
import { heureParisVersIso } from '@/lib/enseignant/dates';
import { NIVEAUX } from '@/lib/profil/onboarding';
import type { Database } from '@/lib/supabase/types';

// Les états renvoient les valeurs soumises : React 19 vide les champs non contrôlés après une action, on les réaffiche en cas d'erreur.
export type EtatClasse = { erreur?: string; nom?: string; filiereId?: string; niveau?: string; cours?: string[] };
export type EtatCours = { erreur?: string; info?: string; cours?: string[] };
export type EtatEcheance = { erreur?: string; info?: string; ouverture?: string; limite?: string };
export type EtatSimple = { erreur?: string };

const uuid = z.string().uuid();
const optionnel = (v: FormDataEntryValue | null) => (typeof v === 'string' && v !== '' ? v : undefined);

const schemaClasse = z.object({
  nom: z.string().trim().min(2, 'Le nom de la classe doit faire entre 2 et 60 caractères.').max(60, 'Le nom de la classe doit faire entre 2 et 60 caractères.'),
  filiereId: uuid.optional(),
  niveau: z.enum(NIVEAUX).optional(),
  cours: z.array(uuid).min(1, 'Choisis au moins un cours.'),
});

export async function creerClasse(_: EtatClasse, form: FormData): Promise<EtatClasse> {
  await exigerEnseignant();
  const nom = String(form.get('nom') ?? '');
  const saisie = { nom, filiereId: String(form.get('filiereId') ?? ''), niveau: String(form.get('niveau') ?? ''), cours: form.getAll('cours').map(String) };
  const r = schemaClasse.safeParse({
    nom, filiereId: optionnel(form.get('filiereId')), niveau: optionnel(form.get('niveau')), cours: form.getAll('cours'),
  });
  if (!r.success) return { erreur: r.error.issues[0]?.message ?? messageErreur(undefined), ...saisie };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('creer_classe', {
    p_nom: r.data.nom,
    // La fonction SQL accepte null (filière et niveau facultatifs) ; les types générés l'ignorent.
    p_filiere: (r.data.filiereId ?? null) as string,
    p_niveau: (r.data.niveau ?? null) as string,
    p_cours: r.data.cours,
  });
  if (error || !data) return { erreur: messageErreur(error?.message), ...saisie };
  revalidatePath('/enseignant');
  redirect(`/enseignant/classes/${data}`);
}

export async function regenererCode(_: EtatSimple, form: FormData): Promise<EtatSimple> {
  await exigerEnseignant();
  const id = uuid.safeParse(form.get('classe'));
  if (!id.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('regenerer_code_classe', { p_classe: id.data });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath(`/enseignant/classes/${id.data}`);
  revalidatePath('/enseignant');
  return {};
}

export async function definirCours(_: EtatCours, form: FormData): Promise<EtatCours> {
  await exigerEnseignant();
  const r = z.object({ classe: uuid, cours: z.array(uuid).min(1, 'Choisis au moins un cours.') })
    .safeParse({ classe: form.get('classe'), cours: form.getAll('cours') });
  const cours = form.getAll('cours').map(String);
  if (!r.success) return { erreur: r.error.issues[0]?.message ?? messageErreur(undefined), cours };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('definir_cours_classe', { p_classe: r.data.classe, p_cours: r.data.cours });
  if (error) return { erreur: messageErreur(error.message), cours };
  revalidatePath(`/enseignant/classes/${r.data.classe}`);
  revalidatePath('/enseignant');
  return { info: 'Cours enregistrés.' };
}

type ArgsEcheance = Database['public']['Functions']['definir_echeance']['Args'];

export async function definirEcheance(_: EtatEcheance, form: FormData): Promise<EtatEcheance> {
  await exigerEnseignant();
  const r = z.object({ classe: uuid, cours: uuid, ouverture: z.string().max(40), limite: z.string().max(40) })
    .safeParse({ classe: form.get('classe'), cours: form.get('cours'), ouverture: String(form.get('ouverture') ?? ''), limite: String(form.get('limite') ?? '') });
  const saisie = { ouverture: String(form.get('ouverture') ?? ''), limite: String(form.get('limite') ?? '') };
  if (!r.success) return { erreur: messageErreur(undefined), ...saisie };
  const ouverture = heureParisVersIso(r.data.ouverture);
  const limite = heureParisVersIso(r.data.limite);
  // Une valeur saisie mais illisible n'est pas « vide » : on refuse plutôt que de supprimer l'échéance.
  if ((r.data.ouverture.trim() && !ouverture) || (r.data.limite.trim() && !limite)) return { erreur: messageErreur('dates_invalides'), ...saisie };
  const supabase = await creerClientServeur();
  const args = { p_classe: r.data.classe, p_cours: r.data.cours, p_ouverture: ouverture, p_limite: limite } as unknown as ArgsEcheance;
  const { error } = await supabase.rpc('definir_echeance', args);
  if (error) return { erreur: messageErreur(error.message), ...saisie };
  revalidatePath(`/enseignant/classes/${r.data.classe}`);
  return { info: ouverture || limite ? 'Échéance enregistrée.' : 'Échéance retirée.' };
}

export async function retirerEleve(_: EtatSimple, form: FormData): Promise<EtatSimple> {
  await exigerEnseignant();
  const r = z.object({ classe: uuid, eleve: uuid }).safeParse({ classe: form.get('classe'), eleve: form.get('eleve') });
  if (!r.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('retirer_eleve', { p_classe: r.data.classe, p_eleve: r.data.eleve });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath(`/enseignant/classes/${r.data.classe}`);
  revalidatePath('/enseignant');
  return {};
}
