import { describe, expect, it } from 'vitest';
import { verifierEnvironnement } from './env';

const base = { NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'cle-anon' };
const notifications = {
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: 'BPub', VAPID_PRIVATE_KEY: 'priv', VAPID_SUJET: 'mailto:contact@example.com', ENVOI_SECRET: 's'.repeat(43),
};

describe('verifierEnvironnement', () => {
  it('accepte une configuration locale minimale, avec un avertissement pour les notifications absentes', () => {
    expect(verifierEnvironnement(base)).toEqual({
      erreurs: [], avertissements: ['Notifications désactivées : NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUJET, ENVOI_SECRET absentes.'],
    });
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
  it('exige une adresse publique en https en production', () => {
    expect(verifierEnvironnement({ ...base, ...notifications, VERCEL_ENV: 'production' }).erreurs)
      .toEqual(['NEXT_PUBLIC_SITE_URL doit être une adresse https en production.']);
    expect(verifierEnvironnement({ ...base, ...notifications, VERCEL_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://app.example.fr' }).erreurs)
      .toEqual([]);
  });
  it('signale un groupe de notifications incomplet ou un secret trop court', () => {
    expect(verifierEnvironnement({ ...base, ...notifications, VAPID_PRIVATE_KEY: undefined }).avertissements)
      .toEqual(['Notifications désactivées : VAPID_PRIVATE_KEY absente.']);
    expect(verifierEnvironnement({ ...base, ...notifications, ENVOI_SECRET: 'court' }).avertissements)
      .toEqual(['Notifications désactivées : ENVOI_SECRET doit compter au moins 32 caractères.']);
    expect(verifierEnvironnement({ ...base, ...notifications, VAPID_SUJET: 'contact' }).avertissements)
      .toEqual(['Notifications désactivées : VAPID_SUJET doit commencer par mailto: ou https:.']);
  });
});
