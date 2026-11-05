/**
 * Identifiant de section ou de contenu : minuscules, chiffres et tirets, commence par une lettre, 64 caractères au plus.
 * Même motif dans nettoyerHtml (anti DOM clobbering, ex. __next_f), les schémas zod et la base (valider_chapitre).
 */
export const MOTIF_ID = /^[a-z][a-z0-9-]{0,63}$/;

/** Identifiant réservé au bloc « Je retiens » de la page de chapitre. */
export const ID_RESERVE = 'a-retenir';

export const MESSAGE_ID_RESERVE = `L’identifiant « ${ID_RESERVE} » est réservé au bloc « Je retiens ».`;

/** Vrai si `id` peut servir d'identifiant de section. */
export function idSectionValide(id: string): boolean {
  return MOTIF_ID.test(id) && id !== ID_RESERVE;
}
