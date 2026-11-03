import { createClient } from '@supabase/supabase-js';

/** Supprime les comptes créés par les tests (adresse en @test.local). */
export default async function nettoyage() {
  process.loadEnvFile('.env.local');
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const aSupprimer = data.users.filter((u) => u.email?.endsWith('@test.local'));
    for (const u of aSupprimer) await db.auth.admin.deleteUser(u.id);
    if (data.users.length < 200) break;
  }
}
