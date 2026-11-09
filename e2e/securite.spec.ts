import { expect, test, type Page } from '@playwright/test';
import { emailDeTest, inscrireEleve } from './aide-parcours';

/** Relève les violations de CSP signalées par le navigateur pendant la visite. */
async function suivreViolations(page: Page) {
  const violations: string[] = [];
  page.on('console', (m) => { if (/Content Security Policy|Content-Security-Policy/i.test(m.text())) violations.push(m.text()); });
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => console.error(`Content Security Policy : ${e.violatedDirective} ${e.blockedURI}`));
  });
  return violations;
}

test('les pages portent une CSP avec nonce et les en-têtes de sécurité', async ({ request }) => {
  const r = await request.get('/connexion');
  const csp = r.headers()['content-security-policy'] ?? '';
  expect(csp).toMatch(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/);
  expect(csp).toContain("frame-ancestors 'none'");
  expect(r.headers()['x-content-type-options']).toBe('nosniff');
  expect(r.headers()['x-frame-options']).toBe('DENY');
  expect(r.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
  const autre = await request.get('/connexion');
  expect(autre.headers()['content-security-policy']).not.toBe(csp);
});

test('aucune violation de CSP sur les pages principales', async ({ page }) => {
  const violations = await suivreViolations(page);
  await page.goto('/connexion');
  await inscrireEleve(page, emailDeTest('csp'));
  for (const chemin of ['/', '/calendrier', '/calendrier/nouveau', '/notifications', '/rappels', '/classes']) {
    await page.goto(chemin);
    await expect(page.locator('main')).toBeVisible();
  }
  // Une page de chapitre (avec ses schémas) : le premier cours et son premier chapitre depuis l'accueil.
  await page.goto('/');
  await page.getByRole('link', { name: /Biologie et physiopathologie humaines/ }).first().click();
  await page.getByRole('link', { name: /Organisation générale de l'organisme humain/ }).click();
  await expect(page.locator('.contenu-chapitre svg').first()).toBeVisible();
  expect(violations).toEqual([]);
});

test('la page hors connexion ne déclenche aucune violation de CSP', async ({ page }) => {
  const violations = await suivreViolations(page);
  await page.goto('/hors-ligne');
  await expect(page.getByRole('heading', { name: 'Tu es hors connexion' })).toBeVisible();
  await page.waitForLoadState('networkidle');
  expect(violations).toEqual([]);
});
