begin;
select plan(25);

-- Effacement complet et hygiène des droits (audit I2, M2, M4, M5).
-- d11 : suppression demandée il y a 31 jours (purgé). d12 : actif. d13 : suppression demandée il y a 29 jours (reste).
-- d14 : seul administrateur, suppression demandée il y a 31 jours (conservé par la règle du dernier administrateur).
-- d21 : demande d'accord vieille de 35 jours, jamais donnée. d22 : demande de 10 jours. d23 : 35 jours, accord donné.
-- d24 : 35 jours, accord donné puis retiré.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000d11', 'eff-purge@test.local'),
  ('00000000-0000-0000-0000-000000000d12', 'eff-actif@test.local'),
  ('00000000-0000-0000-0000-000000000d13', 'eff-attente@test.local'),
  ('00000000-0000-0000-0000-000000000d14', 'eff-admin@test.local'),
  ('00000000-0000-0000-0000-000000000d15', 'eff-parent@test.local'),
  ('00000000-0000-0000-0000-000000000d21', 'eff-vieille@test.local'),
  ('00000000-0000-0000-0000-000000000d22', 'eff-recente@test.local'),
  ('00000000-0000-0000-0000-000000000d23', 'eff-donne@test.local'),
  ('00000000-0000-0000-0000-000000000d24', 'eff-retire@test.local');
-- Les autres administrateurs de la base locale sont mis « en suppression » dans cette transaction.
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-000000000d14';
update public.profil set role = 'parent', onboarding_termine = true where id = '00000000-0000-0000-0000-000000000d15';
update public.profil set suppression_demandee_le = now() where role = 'admin_contenu' and id <> '00000000-0000-0000-0000-000000000d14';
update public.profil set suppression_demandee_le = now() - interval '31 days'
 where id in ('00000000-0000-0000-0000-000000000d11', '00000000-0000-0000-0000-000000000d14');
update public.profil set suppression_demandee_le = now() - interval '29 days' where id = '00000000-0000-0000-0000-000000000d13';
update public.profil set onboarding_termine = true, moins_de_15_ans = true
 where id in ('00000000-0000-0000-0000-000000000d21', '00000000-0000-0000-0000-000000000d22',
              '00000000-0000-0000-0000-000000000d23', '00000000-0000-0000-0000-000000000d24');

-- M5 : la colonne accepte l'absence d'adresse, et la contrainte de longueur ne vaut que si l'adresse est renseignée.
select is((select is_nullable from information_schema.columns
            where table_schema = 'public' and table_name = 'consentement_parental' and column_name = 'email_parent'),
  'YES', 'email_parent peut être nul');
select throws_ok($$ insert into public.consentement_parental (eleve_id, email_parent)
  values ('00000000-0000-0000-0000-000000000d12', 'a') $$, '23514', null, 'une adresse renseignée trop courte reste refusée');
insert into public.consentement_parental (eleve_id, email_parent, demande_le, dernier_envoi_le, donne_le, retire_le) values
  ('00000000-0000-0000-0000-000000000d21', 'parent-vieux@test.local', now() - interval '35 days', now() - interval '35 days', null, null),
  ('00000000-0000-0000-0000-000000000d22', 'parent-recent@test.local', now() - interval '10 days', now() - interval '10 days', null, null),
  ('00000000-0000-0000-0000-000000000d23', 'parent-donne@test.local', now() - interval '35 days', now() - interval '35 days', now() - interval '34 days', null),
  ('00000000-0000-0000-0000-000000000d24', 'parent-retire@test.local', now() - interval '35 days', now() - interval '35 days', now() - interval '34 days', now() - interval '3 days');

-- I2 : lignes du journal d'Auth. Les actions sont préfixées « eff_ » pour les compter sans toucher aux autres lignes.
insert into auth.audit_log_entries (id, payload, created_at, ip_address) values
  ('a0000000-0000-0000-0000-0000000000a1', '{"action":"eff_login","actor_id":"00000000-0000-0000-0000-000000000d11"}', now() - interval '2 days', '1.1.1.1'),
  ('a0000000-0000-0000-0000-0000000000a2', '{"action":"eff_admin","actor_id":"00000000-0000-0000-0000-000000000d12","traits":{"user_id":"00000000-0000-0000-0000-000000000d11"}}', now() - interval '2 days', '1.1.1.1'),
  ('a0000000-0000-0000-0000-0000000000a3', '{"action":"eff_login","actor_id":"00000000-0000-0000-0000-000000000d12"}', now() - interval '2 days', '1.1.1.1'),
  ('a0000000-0000-0000-0000-0000000000a4', '{"action":"eff_login","actor_id":"00000000-0000-0000-0000-000000000d12"}', now() - interval '120 days', '1.1.1.1'),
  ('a0000000-0000-0000-0000-0000000000a5', '{"action":"eff_login","actor_id":"00000000-0000-0000-0000-000000000d13"}', now() - interval '2 days', '1.1.1.1'),
  ('a0000000-0000-0000-0000-0000000000a6', '{"action":"eff_login","actor_id":"00000000-0000-0000-0000-000000000d14"}', now() - interval '2 days', '1.1.1.1'),
  ('a0000000-0000-0000-0000-0000000000a7', '{"action":"eff_sans_acteur"}', now() - interval '2 days', '1.1.1.1'),
  ('a0000000-0000-0000-0000-0000000000a8', '{"action":"eff_login","actor_id":"pas-un-uuid"}', now() - interval '2 days', '1.1.1.1'),
  ('a0000000-0000-0000-0000-0000000000a9', '{"action":"eff_login","actor_id":"00000000-0000-0000-0000-000000000d12"}', now() - interval '80 days', '1.1.1.1');
