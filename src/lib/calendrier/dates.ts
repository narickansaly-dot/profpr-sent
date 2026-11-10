import { heureParisVersIso } from '@/lib/enseignant/dates';

export type Vue = 'jour' | 'semaine' | 'mois';
export const VUES: readonly Vue[] = ['jour', 'semaine', 'mois'];

const JOUR_MS = 86_400_000;
const partiesParis = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Paris', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
});

function parties(instant: Date) {
  return Object.fromEntries(partiesParis.formatToParts(instant).map((p) => [p.type, p.value]));
}

/** Jour de Paris (AAAA-MM-JJ) d'un instant. */
export function jourParis(instant: Date): string {
  const p = parties(instant);
  return `${p.year}-${p.month}-${p.day}`;
}

/** Heure de Paris (HH:MM) d'une date ISO. */
export function heureParis(iso: string): string {
  const p = parties(new Date(iso));
  return `${p.hour}:${p.minute}`;
}

// Les jours sont manipulés comme des dates UTC à minuit : pas de fuseau, pas de changement d'heure.
const enMs = (jour: string) => {
  const [a, m, j] = jour.split('-').map(Number);
  return Date.UTC(a, m - 1, j);
};
const versJour = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function estJourValide(jour: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(jour) && versJour(enMs(jour)) === jour;
}
export function ajouterJours(jour: string, n: number): string {
  return versJour(enMs(jour) + n * JOUR_MS);
}
/** 1 = lundi … 7 = dimanche. */
export function jourSemaineIso(jour: string): number {
  const d = new Date(enMs(jour)).getUTCDay();
  return d === 0 ? 7 : d;
}
export function debutSemaine(jour: string): string {
  return ajouterJours(jour, 1 - jourSemaineIso(jour));
}
export function debutMois(jour: string): string {
  return `${jour.slice(0, 7)}-01`;
}
export function ajouterMois(jour: string, n: number): string {
  const [a, m] = jour.split('-').map(Number);
  return versJour(Date.UTC(a, m - 1 + n, 1));
}
/** 6 semaines complètes, du lundi qui précède (ou qui est) le 1er du mois. */
export function grilleMois(jour: string): string[] {
  const premier = debutSemaine(debutMois(jour));
  return Array.from({ length: 42 }, (_, i) => ajouterJours(premier, i));
}

/** Minuit à Paris, en ISO UTC. */
export function debutJourParis(jour: string): string {
  const iso = heureParisVersIso(`${jour}T00:00`);
  if (!iso) throw new Error(`Jour invalide : ${jour}`);
  return iso;
}

export function periodeVue(vue: Vue, jour: string): { jours: string[]; de: string; a: string } {
  const jours = vue === 'jour' ? [jour]
    : vue === 'semaine' ? Array.from({ length: 7 }, (_, i) => ajouterJours(debutSemaine(jour), i))
    : grilleMois(jour);
  return { jours, de: debutJourParis(jours[0]), a: debutJourParis(ajouterJours(jours[jours.length - 1], 1)) };
}

export function lireVue(params: { vue?: string; date?: string }, maintenant: Date): { vue: Vue; jour: string } {
  const vue = VUES.includes(params.vue as Vue) ? (params.vue as Vue) : 'semaine';
  const aujourdhui = jourParis(maintenant);
  // Une date trop lointaine (ex. 9999-12-31) ferait échouer le calcul de la période : on retombe sur aujourd'hui.
  const proche = (j: string) => Math.abs(enMs(j) - enMs(aujourdhui)) <= 5 * 366 * JOUR_MS;
  const jour = params.date && estJourValide(params.date) && proche(params.date) ? params.date : aujourdhui;
  return { vue, jour };
}

export function naviguer(vue: Vue, jour: string, sens: 1 | -1): string {
  if (vue === 'jour') return ajouterJours(jour, sens);
  if (vue === 'semaine') return ajouterJours(jour, 7 * sens);
  return ajouterMois(debutMois(jour), sens);
}

const formatJour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const formatJourAnnee = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const formatJourMois = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const formatMois = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export function libelleJour(jour: string): string {
  return formatJour.format(enMs(jour));
}
export function libellePeriode(vue: Vue, jour: string): string {
  if (vue === 'jour') return formatJourAnnee.format(enMs(jour));
  if (vue === 'semaine') return `Semaine du ${formatJourMois.format(enMs(debutSemaine(jour)))}`;
  return formatMois.format(enMs(jour));
}
