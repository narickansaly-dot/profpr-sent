import { expect, test } from '@playwright/test';
import { dernierEmail, lienDansEmail } from './aide-mailpit';
import { emailDeTest, inscrireEleveMineur } from './aide-parcours';

test('un élève de moins de 15 ans attend l’accord d’un parent, donné depuis le lien de l’e-mail', async ({ page, browser }, testInfo) => {
  test.setTimeout(120_000);
  const email = emailDeTest('mineur');
  const emailParent = `parent-${email.split('@')[0]}@test.local`;
  await inscrireEleveMineur(page, email);

  // Tant que l'accord manque, l'accueil renvoie vers la demande.
  await page.goto('/');
  await expect(page).toHaveURL(/\/consentement$/);
  await expect(page.getByRole('heading', { name: 'Il nous faut l’accord d’un parent' })).toBeVisible();

  await page.getByLabel('Adresse e-mail de ton parent').fill(emailParent);
  await page.getByRole('button', { name: 'Envoyer la demande' }).click();
  await expect(page.getByText(`E-mail envoyé à ${emailParent}.`)).toBeVisible();

  const message = await dernierEmail(emailParent);
  expect(message.sujet).toContain('a besoin de votre accord');
  const lien = lienDansEmail(message.texte, /\/accord-parental\//);

  // Le parent n'a aucune session : nouveau contexte de navigation.
  const contexteParent = await browser.newContext({ ...testInfo.project.use, baseURL: 'http://localhost:3000' });
  try {
    const parent = await contexteParent.newPage();
    await parent.goto(lien);
    await expect(parent.getByRole('heading', { name: 'Autorisation parentale' })).toBeVisible();
    // Sans la case cochée (la contrainte du navigateur est levée pour atteindre le contrôle du serveur), l'accord est refusé.
    await parent.locator('input[name="confirme"]').evaluate((el: HTMLInputElement) => { el.required = false; });
    await parent.getByRole('button', { name: 'Je donne mon accord' }).click();
    await expect(parent.locator('.message-erreur')).toContainText('Cochez la case');
    await parent.getByLabel(/Je suis son parent ou son représentant légal/).check();
    await parent.getByRole('button', { name: 'Je donne mon accord' }).click();
    await expect(parent.getByText('Merci, votre accord est enregistré.')).toBeVisible();
    // Le lien reste lisible mais indique que l'accord est déjà donné.
    await parent.goto(lien);
    await expect(parent.getByRole('heading', { name: 'Accord déjà enregistré' })).toBeVisible();
  } finally {
    await contexteParent.close();
  }

  // L'élève accède maintenant à l'accueil.
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Mes cours' })).toBeVisible();
  await expect(page).not.toHaveURL(/consentement/);
});

test('un lien d’accord inventé affiche « Lien expiré ou invalide »', async ({ page }) => {
  await page.goto(`/accord-parental/${'a'.repeat(43)}`);
  await expect(page.getByRole('heading', { name: 'Lien expiré ou invalide' })).toBeVisible();
});
