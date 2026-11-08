begin;
select plan(26);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000c1', 'eleve-envoi@test.local'),
  ('00000000-0000-0000-0000-0000000000c2', 'sans-pref@test.local'),
  ('00000000-0000-0000-0000-0000000000c3', 'prof-envoi@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000c3';
-- c2 inscrit depuis longtemps, sans aucune activité : relance d'inactivité.
update public.profil set onboarding_termine = true where id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2');
update public.profil set inscrit_le = '2027-01-01 10:00+01' where id = '00000000-0000-0000-0000-0000000000c2';
update public.profil set inscrit_le = '2027-01-11 10:00+01' where id = '00000000-0000-0000-0000-0000000000c1';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000c1', 'technologique', 'ENV', 'Filière envoi');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000c1', 'cours-envoi', '10000000-0000-0000-0000-0000000000c1', '1re', 'E', 'Cours envoi', true);
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c3', 'Classe envoi', 'ENVBCD');
insert into public.classe_cours values ('60000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c1');
-- Date limite le 13 janvier à 9 h 10 : l'alerte tombe le 12 à 9 h 10, dans la fenêtre.
insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite) values
  ('60000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1', null, '2027-01-13 09:10+01');
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, delai_rappel_minutes) values
  -- Rappel 1 h avant 10 h 05 : 9 h 05, dans la fenêtre.
  ('40000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c1', 'devoir', 'Devoir de maths', '2027-01-12 10:05+01', 60, 60),
  -- Rappel 10 min avant 18 h : hors fenêtre.
  ('40000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000c1', 'revision', 'Révision du soir', '2027-01-12 18:00+01', 30, 10);
-- Un essai d'évaluation raté hier à 9 h 02 : nouvel essai à 9 h 02 aujourd'hui.
insert into public.tentative (eleve_id, type, cours_id, nb_questions, debut, fin, statut, note, reussie) values
  ('00000000-0000-0000-0000-0000000000c1', 'evaluation_cours', '20000000-0000-0000-0000-0000000000c1', 40,
   '2027-01-11 08:00+01', '2027-01-11 09:02+01', 'terminee', 40, false);

