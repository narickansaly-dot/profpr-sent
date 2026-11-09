import { expect, type Browser, type BrowserContext, type Page, type TestInfo } from '@playwright/test';

export function emailDeTest(prefixe: string) {
  return `${prefixe}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.local`;
}

/** Remplit la fin de l'inscription (page « bienvenue ») et attend le tableau de bord. */
export async function terminerBienvenue(page: Page) {
  await expect(page).toHaveURL(/\/bienvenue$/);
  await page.getByLabel('Ton prénom').fill('Léa');
  await page.getByLabel('Ta filière').selectOption({ label: 'ST2S — Sciences et technologies de la santé et du social' });
  await page.getByLabel('Première').check();
  await page.getByRole('button', { name: 'C’est parti !' }).click();
  await expect(page.getByRole('heading', { name: 'Mes cours' })).toBeVisible();
}

/** Inscrit un élève de 1re ST2S et l'amène sur le tableau de bord. */
export async function inscrireEleve(page: Page, email: string) {
  await page.goto('/inscription');
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByLabel('Mot de passe').fill('motdepasse-test');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await terminerBienvenue(page);
}

/** Clique la proposition `indice` et attend que l'enregistrement (action serveur) soit revenu. */
export async function cocherEtAttendreSauvegarde(page: Page, indice: number) {
  const sauvegarde = page.waitForResponse((r) => r.request().method() === 'POST' && 'next-action' in r.request().headers() && r.ok());
  await page.locator('.choix .option').nth(indice).click();
  await sauvegarde;
  await expect(page.locator('.sauvegarde')).toHaveText('Réponses enregistrées');
  await expect(page.locator('.lecteur .sauvegarde-erreur')).toHaveCount(0);
  await expect(page.locator('.lecteur [role=alert]')).toHaveCount(0);
}

/** Répond juste à la question `i` (0-based) du lecteur, vérifie la pastille, puis passe à la suivante (ou termine). */
export async function repondreJusteQuestion(page: Page, i: number, total: number, bonnes: number[]) {
  await expect(page.locator('.lecteur-position').filter({ hasText: new RegExp(`^Question ${i + 1}\\D+${total}$`) })).toBeVisible();
  for (const indice of bonnes) await cocherEtAttendreSauvegarde(page, indice);
  await expect(page.getByRole('button', { name: `Question ${i + 1}, répondue` })).toBeVisible();
  const suivant = i < total - 1 ? 'Suivante →' : 'Terminer';
  await page.getByRole('button', { name: suivant, exact: true }).click();
}

/** Répond juste à toutes les questions du lecteur puis termine. */
export async function repondreJuste(page: Page, bonnes: number[][]) {
  for (let i = 0; i < bonnes.length; i++) await repondreJusteQuestion(page, i, bonnes.length, bonnes[i]);
}

/** Relève les violations de CSP signalées par le navigateur pendant la visite. */
export async function suivreViolations(page: Page) {
  const violations: string[] = [];
  page.on('console', (m) => { if (/Content Security Policy|Content-Security-Policy/i.test(m.text())) violations.push(m.text()); });
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => console.error(`Content Security Policy : ${e.violatedDirective} ${e.blockedURI}`));
  });
  return violations;
}

/** Inscrit un élève qui coche « J'ai moins de 15 ans » et l'amène sur la page d'attente de l'accord parental. */
export async function inscrireEleveMineur(page: Page, email: string) {
  await page.goto('/inscription');
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByLabel('Mot de passe').fill('motdepasse-test');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await expect(page).toHaveURL(/\/bienvenue$/);
  await page.getByLabel('Ton prénom').fill('Léa');
  await page.getByLabel('Ta filière').selectOption({ label: 'ST2S — Sciences et technologies de la santé et du social' });
  await page.getByLabel('Première').check();
  await page.getByLabel('J’ai moins de 15 ans').check();
  await page.getByRole('button', { name: 'C’est parti !' }).click();
  await expect(page).toHaveURL(/\/consentement$/);
}

/** Inscrit un compte parent (« Parent d’un élève », prénom « Camille ») et attend la page « Mes enfants ». */
export async function inscrireParent(page: Page, email: string) {
  await page.goto('/inscription');
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByLabel('Mot de passe').fill('motdepasse-test');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await expect(page).toHaveURL(/\/bienvenue$/);
  await page.getByLabel('Parent d’un élève').check();
  await page.getByLabel('Votre prénom').fill('Camille');
  await page.getByRole('button', { name: 'C’est parti !' }).click();
  await expect(page).toHaveURL(/\/parent$/);
  await expect(page.getByRole('heading', { name: 'Mes enfants' })).toBeVisible();
}

/**
 * Prépare un parent relié à un enfant : `page` (déjà élève de plus de 15 ans, inscrit) crée un code, un parent
 * l'utilise dans un autre contexte. Renvoie la page du parent, son contexte (à fermer) et l'identifiant de l'enfant.
 */
export async function relierParentEtEnfant(page: Page, browser: Browser, testInfo: TestInfo, prefixe: string): Promise<{ parent: Page; contexte: BrowserContext; eleveId: string }> {
  await page.goto('/mes-donnees');
  await page.getByRole('button', { name: 'Créer un code pour un parent' }).click();
  const code = (await page.locator('.code-parent').innerText()).trim();
  const contexte = await browser.newContext({ ...testInfo.project.use, baseURL: 'http://localhost:3000' });
  const parent = await contexte.newPage();
  await inscrireParent(parent, emailDeTest(prefixe));
  await parent.getByLabel('Code de votre enfant').fill(code);
  await parent.getByRole('button', { name: 'Relier cet enfant' }).click();
  const lien = parent.getByRole('link', { name: /Voir le détail/ });
  await expect(lien).toBeVisible();
  const eleveId = (await lien.getAttribute('href'))?.split('/').pop();
  if (!eleveId) throw new Error('identifiant de l’enfant introuvable');
  return { parent, contexte, eleveId };
}
