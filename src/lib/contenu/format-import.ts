import { z } from 'zod';

const commun = {
  source: z.string().min(1),
  enonce: z.string().min(1),
  notion: z.string().optional(),
  difficulte: z.number().int().min(1).max(3).default(2),
  explication: z.string().default(''),
  statut: z.enum(['brouillon', 'a_relire', 'valide']).default('a_relire'),
};

const indicesValides = (q: { propositions: string[]; bonnes_reponses: number[] }) =>
  q.bonnes_reponses.every((i) => i < q.propositions.length);

export const schemaQuestionImport = z.discriminatedUnion('type', [
  z.object({ ...commun, type: z.literal('qcm_unique'), propositions: z.array(z.string().min(1)).min(2),
    bonnes_reponses: z.array(z.number().int().min(0)).length(1) }),
  z.object({ ...commun, type: z.literal('qcm_multiple'), propositions: z.array(z.string().min(1)).min(2),
    bonnes_reponses: z.array(z.number().int().min(0)).min(1) }),
  z.object({ ...commun, type: z.literal('vrai_faux'), bonne_reponse: z.boolean() }),
  z.object({ ...commun, type: z.literal('reponse_courte'), reponses_acceptees: z.array(z.string().min(1)).min(1),
    marge: z.number().nonnegative().optional(), marge_relative: z.boolean().default(false) }),
]).refine((q) => !('bonnes_reponses' in q) || indicesValides(q), {
  message: 'Une bonne réponse ne correspond à aucune proposition.',
}).refine((q) => !('bonnes_reponses' in q) || new Set(q.bonnes_reponses).size === q.bonnes_reponses.length, {
  message: 'Une bonne réponse apparaît deux fois.',
}).refine((q) => q.type !== 'reponse_courte' || !q.marge_relative || q.marge !== undefined, {
  message: 'Une marge relative demande une valeur de marge.',
});

export const schemaChapitreImport = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  numero: z.number().int().min(1),
  titre: z.string().min(1),
  titre_court: z.string().optional(),
  duree: z.string().optional(),
  resume: z.string().optional(),
  chapeau: z.string().optional(),
  objectifs: z.array(z.string()).default([]),
  sections: z.array(z.object({ id: z.string().min(1), titre: z.string().min(1), html: z.string() })),
  a_retenir: z.string().optional(),
  questions: z.array(schemaQuestionImport),
});

export const schemaCoursImport = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  filiere: z.string().min(1),
  niveau: z.enum(['2de', '1re', 'Tle']),
  matiere: z.string().min(1),
  titre: z.string().min(1),
  couleur: z.string().regex(/^#[0-9a-f]{6}$/i).default('#2563eb'),
  chapitres: z.array(schemaChapitreImport).min(1),
}).refine((c) => new Set(c.chapitres.map((ch) => ch.slug)).size === c.chapitres.length, {
  message: 'Deux chapitres ont le même slug.',
});

export type QuestionImport = z.infer<typeof schemaQuestionImport>;
export type ChapitreImport = z.infer<typeof schemaChapitreImport>;
export type CoursImport = z.infer<typeof schemaCoursImport>;
