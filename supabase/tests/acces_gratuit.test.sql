begin;
select plan(24);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000005a1', 'fin-essai@test.local'),
  ('00000000-0000-0000-0000-0000000005a2', 'en-essai@test.local'),
  ('00000000-0000-0000-0000-0000000005a3', 'choix-ancien@test.local'),
  ('00000000-0000-0000-0000-0000000005a4', 'prof-acces@test.local'),
  ('00000000-0000-0000-0000-0000000005a5', 'reprise@test.local'),
  ('00000000-0000-0000-0000-0000000005a6', 'cours-retire@test.local');
insert into public.filiere (id, voie, code, nom) values
  ('10000000-0000-0000-0000-0000000005a1', 'technologique', 'ACG', 'Filière accès'),
  ('10000000-0000-0000-0000-0000000005a2', 'technologique', 'ACH', 'Autre filière accès');
update public.profil set onboarding_termine = true, inscrit_le = now() - interval '10 days',
       filiere_id = '10000000-0000-0000-0000-0000000005a1', niveau_code = '1re'
 where id in ('00000000-0000-0000-0000-0000000005a1', '00000000-0000-0000-0000-0000000005a3', '00000000-0000-0000-0000-0000000005a6');
update public.profil set onboarding_termine = true, inscrit_le = now() - interval '7 days 1 hour',
       filiere_id = '10000000-0000-0000-0000-0000000005a1', niveau_code = '1re'
 where id = '00000000-0000-0000-0000-0000000005a5';
update public.profil set onboarding_termine = true, filiere_id = '10000000-0000-0000-0000-0000000005a1', niveau_code = '1re'
 where id = '00000000-0000-0000-0000-0000000005a2';
update public.profil set role = 'enseignant', onboarding_termine = true where id = '00000000-0000-0000-0000-0000000005a4';
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005a1', 'cours-acces-a', '10000000-0000-0000-0000-0000000005a1', '1re', 'A', 'Cours A', true),
  ('20000000-0000-0000-0000-0000000005a2', 'cours-acces-b', '10000000-0000-0000-0000-0000000005a1', '1re', 'B', 'Cours B', true),
  ('20000000-0000-0000-0000-0000000005a3', 'cours-acces-c', '10000000-0000-0000-0000-0000000005a1', '1re', 'C', 'Cours C', false),
  ('20000000-0000-0000-0000-0000000005a4', 'cours-acces-d', '10000000-0000-0000-0000-0000000005a2', '1re', 'D', 'Cours D', true),
  ('20000000-0000-0000-0000-0000000005a5', 'cours-acces-e', '10000000-0000-0000-0000-0000000005a1', '1re', 'E', 'Cours E', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000005a1', '20000000-0000-0000-0000-0000000005a1', 'ch1', 1, 'Chapitre A1', true);
-- a3 a choisi le cours A il y a 3 jours, sans avoir utilisé son changement.
insert into public.acces_gratuit (eleve_id, cours_id, choisi_le) values
  ('00000000-0000-0000-0000-0000000005a3', '20000000-0000-0000-0000-0000000005a1', now() - interval '3 days'),
  ('00000000-0000-0000-0000-0000000005a6', '20000000-0000-0000-0000-0000000005a5', now() - interval '5 days');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a2","role":"authenticated"}', true);
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a1') $$,
  'P0001', 'essai_en_cours', 'pas de choix pendant l''essai');
select results_eq($$ select en_essai, fin_essai is not null, cours_gratuit_id is null from public.mon_acces() $$,
  $$ values (true, true, true) $$, 'mon_acces pendant l''essai');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a4","role":"authenticated"}', true);
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a1') $$,
  'P0001', 'reserve_eleves', 'un enseignant ne choisit pas de cours gratuit');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), false, 'après l''essai, sans choix : aucun cours');
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a3') $$,
  'P0001', 'cours_indisponible', 'un cours non publié ne se choisit pas');
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a4') $$,
  'P0001', 'cours_hors_filiere', 'un cours d''une autre filière ne se choisit pas');
select lives_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a1') $$, 'premier choix');
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), true, 'le cours choisi est ouvert');
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a2'), false, 'les autres restent fermés');
select lives_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a2') $$, 'un changement dans les 48 heures');
select results_eq($$ select public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), public.peut_lire_cours('20000000-0000-0000-0000-0000000005a2') $$,
  $$ values (false, true) $$, 'le nouveau cours remplace l''ancien');
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a1') $$,
  'P0001', 'choix_definitif', 'un seul changement');
select results_eq($$ select cours_gratuit_id, changement_possible_jusqu_au is null, en_essai from public.mon_acces() $$,
  $$ values ('20000000-0000-0000-0000-0000000005a2'::uuid, true, false) $$, 'mon_acces reflète le choix');
select throws_ok($$ insert into public.acces_gratuit (eleve_id, cours_id) values ('00000000-0000-0000-0000-0000000005a1', '20000000-0000-0000-0000-0000000005a1') $$,
  '42501', null, 'pas d''écriture directe');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a3","role":"authenticated"}', true);
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a2') $$,
  'P0001', 'choix_definitif', 'après 48 heures, le choix est définitif');

-- Reprise de 24 heures : seulement pour une tentative commencée pendant l'essai (fin de l'essai il y a 1 heure).
reset role;
insert into public.tentative (eleve_id, type, cours_id, nb_questions, debut, date_limite, statut) values
  ('00000000-0000-0000-0000-0000000005a5', 'evaluation_cours', '20000000-0000-0000-0000-0000000005a1', 40, now() - interval '90 minutes', now() + interval '1 hour', 'en_cours');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a5","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), true,
  'une tentative commencée pendant l''essai, il y a moins de 24 heures, garde l''accès');
select throws_ok($$ select public.demarrer_quiz('30000000-0000-0000-0000-0000000005a1', 15) $$,
  'P0001', 'acces_refuse', 'pendant une reprise, on ne démarre pas de nouveau quiz');
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000005a1') $$,
  'P0001', 'acces_refuse', 'pendant une reprise, on ne démarre pas de nouvelle évaluation');
reset role;
update public.tentative set debut = now() - interval '10 minutes' where eleve_id = '00000000-0000-0000-0000-0000000005a5';
set local role authenticated;
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), false,
  'une tentative commencée après la fin de l''essai ne donne pas accès');
reset role;
update public.tentative set debut = now() - interval '25 hours' where eleve_id = '00000000-0000-0000-0000-0000000005a5';
set local role authenticated;
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), false, 'au-delà de 24 heures, plus d''accès');

-- Cours gratuit retiré de la publication : l'élève doit en choisir un autre, sans consommer son changement.
reset role;
update public.cours set publie = false where id = '20000000-0000-0000-0000-0000000005a5';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a6","role":"authenticated"}', true);
select results_eq($$ select cours_gratuit_id is null, changement_possible_jusqu_au is null from public.mon_acces() $$,
  $$ values (true, true) $$, 'un cours gratuit dépublié compte comme aucun choix');
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a5'), false, 'le cours dépublié est fermé');
select lives_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a2') $$,
  'nouveau choix possible hors délai quand le cours a été retiré');
reset role;
select results_eq($$ select cours_id, change_utilise from public.acces_gratuit where eleve_id = '00000000-0000-0000-0000-0000000005a6' $$,
  $$ values ('20000000-0000-0000-0000-0000000005a2'::uuid, false) $$, 'ce changement ne consomme pas le changement unique');

select * from finish();
rollback;
