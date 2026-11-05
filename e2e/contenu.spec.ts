import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { expect, test, type Page } from '@playwright/test';
import { bonnesReponsesAffichees, db, questionsDeTentative, rendreAdmin, rendreEnseignant } from './aide-db';
import { emailDeTest, inscrireEleve, repondreJuste } from './aide-parcours';
import { avecVerrou } from './aide-verrou';

const execFileAsync = promisify(execFile);
const FICHIER_BPH = 'contenu/1re-st2s/bph.json';
const TITRE_COURS = 'Biologie et physiopathologie humaines';
const HTML_PIEGE = '<p id="xss-test">ok</p><img src="x" onerror="window.__xss=1"><script>window.__xss=2</script>';

/** Remet le cours BPH dans son état d'origine (sections, statuts) : le réimport écrase les champs du chapitre. */
async function restaurerBph() {
  await execFileAsync('npm', ['run', 'import:contenu', '--', FICHIER_BPH], { cwd: process.cwd(), timeout: 120_000 });
}

async function lancerQuiz(page: Page): Promise<string> {
  await page.goto('/cours/bph-1re-st2s/ch1');
  await page.getByRole('button', { name: 'Lancer le quiz' }).click();
  await expect(page).toHaveURL(/\/tentative\/[0-9a-f-]{36}$/);
  return page.url().split('/').pop()!;
}

async function deposer(page: Page, nom: string, contenu: Buffer | string) {
  await page.locator('#champ-fichier').setInputFiles({ name: nom, mimeType: 'application/json', buffer: Buffer.from(contenu) });
  await page.getByRole('button', { name: 'Vérifier' }).click();
}

