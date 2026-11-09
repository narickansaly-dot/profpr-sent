import { describe, expect, it } from 'vitest';
import { lireConfigSmtp } from './config';

describe('lireConfigSmtp', () => {
  it('lit une configuration complète', () => {
    expect(lireConfigSmtp({ SMTP_HOTE: 'smtp.example.eu', SMTP_PORT: '587', SMTP_UTILISATEUR: 'u', SMTP_MOT_DE_PASSE: 'p', EMAIL_EXPEDITEUR: 'App lycée <noreply@example.fr>' }))
      .toEqual({ hote: 'smtp.example.eu', port: 587, utilisateur: 'u', motDePasse: 'p', expediteur: 'App lycée <noreply@example.fr>' });
  });
  it('accepte un serveur sans authentification (Mailpit en local)', () => {
    expect(lireConfigSmtp({ SMTP_HOTE: '127.0.0.1', SMTP_PORT: '54325', EMAIL_EXPEDITEUR: 'noreply@app-lycee.local' }))
      .toEqual({ hote: '127.0.0.1', port: 54325, utilisateur: undefined, motDePasse: undefined, expediteur: 'noreply@app-lycee.local' });
  });
  it('renvoie null si l’hôte, le port ou l’expéditeur manque ou si le port est invalide', () => {
    expect(lireConfigSmtp({})).toBeNull();
    expect(lireConfigSmtp({ SMTP_HOTE: 'h', SMTP_PORT: 'abc', EMAIL_EXPEDITEUR: 'e@x.fr' })).toBeNull();
    expect(lireConfigSmtp({ SMTP_HOTE: 'h', SMTP_PORT: '587' })).toBeNull();
  });
  it('renvoie null si l’identifiant ou le mot de passe est seul', () => {
    const b = { SMTP_HOTE: 'h', SMTP_PORT: '587', EMAIL_EXPEDITEUR: 'e@x.fr' };
    expect(lireConfigSmtp({ ...b, SMTP_UTILISATEUR: 'u' })).toBeNull();
    expect(lireConfigSmtp({ ...b, SMTP_MOT_DE_PASSE: 'p' })).toBeNull();
  });
});
