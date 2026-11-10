import { headers } from 'next/headers';

/** Adresse publique du site : NEXT_PUBLIC_SITE_URL si elle est définie (production), sinon l'hôte de la requête. */
export async function urlDuSite(): Promise<string> {
  const configuree = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuree) return configuree.replace(/\/$/, '');
  const h = await headers();
  const hote = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const protocole = h.get('x-forwarded-proto') ?? (/^(localhost|127\.0\.0\.1)(:|$)/.test(hote) ? 'http' : 'https');
  return `${protocole}://${hote}`;
}
