import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
const { sendMail, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn();
  return { sendMail, createTransport: vi.fn(() => ({ sendMail })) };
});
vi.mock('nodemailer', () => ({ default: { createTransport } }));

import { envoyerEmail } from './envoyer';

const msg = { a: 'parent@example.fr', sujet: 's', texte: 't', html: 'h' };
const local = { SMTP_HOTE: '127.0.0.1', SMTP_PORT: '54325', EMAIL_EXPEDITEUR: 'noreply@x.local' };

function config(env: Record<string, string>) {
  for (const k of ['SMTP_HOTE', 'SMTP_PORT', 'SMTP_UTILISATEUR', 'SMTP_MOT_DE_PASSE', 'EMAIL_EXPEDITEUR']) vi.stubEnv(k, '');
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
}
const options = () => (createTransport.mock.calls[0] as unknown as [Record<string, unknown>])[0];

describe('envoyerEmail', () => {
  beforeEach(() => { sendMail.mockReset(); createTransport.mockClear(); sendMail.mockResolvedValue({}); });
  afterEach(() => vi.unstubAllEnvs());

  it('lève email_non_configure sans configuration', async () => {
    config({});
    await expect(envoyerEmail(msg)).rejects.toThrow('email_non_configure');
  });
  it('refuse une adresse qui n’est pas unique', async () => {
    config(local);
    for (const a of ['a@x.fr,b@x.fr', 'a@x.fr;b@x.fr', 'A <a@x.fr>', 'a@x.fr\r\nBcc: b@x.fr', 'a @x.fr', '']) {
      await expect(envoyerEmail({ ...msg, a })).rejects.toThrow('email_non_valide');
    }
    expect(sendMail).not.toHaveBeenCalled();
  });
  it('local sans authentification : ni TLS imposé ni secure', async () => {
    config(local);
    await envoyerEmail(msg);
    expect(options()).toMatchObject({ secure: false, requireTLS: false, auth: undefined });
  });
  it('port 465 : secure', async () => {
    config({ ...local, SMTP_HOTE: 'smtp.example.eu', SMTP_PORT: '465' });
    await envoyerEmail(msg);
    expect(options()).toMatchObject({ secure: true, requireTLS: false });
  });
  it('requireTLS avec authentification', async () => {
    config({ ...local, SMTP_UTILISATEUR: 'u', SMTP_MOT_DE_PASSE: 'p' });
    await envoyerEmail(msg);
    expect(options()).toMatchObject({ requireTLS: true, auth: { user: 'u', pass: 'p' } });
  });
  it('requireTLS hors hôte local, même sans authentification', async () => {
    config({ ...local, SMTP_HOTE: 'smtp.example.eu', SMTP_PORT: '587' });
    await envoyerEmail(msg);
    expect(options()).toMatchObject({ secure: false, requireTLS: true });
  });
  it('lève email_echec et ne journalise que le code', async () => {
    config(local);
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    sendMail.mockRejectedValue(Object.assign(new Error('refus pour parent@example.fr'), { code: 'ECONNREFUSED' }));
    await expect(envoyerEmail(msg)).rejects.toThrow('email_echec');
    expect(log).toHaveBeenCalledWith('email_echec', 'ECONNREFUSED');
    log.mockRestore();
  });
});
