begin;
select plan(16);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000b1', 'eleve-notif@test.local'),
  ('00000000-0000-0000-0000-0000000000b2', 'autre-notif@test.local'),
  ('00000000-0000-0000-0000-0000000000b3', 'prof-notif@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000b3';
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes) values
  ('40000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000b1', 'devoir', 'Devoir notif', '2027-01-12 18:00+01', 60);
insert into public.notification_planifiee (eleve_id, type, cle, evenement_id, titre, corps, url, envoi_prevu) values
  ('00000000-0000-0000-0000-0000000000b1', 'rappel_evenement', 'rappel:test', '40000000-0000-0000-0000-0000000000b1',
   'Devoir notif', 'Dans 1 heure', '/calendrier', '2027-01-12 17:00+01'),
  ('00000000-0000-0000-0000-0000000000b1', 'revision_du_jour', 'jour:2020-01-01', null,
   'Révisions du jour', '1 séance prévue aujourd’hui', '/', '2020-01-01 07:30+01');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b3","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_abonnement_push('https://push.example/a', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'reserve_eleves', 'un enseignant n''enregistre pas d''appareil');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_abonnement_push('http://push.example/a', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'abonnement_invalide', 'un point d''envoi non https est refusé');
select lives_ok($$ select public.enregistrer_abonnement_push('https://push.example/a', repeat('k', 87), repeat('a', 22), 'Firefox sur Linux') $$,
  'l''élève enregistre un appareil');
select results_eq($$ select appareil from public.abonnement_push $$, $$ values ('Firefox sur Linux') $$,
  'l''élève voit son appareil');
select throws_ok($$ select endpoint from public.abonnement_push $$, '42501', null,
  'le point d''envoi et les clés ne sont pas lisibles');
select throws_ok($$ insert into public.preferences_notification (eleve_id) values ('00000000-0000-0000-0000-0000000000b1') $$,
  '42501', null, 'pas d''écriture directe sur les préférences');
select throws_ok($$ select public.enregistrer_preferences_notification('{"silence_debut":"25:00"}'::jsonb) $$,
  'P0001', 'preferences_invalides', 'une heure invalide est refusée');
select lives_ok($$ select public.enregistrer_preferences_notification(
  '{"rappel_evenement":true,"echeance_proche":false,"nouvel_essai":true,"revision_du_jour":true,"inactivite":false,"silence_debut":"21:30","silence_fin":"07:15","jours_inactivite":5}'::jsonb) $$,
  'l''élève enregistre ses préférences');
select results_eq($$ select echeance_proche, inactivite, silence_debut, silence_fin, jours_inactivite from public.preferences_notification $$,
  $$ values (false, false, '21:30'::time, '07:15'::time, 5::smallint) $$, 'préférences relues');
select throws_ok($$ select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000b1', 30) $$,
  'P0001', 'rappel_invalide', 'un délai hors liste est refusé');
select lives_ok($$ select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000b1', 60) $$,
  'l''élève règle le rappel de son événement');
select is((select count(*)::int from public.notification_planifiee where cle = 'rappel:test'), 0,
  'changer le rappel supprime les rappels planifiés non envoyés');
select lives_ok($$ select public.marquer_rappels_lus() $$, 'l''élève marque ses rappels comme lus');
select is((select lue_le is not null from public.notification_planifiee where cle = 'jour:2020-01-01'), true,
  'le rappel arrivé à échéance est lu');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select throws_ok($$ select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000b1', 10) $$,
  'P0001', 'evenement_introuvable', 'un autre élève ne règle pas ce rappel');
select is((select count(*)::int from public.notification_planifiee), 0, 'un autre élève ne lit pas ces rappels');

select * from finish();
rollback;
