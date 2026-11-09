import { z } from 'zod';

export type AbonnementResume = { formule: 'mensuelle' | 'annuelle'; statut: string; finPeriode: string; finGrace: string | null; actif: boolean };

const schemaAbonnement = z.object({
  formule: z.enum(['mensuelle', 'annuelle']),
  statut: z.string(),
  fin_periode: z.string(),
  fin_grace: z.string().nullable().optional(),
  actif: z.boolean(),
});

/** Valide le JSON `abonnement` de mon_acces(). Format inattendu : null (pas d'abonnement). */
export function lireAbonnement(brut: unknown): AbonnementResume | null {
  const r = schemaAbonnement.safeParse(brut);
  if (!r.success) return null;
  const d = r.data;
  return { formule: d.formule, statut: d.statut, finPeriode: d.fin_periode, finGrace: d.fin_grace ?? null, actif: d.actif };
}

export type MonAcces = {
  role: string;
  enEssai: boolean;
  /** Nul quand l'accord parental manque (l'essai n'a pas commencé). */
  finEssai: string | null;
  coursGratuitId: string | null;
  changementPossibleJusquAu: string | null;
  consentementRequis: boolean;
  emailParent: string | null;
  consentementEnvoyeLe: string | null;
  abonnement: AbonnementResume | null;
  consentementRetireLe: string | null;
  suppressionPrevueLe: string | null;
};

export function abonne(a: MonAcces): boolean {
  return a.abonnement?.actif === true;
}

/** Même règle que peut_lire_cours côté base (affichage des cartes seulement : la base reste la seule à décider). */
export function coursOuvert(a: MonAcces, coursId: string): boolean {
  if (a.role !== 'eleve') return true;
  if (a.consentementRequis) return false;
  return abonne(a) || a.enEssai || a.coursGratuitId === coursId;
}

/** Nul `coursGratuitId` couvre aussi un cours choisi qui n'est plus publié. */
export function doitChoisirCours(a: MonAcces): boolean {
  return a.role === 'eleve' && !a.consentementRequis && !abonne(a) && !a.enEssai && a.coursGratuitId === null;
}
