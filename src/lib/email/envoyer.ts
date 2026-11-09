import 'server-only';
import nodemailer from 'nodemailer';
import { lireConfigSmtp } from './config';

export type Message = { a: string; sujet: string; texte: string; html: string };

/** Envoie un e-mail par SMTP. Les erreurs ne contiennent ni l'adresse ni le contenu. */
export async function envoyerEmail(m: Message): Promise<void> {
  const config = lireConfigSmtp(process.env);
  if (!config) throw new Error('email_non_configure');
  const avecAuth = Boolean(config.utilisateur);
  const transport = nodemailer.createTransport({
    host: config.hote, port: config.port, secure: config.port === 465,
    requireTLS: avecAuth,
    auth: avecAuth ? { user: config.utilisateur, pass: config.motDePasse } : undefined,
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
  });
  try {
    await transport.sendMail({ from: config.expediteur, to: m.a, subject: m.sujet, text: m.texte, html: m.html });
  } catch {
    throw new Error('email_echec');
  }
}
