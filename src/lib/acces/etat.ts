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
};

/** Même règle que peut_lire_cours côté base (affichage des cartes seulement : la base reste la seule à décider). */
export function coursOuvert(a: MonAcces, coursId: string): boolean {
  if (a.role !== 'eleve') return true;
  if (a.consentementRequis) return false;
  return a.enEssai || a.coursGratuitId === coursId;
}

/** Nul `coursGratuitId` couvre aussi un cours choisi qui n'est plus publié. */
export function doitChoisirCours(a: MonAcces): boolean {
  return a.role === 'eleve' && !a.consentementRequis && !a.enEssai && a.coursGratuitId === null;
}
