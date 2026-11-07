begin;
select plan(10);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000b1', 'eleve-ical@test.local'),
  ('00000000-0000-0000-0000-0000000000b2', 'prof-ical@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000b2';
insert into public.evenement (eleve_id, type, titre, debut, duree_minutes) values
  ('00000000-0000-0000-0000-0000000000b1', 'devoir', 'Exposé', now() + interval '2 days', 60);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select throws_ok($$ select public.creer_jeton_ical() $$, 'P0001', 'reserve_eleves', 'pas de lien iCal pour un enseignant');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
-- Le jeton en clair est gardé dans un réglage de la transaction (lisible quel que soit le rôle).
select set_config('test.jeton1', public.creer_jeton_ical(), true);
select matches(current_setting('test.jeton1'), '^[A-Za-z0-9_-]{43}$', 'jeton de 43 caractères base64url');
select isnt(public.mon_jeton_ical(), null, 'le lien est actif');

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*)::int from public.calendrier_ical(current_setting('test.jeton1')) where titre = 'Exposé'), 1,
  'le bon jeton donne les événements, sans connexion');
select throws_ok($$ select * from public.calendrier_ical('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') $$, 'P0001', 'jeton_inconnu', 'un jeton inconnu est refusé');
select throws_ok($$ select * from public.calendrier_ical('court') $$, 'P0001', 'jeton_inconnu', 'un jeton mal formé est refusé');
select throws_ok($$ select * from prive.jeton_ical $$, '42501', null, 'la table des jetons est inaccessible');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select set_config('test.jeton2', public.creer_jeton_ical(), true);
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select throws_ok(format('select * from public.calendrier_ical(%L)', current_setting('test.jeton1')),
  'P0001', 'jeton_inconnu', 'régénérer le lien désactive l''ancien');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select lives_ok($$ select public.revoquer_jeton_ical() $$, 'révocation');
select is(public.mon_jeton_ical(), null, 'plus de lien actif après la révocation');

select * from finish();
rollback;
