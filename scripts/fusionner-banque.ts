import { readFileSync, writeFileSync } from 'node:fs';
import { schemaQuestionImport, type CoursImport } from '../src/lib/contenu/format-import';
import { lireCoursArgument, type ConfigCours } from '../src/lib/contenu/banque/cours';
import { analyserImport } from '../src/lib/contenu/lire-import';
import { schemaFichierBanque } from '../src/lib/contenu/banque/format';
import { fusionnerBanque, serialiserCours } from '../src/lib/contenu/banque/fusionner';
import { verifierBanque } from '../src/lib/contenu/banque/verifier';

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

if (!Number.isInteger(numero) || numero < 1) echouer('Usage : npm run banque:fusionner -- N [--cours stss]');

const chemin = `contenu/1re-st2s/banques/${config.nom}-ch${numero}.json`;
let brutBanque: unknown;
try {
  brutBanque = JSON.parse(readFileSync(chemin, 'utf8'));
} catch (e) {
  echouer(`Lecture impossible : ${chemin} (${e instanceof Error ? e.message : String(e)})`);
}
const fichier = schemaFichierBanque.safeParse(brutBanque);
if (!fichier.success) echouer(`Fichier de travail invalide : ${chemin} (attendu { chapitre, notions, questions })`);
if (fichier.data.chapitre !== numero) echouer(`Le fichier ${chemin} déclare le chapitre ${fichier.data.chapitre} au lieu de ${numero}.`);

const texteCours = readFileSync(COURS, 'utf8');
const lu = analyserImport(texteCours);
if ('erreurs' in lu) {
  for (const e of lu.erreurs) console.error(`  ${e}`);
  echouer(`Fichier invalide : ${COURS}`);
}
const existantes = lu.cours.chapitres.find((c) => c.numero === numero)?.questions ?? [];
const erreurs = verifierBanque(fichier.data, existantes, config);
if (erreurs.length > 0) {
  for (const e of erreurs) console.error(`  ${e}`);
  echouer(`Fusion refusée : la banque du chapitre ${numero} n’est pas conforme (npm run banque:verifier -- ${numero}${config.nom === 'bph' ? '' : ` --cours ${config.nom}`}).`);
}

try {
  // On fusionne dans le JSON brut (pas dans la lecture de zod) pour garder l'ordre des clés et ne rien normaliser.
  const brut = JSON.parse(texteCours) as CoursImport;
  const questions = fichier.data.questions.map((q) => schemaQuestionImport.parse(q));
  const fusion = fusionnerBanque(brut, { ...fichier.data, questions });
  const avant = brut.chapitres.find((c) => c.numero === numero)?.questions.length ?? 0;
  const apres = fusion.chapitres.find((c) => c.numero === numero)?.questions.length ?? 0;
  writeFileSync(COURS, serialiserCours(fusion));
  console.log(`Chapitre ${numero} : ${apres - avant} question${apres - avant > 1 ? 's' : ''} ajoutée${apres - avant > 1 ? 's' : ''} (${fichier.data.questions.length - (apres - avant)} déjà présente${fichier.data.questions.length - (apres - avant) > 1 ? 's' : ''}) dans ${COURS}.`);
} catch (e) {
  echouer(`Fusion refusée : ${e instanceof Error ? e.message : String(e)}`);
}
