begin;
select plan(34);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000c1', 'quiz@test.local'),
  ('00000000-0000-0000-0000-0000000000c2', 'autre@test.local'),
  ('00000000-0000-0000-0000-0000000000c3', 'expire@test.local');
-- Élève hors période d'essai (inscrit depuis 10 jours, sans abonnement)
update public.profil set inscrit_le = now() - interval '10 days' where id = '00000000-0000-0000-0000-0000000000c3';
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
create temporary table t3 (id uuid);
create temporary table t4 (id uuid);
grant all on t1, t2, t3, t4 to authenticated;
create temporary table aff (tentative_id uuid, question_id uuid, ordre smallint, a0 int, a1 int);
grant all on aff to authenticated;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);

select throws_ok($$ select propositions from public.question limit 1 $$, '42501', null, 'élève : ne lit pas les propositions en ordre d''origine');
select is((select count(*)::int from public.question where chapitre_id = '30000000-0000-0000-0000-0000000000c1'), 16, 'élève : compte toujours les questions par chapitre');
select throws_ok($$ select public.demarrer_quiz('30000000-0000-0000-0000-0000000000c1', 17) $$, 'P0001', 'longueur_invalide', 'longueur hors 15/20/30 refusée');
select throws_ok($$ select public.demarrer_quiz('30000000-0000-0000-0000-0000000000c2', 15) $$, 'P0001', 'quiz_indisponible', 'moins de 15 questions validées');

insert into t1 select public.demarrer_quiz('30000000-0000-0000-0000-0000000000c1', 20);
select is((select nb_questions::int from public.tentative where id = (select id from t1)), 16, 'demander 20 donne les 16 disponibles');
select is((select count(distinct question_id)::int from public.tentative_question where tentative_id = (select id from t1)), 16, '16 questions distinctes');
select is((select count(*)::int from public.questions_tentative((select id from t1))), 16, 'questions_tentative renvoie 16 lignes');
select ok((select bool_and(jsonb_array_length(propositions) = 2 and reponse is null) from public.questions_tentative((select id from t1))), 'propositions affichées, aucune réponse');
select is((select count(*)::int from public.question_corrige), 0, 'toujours aucun corrigé lisible directement');

-- La permutation n'est plus lisible par l'élève : on calcule l'indice affiché des réponses 0 et 1 en postgres.
reset role;
insert into aff select tq.tentative_id, tq.question_id, tq.ordre, array_position(tq.permutation, 0::smallint) - 1, array_position(tq.permutation, 1::smallint) - 1
  from public.tentative_question tq where tq.tentative_id = (select id from t1);
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);

-- Répondre juste à 12 questions sur 16 (75 %) ; la bonne réponse affichée vient de aff (calculée depuis la permutation).
-- Les appels en masse passent par des blocs do : un select imprimerait des lignes « ok » qui perturbent la sortie TAP.
select is(public.repondre(tq.tentative_id, tq.question_id, jsonb_build_array(tq.a0)), 'ok', 'repondre renvoie ok')
  from aff tq where tq.tentative_id = (select id from t1) and tq.ordre = 1;
do $$ begin
  perform public.repondre(tq.tentative_id, tq.question_id, jsonb_build_array(tq.a0))
    from aff tq where tq.tentative_id = (select id from t1) and tq.ordre between 2 and 12;
  perform public.repondre(tq.tentative_id, tq.question_id, jsonb_build_array(tq.a1))
    from aff tq where tq.tentative_id = (select id from t1) and tq.ordre between 13 and 16;
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
-- La permutation n'est plus lisible par l'élève : on calcule l'indice affiché des réponses 0 et 1 en postgres.
reset role;
insert into aff select tq.tentative_id, tq.question_id, tq.ordre, array_position(tq.permutation, 0::smallint) - 1, array_position(tq.permutation, 1::smallint) - 1
  from public.tentative_question tq where tq.tentative_id = (select id from t2);
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);
select is((select count(*)::int from public.tentative_question tq join public.historique_question h on h.question_id = tq.question_id
  where tq.tentative_id = (select id from t2) and h.ratee > 0), 4, 'les questions ratées sont reprises en priorité');

-- Une seule tentative ouverte par chapitre : un second appel renvoie la même.
select is(public.demarrer_quiz('30000000-0000-0000-0000-0000000000c1', 20), (select id from t2), 'tentative déjà ouverte : renvoyée telle quelle');

-- t2 : on rate encore les 4 déjà ratées, on réussit le reste -> 11/15 (73,33 %), sous la meilleure note.
do $$ begin
  perform public.repondre(tq.tentative_id, tq.question_id,
    jsonb_build_array(case when coalesce(h.ratee, 0) > 0 then tq.a1 else tq.a0 end))
  from aff tq
  left join public.historique_question h on h.question_id = tq.question_id
  where tq.tentative_id = (select id from t2);
  perform public.terminer_tentative((select id from t2));
end $$;
select is((select meilleure_note from public.progression_chapitre where chapitre_id = '30000000-0000-0000-0000-0000000000c1'), 75.00::numeric, 'meilleure note conservée après une moins bonne');
select is((select valide from public.progression_chapitre where chapitre_id = '30000000-0000-0000-0000-0000000000c1'), true, 'chapitre toujours validé');

