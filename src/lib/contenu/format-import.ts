import { z } from 'zod';
import { couleurCoursAcceptable } from './couleur';

const commun = {
  source: z.string().trim().min(1).max(120),
  enonce: z.string().trim().min(1).max(2000),
  notion: z.string().max(120).optional(),
  difficulte: z.number().int().min(1).max(3).default(2),
  explication: z.string().max(4000).default(''),
  statut: z.enum(['brouillon', 'a_relire', 'valide']).default('a_relire'),
};

const proposition = z.string().trim().min(1).max(500);

const indicesValides = (q: { propositions: string[]; bonnes_reponses: number[] }) =>
  q.bonnes_reponses.every((i) => i < q.propositions.length);

/** Variantes de base (sans les contrôles croisés) : la Task 10 en dérive le schéma de l'éditeur. */
export const variantesQuestionImport = [
  z.object({ ...commun, type: z.literal('qcm_unique'), propositions: z.array(proposition).min(2).max(10),
    bonnes_reponses: z.array(z.number().int().min(0)).length(1) }),
  z.object({ ...commun, type: z.literal('qcm_multiple'), propositions: z.array(proposition).min(2).max(10),
    bonnes_reponses: z.array(z.number().int().min(0)).min(1) }),
  z.object({ ...commun, type: z.literal('vrai_faux'), bonne_reponse: z.boolean() }),
  z.object({ ...commun, type: z.literal('reponse_courte'), reponses_acceptees: z.array(z.string().trim().min(1)).min(1),
    marge: z.number().nonnegative().optional(), marge_relative: z.boolean().default(false) }),
] as const;

type PourControle = { type: string; propositions?: string[]; bonnes_reponses?: number[]; marge?: number; marge_relative?: boolean };

/** Contrôles croisés d'une question, partagés par l'import et l'éditeur (une seule définition). */
export const controlesQuestion: { verifie: (q: PourControle) => boolean; message: string }[] = [
  { verifie: (q) => !q.bonnes_reponses || indicesValides({ propositions: q.propositions ?? [], bonnes_reponses: q.bonnes_reponses }),
    message: 'Une bonne réponse ne correspond à aucune proposition.' },
  { verifie: (q) => !q.bonnes_reponses || new Set(q.bonnes_reponses).size === q.bonnes_reponses.length,
    message: 'Une bonne réponse apparaît deux fois.' },
  { verifie: (q) => q.type !== 'reponse_courte' || !q.marge_relative || q.marge !== undefined,
    message: 'Une marge relative demande une valeur de marge.' },
];

export const schemaQuestionImport = controlesQuestion.reduce(
  (schema, c) => schema.refine(c.verifie, { message: c.message }),
  z.discriminatedUnion('type', variantesQuestionImport),
);

export const schemaChapitreImport = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).max(80),
  numero: z.number().int().min(1).max(99),
  titre: z.string().trim().min(1).max(200),
  titre_court: z.string().max(80).optional(),
  duree: z.string().max(40).optional(),
  resume: z.string().max(1000).optional(),
  chapeau: z.string().max(4000).optional(),
  objectifs: z.array(z.string().max(300)).default([]),
  sections: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]+$/).max(80), titre: z.string().trim().min(1).max(200), html: z.string().max(200000) })).max(40),
  a_retenir: z.string().max(50000).optional(),
  questions: z.array(schemaQuestionImport),
}).refine((ch) => new Set(ch.sections.map((s) => s.id)).size === ch.sections.length, {
  message: 'Deux sections ont le même identifiant.',
});

export const schemaCoursImport = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Lettres minuscules, chiffres et tirets uniquement.').max(80),
  filiere: z.string().min(1),
  niveau: z.enum(['2de', '1re', 'Tle']),
  matiere: z.string().trim().min(1).max(120),
  titre: z.string().trim().min(1).max(200),
  couleur: z.string().regex(/^#[0-9a-f]{6}$/i, 'Couleur attendue au format #rrggbb, par exemple #0f766e.').transform((c) => c.toLowerCase())
    .refine((c) => !/^#[0-9a-f]{6}$/.test(c) || couleurCoursAcceptable(c), 'Couleur trop claire : contraste insuffisant avec le fond blanc.').default('#2563eb'),
  chapitres: z.array(schemaChapitreImport).min(1),
}).refine((c) => new Set(c.chapitres.map((ch) => ch.slug)).size === c.chapitres.length, {
  message: 'Deux chapitres ont le même slug.',
}).refine((c) => new Set(c.chapitres.map((ch) => ch.numero)).size === c.chapitres.length, {
  message: 'Deux chapitres ont le même numéro.',
}).refine((c) => {
  const sources = c.chapitres.flatMap((ch) => ch.questions.map((q) => q.source));
  return new Set(sources).size === sources.length;
}, { message: 'Deux questions ont la même source.' });

export type QuestionImport = z.infer<typeof schemaQuestionImport>;
export type ChapitreImport = z.infer<typeof schemaChapitreImport>;
export type CoursImport = z.infer<typeof schemaCoursImport>;
