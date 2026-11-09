import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { creerCoursARelire, rendreAdmin, supprimerCoursDeTest, vieillirInscription } from './aide-db';
import { dernierEmail, lienDansEmail } from './aide-mailpit';
import { emailDeTest, inscrireEleve, inscrireEleveMineur, relierParentEtEnfant } from './aide-parcours';

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

test('page introuvable (URL inconnue, connecté) : 404, titre français, repères', async ({ page }) => {
  await inscrireEleve(page, emailDeTest('axe-404'));
  for (const chemin of ['/page-qui-n-existe-pas', '/cours/cours-inexistant']) {
    const reponse = await page.goto(chemin);
    expect(reponse?.status()).toBe(404);
    await expect(page).toHaveTitle(/Page introuvable/);
    await expect(page.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Retour à l’accueil' })).toBeVisible();
    await expect(page.locator('main')).toHaveCount(1);
    await verifier(page, chemin);
  }
});

test('lien d’évitement : premier arrêt du clavier, vise le contenu', async ({ page }) => {
  await page.goto('/connexion');
  await page.keyboard.press('Tab');
  const lien = page.getByRole('link', { name: 'Aller au contenu' });
  await expect(lien).toBeFocused();
  await expect(lien).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#contenu$/);
  await expect(page.locator('main#contenu')).toBeVisible();
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

test('accès après l’essai : accueil verrouillé, choix du cours gratuit, cours fermé', async ({ page }) => {
  test.setTimeout(120_000);
  const email = emailDeTest('axe-acces');
  await inscrireEleve(page, email);
  await vieillirInscription(email, 8);
  await page.goto('/');
  await expect(page.getByText('Ton essai est terminé.')).toBeVisible();
  await verifier(page, '/ (essai terminé)');
  await page.goto('/choisir-cours');
  await expect(page.getByRole('heading', { name: 'Choisis ton cours gratuit' })).toBeVisible();
  await verifier(page, '/choisir-cours');
  // Envoi sans choix : le contrôle du serveur ne passe pas ici (la case radio est obligatoire), on vérifie donc la page de cours fermé.
  await page.goto('/cours/bph-1re-st2s');
  await expect(page.getByRole('heading', { name: 'Ce cours n’est pas ouvert pour toi' })).toBeVisible();
  await verifier(page, '/cours (verrouillé)');
});

test('consentement parental : demande, page d’accord (en clair et en sombre)', async ({ page, browser }, testInfo) => {
  test.setTimeout(120_000);
  const email = emailDeTest('axe-mineur');
  const emailParent = `parent-${email.split('@')[0]}@test.local`;
  await inscrireEleveMineur(page, email);
  await verifier(page, '/consentement');
  await page.getByLabel('Adresse e-mail de ton parent').fill(emailParent);
  await page.getByRole('button', { name: 'Envoyer la demande' }).click();
  await expect(page.getByText(`E-mail envoyé à ${emailParent}.`)).toBeVisible();
  await verifier(page, '/consentement (envoyé)');

  const lien = lienDansEmail((await dernierEmail(emailParent)).texte, /\/accord-parental\//);
  const contexte = await browser.newContext({ ...testInfo.project.use, baseURL: 'http://localhost:3000' });
  try {
    const parent = await contexte.newPage();
    await parent.goto(lien);
    await expect(parent.getByRole('heading', { name: 'Autorisation parentale' })).toBeVisible();
    await verifier(parent, '/accord-parental/<jeton>');
    await parent.goto('/accord-parental/introuvable');
    await expect(parent.getByRole('heading', { name: 'Lien expiré ou invalide' })).toBeVisible();
    await verifier(parent, '/accord-parental (invalide)');
  } finally {
    await contexte.close();
  }
});

test('mes données et pages légales', async ({ page }) => {
  await inscrireEleve(page, emailDeTest('axe-donnees'));
  await page.goto('/mes-donnees');
  await expect(page.getByRole('heading', { name: 'Mes données', exact: true })).toBeVisible();
  await verifier(page, '/mes-donnees');
  await page.getByLabel('Je comprends que la suppression sera définitive').check();
  await page.getByRole('button', { name: 'Demander la suppression' }).click();
  await expect(page.getByRole('button', { name: 'Annuler la suppression' })).toBeVisible();
  await verifier(page, '/mes-donnees (suppression demandée)');
  for (const chemin of ['/mentions-legales', '/confidentialite', '/conditions-utilisation', '/conditions-vente']) {
    await page.goto(chemin);
    await expect(page.locator('main')).toBeVisible();
    await verifier(page, chemin);
  }
});

test('espace parent : mes enfants et suivi d’un enfant', async ({ page, browser }, testInfo) => {
  test.setTimeout(120_000);
  await inscrireEleve(page, emailDeTest('axe-enfant'));
  const { parent, contexte, eleveId } = await relierParentEtEnfant(page, browser, testInfo, 'axe-parent');
  try {
    await verifier(parent, '/parent');
    await parent.goto(`/parent/enfant/${eleveId}`);
    await expect(parent.getByRole('heading', { name: 'Gérer le compte de Léa' })).toBeVisible();
    await verifier(parent, '/parent/enfant/<id>');
  } finally {
    await contexte.close();
  }
});

test('admin : relecture en lot des questions', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const slug = `e2e-axe-relecture-${testInfo.project.name}-${Date.now()}`.toLowerCase();
  try {
    const chapitreId = await creerCoursARelire(slug, 3);
    const email = emailDeTest('axe-admin');
    await inscrireEleve(page, email);
    await rendreAdmin(email);
    await page.goto(`/admin/chapitres/${chapitreId}/questions?relecture=1`);
    await expect(page.locator('article.carte-relecture')).toHaveCount(3);
    await verifier(page, '/admin/chapitres/<id>/questions?relecture=1');
    await page.getByLabel(`Sélectionner la question ${slug}:1`).check();
    await page.getByRole('button', { name: 'Valider la sélection' }).click();
    await expect(page.getByRole('status').filter({ hasText: '1 question validée.' })).toBeVisible();
    await verifier(page, 'relecture (après validation)');
  } finally {
    await supprimerCoursDeTest(slug);
  }
});
