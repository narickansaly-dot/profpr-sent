type Entree = {
  chapitres: { id: string; numero: number; titre: string }[];
  eleves: { id: string; nom: string; notes: Record<string, number | null>; evaluation: number | null }[];
};

// Un tableur exécute une cellule qui commence par = + - @ : on la préfixe d'une apostrophe.
function champ(valeur: string): string {
  const sur = /^[=+\-@\t\r]/.test(valeur) ? `'${valeur}` : valeur;
  return /[;"\r\n]/.test(sur) || sur !== valeur ? `"${sur.replace(/"/g, '""')}"` : sur;
}

function note(n: number | null | undefined): string {
  return n == null ? '' : String(Math.round(n * 100) / 100).replace('.', ',');
}

/** CSV lisible par Excel en français : point-virgule, virgule décimale, BOM UTF-8, fins de ligne CRLF. */
export function notesEnCsv({ chapitres, eleves }: Entree): string {
  const entete = ['Élève', ...chapitres.map((c) => `Ch. ${c.numero} – ${c.titre}`), 'Évaluation'].map(champ).join(';');
  const lignes = eleves.map((e) => [champ(e.nom), ...chapitres.map((c) => note(e.notes[c.id])), note(e.evaluation)].join(';'));
  return '﻿' + [entete, ...lignes].map((l) => l + '\r\n').join('');
}

/** Fragment de nom de fichier : minuscules, sans accents, seuls [a-z0-9-] sont gardés. */
export function slugFichier(nom: string): string {
  return nom.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'export';
}
