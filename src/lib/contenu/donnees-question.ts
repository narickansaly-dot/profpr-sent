import type { CoursImport, QuestionImport } from './format-import';
import { nettoyerHtml } from './html';

export type DonneesQuestion = {
  source?: string; type: QuestionImport['type']; enonce: string; propositions: string[]; bonnes_reponses: (number | boolean)[];
  reponses_acceptees: string[]; marge: number | null; marge_relative: boolean; notion: string | null;
  difficulte: number; statut: 'brouillon' | 'a_relire' | 'valide'; explication: string;
};

export function versDonneesQuestion(q: QuestionImport): DonneesQuestion {
  const commun = { source: q.source, type: q.type, enonce: q.enonce, notion: q.notion ?? null, difficulte: q.difficulte,
    statut: q.statut, explication: q.explication };
  switch (q.type) {
    case 'qcm_unique':
    case 'qcm_multiple':
      return { ...commun, propositions: q.propositions, bonnes_reponses: q.bonnes_reponses, reponses_acceptees: [], marge: null, marge_relative: false };
    case 'vrai_faux':
      return { ...commun, propositions: [], bonnes_reponses: [q.bonne_reponse], reponses_acceptees: [], marge: null, marge_relative: false };
    case 'reponse_courte':
      return { ...commun, propositions: [], bonnes_reponses: [], reponses_acceptees: q.reponses_acceptees, marge: q.marge ?? null, marge_relative: q.marge_relative };
  }
}

export function versDonneesCours(c: CoursImport) {
  return {
    slug: c.slug, filiere: c.filiere, niveau: c.niveau, matiere: c.matiere, titre: c.titre, couleur: c.couleur.toLowerCase(),
    chapitres: c.chapitres.map((ch) => ({
      slug: ch.slug, numero: ch.numero, titre: ch.titre, titre_court: ch.titre_court ?? '', duree: ch.duree ?? '',
      resume: ch.resume ?? '', chapeau: ch.chapeau ?? '', objectifs: ch.objectifs,
      sections: ch.sections.map((s) => ({ id: s.id, titre: s.titre, html: nettoyerHtml(s.html) })),
      a_retenir: ch.a_retenir ? nettoyerHtml(ch.a_retenir) : '',
      questions: ch.questions.map(versDonneesQuestion),
    })),
  };
}
