export type EvenementIcal = { uid: string; titre: string; debut: string; fin: string };

const enUtc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function echapper(texte: string) {
  return texte.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r\n|\r|\n/g, '\\n');
}

/** Plie une ligne à 75 octets (RFC 5545, 3.1), sans couper un caractère UTF-8. */
function plier(ligne: string): string {
  const morceaux: string[] = [];
  let courant = '';
  let octets = 0;
  for (const car of ligne) {
    const taille = Buffer.byteLength(car, 'utf8');
    // La première ligne a 75 octets ; les suivantes commencent par une espace, donc 74 de contenu.
    const max = morceaux.length === 0 ? 75 : 74;
    if (octets + taille > max) {
      morceaux.push(courant);
      courant = '';
      octets = 0;
    }
    courant += car;
    octets += taille;
  }
  morceaux.push(courant);
  return morceaux.join('\r\n ');
}

export function genererIcal(evenements: EvenementIcal[], maintenant: Date): string {
  const lignes = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//App lycée//Calendrier//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:App lycée',
  ];
  const stamp = enUtc(maintenant.toISOString());
  for (const e of evenements) {
    lignes.push('BEGIN:VEVENT', `UID:${e.uid}@app-lycee`, `DTSTAMP:${stamp}`, `DTSTART:${enUtc(e.debut)}`);
    if (e.fin !== e.debut && new Date(e.fin).getTime() > new Date(e.debut).getTime()) lignes.push(`DTEND:${enUtc(e.fin)}`);
    lignes.push(`SUMMARY:${echapper(e.titre)}`, 'END:VEVENT');
  }
  lignes.push('END:VCALENDAR');
  return lignes.map(plier).join('\r\n') + '\r\n';
}
