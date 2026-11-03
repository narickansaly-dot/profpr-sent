import { NextResponse, type NextRequest } from 'next/server';
import { rafraichirSession } from '@/lib/supabase/session';
import { redirectionPour } from '@/lib/routes';

export async function proxy(request: NextRequest) {
  const { response, user } = await rafraichirSession(request);
  const cible = redirectionPour(request.nextUrl.pathname, user !== null);
  if (!cible) return response;
  const url = request.nextUrl.clone();
  url.pathname = cible;
  url.search = '';
  const redirection = NextResponse.redirect(url);
  response.cookies.getAll().forEach((c) => redirection.cookies.set(c));
  return redirection;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
