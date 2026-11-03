import { creerClientServeur } from '@/lib/supabase/server';

export type Section = { id: string; titre: string; html: string };

export async function listerCoursDuProfil() {
  const supabase = await creerClientServeur();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: profil } = await supabase.from('profil').select('filiere_id, niveau_code').eq('id', user.id).single();
  if (!profil?.filiere_id || !profil.niveau_code) return [];
  const { data } = await supabase.from('cours')
    .select('id, slug, titre, matiere, couleur, chapitre(count)')
    .eq('filiere_id', profil.filiere_id).eq('niveau_code', profil.niveau_code).order('ordre');
  return (data ?? []).map((c) => ({ ...c, nbChapitres: c.chapitre[0]?.count ?? 0 }));
}

export async function lireCours(slug: string) {
  const supabase = await creerClientServeur();
  const { data } = await supabase.from('cours')
    .select('id, slug, titre, matiere, couleur, chapitre(slug, numero, titre, titre_court, resume, duree)')
    .eq('slug', slug).order('numero', { referencedTable: 'chapitre' }).maybeSingle();
  return data;
}

export async function lireChapitre(coursSlug: string, chapitreSlug: string) {
  const cours = await lireCours(coursSlug);
  if (!cours) return null;
  const supabase = await creerClientServeur();
  const { data } = await supabase.from('chapitre')
    .select('slug, numero, titre, duree, chapeau, objectifs, sections, a_retenir')
    .eq('cours_id', cours.id).eq('slug', chapitreSlug).maybeSingle();
  if (!data) return null;
  const index = cours.chapitre.findIndex((c) => c.slug === chapitreSlug);
  return {
    cours, chapitre: { ...data, sections: data.sections as Section[] },
    precedent: cours.chapitre[index - 1] ?? null, suivant: cours.chapitre[index + 1] ?? null,
  };
}
