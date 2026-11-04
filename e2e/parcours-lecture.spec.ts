import { expect, test } from '@playwright/test';
import { emailDeTest, terminerBienvenue } from './aide-parcours';

test('un élève s’inscrit, choisit sa filière et lit un chapitre', async ({ page }) => {
  const email = emailDeTest('eleve');

  await page.goto('/');
  await expect(page).toHaveURL(/\/connexion$/);

  await page.getByRole('link', { name: 'Créer un compte' }).click();
  await expect(page).toHaveURL(/\/inscription$/);
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByLabel('Mot de passe').fill('motdepasse-test');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();

  await terminerBienvenue(page);

  await expect(page.getByText(/Essai gratuit : encore 7 jours/)).toBeVisible();
  await page.getByRole('link', { name: /Biologie et physiopathologie humaines/ }).click();

  await page.getByRole('link', { name: /Organisation générale de l'organisme humain/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: "Organisation générale de l'organisme humain" })).toBeVisible();
  await expect(page.locator('.contenu-chapitre svg').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Je retiens' })).toBeVisible();
});

test('un visiteur non connecté ne peut pas lire un chapitre', async ({ page }) => {
  await page.goto('/cours/bph-1re-st2s/ch1');
  await expect(page).toHaveURL(/\/connexion\?suite=%2Fcours%2Fbph-1re-st2s%2Fch1$/);
});
