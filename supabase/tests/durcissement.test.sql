begin;
select plan(8);

insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000000e1', 'dur@test.local');
insert into public.filiere (id, voie, code, nom) values
  ('10000000-0000-0000-0000-0000000000e1', 'technologique', 'DUR', 'Filière durcissement');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000e1', 'cours-dur', '10000000-0000-0000-0000-0000000000e1', '1re', 'D', 'D', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000e1', '20000000-0000-0000-0000-0000000000e1', 'ch1', 1, '15 questions', true);
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select '30000000-0000-0000-0000-0000000000e1', 'qcm_unique', 'Q' || i, '["bon","faux"]', 'valide', 'dur:' || i
  from generate_series(1, 15) i;
insert into public.question_corrige (question_id, bonnes_reponses, explication)
  select id, '[0]', 'Parce que.' from public.question where source like 'dur:%';
create temporary table d1 (id uuid);
grant all on d1 to authenticated;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated"}', true);

insert into d1 select public.demarrer_quiz('30000000-0000-0000-0000-0000000000e1', 15);

select throws_ok($$ select permutation from public.tentative_question limit 1 $$, '42501', null, 'élève : ne lit pas permutation');
select throws_ok($$ select reponse from public.tentative_question limit 1 $$, '42501', null, 'élève : ne lit pas reponse');
select throws_ok($$ select correcte from public.tentative_question limit 1 $$, '42501', null, 'élève : ne lit pas correcte');
select is((select count(*)::int from (select tentative_id, ordre, question_id from public.tentative_question) x), 15, 'élève : lit toujours tentative_id, ordre, question_id');

select lives_ok(format($$ select public.terminer_tentative(%L) $$, (select id from d1)), 'terminer la tentative');
select throws_ok(format($$ select * from public.questions_tentative(%L) $$, (select id from d1)), 'P0001', 'tentative_terminee',
  'questions_tentative refusée sur une tentative terminée');

reset role;
select is(has_schema_privilege('authenticated', 'prive', 'usage'), false, 'authenticated : pas d''usage sur le schéma prive');
select is(has_schema_privilege('anon', 'prive', 'usage'), false, 'anon : pas d''usage sur le schéma prive');

select * from finish();
rollback;
