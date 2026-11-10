import { describe, expect, it } from 'vitest';
import { ENTETES_SECURITE, politiqueContenu } from './csp';

const directives = (csp: string) => Object.fromEntries(csp.split('; ').map((d) => { const [nom, ...v] = d.split(' '); return [nom, v]; }));

describe('politiqueContenu', () => {
  const prod = directives(politiqueContenu({ nonce: 'abc', supabaseUrl: 'https://xyz.supabase.co', developpement: false, https: true }));
  it('limite les scripts au nonce', () => {
    expect(prod['script-src']).toEqual(["'self'", "'nonce-abc'", "'strict-dynamic'"]);
  });
  it('autorise Supabase pour les images, les connexions et les formulaires', () => {
    expect(prod['img-src']).toEqual(["'self'", 'data:', 'blob:', 'https://xyz.supabase.co']);
    expect(prod['connect-src']).toEqual(["'self'", 'https://xyz.supabase.co']);
    expect(prod['form-action']).toEqual(["'self'", 'https://xyz.supabase.co', 'https://accounts.google.com']);
  });
  it('interdit l’intégration dans un cadre et les objets', () => {
    expect(prod['frame-ancestors']).toEqual(["'none'"]);
    expect(prod['frame-src']).toEqual(["'none'"]);
    expect(prod['object-src']).toEqual(["'none'"]);
    expect(prod['base-uri']).toEqual(["'self'"]);
  });
  it('force https en production seulement', () => {
    expect(prod['upgrade-insecure-requests']).toEqual([]);
    const local = directives(politiqueContenu({ nonce: 'abc', supabaseUrl: 'http://127.0.0.1:54321', developpement: false, https: false }));
    expect(local['upgrade-insecure-requests']).toBeUndefined();
    expect(local['connect-src']).toEqual(["'self'", 'http://127.0.0.1:54321']);
  });
  it('ajoute unsafe-eval et le websocket en développement', () => {
    const dev = directives(politiqueContenu({ nonce: 'abc', supabaseUrl: 'http://127.0.0.1:54321', developpement: true, https: false }));
    expect(dev['script-src']).toContain("'unsafe-eval'");
    expect(dev['connect-src']).toContain('ws:');
  });
  it('n’accepte qu’une origine pour Supabase (pas de chemin ni de chaîne de requête)', () => {
    const p = directives(politiqueContenu({ nonce: 'n', supabaseUrl: 'https://xyz.supabase.co/rest/v1?x=1', developpement: false, https: true }));
    expect(p['img-src']).toContain('https://xyz.supabase.co');
  });
});

describe('ENTETES_SECURITE', () => {
  it('contient les en-têtes attendus', () => {
    expect(Object.fromEntries(ENTETES_SECURITE.map((e) => [e.key, e.value]))).toEqual({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    });
  });
});
