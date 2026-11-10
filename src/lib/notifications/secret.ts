import { timingSafeEqual } from 'node:crypto';

/** Compare l'en-tête `Authorization: Bearer <secret>` au secret attendu, en temps constant. */
export function secretValide(recu: string | null, attendu: string | undefined): boolean {
  if (!attendu || attendu.length < 32 || !recu?.startsWith('Bearer ')) return false;
  const a = Buffer.from(recu.slice('Bearer '.length));
  const b = Buffer.from(attendu);
  return a.length === b.length && timingSafeEqual(a, b);
}
