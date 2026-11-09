import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { analyserImport } from '../src/lib/contenu/lire-import';
import { versDonneesCours } from '../src/lib/contenu/donnees-question';
import { messageErreur } from '../src/lib/erreurs';
import type { Database } from '../src/lib/supabase/types';

const args = process.argv.slice(2);
const USAGE = 'Usage : npm run import:contenu -- <fichier.json> [--publier] [--garder-statuts] [--distant]';
const inconnues = args.filter((a) => a.startsWith('--') && !['--publier', '--garder-statuts', '--distant'].includes(a));
const fichier = args.find((a) => !a.startsWith('--'));
const publier = args.includes('--publier');
const garderStatuts = args.includes('--garder-statuts');
const distant = args.includes('--distant');

function echouer(message: string): never {
  console.error(message);
  process.exit(1);
}

if (inconnues.length > 0) echouer(`Option inconnue : ${inconnues.join(', ')}.\n${USAGE}`);
if (!fichier) echouer(USAGE);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !cle) {
  echouer('Variables manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies (voir .env.local).');
}

// Garde « base locale » : la clé service_role ne doit pas partir vers une base distante par mégarde.
let hote: string;
try {
  hote = new URL(url).hostname;
} catch {
  echouer('NEXT_PUBLIC_SUPABASE_URL n’est pas une URL valide (voir .env.local).');
}
if (!['localhost', '127.0.0.1', '[::1]'].includes(hote)) {
  if (!distant) {
    echouer(`Refusé : ${hote} n’est pas la base locale. Ajoute --distant pour importer volontairement sur une base distante.`);
  }
  console.warn(`ATTENTION : import sur une base DISTANTE (${hote}) avec la clé service_role.`);
}

const db = createClient<Database>(url, cle, { auth: { persistSession: false } });

// Pas d'await au niveau supérieur : le projet est en CommonJS.
async function main() {
  const lu = analyserImport(readFileSync(fichier!, 'utf8'));
  if ('erreurs' in lu) {
    for (const e of lu.erreurs) console.error(`  ${e}`);
    echouer(`Fichier invalide : ${fichier}`);
  }
  const cours = lu.cours;
  const { data, error } = await db.rpc('importer_cours', { p_cours: versDonneesCours(cours, { garderStatuts }), p_publier: publier });
  if (error) echouer(`Import refusé : ${messageErreur(error.message)} (${error.message})`);
  if (!data || typeof data !== 'object') echouer('Import refusé : la base n’a renvoyé aucun bilan.');
  const b = data as Record<string, unknown>;
  console.log(`Importé : ${cours.titre}, ${cours.chapitres.length} chapitres${publier ? ' (publié)' : ' (non publié)'}.`);
  for (const cle of ['cree', 'modifiee', 'versionnee', 'inchangee', 'archivee', 'supprimee']) console.log(`  ${cle}: ${b[cle]}`);
  const absents = b.chapitres_absents;
  console.log(`  chapitres_absents: ${Array.isArray(absents) ? JSON.stringify(absents) : absents}`);
  if (garderStatuts) {
    const sources = cours.chapitres.flatMap((ch) => ch.questions.filter((q) => (q.statut ?? 'a_relire') !== 'valide').map((q) => q.source));
    let conserves = 0;
    for (let i = 0; i < sources.length; i += 500) {
      const { count, error: e } = await db.from('question').select('id', { count: 'exact', head: true })
        .in('source', sources.slice(i, i + 500)).eq('statut', 'valide');
      if (e) echouer(`Bilan des statuts impossible : ${e.message}`);
      conserves += count ?? 0;
    }
    console.log(`  statuts_conserves: ${conserves}`);
  }
}

main().catch((e) => echouer(e instanceof Error ? e.message : String(e)));