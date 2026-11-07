import { heureParisVersIso } from '@/lib/enseignant/dates';
import { ajouterJours, debutSemaine, jourParis, jourSemaineIso } from '@/lib/calendrier/dates';

export type ChapitrePlan = { id: string; numero: number; titre: string; valide: boolean; meilleureNote: number | null; valideLe: string | null };
export type Reglages = { sessionsParSemaine: number; dureeMinutes: number; joursPreferes: number[]; heureDebut: string };
export type Creneau = { debut: string; fin: string };
export type SessionPlan = { debut: string; dureeMinutes: number; chapitres: string[]; titre: string; revisionGenerale: boolean };
export type Planning = { sessions: SessionPlan[]; regroupe: boolean; avertissements: string[] };

const MINUTE = 60_000;
const FIN_AU_PLUS_TARD = 22 * 60; // une session finit au plus tard à 22 h (heure de Paris)
const DECALAGES = [0, 60, 120, 180]; // en cas de chevauchement : 1, 2 puis 3 heures plus tard
const MARGE = 30 * MINUTE; // pas de session qui commence dans moins de 30 minutes

/** Non validés d'abord, puis note la plus basse, puis validés depuis le plus longtemps, puis l'ordre du cours. */
export function trierParPriorite(chapitres: ChapitrePlan[]): ChapitrePlan[] {
  const temps = (iso: string | null) => (iso ? Date.parse(iso) : -Infinity);
  return [...chapitres].sort((a, b) =>
    Number(a.valide) - Number(b.valide)
    || (a.meilleureNote ?? -1) - (b.meilleureNote ?? -1)
    || temps(a.valideLe) - temps(b.valideLe)
    || a.numero - b.numero);
}

const enMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
const enHhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Premier créneau libre du jour à partir de l'heure choisie, ou null. */
function creneauDuJour(jour: string, reglages: Reglages, occupes: { d: number; f: number }[], apres: number): string | null {
  const base = enMinutes(reglages.heureDebut);
  for (const decalage of DECALAGES) {
    const m = base + decalage;
    if (m + reglages.dureeMinutes > FIN_AU_PLUS_TARD) return null;
    const iso = heureParisVersIso(`${jour}T${enHhmm(m)}`);
    if (!iso) continue;
    const d = Date.parse(iso);
    const f = d + reglages.dureeMinutes * MINUTE;
    if (d <= apres) continue;
    if (!occupes.some((o) => d < o.f && o.d < f)) return iso;
  }
  return null;
}

function titreSession(groupe: ChapitrePlan[]): string {
  if (groupe.length === 1) return `Révision · Ch. ${groupe[0].numero} ${groupe[0].titre}`.slice(0, 120);
  const numeros = groupe.map((c) => c.numero).sort((a, b) => a - b);
  return `Révision · Ch. ${numeros.slice(0, -1).join(', ')} et ${numeros[numeros.length - 1]}`.slice(0, 120);
}

export function genererPlanning(p: {
  maintenant: Date; examenDebut: string; chapitres: ChapitrePlan[]; reglages: Reglages; occupes: Creneau[];
}): Planning {
  const { maintenant, reglages } = p;
  if (p.chapitres.length === 0) return { sessions: [], regroupe: false, avertissements: ['Aucun chapitre à réviser.'] };
  const avertissements: string[] = [];
  const examen = Date.parse(p.examenDebut);
  const occupes = p.occupes.map((o) => ({ d: Date.parse(o.debut), f: Date.parse(o.fin) }));
  const apres = maintenant.getTime() + MARGE;
  const aujourdhui = jourParis(maintenant);
  const veille = ajouterJours(jourParis(new Date(examen)), -1);
  const tries = trierParPriorite(p.chapitres);

  // 1. Créneaux : d'aujourd'hui à l'avant-veille, jours préférés, plafond par semaine (lundi à dimanche).
  const creneaux: string[] = [];
  const parSemaine = new Map<string, number>();
  for (let jour = aujourdhui; jour < veille; jour = ajouterJours(jour, 1)) {
    if (!reglages.joursPreferes.includes(jourSemaineIso(jour))) continue;
    const semaine = debutSemaine(jour);
    const deja = parSemaine.get(semaine) ?? 0;
    if (deja >= reglages.sessionsParSemaine) continue;
    const debut = creneauDuJour(jour, reglages, occupes, apres);
    if (!debut) continue;
    creneaux.push(debut);
    parSemaine.set(semaine, deja + 1);
  }

  // 2. Répartition : groupes de chapitres consécutifs dans l'ordre de priorité, étalés régulièrement.
  const sessions: SessionPlan[] = [];
  let regroupe = false;
  if (creneaux.length === 0) {
    avertissements.push('Aucun créneau libre avant l’examen\u00a0: seule la révision générale est prévue.');
  } else {
    const parSession = Math.ceil(tries.length / creneaux.length);
    regroupe = parSession > 1;
    const groupes: ChapitrePlan[][] = [];
    for (let i = 0; i < tries.length; i += parSession) groupes.push(tries.slice(i, i + parSession));
    groupes.forEach((groupe, i) => {
      sessions.push({
        debut: creneaux[Math.floor((i * creneaux.length) / groupes.length)],
        dureeMinutes: reglages.dureeMinutes,
        chapitres: groupe.map((c) => c.id),
        titre: titreSession(groupe),
        revisionGenerale: false,
      });
    });
    if (regroupe) avertissements.push(`Pas assez de créneaux\u00a0: jusqu’à ${parSession} chapitres par session.`);
  }

  // 3. La veille : révision générale sur tous les chapitres, même hors des jours préférés.
  const debutVeille = veille >= aujourdhui ? creneauDuJour(veille, reglages, occupes, apres) : null;
  if (debutVeille && Date.parse(debutVeille) + reglages.dureeMinutes * MINUTE <= examen) {
    sessions.push({
      debut: debutVeille,
      dureeMinutes: reglages.dureeMinutes,
      chapitres: [...p.chapitres].sort((a, b) => a.numero - b.numero).map((c) => c.id),
      titre: 'Révision générale',
      revisionGenerale: true,
    });
  } else {
    avertissements.push('Pas de créneau libre la veille de l’examen pour la révision générale.');
  }
  return { sessions, regroupe, avertissements };
}
