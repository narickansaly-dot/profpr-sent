begin;
select plan(20);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'eleve-cal@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', 'autre-cal@test.local'),
  ('00000000-0000-0000-0000-0000000000a3', 'prof-cal@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000a3';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000a1', 'technologique', 'CAL', 'Filière calendrier');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000a1', 'cours-cal', '10000000-0000-0000-0000-0000000000a1', '1re', 'C', 'Cours calendrier', true),
  ('20000000-0000-0000-0000-0000000000a2', 'cours-cal-autre', '10000000-0000-0000-0000-0000000000a1', '1re', 'D', 'Autre cours', true),
  ('20000000-0000-0000-0000-0000000000a3', 'cours-cal-brouillon', '10000000-0000-0000-0000-0000000000a1', '1re', 'E', 'Cours non publié', false);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'ch1', 1, 'Un', true),
  ('30000000-0000-0000-0000-0000000000a2', '20000000-0000-0000-0000-0000000000a2', 'ch1', 1, 'Autre', true);
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a3', 'Première ST2S', 'CAMBCD');
insert into public.classe_cours values ('60000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a1');
insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite) values
  ('60000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', null, '2027-03-27 18:00+01');
-- Séries insérées directement (sans la RPC) pour tester le calcul des occurrences à dates fixes.
insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, repetition, jours_semaine, repeter_jusqu_au) values
  ('00000000-0000-0000-0000-0000000000a1', 'revision', 'Quotidien', '2027-03-26 17:00+01', 60, 'quotidienne', null, '2027-03-29'),
  ('00000000-0000-0000-0000-0000000000a1', 'revision', 'Hebdo', '2026-12-01 18:00+01', 30, 'hebdomadaire', null, '2026-12-31'),
  ('00000000-0000-0000-0000-0000000000a1', 'revision', 'Lundi mercredi', '2026-12-01 18:00+01', 30, 'jours', '{1,3}', '2026-12-13'),
  ('00000000-0000-0000-0000-0000000000a1', 'devoir', 'Unique', '2026-12-10 10:00+01', 45, 'aucune', null, null);
-- 500 événements pour l'autre élève : la limite est atteinte.
insert into public.evenement (eleve_id, type, titre, debut, duree_minutes)
  select '00000000-0000-0000-0000-0000000000a2', 'devoir', 'Rempli ' || i, '2027-06-01 10:00+02', 30 from generate_series(1, 500) i;
-- Identifiant d'un événement de a1, lu avant le changement de rôle (a2 ne peut pas le lire).
select set_config('test.debut', to_char(date_trunc('day', now()) + interval '30 days 16 hours', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), true);
select set_config('test.evenement_a1', (select id::text from public.evenement where titre = 'Unique'), true);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a3","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_evenement(null, ('{"type":"devoir","titre":"X","debut":"'||current_setting('test.debut')||'","duree_minutes":60}')::jsonb) $$,
  'P0001', 'reserve_eleves', 'un enseignant n''a pas de calendrier');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_evenement(null, ('{"type":"devoir","titre":"  ","debut":"'||current_setting('test.debut')||'","duree_minutes":60}')::jsonb) $$,
  'P0001', 'evenement_invalide', 'titre vide refusé');
select throws_ok($$ select public.enregistrer_evenement(null, ('{"type":"devoir","titre":"X","debut":"'||current_setting('test.debut')||'","duree_minutes":60,"repetition":"quotidienne"}')::jsonb) $$,
  'P0001', 'repetition_invalide', 'une répétition sans date de fin est refusée');
select throws_ok($$ select public.enregistrer_evenement(null, ('{"type":"devoir","titre":"X","debut":"'||current_setting('test.debut')||'","duree_minutes":60,"cours_id":"20000000-0000-0000-0000-0000000000a3"}')::jsonb) $$,
  'P0001', 'cours_indisponible', 'cours non publié refusé');
select throws_ok($$ select public.enregistrer_evenement(null, ('{"type":"devoir","titre":"X","debut":"'||current_setting('test.debut')||'","duree_minutes":60,"cours_id":"20000000-0000-0000-0000-0000000000a1","chapitres":["30000000-0000-0000-0000-0000000000a2"]}')::jsonb) $$,
  'P0001', 'chapitres_invalides', 'chapitre d''un autre cours refusé');
