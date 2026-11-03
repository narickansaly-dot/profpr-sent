import { z } from 'zod';

export const NIVEAUX = ['2de', '1re', 'Tle'] as const;

export const schemaOnboarding = z.object({
  nom: z.string().trim().min(2, 'Indique ton prénom.').max(60, 'Ton prénom est trop long.'),
  filiereId: z.string().uuid('Choisis ta filière.'),
  niveau: z.enum(NIVEAUX, { message: 'Choisis ton niveau.' }),
  moinsDe15Ans: z.boolean(),
});

export type DonneesOnboarding = z.infer<typeof schemaOnboarding>;

export function lireFormulaireOnboarding(form: FormData) {
  return schemaOnboarding.safeParse({
    nom: form.get('nom') ?? '',
    filiereId: form.get('filiereId') ?? '',
    niveau: form.get('niveau') ?? '',
    moinsDe15Ans: form.get('moinsDe15Ans') === 'on',
  });
}
