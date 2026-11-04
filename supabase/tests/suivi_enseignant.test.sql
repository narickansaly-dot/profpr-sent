begin;
select plan(22);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000b01', 'prof@test.local'),
  ('00000000-0000-0000-0000-000000000b02', 'autre-prof@test.local'),
  ('00000000-0000-0000-0000-000000000b03', 'dans-classe@test.local'),
  ('00000000-0000-0000-0000-000000000b04', 'hors-classe@test.local');
update public.profil set role = 'enseignant' where id in ('00000000-0000-0000-0000-000000000b01', '00000000-0000-0000-0000-000000000b02');
update public.profil set nom = 'Alix' where id = '00000000-0000-0000-0000-000000000b03';
update public.profil set nom = 'Sam' where id = '00000000-0000-0000-0000-000000000b04';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-000000000b01', 'technologique', 'SUI', 'Filière suivi');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-000000000b01', 'cours-suivi', '10000000-0000-0000-0000-000000000b01', '1re', 'S', 'Cours suivi', true),
  ('20000000-0000-0000-0000-000000000b02', 'cours-hors', '10000000-0000-0000-0000-000000000b01', '1re', 'S', 'Hors classe', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01', 'ch1', 1, 'Un', true),
  ('30000000-0000-0000-0000-000000000b02', '20000000-0000-0000-0000-000000000b01', 'ch2', 2, 'Deux', true);
insert into public.question (id, chapitre_id, type, enonce, propositions, statut) values
  ('40000000-0000-0000-0000-000000000b01', '30000000-0000-0000-0000-000000000b01', 'qcm_unique', 'Question piège', '["a","b"]', 'valide');
insert into public.question_corrige (question_id, bonnes_reponses) values ('40000000-0000-0000-0000-000000000b01', '[1]');
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-000000000b01', '00000000-0000-0000-0000-000000000b01', 'Ma classe', 'ABCDEF');
insert into public.classe_cours values ('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-000000000b01', '00000000-0000-0000-0000-000000000b03');
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide) values
  ('00000000-0000-0000-0000-000000000b03', '30000000-0000-0000-0000-000000000b01', 80, true),
  ('00000000-0000-0000-0000-000000000b04', '30000000-0000-0000-0000-000000000b01', 90, true);
-- Question piège (q1) : 3 élèves de la classe, 6 réponses closes dont 5 fausses ; l'élève hors classe a 6 réponses justes.
-- q2 : 6 réponses d'un seul élève de la classe (masquée). q3 : 4 réponses de 3 élèves (masquée).
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000b05', 'lea@test.local'),
  ('00000000-0000-0000-0000-000000000b06', 'max@test.local');
update public.profil set nom = 'Léa' where id = '00000000-0000-0000-0000-000000000b05';
update public.profil set nom = 'Max' where id = '00000000-0000-0000-0000-000000000b06';
insert into public.inscription_classe (classe_id, eleve_id) values
  ('60000000-0000-0000-0000-000000000b01', '00000000-0000-0000-0000-000000000b05'),
  ('60000000-0000-0000-0000-000000000b01', '00000000-0000-0000-0000-000000000b06');
insert into public.question (id, chapitre_id, type, enonce, propositions, statut) values
  ('40000000-0000-0000-0000-000000000b02', '30000000-0000-0000-0000-000000000b02', 'qcm_unique', 'Question à un seul élève', '["a","b"]', 'valide'),
  ('40000000-0000-0000-0000-000000000b03', '30000000-0000-0000-0000-000000000b01', 'qcm_unique', 'Question à quatre réponses', '["a","b"]', 'valide');
insert into public.question_corrige (question_id, bonnes_reponses) values
  ('40000000-0000-0000-0000-000000000b02', '[1]'), ('40000000-0000-0000-0000-000000000b03', '[1]');
