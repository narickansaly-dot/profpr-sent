import 'server-only';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { lireAbonnement, type AbonnementResume } from '@/lib/acces/etat';

export type Enfant = {
  eleveId: string;
  nom: string;
  niveau: string;
  moins15: boolean;
  donneLe: string | null;
  retireLe: string | null;
  retireParMoi: boolean;
  suppressionPrevueLe: string | null;
  origine: string;
  lieLe: string;
  abonnement: AbonnementResume | null;
};

export type LigneProgression = {
  coursId: string;
  titre: string;
  chapitresValides: number;
  chapitresTotal: number;
  meilleureNote: number | null;
  coursValide: boolean;
  derniereActivite: string | null;
};

export async function lireEnfants(): Promise<Enfant[]> {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('enfants_du_parent');
  if (error) throw new Error(messageErreur(error.message));
  return (data ?? []).map((l) => ({
    eleveId: l.eleve_id,
    nom: l.nom?.trim() || 'Enfant sans prénom',
    niveau: l.niveau,
    moins15: l.moins_de_15_ans,
    donneLe: l.consentement_donne_le ?? null,
    retireLe: l.consentement_retire_le ?? null,
    retireParMoi: l.retire_par_moi,
    suppressionPrevueLe: l.suppression_prevue_le ?? null,
    origine: l.origine,
    lieLe: l.lie_le,
    abonnement: l.abonnement ? lireAbonnement(l.abonnement) : null,
  }));
}

export async function lireProgressionEnfant(id: string): Promise<LigneProgression[]> {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('progression_enfant', { p_eleve: id });
  if (error) throw new Error(messageErreur(error.message));
  return (data ?? []).map((l) => ({
    coursId: l.cours_id,
    titre: l.titre,
    chapitresValides: l.chapitres_valides,
    chapitresTotal: l.chapitres_total,
    meilleureNote: l.meilleure_note ?? null,
    coursValide: l.cours_valide,
    derniereActivite: l.derniere_activite ?? null,
  }));
}
