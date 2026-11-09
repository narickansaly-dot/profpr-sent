begin;
select plan(37);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000005b1', 'jeune@test.local'),
  ('00000000-0000-0000-0000-0000000005b2', 'grand@test.local'),
  ('00000000-0000-0000-0000-0000000005b3', 'neuf@test.local');
update public.profil set onboarding_termine = true, moins_de_15_ans = true, nom = 'Léa', inscrit_le = now() - interval '10 days'
 where id = '00000000-0000-0000-0000-0000000005b1';
update public.profil set onboarding_termine = true, moins_de_15_ans = false where id = '00000000-0000-0000-0000-0000000005b2';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005b1', 'technologique', 'CSP', 'Filière consentement');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005b1', 'cours-consentement', '10000000-0000-0000-0000-0000000005b1', '1re', 'C', 'Cours consentement', true);
-- Le test écrit directement l'empreinte du secret (transaction annulée à la fin) ; une base locale configurée en a déjà une.
delete from prive.cle_envoi;
insert into prive.cle_envoi (id, empreinte) values (true, extensions.digest(repeat('s', 43), 'sha256'));

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), false, 'moins de 15 ans sans accord : aucun cours');
select is((select consentement_requis from public.mon_acces()), true, 'mon_acces signale le consentement requis');
select is((select en_essai from public.mon_acces()), false, 'sans accord, mon_acces ne montre aucun essai');
select is((select fin_essai from public.mon_acces()), null, 'sans accord, mon_acces ne donne aucune fin d''essai');
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005b1') $$, 'P0001', 'consentement_requis', 'sans accord, pas de choix de cours gratuit');
select throws_ok($$ update public.profil set moins_de_15_ans = false where id = '00000000-0000-0000-0000-0000000005b1' $$,
  'P0001', 'age_verrouille', 'l''âge ne change plus après l''inscription');
select lives_ok($$ update public.profil set onboarding_termine = false where id = '00000000-0000-0000-0000-0000000005b1' $$, 'inscription rouverte');
select throws_ok($$ update public.profil set moins_de_15_ans = false where id = '00000000-0000-0000-0000-0000000005b1' $$,
  'P0001', 'age_verrouille', 'l''âge reste verrouillé même si onboarding_termine repasse à faux');
select lives_ok($$ update public.profil set onboarding_termine = true where id = '00000000-0000-0000-0000-0000000005b1' $$, 'inscription refermée');
select throws_ok($$ select public.demander_consentement('pas-une-adresse') $$, 'P0001', 'email_parent_invalide', 'adresse refusée');
select lives_ok($$ select public.demander_consentement('  Parent@Example.FR ') $$, 'demande enregistrée');
select is((select email_parent from public.consentement_parental), 'parent@example.fr', 'adresse nettoyée et en minuscules');
select throws_ok($$ select public.demander_consentement('parent@example.fr') $$, 'P0001', 'envoi_trop_rapproche', 'pas deux envois en 10 minutes');
select throws_ok($$ select jeton_empreinte from public.consentement_parental $$, '42501', null, 'l''empreinte du jeton n''est pas lisible');
select throws_ok($$ select * from public.emettre_jeton_consentement(repeat('s', 43), '00000000-0000-0000-0000-0000000005b1') $$,
  '42501', null, 'l''élève ne peut pas obtenir le jeton');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b2","role":"authenticated"}', true);
select throws_ok($$ select public.demander_consentement('parent@example.fr') $$, 'P0001', 'consentement_inutile', 'pas de demande pour un élève de 15 ans ou plus');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b3","role":"authenticated"}', true);
select lives_ok($$ update public.profil set moins_de_15_ans = true, nom = 'Neuf' where id = '00000000-0000-0000-0000-0000000005b3' $$, 'l''âge se renseigne une première fois');

reset role;
set local role anon;
select throws_ok($$ select * from public.emettre_jeton_consentement('mauvais-secret', '00000000-0000-0000-0000-0000000005b1') $$,
  'P0001', 'cle_envoi_invalide', 'mauvais secret refusé');
select throws_ok($$ select * from public.emettre_jeton_consentement(repeat('s', 43), '00000000-0000-0000-0000-0000000005b2') $$,
  'P0001', 'lien_consentement_invalide', 'aucune demande en attente : refusé');
select lives_ok($$ select set_config('test.jeton', (select jeton from public.emettre_jeton_consentement(repeat('s', 43), '00000000-0000-0000-0000-0000000005b1')), true) $$,
  'le bon secret délivre le jeton');
