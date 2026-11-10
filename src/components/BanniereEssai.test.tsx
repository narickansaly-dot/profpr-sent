import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BanniereEssai } from './BanniereEssai';
import type { MonAcces } from '@/lib/acces/etat';

const base: MonAcces = {
  role: 'eleve', enEssai: true, finEssai: '2026-12-01T10:00:00Z', coursGratuitId: null,
  changementPossibleJusquAu: null, consentementRequis: false, emailParent: null, consentementEnvoyeLe: null,
  abonnement: null, consentementRetireLe: null, suppressionPrevueLe: null,
};
const maintenant = new Date('2026-11-28T10:00:00Z');

describe('BanniereEssai', () => {
  it('n’affiche rien pour un abonné actif, même pendant l’essai', () => {
    const acces = { ...base, abonnement: { formule: 'mensuelle' as const, statut: 'actif', finPeriode: '2027-01-01T00:00:00Z', finGrace: null, actif: true } };
    expect(renderToStaticMarkup(<BanniereEssai acces={acces} maintenant={maintenant} />)).toBe('');
  });
  it('prévient d’un paiement échoué pendant la période de grâce', () => {
    const acces = { ...base, enEssai: false, abonnement: { formule: 'mensuelle' as const, statut: 'impaye', finPeriode: '2026-12-31T00:00:00Z', finGrace: '2027-01-07T12:00:00Z', actif: true } };
    const html = renderToStaticMarkup(<BanniereEssai acces={acces} maintenant={maintenant} />);
    expect(html).toContain('Le paiement de ton abonnement a échoué. Tu gardes l’accès à tous les cours jusqu’au 7 janvier.');
  });
  it('affiche toujours l’essai sans abonnement', () => {
    expect(renderToStaticMarkup(<BanniereEssai acces={base} maintenant={maintenant} />)).toContain('Essai gratuit');
  });
});
