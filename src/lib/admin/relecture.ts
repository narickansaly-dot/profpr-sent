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

export { libelleCase, toutEstCoche } from './relecture-case';
