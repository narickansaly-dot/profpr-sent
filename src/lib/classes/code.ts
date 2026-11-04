/** Alphabet des codes de classe : sans 0, 1, I, L, O (ambigus). Identique à la contrainte de la base. */
const CODE_VALIDE = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;

/** Majuscules, sans espace ni symbole, 12 caractères au plus (la base normalise aussi de son côté). */
export function normaliserCode(brut: string): string {
  return brut.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 12);
}

export function codeClasseValide(brut: string): boolean {
  return CODE_VALIDE.test(normaliserCode(brut));
}
