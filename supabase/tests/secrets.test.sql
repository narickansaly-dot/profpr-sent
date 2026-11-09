begin;
select plan(19);

-- Revue finale 5a : secret d'envoi dans Vault, secret de consentement distinct, en_essai, limite par adresse,
-- questions libérées à la purge d'un enseignant qui les avait signalées.

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000005d1', 'secret-jeune1@test.local'),
  ('00000000-0000-0000-0000-0000000005d2', 'secret-jeune2@test.local'),
  ('00000000-0000-0000-0000-0000000005d3', 'secret-jeune3@test.local'),
  ('00000000-0000-0000-0000-0000000005d4', 'secret-jeune4@test.local'),
  ('00000000-0000-0000-0000-0000000005d5', 'secret-grand@test.local'),
  ('00000000-0000-0000-0000-0000000005d6', 'secret-prof-purge@test.local'),
  ('00000000-0000-0000-0000-0000000005d7', 'secret-prof-reste@test.local');
update public.profil set onboarding_termine = true, moins_de_15_ans = true, nom = 'Jeune'
 where id in ('00000000-0000-0000-0000-0000000005d1', '00000000-0000-0000-0000-0000000005d2',
              '00000000-0000-0000-0000-0000000005d3', '00000000-0000-0000-0000-0000000005d4');
update public.profil set onboarding_termine = true, moins_de_15_ans = false where id = '00000000-0000-0000-0000-0000000005d5';
update public.profil set role = 'enseignant' where id in ('00000000-0000-0000-0000-0000000005d6', '00000000-0000-0000-0000-0000000005d7');

-- 1. Secret d'envoi : rangé dans Vault, jamais dans la commande de la tâche.
select public.configurer_envoi('http://host.docker.internal:3000/api/notifications/envoyer', repeat('e', 43));
select public.configurer_envoi('http://host.docker.internal:3000/api/notifications/envoyer', repeat('f', 43));
select is((select count(*)::int from cron.job where jobname = 'envoi-notifications' and (command like '%eeee%' or command like '%ffff%')), 0,
  'la commande de la tâche d''envoi ne contient pas le secret');
select is((select count(*)::int from cron.job where jobname = 'envoi-notifications' and command like '%vault.decrypted_secrets%'), 1,
  'la commande lit le secret dans Vault au moment de l''exécution');
select is((select decrypted_secret from vault.decrypted_secrets where name = 'envoi_secret'), repeat('f', 43),
  'le secret rangé dans Vault est le dernier configuré');
select is((select count(*)::int from vault.secrets where name = 'envoi_secret'), 1, 'une seule entrée Vault pour le secret d''envoi');
select lives_ok($$ select prive.verifier_cle_envoi(repeat('f', 43)) $$, 'l''empreinte du secret d''envoi est à jour');

-- 2. Secret de consentement distinct.
select throws_ok($$ select public.configurer_consentement(repeat('c', 10)) $$, 'P0001', 'configuration_invalide', 'secret de consentement trop court refusé');
select lives_ok($$ select public.configurer_consentement(repeat('c', 43)) $$, 'secret de consentement enregistré');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d1","role":"authenticated"}', true);
select throws_ok($$ select public.configurer_consentement(repeat('c', 43)) $$, '42501', null, 'un compte ne configure pas le secret de consentement');
select is(public.en_essai(), false, 'moins de 15 ans sans accord : pas d''essai');
select public.demander_consentement('parent-d1@example.fr');

reset role;
set local role anon;
select throws_ok($$ select * from public.emettre_jeton_consentement(repeat('f', 43), '00000000-0000-0000-0000-0000000005d1') $$,
  'P0001', 'cle_consentement_invalide', 'le secret d''envoi n''émet plus de jeton de consentement');
select lives_ok($$ select set_config('test.jeton_d1', (select jeton from public.emettre_jeton_consentement(repeat('c', 43), '00000000-0000-0000-0000-0000000005d1')), true) $$,
  'le secret de consentement émet le jeton');
select lives_ok(format('select public.donner_consentement(%L)', current_setting('test.jeton_d1')), 'le parent donne son accord');

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d1","role":"authenticated"}', true);
select is(public.en_essai(), true, 'après l''accord, l''essai commence');

-- 3. Au plus 3 demandes par jour vers une même adresse, tous comptes confondus.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select public.demander_consentement('Partage@Example.fr');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d3","role":"authenticated"}', true);
select public.demander_consentement('partage@example.fr');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d4","role":"authenticated"}', true);
select lives_ok($$ select public.demander_consentement('partage@example.fr ') $$, '3e demande du jour vers la même adresse acceptée');
reset role;
update public.consentement_parental set dernier_envoi_le = now() - interval '1 hour' where eleve_id = '00000000-0000-0000-0000-0000000005d2';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select throws_ok($$ select public.demander_consentement('partage@example.fr') $$, 'P0001', 'envois_epuises',
  'une 4e demande du jour vers la même adresse est refusée, quel que soit le compte');
select lives_ok($$ select public.demander_consentement('autre-d2@example.fr') $$, 'une autre adresse reste possible');

-- 4. Purge : la question signalée par l'enseignant purgé seulement redevient « valide ».
reset role;
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005d1', 'technologique', 'SEC', 'Filière secrets');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005d1', 'cours-secrets', '10000000-0000-0000-0000-0000000005d1', '1re', 'S', 'Cours secrets', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000005d1', '20000000-0000-0000-0000-0000000005d1', 'ch-secrets', 1, 'Chapitre secrets', true);
insert into public.question (id, chapitre_id, type, enonce, propositions, statut, source, modifie_le) values
  ('40000000-0000-0000-0000-0000000005d1', '30000000-0000-0000-0000-0000000005d1', 'qcm_unique', 'Signalée par le seul compte purgé', '["a","b"]', 'a_relire', 'sec:1', now() - interval '40 days'),
  ('40000000-0000-0000-0000-0000000005d2', '30000000-0000-0000-0000-0000000005d1', 'qcm_unique', 'Signalée aussi par un autre', '["a","b"]', 'a_relire', 'sec:2', now() - interval '40 days');
insert into public.signalement (question_id, auteur_id, commentaire, cree_le) values
  ('40000000-0000-0000-0000-0000000005d1', '00000000-0000-0000-0000-0000000005d6', 'Réponse fausse', now() - interval '35 days'),
  ('40000000-0000-0000-0000-0000000005d2', '00000000-0000-0000-0000-0000000005d6', 'Réponse fausse', now() - interval '35 days'),
  ('40000000-0000-0000-0000-0000000005d2', '00000000-0000-0000-0000-0000000005d7', 'Énoncé ambigu', now() - interval '34 days');
update public.profil set suppression_demandee_le = now() - interval '31 days' where id = '00000000-0000-0000-0000-0000000005d6';
insert into prive.envoi_consentement_adresse (email_hash, jour, nombre) values
  (extensions.digest('hier-d@example.fr', 'sha256'), (now() at time zone 'Europe/Paris')::date - 1, 2);
select prive.purges_quotidiennes();
select is((select statut::text from public.question where id = '40000000-0000-0000-0000-0000000005d1'), 'valide',
  'la question signalée par le seul enseignant purgé redevient valide');
select is((select statut::text from public.question where id = '40000000-0000-0000-0000-0000000005d2'), 'a_relire',
  'la question encore signalée par un autre enseignant reste à relire');
select is((select count(*)::int from prive.envoi_consentement_adresse where email_hash = extensions.digest('hier-d@example.fr', 'sha256')), 0,
  'les compteurs par adresse des jours passés sont purgés');

select * from finish();
rollback;
