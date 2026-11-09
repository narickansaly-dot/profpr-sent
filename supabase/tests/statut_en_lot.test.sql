begin;
select plan(11);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000006b1', 'admin-lot@test.local'),
  ('00000000-0000-0000-0000-0000000006b2', 'eleve-lot@test.local');
update public.profil set role = 'admin_contenu', onboarding_termine = true where id = '00000000-0000-0000-0000-0000000006b1';
update public.profil set onboarding_termine = true where id = '00000000-0000-0000-0000-0000000006b2';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000006b1', 'technologique', 'LOT', 'Filière lot');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000006b1', 'cours-lot', '10000000-0000-0000-0000-0000000006b1', '1re', 'L', 'Cours lot', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000006b1', '20000000-0000-0000-0000-0000000006b1', 'ch1', 1, 'Chapitre 1', true);
create temporary table q_lot (n int, id uuid) on commit drop;
insert into q_lot
  select n, (prive.ecrire_question('30000000-0000-0000-0000-0000000006b1', null,
    jsonb_build_object('source', 'lot:' || n, 'type', 'vrai_faux', 'enonce', 'Énoncé ' || n, 'bonnes_reponses', jsonb_build_array(true),
                       'explication', 'E', 'statut', case when n = 4 then 'brouillon' else 'a_relire' end))).id_question
  from generate_series(1, 5) n;
grant select on q_lot to authenticated;
insert into public.signalement (question_id, auteur_id, commentaire)
  select id, '00000000-0000-0000-0000-0000000006b2', 'Une erreur ici.' from q_lot where n = 5;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000006b2","role":"authenticated"}', true);
select throws_ok($$ select public.changer_statut_questions(array(select id from q_lot where n <= 2), 'valide') $$,
  'P0001', 'acces_refuse', 'réservé à l''admin');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000006b1","role":"authenticated"}', true);
select is(public.changer_statut_questions(array(select id from q_lot where n <= 2) || array(select id from q_lot where n = 1), 'valide'),
  2, 'deux questions validées, doublon ignoré');
select is((select count(*)::int from public.question q join q_lot l on l.id = q.id where l.n <= 2 and q.statut = 'valide'), 2, 'statuts appliqués');
select throws_ok($$ select public.changer_statut_questions(array(select id from q_lot where n in (3, 4)), 'valide') $$,
  'P0001', 'transition_invalide', 'brouillon vers valide refusé');
select is((select statut::text from public.question q join q_lot l on l.id = q.id where l.n = 3), 'a_relire', 'tout ou rien : la 3 reste à relire');
select is(public.changer_statut_questions(array(select id from q_lot where n = 3), 'brouillon'), 1, 'repasser en brouillon');
select is(public.changer_statut_questions('{}'::uuid[], 'valide'), 0, 'liste vide : rien');
select throws_ok($$ select public.changer_statut_questions(array(select gen_random_uuid() from generate_series(1, 201)), 'valide') $$,
  'P0001', 'trop_de_questions', 'au plus 200');
select throws_ok($$ select public.changer_statut_questions(array[gen_random_uuid()], 'valide') $$,
  'P0001', 'question_introuvable', 'question inconnue');

select public.changer_statut_questions(array(select id from q_lot where n = 5), 'valide');
select is((select q.statut::text from public.question q join q_lot l on l.id = q.id where l.n = 5), 'valide', 'question signalée validée');
reset role;
select is((select s.statut from public.signalement s join q_lot l on l.id = s.question_id where l.n = 5), 'traite', 'signalement ouvert traité');

select * from finish();
rollback;
