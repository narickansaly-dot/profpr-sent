import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/types';

process.loadEnvFile('.env.local');
// Garde « base locale » (identique à celle du script d'import) : la clé service_role ne doit jamais partir ailleurs.
let hote: string;
try {
  hote = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname;
} catch {
  throw new Error('Refusé : NEXT_PUBLIC_SUPABASE_URL est absente ou invalide (la clé service_role est utilisée).');
}
if (!['localhost', '127.0.0.1', '[::1]'].includes(hote)) {
  throw new Error('Refusé : NEXT_PUBLIC_SUPABASE_URL doit pointer vers la base locale (la clé service_role est utilisée).');
}
export const db = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

/**
 * Bonnes réponses d'une tentative, dans l'ordre d'affichage (QCM et vrai ou faux) : réservé aux tests (clé service_role).
 * Deux requêtes plutôt qu'une jointure imbriquée : question_corrige n'est pas lisible par les élèves,
 * et on évite de dépendre de la détection de relation de PostgREST.
 */
export async function bonnesReponsesAffichees(tentativeId: string): Promise<number[][]> {
  const { data: lignes, error } = await db.from('tentative_question')
    .select('ordre, question_id, permutation').eq('tentative_id', tentativeId).order('ordre');
  if (error || !lignes) throw error ?? new Error('tentative introuvable');
  const { data: corriges, error: erreurCorriges } = await db.from('question_corrige')
    .select('question_id, bonnes_reponses').in('question_id', lignes.map((l) => l.question_id));
  if (erreurCorriges || !corriges) throw erreurCorriges ?? new Error('corrigés introuvables');
  const { data: types, error: erreurTypes } = await db.from('question').select('id, type').in('id', lignes.map((l) => l.question_id));
  if (erreurTypes || !types) throw erreurTypes ?? new Error('types introuvables');
  const typeDe = new Map(types.map((t) => [t.id, t.type]));
  const parQuestion = new Map(corriges.map((c) => [c.question_id, c.bonnes_reponses as (number | boolean)[]]));
  return lignes.map((ligne) => {
    const bonnes = parQuestion.get(ligne.question_id);
    if (!bonnes) throw new Error(`corrigé manquant pour ${ligne.question_id}`);
    // Vrai ou faux : « Vrai » est affiché en premier (indice 0), « Faux » en second, sans permutation.
    if (typeDe.get(ligne.question_id) === 'vrai_faux') return [bonnes[0] === true ? 0 : 1];
    return (bonnes as number[]).map((origine) => ligne.permutation.indexOf(origine));
  });
}

export async function validerTousLesChapitres(email: string, coursSlug: string) {
  const eleveId = await idProfil(email);
  const { data: cours } = await db.from('cours').select('chapitre(id)').eq('slug', coursSlug).single();
  if (!cours) throw new Error('cours introuvable');
  const lignes = cours.chapitre.map((c) => ({ eleve_id: eleveId, chapitre_id: c.id, meilleure_note: 100, valide: true }));
  const { error } = await db.from('progression_chapitre').upsert(lignes);
  if (error) throw error;
}

export async function idProfil(email: string): Promise<string> {
  const { data, error } = await db.from('profil').select('id').eq('email', email).single();
  if (error || !data) throw error ?? new Error(`profil introuvable : ${email}`);
  return data.id;
}

/** Passe le profil à admin_contenu (réservé aux tests : clé service_role, base locale uniquement). */
export async function rendreAdmin(email: string) {
  const { error } = await db.from('profil').update({ role: 'admin_contenu' }).eq('email', email);
  if (error) throw error;
}

/** Passe le profil à enseignant, comme après la validation d'une demande par l'admin (réservé aux tests). */
export async function rendreEnseignant(email: string) {
  const { error } = await db.from('profil').update({ role: 'enseignant', onboarding_termine: true, etablissement: 'Lycée de test' }).eq('email', email);
  if (error) throw error;
}

/** Questions d'une tentative, dans l'ordre d'affichage, avec leur type (réservé aux tests). */
export async function questionsDeTentative(tentativeId: string): Promise<{ id: string; type: string; propositions: string[] }[]> {
  const { data: lignes, error } = await db.from('tentative_question')
    .select('ordre, question_id').eq('tentative_id', tentativeId).order('ordre');
  if (error || !lignes) throw error ?? new Error('tentative introuvable');
  const { data: questions, error: erreurQuestions } = await db.from('question')
    .select('id, type, propositions').in('id', lignes.map((l) => l.question_id));
  if (erreurQuestions || !questions) throw erreurQuestions ?? new Error('questions introuvables');
  const parId = new Map(questions.map((q) => [q.id, q]));
  return lignes.map((l) => {
    const q = parId.get(l.question_id);
    if (!q) throw new Error(`question manquante : ${l.question_id}`);
    return { id: q.id, type: q.type, propositions: q.propositions as string[] };
  });
}

const ilYa = (jours: number) => new Date(Date.now() - jours * 86_400_000).toISOString();

