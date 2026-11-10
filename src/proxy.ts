import { NextResponse, type NextRequest } from 'next/server';
import { rafraichirSession } from '@/lib/supabase/session';
import { cheminSuiteSur, redirectionPour } from '@/lib/routes';
import { politiqueContenu } from '@/lib/securite/csp';

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = politiqueContenu({
    nonce,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    developpement: process.env.NODE_ENV === 'development',
    https: (process.env.NEXT_PUBLIC_SITE_URL ?? '').startsWith('https://'),
  });
  // Next.js lit le nonce dans l'en-tête CSP de la requête pour ses propres scripts.
  const { response, user } = await rafraichirSession(request, { 'x-nonce': nonce, 'Content-Security-Policy': csp });
  const cible = redirectionPour(request.nextUrl.pathname, user !== null);
  if (!cible) {
    response.headers.set('Content-Security-Policy', csp);
    return response;
  }
  const url = request.nextUrl.clone();
  const suite = cible.suite ? cheminSuiteSur(request.nextUrl.pathname + request.nextUrl.search) : null;
  url.pathname = cible.pathname;
  url.search = suite ? '?suite=' + encodeURIComponent(suite) : '';
  const redirection = NextResponse.redirect(url);
  response.cookies.getAll().forEach((c) => redirection.cookies.set(c));
  for (const nom of ['Cache-Control', 'Expires', 'Pragma']) {
    const valeur = response.headers.get(nom);
    if (valeur) redirection.headers.set(nom, valeur);
  }
  return redirection;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw\\.js$|manifest\\.webmanifest$|robots\\.txt$|apple-icon$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)'],
};
