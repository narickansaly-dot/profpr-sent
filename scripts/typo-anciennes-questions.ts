import { readFileSync, writeFileSync } from 'node:fs';
import type { CoursImport } from '../src/lib/contenu/format-import';
import { serialiserCours } from '../src/lib/contenu/banque/fusionner';
import { harmoniserTypoAnciennes } from '../src/lib/contenu/banque/typo-anciennes';

// Script ponctuel : espaces insécables avant ? : ; ! dans enonce/explication des anciennes questions (quiz, bis).
const COURS = 'contenu/1re-st2s/bph.json';
const brut = JSON.parse(readFileSync(COURS, 'utf8')) as CoursImport;
const { cours, modifiees } = harmoniserTypoAnciennes(brut);
if (modifiees > 0) writeFileSync(COURS, serialiserCours(cours));
console.log(`${modifiees} question${modifiees > 1 ? 's' : ''} modifiée${modifiees > 1 ? 's' : ''} dans ${COURS}.`);