test('gestion du contenu : éditeurs, versionnage, nettoyage, signalement et import', async ({ browser }, testInfo) => {
  test.setTimeout(360_000);
  const projet = testInfo.project.name;
  const suffixe = `${projet}-${Date.now()}`;
  const emailAdmin = emailDeTest(`adm-${projet}`);
  const emailEleve = emailDeTest(`eleve-${projet}`);
  const emailEns = emailDeTest(`ens-${projet}`);
  const contexte = () => browser.newContext({ ...testInfo.project.use, baseURL: 'http://localhost:3000' });
  const ctxAdmin = await contexte();
  const ctxEleve = await contexte();
  const ctxEns = await contexte();
  try {
    const admin = await ctxAdmin.newPage();
    await inscrireEleve(admin, emailAdmin);
    await rendreAdmin(emailAdmin);

    // 1. Le tableau de suivi liste le cours BPH et ses 7 chapitres.
    await admin.goto('/admin');
    await expect(admin.getByRole('heading', { name: 'Suivi du contenu' })).toBeVisible();
    const chapitres = admin.getByRole('region', { name: `Chapitres de ${TITRE_COURS}` });
    await expect(chapitres.getByRole('row', { name: /^Ch\. \d — / })).toHaveCount(7);

    // 2. Création d'une question vrai/faux dans le chapitre 1, puis relecture et validation.
    const enonceVf = `Test e2e ${suffixe} : le cœur humain comporte quatre cavités.`;
    await chapitres.getByRole('link', { name: /^Questions de Ch\. 1 — / }).click();
    await expect(admin).toHaveURL(/\/admin\/chapitres\/([0-9a-f-]{36})\/questions$/);
    const chapitreId = admin.url().match(/chapitres\/([0-9a-f-]{36})/)![1];
    await admin.getByRole('link', { name: 'Nouvelle question' }).click();
    await admin.getByLabel('Type de question').selectOption({ label: 'Vrai ou faux' });
    await admin.getByLabel('Énoncé', { exact: true }).fill(enonceVf);
    await admin.getByRole('group', { name: 'L’affirmation est…' }).getByLabel('Vrai').check();
    await admin.getByRole('button', { name: 'Enregistrer', exact: true }).click();
    await expect(admin).toHaveURL(/\/admin\/questions\/[0-9a-f-]{36}\?enregistre=cree$/);
    await expect(admin.getByRole('status').filter({ hasText: 'La question est créée en brouillon.' })).toBeVisible();
    await admin.getByRole('button', { name: 'Envoyer en relecture' }).click();
    await expect(admin.getByRole('status').filter({ hasText: 'La question est en relecture.' })).toBeVisible();
    await admin.getByRole('button', { name: 'Valider', exact: true }).click();
    await expect(admin.getByRole('status').filter({ hasText: 'La question est validée' })).toBeVisible();
    await admin.goto(`/admin/chapitres/${chapitreId}/questions`);
    const ligneVf = admin.getByRole('listitem').filter({ hasText: enonceVf });
    await expect(ligneVf).toHaveCount(1);
    await expect(ligneVf).toContainText('Validée');

    // La suite modifie le cours BPH (questions, sections) puis le réimporte : un seul projet à la fois.
    await avecVerrou(async () => {
      try {
        // 3. Versionnage : une question tirée dans un quiz est modifiée, la correction passée reste exacte.
        const eleve = await ctxEleve.newPage();
        await inscrireEleve(eleve, emailEleve);
        const tentativeId = await lancerQuiz(eleve);
        await repondreJuste(eleve, await bonnesReponsesAffichees(tentativeId));
        await expect(eleve.getByRole('heading', { name: /Quiz réussi/ })).toBeVisible();
        const tirees = await questionsDeTentative(tentativeId);
        const qcm = tirees.find((q) => q.type === 'qcm_unique');
        if (!qcm) throw new Error('aucun QCM dans le quiz');
        const { data: corrige, error } = await db.from('question_corrige').select('bonnes_reponses').eq('question_id', qcm.id).single();
        if (error || !corrige) throw error ?? new Error('corrigé introuvable');
        const indiceBonne = (corrige.bonnes_reponses as number[])[0];
        const ancienne = qcm.propositions[indiceBonne];
        const nouvelle = `Nouvelle bonne réponse ${suffixe}`;

        await admin.goto(`/admin/questions/${qcm.id}`);
        await admin.getByLabel(`Proposition ${indiceBonne + 1}`, { exact: true }).fill(nouvelle);
        await admin.getByRole('button', { name: 'Enregistrer', exact: true }).click();
        await expect(admin.getByRole('status').filter({ hasText: 'Nouvelle version créée' })).toBeVisible();
        await expect(admin.getByText('Cette question est une nouvelle version d’une question déjà utilisée.')).toBeVisible();
        await eleve.goto(`/tentative/${tentativeId}/resultat`);
        await expect(eleve.locator('.liste-correction')).toContainText(ancienne);
        await expect(eleve.locator('.liste-correction')).not.toContainText(nouvelle);

        // 4. Nettoyage : le HTML dangereux enregistré par l'éditeur ne parvient jamais à l'élève.
        await admin.goto('/admin');
        await admin.getByRole('region', { name: `Chapitres de ${TITRE_COURS}` }).getByRole('link', { name: /^Modifier Ch\. 1 — / }).click();
        await expect(admin.getByRole('heading', { name: 'Modifier le chapitre' })).toBeVisible();
        await admin.getByLabel('HTML de la section 1', { exact: true }).fill(HTML_PIEGE);
        await admin.getByRole('button', { name: 'Enregistrer', exact: true }).click();
        await expect(admin.getByRole('status').filter({ hasText: 'Le chapitre est enregistré.' })).toBeVisible();
        const { data: stocke, error: erreurStock } = await db.from('chapitre').select('sections').eq('id', chapitreId).single();
        if (erreurStock || !stocke) throw erreurStock ?? new Error('chapitre introuvable');
        const premiere = JSON.stringify((stocke.sections as { html: string }[])[0]);
        expect(premiere).toContain('xss-test');
        expect(premiere).not.toMatch(/script|onerror/i);
        await eleve.goto('/cours/bph-1re-st2s/ch1');
        await expect(eleve.locator('#xss-test')).toBeVisible();
        expect(await eleve.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined();
        await expect(eleve.locator('.contenu-chapitre script')).toHaveCount(0);
        await expect(eleve.locator('.contenu-chapitre img[onerror]')).toHaveCount(0);

        // 5. Signalement : un enseignant signale une question, l'admin rejette, l'enseignant lit la décision.
        const ens = await ctxEns.newPage();
        await inscrireEleve(ens, emailEns);
        await rendreEnseignant(emailEns);
        const tentativeEns = await lancerQuiz(ens);
        await repondreJuste(ens, await bonnesReponsesAffichees(tentativeEns));
        await expect(ens.getByRole('heading', { name: /Quiz réussi/ })).toBeVisible();
        const commentaire = `Signalement e2e ${suffixe} : la formulation prête à confusion.`;
        const reponse = `Réponse e2e ${suffixe} : la question est juste.`;
        await ens.getByRole('button', { name: 'Signaler une erreur' }).first().click();
        await ens.getByLabel('Qu’est-ce qui ne va pas ?').fill(commentaire);
        await ens.getByRole('button', { name: 'Envoyer le signalement' }).click();
        await expect(ens.getByRole('status').filter({ hasText: 'Merci : la question est retirée des quiz le temps de la relecture.' })).toBeVisible();

        await admin.goto('/admin/signalements');
        const carte = admin.getByRole('listitem').filter({ hasText: commentaire });
        await expect(carte).toHaveCount(1);
        await expect(carte).toContainText('Question : À relire');
        await carte.getByLabel('Réponse à l’enseignant (facultatif)').fill(reponse);
        await carte.getByRole('button', { name: /^Rejeter/ }).click();
        await expect(admin.getByRole('status').filter({ hasText: 'Signalement rejeté : la question est conservée.' })).toBeVisible();
        await admin.goto('/admin/signalements?statut=rejete');
        const carteRejetee = admin.getByRole('listitem').filter({ hasText: commentaire });
        await expect(carteRejetee).toContainText('Question : Validée');
        await expect(carteRejetee).toContainText(reponse);

        await ens.goto('/enseignant/signalements');
        const carteEns = ens.getByRole('listitem').filter({ hasText: commentaire });
        await expect(carteEns).toContainText('Rejeté');
        await expect(carteEns).toContainText(reponse);

        // 6. Import : un fichier faux est refusé avec son chemin, puis BPH est réimporté sans publication.
        await admin.goto('/admin/import');
        const faux = {
          slug: `faux-${suffixe}`.toLowerCase(), filiere: 'ST2S', niveau: '1re', matiere: 'Test', titre: 'Cours faux',
          chapitres: [{ slug: 'ch1', numero: 1, titre: 'Un chapitre', sections: [], questions: [
            { source: 'faux:1', type: 'qcm_unique', enonce: 'Question ?', propositions: ['a', 'b'], bonnes_reponses: [5] }] }],
        };
        await deposer(admin, 'faux.json', JSON.stringify(faux));
        const erreurs = admin.getByRole('alert').filter({ hasText: 'Fichier invalide : rien n’a été écrit' });
        await expect(erreurs).toBeVisible();
        await expect(erreurs).toContainText(/Chapitre 1, question 1 : Une bonne réponse ne correspond à aucune proposition\./);

        await deposer(admin, 'bph.json', await readFile(FICHIER_BPH));
        await expect(admin.getByRole('heading', { name: '2. Vérifier le résumé' })).toBeVisible();
        await admin.getByRole('button', { name: 'Importer', exact: true }).click();
        await expect(admin.getByRole('heading', { name: /Import terminé/ })).toBeVisible();
        await expect(admin.locator('.bilan-import > div').filter({ hasText: 'Créées' })).toHaveText(/Créées\s*0$/);
        await admin.goto('/admin');
        await expect(admin.getByRole('region', { name: TITRE_COURS }).locator('.entete-bloc .statut')).toHaveText('Publié');
      } finally {
        await restaurerBph();
      }
    });
  } finally {
    await Promise.all([ctxAdmin.close(), ctxEleve.close(), ctxEns.close()]);
  }
});
