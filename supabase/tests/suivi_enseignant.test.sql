begin;
select plan(9);

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
-- 6 réponses closes de l'élève de la classe à la question piège, dont 5 fausses ; 6 de l'élève hors classe, toutes justes.
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions, statut, fin, note, reussie)
  select ('70000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
         case when i <= 6 then '00000000-0000-0000-0000-000000000b03'::uuid else '00000000-0000-0000-0000-000000000b04'::uuid end,
         'quiz_chapitre', '20000000-0000-0000-0000-000000000b01', '30000000-0000-0000-0000-000000000b01', 1, 'terminee', now(), 0, false
    from generate_series(1, 12) i;
insert into public.tentative_question (tentative_id, ordre, question_id, permutation, reponse, correcte)
  select ('70000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid, 1, '40000000-0000-0000-0000-000000000b01', '{0,1}', '[0]',
         not (i <= 5)
    from generate_series(1, 12) i;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000b01","role":"authenticated"}', true);
select is((select count(*)::int from public.suivi_classe('60000000-0000-0000-0000-000000000b01')), 1, 'une ligne : un élève, un cours de la classe');
select is((select chapitres_valides || '/' || chapitres_total from public.suivi_classe('60000000-0000-0000-0000-000000000b01')), '1/2', 'progression de l''élève');
select is((select count(*)::int from public.notes_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 2, 'notes : un élève × deux chapitres');
select throws_ok($$ select * from public.notes_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b02') $$,
  'P0001', 'cours_invalide', 'un cours hors classe est refusé');
select is((select taux_erreur from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 83,
  'taux d''erreur calculé sur les seuls élèves de la classe (5/6)');
select is((select enonce from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 'Question piège', 'énoncé visible pour l''enseignant');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000b02","role":"authenticated"}', true);
select throws_ok($$ select * from public.suivi_classe('60000000-0000-0000-0000-000000000b01') $$, 'P0001', 'acces_refuse', 'un autre enseignant est refusé');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000b03","role":"authenticated"}', true);
select throws_ok($$ select * from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01') $$,
  'P0001', 'acces_refuse', 'un élève est refusé');
select is((select count(*)::int from public.tentative where eleve_id <> '00000000-0000-0000-0000-000000000b03'), 0,
  'les règles des tentatives restent inchangées : l''élève ne voit que les siennes');

select * from finish();
rollback;