-- Trois nouvelles questions validées et une question brouillon (créées par postgres).
reset role;
insert into public.question (id, chapitre_id, type, enonce, propositions, statut, source) values
  ('40000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000c1', 'qcm_unique', 'N1', '["bon","faux"]', 'valide', 'quiz:c1:n1'),
  ('40000000-0000-0000-0000-0000000000d2', '30000000-0000-0000-0000-0000000000c1', 'qcm_unique', 'N2', '["bon","faux"]', 'valide', 'quiz:c1:n2'),
  ('40000000-0000-0000-0000-0000000000d3', '30000000-0000-0000-0000-0000000000c1', 'qcm_unique', 'N3', '["bon","faux"]', 'valide', 'quiz:c1:n3'),
  ('40000000-0000-0000-0000-0000000000d4', '30000000-0000-0000-0000-0000000000c1', 'qcm_unique', 'Brouillon', '["bon","faux"]', 'brouillon', 'quiz:c1:b');
insert into public.question_corrige (question_id, bonnes_reponses, explication)
  select id, '[0]', 'Parce que.' from public.question where source in ('quiz:c1:n1', 'quiz:c1:n2', 'quiz:c1:n3', 'quiz:c1:b');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);

-- Priorité : les 3 jamais vues et les 4 ratées passent avant les autres.
insert into t3 select public.demarrer_quiz('30000000-0000-0000-0000-0000000000c1', 15);
-- La permutation n'est plus lisible par l'élève : on calcule l'indice affiché des réponses 0 et 1 en postgres.
reset role;
insert into aff select tq.tentative_id, tq.question_id, tq.ordre, array_position(tq.permutation, 0::smallint) - 1, array_position(tq.permutation, 1::smallint) - 1
  from public.tentative_question tq where tq.tentative_id = (select id from t3);
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);
select is((select count(*)::int from public.tentative_question where tentative_id = (select id from t3)
  and question_id in ('40000000-0000-0000-0000-0000000000d1', '40000000-0000-0000-0000-0000000000d2', '40000000-0000-0000-0000-0000000000d3')), 3, 'les 3 questions jamais vues sont tirées');
select is((select count(*)::int from public.tentative_question tq join public.historique_question h on h.question_id = tq.question_id
  where tq.tentative_id = (select id from t3) and h.ratee > 0), 4, 'les 4 questions ratées sont tirées avec elles');

-- t3 : mêmes 4 ratées de nouveau fausses, le reste juste, puis clôture.
do $$ begin
  perform public.repondre(tq.tentative_id, tq.question_id,
    jsonb_build_array(case when coalesce(h.ratee, 0) > 0 then tq.a1 else tq.a0 end))
  from aff tq
  left join public.historique_question h on h.question_id = tq.question_id
  where tq.tentative_id = (select id from t3);
  perform public.terminer_tentative((select id from t3));
end $$;

-- Révision : les 4 questions ratées passent en tête.
insert into t4 select public.demarrer_quiz('30000000-0000-0000-0000-0000000000c1', 15, true);
select is((select array_agg(question_id order by question_id) from public.tentative_question where tentative_id = (select id from t4) and ordre <= 4),
  (select array_agg(question_id order by question_id) from public.historique_question where ratee > 0), 'révision : les ratées d''abord');
select is((select count(*)::int from public.tentative_question where question_id = '40000000-0000-0000-0000-0000000000d4'), 0, 'une question brouillon n''est jamais tirée');

select lives_ok($$ select public.marquer_chapitre_lu('30000000-0000-0000-0000-0000000000c2') $$, 'marquer un chapitre lu');
select is((select lu from public.progression_chapitre where chapitre_id = '30000000-0000-0000-0000-0000000000c2'), true, 'chapitre marqué lu');

-- Un autre élève ne peut pas lire ni répondre à la tentative
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c2","role":"authenticated"}', true);
select throws_ok(format($$ select * from public.questions_tentative(%L) $$, (select id from t1)), 'P0001', 'tentative_introuvable', 'tentative d''un autre élève introuvable');

select throws_ok(format($$ select public.repondre(%L, %L, '[0]') $$, (select id from t1),
  (select question_id from public.tentative_question where tentative_id = (select id from t1) and ordre = 1)),
  'P0001', 'tentative_introuvable', 'un autre élève ne peut pas répondre');
select throws_ok(format($$ select public.terminer_tentative(%L) $$, (select id from t1)), 'P0001', 'tentative_introuvable', 'un autre élève ne peut pas terminer');
select throws_ok(format($$ select * from public.correction_tentative(%L) $$, (select id from t1)), 'P0001', 'tentative_introuvable', 'un autre élève ne lit pas la correction');

-- Élève hors période d'essai
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c3","role":"authenticated"}', true);
select throws_ok($$ select public.demarrer_quiz('30000000-0000-0000-0000-0000000000c1', 15) $$, 'P0001', 'acces_refuse', 'essai expiré : accès refusé');

select * from finish();
rollback;
