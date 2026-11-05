import { expect, test, type Page } from '@playwright/test';
import { bonnesReponsesAffichees, db, questionsDeTentative, rendreAdmin, rendreEnseignant } from './aide-db';
import { emailDeTest, inscrireEleve, repondreJuste } from './aide-parcours';

const HTML_PIEGE = '<p id="xss-test">ok</p><img src="x" onerror="window.__xss=1"><script>window.__xss=2</script>';
/** Un champ dans le contenu du chapitre (comme la calculatrice IMC de BPH) : Entrée dans l'aperçu ne doit rien enregistrer. */
const HTML_CHAMP = '<p><label for="essai-apercu">Essai</label><input id="essai-apercu" type="text"></p>';

/**
 * Cours de test propre à chaque projet et à chaque exécution : le parcours ne modifie jamais BPH, que les autres
 * specs lisent en parallèle. Même format pour la RPC (clé de service) et pour le fichier déposé dans /admin/import
 * (des QCM à une réponse seulement, dont la forme est identique dans les deux formats).
 */
function coursDeTest(slug: string, titre: string) {
  return {
    slug, filiere: 'ST2S', niveau: '1re', matiere: 'Test e2e', titre, couleur: '#0f766e',
    chapitres: [
      {
        slug: 'ch1', numero: 1, titre: 'Chapitre de test', objectifs: [],
        sections: [{ id: 'intro', titre: 'Introduction', html: '<p>Section de test.</p>' }],
        questions: Array.from({ length: 20 }, (_, i) => ({
          source: `${slug}:${i + 1}`, type: 'qcm_unique', statut: 'valide', difficulte: 2, explication: '',
          enonce: `Question de test n° ${i + 1} : quelle est la bonne réponse ?`,
          propositions: [`Bonne réponse n° ${i + 1}.`, `Mauvaise réponse n° ${i + 1}a.`, `Mauvaise réponse n° ${i + 1}b.`],
          bonnes_reponses: [0],
        })),
      },
      { slug: 'ch2', numero: 2, titre: 'Chapitre sans quiz', objectifs: [], sections: [], questions: [] },
    ],
  };
}

async function lancerQuiz(page: Page, slug: string): Promise<string> {
  await page.goto(`/cours/${slug}/ch1`);
  await page.getByRole('button', { name: 'Lancer le quiz' }).click();
  await expect(page).toHaveURL(/\/tentative\/[0-9a-f-]{36}$/);
  return page.url().split('/').pop()!;
}

async function deposer(page: Page, nom: string, contenu: string) {
  await page.locator('#champ-fichier').setInputFiles({ name: nom, mimeType: 'application/json', buffer: Buffer.from(contenu) });
  await page.getByRole('button', { name: 'Vérifier' }).click();
}

async function sectionsDuChapitre(id: string): Promise<string> {
  const { data, error } = await db.from('chapitre').select('sections').eq('id', id).single();
  if (error || !data) throw error ?? new Error('chapitre introuvable');
  return JSON.stringify(data.sections);
}

/** Retire le cours de test : supprimé s'il n'a aucun résultat, sinon dépublié (le nettoyage global le supprime ensuite). */
async function retirerCours(slug: string) {
  const { data: cours } = await db.from('cours').select('id, chapitre(id)').eq('slug', slug).maybeSingle();
  if (!cours) return;
  const chapitres = cours.chapitre.map((c) => c.id);
  // Les versions se référencent entre elles (on delete restrict) : on les détache avant la suppression en cascade.
  if (chapitres.length > 0) await db.from('question').update({ version_de: null }).in('chapitre_id', chapitres);
  const { error } = await db.from('cours').delete().eq('id', cours.id);
  if (error) {
    const { error: e2 } = await db.from('cours').update({ publie: false }).eq('id', cours.id);
    if (e2) throw e2;
  }
}

