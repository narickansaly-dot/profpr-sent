import { readFileSync } from 'node:fs';
import { lireCoursArgument, type ConfigCours } from '../src/lib/contenu/banque/cours';
import { analyserImport } from '../src/lib/contenu/lire-import';
import { texteChapitre } from '../src/lib/contenu/banque/texte';

const argv = process.argv.slice(2);
const numero = Number(argv[0]);

function echouer(message: string): never {
  console.error(message);
  process.exit(1);
}

let config: ConfigCours;
try {
  config = lireCoursArgument(argv);
} catch (e) {
  echouer(e instanceof Error ? e.message : String(e));
}
const COURS = config.fichier;

if (!Number.isInteger(numero) || numero < 1) echouer('Usage : npm run banque:texte -- N [--cours stss]');

const lu = analyserImport(readFileSync(COURS, 'utf8'));
if ('erreurs' in lu) {
  for (const e of lu.erreurs) console.error(`  ${e}`);
  echouer(`Fichier invalide : ${COURS}`);
}
try {
  process.stdout.write(texteChapitre(lu.cours, numero));
} catch (e) {
  echouer(e instanceof Error ? e.message : String(e));
}
