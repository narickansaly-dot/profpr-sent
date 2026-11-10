import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { emailDeTest, inscrireEleve } from './aide-parcours';

test('l’élève télécharge ses données', async ({ page }) => {
  const email = emailDeTest('export');
  await inscrireEleve(page, email);
  // Un lien iCal existe : l'export en donne la date, jamais le jeton.
  await page.goto('/calendrier/partage');
  await page.getByRole('button', { name: 'Créer mon lien' }).click();
  const lien = await page.getByLabel('Ton lien privé').inputValue();
  const jetonIcal = new URL(lien).pathname.split('/').filter(Boolean).pop()?.replace(/\.ics$/, '') ?? '';
  expect(jetonIcal).toMatch(/^[A-Za-z0-9_-]{43}$/);
  await page.goto('/mes-donnees');
  const [telechargement] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: 'Télécharger mes données' }).click(),
  ]);
  expect(telechargement.suggestedFilename()).toMatch(/^mes-donnees-\d{4}-\d{2}-\d{2}\.json$/);
  const chemin = await telechargement.path();
  const contenu = await readFile(chemin, 'utf8');
  const donnees = JSON.parse(contenu) as Record<string, unknown>;
  for (const cle of ['profil', 'classes', 'progression_chapitres', 'tentatives', 'historique_questions', 'evenements', 'plans_revision', 'preferences_notification', 'appareils', 'consentement', 'acces_gratuit']) {
    expect(donnees, cle).toHaveProperty(cle);
  }
  expect(donnees.profil).toMatchObject({ email, role: 'eleve', niveau: '1re' });
  // Aucun secret : ni jeton d'agenda (valeur), ni empreinte, ni clé d'appareil.
  expect(contenu).not.toMatch(/p256dh|endpoint|empreinte|token/i);
  expect(contenu).not.toContain(jetonIcal);
  expect(contenu).not.toMatch(/[A-Za-z0-9_-]{43}/);
  expect(Object.keys(donnees.jeton_ical as object)).toEqual(['cree_le']);
});

test('la demande de suppression affiche une bannière, l’annulation la retire', async ({ page }) => {
  await inscrireEleve(page, emailDeTest('suppression'));
  await page.goto('/mes-donnees');
  // La case est obligatoire : sans elle, la demande n'est pas envoyée.
  await page.getByLabel('Je comprends que la suppression sera définitive').check();
  await page.getByRole('button', { name: 'Demander la suppression' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Ton compte sera supprimé à partir du' })).toBeVisible();

  await page.goto('/');
  const banniere = page.locator('.banniere').filter({ hasText: 'Ton compte sera supprimé à partir du' });
  await expect(banniere).toBeVisible();
  await banniere.getByRole('link', { name: 'Annuler la suppression' }).click();
  await expect(page).toHaveURL(/\/mes-donnees$/);
  await page.getByRole('button', { name: 'Annuler la suppression' }).click();
  await expect(page.getByRole('button', { name: 'Demander la suppression' })).toBeVisible();

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Mes cours' })).toBeVisible();
  await expect(page.getByText('Ton compte sera supprimé à partir du')).toHaveCount(0);
});
