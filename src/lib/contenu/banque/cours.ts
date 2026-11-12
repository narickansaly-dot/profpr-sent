export type NomCours = 'bph' | 'stss';
export type TypeQuestion = 'qcm_unique' | 'qcm_multiple' | 'vrai_faux' | 'reponse_courte';

/**
 * `nom` est ce qu'on passe à `--cours` (un nom connu ou le chemin du cours) ;
 * les fichiers de travail sont `<banques>/<prefixe>-chN.json`.
 */
export type ConfigCours = { nom: string; fichier: string; banques: string; prefixe: string; total: number };

export const COURS_BANQUE: Record<NomCours, ConfigCours> = {
  bph: { nom: 'bph', fichier: 'contenu/1re-st2s/bph.json', banques: 'contenu/1re-st2s/banques', prefixe: 'bph', total: 130 },
  stss: { nom: 'stss', fichier: 'contenu/1re-st2s/stss.json', banques: 'contenu/1re-st2s/banques', prefixe: 'stss', total: 150 },
};

/** Nombre de questions par banque pour un cours désigné par son chemin. */
export const TOTAL_PAR_DEFAUT = 150;

/** Chemin du fichier de travail du chapitre `numero`. */
export function cheminBanque(config: ConfigCours, numero: number): string {
  return `${config.banques}/${config.prefixe}-ch${numero}.json`;
}

/**
 * Cours désigné par le chemin de son fichier, par exemple `contenu/1re-gen/svt.json` :
 * préfixe `svt`, banques dans `contenu/1re-gen/banques/`, 150 questions par chapitre.
 */
export function coursDepuisChemin(chemin: string): ConfigCours {
  const m = /^((?:[\w.-]+\/)*)([a-z][a-z0-9-]*)\.json$/.exec(chemin);
  if (!m || chemin.split('/').some((p) => p === '..')) {
    throw new Error(`cours inconnu : ${chemin} (attendu bph, stss ou le chemin d’un cours, par exemple contenu/1re-gen/svt.json)`);
  }
  const dossier = m[1].replace(/\/$/, '');
  return { nom: chemin, fichier: chemin, banques: dossier === '' ? 'banques' : `${dossier}/banques`, prefixe: m[2], total: TOTAL_PAR_DEFAUT };
}

/** Arrondit chaque part, puis ajuste la plus grande pour que la somme fasse `total`. */
function repartir<K extends string>(total: number, parts: Record<K, number>): Record<K, number> {
  const cles = Object.keys(parts) as K[];
  const res = {} as Record<K, number>;
  for (const k of cles) res[k] = Math.round(total * parts[k]);
  const plusGrande = cles.reduce((a, b) => (parts[b] > parts[a] ? b : a));
  res[plusGrande] += total - cles.reduce((s, k) => s + res[k], 0);
  return res;
}

/** Quotas en proportion des parts de la spec 6a : types 50/20/20/10 %, difficultés 40/40/20 %. */
export function quotasPour(total: number): { types: Record<TypeQuestion, number>; difficultes: Record<1 | 2 | 3, number> } {
  const types = repartir<TypeQuestion>(total, { qcm_unique: 0.5, qcm_multiple: 0.2, vrai_faux: 0.2, reponse_courte: 0.1 });
  const d = repartir<'1' | '2' | '3'>(total, { '1': 0.4, '2': 0.4, '3': 0.2 });
  return { types, difficultes: { 1: d['1'], 2: d['2'], 3: d['3'] } };
}

/** Lit `--cours <nom ou chemin>` dans les arguments ; `bph` par défaut. */
export function lireCoursArgument(argv: string[]): ConfigCours {
  const i = argv.indexOf('--cours');
  if (i === -1) return COURS_BANQUE.bph;
  const nom = argv[i + 1];
  if (nom === undefined) throw new Error('--cours attend un nom (bph ou stss) ou le chemin d’un cours');
  if (nom === 'bph' || nom === 'stss') return COURS_BANQUE[nom];
  return coursDepuisChemin(nom);
}

/** Suffixe `--cours …` à rappeler dans les messages (vide pour BPH, le cours par défaut). */
export function optionCours(config: ConfigCours): string {
  return config.nom === 'bph' ? '' : ` --cours ${config.nom}`;
}
