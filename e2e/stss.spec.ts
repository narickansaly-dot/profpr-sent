import { expect, test } from '@playwright/test';
import { creerCoursPublie, rendreAdmin } from './aide-db';
import { emailDeTest, inscrireEleve } from './aide-parcours';

/**
 * Le cours de STSS réel n'est importé que hors du seed ; on vérifie ici la règle générale avec un cours de test
 * non publié de la même filière et du même niveau (slug « e2e-… », supprimé par le nettoyage global).
 */
async function coursNonPublie(projet: string) {
  return creerCoursPublie(`e2e-stss-${projet}-${Date.now()}`.toLowerCase(), { publie: false, titre: `STSS e2e non publié ${projet}` });
}

test('un élève de 1re ST2S ne voit pas un cours non publié', async ({ page }, testInfo) => {
  const cours = await coursNonPublie(testInfo.project.name);
  await inscrireEleve(page, emailDeTest('stss-eleve'));
  await expect(page.getByRole('link', { name: /Biologie et physiopathologie humaines/ }).first()).toBeVisible();
  await expect(page.getByText(cours.titre)).toHaveCount(0);
  await expect(page.getByText('STSS e2e non publié')).toHaveCount(0);
  // Ni par l'adresse directe (le cours n'existe pas pour lui : page 404), ni dans la page de choix des cours.
  const reponse = await page.goto(`/cours/${cours.slug}`);
  expect(reponse?.status()).toBe(404);
  await page.goto('/choisir-cours');
  await expect(page.getByText(cours.titre)).toHaveCount(0);
  await expect(page.getByText('STSS e2e non publié')).toHaveCount(0);
});

test('l’admin voit un cours non publié dans le suivi du contenu, marqué « Brouillon »', async ({ page }, testInfo) => {
  const cours = await coursNonPublie(testInfo.project.name);
  const email = emailDeTest('stss-admin');
  await inscrireEleve(page, email);
  await rendreAdmin(email);
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Suivi du contenu' })).toBeVisible();
  const bloc = page.locator('section.bloc-cours').filter({ has: page.getByRole('heading', { name: cours.titre }) });
  await expect(bloc.locator('.statut-brouillon').first()).toHaveText('Brouillon');
});
