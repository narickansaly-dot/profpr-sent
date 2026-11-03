import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { schemaCoursImport, type QuestionImport } from '../src/lib/contenu/format-import';
import type { Database } from '../src/lib/supabase/types';

const [fichier, option] = process.argv.slice(2);
if (!fichier) throw new Error('Usage : npx tsx --env-file=.env.local scripts/importer-contenu.ts <fichier.json> [--publier]');
const publier = option === '--publier';

const db = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

function verifier<T>(r: { data: T; error: { message: string } | null }, contexte: string): NonNullable<T> {
  if (r.error || r.data == null) throw new Error(`${contexte} : ${r.error?.message ?? 'aucune donnée'}`);
  return r.data as NonNullable<T>;
}

function corrige(q: QuestionImport) {
  switch (q.type) {
    case 'qcm_unique':
    case 'qcm_multiple':
      return { bonnes_reponses: q.bonnes_reponses, reponses_acceptees: [], marge: null, marge_relative: false };
    case 'vrai_faux':
      return { bonnes_reponses: [q.bonne_reponse], reponses_acceptees: [], marge: null, marge_relative: false };
    case 'reponse_courte':
      return { bonnes_reponses: [], reponses_acceptees: q.reponses_acceptees, marge: q.marge ?? null, marge_relative: q.marge_relative };
  }
}

// Pas d'await au niveau supérieur : le projet est en CommonJS.
async function main() {
  const cours = schemaCoursImport.parse(JSON.parse(readFileSync(fichier, 'utf8')));

  const filiere = verifier(await db.from('filiere').select('id').eq('code', cours.filiere).single(), `Filière ${cours.filiere}`);
  const { id: coursId } = verifier(await db.from('cours').upsert({
    slug: cours.slug, filiere_id: filiere.id, niveau_code: cours.niveau, matiere: cours.matiere,
    titre: cours.titre, couleur: cours.couleur, publie: publier,
  }, { onConflict: 'slug' }).select('id').single(), `Cours ${cours.slug}`);

  let total = 0;
  for (const ch of cours.chapitres) {
    const { id: chapitreId } = verifier(await db.from('chapitre').upsert({
      cours_id: coursId, slug: ch.slug, numero: ch.numero, titre: ch.titre, titre_court: ch.titre_court ?? null,
      duree: ch.duree ?? null, resume: ch.resume ?? null, chapeau: ch.chapeau ?? null, objectifs: ch.objectifs,
      sections: ch.sections, a_retenir: ch.a_retenir ?? null, publie: publier,
    }, { onConflict: 'cours_id,slug' }).select('id').single(), `Chapitre ${ch.slug}`);

    for (const q of ch.questions) {
      let notionId: string | null = null;
      if (q.notion) {
        notionId = verifier(await db.from('notion').upsert({ chapitre_id: chapitreId, nom: q.notion },
          { onConflict: 'chapitre_id,nom' }).select('id').single(), `Notion ${q.notion}`).id;
      }
      const { id: questionId } = verifier(await db.from('question').upsert({
        source: q.source, chapitre_id: chapitreId, notion_id: notionId, type: q.type, enonce: q.enonce,
        propositions: 'propositions' in q ? q.propositions : [], difficulte: q.difficulte, statut: q.statut,
        modifie_le: new Date().toISOString(),
      }, { onConflict: 'source' }).select('id').single(), `Question ${q.source}`);
      verifier(await db.from('question_corrige').upsert({
        question_id: questionId, explication: q.explication, ...corrige(q),
      }).select('question_id').single(), `Corrigé ${q.source}`);
      total++;
    }
  }
  console.log(`Importé : ${cours.titre}, ${cours.chapitres.length} chapitres, ${total} questions${publier ? ' (publié)' : ' (non publié)'}.`);
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
