import { expect, test } from '@playwright/test';
import { db, idProfil } from './aide-db';
import { emailDeTest, inscrireEleve } from './aide-parcours';

const secret = process.env.ENVOI_SECRET ?? '';

test('la route d’envoi refuse un appel sans le bon secret', async ({ request }) => {
  expect((await request.post('/api/notifications/envoyer')).status()).toBe(401);
  const faux = await request.post('/api/notifications/envoyer', { headers: { Authorization: `Bearer ${'x'.repeat(43)}` } });
  expect(faux.status()).toBe(401);
});

test('réglages, rappel d’un événement et liste de rappels', async ({ page, request }) => {
  test.skip(!secret, 'ENVOI_SECRET absent de .env.local : lancer npm run cles:notifications');
  const email = emailDeTest('notif');
  await inscrireEleve(page, email);

  // Réglages : pas de relance d'inactivité, pas de silence (l'envoi ne doit pas être décalé pendant le test).
  await page.goto('/notifications');
  await page.getByLabel('Relance après quelques jours sans réviser (17 h)').uncheck();
  await page.getByLabel('Début du silence').fill('00:00');
  await page.getByLabel('Fin du silence').fill('00:00');
  await page.getByRole('button', { name: 'Enregistrer mes réglages' }).click();
  await expect(page.getByText('Réglages enregistrés.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Relance après quelques jours sans réviser (17 h)')).not.toBeChecked();
  await expect(page.getByLabel('Début du silence')).toHaveValue('00:00');

  // Un devoir dans deux jours, rappel 1 heure avant.
  // Jour de Paris dans deux jours (les alias « @/ » ne sont pas résolus dans les tests e2e).
  const jour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(Date.now() + 2 * 86_400_000));
  await page.goto('/calendrier/nouveau');
  await page.getByLabel('Devoir', { exact: true }).check();
  await page.getByLabel('Titre', { exact: true }).fill('Exposé de BPH');
  await page.getByLabel('Date', { exact: true }).fill(jour);
  await page.getByLabel('Heure', { exact: true }).fill('18:00');
  await page.getByLabel('Rappel').selectOption('60');
  await page.getByRole('button', { name: 'Ajouter au calendrier' }).click();
  await expect(page).toHaveURL(/\/calendrier\?vue=semaine/);

  const eleve = await idProfil(email);
  const { data: ev } = await db.from('evenement').select('id, delai_rappel_minutes').eq('eleve_id', eleve).single();
  expect(ev?.delai_rappel_minutes).toBe(60);

  // Le rappel arrive à échéance (la planification elle-même est couverte par pgTAP).
  await db.from('notification_planifiee').insert({
    eleve_id: eleve, type: 'rappel_evenement', cle: `rappel:${ev!.id}:test`, evenement_id: ev!.id,
    titre: 'Exposé de BPH', corps: 'Dans 1 heure', url: `/calendrier/${ev!.id}`,
    envoi_prevu: new Date(Date.now() - 60_000).toISOString(),
  });
  const reponse = await request.post('/api/notifications/envoyer', { headers: { Authorization: `Bearer ${secret}` } });
  expect(reponse.status()).toBe(200);
  // La tâche planifiée locale peut aussi l'avoir traitée : on attend seulement le statut.
  await expect.poll(async () => (await db.from('notification_planifiee').select('statut').eq('eleve_id', eleve).eq('cle', `rappel:${ev!.id}:test`).single()).data?.statut)
    .toBe('envoyee');

  // Sans appareil, le rappel est dans l'application : compteur dans l'en-tête, puis liste.
  await page.goto('/calendrier');
  const lien = page.getByRole('link', { name: /^Rappels/ });
  await expect(lien).toContainText('1');
  await lien.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Rappels' })).toBeVisible();
  await expect(page.getByText('Exposé de BPH')).toBeVisible();
  await expect(page.getByRole('link', { name: /^Rappels/ })).not.toContainText('1');
});
