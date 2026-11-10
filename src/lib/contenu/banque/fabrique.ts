import type { QuestionImport } from '../format-import';
import type { FichierBanque } from './format';

export const NOTIONS = ['Cellule', 'Tissus', 'Homéostasie', 'Imagerie', 'Organites'];
const SYLLABES = ['ba', 'ro', 'mi', 'tu', 'le', 'so', 'ka', 'vi', 'dé', 'pu', 'no', 'fé', 'za', 'li', 'mo', 'ré', 'ju', 'ta', 'ne', 'gu'];

/** Mot pseudo-aléatoire de trois syllabes : des énoncés sans rapport entre eux. */
function mot(n: number): string {
  const a = (n * 7 + 3) % 20;
  const b = (n * 11 + Math.floor(n / 20) * 5 + 1) % 20;
  const c = (n * 13 + Math.floor(n / 7) * 3 + 9) % 20;
  return SYLLABES[a] + SYLLABES[b] + SYLLABES[c];
}

const num = (i: number) => String(i + 1).padStart(3, '0');

/** Fichier valide de `total` questions (multiple de 10), quotas exacts : types 50/20/20/10 %, difficultés 40/40/20 %, positions en rotation. */
export function fabriquer(total = 130, prefixe = 'bph', chapitre = 1): FichierBanque {
  const questions: QuestionImport[] = [];
  let unique = 0;
  let vf = 0;
  for (let i = 0; i < total; i++) {
    const base = {
      source: `${prefixe}:ch${chapitre}:banque:${num(i)}`,
      notion: NOTIONS[i % 5],
      difficulte: i % 5 < 2 ? 1 : i % 5 < 4 ? 2 : 3,
      explication: 'Le cours le dit.',
      statut: 'a_relire' as const,
    };
    const enonce = `Que sait-on de ${mot(i * 3)} et de ${mot(i * 3 + 1)} chez ${mot(i * 3 + 2)} ?`;
    const r = i % 10;
    if (r < 5) {
      questions.push({ ...base, type: 'qcm_unique', enonce, propositions: ['Choix A', 'Choix B', 'Choix C', 'Choix D'], bonnes_reponses: [unique++ % 4] });
    } else if (r < 7) {
      questions.push({ ...base, type: 'qcm_multiple', enonce: `${enonce} Coche toutes les réponses exactes.`,
        propositions: ['Choix A', 'Choix B', 'Choix C', 'Choix D'], bonnes_reponses: [0, 1] });
    } else if (r < 9) {
      questions.push({ ...base, type: 'vrai_faux', enonce, bonne_reponse: vf++ % 2 === 0 });
    } else {
      questions.push({ ...base, type: 'reponse_courte', enonce, reponses_acceptees: [mot(i)], marge_relative: false });
    }
  }
  return { chapitre, notions: [...NOTIONS], questions };
}
