import { expect, test } from '@playwright/test';
import { emailDeTest, inscrireEleve } from './aide-parcours';

/** Jour de Paris (AAAA-MM-JJ) dans n jours. */
function jourDans(n: number) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(Date.now() + n * 86_400_000));
}

test('un élève crée un examen, accepte son planning, révise et s’abonne à son calendrier', async ({ page, request }) => {
  await inscrireEleve(page, emailDeTest('calendrier'));
  await page.getByRole('link', { name: 'Calendrier', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Mon calendrier' })).toBeVisible();

  // Examen réel sur deux chapitres de BPH, dans 10 jours.
  await page.getByRole('link', { name: 'Ajouter', exact: true }).click();
  await page.getByLabel('Examen (contrôle, bac blanc…)').check();
  await page.getByLabel('Titre').fill('Contrôle de BPH');
  await page.getByLabel('Date', { exact: true }).fill(jourDans(10));
  await page.getByLabel('Heure', { exact: true }).fill('09:00');
  await page.getByLabel('Cours').selectOption({ index: 1 });
  await page.getByLabel(/^Ch\. 1 ·/).check();
  await page.getByLabel(/^Ch\. 2 ·/).check();
  await page.getByRole('button', { name: 'Ajouter au calendrier' }).click();
  await expect(page).toHaveURL(/\/calendrier\/[0-9a-f-]{36}\/planning$/);
  const pageExamen = page.url().replace(/\/planning$/, '');

  // Planning : tous les jours, pour avoir des créneaux quel que soit le jour du test.
  for (const jour of ['Samedi', 'Dimanche']) await page.getByLabel(jour).check();
  await page.getByRole('button', { name: 'Voir le planning proposé' }).click();
  await expect(page.getByRole('heading', { name: 'Planning proposé' })).toBeVisible();
  await page.getByRole('button', { name: 'Accepter ce planning' }).click();
  await expect(page).toHaveURL(/\/calendrier\?vue=semaine&date=\d{4}-\d{2}-\d{2}$/);
  await expect(page.locator('.item-revision').first()).toBeVisible();

  // Accueil : la première session apparaît dans les prochains événements.
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Prochains événements' })).toBeVisible();
  await expect(page.locator('.item-revision').first()).toBeVisible();

  // Révision générale, la veille de l'examen.
  await page.goto(`/calendrier?vue=jour&date=${jourDans(9)}`);
  await page.getByRole('link', { name: /Révision générale/ }).click();
  await page.getByRole('button', { name: 'Lancer la révision générale' }).click();
  await expect(page).toHaveURL(/\/tentative\/[0-9a-f-]{36}$/);
  await expect(page.getByRole('heading', { level: 1, name: /^Révision générale ·/ })).toBeVisible();

  // Lien iCal : lisible sans session, puis révoqué.
  await page.goto('/calendrier/partage');
  await page.getByRole('button', { name: 'Créer mon lien' }).click();
  const lien = await page.getByLabel('Ton lien privé').inputValue();
  const flux = await request.get(lien);
  expect(flux.status()).toBe(200);
  expect(flux.headers()['content-type']).toContain('text/calendar');
  const texte = await flux.text();
  expect(texte).toContain('BEGIN:VCALENDAR');
  expect(texte).toContain('SUMMARY:Contrôle de BPH');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Révoquer le lien' }).click();
  await expect(page.getByText('Aucun lien actif.')).toBeVisible();
  expect((await request.get(lien)).status()).toBe(404);

  // Supprimer l'examen supprime les sessions à venir.
  await page.goto(pageExamen);
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: /^Supprimer/ }).click();
  await expect(page).toHaveURL(/\/calendrier$/);
  await page.goto(`/calendrier?vue=jour&date=${jourDans(9)}`);
  await expect(page.getByRole('link', { name: /Révision générale/ })).toHaveCount(0);
});
