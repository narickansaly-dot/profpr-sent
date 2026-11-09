import { z } from 'zod';

export type StatutLot = 'valide' | 'brouillon';
export type SelectionLue = { ok: true; ids: string[]; statut: StatutLot } | { ok: false; erreur: string };

const INVALIDE = 'Sélection invalide. Recharge la page.';
const MAX = 200;
const schema = z.object({ ids: z.array(z.string().uuid()), statut: z.enum(['valide', 'brouillon']) });

/** Lit les cases cochées (`ids`) et le bouton cliqué (`statut`) du formulaire de relecture en lot. */
export function lireSelection(form: FormData): SelectionLue {
  const brut = form.getAll('ids');
  const r = schema.safeParse({ ids: brut, statut: form.get('statut') });
  if (!r.success) return { ok: false, erreur: INVALIDE };
  const ids = [...new Set(r.data.ids)];
  if (ids.length === 0) return { ok: false, erreur: 'Coche au moins une question.' };
  if (ids.length > MAX) return { ok: false, erreur: `Sélectionne au plus ${MAX} questions à la fois.` };
  return { ok: true, ids, statut: r.data.statut };
}

export function messageLot(n: number, statut: StatutLot): string {
  const s = n > 1 ? 's' : '';
  return statut === 'valide' ? `${n} question${s} validée${s}.` : `${n} question${s} repassée${s} en brouillon.`;
}

/** Libellé caché d'une case : stable, il ne dépend pas de la position dans la liste. */
export function libelleCase(q: { source?: string | null; enonce: string }): string {
  const source = q.source?.trim();
  const repere = source || Array.from(q.enonce.trim()).slice(0, 40).join('').trim();
  return `Sélectionner la question ${repere}`;
}

/** « Tout cocher » reflète l'état réel : vrai seulement si la liste n'est pas vide et que chaque question est cochée. */
export function toutEstCoche(ids: readonly string[], cochees: ReadonlySet<string>): boolean {
  return ids.length > 0 && ids.every((id) => cochees.has(id));
}
