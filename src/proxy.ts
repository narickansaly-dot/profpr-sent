import { NextResponse, type NextRequest } from 'next/server';
import { rafraichirSession } from '@/lib/supabase/session';
import { cheminSuiteSur, redirectionPour } from '@/lib/routes';

export async function proxy(request: NextRequest) {
  const { response, user } = await rafraichirSession(request);
  const cible = redirectionPour(request.nextUrl.pathname, user !== null);
  if (!cible) return response;
  const url = request.nextUrl.clone();
  const suite = cible.suite ? cheminSuiteSur(request.nextUrl.pathname + request.nextUrl.search) : null;
  url.pathname = cible.pathname;
  url.search = suite ? '?suite=' + encodeURIComponent(suite) : '';
  const redirection = NextResponse.redirect(url);
  response.cookies.getAll().forEach((c) => redirection.cookies.set(c));
  return redirection;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw\\.js$|manifest\\.webmanifest$|robots\\.txt$|apple-icon$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
