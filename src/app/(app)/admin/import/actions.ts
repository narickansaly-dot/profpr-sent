'use server';

import { revalidatePath } from 'next/cache';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { exigerAdmin } from '@/lib/admin/garde';
import { versDonneesCours } from '@/lib/contenu/donnees-question';
import { analyserImport, TAILLE_MAX_IMPORT, TAILLE_MAX_LIBELLE } from '@/lib/contenu/lire-import';
import type { Json } from '@/lib/supabase/types';

export type ResumeImport = {
  titre: string; slug: string; filiere: string; niveau: string; chapitres: number;
  questions: { brouillon: number; a_relire: number; valide: number };
  chapitresExistants: string[]; coursExistant: boolean;
};
export type BilanImport = {
  cree: number; modifiee: number; versionnee: number; inchangee: number; archivee: number; supprimee: number; chapitres_absents: string[];
};
export type EtatVerification = { erreur?: string; erreurs?: string[]; resume?: ResumeImport; json?: string; publier?: boolean; serie?: number };
export type EtatImport = { erreur?: string; bilan?: BilanImport; titre?: string; serie?: number };

/** Étape « Vérifier » : lit le fichier, le valide et décrit ce que l'import ferait. Rien n'est écrit. */
export async function verifierImport(_: EtatVerification, form: FormData): Promise<EtatVerification> {
  await exigerAdmin();
  const publier = form.get('publier') === 'on';
  const fichier = form.get('fichier');
  if (!(fichier instanceof File) || fichier.size === 0) return { erreur: 'Choisis un fichier JSON à vérifier.', publier };
  if (fichier.size > TAILLE_MAX_IMPORT) return { erreur: `Le fichier dépasse la limite de ${TAILLE_MAX_LIBELLE}.`, publier };
  let texte: string;
  try {
    texte = await fichier.text();
  } catch {
    return { erreur: 'Impossible de lire ce fichier.', publier };
  }
  const analyse = analyserImport(texte);
  if ('erreurs' in analyse) return { erreurs: analyse.erreurs, publier };
  const { cours } = analyse;
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.from('cours').select('id, chapitre(slug)').eq('slug', cours.slug).maybeSingle();
  if (error) return { erreur: messageErreur(error.message), publier };
  const connus = new Set((data?.chapitre ?? []).map((c) => c.slug));
  const questions = { brouillon: 0, a_relire: 0, valide: 0 };
  for (const ch of cours.chapitres) for (const q of ch.questions) questions[q.statut]++;
  return {
    json: texte, publier, serie: Date.now(),
    resume: {
      titre: cours.titre, slug: cours.slug, filiere: cours.filiere, niveau: cours.niveau, chapitres: cours.chapitres.length, questions,
      chapitresExistants: cours.chapitres.filter((c) => connus.has(c.slug)).map((c) => c.slug), coursExistant: !!data,
    },
  };
}

/** Étape « Importer » : le champ caché n'est jamais cru, le contenu est relu, revalidé et nettoyé comme au premier passage. */
export async function importer(_: EtatImport, form: FormData): Promise<EtatImport> {
  await exigerAdmin();
  const brut = form.get('json');
  const serie = Number(form.get('serie')) || undefined;
  if (typeof brut !== 'string') return { erreur: messageErreur(undefined), serie };
  const analyse = analyserImport(brut);
  if ('erreurs' in analyse) return { erreur: `Le contenu à importer n’est plus valide : ${analyse.erreurs[0]}`, serie };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('importer_cours', {
    p_cours: versDonneesCours(analyse.cours) as unknown as Json, p_publier: form.get('publier') === 'oui',
  });
  if (error) return { erreur: messageErreur(error.message), serie };
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { erreur: 'La base n’a renvoyé aucun bilan.', serie };
  const b = data as Record<string, unknown>;
  const n = (c: string) => (typeof b[c] === 'number' ? b[c] : 0);
  revalidatePath('/admin', 'layout');
  return {
    serie, titre: analyse.cours.titre,
    bilan: {
      cree: n('cree'), modifiee: n('modifiee'), versionnee: n('versionnee'), inchangee: n('inchangee'), archivee: n('archivee'),
      supprimee: n('supprimee'), chapitres_absents: Array.isArray(b.chapitres_absents) ? b.chapitres_absents.map(String) : [],
    },
  };
}
