import { mkdirSync, writeFileSync } from 'node:fs';
import { chargerSourcesBph, convertirBph } from './bph/convertir';
import { schemaCoursImport } from '../src/lib/contenu/format-import';

const dossier = process.argv[2];
if (!dossier) throw new Error('Usage : npx tsx scripts/convertir-bph.ts <dossier site du cours BPH>');

const { chapitres, quizBis } = chargerSourcesBph(dossier);
const cours = schemaCoursImport.parse(convertirBph(chapitres, quizBis));
mkdirSync('contenu/1re-st2s', { recursive: true });
writeFileSync('contenu/1re-st2s/bph.json', JSON.stringify(cours, null, 2) + '\n');
const total = cours.chapitres.reduce((n, c) => n + c.questions.length, 0);
console.log(`${cours.chapitres.length} chapitres et ${total} questions écrits dans contenu/1re-st2s/bph.json`);
