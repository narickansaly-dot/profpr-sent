/**
 * Limite d'un fichier d'import. Elle reste sous `bodySizeLimit` (4 Mo, next.config.ts) avec de la marge pour
 * l'enveloppe multipart : un fichier accepté ici n'échoue jamais sur l'erreur du framework. Un cours fait ~250 Ko.
 * Module sans dépendance : importé aussi par le formulaire (navigateur).
 */
export const TAILLE_MAX_IMPORT = 3 * 1024 * 1024;
export const TAILLE_MAX_LIBELLE = '3 Mo';