select is((select count(*)::int from auth.audit_log_entries where payload->>'action' like 'eff\_%'), 9, 'journal : 9 lignes avant la purge');

-- M2 : droits.
select is(has_table_privilege('authenticated', 'public.niveau', 'INSERT') or has_table_privilege('authenticated', 'public.niveau', 'UPDATE')
  or has_table_privilege('authenticated', 'public.niveau', 'DELETE'), false, 'authenticated ne peut pas écrire dans niveau');
select is(has_table_privilege('authenticated', 'public.niveau', 'SELECT'), true, 'authenticated lit toujours niveau');
select is((select count(*)::int from pg_class where relnamespace = 'public'::regnamespace and relkind in ('r', 'p') and not relrowsecurity),
  0, 'toutes les tables de public ont la sécurité par ligne');
select is((select count(*)::int from pg_default_acl d, aclexplode(d.defaclacl) a
            where d.defaclrole = 'postgres'::regrole and d.defaclnamespace = 'public'::regnamespace and d.defaclobjtype = 'r'
              and a.grantee in ('anon'::regrole, 'authenticated'::regrole)),
  0, 'les droits par défaut de postgres dans public ne donnent rien à anon ni à authenticated');
create table public.zz_defaut_droits (id int);
select is(has_table_privilege('anon', 'public.zz_defaut_droits', 'SELECT') or has_table_privilege('authenticated', 'public.zz_defaut_droits', 'SELECT')
  or has_table_privilege('authenticated', 'public.zz_defaut_droits', 'INSERT'), false, 'une table créée ensuite n''est accessible ni à anon ni à authenticated');

-- Purge.
select prive.purges_quotidiennes();

select is((select count(*)::int from auth.users where id = '00000000-0000-0000-0000-000000000d11'), 0, 'le compte à purger est supprimé');
select is((select count(*)::int from auth.users where id in ('00000000-0000-0000-0000-000000000d13', '00000000-0000-0000-0000-000000000d14')),
  2, 'un compte à 29 jours et le dernier administrateur restent');
select is((select count(*)::int from auth.audit_log_entries
            where payload->>'actor_id' = '00000000-0000-0000-0000-000000000d11'
               or payload->'traits'->>'user_id' = '00000000-0000-0000-0000-000000000d11'), 0,
  'aucune ligne du journal ne se rapporte au compte purgé (acteur ou cible)');
select is((select array_agg(id order by id) from auth.audit_log_entries where payload->>'action' like 'eff\_%'),
  array['a0000000-0000-0000-0000-0000000000a3', 'a0000000-0000-0000-0000-0000000000a5', 'a0000000-0000-0000-0000-0000000000a6',
        'a0000000-0000-0000-0000-0000000000a7', 'a0000000-0000-0000-0000-0000000000a8', 'a0000000-0000-0000-0000-0000000000a9']::uuid[],
  'journal : les lignes récentes des comptes actifs, en attente, administrateur conservé ou sans acteur restent');
select is((select count(*)::int from auth.audit_log_entries where created_at < now() - interval '90 days'), 0,
  'aucune ligne du journal de plus de 90 jours ne reste');

-- M5 : adresses.
select is((select email_parent from public.consentement_parental where eleve_id = '00000000-0000-0000-0000-000000000d21'), null,
  'demande jamais donnée de 35 jours : adresse effacée');
select is((select email_parent from public.consentement_parental where eleve_id = '00000000-0000-0000-0000-000000000d22'),
  'parent-recent@test.local', 'demande de 10 jours : adresse gardée');
select is((select email_parent from public.consentement_parental where eleve_id = '00000000-0000-0000-0000-000000000d23'),
  'parent-donne@test.local', 'accord donné : adresse gardée');
select is((select email_parent from public.consentement_parental where eleve_id = '00000000-0000-0000-0000-000000000d24'),
  'parent-retire@test.local', 'accord donné puis retiré : adresse gardée');
select is((select consentement_requis from (select prive.consentement_requis('00000000-0000-0000-0000-000000000d21') as consentement_requis) t), true,
  'l''effacement de l''adresse ne lève pas l''exigence d''accord');

-- Lecteurs d'une adresse nulle.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000d21","role":"authenticated"}', true);
select is((select email_parent from public.mon_acces()), null, 'mon_acces tolère une adresse nulle');
select is((select public.exporter_mes_donnees()->'consentement'->>'email_parent'), null, 'l''export tolère une adresse nulle');
select lives_ok($$ select public.demander_consentement('nouveau-parent@test.local') $$, 'une nouvelle demande est possible après l''effacement');
select is((select email_parent from public.mon_acces()), 'nouveau-parent@test.local', 'la nouvelle demande remet une adresse');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000d15","role":"authenticated"}', true);
select lives_ok($$ select public.lier_par_email() $$, 'lier_par_email tolère des demandes sans adresse');
reset role;

-- M4 : l'adresse du profil suit celle du compte.
update auth.users set email = 'eff-actif-nouveau@test.local' where id = '00000000-0000-0000-0000-000000000d12';
select is((select email from public.profil where id = '00000000-0000-0000-0000-000000000d12'), 'eff-actif-nouveau@test.local',
  'changer auth.users.email met à jour profil.email');
select is((select p.prosecdef and p.proconfig = array['search_path=""'] and not has_function_privilege('anon', p.oid, 'EXECUTE')
                and not has_function_privilege('authenticated', p.oid, 'EXECUTE')
             from pg_proc p where p.pronamespace = 'prive'::regnamespace and p.proname = 'recopier_email'),
  true, 'le déclencheur est security definer, search_path vide, sans exécution pour les comptes');

select * from finish();
rollback;
