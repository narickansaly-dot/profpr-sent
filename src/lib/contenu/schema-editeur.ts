import { z } from 'zod';
import { schemaChapitreImport } from './format-import';

/** Identifiant de section ou de contenu : même motif que celui que garde nettoyerHtml. */
export const MOTIF_ID = /^[a-z][a-z0-9-]{0,63}$/;

const base = schemaChapitreImport.shape;

/** Schéma de l'éditeur de chapitre : celui de l'import, sans les questions, avec des identifiants de section plus stricts. */
export const schemaChapitreEditeur = z.object({
  slug: base.slug,
  numero: base.numero,
  titre: base.titre,
  titre_court: base.titre_court,
  duree: base.duree,
  resume: base.resume,
  chapeau: base.chapeau,
  objectifs: base.objectifs,
  sections: z.array(z.object({
    id: z.string().regex(MOTIF_ID, 'Un identifiant de section commence par une lettre minuscule et ne contient que des minuscules, des chiffres et des tirets.').max(64),
    titre: z.string().trim().min(1, 'Chaque section a besoin d’un titre.').max(200),
    html: z.string().max(200000),
  })).max(40),
  a_retenir: base.a_retenir,
}).refine((ch) => new Set(ch.sections.map((s) => s.id)).size === ch.sections.length, {
  message: 'Deux sections ont le même identifiant.', path: ['sections'],
});

export type ChapitreEditeur = z.infer<typeof schemaChapitreEditeur>;

/** Inventaire des balises d'un fragment HTML : nom en minuscules -> nombre d'ouvertures. */
export function inventaireBalises(html: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of html.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)\b/g)) {
    const n = r[1].toLowerCase();
    m.set(n, (m.get(n) ?? 0) + 1);
  }
  return m;
}

/** Balises présentes avant nettoyage et absentes ou moins nombreuses après : « script ×1 ». */
export function balisesRetirees(avant: string, apres: string): string[] {
  const a = inventaireBalises(avant);
  const b = inventaireBalises(apres);
  return [...a].flatMap(([nom, n]) => (n > (b.get(nom) ?? 0) ? [`${nom} ×${n - (b.get(nom) ?? 0)}`] : []));
}
