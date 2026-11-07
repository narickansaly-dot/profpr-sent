begin;
select plan(18);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000d1', 'eleve-plan@test.local'),
  ('00000000-0000-0000-0000-0000000000d2', 'autre-plan@test.local'),
  ('00000000-0000-0000-0000-0000000000d3', 'prof-plan@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000d3';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000d1', 'technologique', 'PLA', 'Filière plan');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000d1', 'cours-plan', '10000000-0000-0000-0000-0000000000d1', '1re', 'P', 'Cours plan', true),
  ('20000000-0000-0000-0000-0000000000d2', 'cours-plan-autre', '10000000-0000-0000-0000-0000000000d1', '1re', 'Q', 'Autre', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000d1', '20000000-0000-0000-0000-0000000000d1', 'ch1', 1, 'Un', true),
  ('30000000-0000-0000-0000-0000000000d2', '20000000-0000-0000-0000-0000000000d1', 'ch2', 2, 'Deux', true),
  ('30000000-0000-0000-0000-0000000000d3', '20000000-0000-0000-0000-0000000000d2', 'ch1', 1, 'Ailleurs', true);
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, cours_id) values
  ('40000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000d1', 'examen_reel', 'Contrôle', now() + interval '10 days', 120, '20000000-0000-0000-0000-0000000000d1');
-- Gabarits JSON réutilisés par les tests.
select set_config('test.reglages', '{"sessions_par_semaine":3,"duree_minutes":60,"jours_preferes":[1,3,5],"heure_debut":"17:00"}', true);
select set_config('test.sessions', jsonb_build_array(
  jsonb_build_object('titre', 'Révision · Ch. 1 Un', 'debut', now() + interval '2 days', 'duree_minutes', 60,
                     'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000d1'), 'revision_generale', false),
  jsonb_build_object('titre', 'Révision générale', 'debut', now() + interval '9 days', 'duree_minutes', 60,
                     'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000d2'), 'revision_generale', true)
)::text, true);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d3","role":"authenticated"}', true);
select throws_ok($$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages')::jsonb, current_setting('test.sessions')::jsonb) $$,
  'P0001', 'reserve_eleves', 'réservé aux élèves');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d2","role":"authenticated"}', true);
select throws_ok($$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages')::jsonb, current_setting('test.sessions')::jsonb) $$,
  'P0001', 'examen_introuvable', 'on ne planifie que ses propres examens');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);
select throws_ok(format('select public.accepter_plan_revision(%L, %L::jsonb, %L::jsonb)', '40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages'),
  jsonb_build_array(jsonb_build_object('titre', 'X', 'debut', now() + interval '2 days', 'duree_minutes', 60,
    'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000d3'), 'revision_generale', false))),
  'P0001', 'planning_invalide', 'chapitre d''un autre cours refusé');
select throws_ok(format('select public.accepter_plan_revision(%L, %L::jsonb, %L::jsonb)', '40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages'),
  jsonb_build_array(jsonb_build_object('titre', 'X', 'debut', now() + interval '11 days', 'duree_minutes', 60,
    'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000d1'), 'revision_generale', false))),
  'P0001', 'planning_invalide', 'session après l''examen refusée');
select lives_ok($$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages')::jsonb, current_setting('test.sessions')::jsonb) $$,
  'le planning est accepté');
select is((select count(*)::int from public.evenement e join public.plan_revision p on p.id = e.plan_id where p.examen_id = '40000000-0000-0000-0000-0000000000d1'),
  2, 'deux sessions créées');
select is((select statut::text from public.plan_revision where examen_id = '40000000-0000-0000-0000-0000000000d1'), 'accepte', 'plan accepté');
select is((select count(*)::int from public.plans_a_reorganiser()), 0, 'rien à réorganiser au départ');

-- Chapitre 1 validé après la création du plan : la session du chapitre 1 est encore à venir.
reset role;
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide, valide_le)
  values ('00000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000d1', 90, true, clock_timestamp());
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);
select is((select count(*)::int from public.plans_a_reorganiser()), 1, 'un chapitre prévu plus tard est validé : réorganisation proposée');
select lives_ok($$ select public.ignorer_reorganisation((select id from public.plan_revision limit 1)) $$, '« Plus tard »');
select is((select count(*)::int from public.plans_a_reorganiser()), 0, 'la proposition disparaît après « Plus tard »');

select lives_ok(format('select public.accepter_plan_revision(%L, %L::jsonb, %L::jsonb)', '40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages'),
  jsonb_build_array(jsonb_build_object('titre', 'Révision générale', 'debut', now() + interval '9 days', 'duree_minutes', 60,
    'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000d2'), 'revision_generale', true))),
  'réorganiser remplace le planning');
select is((select count(*)::int from public.evenement where type = 'revision'), 1, 'les sessions à venir de l''ancien plan sont supprimées');
select lives_ok($$ select public.refuser_plan_revision('40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages')::jsonb) $$,
  'refuser après acceptation ne fait rien');
select is((select statut::text from public.plan_revision where examen_id = '40000000-0000-0000-0000-0000000000d1'), 'accepte', 'le plan accepté reste en place');
select throws_ok($$ select * from public.mes_creneaux_occupes(now(), now() + interval '400 days') $$,
  'P0001', 'periode_invalide', 'période de plus de 366 jours refusée');

select lives_ok($$ select public.supprimer_evenement('40000000-0000-0000-0000-0000000000d1') $$, 'suppression de l''examen');
select is((select count(*)::int from public.evenement where type = 'revision' and debut > now()), 0,
  'supprimer l''examen supprime les sessions à venir de son plan');

select * from finish();
rollback;
