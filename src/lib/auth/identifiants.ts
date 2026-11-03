import { z } from 'zod';

export const schemaIdentifiants = z.object({
  email: z.string().trim().email('Saisis une adresse e-mail valide.'),
  motDePasse: z.string().min(8, 'Ton mot de passe doit contenir au moins 8 caractères.'),
});
