begin;
select plan(21);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000c1', 'quiz@test.local'),
  ('00000000-0000-0000-0000-0000000000c2', 'autre@test.local');
insert into public.filiere (id, voie, code, nom) values
  ('10000000-0000-0000-0000-0000000000c1', 'technologique', 'QZC', 'Filière quiz');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000c1', 'cours-quiz', '10000000-0000-0000-0000-0000000000c1', '1re', 'Q', 'Q', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1', 'ch1', 1, '16 questions', true),
  ('30000000-0000-0000-0000-0000000000c2', '20000000-0000-0000-0000-0000000000c1', 'ch2', 2, '10 questions', true);
-- 16 questions validées (bonne réponse d'origine : 0) dans ch1, 10 dans ch2
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select '30000000-0000-0000-0000-0000000000c1', 'qcm_unique', 'Q' || i, '["bon","faux"]', 'valide', 'quiz:c1:' || i
  from generate_series(1, 16) i;
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select '30000000-0000-0000-0000-0000000000c2', 'qcm_unique', 'R' || i, '["bon","faux"]', 'valide', 'quiz:c2:' || i
  from generate_series(1, 10) i;
insert into public.question_corrige (question_id, bonnes_reponses, explication)
  select id, '[0]', 'Parce que.' from public.question where source like 'quiz:c%';

-- Tables temporaires créées par postgres, remplies sous l'identité de l'élève.
create temporary table t1 (id uuid);
create temporary table t2 (id uuid);
grant all on t1, t2 to authenticated;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);

select throws_ok($$ select public.demarrer_quiz('30000000-0000-0000-0000-0000000000c1', 17) $$, 'P0001', 'longueur_invalide', 'longueur hors 15/20/30 refusée');
select throws_ok($$ select public.demarrer_quiz('30000000-0000-0000-0000-0000000000c2', 15) $$, 'P0001', 'quiz_indisponible', 'moins de 15 questions validées');

insert into t1 select public.demarrer_quiz('30000000-0000-0000-0000-0000000000c1', 20);
select is((select nb_questions::int from public.tentative where id = (select id from t1)), 16, 'demander 20 donne les 16 disponibles');
select is((select count(distinct question_id)::int from public.tentative_question where tentative_id = (select id from t1)), 16, '16 questions distinctes');
select is((select count(*)::int from public.questions_tentative((select id from t1))), 16, 'questions_tentative renvoie 16 lignes');
select ok((select bool_and(jsonb_array_length(propositions) = 2 and reponse is null) from public.questions_tentative((select id from t1))), 'propositions affichées, aucune réponse');
select is((select count(*)::int from public.question_corrige), 0, 'toujours aucun corrigé lisible directement');

-- Répondre juste à 12 questions sur 16 (75 %) ; la bonne réponse affichée se déduit de la permutation.
-- Les appels en masse passent par des blocs do : un select imprimerait des lignes « ok » qui perturbent la sortie TAP.
select is(public.repondre(tq.tentative_id, tq.question_id, jsonb_build_array(array_position(tq.permutation, 0::smallint) - 1)), 'ok', 'repondre renvoie ok')
  from public.tentative_question tq where tq.tentative_id = (select id from t1) and tq.ordre = 1;
do $$ begin
  perform public.repondre(tq.tentative_id, tq.question_id, jsonb_build_array(array_position(tq.permutation, 0::smallint) - 1))
    from public.tentative_question tq where tq.tentative_id = (select id from t1) and tq.ordre between 2 and 12;
  perform public.repondre(tq.tentative_id, tq.question_id, jsonb_build_array(array_position(tq.permutation, 1::smallint) - 1))
    from public.tentative_question tq where tq.tentative_id = (select id from t1) and tq.ordre between 13 and 16;
end $$;
select throws_ok(format($$ select public.repondre(%L, %L, '[5]') $$, (select id from t1),
  (select question_id from public.tentative_question where tentative_id = (select id from t1) and ordre = 1)),
  'P0001', 'reponse_invalide', 'indice hors des propositions refusé');
select throws_ok(format($$ select * from public.correction_tentative(%L) $$, (select id from t1)),
  'P0001', 'tentative_en_cours', 'pas de correction avant la fin');

select lives_ok(format($$ select public.terminer_tentative(%L) $$, (select id from t1)), 'terminer la tentative');
select is((select note from public.tentative where id = (select id from t1)), 75.00::numeric, 'note de 75 %');
select is((select reussie from public.tentative where id = (select id from t1)), true, '75 % : réussi');
select is((select valide from public.progression_chapitre where chapitre_id = '30000000-0000-0000-0000-0000000000c1'), true, 'chapitre validé');
select is((select sum(ratee)::int from public.historique_question), 4, 'historique : 4 questions ratées');
select is(public.repondre(tq.tentative_id, tq.question_id, '[0]'), 'terminee', 'répondre après la fin renvoie terminee')
  from public.tentative_question tq where tq.tentative_id = (select id from t1) and tq.ordre = 1;
select is((select count(*)::int from public.correction_tentative((select id from t1)) where explication = 'Parce que.' and bonnes_reponses is not null), 16, 'correction complète après la fin');

-- Le quiz suivant reprend en priorité les 4 questions ratées (plus aucune n'est jamais vue).
insert into t2 select public.demarrer_quiz('30000000-0000-0000-0000-0000000000c1', 15);
select is((select count(*)::int from public.tentative_question tq join public.historique_question h on h.question_id = tq.question_id
  where tq.tentative_id = (select id from t2) and h.ratee > 0), 4, 'les questions ratées sont reprises en priorité');

select lives_ok($$ select public.marquer_chapitre_lu('30000000-0000-0000-0000-0000000000c2') $$, 'marquer un chapitre lu');
select is((select lu from public.progression_chapitre where chapitre_id = '30000000-0000-0000-0000-0000000000c2'), true, 'chapitre marqué lu');

-- Un autre élève ne peut pas lire ni répondre à la tentative
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c2","role":"authenticated"}', true);
select throws_ok(format($$ select * from public.questions_tentative(%L) $$, (select id from t1)), 'P0001', 'tentative_introuvable', 'tentative d''un autre élève introuvable');

select * from finish();
rollback;
