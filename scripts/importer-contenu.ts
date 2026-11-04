import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { schemaCoursImport } from '../src/lib/contenu/format-import';
import { versDonneesCours } from '../src/lib/contenu/donnees-question';
import { messageErreur } from '../src/lib/erreurs';
import type { Database } from '../src/lib/supabase/types';

const args = process.argv.slice(2);
const USAGE = 'Usage : npm run import:contenu -- <fichier.json> [--publier] [--distant]';
const inconnues = args.filter((a) => a.startsWith('--') && !['--publier', '--distant'].includes(a));
const fichier = args.find((a) => !a.startsWith('--'));
const publier = args.includes('--publier');
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
  const lu = schemaCoursImport.safeParse(JSON.parse(readFileSync(fichier!, 'utf8')));
  if (!lu.success) {
    for (const e of lu.error.issues) console.error(`  ${e.path.join('.') || '(racine)'} : ${e.message}`);
    echouer(`Fichier invalide : ${fichier}`);
  }
  const cours = lu.data;
  const { data, error } = await db.rpc('importer_cours', { p_cours: versDonneesCours(cours), p_publier: publier });
  if (error) echouer(`Import refusé : ${messageErreur(error.message)} (${error.message})`);
  if (!data || typeof data !== 'object') echouer('Import refusé : la base n’a renvoyé aucun bilan.');
  const b = data as Record<string, unknown>;
  console.log(`Importé : ${cours.titre}, ${cours.chapitres.length} chapitres${publier ? ' (publié)' : ' (non publié)'}.`);
  for (const cle of ['cree', 'modifiee', 'versionnee', 'inchangee', 'archivee', 'supprimee']) console.log(`  ${cle}: ${b[cle]}`);
  const absents = b.chapitres_absents;
  console.log(`  chapitres_absents: ${Array.isArray(absents) ? JSON.stringify(absents) : absents}`);
}

main().catch((e) => echouer(e instanceof Error ? e.message : String(e)));
