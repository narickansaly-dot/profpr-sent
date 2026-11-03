begin;
select plan(28);

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
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select '30000000-0000-0000-0000-0000000000d1', 'qcm_unique', 'Q', '["bon","faux"]', 'brouillon', 'eval:brouillon:' || i
  from generate_series(1, 10) i;
insert into public.question_corrige (question_id, bonnes_reponses)
  select id, '[0]' from public.question where source like 'eval:%';
update public.profil set inscrit_le = now() where id = '00000000-0000-0000-0000-0000000000d1';
create temporary table qz as select null::uuid as id;
grant all on qz to authenticated;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);

select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1') $$, 'P0001', 'evaluation_verrouillee', 'verrouillée tant que les chapitres ne sont pas validés');

-- Un quiz de chapitre clos avant l'évaluation : sa correction sera fermée pendant l'évaluation.
update qz set id = public.demarrer_quiz('30000000-0000-0000-0000-0000000000d1', 15);
select public.terminer_tentative((select id from qz));

reset role;
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide) values
  ('00000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000d1', 80, true),
  ('00000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000d2', 90, true)
on conflict (eleve_id, chapitre_id) do update set meilleure_note = excluded.meilleure_note, valide = excluded.valide;
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
select is((select count(*)::int from public.tentative_question tq join public.question q on q.id = tq.question_id
  where tq.tentative_id = (select id from e) and q.statut <> 'valide'), 0, 'aucune question non validée tirée');
select throws_ok($$ select public.demarrer_quiz('30000000-0000-0000-0000-0000000000d1', 15) $$, 'P0001', 'evaluation_en_cours',
  'quiz de chapitre fermé pendant l''évaluation');
select throws_ok($$ select * from public.correction_tentative((select id from qz)) $$, 'P0001', 'evaluation_en_cours',
  'correction d''un ancien quiz fermée pendant l''évaluation');

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
select ok((select count(*) from public.correction_tentative((select id from qz))) >= 15, 'correction du quiz de nouveau lisible une fois l''évaluation close');
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

-- Élèves supplémentaires : d2 et d3 ont chacun une évaluation expirée depuis 3 jours ; d4 n'est plus en essai.
reset role;
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000d2', 'eval2@test.local'),
  ('00000000-0000-0000-0000-0000000000d3', 'eval3@test.local'),
  ('00000000-0000-0000-0000-0000000000d4', 'eval4@test.local');
update public.profil set inscrit_le = now() where id in
  ('00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000d3');
update public.profil set inscrit_le = now() - interval '10 days' where id = '00000000-0000-0000-0000-0000000000d4';
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide)
  select u, c, 80, true
  from unnest(array['00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000d3']::uuid[]) u,
       unnest(array['30000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000d2']::uuid[]) c;
create temporary table e2 as select null::uuid as id;
create temporary table e3 as select null::uuid as id;
grant all on e2, e3 to authenticated;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d2","role":"authenticated"}', true);
update e2 set id = public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d3","role":"authenticated"}', true);
update e3 set id = public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1');
reset role;
update public.tentative set date_limite = now() - interval '3 days' where id in ((select id from e2), (select id from e3));

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d2","role":"authenticated"}', true);
select is(public.cloturer_mes_tentatives_expirees(), 1, 'clôture l''évaluation expirée de l''élève');
reset role;
select is((select statut::text from public.tentative where id = (select id from e3)), 'en_cours', 'l''évaluation expirée d''un autre élève reste ouverte');
select ok((select fin = date_limite from public.tentative where id = (select id from e2)), 'fin = date limite, pas l''heure de clôture');
set local role authenticated;
select lives_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1') $$, 'nouvel essai non bloqué par le délai d''attente');
select throws_ok($$ select * from public.correction_tentative((select id from e2)) $$, 'P0001', 'evaluation_en_cours',
  'correction d''une ancienne évaluation fermée pendant la nouvelle');
select public.terminer_tentative(id) from public.tentative
  where eleve_id = '00000000-0000-0000-0000-0000000000d2' and statut = 'en_cours';
select ok((select count(*) from public.correction_tentative((select id from e2))) = 40,
  'ancienne évaluation de nouveau lisible une fois la nouvelle close');

-- Cours publié sans question validée.
reset role;
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000d2', 'cours-vide', '10000000-0000-0000-0000-0000000000d1', '1re', 'V', 'V', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000d4', '20000000-0000-0000-0000-0000000000d2', 'vide', 1, 'Vide', true);
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide)
  values ('00000000-0000-0000-0000-0000000000d2', '30000000-0000-0000-0000-0000000000d4', 80, true);
set local role authenticated;
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d2') $$, 'P0001', 'quiz_indisponible', 'cours sans question validée');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d4","role":"authenticated"}', true);
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000d1') $$, 'P0001', 'acces_refuse', 'essai gratuit terminé : accès refusé');

select * from finish();
rollback;
