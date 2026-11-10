const dateLongue = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });

export function formaterDate(iso: string): string {
  return dateLongue.format(new Date(iso));
}

/** Code parent saisi : sans espaces ni tirets, en majuscules. */
export function normaliserCode(saisie: string): string {
  return saisie.replace(/[\s-]+/g, '').toUpperCase();
}

export type EntreeConsentement = {
  moins15: boolean;
  donneLe: string | null;
  retireLe: string | null;
  suppressionPrevueLe: string | null;
};

export function etatConsentement(e: EntreeConsentement): string {
  if (!e.moins15) return 'Plus de 15 ans : aucun accord n’est nécessaire.';
  if (e.retireLe) {
    const base = `Accord retiré le ${formaterDate(e.retireLe)}.`;
    return e.suppressionPrevueLe ? `${base} Le compte sera supprimé le ${formaterDate(e.suppressionPrevueLe)}.` : base;
  }
  if (e.donneLe) return `Accord donné le ${formaterDate(e.donneLe)}.`;
  return 'Accord en attente.';
}

export type LigneResume = { chapitresValides: number; chapitresTotal: number; derniereActivite: string | null };

export function resumeProgression(lignes: LigneResume[]): { valides: number; total: number; derniereActivite: string | null } {
  let derniere: string | null = null;
  for (const l of lignes) {
    if (l.derniereActivite && (!derniere || new Date(l.derniereActivite) > new Date(derniere))) derniere = l.derniereActivite;
  }
  return {
    valides: lignes.reduce((s, l) => s + l.chapitresValides, 0),
    total: lignes.reduce((s, l) => s + l.chapitresTotal, 0),
    derniereActivite: derniere,
  };
}

export type ResumeProgression = ReturnType<typeof resumeProgression>;

/** Résultat d'une lecture de progression : null quand la lecture a échoué (« progression indisponible »). */
export function resumeDepuisResultat(r: PromiseSettledResult<LigneResume[]>): ResumeProgression | null {
  return r.status === 'fulfilled' ? resumeProgression(r.value) : null;
}

/** Explication de « Ne plus suivre cet enfant » : avant 15 ans, le lien ne peut pas être recréé automatiquement. */
export function explicationDeliaison(moins15: boolean): string {
  return moins15
    ? 'Vous ne verrez plus la progression de cet enfant. Ce lien ne pourra pas être recréé automatiquement.'
    : 'Vous ne verrez plus la progression de cet enfant. Pour le suivre de nouveau, il faudra un nouveau code.';
}
