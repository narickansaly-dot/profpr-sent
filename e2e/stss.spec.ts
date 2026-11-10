import { expect, test } from '@playwright/test';
import { db, rendreAdmin } from './aide-db';
import { emailDeTest, inscrireEleve } from './aide-parcours';

const TITRE = 'Sciences et techniques sanitaires et sociales';

test.describe('cours de STSS non publié', () => {
  // Le cours est importé par `npm run import:contenu` (jamais publié par ce test) : sans lui, il n'y a rien à vérifier.
  test.beforeAll(async () => {
    const { data } = await db.from('cours').select('publie').eq('slug', 'stss-1re-st2s').maybeSingle();
    test.skip(!data, 'cours stss-1re-st2s absent de la base locale : lancer npm run import:contenu -- contenu/1re-st2s/stss.json --garder-statuts');
    test.skip(!!data?.publie, 'cours de STSS déjà publié : ce test ne vérifie que l’état non publié');
  });

  test('un élève de 1re ST2S ne voit pas le cours tant qu’il n’est pas publié', async ({ page }) => {
    await inscrireEleve(page, emailDeTest('stss-eleve'));
    await expect(page.getByRole('link', { name: /Biologie et physiopathologie humaines/ }).first()).toBeVisible();
    await expect(page.getByText(TITRE)).toHaveCount(0);
  });

  test('l’admin voit le cours dans le suivi du contenu, marqué « Brouillon »', async ({ page }) => {
    const email = emailDeTest('stss-admin');
    await inscrireEleve(page, email);
    await rendreAdmin(email);
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Suivi du contenu' })).toBeVisible();
    const bloc = page.locator('section.bloc-cours').filter({ has: page.getByRole('heading', { name: TITRE }) });
    await expect(bloc.locator('.statut-brouillon').first()).toHaveText('Brouillon');
  });
});
