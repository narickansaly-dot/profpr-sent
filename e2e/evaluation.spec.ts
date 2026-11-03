import { expect, test } from '@playwright/test';
import { bonnesReponsesAffichees, validerTousLesChapitres } from './aide-db';
import { emailDeTest, inscrireEleve, repondreJuste } from './aide-parcours';

test('l’évaluation se débloque, se chronomètre et apparaît dans les notes d’examen', async ({ page }) => {
  test.setTimeout(240_000);
  const email = emailDeTest('eval');
  await inscrireEleve(page, email);

  await page.goto('/cours/bph-1re-st2s');
  await expect(page.getByText(/Valide encore 7 chapitres/)).toBeVisible();

  await validerTousLesChapitres(email, 'bph-1re-st2s');
  await page.goto('/cours/bph-1re-st2s/evaluation');
  await page.getByRole('button', { name: 'Commencer l’évaluation' }).click();

  await expect(page).toHaveURL(/\/tentative\/[0-9a-f-]{36}$/);
  await expect(page.getByRole('timer')).toBeVisible();
  const bonnes = await bonnesReponsesAffichees(page.url().split('/').pop()!);
  expect(bonnes).toHaveLength(40);
  await repondreJuste(page, bonnes);

  await expect(page.getByRole('heading', { name: /Évaluation réussie/ })).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Mes notes d’examen' })).toBeVisible();
  await expect(page.getByText('Réussie · 1 essai')).toBeVisible();
});