/** Recule la date d'inscription d'un compte (réservé aux tests) : sert à sortir de l'essai de 7 jours. */
export async function vieillirInscription(email: string, jours: number) {
  const { error } = await db.from('profil').update({ inscrit_le: ilYa(jours) }).eq('email', email);
  if (error) throw error;
}

/** Recule la date de la demande de suppression d'un compte (réservé aux tests). */
export async function vieillirDemandeSuppression(email: string, jours: number) {
  const { error } = await db.from('profil').update({ suppression_demandee_le: ilYa(jours) }).eq('email', email);
  if (error) throw error;
}

/**
 * Publie un second cours de la même filière et du même niveau que le cours BPH, avec un chapitre (réservé aux tests).
 * Slug « e2e-… » : le nettoyage global le supprime. Sert à vérifier qu'un cours non choisi reste fermé.
 */
export async function creerCoursPublie(slug: string): Promise<{ id: string; slug: string; titre: string }> {
  if (!slug.startsWith('e2e-')) throw new Error('le slug d’un cours de test commence par « e2e- »');
  const { data: modele, error: erreurModele } = await db.from('cours').select('filiere_id, niveau_code').eq('slug', 'bph-1re-st2s').single();
  if (erreurModele || !modele) throw erreurModele ?? new Error('cours BPH introuvable');
  const titre = `Cours e2e ${slug}`;
  const { data: cours, error } = await db.from('cours')
    .insert({ slug, filiere_id: modele.filiere_id, niveau_code: modele.niveau_code, matiere: 'Test e2e', titre, couleur: '#0f766e', publie: true })
    .select('id').single();
  if (error || !cours) throw error ?? new Error('cours non créé');
  const { error: erreurChapitre } = await db.from('chapitre')
    .insert({ cours_id: cours.id, slug: 'ch1', numero: 1, titre: 'Chapitre de test', sections: [{ id: 'intro', titre: 'Introduction', html: '<p>Section de test.</p>' }], publie: true });
  if (erreurChapitre) throw erreurChapitre;
  return { id: cours.id, slug, titre };
}

/** Confirme l'adresse e-mail d'un compte par l'API admin (réservé aux tests : sert si la confirmation est activée en local). */
export async function confirmerEmail(email: string) {
  const id = await idProfil(email);
  const { error } = await db.auth.admin.updateUserById(id, { email_confirm: true });
  if (error) throw error;
}

/** Crée ou met à jour l'abonnement d'un élève, sans passer par Stripe (réservé aux tests : clé service_role, base locale). */
export async function simulerAbonnement(email: string, statut: 'actif' | 'impaye' | 'resilie' | 'expire', finPeriode: Date, finGrace?: Date) {
  const eleveId = await idProfil(email);
  const { error } = await db.from('abonnement').upsert({
    eleve_id: eleveId, formule: 'mensuelle', statut,
    fin_periode: finPeriode.toISOString(), fin_grace: finGrace ? finGrace.toISOString() : null,
  }, { onConflict: 'eleve_id' });
  if (error) throw error;
}

/**
 * Importe un cours de test `e2e-…` d'un chapitre avec `n` questions QCM à relire (réservé aux tests) ; renvoie l'id du chapitre.
 * Le cours reste publié : `supprimerCoursDeTest` le retire.
 */
export async function creerCoursARelire(slug: string, n = 3): Promise<string> {
  if (!slug.startsWith('e2e-')) throw new Error('le slug d’un cours de test commence par « e2e- »');
  const { error } = await db.rpc('importer_cours', {
    p_cours: {
      slug, filiere: 'ST2S', niveau: '1re', matiere: 'Test e2e', titre: `Cours e2e ${slug}`, couleur: '#0f766e',
      chapitres: [{
        slug: 'ch1', numero: 1, titre: 'Chapitre de relecture', objectifs: [],
        sections: [{ id: 'intro', titre: 'Introduction', html: '<p>Section de test.</p>' }],
        questions: Array.from({ length: n }, (_, i) => ({
          source: `${slug}:${i + 1}`, type: 'qcm_unique', statut: 'a_relire', difficulte: 2, explication: `Explication ${i + 1}.`,
          enonce: `Question de relecture n° ${i + 1} : quelle est la bonne réponse ?`,
          propositions: [`Bonne réponse ${i + 1}.`, `Mauvaise réponse ${i + 1}a.`, `Mauvaise réponse ${i + 1}b.`], bonnes_reponses: [0],
        })),
      }],
    },
    p_publier: false,
  });
  if (error) throw error;
  const { data, error: erreurLecture } = await db.from('cours').select('chapitre(id)').eq('slug', slug).single();
  if (erreurLecture || !data) throw erreurLecture ?? new Error('cours introuvable');
  return data.chapitre[0].id;
}

/** Supprime un cours de test sans résultat d'élève (les versions se référencent entre elles : on les détache d'abord). */
export async function supprimerCoursDeTest(slug: string) {
  const { data } = await db.from('cours').select('id, chapitre(id)').eq('slug', slug).maybeSingle();
  if (!data) return;
  const chapitres = data.chapitre.map((c) => c.id);
  if (chapitres.length > 0) await db.from('question').update({ version_de: null }).in('chapitre_id', chapitres);
  await db.from('cours').delete().eq('id', data.id);
}
