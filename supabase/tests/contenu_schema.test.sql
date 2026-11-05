begin;
select plan(26);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin-schema@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', 'eleve-schema@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000a1';

select has_column('public', 'question', 'version_de', 'question.version_de existe');
select has_column('public', 'chapitre', 'modifie_le', 'chapitre.modifie_le existe');
select has_column('public', 'cours', 'modifie_le', 'cours.modifie_le existe');
select has_table('public', 'signalement', 'la table signalement existe');
select ok('archivee' = any (enum_range(null::public.statut_question_t)::text[]), 'statut archivee disponible');

-- Données propres au test (le test ne dépend pas de l'import de BPH).
insert into public.cours (id, slug, matiere, titre) values
  ('00000000-0000-0000-0000-00000000c501', 'test-schema', 'Test', 'Cours schéma');
insert into public.chapitre (id, cours_id, slug, numero, titre) values
  ('00000000-0000-0000-0000-00000000c511', '00000000-0000-0000-0000-00000000c501', 'ch-schema', 1, 'Chapitre');
insert into public.question (id, chapitre_id, type, enonce) values
  ('00000000-0000-0000-0000-00000000c521', '00000000-0000-0000-0000-00000000c511', 'vrai_faux', 'Q schéma');

-- Contraintes.
select throws_ok($$ update public.cours set couleur = 'rouge' where slug = 'test-schema' $$,
  '23514', null, 'couleur de cours invalide refusée');
select throws_ok($$ update public.cours set slug = 'Pas Bon' where slug = 'test-schema' $$,
  '23514', null, 'slug de cours invalide refusé');
select throws_ok($$ update public.chapitre set slug = 'Pas Bon' where slug = 'ch-schema' $$,
  '23514', null, 'slug de chapitre invalide refusé');
select throws_ok($$ update public.chapitre set sections = '{}'::jsonb where slug = 'ch-schema' $$,
  '23514', null, 'sections : un objet est refusé');
select throws_ok($$ insert into public.signalement (question_id, auteur_id, commentaire)
  values ('00000000-0000-0000-0000-00000000c521', '00000000-0000-0000-0000-0000000000a1', 'abcd') $$,
  '23514', null, 'signalement : commentaire trop court refusé');
select throws_ok($$ insert into public.signalement (question_id, auteur_id, commentaire, statut)
  values ('00000000-0000-0000-0000-00000000c521', '00000000-0000-0000-0000-0000000000a1', 'abcdef', 'autre') $$,
  '23514', null, 'signalement : statut inconnu refusé');

-- modifie_le avance à chaque mise à jour, sur les trois tables.
update public.cours set modifie_le = '2000-01-01' where slug = 'test-schema';
update public.cours set titre = titre where slug = 'test-schema';
select ok((select modifie_le > '2000-01-02' from public.cours where slug = 'test-schema'), 'trigger modifie_le sur cours');
update public.chapitre set modifie_le = '2000-01-01' where slug = 'ch-schema';
update public.chapitre set titre = titre where slug = 'ch-schema';
select ok((select modifie_le > '2000-01-02' from public.chapitre where slug = 'ch-schema'), 'trigger modifie_le sur chapitre');
update public.question set modifie_le = '2000-01-01' where id = '00000000-0000-0000-0000-00000000c521';
update public.question set enonce = enonce where id = '00000000-0000-0000-0000-00000000c521';
select ok((select modifie_le > '2000-01-02' from public.question where id = '00000000-0000-0000-0000-00000000c521'),
  'trigger modifie_le sur question');

-- Aucune politique d'écriture ne reste (le refus ne repose pas seulement sur les droits retirés).
select is_empty($$ select polname from pg_policy where polrelid = 'public.signalement'::regclass $$,
  'signalement : aucune politique');
select is_empty($$ select tablename, policyname from pg_policies where schemaname = 'public'
  and tablename in ('filiere', 'cours', 'chapitre', 'notion', 'question', 'question_corrige') and cmd <> 'SELECT' $$,
  'contenu : aucune politique autre que la lecture');

-- Plus aucune écriture directe, même pour l'admin.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select throws_ok($$ update public.chapitre set titre = 'x' $$, '42501', null, 'admin : update direct de chapitre refusé');
select throws_ok($$ insert into public.question (chapitre_id, type, enonce) select id, 'vrai_faux', 'x' from public.chapitre limit 1 $$,
  '42501', null, 'admin : insert direct de question refusé');
select throws_ok($$ delete from public.question_corrige $$, '42501', null, 'admin : delete direct de corrigé refusé');
select throws_ok($$ insert into public.signalement (question_id, auteur_id, commentaire) values (gen_random_uuid(), auth.uid(), 'abcdef') $$,
  '42501', null, 'signalement : pas d''insert direct');
select throws_ok($$ select count(*) from public.signalement $$, '42501', null, 'signalement : aucune lecture directe');
select throws_ok($$ insert into public.filiere (code, nom) values ('ZZ', 'Test') $$, '42501', null,
  'admin : insert direct de filière refusé');
select throws_ok($$ update public.cours set titre = 'x' $$, '42501', null, 'admin : update direct de cours refusé');
select throws_ok($$ insert into public.notion (chapitre_id, nom) values ('00000000-0000-0000-0000-00000000c511', 'n') $$,
  '42501', null, 'admin : insert direct de notion refusé');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);
select throws_ok($$ update public.cours set titre = 'x' $$, '42501', null, 'élève : update direct de cours refusé');
reset role;
set local role anon;
select throws_ok($$ select count(*) from public.signalement $$, '42501', null, 'anon : aucune lecture de signalement');

select * from finish();
rollback;
