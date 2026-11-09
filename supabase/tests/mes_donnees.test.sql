begin;
select plan(37);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000005c1', 'eleve-donnees@test.local'),
  ('00000000-0000-0000-0000-0000000005c2', 'prof-donnees@test.local'),
  ('00000000-0000-0000-0000-0000000005c3', 'autre-donnees@test.local'),
  ('00000000-0000-0000-0000-0000000005c5', 'prof-reste@test.local');
update public.profil set role = 'enseignant', nom = 'Prof Données' where id = '00000000-0000-0000-0000-0000000005c2';
update public.profil set role = 'enseignant', nom = 'Prof Reste' where id = '00000000-0000-0000-0000-0000000005c5';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005c1', 'technologique', 'DON', 'Filière données');
update public.profil set onboarding_termine = true, nom = 'Camille', filiere_id = '10000000-0000-0000-0000-0000000005c1', niveau_code = '1re',
  moins_de_15_ans = true where id = '00000000-0000-0000-0000-0000000005c1';
update public.profil set onboarding_termine = true, nom = 'Autre' where id = '00000000-0000-0000-0000-0000000005c3';

insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005c1', 'cours-donnees', '10000000-0000-0000-0000-0000000005c1', '1re', 'D', 'Cours données', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000005c1', '20000000-0000-0000-0000-0000000005c1', 'ch-donnees', 1, 'Chapitre données', true);
insert into public.question (id, chapitre_id, type, enonce, propositions, statut, source) values
  ('40000000-0000-0000-0000-0000000005c1', '30000000-0000-0000-0000-0000000005c1', 'qcm_unique', 'Énoncé un', '["a","b"]', 'valide', 'don:1'),
  ('40000000-0000-0000-0000-0000000005c2', '30000000-0000-0000-0000-0000000005c1', 'qcm_unique', 'Énoncé deux', '["a","b"]', 'valide', 'don:2');

-- Classe de l'enseignant 5c2 (élève 5c1 inscrit) ; classes de l'enseignant 5c5 (départs de 5c3).
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c2', 'Classe données', 'BCDFG2'),
  ('60000000-0000-0000-0000-0000000005c2', '00000000-0000-0000-0000-0000000005c5', 'Classe ancienne', 'CDFGH3'),
  ('60000000-0000-0000-0000-0000000005c3', '00000000-0000-0000-0000-0000000005c5', 'Classe récente', 'DFGHJ4');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c1');
insert into prive.depart_classe (classe_id, eleve_id, quitte_le) values
  ('60000000-0000-0000-0000-0000000005c2', '00000000-0000-0000-0000-0000000005c3', now() - interval '35 days'),
  ('60000000-0000-0000-0000-0000000005c3', '00000000-0000-0000-0000-0000000005c3', now() - interval '2 days'),
  ('60000000-0000-0000-0000-0000000005c2', '00000000-0000-0000-0000-0000000005c1', now() - interval '3 days');

insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions, statut, note, reussie, fin) values
  ('70000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c1', 'quiz_chapitre', '20000000-0000-0000-0000-0000000005c1',
   '30000000-0000-0000-0000-0000000005c1', 2, 'terminee', 50, false, now()),
  ('70000000-0000-0000-0000-0000000005c3', '00000000-0000-0000-0000-0000000005c3', 'quiz_chapitre', '20000000-0000-0000-0000-0000000005c1',
   '30000000-0000-0000-0000-0000000005c1', 2, 'terminee', 100, true, now());
insert into public.tentative_question (tentative_id, ordre, question_id, reponse, correcte) values
  ('70000000-0000-0000-0000-0000000005c1', 1, '40000000-0000-0000-0000-0000000005c1', '0', true),
  ('70000000-0000-0000-0000-0000000005c1', 2, '40000000-0000-0000-0000-0000000005c2', '1', false),
  ('70000000-0000-0000-0000-0000000005c3', 1, '40000000-0000-0000-0000-0000000005c1', '0', true);
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide) values
  ('00000000-0000-0000-0000-0000000005c1', '30000000-0000-0000-0000-0000000005c1', 50, false),
  ('00000000-0000-0000-0000-0000000005c3', '30000000-0000-0000-0000-0000000005c1', 100, true);
