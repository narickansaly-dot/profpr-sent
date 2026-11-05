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
}
