import { describe, expect, it } from 'vitest';
import { verifierEnvironnement } from './env';

const smtp = { SMTP_HOTE: '127.0.0.1', SMTP_PORT: '54325', EMAIL_EXPEDITEUR: 'noreply@app-lycee.local' };
const base = { NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'cle-anon', CONSENTEMENT_SECRET: 'c'.repeat(43), ...smtp };
const notifications = {
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: 'BPub', VAPID_PRIVATE_KEY: 'priv', VAPID_SUJET: 'mailto:contact@example.com', ENVOI_SECRET: 's'.repeat(43),
};

describe('verifierEnvironnement', () => {
  it('accepte une configuration locale minimale, avec un avertissement pour les notifications absentes', () => {
    expect(verifierEnvironnement(base)).toEqual({
      erreurs: [], avertissements: ['Notifications désactivées\u00a0: NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUJET, ENVOI_SECRET absentes.'],
    });
  });
  it('signale un SMTP absent ou incomplet', () => {
    expect(verifierEnvironnement({ ...base, ...notifications, SMTP_HOTE: undefined }).avertissements)
      .toEqual(['E-mails désactivés\u00a0: SMTP_HOTE, SMTP_PORT et EMAIL_EXPEDITEUR sont nécessaires (consentement parental impossible).']);
  });
  it('accepte une configuration complète', () => {
    expect(verifierEnvironnement({ ...base, ...notifications })).toEqual({ erreurs: [], avertissements: [] });
  });
  it('refuse une URL Supabase absente ou invalide', () => {
    expect(verifierEnvironnement({ ...base, NEXT_PUBLIC_SUPABASE_URL: 'pas une url' }).erreurs)
      .toEqual(['NEXT_PUBLIC_SUPABASE_URL doit être une URL http(s).']);
    expect(verifierEnvironnement({ NEXT_PUBLIC_SUPABASE_ANON_KEY: 'x' }).erreurs)
      .toEqual(['NEXT_PUBLIC_SUPABASE_URL doit être une URL http(s).']);
  });
  it('refuse une clé anonyme absente', () => {
    expect(verifierEnvironnement({ NEXT_PUBLIC_SUPABASE_URL: base.NEXT_PUBLIC_SUPABASE_URL }).erreurs)
      .toEqual(['NEXT_PUBLIC_SUPABASE_ANON_KEY est absente.']);
  });
  it('exige une URL Supabase en https en production', () => {
    expect(verifierEnvironnement({ ...base, ...notifications, VERCEL_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://exemple.fr' }).erreurs)
      .toEqual(['NEXT_PUBLIC_SUPABASE_URL doit être une adresse https en production.']);
    expect(verifierEnvironnement({ ...base, ...notifications, VERCEL_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://exemple.fr', NEXT_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co' }).erreurs)
      .toEqual([]);
  });
  it('exige une adresse publique en https en production', () => {
    expect(verifierEnvironnement({ ...base, ...notifications, VERCEL_ENV: 'production', NEXT_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co' }).erreurs)
      .toEqual(['NEXT_PUBLIC_SITE_URL doit être une adresse https en production.']);
    expect(verifierEnvironnement({ ...base, ...notifications, VERCEL_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://app.example.fr', NEXT_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co' }).erreurs)
      .toEqual([]);
  });
  it('signale un groupe de notifications incomplet ou un secret trop court', () => {
    expect(verifierEnvironnement({ ...base, ...notifications, VAPID_PRIVATE_KEY: undefined }).avertissements)
      .toEqual(['Notifications désactivées\u00a0: VAPID_PRIVATE_KEY absente.']);
    expect(verifierEnvironnement({ ...base, ...notifications, ENVOI_SECRET: 'court' }).avertissements)
      .toEqual(['Notifications désactivées\u00a0: ENVOI_SECRET doit compter au moins 32 caractères.']);
    expect(verifierEnvironnement({ ...base, ...notifications, VAPID_SUJET: 'contact' }).avertissements)
      .toEqual(['Notifications désactivées\u00a0: VAPID_SUJET doit commencer par mailto: ou https:.']);
  });
  it('signale un secret de consentement absent ou trop court', () => {
    expect(verifierEnvironnement({ ...base, ...notifications, CONSENTEMENT_SECRET: undefined }).avertissements)
      .toEqual(['Consentement parental impossible\u00a0: CONSENTEMENT_SECRET absente.']);
    expect(verifierEnvironnement({ ...base, ...notifications, CONSENTEMENT_SECRET: 'court' }).avertissements)
      .toEqual(['Consentement parental impossible\u00a0: CONSENTEMENT_SECRET doit compter au moins 32 caractères.']);
  });
});
