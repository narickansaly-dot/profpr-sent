begin;
select plan(9);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000e1', 'eleve-dette@test.local');
update public.profil set onboarding_termine = true where id = '00000000-0000-0000-0000-0000000000e1';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000e1', 'technologique', 'DET', 'Filière dette');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000e1', 'cours-dette', '10000000-0000-0000-0000-0000000000e1', '1re', 'D', 'Cours dette', true),
  ('20000000-0000-0000-0000-0000000000e2', 'cours-dette-2', '10000000-0000-0000-0000-0000000000e1', '1re', 'E', 'Autre cours dette', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000e1', '20000000-0000-0000-0000-0000000000e1', 'ch1', 1, 'Un', true),
  ('30000000-0000-0000-0000-0000000000e2', '20000000-0000-0000-0000-0000000000e1', 'ch2', 2, 'Deux', true),
  ('30000000-0000-0000-0000-0000000000e3', '20000000-0000-0000-0000-0000000000e2', 'ch1', 1, 'Ailleurs', true);
select set_config('test.debut', to_char(date_trunc('day', now()) + interval '10 days 16 hours', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), true);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated"}', true);

-- Titres : bords nettoyés, caractères de contrôle refusés.
select throws_ok($$ select public.enregistrer_evenement(null, jsonb_build_object('type','devoir','titre',E'A\tB','debut',current_setting('test.debut'),'duree_minutes',60)) $$,
  'P0001', 'evenement_invalide', 'un titre avec une tabulation est refusé');
select lives_ok($$ select set_config('test.ev', public.enregistrer_evenement(null, jsonb_build_object(
  'type','revision','titre',E'\n  Réviser  \n','debut',current_setting('test.debut'),'duree_minutes',60,
  'cours_id','20000000-0000-0000-0000-0000000000e1',
  'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000e1','30000000-0000-0000-0000-0000000000e2')))::text, true) $$,
  'un titre entouré de retours à la ligne est accepté');
select is((select titre from public.evenement where id = current_setting('test.ev')::uuid), 'Réviser', 'les bords du titre sont retirés');

-- Type : code dédié.
select throws_ok($$ select public.enregistrer_evenement(current_setting('test.ev')::uuid, jsonb_build_object(
  'type','devoir','titre','Réviser','debut',current_setting('test.debut'),'duree_minutes',60)) $$,
  'P0001', 'type_non_modifiable', 'changer le type a son propre code');

-- Chapitre dépublié : retiré de mon_calendrier.
reset role;
update public.chapitre set publie = false where id = '30000000-0000-0000-0000-0000000000e2';
set local role authenticated;
select is((select jsonb_array_length(chapitres) from public.mon_calendrier(current_setting('test.debut')::timestamptz - interval '1 day',
                                                                           current_setting('test.debut')::timestamptz + interval '1 day')
            where evenement_id = current_setting('test.ev')::uuid), 1, 'un chapitre dépublié n''apparaît plus');

-- Planning : examen passé refusé aussi au refus ; plus de tolérance dans le passé à l'acceptation.
reset role;
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, cours_id) values
  ('40000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-0000000000e1', 'examen_reel', 'Passé', now() - interval '2 days', 60, '20000000-0000-0000-0000-0000000000e1'),
  ('40000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-0000000000e1', 'examen_reel', 'Futur', now() + interval '10 days', 60, '20000000-0000-0000-0000-0000000000e1');
set local role authenticated;
select throws_ok($$ select public.refuser_plan_revision('40000000-0000-0000-0000-0000000000e1',
  '{"sessions_par_semaine":3,"duree_minutes":45,"jours_preferes":[1,2,3,4,5],"heure_debut":"17:30"}'::jsonb) $$,
  'P0001', 'examen_passe', 'refuser le planning d''un examen passé est refusé');
select throws_ok(format($f$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000e2',
  '{"sessions_par_semaine":3,"duree_minutes":45,"jours_preferes":[1,2,3,4,5],"heure_debut":"17:30"}'::jsonb,
  jsonb_build_array(jsonb_build_object('debut', %L, 'duree_minutes', 45, 'titre', 'Révision', 'chapitres',
    jsonb_build_array('30000000-0000-0000-0000-0000000000e1'), 'revision_generale', false))) $f$,
  to_char(now() - interval '30 minutes', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
  'P0001', 'planning_invalide', 'une session déjà commencée est refusée');

-- Révision générale : seuls les chapitres du cours de l'événement.
reset role;
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, cours_id, revision_generale) values
  ('40000000-0000-0000-0000-0000000000e3', '00000000-0000-0000-0000-0000000000e1', 'revision', 'Générale', now() + interval '9 days', 60,
   '20000000-0000-0000-0000-0000000000e1', true);
insert into public.evenement_chapitre (evenement_id, chapitre_id) values
  ('40000000-0000-0000-0000-0000000000e3', '30000000-0000-0000-0000-0000000000e1'),
  ('40000000-0000-0000-0000-0000000000e3', '30000000-0000-0000-0000-0000000000e3');
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select ch, 'qcm_unique', 'Q', '["a","b"]', 'valide', 'dette:' || ch || ':' || i
    from unnest(array['30000000-0000-0000-0000-0000000000e1'::uuid, '30000000-0000-0000-0000-0000000000e3'::uuid]) ch,
         generate_series(1, 20) i;
insert into public.question_corrige (question_id, bonnes_reponses) select id, '[0]' from public.question where source like 'dette:%';
set local role authenticated;
select lives_ok($$ select set_config('test.tg', public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e3')::text, true) $$,
  'la révision générale démarre');
reset role;
select is((select count(*)::int from public.tentative_question tq join public.question q on q.id = tq.question_id
            where tq.tentative_id = current_setting('test.tg')::uuid and q.chapitre_id = '30000000-0000-0000-0000-0000000000e3'), 0,
  'aucune question d''un chapitre d''un autre cours');

select * from finish();
rollback;
