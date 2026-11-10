import { expect } from '@playwright/test';

const MAILPIT = 'http://127.0.0.1:54324';

/** Dernier e-mail reçu par `destinataire` dans Mailpit (local) : sujet et texte brut. Attend son arrivée. */
export async function dernierEmail(destinataire: string): Promise<{ sujet: string; texte: string }> {
  let id = '';
  await expect.poll(async () => {
    const r = await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:${destinataire}`)}`);
    const corps = (await r.json()) as { messages?: { ID: string }[] };
    id = corps.messages?.[0]?.ID ?? '';
    return id;
  }, { message: `aucun e-mail reçu pour ${destinataire}`, timeout: 20_000 }).not.toBe('');
  const m = await fetch(`${MAILPIT}/api/v1/message/${id}`);
  const message = (await m.json()) as { Subject: string; Text: string };
  return { sujet: message.Subject, texte: message.Text };
}

/** Premier lien du texte qui correspond au motif (ex. /accord-parental/). */
export function lienDansEmail(texte: string, motif: RegExp): string {
  const lien = texte.match(/https?:\/\/\S+/g)?.find((l) => motif.test(l));
  if (!lien) throw new Error('lien introuvable dans l’e-mail');
  return lien;
}