insert into public.progression_cours (eleve_id, cours_id, essais) values ('00000000-0000-0000-0000-0000000005c1', '20000000-0000-0000-0000-0000000005c1', 1);
insert into public.historique_question (eleve_id, question_id, vue, ratee) values
  ('00000000-0000-0000-0000-0000000005c1', '40000000-0000-0000-0000-0000000005c2', 1, 1);
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes) values
  ('80000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c1', 'revision', 'Révision données', now() + interval '1 day', 30),
  ('80000000-0000-0000-0000-0000000005c3', '00000000-0000-0000-0000-0000000005c3', 'revision', 'Révision autre', now() + interval '1 day', 30);
insert into public.evenement_chapitre values ('80000000-0000-0000-0000-0000000005c1', '30000000-0000-0000-0000-0000000005c1');
insert into public.plan_revision (eleve_id, examen_id, sessions_par_semaine, duree_minutes, jours_preferes, heure_debut, statut)
  select '00000000-0000-0000-0000-0000000005c1', '80000000-0000-0000-0000-0000000005c1', 2, 30, '{1,3}', '18:00', 'accepte';
insert into public.preferences_notification (eleve_id) values ('00000000-0000-0000-0000-0000000005c1');
insert into public.abonnement_push (eleve_id, endpoint, p256dh, auth, appareil) values
  ('00000000-0000-0000-0000-0000000005c1', 'https://push.example/secret-endpoint-5c1', repeat('P', 30), repeat('A', 20), 'Téléphone de Camille');
insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu) values
  ('00000000-0000-0000-0000-0000000005c1', 'revision_du_jour', 'don-1', 'Titre rappel', 'Corps rappel', '/', now() + interval '1 hour');
insert into public.acces_gratuit (eleve_id, cours_id) values ('00000000-0000-0000-0000-0000000005c1', '20000000-0000-0000-0000-0000000005c1');
insert into public.consentement_parental (eleve_id, email_parent, jeton_empreinte, donne_le)
  values ('00000000-0000-0000-0000-0000000005c1', 'parent-donnees@example.fr', '\xdeadbeef', now());
insert into prive.essai_code (eleve_id) values ('00000000-0000-0000-0000-0000000005c1');
insert into prive.jeton_ical (eleve_id, empreinte) values ('00000000-0000-0000-0000-0000000005c1', '\xcafebabe');
insert into public.signalement (question_id, auteur_id, commentaire) values
  ('40000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c2', 'Énoncé ambigu, à revoir.');

-- 1 à 8 : export d'un élève.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c1","role":"authenticated"}', true);
select set_config('test.export_eleve', public.exporter_mes_donnees()::text, true);
select is(array(select k from jsonb_object_keys(current_setting('test.export_eleve')::jsonb) k order by k collate "C"),
  array['abonnement','acces_gratuit','appareils','classes','classes_creees','consentement','departs_classe','enfants_suivis','essais_code_classe','evenements','historique_questions','notifications',
        'parents_relies','plans_revision','preferences_notification','profil','progression_chapitres','progression_cours','retrait_consentement','retraits_classe','signalements','signalements_traites','tentatives'],
  'l''export a toutes les rubriques');
select is(current_setting('test.export_eleve')::jsonb->'profil'->>'email', 'eleve-donnees@test.local', 'le profil de l''appelant');
select is(jsonb_array_length(current_setting('test.export_eleve')::jsonb->'tentatives'), 1, 'une seule tentative exportée');
select is(jsonb_array_length(current_setting('test.export_eleve')::jsonb->'tentatives'->0->'questions'), 2, 'la tentative contient ses questions et réponses');
select is(jsonb_array_length(current_setting('test.export_eleve')::jsonb->'evenements'), 1, 'son événement est exporté, pas celui d''un autre');
select is(position('5c3' in current_setting('test.export_eleve')), 0, 'rien de l''autre élève');
select is(current_setting('test.export_eleve')::jsonb->'appareils'->0, jsonb_build_object('appareil', 'Téléphone de Camille', 'cree_le', current_setting('test.export_eleve')::jsonb->'appareils'->0->'cree_le'),
  'appareils : libellé et date seulement');
