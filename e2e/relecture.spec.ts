import { expect, test } from '@playwright/test';
import { creerCoursARelire, rendreAdmin, supprimerCoursDeTest } from './aide-db';
import { emailDeTest, inscrireEleve } from './aide-parcours';

test('relecture en lot : cocher deux questions à relire et les valider', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const slug = `e2e-relecture-${testInfo.project.name}-${Date.now()}`.toLowerCase();
  try {
    const chapitreId = await creerCoursARelire(slug, 3);

    const email = emailDeTest(`relecture-${testInfo.project.name}`);
    await inscrireEleve(page, email);
    await rendreAdmin(email);
    await page.goto(`/admin/chapitres/${chapitreId}/questions?relecture=1`);
    const cartes = page.locator('article.carte-relecture');
    await expect(cartes).toHaveCount(3);
    await expect(cartes.first().getByText('Bonne réponse', { exact: true })).toBeVisible();

    await page.getByLabel('Sélectionner la question 1').check();
    await page.getByLabel('Sélectionner la question 3').check();
    await page.getByRole('button', { name: 'Valider la sélection' }).click();

    await expect(page.getByRole('status').filter({ hasText: '2 questions validées.' })).toBeVisible();
    await expect(cartes).toHaveCount(1);
    await page.getByRole('link', { name: 'Retour à la liste' }).click();
    await expect(page.getByRole('list', { name: 'Nombre de questions par statut' }).getByRole('listitem').filter({ hasText: 'Validée' })).toContainText('2');
  } finally {
    await supprimerCoursDeTest(slug);
  }
});
