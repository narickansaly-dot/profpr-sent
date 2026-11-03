import { expect, type Page } from '@playwright/test';

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
  const sauvegarde = page.waitForResponse((r) => r.request().method() === 'POST' && 'next-action' in r.request().headers());
  await page.locator('.choix .option').nth(indice).click();
  await sauvegarde;
  await expect(page.locator('.sauvegarde')).toHaveText('Réponses enregistrées');
}

/** Répond juste à toutes les questions du lecteur puis termine. */
export async function repondreJuste(page: Page, bonnes: number[][]) {
  for (let i = 0; i < bonnes.length; i++) {
    await expect(page.getByText(`Question ${i + 1} / ${bonnes.length}`, { exact: true })).toBeVisible();
    for (const indice of bonnes[i]) await cocherEtAttendreSauvegarde(page, indice);
    await expect(page.getByRole('button', { name: `Question ${i + 1}, répondue` })).toBeVisible();
    const suivant = i < bonnes.length - 1 ? 'Suivante →' : 'Terminer';
    await page.getByRole('button', { name: suivant, exact: true }).click();
  }
}
