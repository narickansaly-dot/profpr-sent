import { readFileSync } from 'node:fs';
import { analyserImport } from '../src/lib/contenu/lire-import';
import { texteChapitre } from '../src/lib/contenu/banque/texte';

const COURS = 'contenu/1re-st2s/bph.json';
const numero = Number(process.argv[2]);

function echouer(message: string): never {
  console.error(message);
  process.exit(1);
}

if (!Number.isInteger(numero) || numero < 1) echouer('Usage : npm run banque:texte -- N');

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