select lives_ok($$ select public.enregistrer_evenement(null, ('{"type":"revision","titre":"Réviser le chapitre 1","debut":"'||current_setting('test.debut')||'","duree_minutes":60,"cours_id":"20000000-0000-0000-0000-0000000000a1","chapitres":["30000000-0000-0000-0000-0000000000a1"]}')::jsonb) $$,
  'création d''une révision rattachée à un chapitre');
select is((select count(*)::int from public.evenement_chapitre ec join public.evenement e on e.id = ec.evenement_id where e.titre = 'Réviser le chapitre 1'),
  1, 'le chapitre est lié');

select results_eq(
  $$ select debut from public.mon_calendrier('2027-03-20T00:00:00Z', '2027-04-05T00:00:00Z') where titre = 'Quotidien' order by debut $$,
  $$ values ('2027-03-26 16:00+00'::timestamptz), ('2027-03-27 16:00+00'), ('2027-03-28 15:00+00'), ('2027-03-29 15:00+00') $$,
  'une série quotidienne garde 17 h à Paris après le passage à l''heure d''été');
select is((select count(*)::int from public.mon_calendrier('2026-12-01T00:00:00Z', '2027-01-01T00:00:00Z') where titre = 'Hebdo'),
  5, 'série hebdomadaire : les 5 mardis de décembre');
select results_eq(
  $$ select (debut at time zone 'Europe/Paris')::date from public.mon_calendrier('2026-12-01T00:00:00Z', '2027-01-01T00:00:00Z') where titre = 'Lundi mercredi' order by debut $$,
  $$ values ('2026-12-02'::date), ('2026-12-07'), ('2026-12-09') $$,
  'série « certains jours » : seulement les lundis et mercredis, jusqu''à la date de fin');
select is((select count(*)::int from public.mon_calendrier('2026-12-01T00:00:00Z', '2027-01-01T00:00:00Z') where titre = 'Unique'),
  1, 'événement unique dans la période');
select is((select count(*)::int from public.mon_calendrier('2027-01-01T00:00:00Z', '2027-02-01T00:00:00Z') where titre = 'Unique'),
  0, 'événement unique hors de la période');
select results_eq(
  $$ select type, lecture_seule, classe_nom from public.mon_calendrier('2027-03-20T00:00:00Z', '2027-04-05T00:00:00Z') where type = 'echeance' $$,
  $$ values ('echeance'::text, true, 'Première ST2S'::text) $$,
  'la date limite de la classe apparaît en lecture seule');
select throws_ok($$ select * from public.mon_calendrier('2026-12-01T00:00:00Z', '2027-03-01T00:00:00Z') $$,
  'P0001', 'periode_invalide', 'période de plus de 62 jours refusée');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);
select is((select count(*)::int from public.evenement where eleve_id = '00000000-0000-0000-0000-0000000000a1'), 0,
  'un élève ne lit pas les événements d''un autre');
select is((select count(*)::int from public.mon_calendrier('2026-12-01T00:00:00Z', '2027-01-01T00:00:00Z')), 0,
  'le calendrier d''un autre élève est vide pour lui');
select throws_ok($$ select public.supprimer_evenement(current_setting('test.evenement_a1')::uuid) $$,
  'P0001', 'evenement_introuvable', 'on ne supprime que ses propres événements');
select throws_ok($$ insert into public.evenement (eleve_id, type, titre, debut, duree_minutes) values ('00000000-0000-0000-0000-0000000000a2', 'devoir', 'Direct', now(), 30) $$,
  '42501', null, 'pas d''écriture directe');
select throws_ok($$ select public.enregistrer_evenement(null, ('{"type":"devoir","titre":"Un de trop","debut":"'||current_setting('test.debut')||'","duree_minutes":60}')::jsonb) $$,
  'P0001', 'trop_d_evenements', '500 événements au plus');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select lives_ok($$ select public.supprimer_evenement(current_setting('test.evenement_a1')::uuid) $$,
  'l''élève supprime son événement');

select * from finish();
rollback;
