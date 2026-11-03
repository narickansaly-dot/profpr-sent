import { expect, test } from '@playwright/test';
import { bonnesReponsesAffichees, validerTousLesChapitres } from './aide-db';
import { emailDeTest, inscrireEleve, repondreJusteQuestion } from './aide-parcours';

test('l’évaluation se débloque, se chronomètre et apparaît dans les notes d’examen', async ({ page }) => {
  test.setTimeout(240_000);
  const email = emailDeTest('eval');
  await inscrireEleve(page, email);

  await page.goto('/cours/bph-1re-st2s');
  await expect(page.getByText('Valide encore 7 chapitres')).toBeVisible();

  await validerTousLesChapitres(email, 'bph-1re-st2s');
  await page.goto('/cours/bph-1re-st2s/evaluation');
  await page.getByRole('button', { name: 'Commencer l’évaluation' }).click();

  await expect(page).toHaveURL(/\/tentative\/[0-9a-f-]{36}$/);
  const minutesRestantes = async () => {
    const libelle = await page.getByRole('timer').getAttribute('aria-label');
    return Number(/(\d+) minute/.exec(libelle ?? '')![1]);
  };
  await expect(page.getByRole('timer')).toBeVisible();
  const auDepart = await minutesRestantes();
  expect(auDepart).toBeLessThanOrEqual(60);
  const bonnes = await bonnesReponsesAffichees(page.url().split('/').pop()!);
  expect(bonnes).toHaveLength(40);

  // Trois réponses, puis rechargement : la reprise tombe sur la question 4 et le chrono ne remonte pas.
  for (let i = 0; i < 3; i++) await repondreJusteQuestion(page, i, bonnes.length, bonnes[i]);
  await page.reload();
  await expect(page.getByText('Question 4 / 40', { exact: true })).toBeVisible();
  for (let i = 1; i <= 3; i++) await expect(page.getByRole('button', { name: `Question ${i}, répondue` })).toBeVisible();
  await expect(page.getByRole('timer')).toBeVisible();
  expect(await minutesRestantes()).toBeLessThanOrEqual(auDepart);
  for (let i = 3; i < bonnes.length; i++) await repondreJusteQuestion(page, i, bonnes.length, bonnes[i]);

  await expect(page.getByRole('heading', { name: /Évaluation réussie/ })).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Mes notes d’examen' })).toBeVisible();
  await expect(page.getByText('Réussie · 1 essai')).toBeVisible();
  await expect(page.locator('[aria-labelledby="titre-examens"]').getByText('100 %', { exact: true })).toBeVisible();
});
