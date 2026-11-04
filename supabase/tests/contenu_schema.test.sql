begin;
select plan(14);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin-schema@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', 'eleve-schema@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000a1';

select has_column('public', 'question', 'version_de', 'question.version_de existe');
select has_column('public', 'chapitre', 'modifie_le', 'chapitre.modifie_le existe');
select has_column('public', 'cours', 'modifie_le', 'cours.modifie_le existe');
select has_table('public', 'signalement', 'la table signalement existe');
select ok('archivee' = any (enum_range(null::public.statut_question_t)::text[]), 'statut archivee disponible');

-- Slug réel du cours BPH : le lire dans contenu/1re-st2s/bph.json.
select throws_ok($$ update public.cours set couleur = 'rouge' where slug = 'bph-1re-st2s' $$,
  '23514', null, 'couleur de cours invalide refusée');
select throws_ok($$ update public.chapitre set slug = 'Pas Bon' where numero = 1 $$,
  '23514', null, 'slug de chapitre invalide refusé');

-- modifie_le avance à chaque mise à jour.
update public.chapitre set modifie_le = '2000-01-01' where numero = 1;
update public.chapitre set titre = titre where numero = 1;
select ok((select bool_and(modifie_le > '2000-01-02') from public.chapitre where numero = 1), 'trigger modifie_le sur chapitre');

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
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);
select throws_ok($$ update public.cours set titre = 'x' $$, '42501', null, 'élève : update direct de cours refusé');

select * from finish();
rollback;
