import { texteReponse, type TypeQuestion } from '@/lib/quiz/reponse';

function liste<T>(valeur: unknown, garde: (v: unknown) => v is T): T[] {
  return Array.isArray(valeur) && valeur.every(garde) ? valeur : [];
}
const estTexte = (v: unknown): v is string => typeof v === 'string';
const estNombre = (v: unknown): v is number => typeof v === 'number';
const estBooleen = (v: unknown): v is boolean => typeof v === 'boolean';

/** Bonne réponse en clair, avec les propositions dans l’ordre d’origine. */
export function bonneReponseTexte(type: TypeQuestion, propositions: unknown, bonnes: unknown, acceptees: string[]): string {
  if (type === 'reponse_courte') return acceptees.join(' ; ') || 'Non disponible';
  const valeur = type === 'vrai_faux' ? liste(bonnes, estBooleen) : liste(bonnes, estNombre);
  if (valeur.length === 0) return 'Non disponible';
  return texteReponse(type, liste(propositions, estTexte), valeur);
}
