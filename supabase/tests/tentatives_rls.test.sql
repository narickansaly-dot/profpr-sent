begin;
select plan(9);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'a@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', 'b@test.local');
insert into public.filiere (id, voie, code, nom) values
  ('10000000-0000-0000-0000-0000000000a1', 'technologique', 'TRS', 'Filière tentatives');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000a1', 'cours-tentatives', '10000000-0000-0000-0000-0000000000a1', '1re', 'T', 'T', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'ch1', 1, 'Ch', true);
insert into public.question (id, chapitre_id, type, enonce, propositions, statut) values
  ('40000000-0000-0000-0000-0000000000a1', '30000000-0000-0000-0000-0000000000a1', 'qcm_unique', 'Q', '["a","b"]', 'valide');
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions) values
  ('60000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a1', 'quiz_chapitre', '20000000-0000-0000-0000-0000000000a1', '30000000-0000-0000-0000-0000000000a1', 1),
  ('60000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-0000000000a2', 'quiz_chapitre', '20000000-0000-0000-0000-0000000000a1', '30000000-0000-0000-0000-0000000000a1', 1);
insert into public.tentative_question (tentative_id, ordre, question_id, permutation) values
  ('60000000-0000-0000-0000-0000000000a1', 1, '40000000-0000-0000-0000-0000000000a1', '{1,0}'),
  ('60000000-0000-0000-0000-0000000000a2', 1, '40000000-0000-0000-0000-0000000000a1', '{0,1}');
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide) values
  ('00000000-0000-0000-0000-0000000000a2', '30000000-0000-0000-0000-0000000000a1', 80, true);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select is((select count(*)::int from public.tentative), 1, 'élève : ne voit que ses tentatives');
select is((select count(*)::int from public.tentative_question), 1, 'élève : ne voit que les questions de ses tentatives');
select is((select count(*)::int from public.progression_chapitre), 0, 'élève : ne voit pas la progression des autres');
select throws_ok($$ insert into public.tentative (eleve_id, type, cours_id, chapitre_id, nb_questions)
  values ('00000000-0000-0000-0000-0000000000a1', 'quiz_chapitre', '20000000-0000-0000-0000-0000000000a1', '30000000-0000-0000-0000-0000000000a1', 1) $$,
  '42501', null, 'élève : ne crée pas de tentative à la main');
select throws_ok($$ update public.tentative_question set correcte = true $$, '42501', null, 'élève : ne se corrige pas lui-même');
select throws_ok($$ update public.tentative set note = 100 $$, '42501', null, 'élève : ne modifie pas sa note');
select throws_ok($$ insert into public.progression_chapitre (eleve_id, chapitre_id, valide)
  values ('00000000-0000-0000-0000-0000000000a1', '30000000-0000-0000-0000-0000000000a1', true) $$,
  '42501', null, 'élève : ne valide pas un chapitre à la main');

reset role;
set local role anon;
select set_config('request.jwt.claims', '{}', true);
select throws_ok($$ select count(*) from public.tentative $$, '42501', null, 'anonyme : aucun accès aux tentatives');
select throws_ok($$ select count(*) from public.historique_question $$, '42501', null, 'anonyme : aucun accès à l''historique');

select * from finish();
rollback;