-- La base locale peut contenir d'autres comptes (démo, e2e) : chaque assertion ne compte que c1 et c2.
select prive.planifier_notifications('2027-01-12 09:00+01');
select is((select count(*)::int from public.notification_planifiee
            where eleve_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2')), 3,
  'trois notifications à 9 h : rappel, échéance, nouvel essai');
select results_eq(
  $$ select type::text, titre, corps, url, envoi_prevu from public.notification_planifiee
      where eleve_id = '00000000-0000-0000-0000-0000000000c1' order by envoi_prevu $$,
  $$ values ('nouvel_essai', 'Évaluation Cours envoi', 'Tu peux retenter ton évaluation', '/cours/cours-envoi/evaluation', '2027-01-12 09:02+01'::timestamptz),
            ('rappel_evenement', 'Devoir de maths', 'Le 12/01 à 10 h 05', '/calendrier/40000000-0000-0000-0000-0000000000c1', '2027-01-12 09:05+01'::timestamptz),
            ('echeance_proche', 'Évaluation Cours envoi', 'Elle ferme le 13/01 à 9 h 10', '/cours/cours-envoi/evaluation', '2027-01-12 09:10+01'::timestamptz) $$,
  'contenu et heure de chaque notification');
select prive.planifier_notifications('2027-01-12 09:01+01');
select is((select count(*)::int from public.notification_planifiee
            where eleve_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2')), 3,
  'une deuxième planification ne crée pas de doublon');

-- Changer le délai après un rappel envoyé recrée un rappel (la clé contient le délai).
update public.notification_planifiee set statut = 'envoyee' where evenement_id = '40000000-0000-0000-0000-0000000000c1';
update public.evenement set delai_rappel_minutes = 1440 where id = '40000000-0000-0000-0000-0000000000c1';
select prive.planifier_notifications('2027-01-11 10:00+01');
select is((select count(*)::int from public.notification_planifiee where evenement_id = '40000000-0000-0000-0000-0000000000c1' and type = 'rappel_evenement'), 2,
  'un nouveau délai recrée un rappel malgré l''ancien déjà envoyé');

-- 7 h 30 : séance de révision du jour pour c1 (la révision du soir).
select prive.planifier_notifications('2027-01-12 07:20+01');
select is((select count(*)::int from public.notification_planifiee
            where type = 'revision_du_jour' and eleve_id = '00000000-0000-0000-0000-0000000000c1'), 1,
  'révision du jour planifiée le matin');
select results_eq($$ select corps, url from public.notification_planifiee
                    where type = 'revision_du_jour' and eleve_id = '00000000-0000-0000-0000-0000000000c1' $$,
  $$ values ('1 séance prévue aujourd’hui', '/calendrier?vue=jour&date=2027-01-12') $$, 'texte de la révision du jour');

-- 17 h : c2 sans activité depuis 11 jours ; c1 actif hier, pas de relance.
select prive.planifier_notifications('2027-01-12 16:50+01');
select is((select count(*)::int from public.notification_planifiee where type = 'inactivite'
            and eleve_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2')), 1,
  'une seule relance d''inactivité');
select is((select eleve_id from public.notification_planifiee where type = 'inactivite'
            and eleve_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2')),
  '00000000-0000-0000-0000-0000000000c2'::uuid, 'la relance va à l''élève inactif');
select prive.planifier_notifications('2027-01-13 16:50+01');
select is((select count(*)::int from public.notification_planifiee where type = 'inactivite'
            and eleve_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2')), 1,
  'pas de deuxième relance avant 3 jours');

-- Type désactivé : le rappel de 17 h 50 (révision du soir) n'est pas planifié.
insert into public.preferences_notification (eleve_id, rappel_evenement) values ('00000000-0000-0000-0000-0000000000c1', false);
select prive.planifier_notifications('2027-01-12 17:45+01');
select is((select count(*)::int from public.notification_planifiee where evenement_id = '40000000-0000-0000-0000-0000000000c2'), 0,
  'un type désactivé n''est pas planifié');

-- C6, C7, nouvel essai en cours : élèves dédiés (d1 à d5), seuls comptés.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000d1', 'd1@test.local'), ('00000000-0000-0000-0000-0000000000d2', 'd2@test.local'),
  ('00000000-0000-0000-0000-0000000000d3', 'd3@test.local'), ('00000000-0000-0000-0000-0000000000d4', 'd4@test.local'),
  ('00000000-0000-0000-0000-0000000000d5', 'd5@test.local');
update public.profil set onboarding_termine = true, inscrit_le = '2027-02-01 10:00+01'
  where id in ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000d3',
               '00000000-0000-0000-0000-0000000000d5');
update public.profil set inscrit_le = '2027-02-01 10:00+01' where id = '00000000-0000-0000-0000-0000000000d4';
update public.profil set demande_enseignant = true, etablissement = 'Lycée test' where id = '00000000-0000-0000-0000-0000000000d5';
-- d1 : classe dont l'échéance (13 janvier 9 h 10) tombe avant la fin de l'essai + 24 h.
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000d1');
insert into public.tentative (eleve_id, type, cours_id, nb_questions, debut, fin, statut, note, reussie) values
  ('00000000-0000-0000-0000-0000000000d1', 'evaluation_cours', '20000000-0000-0000-0000-0000000000c1', 40,
   '2027-01-12 09:00+01', '2027-01-12 09:30+01', 'terminee', 40, false);
select prive.planifier_notifications('2027-01-13 09:25+01');
select is((select count(*)::int from public.notification_planifiee where eleve_id = '00000000-0000-0000-0000-0000000000d1' and type = 'nouvel_essai'), 0,
  'pas de nouvel essai si l''évaluation ferme avant');
-- d2 : un nouvel essai est déjà en cours.
insert into public.tentative (eleve_id, type, cours_id, nb_questions, debut, fin, statut, note, reussie) values
  ('00000000-0000-0000-0000-0000000000d2', 'evaluation_cours', '20000000-0000-0000-0000-0000000000c1', 40,
   '2027-01-14 07:00+01', '2027-01-14 08:00+01', 'terminee', 40, false);
insert into public.tentative (eleve_id, type, cours_id, nb_questions, debut, statut) values
  ('00000000-0000-0000-0000-0000000000d2', 'evaluation_cours', '20000000-0000-0000-0000-0000000000c1', 40, '2027-01-15 07:50+01', 'en_cours');
select prive.planifier_notifications('2027-01-15 08:00+01');
select is((select count(*)::int from public.notification_planifiee where eleve_id = '00000000-0000-0000-0000-0000000000d2' and type = 'nouvel_essai'), 0,
  'pas de nouvel essai si un essai est en cours');
-- d3, d4, d5 : quatre passages espacés de 3 jours.
select prive.planifier_notifications('2027-02-10 16:50+01');
select prive.planifier_notifications('2027-02-13 16:50+01');
select prive.planifier_notifications('2027-02-16 16:50+01');
select prive.planifier_notifications('2027-02-19 16:50+01');
select is((select count(*)::int from public.notification_planifiee where eleve_id = '00000000-0000-0000-0000-0000000000d3' and type = 'inactivite'), 3,
  'au plus trois relances d''inactivité sans activité');
select is((select count(*)::int from public.notification_planifiee where eleve_id in ('00000000-0000-0000-0000-0000000000d4', '00000000-0000-0000-0000-0000000000d5')
            and type = 'inactivite'), 0,
  'pas de relance sans accueil terminé ni pour une demande d''enseignant');

-- Envoi : une notification due maintenant, un appareil.
delete from public.notification_planifiee;
insert into public.abonnement_push (eleve_id, endpoint, p256dh, auth, appareil) values
  ('00000000-0000-0000-0000-0000000000c1', 'https://fcm.googleapis.com/fcm/send/c1', repeat('k', 87), repeat('a', 22), 'Test');
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu) values
  ('50000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c1', 'inactivite', 'test:1', 'On reprend', 'Corps', '/', now() - interval '1 minute'),
  ('50000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000c1', 'inactivite', 'test:2', 'Plus tard', 'Corps', '/', now() + interval '1 hour');
-- Le test écrit directement l'empreinte du secret (transaction annulée à la fin).
insert into prive.cle_envoi (id, empreinte) values (true, extensions.digest(repeat('s', 43), 'sha256'));
-- c1 a désactivé les rappels d'événements plus haut : on remet des préférences par défaut pour le silence.
delete from public.preferences_notification;

set local role anon;
select throws_ok($$ select * from public.envoi_reserver('mauvais-secret') $$, 'P0001', 'cle_envoi_invalide', 'secret refusé');
-- D'autres comptes locaux peuvent avoir des notifications dues : on ne garde que c1.
select results_eq($$ select id, jsonb_array_length(abonnements), silence_debut from public.envoi_reserver(repeat('s', 43))
                    where eleve_id = '00000000-0000-0000-0000-0000000000c1' $$,
  $$ values ('50000000-0000-0000-0000-0000000000c1'::uuid, 1, '22:00'::time) $$,
  'seule la notification due est réservée, avec l''appareil et le silence par défaut');
select is((select count(*)::int from public.envoi_reserver(repeat('s', 43)) where eleve_id = '00000000-0000-0000-0000-0000000000c1'), 0,
  'une notification réservée ne l''est pas deux fois');
select throws_ok($$ select public.envoi_terminer(repeat('s', 43), '[{"id":"50000000-0000-0000-0000-0000000000c1","issue":"perdue"}]'::jsonb, '{}') $$,
  'P0001', 'resultat_invalide', 'une issue inconnue est refusée');
select throws_ok($$ select public.envoi_terminer(repeat('s', 43), '[{"id":"pas-un-uuid","issue":"envoyee"}]'::jsonb, '{}') $$,
  'P0001', 'resultat_invalide', 'un identifiant invalide est refusé');
select throws_ok($$ select public.envoi_terminer(repeat('s', 43), '[{"id":"50000000-0000-0000-0000-0000000000c1","issue":"decaler","a":"pas une date"}]'::jsonb, '{}') $$,
  'P0001', 'resultat_invalide', 'une date invalide est refusée');
select throws_ok($$ select public.envoi_terminer(repeat('s', 43), '{"id":"x"}'::jsonb, '{}') $$,
  'P0001', 'resultat_invalide', 'des résultats qui ne sont pas un tableau sont refusés');
select lives_ok($$ select public.envoi_terminer(repeat('s', 43),
  '[{"id":"50000000-0000-0000-0000-0000000000c1","issue":"envoyee"}]'::jsonb, array['https://fcm.googleapis.com/fcm/send/c1']) $$,
  'les issues sont enregistrées');
select throws_ok($$ select count(*) from public.notification_planifiee $$, '42501', null, 'anon ne lit pas les notifications');
reset role;
select results_eq($$ select statut::text, envoyee_le is not null, reserve_jusqu_au is null from public.notification_planifiee
                    where id = '50000000-0000-0000-0000-0000000000c1' $$,
  $$ values ('envoyee', true, true) $$, 'notification marquée envoyée');
select is((select count(*)::int from public.abonnement_push where eleve_id = '00000000-0000-0000-0000-0000000000c1'), 0,
  'le point d''envoi expiré est supprimé');
select is((select count(*)::int from cron.job where jobname = 'purger-historique-cron'), 1, 'la purge de l''historique cron est planifiée');

select * from finish();
rollback;
