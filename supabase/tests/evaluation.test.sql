begin;
select plan(16);

insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000000d1', 'eval@test.local');
insert into public.filiere (id, voie, code, nom) values
  ('10000000-0000-0000-0000-0000000000d1', 'technologique', 'EVL', 'Filière évaluation');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000d1', 'cours-eval', '10000000-0000-0000-0000-0000000000d1', '1re', 'E', 'E', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000d1', '20000000-0000-0000-0000-0000000000d1', 'ch1', 1, 'A', true),
  ('30000000-0000-0000-0000-0000000000d2', '20000000-0000-0000-0000-0000000000d1', 'ch2', 2, 'B', true),
  ('30000000-0000-0000-0000-0000000000d3', '20000000-0000-0000-0000-0000000000d1', 'ch3', 3, 'Brouillon', false);
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select ch, 'qcm_unique', 'Q', '["bon","faux"]', 'valide', 'eval:' || ch || ':' || i
  from unnest(array['30000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000d2',
                    '30000000-0000-0000-0000-0000000000d3']::uuid[]) ch, generate_series(1, 25) i;
insert into public.question_corrige (question_id, bonnes_reponses)
  select id, '[0]' from public.question where source like 'eval:%';

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);

select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1') $$, 'P0001', 'evaluation_verrouillee', 'verrouillée tant que les chapitres ne sont pas validés');

reset role;
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide) values
  ('00000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000d1', 80, true),
  ('00000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000d2', 90, true);
create temporary table e as select null::uuid as id;
grant all on e to authenticated;
set local role authenticated;

update e set id = public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1');
select is((select nb_questions::int from public.tentative where id = (select id from e)), 40, '40 questions');
select is((select count(*)::int from public.tentative_question tq join public.question q on q.id = tq.question_id
  where tq.tentative_id = (select id from e) and q.chapitre_id = '30000000-0000-0000-0000-0000000000d1'), 20, 'réparties : 20 du chapitre 1');
select is((select count(*)::int from public.tentative_question tq join public.question q on q.id = tq.question_id
  where tq.tentative_id = (select id from e) and q.chapitre_id = '30000000-0000-0000-0000-0000000000d3'), 0, 'aucune question d''un chapitre brouillon');
select ok((select date_limite between now() + interval '59 minutes' and now() + interval '61 minutes'
  from public.tentative where id = (select id from e)), 'date limite à 60 minutes');
select is(public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1'), (select id from e), 'reprise de l''évaluation en cours');

-- Répondre juste à 30 questions, puis dépasser le temps : clôture « expiree », corrigée avec les réponses données.
do $$ begin
  perform public.repondre(tq.tentative_id, tq.question_id, jsonb_build_array(array_position(tq.permutation, 0::smallint) - 1))
    from public.tentative_question tq where tq.tentative_id = (select id from e) and tq.ordre <= 30;
end $$;
reset role;
update public.tentative set date_limite = now() - interval '1 minute' where id = (select id from e);
set local role authenticated;
select is(public.repondre(tq.tentative_id, tq.question_id, '[0]'), 'temps_ecoule', 'réponse refusée après la limite')
  from public.tentative_question tq where tq.tentative_id = (select id from e) and tq.ordre = 31;
select is((select statut::text from public.tentative where id = (select id from e)), 'expiree', 'évaluation expirée');
select is((select note from public.tentative where id = (select id from e)), 75.00::numeric, 'corrigée avec les réponses données (30/40)');
select is((select valide from public.progression_cours where cours_id = '20000000-0000-0000-0000-0000000000d1'), true, 'cours validé');

select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1') $$, 'P0001', 'delai_attente', '24 heures entre deux essais');

-- Deuxième et troisième essais après le délai, puis plus d'essai.
reset role;
update public.tentative set fin = now() - interval '25 hours' where eleve_id = '00000000-0000-0000-0000-0000000000d1';
set local role authenticated;
select lives_ok($$ select public.terminer_tentative(public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1')) $$, 'deuxième essai');
reset role;
update public.tentative set fin = now() - interval '25 hours' where eleve_id = '00000000-0000-0000-0000-0000000000d1';
set local role authenticated;
select lives_ok($$ select public.terminer_tentative(public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1')) $$, 'troisième essai');
reset role;
update public.tentative set fin = now() - interval '25 hours' where eleve_id = '00000000-0000-0000-0000-0000000000d1';
set local role authenticated;
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1') $$, 'P0001', 'essais_epuises', 'trois essais maximum');
select is((select essais::int from public.progression_cours where cours_id = '20000000-0000-0000-0000-0000000000d1'), 3, 'trois essais comptés');
select is((select meilleure_note from public.progression_cours where cours_id = '20000000-0000-0000-0000-0000000000d1'), 75.00::numeric, 'meilleure note conservée');

select * from finish();
rollback;
