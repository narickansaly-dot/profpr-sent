import { z } from 'zod';

export const NIVEAUX = ['2de', '1re', 'Tle'] as const;

const schemaEleve = z.object({
  profil: z.literal('eleve'),
  nom: z.string().trim().min(2, 'Indique ton prénom.').max(60, 'Ton prénom est trop long.'),
  filiereId: z.string().uuid('Choisis ta filière.'),
  niveau: z.enum(NIVEAUX, { message: 'Choisis ton niveau.' }),
  moinsDe15Ans: z.boolean(),
});
const schemaEnseignant = z.object({
  profil: z.literal('enseignant'),
  nom: z.string().trim().min(2, 'Indique ton prénom.').max(60, 'Ton prénom est trop long.'),
  etablissement: z.string().trim().min(2, 'Indique ton établissement.').max(120, 'Le nom de l’établissement est trop long.'),
});
export const schemaOnboarding = z.discriminatedUnion('profil', [schemaEleve, schemaEnseignant]);
export type DonneesOnboarding = z.infer<typeof schemaOnboarding>;

export function lireFormulaireOnboarding(form: FormData) {
  const profil = form.get('profil') === 'enseignant' ? 'enseignant' : 'eleve';
  return profil === 'enseignant'
    ? schemaOnboarding.safeParse({ profil, nom: form.get('nom') ?? '', etablissement: form.get('etablissement') ?? '' })
    : schemaOnboarding.safeParse({
        profil, nom: form.get('nom') ?? '', filiereId: form.get('filiereId') ?? '',
        niveau: form.get('niveau') ?? '', moinsDe15Ans: form.get('moinsDe15Ans') === 'on',
      });
}
