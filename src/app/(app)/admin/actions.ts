'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { exigerAdmin } from '@/lib/admin/garde';
import { couleurCoursAcceptable } from '@/lib/contenu/couleur';
import { NIVEAUX } from '@/lib/profil/onboarding';

export type EtatPublication = { erreur?: string };

export type ChampCours = 'slug' | 'filiere' | 'niveau' | 'matiere' | 'titre' | 'couleur' | 'ordre';
export type ValeursCours = Record<ChampCours, string>;
// erreurs : un message par champ en cause ; erreur : message général (hors champ). valeurs : ce qui a été saisi.
export type EtatCours = { erreur?: string; erreurs?: Partial<Record<ChampCours, string>>; valeurs?: ValeursCours };

const uuid = z.string().uuid();
const MSG_COULEUR = 'Choisis une couleur plus foncée : le texte blanc des boutons doit rester lisible dessus (contraste 4,5:1 minimum).';

const schemaPublication = z.object({ id: uuid, publie: z.enum(['true', 'false']) });

async function publier(rpc: 'publier_cours' | 'publier_chapitre', form: FormData): Promise<EtatPublication> {
  await exigerAdmin();
  const r = schemaPublication.safeParse({ id: form.get('id'), publie: form.get('publie') });
  if (!r.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const publie = r.data.publie === 'true';
  const { error } = rpc === 'publier_cours'
    ? await supabase.rpc('publier_cours', { p_cours: r.data.id, p_publie: publie })
    : await supabase.rpc('publier_chapitre', { p_chapitre: r.data.id, p_publie: publie });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/admin');
  return {};
}

export async function publierCours(_: EtatPublication, form: FormData): Promise<EtatPublication> {
  return publier('publier_cours', form);
}

export async function publierChapitre(_: EtatPublication, form: FormData): Promise<EtatPublication> {
  return publier('publier_chapitre', form);
}

const schemaCours = z.object({
  slug: z.string().regex(/^[a-z0-9-]{1,80}$/, 'Utilise de 1 à 80 caractères : lettres minuscules sans accent, chiffres et tirets.'),
  filiere: z.string().min(1, 'Choisis une filière.'),
  niveau: z.enum(NIVEAUX, { message: 'Choisis un niveau.' }),
  matiere: z.string().trim().min(1, 'Indique la matière (120 caractères au maximum).').max(120, 'Indique la matière (120 caractères au maximum).'),
  titre: z.string().trim().min(1, 'Indique le titre (200 caractères au maximum).').max(200, 'Indique le titre (200 caractères au maximum).'),
  couleur: z.string().regex(/^#[0-9a-f]{6}$/i, 'Saisis une couleur au format #rrggbb.').refine(couleurCoursAcceptable, MSG_COULEUR),
  ordre: z.string().regex(/^\d{1,4}$/, 'L’ordre est un nombre entier de 0 à 9999.'),
});

export async function enregistrerCours(_: EtatCours, form: FormData): Promise<EtatCours> {
  await exigerAdmin();
  const texte = (n: string) => String(form.get(n) ?? '');
  const valeurs: ValeursCours = {
    slug: texte('slug').trim(), filiere: texte('filiere'), niveau: texte('niveau'), matiere: texte('matiere'),
    titre: texte('titre'), couleur: texte('couleur').trim(), ordre: texte('ordre').trim(),
  };
  const id = form.get('id') ? uuid.safeParse(form.get('id')) : null;
  if (id && !id.success) return { erreur: messageErreur(undefined), valeurs };
  const r = schemaCours.safeParse(valeurs);
  if (!r.success) {
    const erreurs: Partial<Record<ChampCours, string>> = {};
    for (const i of r.error.issues) {
      const champ = i.path[0] as ChampCours;
      if (!erreurs[champ]) erreurs[champ] = i.message;
    }
    return { erreurs, valeurs };
  }
  const supabase = await creerClientServeur();
  // La fonction SQL accepte un identifiant nul (création) ; les types générés l'ignorent.
  const { error } = await supabase.rpc('enregistrer_cours', {
    p_cours: (id?.data ?? null) as string,
    p_donnees: { ...r.data, couleur: r.data.couleur.toLowerCase(), ordre: Number(r.data.ordre) },
  });
  if (error) {
    const m = error.message;
    if (m.includes('slug_deja_pris')) return { erreurs: { slug: messageErreur(m) }, valeurs };
    if (m.includes('filiere_inconnue')) return { erreurs: { filiere: messageErreur(m) }, valeurs };
    return { erreur: messageErreur(m), valeurs };
  }
  revalidatePath('/admin');
  redirect('/admin?enregistre=cours');
}
