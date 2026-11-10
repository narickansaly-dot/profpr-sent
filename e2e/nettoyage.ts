import { createClient } from '@supabase/supabase-js';

/** Supprime les comptes créés par les tests (adresse en @test.local). */
export default async function nettoyage() {
  process.loadEnvFile('.env.local');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  let hote: string;
  try {
    hote = new URL(url).hostname;
  } catch {
    throw new Error('Refusé : NEXT_PUBLIC_SUPABASE_URL est absente ou invalide (la clé service_role est utilisée).');
  }
  if (!['localhost', '127.0.0.1', '[::1]'].includes(hote)) {
    throw new Error('Refusé : NEXT_PUBLIC_SUPABASE_URL doit pointer vers la base locale (la clé service_role est utilisée).');
  }
  const db = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const ids: string[] = [];
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    for (const u of data.users) if (u.email?.endsWith('@test.local')) ids.push(u.id);
    if (data.users.length < 200) break;
  }
  for (const id of ids) {
    const { error } = await db.auth.admin.deleteUser(id);
    if (error) throw error;
  }
  // Cours de test du parcours de contenu (slug « e2e-… ») : dépubliés par le test s'ils avaient des résultats,
  // supprimés ici une fois les comptes de test (et donc leurs tentatives) effacés.
  const { data: cours, error: erreurCours } = await db.from('cours').select('id, chapitre(id)').like('slug', 'e2e-%');
  if (erreurCours) throw erreurCours;
  for (const c of cours ?? []) {
    const chapitres = (c.chapitre as { id: string }[]).map((ch) => ch.id);
    if (chapitres.length > 0) await db.from('question').update({ version_de: null }).in('chapitre_id', chapitres);
    const { error } = await db.from('cours').delete().eq('id', c.id);
    if (error) console.warn(`Cours de test ${c.id} non supprimé : ${error.message}`);
  }
}