test('gestion du contenu : éditeurs, versionnage, nettoyage, signalement et import', async ({ browser }, testInfo) => {
  test.setTimeout(300_000);
  const projet = testInfo.project.name;
  const suffixe = `${projet}-${Date.now()}`;
  const slug = `e2e-${suffixe}`.toLowerCase();
  const titreCours = `Cours e2e ${suffixe}`;
  const fichier = coursDeTest(slug, titreCours);
  const emailAdmin = emailDeTest(`adm-${projet}`);
  const emailEleve = emailDeTest(`eleve-${projet}`);
  const emailEns = emailDeTest(`ens-${projet}`);
  const contexte = () => browser.newContext({ ...testInfo.project.use, baseURL: 'http://localhost:3000' });
  const ctxAdmin = await contexte();
  const ctxEleve = await contexte();
  const ctxEns = await contexte();
  let questionVf: string | undefined;
  try {
    const { error: erreurImport } = await db.rpc('importer_cours', { p_cours: fichier, p_publier: true });
    if (erreurImport) throw erreurImport;

    const admin = await ctxAdmin.newPage();
    await inscrireEleve(admin, emailAdmin);
    await rendreAdmin(emailAdmin);

    // 1. Le tableau de suivi liste le cours BPH et ses 7 chapitres, et le cours de test.
    await admin.goto('/admin');
    await expect(admin.getByRole('heading', { name: 'Suivi du contenu' })).toBeVisible();
    await expect(admin.getByRole('region', { name: 'Chapitres de Biologie et physiopathologie humaines' })
      .getByRole('row', { name: /^Ch\. \d — / })).toHaveCount(7);
    const chapitres = admin.getByRole('region', { name: `Chapitres de ${titreCours}` });
    await expect(chapitres.getByRole('row', { name: /^Ch\. \d — / })).toHaveCount(2);

    // 2. Création d'une question vrai/faux (chapitre 2, sans quiz), puis relecture et validation.
    const enonceVf = `Test e2e ${suffixe} : le cœur humain comporte quatre cavités.`;
    await chapitres.getByRole('link', { name: /^Questions de Ch\. 2 — / }).click();
    await expect(admin).toHaveURL(/\/admin\/chapitres\/([0-9a-f-]{36})\/questions$/);
    const chapitre2 = admin.url().match(/chapitres\/([0-9a-f-]{36})/)![1];
    await admin.getByRole('link', { name: 'Nouvelle question' }).click();
    await admin.getByLabel('Type de question').selectOption({ label: 'Vrai ou faux' });
    await admin.getByLabel('Énoncé', { exact: true }).fill(enonceVf);
    await admin.getByRole('group', { name: 'L’affirmation est…' }).getByLabel('Vrai').check();
    await admin.getByRole('button', { name: 'Enregistrer', exact: true }).click();
    await expect(admin).toHaveURL(/\/admin\/questions\/[0-9a-f-]{36}\?enregistre=cree$/);
    questionVf = admin.url().match(/questions\/([0-9a-f-]{36})/)![1];
    await expect(admin.getByRole('status').filter({ hasText: 'La question est créée en brouillon.' })).toBeVisible();
    await admin.getByRole('button', { name: 'Envoyer en relecture' }).click();
    await expect(admin.getByRole('status').filter({ hasText: 'La question est en relecture.' })).toBeVisible();
    await admin.getByRole('button', { name: 'Valider', exact: true }).click();
    await expect(admin.getByRole('status').filter({ hasText: 'La question est validée' })).toBeVisible();
    await admin.goto(`/admin/chapitres/${chapitre2}/questions`);
    const ligneVf = admin.getByRole('listitem').filter({ hasText: enonceVf });
    await expect(ligneVf).toHaveCount(1);
    await expect(ligneVf).toContainText('Validée');

    // 3. Versionnage : une question tirée dans un quiz est modifiée, la correction passée reste exacte.
    const eleve = await ctxEleve.newPage();
    await inscrireEleve(eleve, emailEleve);
    const tentativeId = await lancerQuiz(eleve, slug);
    await repondreJuste(eleve, await bonnesReponsesAffichees(tentativeId));
    await expect(eleve.getByRole('heading', { name: /Quiz réussi/ })).toBeVisible();
    const [qcm] = await questionsDeTentative(tentativeId);
    const ancienne = qcm.propositions[0];
    const nouvelle = `Nouvelle bonne réponse ${suffixe}`;
    await admin.goto(`/admin/questions/${qcm.id}`);
    await admin.getByLabel('Proposition 1', { exact: true }).fill(nouvelle);
    await admin.getByRole('button', { name: 'Enregistrer', exact: true }).click();
    await expect(admin.getByRole('status').filter({ hasText: 'Nouvelle version créée' })).toBeVisible();
    await expect(admin.getByText('Cette question est une nouvelle version d’une question déjà utilisée.')).toBeVisible();
    await eleve.goto(`/tentative/${tentativeId}/resultat`);
    await expect(eleve.locator('.liste-correction')).toContainText(ancienne);
    await expect(eleve.locator('.liste-correction')).not.toContainText(nouvelle);

    // 4. Éditeur de chapitre : Entrée dans l'aperçu ou dans le dépôt d'image n'enregistre jamais le chapitre,
    //    puis le HTML dangereux enregistré ne parvient jamais à l'élève.
    await admin.goto('/admin');
    await admin.getByRole('region', { name: `Chapitres de ${titreCours}` }).getByRole('link', { name: /^Modifier Ch\. 1 — / }).click();
    await expect(admin.getByRole('heading', { name: 'Modifier le chapitre' })).toBeVisible();
    const urlEditeur = admin.url();
    const chapitre1 = urlEditeur.match(/chapitres\/([0-9a-f-]{36})/)![1];
    const avant = await sectionsDuChapitre(chapitre1);
    await admin.getByLabel('HTML de la section 1', { exact: true }).fill(HTML_CHAMP);
    await admin.getByRole('button', { name: 'Aperçu', exact: true }).click();
    const champApercu = admin.getByRole('region', { name: 'Aperçu du chapitre' }).getByLabel('Essai');
    await champApercu.fill('42');
    await champApercu.press('Enter');
    await admin.getByRole('button', { name: /^Image…/ }).first().click();
    const alt = admin.getByLabel('Texte alternatif (obligatoire)');
    await alt.fill('Un schéma');
    await alt.press('Enter');
    await expect(admin.getByRole('alert').filter({ hasText: 'Choisis d’abord une image.' })).toBeVisible();
    await admin.waitForTimeout(1000);
    expect(admin.url()).toBe(urlEditeur);
    await expect(admin.getByRole('status').filter({ hasText: 'Le chapitre est enregistré.' })).toHaveCount(0);
    expect(await sectionsDuChapitre(chapitre1)).toBe(avant);

    await admin.getByLabel('HTML de la section 1', { exact: true }).fill(HTML_PIEGE);
    await admin.getByRole('button', { name: 'Enregistrer', exact: true }).click();
    await expect(admin.getByRole('status').filter({ hasText: 'Le chapitre est enregistré.' })).toBeVisible();
    const premiere = JSON.stringify(JSON.parse(await sectionsDuChapitre(chapitre1))[0]);
    expect(premiere).toContain('xss-test');
    expect(premiere).not.toMatch(/script|onerror/i);
    await eleve.goto(`/cours/${slug}/ch1`);
    await expect(eleve.locator('#xss-test')).toBeVisible();
    expect(await eleve.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined();
    await expect(eleve.locator('.contenu-chapitre script')).toHaveCount(0);
    await expect(eleve.locator('.contenu-chapitre img[onerror]')).toHaveCount(0);

    // 5. Signalement : un enseignant signale la question 1 de son quiz (nom accessible distinct, focus géré).
    const ens = await ctxEns.newPage();
    await inscrireEleve(ens, emailEns);
    await rendreEnseignant(emailEns);
    const tentativeEns = await lancerQuiz(ens, slug);
    await repondreJuste(ens, await bonnesReponsesAffichees(tentativeEns));
    await expect(ens.getByRole('heading', { name: /Quiz réussi/ })).toBeVisible();
    const commentaire = `Signalement e2e ${suffixe} : la formulation prête à confusion.`;
    const reponse = `Réponse e2e ${suffixe} : la question est juste.`;
    await ens.getByRole('button', { name: 'Signaler une erreur : question 1', exact: true }).click();
    await expect(ens.getByLabel('Qu’est-ce qui ne va pas ?')).toBeFocused();
    await ens.getByLabel('Qu’est-ce qui ne va pas ?').fill(commentaire);
    await ens.getByRole('button', { name: 'Envoyer le signalement' }).click();
    const merci = ens.getByRole('status').filter({ hasText: 'Merci : la question est retirée des quiz le temps de la relecture.' });
    await expect(merci).toBeVisible();
    await expect(merci).toBeFocused();

    // 6. Import : un fichier faux est refusé avec son chemin ; le cours de test est réimporté (fichier « valide »),
    //    et la question signalée reste « à relire ».
    await admin.goto('/admin/import');
    const faux = {
      slug: `faux-${suffixe}`.toLowerCase(), filiere: 'ST2S', niveau: '1re', matiere: 'Test', titre: 'Cours faux',
      chapitres: [{ slug: 'ch1', numero: 1, titre: 'Un chapitre', sections: [], questions: [
        { source: 'faux:1', type: 'qcm_unique', enonce: 'Question ?', propositions: ['a', 'b'], bonnes_reponses: [5] }] }],
    };
    await deposer(admin, 'faux.json', JSON.stringify(faux));
    const erreurs = admin.getByRole('region', { name: 'Fichier invalide : rien n’a été écrit' });
    await expect(erreurs).toBeFocused();
    await expect(erreurs).toContainText(/Chapitre 1, question 1 : Une bonne réponse ne correspond à aucune proposition\./);

    await deposer(admin, 'cours.json', JSON.stringify(fichier));
    await expect(admin.getByRole('heading', { name: '2. Vérifier le résumé' })).toBeVisible();
    await admin.getByRole('button', { name: 'Importer', exact: true }).click();
    await expect(admin.getByRole('heading', { name: /Import terminé/ })).toBeVisible();
    await expect(admin.locator('.bilan-import > div').filter({ hasText: 'Créées' })).toHaveText(/Créées\s*0$/);

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
  } finally {
    await Promise.all([ctxAdmin.close(), ctxEleve.close(), ctxEns.close()]);
    if (questionVf) {
      const { error } = await db.from('question').delete().eq('id', questionVf);
      if (error) throw error;
    }
    await retirerCours(slug);
  }
});
