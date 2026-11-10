import 'server-only';
import nodemailer from 'nodemailer';
import { lireConfigSmtp } from './config';

export type Message = { a: string; sujet: string; texte: string; html: string };

const estLocal = (h: string) => h === 'localhost' || h === '127.0.0.1';

/** Envoie un e-mail par SMTP. Les erreurs ne contiennent ni l'adresse ni le contenu. */
export async function envoyerEmail(m: Message): Promise<void> {
  const config = lireConfigSmtp(process.env);
  if (!config) throw new Error('email_non_configure');
  if (!m.a || /[,;<>\s]/.test(m.a)) throw new Error('email_non_valide');
  const secure = config.port === 465;
  const avecAuth = Boolean(config.utilisateur);
  const transport = nodemailer.createTransport({
    host: config.hote, port: config.port, secure,
    requireTLS: !secure && (avecAuth || !estLocal(config.hote)),
    auth: avecAuth ? { user: config.utilisateur, pass: config.motDePasse } : undefined,
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
  });
  try {
    await transport.sendMail({ from: config.expediteur, to: m.a, subject: m.sujet, text: m.texte, html: m.html });
  } catch (err) {
    const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: unknown }).code) : 'inconnu';
    console.error('email_echec', code);
    throw new Error('email_echec');
  }
}
