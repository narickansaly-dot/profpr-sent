import { readFileSync } from 'node:fs';
import { analyserImport } from '../src/lib/contenu/lire-import';
import { schemaFichierBanque } from '../src/lib/contenu/banque/format';
import { verifierBanque } from '../src/lib/contenu/banque/verifier';

const COURS = 'contenu/1re-st2s/bph.json';
const numero = Number(process.argv[2]);

function echouer(message: string): never {
  console.error(message);
  process.exit(1);
}

if (!Number.isInteger(numero) || numero < 1) echouer('Usage : npm run banque:verifier -- N');

const chemin = `contenu/1re-st2s/banques/bph-ch${numero}.json`;
let brut: unknown;
try {
  brut = JSON.parse(readFileSync(chemin, 'utf8'));
} catch (e) {
  echouer(`Lecture impossible : ${chemin} (${e instanceof Error ? e.message : String(e)})`);
}
const fichier = schemaFichierBanque.safeParse(brut);
if (!fichier.success) {
  for (const p of fichier.error.issues) console.error(`  ${p.path.join('.') || 'fichier'} : ${p.message}`);
  echouer(`Fichier de travail invalide : ${chemin} (attendu { chapitre, notions, questions })`);
}
if (fichier.data.chapitre !== numero) echouer(`Le fichier ${chemin} déclare le chapitre ${fichier.data.chapitre} au lieu de ${numero}.`);

const lu = analyserImport(readFileSync(COURS, 'utf8'));
if ('erreurs' in lu) {
  for (const e of lu.erreurs) console.error(`  ${e}`);
  echouer(`Fichier invalide : ${COURS}`);
}
const existantes = lu.cours.chapitres.find((c) => c.numero === numero)?.questions ?? [];

const erreurs = verifierBanque(fichier.data, existantes);
if (erreurs.length > 0) {
  for (const e of erreurs) console.error(`  ${e}`);
  echouer(`Banque du chapitre ${numero} non conforme : ${erreurs.length} erreur${erreurs.length > 1 ? 's' : ''}.`);
}
console.log(`Banque du chapitre ${numero} conforme : ${fichier.data.questions.length} questions.`);
