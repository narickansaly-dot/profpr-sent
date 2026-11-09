import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { emailDeTest, inscrireEleve } from './aide-parcours';

// Revue d'accessibilité automatique (WCAG 2.1 A et AA) à la largeur mobile, en clair puis en sombre.
// axe ne remplace pas une lecture manuelle (ordre du focus, annonces) : voir le bilan de l'étape 4c.
test.skip(({ isMobile }) => !isMobile, 'Parcours mesuré à la largeur mobile uniquement.');

const MODES = ['light', 'dark'] as const;

/** Violations graves ou critiques de la page affichée, sous forme lisible. */
async function violationsGraves(page: Page) {
  await page.waitForLoadState('networkidle');
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} (${v.impact}) : ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}\n${v.nodes[0]?.failureSummary ?? ''}`);
}

async function verifier(page: Page, nom: string) {
  for (const mode of MODES) {
    await page.emulateMedia({ colorScheme: mode });
    // Laisse finir les transitions de couleur (180 ms) : axe mesurerait sinon des teintes intermédiaires.
    await page.evaluate(() => Promise.race([Promise.all(document.getAnimations().map((a) => a.finished)), new Promise((r) => setTimeout(r, 1500))]));
    expect.soft(await violationsGraves(page), `${nom} (${mode})`).toEqual([]);
  }
}

test('pages publiques : connexion et inscription', async ({ page }) => {
  for (const chemin of ['/connexion', '/inscription']) {
    await page.goto(chemin);
    await expect(page.locator('main')).toBeVisible();
    await verifier(page, chemin);
  }
});

test('bienvenue (juste après l’inscription)', async ({ page }) => {
  await page.goto('/inscription');
  await page.getByLabel('Adresse e-mail').fill(emailDeTest('axe-bienvenue'));
  await page.getByLabel('Mot de passe').fill('motdepasse-test');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await expect(page).toHaveURL(/\/bienvenue$/);
  await verifier(page, '/bienvenue');
  // État d'erreur : envoi sans filière ni niveau, le prénom suffisant pour passer la validation du navigateur.
  await page.getByLabel('Ton prénom').fill('Léa');
  await page.getByLabel('Ta filière').selectOption({ index: 1 });
  await page.getByRole('button', { name: 'C’est parti !' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await verifier(page, '/bienvenue (erreur)');
});

test('pages d’un élève connecté', async ({ page }) => {
  test.setTimeout(180_000);
  await inscrireEleve(page, emailDeTest('axe'));

  await page.goto('/');
  await verifier(page, '/');

  await page.goto('/cours/bph-1re-st2s');
  await verifier(page, '/cours/bph-1re-st2s');

  await page.goto('/cours/bph-1re-st2s/ch1');
  await expect(page.locator('.contenu-chapitre svg').first()).toBeVisible();
  await verifier(page, 'chapitre');

  // Un événement, pour que le calendrier ne soit pas vide.
  await page.goto('/calendrier/nouveau');
  await verifier(page, '/calendrier/nouveau');
  await page.getByLabel('Titre').fill('Révision de BPH');
  await page.getByLabel('Heure', { exact: true }).fill('17:00');
  await page.getByRole('button', { name: 'Ajouter au calendrier' }).click();
  await expect(page).toHaveURL(/\/calendrier/);

  for (const vue of ['semaine', 'mois']) {
    await page.goto(`/calendrier?vue=${vue}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Mon calendrier' })).toBeVisible();
    await verifier(page, `/calendrier (${vue})`);
  }

  for (const chemin of ['/notifications', '/rappels', '/classes']) {
    await page.goto(chemin);
    await expect(page.locator('main')).toBeVisible();
    await verifier(page, chemin);
  }

  // Une question du quiz, puis une réponse cochée.
  await page.goto('/cours/bph-1re-st2s/ch1');
  await page.getByRole('button', { name: 'Lancer le quiz' }).click();
  await expect(page).toHaveURL(/\/tentative\//);
  await expect(page.locator('.lecteur-position')).toBeVisible();
  await verifier(page, 'quiz (question)');
  await page.locator('.choix .option').first().click();
  await expect(page.locator('.sauvegarde')).toHaveText('Réponses enregistrées');
  await verifier(page, 'quiz (réponse cochée)');
});
