import type { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { creerClientServeur } from '@/lib/supabase/server';

const TYPES_ACCEPTES: readonly EmailOtpType[] = ['signup', 'email', 'invite', 'magiclink', 'recovery', 'email_change'];

function estTypeAccepte(type: string | null): type is EmailOtpType {
  return type !== null && (TYPES_ACCEPTES as readonly string[]).includes(type);
}

/** Lien de confirmation reçu par e-mail : valide le jeton puis ouvre la session. */
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type');
  if (tokenHash && estTypeAccepte(type)) {
    const supabase = await creerClientServeur();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL('/bienvenue', request.url));
  }
  return NextResponse.redirect(new URL('/connexion?erreur=confirmation', request.url));
}