select is(current_setting('test.export_eleve') ~ 'secret-endpoint|jeton|p256dh|deadbeef|cafebabe', false, 'aucun secret dans l''export (endpoint, clés, jetons)');
select is(current_setting('test.export_eleve')::jsonb->'consentement'->>'email_parent', 'parent-donnees@example.fr', 'le consentement est exporté sans empreinte');
select is(jsonb_array_length(current_setting('test.export_eleve')::jsonb->'departs_classe'), 1, 'ses départs de classe');

select is(jsonb_array_length(current_setting('test.export_eleve')::jsonb->'essais_code_classe'), 1, 'ses essais de code de classe (dates seulement)');
select is(current_setting('test.export_eleve')::jsonb->'profil'->>'onboarding_termine', 'true', 'le profil indique l''inscription terminée');

-- Garde de l'évaluation : un quiz en cours n'expose ni réponse ni justesse ; une évaluation ouverte bloque l'export.
reset role;
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions, statut) values
  ('70000000-0000-0000-0000-0000000005c4', '00000000-0000-0000-0000-0000000005c1', 'quiz_chapitre', '20000000-0000-0000-0000-0000000005c1',
   '30000000-0000-0000-0000-0000000005c1', 1, 'en_cours');
insert into public.tentative_question (tentative_id, ordre, question_id, reponse, correcte) values
  ('70000000-0000-0000-0000-0000000005c4', 1, '40000000-0000-0000-0000-0000000005c1', '0', true);
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c1","role":"authenticated"}', true);
select is(jsonb_path_exists(public.exporter_mes_donnees(),
  '$.tentatives[*] ? (@.statut == "en_cours").questions[*] ? (exists(@.reponse) || exists(@.correcte))'), false,
  'une tentative en cours ne livre ni réponse ni justesse');
reset role;
insert into public.tentative (id, eleve_id, type, cours_id, nb_questions, statut, date_limite) values
  ('70000000-0000-0000-0000-0000000005c5', '00000000-0000-0000-0000-0000000005c1', 'evaluation_cours', '20000000-0000-0000-0000-0000000005c1',
   1, 'en_cours', now() + interval '1 hour');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c1","role":"authenticated"}', true);
select throws_ok($$ select public.exporter_mes_donnees() $$, 'P0001', 'evaluation_en_cours', 'export refusé pendant une évaluation ouverte');
reset role;
update public.tentative set date_limite = now() - interval '1 minute' where id = '70000000-0000-0000-0000-0000000005c5';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c1","role":"authenticated"}', true);
select lives_ok($$ select public.exporter_mes_donnees() $$, 'export possible une fois l''évaluation expirée');

-- 9 à 12 : demande et annulation.
select ok(public.demander_suppression_compte() between now() + interval '30 days' - interval '1 minute' and now() + interval '30 days' + interval '1 minute',
  'la suppression est prévue dans 30 jours');
select isnt((select suppression_demandee_le from public.profil where id = '00000000-0000-0000-0000-0000000005c1'), null, 'la demande est enregistrée');
select is(public.demander_suppression_compte(), (select suppression_demandee_le + interval '30 days' from public.profil where id = '00000000-0000-0000-0000-0000000005c1'),
  'redemander ne repousse pas la date');
select lives_ok($$ select public.annuler_suppression_compte() $$, 'annulation possible');
select is((select suppression_demandee_le from public.profil where id = '00000000-0000-0000-0000-0000000005c1'), null, 'la demande est annulée');

-- 14 : enseignant.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c2","role":"authenticated"}', true);
select set_config('test.export_prof', public.exporter_mes_donnees()::text, true);
select is(jsonb_array_length(current_setting('test.export_prof')::jsonb->'classes_creees'), 1, 'un enseignant exporte ses classes');
select is(jsonb_array_length(current_setting('test.export_prof')::jsonb->'signalements'), 1, 'un enseignant exporte ses signalements');
select is(position('5c1' in current_setting('test.export_prof')), 0, 'l''export d''un enseignant ne contient pas ses élèves');
select throws_ok($$ select prive.purges_quotidiennes() $$, '42501', null, 'la purge n''est pas appelable par un compte');

