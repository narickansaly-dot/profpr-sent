import { z } from 'zod';

export const NIVEAUX = ['2de', '1re', 'Tle'] as const;

// Mêmes règles que la contrainte profil_nom_ck (migration 20261117000002) : 2 à 60 caractères,
// sans caractère de contrôle ni de mise en forme bidirectionnelle.
function creerSchemaNom(m: { court: string; long: string; interdit: string }) {
  return z.string().trim()
    .refine((s) => [...s].length >= 2, m.court)
    .refine((s) => [...s].length <= 60, m.long)
    .regex(/^[^\p{Cc}\u200e\u200f\u202a-\u202e\u2066-\u2069]*$/u, m.interdit);
}
const schemaNom = creerSchemaNom({
  court: 'Indique ton prénom.', long: 'Ton prénom est trop long.', interdit: 'Ton prénom contient des caractères non autorisés.',
});
// Les parents sont vouvoyés.
const schemaNomParent = creerSchemaNom({
  court: 'Indiquez votre prénom.', long: 'Votre prénom est trop long.', interdit: 'Votre prénom contient des caractères non autorisés.',
});

const schemaEleve = z.object({
  profil: z.literal('eleve'),
  nom: schemaNom,
  filiereId: z.string().uuid('Choisis ta filière.'),
  niveau: z.enum(NIVEAUX, { message: 'Choisis ton niveau.' }),
  moinsDe15Ans: z.boolean(),
});
const schemaEnseignant = z.object({
  profil: z.literal('enseignant'),
  nom: schemaNom,
  etablissement: z.string().trim().min(2, 'Indique ton établissement.').max(120, 'Le nom de l’établissement est trop long.'),
});
const schemaParent = z.object({ profil: z.literal('parent'), nom: schemaNomParent });
export const schemaOnboarding = z.discriminatedUnion('profil', [schemaEleve, schemaEnseignant, schemaParent]);
export type DonneesOnboarding = z.infer<typeof schemaOnboarding>;

export function lireFormulaireOnboarding(form: FormData) {
  const brut = form.get('profil');
  const profil = brut === 'enseignant' || brut === 'parent' ? brut : 'eleve';
  if (profil === 'parent') return schemaOnboarding.safeParse({ profil, nom: form.get('nom') ?? '' });
  return profil === 'enseignant'
    ? schemaOnboarding.safeParse({ profil, nom: form.get('nom') ?? '', etablissement: form.get('etablissement') ?? '' })
    : schemaOnboarding.safeParse({
        profil, nom: form.get('nom') ?? '', filiereId: form.get('filiereId') ?? '',
        niveau: form.get('niveau') ?? '', moinsDe15Ans: form.get('moinsDe15Ans') === 'on',
      });
}
