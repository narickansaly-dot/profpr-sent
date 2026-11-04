import { texteReponse, type TypeQuestion } from '@/lib/quiz/reponse';

function liste<T>(valeur: unknown, garde: (v: unknown) => v is T): T[] {
  return Array.isArray(valeur) && valeur.every(garde) ? valeur : [];
}
const estTexte = (v: unknown): v is string => typeof v === 'string';
const estNombre = (v: unknown): v is number => typeof v === 'number';

/** La fonction SQL ne renvoie pas le type : on le déduit de la forme du corrigé. */
export function typeDepuisCorrige(propositions: unknown, bonnes: unknown): TypeQuestion {
  if (Array.isArray(bonnes) && typeof bonnes[0] === 'boolean') return 'vrai_faux';
  const indices = liste(bonnes, estNombre);
  if (indices.length === 0 || liste(propositions, estTexte).length === 0) return 'reponse_courte';
  return indices.length > 1 ? 'qcm_multiple' : 'qcm_unique';
}

/** Bonne réponse en clair, avec les propositions dans l’ordre d’origine. */
export function bonneReponseTexte(propositions: unknown, bonnes: unknown, acceptees: string[]): string {
  const type = typeDepuisCorrige(propositions, bonnes);
  if (type === 'reponse_courte') return acceptees.join(' ; ') || 'Non disponible';
  const valeur = type === 'vrai_faux' ? (bonnes as boolean[]) : liste(bonnes, estNombre);
  return texteReponse(type, liste(propositions, estTexte), valeur);
}
