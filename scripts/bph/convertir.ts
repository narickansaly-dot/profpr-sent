import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import type { CoursImport, QuestionImport } from '../../src/lib/contenu/format-import';

export type QuestionBph = { q: string; c: string[]; a: number; e: string };
export type ChapitreBph = {
  id: string; num: string; short?: string; title: string; duree?: string; summary?: string; lead?: string;
  objectifs?: string[]; sections: { id: string; titre: string; html: string }[]; retenir?: string; quiz?: QuestionBph[];
};

function versQuestion(q: QuestionBph, source: string): QuestionImport {
  return {
    source, type: 'qcm_unique', enonce: q.q, propositions: q.c, bonnes_reponses: [q.a],
    explication: q.e, difficulte: 2, statut: 'valide',
  };
}

/** Les questions de l'ancien site ont été relues en classe : elles sont importées comme validées. */
export function convertirBph(chapitres: ChapitreBph[], quizBis: Record<string, QuestionBph[]>): CoursImport {
  return {
    slug: 'bph-1re-st2s', filiere: 'ST2S', niveau: '1re', matiere: 'BPH',
    titre: 'Biologie et physiopathologie humaines', couleur: '#0f766e',
    chapitres: [...chapitres].sort((a, b) => Number(a.num) - Number(b.num)).map((c) => ({
      slug: c.id, numero: Number(c.num), titre: c.title, titre_court: c.short, duree: c.duree,
      resume: c.summary, chapeau: c.lead, objectifs: c.objectifs ?? [], sections: c.sections, a_retenir: c.retenir,
      questions: [
        ...(c.quiz ?? []).map((q, i) => versQuestion(q, `bph:${c.id}:quiz:${i}`)),
        ...(quizBis[c.id] ?? []).map((q, i) => versQuestion(q, `bph:${c.id}:bis:${i}`)),
      ],
    })),
  };
}

/** Exécute les fichiers du site (ch*.js, quiz-bis.js) dans un bac à sable qui imite `window`. */
export function chargerSourcesBph(dossier: string) {
  const fenetre: { CHAPTERS?: ChapitreBph[]; QUIZ_BIS?: Record<string, QuestionBph[]> } = {};
  const contexte = vm.createContext({ window: fenetre });
  const fichiers = readdirSync(dossier).filter((f) => /^ch\d+\.js$/.test(f)).sort();
  for (const f of [...fichiers, 'quiz-bis.js']) {
    vm.runInContext(readFileSync(join(dossier, f), 'utf8'), contexte, { filename: f });
  }
  return { chapitres: fenetre.CHAPTERS ?? [], quizBis: fenetre.QUIZ_BIS ?? {} };
}
