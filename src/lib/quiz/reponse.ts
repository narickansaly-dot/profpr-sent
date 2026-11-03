export type TypeQuestion = 'qcm_unique' | 'qcm_multiple' | 'vrai_faux' | 'reponse_courte';
/** Réponse dans l'ordre d'affichage : indices des propositions, [vrai|faux] ou [texte]. */
export type ReponseAffichee = number[] | boolean[] | string[];

export function basculerChoix(actuelle: number[] | null, index: number): number[] | null {
  const choix = new Set(actuelle ?? []);
  if (choix.has(index)) choix.delete(index); else choix.add(index);
  return choix.size === 0 ? null : [...choix].sort((a, b) => a - b);
}

export function estRepondue(reponse: ReponseAffichee | null | undefined): boolean {
  if (!Array.isArray(reponse) || reponse.length === 0) return false;
  return typeof reponse[0] !== 'string' || reponse[0].trim() !== '';
}

export function texteReponse(type: TypeQuestion, propositions: string[], valeur: ReponseAffichee | null): string {
  if (!estRepondue(valeur)) return 'Pas de réponse';
  switch (type) {
    case 'qcm_unique':
    case 'qcm_multiple':
      return (valeur as number[]).map((i) => propositions[i]).join(' ; ');
    case 'vrai_faux':
      return (valeur as boolean[])[0] ? 'Vrai' : 'Faux';
    case 'reponse_courte':
      return (valeur as string[])[0];
  }
}

export function formaterNote(note: number): string {
  const arrondi = Math.round(note * 10) / 10;
  return `${String(arrondi).replace('.', ',')} %`;
}