select throws_ok($$ select * from public.emettre_jeton_consentement(repeat('s', 43), '00000000-0000-0000-0000-0000000005b1') $$,
  'P0001', 'lien_consentement_invalide', 'un seul jeton par demande');
select throws_ok($$ select * from public.lire_demande_consentement('mauvais') $$, 'P0001', 'lien_consentement_invalide', 'jeton mal formé refusé');
select results_eq(format('select prenom, deja_donne from public.lire_demande_consentement(%L)', current_setting('test.jeton')),
  $$ values ('Léa'::text, false) $$, 'le parent voit le prénom');
select is(public.donner_consentement(current_setting('test.jeton')), 'Léa', 'le parent donne son accord');
select results_eq(format('select deja_donne from public.lire_demande_consentement(%L)', current_setting('test.jeton')),
  $$ values (true) $$, 'l''accord est enregistré');

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), true, 'après l''accord, l''essai s''applique');
select ok((select fin_essai from public.mon_acces()) > now() + interval '6 days', 'l''essai démarre à l''accord, pas à l''inscription');
select throws_ok($$ select public.demander_consentement('autre@example.fr') $$, 'P0001', 'consentement_deja_donne', 'plus de demande après l''accord');

-- Lien expiré : demande de plus de 7 jours, sans accord.
reset role;
update public.consentement_parental set donne_le = null, demande_le = now() - interval '8 days'
 where eleve_id = '00000000-0000-0000-0000-0000000005b1';
set local role anon;
select throws_ok(format('select public.donner_consentement(%L)', current_setting('test.jeton')),
  'P0001', 'lien_consentement_invalide', 'un lien de plus de 7 jours ne vaut plus');

-- Un renvoi invalide l'ancien lien.
reset role;
update public.consentement_parental set dernier_envoi_le = now() - interval '1 hour' where eleve_id = '00000000-0000-0000-0000-0000000005b1';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b1","role":"authenticated"}', true);
select lives_ok($$ select public.demander_consentement('nouveau@example.fr') $$, 'renvoi accepté');
reset role;
set local role anon;
select throws_ok(format('select * from public.lire_demande_consentement(%L)', current_setting('test.jeton')),
  'P0001', 'lien_consentement_invalide', 'l''ancien jeton ne se lit plus après un renvoi');
select throws_ok(format('select public.donner_consentement(%L)', current_setting('test.jeton')),
  'P0001', 'lien_consentement_invalide', 'l''ancien jeton ne donne plus l''accord après un renvoi');
select lives_ok($$ select * from public.emettre_jeton_consentement(repeat('s', 43), '00000000-0000-0000-0000-0000000005b1') $$, 'un nouveau jeton est émis après le renvoi');

-- Une demande de plus de 7 jours n'émet plus de jeton.
reset role;
update public.consentement_parental set jeton_empreinte = null, demande_le = now() - interval '8 days' where eleve_id = '00000000-0000-0000-0000-0000000005b1';
set local role anon;
select throws_ok($$ select * from public.emettre_jeton_consentement(repeat('s', 43), '00000000-0000-0000-0000-0000000005b1') $$,
  'P0001', 'lien_consentement_invalide', 'pas de jeton pour une demande de plus de 7 jours');

-- Au plus 5 envois par jour, remis à zéro le lendemain.
reset role;
update public.consentement_parental set demande_le = now(), dernier_envoi_le = now() - interval '1 hour', envois_du_jour = 5,
  jour_envois = (now() at time zone 'Europe/Paris')::date where eleve_id = '00000000-0000-0000-0000-0000000005b1';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b1","role":"authenticated"}', true);
select throws_ok($$ select public.demander_consentement('nouveau@example.fr') $$, 'P0001', 'envois_epuises', 'pas de 6e envoi dans la journée');
reset role;
update public.consentement_parental set jour_envois = jour_envois - 1 where eleve_id = '00000000-0000-0000-0000-0000000005b1';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b1","role":"authenticated"}', true);
select lives_ok($$ select public.demander_consentement('nouveau@example.fr') $$, 'le lendemain, l''envoi est de nouveau possible');
reset role;
select is((select envois_du_jour::int from public.consentement_parental where eleve_id = '00000000-0000-0000-0000-0000000005b1'), 1, 'le compteur repart à 1');

select * from finish();
rollback;