create temp table fx on commit drop as
  select i, e, ch, q, ok from (
    select i, case when i <= 2 then 'b03' when i <= 4 then 'b05' else 'b06' end, 'b01', 'b01', i = 6 from generate_series(1, 6) i
    union all select i, 'b04', 'b01', 'b01', true from generate_series(7, 12) i
    union all select i, 'b03', 'b02', 'b02', false from generate_series(13, 18) i
    union all select 19, 'b03', 'b01', 'b03', false
    union all select 20, 'b05', 'b01', 'b03', false
    union all select 21, 'b06', 'b01', 'b03', false
    union all select 22, 'b03', 'b01', 'b03', false
  ) x(i, e, ch, q, ok);
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions, statut, fin, note, reussie)
  select ('70000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid, ('00000000-0000-0000-0000-000000000' || e)::uuid,
         'quiz_chapitre', '20000000-0000-0000-0000-000000000b01', ('30000000-0000-0000-0000-000000000' || ch)::uuid, 1, 'terminee', now(), 0, false
    from fx;
insert into public.tentative_question (tentative_id, ordre, question_id, permutation, reponse, correcte)
  select ('70000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid, 1, ('40000000-0000-0000-0000-000000000' || q)::uuid, '{0,1}', '[0]', ok
    from fx;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000b01","role":"authenticated"}', true);
select is((select count(*)::int from public.suivi_classe('60000000-0000-0000-0000-000000000b01')), 3, 'une ligne par élève de la classe (3) pour l''unique cours, sans l''élève hors classe');
select is((select chapitres_valides || '/' || chapitres_total from public.suivi_classe('60000000-0000-0000-0000-000000000b01') where eleve_id = '00000000-0000-0000-0000-000000000b03'), '1/2', 'progression de l''élève');
select is((select count(*)::int from public.notes_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 6, 'notes : trois élèves × deux chapitres');
select throws_ok($$ select * from public.notes_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b02') $$,
  'P0001', 'cours_invalide', 'un cours hors classe est refusé');
select is((select taux_erreur from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 83,
  'taux d''erreur calculé sur les seuls élèves de la classe (5/6)');
select is((select enonce from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 'Question piège', 'énoncé visible pour l''enseignant');
select is((select reponses from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 6,
  'les réponses de l''élève hors classe ne sont pas comptées');
select is((select count(*)::int from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 1,
  'seule la question à 5 réponses d''au moins 3 élèves est restituée');
select is((select count(*)::int from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')
            where question_id = '40000000-0000-0000-0000-000000000b02'), 0,
  'une question répondue 6 fois par un seul élève est masquée');
select is((select count(*)::int from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')
            where question_id = '40000000-0000-0000-0000-000000000b03'), 0,
  'une question à 4 réponses est masquée');

reset role;
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions, statut)
  values ('70000000-0000-0000-0000-000000000099', '00000000-0000-0000-0000-000000000b03', 'evaluation_cours', '20000000-0000-0000-0000-000000000b01', null, 1, 'en_cours');
insert into public.tentative_question (tentative_id, ordre, question_id, permutation, reponse, correcte)
  values ('70000000-0000-0000-0000-000000000099', 1, '40000000-0000-0000-0000-000000000b01', '{0,1}', '[0]', true);
set local role authenticated;
select is((select taux_erreur from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 83,
  'une tentative en cours n''influence pas le taux d''erreur');
select is((select reponses from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 6,
  'une tentative en cours n''est pas comptée dans les réponses');
select throws_ok($$ select * from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b02') $$,
  'P0001', 'cours_invalide', 'questions ratées : un cours hors classe est refusé');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000b02","role":"authenticated"}', true);
select throws_ok($$ select * from public.suivi_classe('60000000-0000-0000-0000-000000000b01') $$, 'P0001', 'acces_refuse', 'un autre enseignant est refusé');
select throws_ok($$ select * from public.notes_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01') $$,
  'P0001', 'acces_refuse', 'notes : un autre enseignant est refusé');
select throws_ok($$ select * from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01') $$,
  'P0001', 'acces_refuse', 'questions ratées : un autre enseignant est refusé');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000b03","role":"authenticated"}', true);
select throws_ok($$ select * from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01') $$,
  'P0001', 'acces_refuse', 'un élève est refusé');
select is((select count(*)::int from public.tentative where eleve_id <> '00000000-0000-0000-0000-000000000b03'), 0,
  'les règles des tentatives restent inchangées : l''élève ne voit que les siennes');

select ok(not has_function_privilege('anon', 'public.suivi_classe(uuid)', 'execute'), 'anon ne peut pas exécuter public.suivi_classe');
select ok(not has_function_privilege('anon', 'public.notes_classe(uuid, uuid)', 'execute'), 'anon ne peut pas exécuter public.notes_classe');
select ok(not has_function_privilege('anon', 'public.questions_ratees_classe(uuid, uuid, int)', 'execute'), 'anon ne peut pas exécuter public.questions_ratees_classe');

reset role;
update public.profil set role = 'eleve' where id = '00000000-0000-0000-0000-000000000b01';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000b01","role":"authenticated"}', true);
select throws_ok($$ select * from public.suivi_classe('60000000-0000-0000-0000-000000000b01') $$,
  'P0001', 'acces_refuse', 'le propriétaire dont le rôle n''est plus enseignant est refusé');

select * from finish();
rollback;
