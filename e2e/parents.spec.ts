import { expect, test, type Browser, type TestInfo } from '@playwright/test';
import { creerCoursPublie, simulerAbonnement, vieillirInscription } from './aide-db';
import { dernierEmail, lienDansEmail } from './aide-mailpit';
import { emailDeTest, inscrireEleve, inscrireEleveMineur, inscrireParent } from './aide-parcours';

const contexte = (browser: Browser, testInfo: TestInfo) => browser.newContext({ ...testInfo.project.use, baseURL: 'http://localhost:3000' });
const joursPlusTard = (n: number) => new Date(Date.now() + n * 86_400_000);

test('accord, compte parent, suivi, retrait puis annulation du retrait', async ({ page, browser }, testInfo) => {
  test.setTimeout(180_000);
  const email = emailDeTest('parent-mineur');
  const emailParent = `parent-${email.split('@')[0]}@test.local`;
  await inscrireEleveMineur(page, email);
  await page.getByLabel('Adresse e-mail de ton parent').fill(emailParent);
  await page.getByRole('button', { name: 'Envoyer la demande' }).click();
  await expect(page.getByText(`E-mail envoyé à ${emailParent}.`)).toBeVisible();
  const lien = lienDansEmail((await dernierEmail(emailParent)).texte, /\/accord-parental\//);

  const ctx = await contexte(browser, testInfo);
  try {
    const parent = await ctx.newPage();
    await parent.goto(lien);
    await parent.getByLabel(/Je suis son parent ou son représentant légal/).check();
    await parent.getByRole('button', { name: 'Je donne mon accord' }).click();
    await expect(parent.getByText('Merci, votre accord est enregistré.')).toBeVisible();
    await parent.getByRole('link', { name: 'Créer mon compte parent' }).click();
    await inscrireParent(parent, emailParent);

    // La carte de l'enfant apparaît, reliée par l'adresse qui a reçu la demande.
    await expect(parent.getByText(/Accord donné le /)).toBeVisible();
    await parent.getByRole('link', { name: /Voir le détail/ }).click();
    await expect(parent.getByRole('table')).toBeVisible();
    await expect(parent.getByRole('columnheader', { name: 'Chapitres validés' })).toBeVisible();

    // Retrait : la case est obligatoire, puis le compte de l'enfant est bloqué.
    await parent.getByLabel('Je comprends que le compte sera bloqué puis supprimé.').check();
    await parent.getByRole('button', { name: 'Retirer mon accord' }).click();
    await expect(parent.getByText(/Accord retiré le /).first()).toBeVisible();

    await page.goto('/');
    await expect(page).toHaveURL(/\/consentement$/);
    await expect(page.getByRole('heading', { name: 'Ton parent a retiré son accord' })).toBeVisible();

    // Annulation : l'élève retrouve son tableau de bord.
    await parent.getByLabel('Je confirme vouloir rétablir mon accord.').check();
    await parent.getByRole('button', { name: 'Annuler le retrait' }).click();
    await expect(parent.getByText(/Accord donné le /).first()).toBeVisible();
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Mes cours' })).toBeVisible();
  } finally {
    await ctx.close();
  }
});

test('code parent, parent relié visible côté élève, puis déliaison', async ({ page, browser }, testInfo) => {
  test.setTimeout(180_000);
  const email = emailDeTest('parent-code');
  const emailParent = `parent-${email.split('@')[0]}@test.local`;
  await inscrireEleve(page, email);
  await page.goto('/mes-donnees');
  await page.getByRole('button', { name: 'Créer un code pour un parent' }).click();
  const code = (await page.locator('.code-parent').innerText()).trim();
  expect(code).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/);

  const ctx = await contexte(browser, testInfo);
  try {
    const parent = await ctx.newPage();
    await inscrireParent(parent, emailParent);
    await expect(parent.getByText('Aucun enfant n’est relié à votre compte pour l’instant.')).toBeVisible();

    // Code faux : message d'erreur, aucun enfant.
    await parent.getByLabel('Code de votre enfant').fill('ZZZZ-ZZZZ');
    await parent.getByRole('button', { name: 'Relier cet enfant' }).click();
    await expect(parent.getByRole('alert').filter({ hasText: 'Ce code n’est pas valable ou a expiré.' })).toBeVisible();
    await expect(parent.getByText('Aucun enfant n’est relié à votre compte pour l’instant.')).toBeVisible();

    // Bon code : l'enfant apparaît.
    await parent.getByLabel('Code de votre enfant').fill(code);
    await parent.getByRole('button', { name: 'Relier cet enfant' }).click();
    await expect(parent.getByRole('link', { name: /Voir le détail/ })).toBeVisible();

    // Côté élève, « Mes données » liste le parent.
    await page.goto('/mes-donnees');
    await expect(page.getByRole('heading', { name: 'Parents reliés' })).toBeVisible();
    await expect(page.locator('.liste-parents')).toContainText('Camille');

    // Déliaison par l'élève : le parent ne voit plus l'enfant.
    await page.getByLabel(/ne verra plus ma progression/).check();
    await page.getByRole('button', { name: /Ne plus partager avec ce parent/ }).click();
    await expect(page.getByText('Aucun parent n’est relié à ton compte.')).toBeVisible();
    await parent.goto('/parent');
    await expect(parent.getByText('Aucun enfant n’est relié à votre compte pour l’instant.')).toBeVisible();
    await expect(parent.getByRole('link', { name: /Voir le détail/ })).toHaveCount(0);
  } finally {
    await ctx.close();
  }
});

test('un abonné garde tous les cours après l’essai, puis le délai de grâce s’affiche', async ({ page }) => {
  test.setTimeout(120_000);
  const email = emailDeTest('parent-abonne');
  const cours = await creerCoursPublie(`e2e-abonne-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  await inscrireEleve(page, email);
  await vieillirInscription(email, 8);
  await page.goto('/');
  await expect(page.getByText('Ton essai est terminé.')).toBeVisible();

  await simulerAbonnement(email, 'actif', joursPlusTard(20));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Mes cours' })).toBeVisible();
  await expect(page.getByText('Ton essai est terminé.')).toHaveCount(0);
  await expect(page.getByText('Essai gratuit')).toHaveCount(0);
  await page.goto(`/cours/${cours.slug}`);
  await expect(page.getByRole('heading', { name: cours.titre })).toBeVisible();
  await page.goto('/cours/bph-1re-st2s');
  await expect(page.getByRole('heading', { name: 'Ce cours n’est pas ouvert pour toi' })).toHaveCount(0);

  await simulerAbonnement(email, 'impaye', joursPlusTard(-1), joursPlusTard(5));
  await page.goto('/');
  await expect(page.getByText('Le paiement de ton abonnement a échoué')).toBeVisible();
});
