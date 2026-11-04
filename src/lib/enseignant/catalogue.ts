export type GroupeCours = { nom: string; cours: { id: string; titre: string }[] };
type CoursCatalogue = { id: string; titre: string; filiere: { code: string; nom: string; ordre: number } | null };

/** Cours du catalogue regroupés par filière (ordre des filières), pour les cases à cocher des classes. */
export function grouperParFiliere(catalogue: CoursCatalogue[]): GroupeCours[] {
  const parFiliere = new Map<string, { ordre: number; groupe: GroupeCours }>();
  for (const c of catalogue) {
    const f = c.filiere;
    const cle = f?.code ?? '';
    const entree = parFiliere.get(cle) ?? { ordre: f?.ordre ?? 999, groupe: { nom: f?.nom ?? 'Autres cours', cours: [] } };
    entree.groupe.cours.push({ id: c.id, titre: c.titre });
    parFiliere.set(cle, entree);
  }
  return [...parFiliere.values()].sort((a, b) => a.ordre - b.ordre).map((e) => e.groupe);
}