reset role;
set local role anon;
select throws_ok($$ select public.exporter_mes_donnees() $$, '42501', null, 'export refusé sans session');
select throws_ok($$ select public.demander_suppression_compte() $$, '42501', null, 'demande refusée sans session');
reset role;

-- Purges : 5c1 (31 j), 5c2 enseignant (31 j) ; 5c3 (29 j) reste.
update public.profil set suppression_demandee_le = now() - interval '31 days' where id in
  ('00000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c2');
update public.profil set suppression_demandee_le = now() - interval '29 days' where id = '00000000-0000-0000-0000-0000000005c3';
select prive.purges_quotidiennes();

select is((select count(*)::int from auth.users where id in ('00000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c2')), 0, 'demandes de 31 jours : comptes supprimés');
select is((select count(*)::int from public.profil where id in ('00000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c2')), 0, 'profils supprimés');
select is((select count(*)::int from public.profil where id = '00000000-0000-0000-0000-0000000005c3')
        + (select count(*)::int from auth.users where id = '00000000-0000-0000-0000-0000000005c3'), 2, 'demande de 29 jours : pas purgée');
select is(
  (select count(*)::int from public.tentative where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.tentative_question where tentative_id = '70000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.evenement where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.evenement_chapitre where evenement_id = '80000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.progression_chapitre where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.progression_cours where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.historique_question where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.plan_revision where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.preferences_notification where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.abonnement_push where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.notification_planifiee where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.acces_gratuit where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.consentement_parental where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.inscription_classe where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from prive.depart_classe where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from prive.essai_code where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from prive.jeton_ical where eleve_id = '00000000-0000-0000-0000-0000000005c1')
  + (select count(*)::int from public.signalement where auteur_id in ('00000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c2')),
  0, 'cascade complète : aucune ligne orpheline');
select is((select count(*)::int from public.classe where enseignant_id = '00000000-0000-0000-0000-0000000005c2'), 0, 'un enseignant purgé part avec ses classes');
select is((select count(*)::int from public.tentative where eleve_id = '00000000-0000-0000-0000-0000000005c3'), 1, 'les données de l''élève non purgé restent');
select is((select array_agg(classe_id order by classe_id) from prive.depart_classe where eleve_id = '00000000-0000-0000-0000-0000000005c3'),
  array['60000000-0000-0000-0000-0000000005c3'::uuid], 'départ de classe : 35 jours purgé, 2 jours gardé');
select is((select count(*)::int from cron.job where jobname = 'purges-quotidiennes' and schedule = '23 3 * * *'), 1, 'purge planifiée chaque nuit');

-- Dernier administrateur : les autres administrateurs de la base locale sont mis « en suppression » dans cette transaction.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000005c6', 'admin-un@test.local'),
  ('00000000-0000-0000-0000-0000000005c7', 'admin-deux@test.local');
update public.profil set role = 'admin_contenu' where id in ('00000000-0000-0000-0000-0000000005c6', '00000000-0000-0000-0000-0000000005c7');
update public.profil set suppression_demandee_le = now()
 where role = 'admin_contenu' and id not in ('00000000-0000-0000-0000-0000000005c6', '00000000-0000-0000-0000-0000000005c7');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c6","role":"authenticated"}', true);
select lives_ok($$ select public.demander_suppression_compte() $$, 'un administrateur peut demander sa suppression s''il en reste un autre');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c7","role":"authenticated"}', true);
select throws_ok($$ select public.demander_suppression_compte() $$, 'P0001', 'dernier_admin', 'le dernier administrateur ne peut pas demander sa suppression');
reset role;
update public.profil set suppression_demandee_le = now() - interval '31 days' where id in
  ('00000000-0000-0000-0000-0000000005c6', '00000000-0000-0000-0000-0000000005c7');
select prive.purges_quotidiennes();
select is((select count(*)::int from auth.users where id in ('00000000-0000-0000-0000-0000000005c6', '00000000-0000-0000-0000-0000000005c7')), 2, 'la purge conserve le dernier administrateur');

select * from finish();
rollback;
