export type NomCours = 'bph' | 'stss';
export type TypeQuestion = 'qcm_unique' | 'qcm_multiple' | 'vrai_faux' | 'reponse_courte';

/**
 * Configuration d'un cours pour les scripts de banque.
 * `nom` : ce qu'on passe à `--cours` (et qu'on affiche) ; `fichier` : le JSON du cours ; `banques` : le dossier des fichiers
 * de travail (`<matiere>-chN.json`, `<matiere>` étant le nom du fichier du cours) ; `prefixe` : le début des sources
 * (`<prefixe>:chN:banque:NNN`), qui doivent être uniques dans toute la base ; `total` : questions par chapitre.
 */
export type ConfigCours = { nom: string; fichier: string; banques: string; prefixe: string; total: number };

export const COURS_BANQUE: Record<NomCours, ConfigCours> = {
  bph: { nom: 'bph', fichier: 'contenu/1re-st2s/bph.json', banques: 'contenu/1re-st2s/banques', prefixe: 'bph', total: 130 },
  stss: { nom: 'stss', fichier: 'contenu/1re-st2s/stss.json', banques: 'contenu/1re-st2s/banques', prefixe: 'stss', total: 150 },
};

/** Nombre de questions par chapitre d'un cours désigné par son chemin. */
export const TOTAL_PAR_DEFAUT = 150;

/**
 * Configuration d'un cours désigné par son fichier : `1re-gen/espagnol`, `contenu/1re-gen/espagnol.json`…
 * Le fichier est `contenu/<dossier>/<matiere>.json`, les fichiers de travail sont dans `contenu/<dossier>/banques/`
 * et s'appellent `<matiere>-chN.json`, les sources commencent par `<matiere>:`.
 */
export function configPourChemin(chemin: string): ConfigCours {
  const nom = chemin.replace(/^\.\//, '').replace(/^contenu\//, '').replace(/\.json$/, '');
  const morceaux = nom.split('/');
  const prefixe = morceaux[morceaux.length - 1];
  if (morceaux.length < 2 || morceaux.some((m) => m === '' || m === '.' || m === '..') || !/^[a-z0-9-]+$/.test(prefixe)) {
    throw new Error(`cours inconnu : ${chemin} (attendu bph, stss ou un chemin comme 1re-gen/espagnol)`);
  }
  const dossier = `contenu/${morceaux.slice(0, -1).join('/')}`;
  return { nom, fichier: `${dossier}/${prefixe}.json`, banques: `${dossier}/banques`, prefixe, total: TOTAL_PAR_DEFAUT };
}

/** Chemin du fichier de travail du chapitre `numero` : `<banques>/<matiere>-chN.json`. */
export function cheminBanque(config: ConfigCours, numero: number): string {
  const matiere = config.fichier.split('/').pop()!.replace(/\.json$/, '');
  return `${config.banques}/${matiere}-ch${numero}.json`;
}

/** Les options `--cours` et `--prefixe` à répéter dans un message (vide pour BPH, le cours par défaut). */
export function optionCours(config: ConfigCours): string {
  if (config.nom === 'bph') return '';
  const matiere = config.fichier.split('/').pop()!.replace(/\.json$/, '');
  return ` --cours ${config.nom}${config.prefixe === matiere ? '' : ` --prefixe ${config.prefixe}`}`;
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

/**
 * Lit `--cours <nom ou chemin>` dans les arguments ; `bph` par défaut.
 * `--prefixe <p>` remplace le préfixe des sources d'un cours désigné par son chemin (par défaut, le nom du fichier) :
 * il sert quand deux cours ont le même nom de fichier, comme `2de-gen/espagnol` et `1re-gen/espagnol` (`--prefixe espagnol-1re`).
 */
export function lireCoursArgument(argv: string[]): ConfigCours {
  const i = argv.indexOf('--cours');
  const j = argv.indexOf('--prefixe');
  const prefixe = j === -1 ? undefined : argv[j + 1];
  if (j !== -1 && (prefixe === undefined || !/^[a-z0-9-]+$/.test(prefixe))) throw new Error('--prefixe attend des minuscules, chiffres ou tirets (par exemple espagnol-1re)');
  if (i === -1) {
    if (prefixe !== undefined) throw new Error('--prefixe s’emploie avec --cours <chemin>');
    return COURS_BANQUE.bph;
  }
  const nom = argv[i + 1];
  if (nom === undefined || nom.startsWith('--')) throw new Error('--cours attend un nom (bph, stss) ou un chemin (1re-gen/espagnol)');
  if (nom === 'bph' || nom === 'stss') {
    if (prefixe !== undefined) throw new Error('--prefixe s’emploie avec --cours <chemin>');
    return COURS_BANQUE[nom];
  }
  const config = configPourChemin(nom);
  return prefixe === undefined ? config : { ...config, prefixe };
}
