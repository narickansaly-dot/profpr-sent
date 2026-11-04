import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { bonnesReponsesAffichees, rendreAdmin, validerTousLesChapitres } from './aide-db';
import { emailDeTest, inscrireEleve, repondreJuste } from './aide-parcours';

async function inscrire(page: Page, email: string) {
  await page.goto('/inscription');
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByLabel('Mot de passe').fill('motdepasse-test');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await expect(page).toHaveURL(/\/bienvenue$/);
}

/** Date au format datetime-local (heure de Paris) : hier 18:00, date calculée à Paris et non en UTC. */
function hier18h(): string {
  const d = new Date(Date.now() - 24 * 3600 * 1000);
  const jour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  return `${jour}T18:00`;
}

test('parcours enseignant : demande, validation, classe, suivi, échéance, retrait', async ({ browser }, testInfo) => {
  test.setTimeout(240_000);
  const suffixe = `${testInfo.project.name}-${Date.now()}`;
  const nomEnseignant = `Prof${testInfo.project.name}${Math.random().toString(36).slice(2, 8)}`;
  const nomClasse = `1re ST2S test ${suffixe}`;
  const emailEnseignant = emailDeTest(`ens-${testInfo.project.name}`);
  const emailAdmin = emailDeTest(`adm-${testInfo.project.name}`);
  const emailEleve = emailDeTest(`eleve-${testInfo.project.name}`);
  const contexte = (opts = {}) => browser.newContext({ ...testInfo.project.use, baseURL: 'http://localhost:3000', ...opts });

  const ctxEns = await contexte();
  const ctxAdmin = await contexte();
  const ctxEleve = await contexte();
  // Les contextes sont fermés même si une vérification échoue.
  try {
    // 1. Demande de compte enseignant.
    const ens = await ctxEns.newPage();
    await inscrire(ens, emailEnseignant);
    await ens.getByLabel('J’enseigne').check();
    await ens.getByLabel('Ton prénom').fill(nomEnseignant);
    await ens.getByLabel('Ton établissement').fill('Lycée de test');
    await ens.getByRole('button', { name: 'C’est parti !' }).click();
    await expect(ens.getByRole('heading', { name: new RegExp(`Merci ${nomEnseignant}`) })).toBeVisible();
    await expect(ens.getByText('en cours de vérification')).toBeVisible();

    // 2. Un admin valide la demande.
    const admin = await ctxAdmin.newPage();
    await inscrire(admin, emailAdmin);
    await admin.getByLabel('Ton prénom').fill('Admin');
    await admin.getByLabel('Ta filière').selectOption({ label: 'ST2S — Sciences et technologies de la santé et du social' });
    await admin.getByLabel('Première').check();
    await admin.getByRole('button', { name: 'C’est parti !' }).click();
    await expect(admin.getByRole('heading', { name: 'Mes cours' })).toBeVisible();
    await rendreAdmin(emailAdmin);
    await admin.goto('/admin/enseignants');
    await expect(admin.getByRole('heading', { name: 'Demandes de comptes enseignants' })).toBeVisible();
    const valider = admin.getByRole('button', { name: new RegExp(`Valider la demande de ${nomEnseignant}`) });
    await valider.click();
    await expect(admin.getByRole('status').filter({ hasText: 'Compte enseignant validé.' })).toBeVisible();
    await expect(valider).toHaveCount(0);

    // 3. L'enseignant crée sa classe avec le cours BPH.
    await ens.goto('/');
    await expect(ens).toHaveURL(/\/enseignant$/);
    await ens.getByLabel('Nom de la classe').fill(nomClasse);
    await ens.getByLabel(/Biologie et physiopathologie/).check();
    await ens.getByRole('button', { name: 'Créer la classe' }).click();
    await expect(ens).toHaveURL(/\/enseignant\/classes\/[0-9a-f-]{36}$/);
    await expect(ens.getByRole('heading', { name: nomClasse, level: 1 })).toBeVisible();
    const urlClasse = ens.url();
    // Le code affiché est le seul texte de 6 caractères du groupe (la copie pour lecteur d'écran est espacée).
    const code = (await ens.getByRole('group', { name: 'Code d’invitation' }).getByText(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/).textContent())!.trim();
    expect(code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/);

    // 4. Un élève rejoint la classe (code faux, puis bon code en minuscules).
    const eleve = await ctxEleve.newPage();
    await inscrireEleve(eleve, emailEleve);
    await eleve.goto('/classes');
    await eleve.getByLabel('Code de la classe').fill('ZZZZZZ');
    await eleve.getByRole('button', { name: 'Rejoindre' }).click();
    await expect(eleve.getByRole('alert').filter({ hasText: 'Ce code ne correspond à aucune classe.' })).toBeVisible();
    await eleve.getByLabel('Code de la classe').fill(code.toLowerCase());
    await eleve.getByRole('button', { name: 'Rejoindre' }).click();
    await expect(eleve.getByRole('status').filter({ hasText: `Tu as rejoint « ${nomClasse} ».` })).toBeVisible();
    await expect(eleve.getByRole('heading', { name: nomClasse, level: 3 })).toBeVisible();

    // 5. L'élève réussit le quiz du chapitre 1.
    await eleve.goto('/cours/bph-1re-st2s/ch1');
    await eleve.getByRole('button', { name: 'Lancer le quiz' }).click();
    await expect(eleve).toHaveURL(/\/tentative\/[0-9a-f-]{36}$/);
    const tentativeId = eleve.url().split('/').pop()!;
    await repondreJuste(eleve, await bonnesReponsesAffichees(tentativeId));
    await expect(eleve.getByRole('heading', { name: /Quiz réussi/ })).toBeVisible();

    // 6. Suivi par l'enseignant, puis export CSV.
    await ens.goto(urlClasse);
    await expect(ens.getByRole('row', { name: /Léa/ }).getByText('1 / 7')).toBeVisible();
    await ens.getByRole('link', { name: /Notes et questions ratées/ }).click();
    await expect(ens).toHaveURL(/\/cours\/[0-9a-f-]{36}$/);
    const ligneNotes = ens.getByRole('row', { name: /Léa/ });
    await expect(ligneNotes.getByRole('cell', { name: /100 %/ })).toBeVisible();
    const [telechargement] = await Promise.all([
      ens.waitForEvent('download'),
      ens.getByRole('link', { name: 'Exporter les notes (CSV)' }).click(),
    ]);
    const csv = (await readFile((await telechargement.path())!, 'utf8')).replace(/^﻿/, '');
    const lignes = csv.split('\r\n').filter(Boolean);
    expect(lignes[0]).toMatch(/^Élève;Ch\. 1/);
    const ligneEleve = lignes.find((l) => l.startsWith('Léa;'));
    expect(ligneEleve?.split(';')[1]).toBe('100');

    // 7. Date limite passée : l'évaluation est fermée pour l'élève.
    await ens.goto(urlClasse);
    const echeance = ens.getByRole('form', { name: /Biologie et physiopathologie/ });
    await echeance.getByLabel('Date limite').fill(hier18h());
    await echeance.getByRole('button', { name: /Enregistrer/ }).click();
    await expect(ens.getByText('Date limite actuelle')).toBeVisible();
    await validerTousLesChapitres(emailEleve, 'bph-1re-st2s');
    await eleve.goto('/cours/bph-1re-st2s');
    await expect(eleve.getByText('La date limite est passée : c’était le')).toBeVisible();
    await eleve.goto('/cours/bph-1re-st2s/evaluation');
    await expect(eleve.getByText('La date limite est passée : c’était le')).toBeVisible();
    await expect(eleve.getByRole('button', { name: 'Commencer l’évaluation' })).toHaveCount(0);

    // 8. L'enseignant retire l'élève.
    ens.once('dialog', (d) => d.accept());
    await ens.goto(urlClasse);
    await ens.getByRole('button', { name: /Retirer Léa de la classe/ }).click();
    await expect(ens.getByText('Aucun élève pour l’instant.')).toBeVisible();
    await eleve.goto('/classes');
    await expect(eleve.getByText('Tu n’as pas encore rejoint de classe.')).toBeVisible();
  } finally {
    await Promise.all([ctxEns.close(), ctxAdmin.close(), ctxEleve.close()]);
  }
});
