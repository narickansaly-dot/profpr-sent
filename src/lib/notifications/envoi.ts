import { decalerSilence } from './silence';

export type Abonnement = { endpoint: string; p256dh: string; auth: string };
/** Une ligne renvoyée par la RPC `envoi_reserver`. */
export type LigneEnvoi = {
  id: string; eleve_id: string; titre: string; corps: string; url: string; envoi_prevu: string; essais: number;
  silence_debut: string; silence_fin: string; abonnements: Abonnement[];
};
export type IssueEnvoi = { ok: true } | { ok: false; expire: boolean; temporaire: boolean };
export type Envoyer = (abonnement: Abonnement, charge: string) => Promise<IssueEnvoi>;
export type Resultat = { id: string; issue: 'envoyee' | 'decaler' | 'reessayer' | 'echec'; a?: string };

export const MAX_ESSAIS = 5;
const TAILLE_LOT = 10;

/** Attente avant un nouvel essai, en minutes : 1, 2, 4, 8. */
export function delaiRelance(essais: number): number {
  return 2 ** essais;
}

async function envoyerSansException(envoyer: Envoyer, a: Abonnement, charge: string): Promise<IssueEnvoi> {
  try {
    return await envoyer(a, charge);
  } catch {
    return { ok: false, expire: false, temporaire: true };
  }
}

/** Décide du sort d'une notification réservée : décaler, envoyer, réessayer ou abandonner. */
async function traiterLigne(
  l: LigneEnvoi, envoyer: Envoyer, maintenant: Date,
): Promise<{ resultat: Resultat; expires: string[] }> {
  const apresSilence = decalerSilence(maintenant, { debut: l.silence_debut, fin: l.silence_fin });
  if (apresSilence.getTime() > maintenant.getTime()) {
    return { resultat: { id: l.id, issue: 'decaler', a: apresSilence.toISOString() }, expires: [] };
  }
  if (l.abonnements.length === 0) {
    return { resultat: { id: l.id, issue: 'envoyee' }, expires: [] };
  }
  const charge = JSON.stringify({ id: l.id, titre: l.titre, corps: l.corps, url: l.url });
  const issues = await Promise.all(l.abonnements.map((a) => envoyerSansException(envoyer, a, charge)));
  const expires: string[] = [];
  issues.forEach((issue, i) => { if (!issue.ok && issue.expire) expires.push(l.abonnements[i].endpoint); });
  const echecs = issues.filter((i): i is Extract<IssueEnvoi, { ok: false }> => !i.ok);
  if (echecs.length < issues.length || echecs.every((e) => e.expire)) {
    return { resultat: { id: l.id, issue: 'envoyee' }, expires };
  }
  if (echecs.some((e) => e.temporaire) && l.essais + 1 < MAX_ESSAIS) {
    const a = new Date(maintenant.getTime() + delaiRelance(l.essais) * 60_000).toISOString();
    return { resultat: { id: l.id, issue: 'reessayer', a }, expires };
  }
  return { resultat: { id: l.id, issue: 'echec' }, expires };
}

/**
 * Traite un lot de notifications réservées, par paquets de 10 en parallèle, dans l'ordre des lignes.
 * Avec `limite`, aucun nouveau paquet ne démarre une fois l'échéance atteinte : les lignes non traitées
 * n'ont pas de résultat et leur réservation expire d'elle-même (elles reviennent plus tard).
 */
export async function traiterLot(
  lignes: LigneEnvoi[], envoyer: Envoyer, maintenant: Date, limite?: Date, horloge: () => number = Date.now,
): Promise<{ resultats: Resultat[]; expires: string[] }> {
  const resultats: Resultat[] = [];
  const expires: string[] = [];
  for (let i = 0; i < lignes.length; i += TAILLE_LOT) {
    if (limite && horloge() >= limite.getTime()) break;
    const traitees = await Promise.all(lignes.slice(i, i + TAILLE_LOT).map((l) => traiterLigne(l, envoyer, maintenant)));
    for (const t of traitees) { resultats.push(t.resultat); expires.push(...t.expires); }
  }
  return { resultats, expires };
}
