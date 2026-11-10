begin;
select plan(16);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000f1', 'eleve-dette-notif@test.local'),
  ('00000000-0000-0000-0000-0000000000f3', 'prof-dette-notif@test.local');
update public.profil set onboarding_termine = true where id = '00000000-0000-0000-0000-0000000000f1';
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000f3';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000f1', 'technologique', 'DNO', 'Filière dette notif');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000f1', 'cours-dette-notif', '10000000-0000-0000-0000-0000000000f1', '1re', 'N', 'Cours notif', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1', 'ch1', 1, 'Un', true);
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f3', 'Classe dette', 'DNTBCD');
insert into public.classe_cours values ('60000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f1');
delete from prive.cle_envoi;
insert into prive.cle_envoi (id, empreinte) values (true, extensions.digest(repeat('s', 43), 'sha256'));
delete from public.notification_planifiee where eleve_id = '00000000-0000-0000-0000-0000000000f1';

-- 1. echeance_proche part à greatest(limite - 24 h, ouverture) : une ouverture après la fenêtre ne planifie rien.
insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite) values
  ('60000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1', '2027-01-12 20:00+01', '2027-01-13 09:10+01');
select prive.planifier_notifications('2027-01-12 09:00+01');
select is((select count(*)::int from public.notification_planifiee
            where eleve_id = '00000000-0000-0000-0000-0000000000f1' and type = 'echeance_proche'), 0,
  'pas d''alerte de fermeture avant l''ouverture de l''évaluation');

-- Ouverture à 9 h 05 dans les 24 dernières heures avant la limite (13/01 à 8 h 10) : l'alerte part à l'ouverture.
update public.echeance_evaluation set ouverture = '2027-01-12 09:05+01', limite = '2027-01-13 08:10+01'
 where classe_id = '60000000-0000-0000-0000-0000000000f1';
select prive.planifier_notifications('2027-01-12 09:00+01');
select is((select array_agg(envoi_prevu) from public.notification_planifiee
            where eleve_id = '00000000-0000-0000-0000-0000000000f1' and type = 'echeance_proche'),
  array['2027-01-12 09:05+01'::timestamptz],
  'l''alerte de fermeture part à l''ouverture quand elle tombe dans les 24 dernières heures');

-- 2. Rappel dont l'occurrence est passée : supprimé à la réservation.
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu) values
  ('50000000-0000-0000-0000-0000000000f9', '00000000-0000-0000-0000-0000000000f1', 'rappel_evenement',
   'rappel:40000000-0000-0000-0000-0000000000f9:' || extract(epoch from now() - interval '1 hour')::bigint || ':60',
   'Devoir passé', 'x', '/', now() - interval '1 minute');
-- Échéance dont la date limite a changé depuis la planification : supprimée à la réservation.
update public.notification_planifiee set envoi_prevu = now() - interval '1 minute'
 where eleve_id = '00000000-0000-0000-0000-0000000000f1' and type = 'echeance_proche';
update public.echeance_evaluation set limite = '2027-01-13 10:00+01' where classe_id = '60000000-0000-0000-0000-0000000000f1';
set local role anon;
select count(*) from public.envoi_reserver(repeat('s', 43));
reset role;
select is((select count(*)::int from public.notification_planifiee where id = '50000000-0000-0000-0000-0000000000f9'), 0,
  'un rappel dont l''occurrence est passée est supprimé');
select is((select count(*)::int from public.notification_planifiee
            where eleve_id = '00000000-0000-0000-0000-0000000000f1' and type = 'echeance_proche'), 0,
  'une alerte dont la date limite a changé est supprimée');

-- Date limite passée : l'alerte (décalée par le silence) est supprimée.
update public.echeance_evaluation set ouverture = null, limite = now() - interval '1 hour'
 where classe_id = '60000000-0000-0000-0000-0000000000f1';
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu) values
  ('50000000-0000-0000-0000-0000000000fa', '00000000-0000-0000-0000-0000000000f1', 'echeance_proche',
   'echeance:60000000-0000-0000-0000-0000000000f1:20000000-0000-0000-0000-0000000000f1:' || extract(epoch from now() - interval '1 hour')::bigint,
   'Évaluation', 'x', '/', now() - interval '1 minute');
