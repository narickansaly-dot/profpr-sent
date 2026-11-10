import { expect, test } from '@playwright/test';
import { creerCoursPublie, vieillirInscription } from './aide-db';
import { emailDeTest, inscrireEleve } from './aide-parcours';

test('après l’essai, l’élève choisit son cours gratuit, puis le changement est limité à une fois', async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const email = emailDeTest('acces');
  await inscrireEleve(page, email);
  // Un second cours publié (même filière et même niveau) : celui qui ne sera pas choisi doit rester fermé.
  const second = await creerCoursPublie(`e2e-acces-${testInfo.project.name}-${Date.now()}`.toLowerCase());

  // Pendant l'essai, tout est ouvert.
  await expect(page.getByText('Essai gratuit')).toBeVisible();

  // Fin de l'essai : invitation à choisir, cartes verrouillées.
  await vieillirInscription(email, 8);
  await page.goto('/');
  await expect(page.getByText('Ton essai est terminé.')).toBeVisible();
  await expect(page.getByText('Verrouillé').first()).toBeVisible();

  // Choix de BPH, puis un chapitre s'ouvre.
  await page.getByRole('link', { name: 'Choisis ton cours gratuit' }).click();
  await expect(page).toHaveURL(/\/choisir-cours$/);
  await page.getByLabel(/Biologie et physiopathologie humaines/).check();
  await page.getByRole('button', { name: 'Choisir ce cours' }).click();
  await expect(page.getByRole('heading', { name: 'Mes cours' })).toBeVisible();
  await expect(page.getByText(/Tu peux encore en changer jusqu’au/)).toBeVisible();
  await page.goto('/cours/bph-1re-st2s/ch1');
  await expect(page.getByRole('heading', { level: 1, name: "Organisation générale de l'organisme humain" })).toBeVisible();

  // Le cours non choisi reste fermé.
  await page.goto(`/cours/${second.slug}`);
  await expect(page.getByRole('heading', { name: 'Ce cours n’est pas ouvert pour toi' })).toBeVisible();
  await page.goto(`/cours/${second.slug}/ch1`);
  await expect(page.getByRole('heading', { name: 'Ce cours n’est pas ouvert pour toi' })).toBeVisible();

  // Un seul changement : accepté une fois, refusé ensuite.
  await page.goto('/choisir-cours');
  await page.getByLabel(new RegExp(second.titre)).check();
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Choisir ce cours' }).click();
  await expect(page.getByRole('heading', { name: 'Mes cours' })).toBeVisible();
  await page.goto(`/cours/${second.slug}/ch1`);
  await expect(page.getByRole('heading', { level: 1, name: 'Chapitre de test' })).toBeVisible();
  await page.goto('/cours/bph-1re-st2s');
  await expect(page.getByRole('heading', { name: 'Ce cours n’est pas ouvert pour toi' })).toBeVisible();
  await page.goto('/choisir-cours');
  await expect(page.getByText(/Ce choix est définitif/)).toBeVisible();
});
