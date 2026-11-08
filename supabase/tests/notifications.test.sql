begin;
select plan(37);

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
   'Révisions du jour', '1 séance prévue aujourd’hui', '/', '2020-01-01 07:30+01'),
  ('00000000-0000-0000-0000-0000000000b1', 'echeance_proche', 'echeance:test', null,
   'Échéance', 'Elle ferme bientôt', '/', '2027-01-12 09:00+01');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b3","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_abonnement_push('https://fcm.googleapis.com/fcm/send/test-a', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'reserve_eleves', 'un enseignant n''enregistre pas d''appareil');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_abonnement_push('http://fcm.googleapis.com/fcm/send/test-a', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'abonnement_invalide', 'un point d''envoi non https est refusé');
select throws_ok($$ select public.enregistrer_abonnement_push('https://evil.example/x', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'abonnement_invalide', 'un hôte inconnu est refusé');
select throws_ok($$ select public.enregistrer_abonnement_push('https://fcm.googleapis.com.evil.example/x', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'abonnement_invalide', 'un hôte qui imite un service push est refusé');
select lives_ok($$ select public.enregistrer_abonnement_push('https://web.push.apple.com/abc', repeat('k', 87), repeat('a', 22), 'Safari') $$,
  'un hôte Apple est accepté');
select lives_ok($$ select public.enregistrer_abonnement_push('https://fcm.googleapis.com/fcm/send/test-a', repeat('k', 87), repeat('a', 22), 'Firefox sur Linux') $$,
  'l''élève enregistre un appareil');
select lives_ok($$ select public.supprimer_abonnement_push_endpoint('https://web.push.apple.com/abc') $$, 'retrait de l''appareil Apple');
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
select is((select count(*)::int from public.notification_planifiee where cle = 'echeance:test'), 0,
  'désactiver un type supprime ses notifications en attente');
select throws_ok($$ select public.enregistrer_preferences_notification('{"inactivite":"oui"}'::jsonb) $$,
  'P0001', 'preferences_invalides', 'un indicateur qui n''est pas booléen est refusé');
select throws_ok($$ select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000b1', 30) $$,
  'P0001', 'rappel_invalide', 'un délai hors liste est refusé');
select lives_ok($$ select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000b1', 60) $$,
  'l''élève règle le rappel de son événement');
select is((select count(*)::int from public.notification_planifiee where cle = 'rappel:test'), 0,
  'changer le rappel supprime les rappels planifiés non envoyés');
select lives_ok($$ select public.marquer_rappels_lus() $$, 'l''élève marque ses rappels comme lus');
select is((select lue_le is not null from public.notification_planifiee where cle = 'jour:2020-01-01'), true,
  'le rappel arrivé à échéance est lu');

-- Déplacer l'événement (modification directe) supprime ses rappels en attente.
reset role;
insert into public.notification_planifiee (eleve_id, type, cle, evenement_id, titre, corps, url, envoi_prevu) values
  ('00000000-0000-0000-0000-0000000000b1', 'rappel_evenement', 'rappel:maj', '40000000-0000-0000-0000-0000000000b1',
   'Devoir notif', 'Dans 1 heure', '/calendrier', '2027-01-12 17:00+01');
update public.evenement set debut = debut + interval '1 hour' where id = '40000000-0000-0000-0000-0000000000b1';
select is((select count(*)::int from public.notification_planifiee where cle = 'rappel:maj'), 0,
  'déplacer l''événement supprime son rappel en attente');
select is(has_column_privilege('authenticated', 'public.abonnement_push', 'p256dh', 'SELECT'), false,
  'les clés ne sont pas lisibles par authenticated');
select is(has_table_privilege('anon', 'public.notification_planifiee', 'SELECT'), false,
  'anon ne lit pas les notifications');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select lives_ok($$ select public.enregistrer_abonnement_push('https://fcm.googleapis.com/fcm/send/m-' || g, repeat('k', 87), repeat('a', 22), 'Appareil ' || g)
  from generate_series(1, 10) g $$, 'dix appareils de plus');
select is((select count(*)::int from public.abonnement_push), 10, 'onze enregistrements laissent dix appareils');
select throws_ok($$ select public.enregistrer_abonnement_push('https://evil.example\.push.apple.com/x', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'abonnement_invalide', 'point d''envoi piégé refusé 1');
select throws_ok($$ select public.enregistrer_abonnement_push('https://evil.example\.notify.windows.com', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'abonnement_invalide', 'point d''envoi piégé refusé 2');
select throws_ok($$ select public.enregistrer_abonnement_push('https://evil.example\.push.services.mozilla.com/x', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'abonnement_invalide', 'point d''envoi piégé refusé 3');
select throws_ok($$ select public.enregistrer_abonnement_push('https://.push.apple.com/x', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'abonnement_invalide', 'point d''envoi piégé refusé 4');
select throws_ok($$ select public.enregistrer_abonnement_push('https://fcm.googleapis.com/a b', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'abonnement_invalide', 'point d''envoi piégé refusé 5');
select lives_ok($$ select public.enregistrer_abonnement_push('https://FCM.googleapis.com/fcm/send/x', repeat('k', 87), repeat('a', 22), 'Majuscules') $$,
  'un hôte en majuscules est accepté');
select throws_ok($$ select public.enregistrer_preferences_notification('[1]'::jsonb) $$,
  'P0001', 'preferences_invalides', 'des préférences qui ne sont pas un objet sont refusées');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select throws_ok($$ select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000b1', 10) $$,
  'P0001', 'evenement_introuvable', 'un autre élève ne règle pas ce rappel');
reset role;
select set_config('test.abo_id', (select id::text from public.abonnement_push where eleve_id = '00000000-0000-0000-0000-0000000000b1' limit 1), true);
select set_config('test.abo_endpoint', (select endpoint from public.abonnement_push where eleve_id = '00000000-0000-0000-0000-0000000000b1' limit 1), true);
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select lives_ok($$ select public.supprimer_abonnement_push(current_setting('test.abo_id')::uuid) $$, 'un autre élève appelle la suppression par identifiant');
select lives_ok($$ select public.supprimer_abonnement_push_endpoint(current_setting('test.abo_endpoint')) $$, 'un autre élève appelle la suppression par point d''envoi');
reset role;
select is((select count(*)::int from public.abonnement_push where eleve_id = '00000000-0000-0000-0000-0000000000b1'), 10,
  'les appareils de l''élève sont intacts');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select is((select count(*)::int from public.notification_planifiee), 0, 'un autre élève ne lit pas ces rappels');

select * from finish();
rollback;
