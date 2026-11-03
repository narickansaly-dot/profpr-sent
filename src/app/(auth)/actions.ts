'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { creerClientServeur } from '@/lib/supabase/server';
import { schemaIdentifiants } from '@/lib/auth/identifiants';
import { traduireErreurAuth } from '@/lib/auth/erreurs';

export type EtatFormulaire = { erreur?: string; info?: string };

function lireIdentifiants(form: FormData) {
  return schemaIdentifiants.safeParse({ email: form.get('email'), motDePasse: form.get('motDePasse') });
}

export async function inscrire(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const r = lireIdentifiants(form);
  if (!r.success) return { erreur: r.error.issues[0].message };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.auth.signUp({ email: r.data.email, password: r.data.motDePasse });
  if (error) return { erreur: traduireErreurAuth(error.message) };
  if (!data.session) return { info: 'Compte créé ! Clique sur le lien reçu par e-mail pour l’activer.' };
  redirect('/bienvenue');
}

export async function connecter(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const r = lireIdentifiants(form);
  if (!r.success) return { erreur: r.error.issues[0].message };
  const supabase = await creerClientServeur();
  const { error } = await supabase.auth.signInWithPassword({ email: r.data.email, password: r.data.motDePasse });
  if (error) return { erreur: traduireErreurAuth(error.message) };
  redirect('/');
}

export async function connecterAvecGoogle() {
  const supabase = await creerClientServeur();
  const origine = (await headers()).get('origin') ?? 'http://localhost:3000';
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origine}/auth/callback` },
  });
  if (error || !data.url) redirect('/connexion?erreur=google');
  redirect(data.url);
}

export async function deconnecter() {
  const supabase = await creerClientServeur();
  await supabase.auth.signOut();
  redirect('/connexion');
}
