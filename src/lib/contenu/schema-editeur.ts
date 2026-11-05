import { z } from 'zod';
import { schemaChapitreImport } from './format-import';
import { ID_RESERVE, MESSAGE_ID_RESERVE, MOTIF_ID } from './identifiant';

export { MOTIF_ID } from './identifiant';

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
    id: z.string().regex(MOTIF_ID, 'Un identifiant de section commence par une lettre minuscule et ne contient que des minuscules, des chiffres et des tirets.').max(64)
      .refine((id) => id !== ID_RESERVE, MESSAGE_ID_RESERVE),
    titre: z.string().trim().min(1, 'Chaque section a besoin d’un titre.').max(200),
    html: z.string().max(200000, 'Le HTML de la section est trop long (200 000 caractères au maximum).'),
  })).max(40, 'Un chapitre compte 40 sections au maximum.'),
  a_retenir: base.a_retenir,
}).superRefine((ch, ctx) => {
  const vus = new Set<string>();
  ch.sections.forEach((s, i) => {
    if (vus.has(s.id)) ctx.addIssue({ code: 'custom', path: ['sections', i, 'id'], message: `L’identifiant « ${s.id} » est déjà utilisé par une autre section.` });
    vus.add(s.id);
  });
});

export type ChapitreEditeur = z.infer<typeof schemaChapitreEditeur>;

/**
 * Inventaire d'un fragment HTML : « balise » -> nombre d'ouvertures, « balise[attribut] » -> nombre d'occurrences,
 * « style:propriété » pour les déclarations de style. Sert à repérer ce que le nettoyage a retiré.
 */
export function inventaireBalises(html: string): Map<string, number> {
  const m = new Map<string, number>();
  const ajoute = (k: string) => m.set(k, (m.get(k) ?? 0) + 1);
  // Attributs : une suite de chaînes entre guillemets ou de caractères hors « < » et « > », sans alternative ambiguë
  // (linéaire, même sur « <p » suivi de milliers d'espaces sans « > », ou sur « <a<a<a… »). Le « / » final d'une balise auto-fermante reste dans r[2], sans effet.
  for (const r of html.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^<>"'])*)>/g)) {
    const nom = r[1].toLowerCase();
    ajoute(nom);
    for (const a of r[2].matchAll(/\s([^\s=\/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      const attr = a[1].toLowerCase();
      ajoute(`${nom}[${attr}]`);
      if (attr === 'style') {
        for (const d of (a[2] ?? a[3] ?? a[4] ?? '').split(';')) {
          const prop = d.split(':')[0]?.trim().toLowerCase();
          if (prop) ajoute(`style:${prop}`);
        }
      }
    }
  }
  return m;
}

/** Éléments présents avant nettoyage et absents ou moins nombreux après : « script ×1 », « attribut onclick ×2 ». */
export function balisesRetirees(avant: string, apres: string): string[] {
  const a = inventaireBalises(avant);
  const b = inventaireBalises(apres);
  const etiquette = (k: string) => {
    if (k.startsWith('style:')) return `style ${k.slice(6)}`;
    const attr = k.match(/^[^[]+\[(.+)\]$/);
    return attr ? `attribut ${attr[1]}` : k;
  };
  const cumul = new Map<string, number>();
  for (const [k, n] of a) {
    const perdu = n - (b.get(k) ?? 0);
    if (perdu > 0) cumul.set(etiquette(k), (cumul.get(etiquette(k)) ?? 0) + perdu);
  }
  return [...cumul].map(([k, n]) => `${k} ×${n}`);
}
