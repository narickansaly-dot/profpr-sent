'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import { creerClientServeur } from '@/lib/supabase/server';
import { lireUtilisateur } from '@/lib/supabase/utilisateur';
import { messageErreur } from '@/lib/erreurs';
import { envoyerEmail } from '@/lib/email/envoyer';
import { emailConsentement } from '@/lib/email/modeles';

export type EtatDemande = { erreur?: string; envoye?: boolean; email?: string };

/**
 * Demande l'accord d'un parent.
 * 1. La base enregistre la demande avec la session de l'élève (limites : 10 minutes entre deux envois, 5 par jour).
 * 2. Le jeton est émis par un appel distinct, avec le secret d'envoi et sans session : l'élève ne le voit jamais.
 * 3. Le jeton va directement dans l'e-mail ; il n'est ni renvoyé à la page ni journalisé.
 * Une demande compte dès l'étape 1 : si l'envoi échoue, l'élève doit attendre 10 minutes avant de réessayer
 * (le jeton perdu n'est pas réémis, une nouvelle demande en génère un autre).
 */
export async function demanderConsentement(_: EtatDemande, form: FormData): Promise<EtatDemande> {
  const email = String(form.get('email') ?? '').trim();
  const user = await lireUtilisateur();
  if (!user) return { erreur: messageErreur('non_connecte'), email };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('demander_consentement', { p_email: email });
  if (error) return { erreur: messageErreur(error.message), email };

  const secret = process.env.ENVOI_SECRET;
  const echec = { erreur: 'L’e-mail n’a pas pu partir. Réessaie dans 10 minutes.', email };
  if (!secret) {
    console.error('consentement : ENVOI_SECRET absent');
    return echec;
  }
  // Client anonyme sans session : emettre_jeton_consentement vérifie elle-même le secret. Pas de clé de service.
  const anonyme = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error: erreurJeton } = await anonyme.rpc('emettre_jeton_consentement', { p_secret: secret, p_eleve: user.id });
  const ligne = data?.[0];
  if (erreurJeton || !ligne) {
    console.error('consentement : jeton non émis');
    return echec;
  }
  try {
    // Le lien ne se construit que depuis NEXT_PUBLIC_SITE_URL (repli local hors production), jamais depuis les en-têtes de la requête.
    const origine = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : '');
    if (!origine) throw new Error('origine du site absente');
    const message = emailConsentement({ prenom: ligne.prenom, lien: `${origine.replace(/\/$/, '')}/accord-parental/${ligne.jeton}` });
    await envoyerEmail({ a: ligne.email, ...message });
  } catch (e) {
    console.error('consentement : envoi impossible', e instanceof Error ? e.message : 'inconnu');
    return echec;
  }
  revalidatePath('/consentement');
  return { envoye: true, email: ligne.email };
}
