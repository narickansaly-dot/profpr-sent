import { expect, test } from '@playwright/test';
import { creerCoursARelire, rendreAdmin, supprimerCoursDeTest, vieillirInscription } from './aide-db';
import { dernierEmail, lienDansEmail } from './aide-mailpit';
import { emailDeTest, inscrireEleve, inscrireEleveMineur, relierParentEtEnfant, suivreViolations } from './aide-parcours';

test('les pages portent une CSP avec nonce et les en-têtes de sécurité', async ({ request }) => {
  const r = await request.get('/connexion');
  const csp = r.headers()['content-security-policy'] ?? '';
  expect(csp).toMatch(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/);
  expect(csp).toContain("frame-ancestors 'none'");
  expect(r.headers()['x-content-type-options']).toBe('nosniff');
  expect(r.headers()['x-frame-options']).toBe('DENY');
  expect(r.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(r.headers()['cross-origin-opener-policy']).toBe('same-origin');
  expect(r.headers()['permissions-policy']).toContain('camera=()');
  // HSTS seulement sur https : jamais sur http://localhost (il se retiendrait pour tout le domaine).
  expect(r.headers()['strict-transport-security']).toBeUndefined();
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
  await page.waitForLoadState('networkidle');
  expect(violations).toEqual([]);
});

test('la page hors connexion ne déclenche aucune violation de CSP', async ({ page }) => {
  const violations = await suivreViolations(page);
  await page.goto('/hors-ligne');
  await expect(page.getByRole('heading', { name: 'Tu es hors connexion' })).toBeVisible();
  await page.waitForLoadState('networkidle');
  expect(violations).toEqual([]);
});

test('les pages introuvables répondent 404 sans violation de CSP', async ({ page }) => {
  const violations = await suivreViolations(page);
  await page.goto('/connexion');
  await inscrireEleve(page, emailDeTest('csp-404'));
  for (const chemin of ['/page-qui-n-existe-pas', '/cours/cours-inexistant']) {
    const reponse = await page.goto(chemin);
    expect(reponse?.status()).toBe(404);
    await expect(page).toHaveTitle(/Page introuvable/);
    await expect(page.getByRole('heading', { name: 'Page introuvable' })).toBeVisible();
  }
  await page.waitForLoadState('networkidle');
  expect(violations).toEqual([]);
});

test('aucune violation de CSP sur les pages de l’étape 5a', async ({ page, browser }, testInfo) => {
  test.setTimeout(120_000);
  const violations = await suivreViolations(page);
  const email = emailDeTest('csp-acces');
  await inscrireEleve(page, email);
  for (const chemin of ['/mes-donnees', '/mentions-legales', '/confidentialite', '/conditions-utilisation', '/conditions-vente']) {
    await page.goto(chemin);
    await expect(page.locator('main')).toBeVisible();
  }
  await vieillirInscription(email, 8);
  for (const chemin of ['/choisir-cours', '/cours/bph-1re-st2s']) {
    await page.goto(chemin);
    await expect(page.locator('main')).toBeVisible();
  }
  await page.waitForLoadState('networkidle');
  expect(violations).toEqual([]);

  // Élève de moins de 15 ans : page de demande, puis page d'accord du parent (autre contexte, sans session).
  const mineur = await browser.newContext({ ...testInfo.project.use, baseURL: 'http://localhost:3000' });
  try {
    const eleve = await mineur.newPage();
    const violationsMineur = await suivreViolations(eleve);
    const emailMineur = emailDeTest('csp-mineur');
    const emailParent = `parent-${emailMineur.split('@')[0]}@test.local`;
    await inscrireEleveMineur(eleve, emailMineur);
    await expect(eleve.locator('main')).toBeVisible();
    await eleve.getByLabel('Adresse e-mail de ton parent').fill(emailParent);
    await eleve.getByRole('button', { name: 'Envoyer la demande' }).click();
    await expect(eleve.getByText(`E-mail envoyé à ${emailParent}.`)).toBeVisible();
    const lien = lienDansEmail((await dernierEmail(emailParent)).texte, /\/accord-parental\//);
    const parentCtx = await browser.newContext({ ...testInfo.project.use, baseURL: 'http://localhost:3000' });
    try {
      const parent = await parentCtx.newPage();
      const violationsParent = await suivreViolations(parent);
      await parent.goto(lien);
      await expect(parent.getByRole('heading', { name: 'Autorisation parentale' })).toBeVisible();
      await parent.waitForLoadState('networkidle');
      expect(violationsParent).toEqual([]);
    } finally {
      await parentCtx.close();
    }
    await eleve.waitForLoadState('networkidle');
    expect(violationsMineur).toEqual([]);
  } finally {
    await mineur.close();
  }
});

test('aucune violation de CSP sur les pages parent', async ({ page, browser }, testInfo) => {
  test.setTimeout(120_000);
  await inscrireEleve(page, emailDeTest('csp-enfant'));
  const { parent, contexte, eleveId } = await relierParentEtEnfant(page, browser, testInfo, 'csp-parent');
  try {
    const violations = await suivreViolations(parent);
    for (const chemin of ['/parent', `/parent/enfant/${eleveId}`]) {
      await parent.goto(chemin);
      await expect(parent.locator('main, .page-parent').first()).toBeVisible();
      await parent.waitForLoadState('networkidle');
    }
    expect(violations).toEqual([]);
  } finally {
    await contexte.close();
  }
});

test('aucune violation de CSP sur la relecture en lot (admin)', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const slug = `e2e-csp-relecture-${testInfo.project.name}-${Date.now()}`.toLowerCase();
  try {
    const chapitreId = await creerCoursARelire(slug, 2);
    const violations = await suivreViolations(page);
    const email = emailDeTest('csp-admin');
    await inscrireEleve(page, email);
    await rendreAdmin(email);
    await page.goto(`/admin/chapitres/${chapitreId}/questions?relecture=1`);
    await expect(page.locator('article.carte-relecture')).toHaveCount(2);
    await page.waitForLoadState('networkidle');
    expect(violations).toEqual([]);
  } finally {
    await supprimerCoursDeTest(slug);
  }
});
