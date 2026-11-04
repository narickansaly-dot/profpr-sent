import { expect, test } from '@playwright/test';
import { bonnesReponsesAffichees } from './aide-db';
import { cocherEtAttendreSauvegarde, emailDeTest, inscrireEleve, repondreJuste } from './aide-parcours';

test('un élève réussit le quiz d’un chapitre et le voit sur son tableau de bord', async ({ page }) => {
  test.setTimeout(120_000);
  await inscrireEleve(page, emailDeTest('quiz'));
  await page.goto('/cours/bph-1re-st2s/ch1');
  await page.getByRole('button', { name: 'Lancer le quiz' }).click();

  await expect(page).toHaveURL(/\/tentative\/[0-9a-f-]{36}$/);
  const tentativeId = page.url().split('/').pop()!;
  const bonnes = await bonnesReponsesAffichees(tentativeId);
  expect(bonnes).toHaveLength(15);
  await repondreJuste(page, bonnes);

  await expect(page).toHaveURL(new RegExp(`/tentative/${tentativeId}/resultat$`));
  await expect(page.getByRole('heading', { name: /Quiz réussi/ })).toBeVisible();
  await expect(page.locator('.resultat-note')).toHaveText('100 %');

  await page.goto('/');
  await expect(page.getByText(/1 \/ 7 chapitres? validés?/)).toBeVisible();
  await expect(page.getByRole('link', { name: "Organisation générale de l'organisme humain" })).toBeVisible();
});

test('les réponses sont conservées après un rechargement', async ({ page }) => {
  await inscrireEleve(page, emailDeTest('reprise'));
  await page.goto('/cours/bph-1re-st2s/ch2');
  await page.getByRole('button', { name: 'Lancer le quiz' }).click();
  await expect(page).toHaveURL(/\/tentative\//);
  await cocherEtAttendreSauvegarde(page, 0);
  await page.reload();
  await expect(page.getByText('Question 2 / 15', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Question 1, répondue' })).toBeVisible();
});
