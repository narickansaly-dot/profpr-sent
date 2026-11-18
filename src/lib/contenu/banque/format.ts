import { z } from 'zod';
import type { QuestionImport } from '../format-import';

/**
 * Fichier de travail d'un chapitre : `<dossier du cours>/banques/<préfixe>-chN.json`
 * (`contenu/1re-st2s/banques/bph-chN.json`, `contenu/1re-gen/banques/svt-chN.json`…, voir `cours.ts`).
 * Les questions sont gardées telles quelles : c'est `verifierBanque` qui les passe une à une au validateur d'import,
 * pour rapporter chaque erreur avec la source de la question.
 */
export const schemaFichierBanque = z.object({
  chapitre: z.number().int().min(1).max(99),
  notions: z.array(z.string()),
  questions: z.array(z.custom<QuestionImport>((v) => typeof v === 'object' && v !== null && !Array.isArray(v), 'Une question doit être un objet.')),
});

export type FichierBanque = z.infer<typeof schemaFichierBanque>;
