import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './types';

/**
 * Rafraîchit les cookies de session et renvoie l'utilisateur connecté (ou null).
 * `enTetesRequete` (nonce, CSP) est ajouté à la requête transmise aux pages, à chaque reconstruction.
 */
export async function rafraichirSession(request: NextRequest, enTetesRequete: Record<string, string> = {}) {
  const suivante = () => {
    const enTetes = new Headers(request.headers);
    for (const [cle, valeur] of Object.entries(enTetesRequete)) enTetes.set(cle, valeur);
    return NextResponse.next({ request: { headers: enTetes } });
  };
  let response = suivante();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(liste, enTetesCache) {
          liste.forEach(({ name, value }) => request.cookies.set(name, value));
          response = suivante();
          liste.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          // Empêche la mise en cache d'une réponse qui pose un cookie de session.
          Object.entries(enTetesCache).forEach(([cle, valeur]) => response.headers.set(cle, valeur));
        },
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  return { response, user };
}
