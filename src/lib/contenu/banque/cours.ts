export type NomCours = 'bph' | 'stss';
export type TypeQuestion = 'qcm_unique' | 'qcm_multiple' | 'vrai_faux' | 'reponse_courte';

export type ConfigCours = { nom: NomCours; fichier: string; prefixe: string; total: number };

export const COURS_BANQUE: Record<NomCours, ConfigCours> = {
  bph: { nom: 'bph', fichier: 'contenu/1re-st2s/bph.json', prefixe: 'bph', total: 130 },
  stss: { nom: 'stss', fichier: 'contenu/1re-st2s/stss.json', prefixe: 'stss', total: 150 },
};

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

/** Lit `--cours <nom>` dans les arguments ; `bph` par défaut. */
export function lireCoursArgument(argv: string[]): ConfigCours {
  const i = argv.indexOf('--cours');
  if (i === -1) return COURS_BANQUE.bph;
  const nom = argv[i + 1];
  if (nom === undefined) throw new Error('--cours attend un nom : bph ou stss');
  if (nom !== 'bph' && nom !== 'stss') throw new Error(`cours inconnu : ${nom} (attendu bph ou stss)`);
  return COURS_BANQUE[nom];
}