set local role anon;
select count(*) from public.envoi_reserver(repeat('s', 43));
reset role;
select is((select count(*)::int from public.notification_planifiee where id = '50000000-0000-0000-0000-0000000000fa'), 0,
  'une alerte dont la date limite est passée est supprimée');

-- Ouverture repoussée après maintenant : l'alerte est supprimée.
update public.echeance_evaluation set ouverture = now() + interval '1 day', limite = now() + interval '2 days'
 where classe_id = '60000000-0000-0000-0000-0000000000f1';
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu) values
  ('50000000-0000-0000-0000-0000000000fb', '00000000-0000-0000-0000-0000000000f1', 'echeance_proche',
   'echeance:60000000-0000-0000-0000-0000000000f1:20000000-0000-0000-0000-0000000000f1:' || extract(epoch from now() + interval '2 days')::bigint,
   'Évaluation', 'x', '/', now() - interval '1 minute');
set local role anon;
select count(*) from public.envoi_reserver(repeat('s', 43));
reset role;
select is((select count(*)::int from public.notification_planifiee where id = '50000000-0000-0000-0000-0000000000fb'), 0,
  'une alerte dont l''ouverture a été repoussée est supprimée');

-- Rappel dont le délai a changé : supprimé.
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, delai_rappel_minutes) values
  ('40000000-0000-0000-0000-0000000000f3', '00000000-0000-0000-0000-0000000000f1', 'devoir', 'Devoir 2', now() + interval '1 day', 60, 60);
insert into public.notification_planifiee (id, eleve_id, type, cle, evenement_id, titre, corps, url, envoi_prevu) values
  ('50000000-0000-0000-0000-0000000000fc', '00000000-0000-0000-0000-0000000000f1', 'rappel_evenement',
   'rappel:40000000-0000-0000-0000-0000000000f3:' || extract(epoch from now() + interval '1 day')::bigint || ':10',
   '40000000-0000-0000-0000-0000000000f3', 'Devoir 2', 'x', '/', now() - interval '1 minute');
set local role anon;
select count(*) from public.envoi_reserver(repeat('s', 43));
reset role;
select is((select count(*)::int from public.notification_planifiee where id = '50000000-0000-0000-0000-0000000000fc'), 0,
  'un rappel dont le délai a changé est supprimé');

-- 3. Une notification devenue sans objet est supprimée à la réservation (cours validé entre-temps).
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu) values
  ('50000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f1', 'nouvel_essai', 'essai:test', 'Évaluation', 'Tu peux retenter ton évaluation', '/', now() - interval '1 minute'),
  ('50000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000f1', 'inactivite', 'inactivite:test', 'On reprend', 'x', '/', now() - interval '1 minute');
-- La notification nouvel_essai porte le cours dans son URL : /cours/<slug>/evaluation.
update public.notification_planifiee set url = '/cours/cours-dette-notif/evaluation' where id = '50000000-0000-0000-0000-0000000000f1';
insert into public.progression_cours (eleve_id, cours_id, meilleure_note, valide, valide_le, essais)
  values ('00000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1', 90, true, now(), 1);
-- Une activité après la création de la relance d'inactivité (clock_timestamp : now() égale cree_le dans la transaction).
insert into public.tentative (eleve_id, type, cours_id, nb_questions, debut, statut)
  values ('00000000-0000-0000-0000-0000000000f1', 'evaluation_cours', '20000000-0000-0000-0000-0000000000f1', 40, clock_timestamp(), 'terminee');

set local role anon;
select is((select count(*)::int from public.envoi_reserver(repeat('s', 43)) where eleve_id = '00000000-0000-0000-0000-0000000000f1'), 0,
  'les notifications sans objet ne sont pas envoyées');
