import { expect, test, type Page } from '@playwright/test';
import { emailDeTest, inscrireEleve, suivreViolations } from './aide-parcours';

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
  const violations = await suivreViolations(page);
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
  // Le rechargement hors connexion rejoue l'en-tête CSP et le nonce mis en cache ensemble : aucune violation.
  expect(violations).toEqual([]);
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

/** Chemins des pages de chapitre actuellement en cache. */
const cheminsEnCache = (page: Page) => page.evaluate(async () => {
  const chemins: string[] = [];
  for (const nom of (await caches.keys()).filter((c) => c.startsWith('pages-'))) {
    for (const requete of await (await caches.open(nom)).keys()) chemins.push(new URL(requete.url).pathname);
  }
  return chemins;
});

test('un chapitre ouvert par un lien de l\u2019application reste lisible hors connexion', async ({ page, context }) => {
  await inscrireEleve(page, emailDeTest('lien'));
  await page.goto('/cours/bph-1re-st2s');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  // Navigation côté client (données RSC) : le chapitre doit tout de même être mis en cache.
  await page.locator('a[href="/cours/bph-1re-st2s/ch1"]').first().click();
  await expect(page.getByRole('heading', { level: 1, name: TITRE_CH1 })).toBeVisible();
  await expect.poll(() => cheminsEnCache(page)).toContain('/cours/bph-1re-st2s/ch1');

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: TITRE_CH1 })).toBeVisible();
  await context.setOffline(false);
});

test('arriver sur la page de connexion vide les pages mises en cache', async ({ page, context }) => {
  await inscrireEleve(page, emailDeTest('arrivee'));
  await page.goto('/cours/bph-1re-st2s/ch1');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => cheminsEnCache(page)).toContain('/cours/bph-1re-st2s/ch1');
  // Session perdue sans passer par le bouton de déconnexion (cookies effacés, session expirée) : seule l'arrivée sur /connexion vide le cache.
  await context.clearCookies();
  await page.goto('/connexion');
  await expect.poll(() => cheminsEnCache(page)).toEqual([]);
  // Le repli hors connexion, lui, reste en place.
  const { cles, script, repli } = await page.evaluate(async () => {
    const cles = await caches.keys();
    const script = (await navigator.serviceWorker.getRegistration())?.active?.scriptURL ?? '';
    const nom = cles.find((c) => c.startsWith('hors-ligne-'));
    return { cles, script, repli: nom ? !!(await (await caches.open(nom)).match('/hors-ligne')) : false };
  });
  const version = new URL(script).searchParams.get('v');
  expect(version).toMatch(/^[a-z0-9]{1,16}$/);
  expect(cles).toContain(`hors-ligne-${version}`);
  expect(repli).toBe(true);
});
