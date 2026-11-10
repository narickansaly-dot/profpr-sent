export const TYPES_QUESTION = [
  ['qcm_unique', 'QCM, une seule réponse'],
  ['qcm_multiple', 'QCM, plusieurs réponses'],
  ['vrai_faux', 'Vrai ou faux'],
  ['reponse_courte', 'Réponse courte'],
] as const;
export const LIBELLE_TYPE: Record<string, string> = Object.fromEntries(TYPES_QUESTION);
export const LIBELLE_DIFFICULTE: Record<number, string> = { 1: 'Facile', 2: 'Moyenne', 3: 'Difficile' };
export const LIBELLE_STATUT: Record<string, string> = { brouillon: 'Brouillon', a_relire: 'À relire', valide: 'Validée' };
export const CLASSE_STATUT: Record<string, string> = { brouillon: 'statut-brouillon', a_relire: 'statut-relire', valide: 'statut-publie' };

/** Messages de confirmation après une redirection (liste blanche : le paramètre d'URL n'est jamais affiché tel quel). */
export const CONFIRMATIONS_QUESTION: Record<string, string> = {
  cree: 'La question est créée en brouillon.',
  modifiee: 'La question est enregistrée.',
  version: 'Nouvelle version créée : l’ancienne reste dans les corrections passées.',
  brouillon: 'La question est repassée en brouillon.',
  a_relire: 'La question est en relecture.',
  valide: 'La question est validée : elle peut être tirée dans les quiz.',
};

export function tronquer(t: string, n: number) {
  const s = t.replace(/\s+/g, ' ').trim();
  return s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
}
