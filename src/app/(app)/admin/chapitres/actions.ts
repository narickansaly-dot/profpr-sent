'use server';

import type { ReactNode } from 'react';
import { createElement } from 'react';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { exigerAdmin } from '@/lib/admin/garde';
import { nettoyerHtml } from '@/lib/contenu/html';
import { balisesRetirees, schemaChapitreEditeur } from '@/lib/contenu/schema-editeur';
import { idSectionValide } from '@/lib/contenu/identifiant';
import { ContenuChapitre } from '@/components/ContenuChapitre';

/** Ce que le navigateur envoie : tout est du texte, le serveur convertit et valide. */
export type SaisieChapitre = {
  slug: string; numero: string; titre: string; titre_court: string; duree: string; resume: string; chapeau: string;
  objectifs: string; sections: { id: string; titre: string; html: string }[]; a_retenir: string;
};
/** `champ` : champ du formulaire en cause ; `section` : position (à partir de 0) de la section en cause. */
export type EtatChapitre = { erreur?: string; champ?: string; section?: number };
export type EtatApercu = { apercu?: ReactNode; retire?: string[]; erreur?: string };

const uuid = z.string().uuid();
const saisie = z.object({
  slug: z.string().max(200), numero: z.string().max(10), titre: z.string().max(1000), titre_court: z.string().max(1000),
  duree: z.string().max(1000), resume: z.string().max(10000), chapeau: z.string().max(20000), objectifs: z.string().max(20000),
  sections: z.array(z.object({ id: z.string().max(200), titre: z.string().max(1000), html: z.string().max(400000) })).max(60),
  a_retenir: z.string().max(100000),
});

const vide = (t: string) => t.trim() === '' ? undefined : t.trim();

export async function apercuChapitre(brut: SaisieChapitre): Promise<EtatApercu> {
  await exigerAdmin();
  const r = saisie.safeParse(brut);
  if (!r.success) return { erreur: 'Le contenu est trop long pour être prévisualisé.' };
  const vus = new Set<string>();
  const sections = r.data.sections.map((s, i) => {
    let id = idSectionValide(s.id) ? s.id : `section-${i + 1}`;
    while (vus.has(id)) id = `${id}-bis`;
    vus.add(id);
    return { id, titre: s.titre || 'Section sans titre', html: s.html };
  });
  const avant = [...sections.map((s) => s.html), r.data.a_retenir].join('\n');
  const apres = [...sections.map((s) => nettoyerHtml(s.html)), nettoyerHtml(r.data.a_retenir)].join('\n');
  return {
    apercu: createElement(ContenuChapitre, { sections, aRetenir: r.data.a_retenir.trim() ? r.data.a_retenir : null }),
    retire: balisesRetirees(avant, apres),
  };
}

export async function enregistrerChapitre(coursId: string, chapitreId: string | null, brut: SaisieChapitre): Promise<EtatChapitre> {
  await exigerAdmin();
  const c = uuid.safeParse(coursId);
  const ch = chapitreId === null ? null : uuid.safeParse(chapitreId);
  const s = saisie.safeParse(brut);
  if (!c.success || (ch && !ch.success) || !s.success) return { erreur: messageErreur(undefined) };
  const d = s.data;
  const r = schemaChapitreEditeur.safeParse({
    slug: d.slug.trim(), numero: /^\d{1,2}$/.test(d.numero.trim()) ? Number(d.numero) : NaN, titre: d.titre,
    titre_court: vide(d.titre_court), duree: vide(d.duree), resume: vide(d.resume), chapeau: vide(d.chapeau),
    objectifs: d.objectifs.split('\n').map((l) => l.trim()).filter(Boolean),
    sections: d.sections.map((x) => ({ id: x.id.trim(), titre: x.titre, html: x.html })),
    a_retenir: vide(d.a_retenir),
  });
  if (!r.success) {
    const i = r.error.issues[0];
    const champ = String(i.path[0] ?? '');
    if (champ === 'sections' && typeof i.path[1] === 'number') {
      return { erreur: `Section ${i.path[1] + 1} : ${i.message}`, champ, section: i.path[1] };
    }
    const nom: Record<string, string> = { slug: 'l’identifiant d’URL (lettres minuscules, chiffres et tirets)', numero: 'le numéro (de 1 à 99)',
      titre: 'le titre', titre_court: 'le titre court (80 caractères au maximum)', duree: 'la durée (40 caractères au maximum)',
      resume: 'le résumé (1 000 caractères au maximum)', chapeau: 'le chapeau (4 000 caractères au maximum)',
      objectifs: 'les objectifs (300 caractères au maximum par ligne)', a_retenir: 'la zone « Je retiens » (50 000 caractères au maximum)' };
    return { erreur: champ === 'sections' ? i.message : `Vérifie ${nom[champ] ?? 'le formulaire'}.`, champ };
  }
  const donnees = {
    ...r.data,
    sections: r.data.sections.map((x) => ({ ...x, html: nettoyerHtml(x.html) })),
    a_retenir: r.data.a_retenir === undefined ? undefined : nettoyerHtml(r.data.a_retenir),
  };
  const supabase = await creerClientServeur();
  // La fonction SQL accepte un identifiant nul (création) ; les types générés l'ignorent.
  const { data, error } = await supabase.rpc('enregistrer_chapitre', {
    p_cours: c.data, p_chapitre: (ch?.data ?? null) as string, p_donnees: donnees,
  });
  if (error) {
    const champ = error.message.includes('slug_deja_pris') ? 'slug' : error.message.includes('numero_deja_pris') ? 'numero' : undefined;
    return { erreur: messageErreur(error.message), champ };
  }
  revalidatePath('/admin');
  redirect(`/admin/chapitres/${data}?enregistre=1`);
}
