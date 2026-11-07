import { expect, test } from '@playwright/test';
import { emailDeTest, inscrireEleve } from './aide-parcours';

const TITRE_CH1 = "Organisation générale de l'organisme humain";

test('le manifeste et les icônes sont publics', async ({ request }) => {
  const reponse = await request.get('/manifest.webmanifest');
  expect(reponse.ok()).toBe(true);
  const manifeste = await reponse.json();
  expect(manifeste).toMatchObject({ name: 'App lycée', display: 'standalone', start_url: '/' });
  for (const icone of manifeste.icons as { src: string }[]) {
    const image = await request.get(icone.src);
    expect(image.headers()['content-type']).toBe('image/png');
  }
});

test('un chapitre déjà ouvert reste lisible hors connexion', async ({ page, context }) => {
  await inscrireEleve(page, emailDeTest('hors-ligne'));
  await page.goto('/cours/bph-1re-st2s/ch1');
  // Au premier chargement, le service worker s'installe ; on recharge pour que la page passe par lui et soit mise en cache.
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: TITRE_CH1 })).toBeVisible();

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: TITRE_CH1 })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'Tu es hors connexion' })).toBeVisible();
  await page.goto('/cours/bph-1re-st2s/ch2');
  await expect(page.getByRole('heading', { level: 1, name: 'Tu es hors connexion' })).toBeVisible();
  await context.setOffline(false);
});

test('la déconnexion vide les pages mises en cache', async ({ page }) => {
  await inscrireEleve(page, emailDeTest('cache'));
  await page.goto('/cours/bph-1re-st2s/ch1');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  const pagesEnCache = () => page.evaluate(async () => {
    const noms = (await caches.keys()).filter((c) => c.startsWith('pages-'));
    const tailles = await Promise.all(noms.map(async (n) => (await (await caches.open(n)).keys()).length));
    return tailles.reduce((a, b) => a + b, 0);
  });
  await expect.poll(pagesEnCache).toBeGreaterThan(0);
  await page.getByRole('button', { name: /Se déconnecter/ }).click();
  await expect(page).toHaveURL(/\/connexion$/);
  await expect.poll(pagesEnCache).toBe(0);
});
