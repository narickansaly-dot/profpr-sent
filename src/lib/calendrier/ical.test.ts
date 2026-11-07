import { describe, expect, it } from 'vitest';
import { genererIcal } from './ical';

const maintenant = new Date('2026-12-01T08:00:00Z');

describe('genererIcal', () => {
  it('produit un calendrier valide, en CRLF', () => {
    const ics = genererIcal([{ uid: 'abc-20261207T160000Z', titre: 'Devoir', debut: '2026-12-07T16:00:00Z', fin: '2026-12-07T17:00:00Z' }], maintenant);
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('\r\nBEGIN:VEVENT\r\nUID:abc-20261207T160000Z@app-lycee\r\nDTSTAMP:20261201T080000Z\r\n'
      + 'DTSTART:20261207T160000Z\r\nDTEND:20261207T170000Z\r\nSUMMARY:Devoir\r\nEND:VEVENT\r\n');
    expect(ics.split('\r\n').every((l) => !l.includes('\n'))).toBe(true);
  });

  it('omet DTEND pour un repère sans durée', () => {
    const ics = genererIcal([{ uid: 'e', titre: 'Date limite', debut: '2026-12-07T16:00:00Z', fin: '2026-12-07T16:00:00Z' }], maintenant);
    expect(ics).toContain('DTSTART:20261207T160000Z\r\nSUMMARY:Date limite\r\n');
    expect(ics).not.toContain('DTEND');
  });

  it('échappe les caractères spéciaux du texte', () => {
    const ics = genererIcal([{ uid: 'e', titre: 'Maths; ch. 1, 2\\3\nfin', debut: '2026-12-07T16:00:00Z', fin: '2026-12-07T17:00:00Z' }], maintenant);
    expect(ics).toContain('SUMMARY:Maths\; ch. 1\\, 2\\\\3\\nfin\r\n');
  });

  it('plie les lignes de plus de 75 octets sans couper un caractère', () => {
    const titre = 'é'.repeat(60);
    const ics = genererIcal([{ uid: 'e', titre, debut: '2026-12-07T16:00:00Z', fin: '2026-12-07T17:00:00Z' }], maintenant);
    const lignes = ics.split('\r\n');
    for (const l of lignes) expect(Buffer.byteLength(l, 'utf8')).toBeLessThanOrEqual(75);
    const depliees = ics.replace(/\r\n /g, '');
    expect(depliees).toContain(`SUMMARY:${titre}\r\n`);
  });
});