reset role;
select is((select count(*)::int from public.notification_planifiee where id in
            ('50000000-0000-0000-0000-0000000000f1', '50000000-0000-0000-0000-0000000000f2')), 0,
  'elles sont supprimées');

-- 4. Réservée 10 fois : échec.
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu, reservations) values
  ('50000000-0000-0000-0000-0000000000f3', '00000000-0000-0000-0000-0000000000f1', 'revision_du_jour', 'jour:test', 'Révisions du jour', 'x', '/', now() - interval '1 minute', 10);
set local role anon;
select is((select count(*)::int from public.envoi_reserver(repeat('s', 43)) where id = '50000000-0000-0000-0000-0000000000f3'), 0,
  'une notification réservée 10 fois n''est plus renvoyée');
reset role;
select is((select statut::text from public.notification_planifiee where id = '50000000-0000-0000-0000-0000000000f3'), 'echec',
  'elle passe en échec');

-- 5. Une réservation compte.
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu) values
  ('50000000-0000-0000-0000-0000000000f4', '00000000-0000-0000-0000-0000000000f1', 'revision_du_jour', 'jour:test2', 'Révisions du jour', 'x', '/', now() - interval '1 minute');
set local role anon;
select is((select count(*)::int from public.envoi_reserver(repeat('s', 43)) where id = '50000000-0000-0000-0000-0000000000f4'), 1,
  'une notification due est réservée');
reset role;
select is((select reservations from public.notification_planifiee where id = '50000000-0000-0000-0000-0000000000f4'), 1::smallint,
  'la réservation est comptée');

-- 6. Changer le rappel ne supprime pas une ligne réservée.
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, delai_rappel_minutes) values
  ('40000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f1', 'devoir', 'Devoir', now() + interval '1 day', 60, 60);
insert into public.notification_planifiee (eleve_id, type, cle, evenement_id, titre, corps, url, envoi_prevu, reserve_jusqu_au) values
  ('00000000-0000-0000-0000-0000000000f1', 'rappel_evenement', 'rappel:reserve', '40000000-0000-0000-0000-0000000000f1', 'Devoir', 'x', '/', now() - interval '1 minute', now() + interval '1 minute');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f1","role":"authenticated"}', true);
select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000f1', 10);
reset role;
select is((select count(*)::int from public.notification_planifiee where cle = 'rappel:reserve'), 1,
  'une ligne en cours d''envoi n''est pas supprimée');

-- 7. Titres des sessions du planning : caractère de contrôle refusé, bords nettoyés.
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, cours_id) values
  ('40000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000f1', 'examen_reel', 'Examen', now() + interval '10 days', 60, '20000000-0000-0000-0000-0000000000f1');
set local role authenticated;
select throws_ok(format($f$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000f2',
  '{"sessions_par_semaine":3,"duree_minutes":45,"jours_preferes":[1,2,3,4,5],"heure_debut":"17:30"}'::jsonb,
  jsonb_build_array(jsonb_build_object('debut', %L, 'duree_minutes', 45, 'titre', E'Ré\tvision', 'chapitres',
    jsonb_build_array('30000000-0000-0000-0000-0000000000f1'), 'revision_generale', false))) $f$,
  to_char(now() + interval '2 days', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
  'P0001', 'planning_invalide', 'un titre de session avec une tabulation est refusé');
select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000f2',
  '{"sessions_par_semaine":3,"duree_minutes":45,"jours_preferes":[1,2,3,4,5],"heure_debut":"17:30"}'::jsonb,
  jsonb_build_array(jsonb_build_object('debut', to_char(now() + interval '2 days', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), 'duree_minutes', 45,
    'titre', E'\n  Révision  \n', 'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000f1'), 'revision_generale', false)));
reset role;
select is((select titre from public.evenement where eleve_id = '00000000-0000-0000-0000-0000000000f1' and type = 'revision'), 'Révision',
  'les bords du titre d''une session sont retirés');

select * from finish();
rollback;
