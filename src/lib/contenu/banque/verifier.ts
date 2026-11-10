import { z } from 'zod';
import { schemaQuestionImport, type QuestionImport } from '../format-import';
import { COURS_BANQUE, quotasPour, type ConfigCours } from './cours';
import type { FichierBanque } from './format';

export const TOLERANCE = 3;
export const SEUIL_POSITION = 0.4;
export const SEUIL_LONGUEUR = 0.4;
export const SEUIL_SIMILARITE = 0.8;
export const SEUIL_VRAI_FAUX = 0.6;
export const QUOTAS_TYPES = quotasPour(130).types;
export const QUOTAS_DIFFICULTE = quotasPour(130).difficultes;

export const MENTION_QCM_MULTIPLE = 'Coche toutes les réponses exactes.';

const ERREURS_FR = z.locales.fr().localeError;

function normaliser(texte: string): string {
  return texte.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function trigrammes(texte: string): Set<string> {
  const t = ` ${normaliser(texte)} `;
  const ensemble = new Set<string>();
  for (let i = 0; i + 3 <= t.length; i++) ensemble.add(t.slice(i, i + 3));
  return ensemble;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let commun = 0;
  for (const g of a) if (b.has(g)) commun++;
  const union = a.size + b.size - commun;
  return union === 0 ? 1 : commun / union;
}

/** Similarité de deux énoncés : coefficient de Jaccard sur les trigrammes de caractères des textes normalisés (0 à 1). */
export function similarite(a: string, b: string): number {
  return jaccard(trigrammes(a), trigrammes(b));
}

const pourcent = (x: number) => Math.round(x * 100);
const decimal = (x: number) => x.toFixed(2).replace('.', ',');

export const NOTIONS_MIN = 5;
export const NOTIONS_MAX = 12;
export const NOTION_LONGUEUR_MAX = 40;

/** Sur le texte normalisé : « toutes les réponses… », « aucune de ces réponses », « toutes les propositions »… */
const PROPOSITION_INTERDITE = /\b(toutes|aucune)( (les|des|ces|de ces))? (reponses|propositions)\b/;
const ESPACE_NORMALE_AVANT_SIGNE = / [:;!?]/;

type Brute = Record<string, unknown>;

const texte = (v: unknown): string => (typeof v === 'string' ? v : '');
const propositionsDe = (q: Brute): string[] => (Array.isArray(q.propositions) ? q.propositions.filter((p): p is string => typeof p === 'string') : []);
const reponsesDe = (q: Brute): number[] => (Array.isArray(q.bonnes_reponses) ? q.bonnes_reponses.filter((n): n is number => typeof n === 'number') : []);

/**
 * Contrôle un fichier de travail. Renvoie la liste des erreurs (vide si tout va bien).
 * `existantes` : les questions déjà présentes dans le chapitre du fichier du cours (`bph.json` ou `stss.json`), pour détecter les doublons proches.
 */
export function verifierBanque(f: FichierBanque, existantes: QuestionImport[], config: ConfigCours = COURS_BANQUE.bph): string[] {
  const quotas = quotasPour(config.total);
  const erreurs: string[] = [];
  const brutes = f.questions as unknown as Brute[];
  const nom = (q: Brute, i: number) => (typeof q.source === 'string' && q.source !== '' ? q.source : `n° ${i + 1}`);

  // 1. Validateur d'import de l'application.
  const valides = new Set<number>();
  brutes.forEach((q, i) => {
    const lu = schemaQuestionImport.safeParse(q, { error: ERREURS_FR });
    if (lu.success) valides.add(i);
    else for (const m of new Set(lu.error.issues.map((p) => p.message))) erreurs.push(`question ${nom(q, i)} : ${m}`);
  });

  // 2 à 4. Sources : uniques, au format <préfixe>:chN:banque:NNN, avec le bon chapitre.
  const motif = new RegExp(`^${config.prefixe.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:ch(\\d+):banque:\\d{3}$`);
  const vues = new Set<string>();
  const doublons = new Set<string>();
  brutes.forEach((q) => {
    const s = texte(q.source);
    if (vues.has(s)) doublons.add(s);
    vues.add(s);
  });
  for (const s of doublons) erreurs.push(`source en double : ${s}`);
  for (const q of brutes) {
    const s = texte(q.source);
    const m = motif.exec(s);
    if (!m || Number(m[1]) !== f.chapitre) erreurs.push(`source invalide : ${s} (attendu ${config.prefixe}:ch${f.chapitre}:banque:NNN)`);
  }

  // 5 et 6. Répartitions.
  for (const [type, quota] of Object.entries(quotas.types)) {
    const n = brutes.filter((q) => q.type === type).length;
    if (Math.abs(n - quota) > TOLERANCE) erreurs.push(`répartition des types : ${type} ${n} (attendu ${quota} ± ${TOLERANCE})`);
  }
  for (const [niveau, quota] of Object.entries(quotas.difficultes)) {
    const n = brutes.filter((q) => q.difficulte === Number(niveau)).length;
    if (Math.abs(n - quota) > TOLERANCE) erreurs.push(`répartition des difficultés : ${niveau} → ${n} (attendu ${quota} ± ${TOLERANCE})`);
  }

  // Liste fermée de notions : 5 à 12, de 1 à 40 caractères, sans doublon.
  const invalide = (raison: string) => erreurs.push(`liste de notions invalide : ${raison}`);
  if (f.notions.length < NOTIONS_MIN || f.notions.length > NOTIONS_MAX) {
    invalide(`${f.notions.length} notion${f.notions.length > 1 ? 's' : ''} (attendu de ${NOTIONS_MIN} à ${NOTIONS_MAX})`);
  }
  const vuesNotions = new Set<string>();
  for (const n of f.notions) {
    const propre = n.trim();
    if (propre === '') invalide('une notion est vide');
    else if (propre.length > NOTION_LONGUEUR_MAX) invalide(`« ${propre} » dépasse ${NOTION_LONGUEUR_MAX} caractères`);
    const cle = normaliser(propre);
    if (cle !== '' && vuesNotions.has(cle)) invalide(`« ${propre} » en double`);
    vuesNotions.add(cle);
  }

  // 7 à 9. Explication et notion.
  brutes.forEach((q, i) => {
    if (texte(q.explication).trim() === '') erreurs.push(`explication manquante : ${nom(q, i)}`);
    const notion = texte(q.notion).trim();
    if (notion === '') erreurs.push(`notion manquante : ${nom(q, i)}`);
    else if (!f.notions.includes(notion)) erreurs.push(`notion inconnue « ${notion} » : ${nom(q, i)}`);
  });

  // 10 à 12. Propositions et qcm_multiple.
  brutes.forEach((q, i) => {
    if (propositionsDe(q).some((p) => PROPOSITION_INTERDITE.test(normaliser(p)))) {
      erreurs.push(`proposition interdite : ${nom(q, i)}`);
    }
    if (q.type === 'qcm_multiple' && valides.has(i)) {
      const n = reponsesDe(q).length;
      if (n < 2 || n > 3) erreurs.push(`qcm_multiple avec ${n} bonne${n > 1 ? 's' : ''} réponse${n > 1 ? 's' : ''} (attendu 2 ou 3) : ${nom(q, i)}`);
      if (!texte(q.enonce).includes(MENTION_QCM_MULTIPLE)) erreurs.push(`mention « ${MENTION_QCM_MULTIPLE} » absente : ${nom(q, i)}`);
    }
  });

  // 13 et 14. Biais de position et de longueur, sur les qcm_unique.
  const uniques = brutes.filter((q, i) => q.type === 'qcm_unique' && valides.has(i));
  if (uniques.length > 0) {
    const parPosition = new Map<number, number>();
    let plusLongue = 0;
    for (const q of uniques) {
      const bonne = reponsesDe(q)[0];
      const p = propositionsDe(q);
      parPosition.set(bonne, (parPosition.get(bonne) ?? 0) + 1);
      if (p.every((x, k) => k === bonne || p[bonne].length > x.length)) plusLongue++;
    }
    for (const [position, n] of [...parPosition].sort(([a], [b]) => a - b)) {
      if (n / uniques.length > SEUIL_POSITION) {
        erreurs.push(`biais de position : la position ${position + 1} porte ${pourcent(n / uniques.length)} % des bonnes réponses (${pourcent(SEUIL_POSITION)} % au plus)`);
      }
    }
    if (plusLongue / uniques.length >= SEUIL_LONGUEUR) {
      erreurs.push(`biais de longueur : la bonne réponse est la plus longue dans ${pourcent(plusLongue / uniques.length)} % des QCM (moins de ${pourcent(SEUIL_LONGUEUR)} %)`);
    }
  }

  // 15. Énoncés trop proches, entre nouvelles questions et avec les existantes (hors sources déjà dans le fichier).
  const sourcesFichier = new Set(brutes.map((q) => texte(q.source)));
  const autres = existantes.filter((e) => !sourcesFichier.has(e.source));
  const grammes = brutes.map((q) => trigrammes(texte(q.enonce)));
  const grammesAutres = autres.map((e) => trigrammes(e.enonce));
  for (let i = 0; i < brutes.length; i++) {
    for (let j = i + 1; j < brutes.length; j++) {
      const s = jaccard(grammes[i], grammes[j]);
      if (s > SEUIL_SIMILARITE) erreurs.push(`énoncés trop proches (${decimal(s)}) : ${nom(brutes[i], i)} et ${nom(brutes[j], j)}`);
    }
    for (let k = 0; k < autres.length; k++) {
      const s = jaccard(grammes[i], grammesAutres[k]);
      if (s > SEUIL_SIMILARITE) erreurs.push(`énoncés trop proches (${decimal(s)}) : ${nom(brutes[i], i)} et ${autres[k].source}`);
    }
  }

  // 16. Vrai/faux équilibrés.
  const vf = brutes.filter((q) => q.type === 'vrai_faux' && typeof q.bonne_reponse === 'boolean');
  if (vf.length > 0) {
    const vrais = vf.filter((q) => q.bonne_reponse === true).length;
    const faux = vf.length - vrais;
    const limite = `${pourcent(SEUIL_VRAI_FAUX)} % au plus`;
    if (vrais / vf.length > SEUIL_VRAI_FAUX) erreurs.push(`vrai/faux déséquilibrés : ${vrais} vrais sur ${vf.length} (${limite})`);
    else if (faux / vf.length > SEUIL_VRAI_FAUX) erreurs.push(`vrai/faux déséquilibrés : ${faux} faux sur ${vf.length} (${limite})`);
  }

  // 17. Typographie : espace insécable avant « : ; ! ? ».
  brutes.forEach((q, i) => {
    if ([texte(q.enonce), ...propositionsDe(q), texte(q.explication)].some((t) => ESPACE_NORMALE_AVANT_SIGNE.test(t))) {
      erreurs.push(`espace insécable manquante : ${nom(q, i)}`);
    }
  });

  return erreurs;
}
