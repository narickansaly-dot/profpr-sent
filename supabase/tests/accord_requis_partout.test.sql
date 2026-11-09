begin;
select plan(36);

-- Aucun traitement d'un élève de moins de 15 ans sans accord, ou après le retrait de l'accord (audit I1).
-- c11 : accord donné puis retiré par le parent, inscrit en classe. c12 : jamais d'accord. c13 : 15 ans ou plus.
-- c14 : moins de 15 ans avec un accord valable. c1a : enseignant. c1f : parent de c11.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000c11', 'acc-retire@test.local'),
  ('00000000-0000-0000-0000-000000000c12', 'acc-sans@test.local'),
  ('00000000-0000-0000-0000-000000000c13', 'acc-grand@test.local'),
  ('00000000-0000-0000-0000-000000000c14', 'acc-valide@test.local'),
  ('00000000-0000-0000-0000-000000000c1a', 'acc-prof@test.local'),
  ('00000000-0000-0000-0000-000000000c1f', 'acc-parent@test.local');
update public.profil set onboarding_termine = true, moins_de_15_ans = true, nom = 'Retiré'
 where id in ('00000000-0000-0000-0000-000000000c11', '00000000-0000-0000-0000-000000000c12', '00000000-0000-0000-0000-000000000c14');
update public.profil set onboarding_termine = true, moins_de_15_ans = false, nom = 'Grand' where id = '00000000-0000-0000-0000-000000000c13';
update public.profil set role = 'enseignant', nom = 'Prof accord' where id = '00000000-0000-0000-0000-000000000c1a';
update public.profil set role = 'parent', onboarding_termine = true, nom = 'Parent' where id = '00000000-0000-0000-0000-000000000c1f';
insert into public.consentement_parental (eleve_id, email_parent, donne_le) values
  ('00000000-0000-0000-0000-000000000c11', 'acc-parent@test.local', now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000c14', 'acc-parent@test.local', now() - interval '2 days');
insert into public.lien_parent (eleve_id, parent_id, origine) values
  ('00000000-0000-0000-0000-000000000c11', '00000000-0000-0000-0000-000000000c1f', 'accord');
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000c1', 'technologique', 'ACC', 'Filière accord');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000c1', 'cours-accord', '10000000-0000-0000-0000-0000000000c1', '1re', 'A', 'Cours accord', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1', 'ch1', 1, 'Un', true);
insert into public.question (id, chapitre_id, type, enonce, propositions, statut) values
  ('40000000-0000-0000-0000-0000000000c1', '30000000-0000-0000-0000-0000000000c1', 'qcm_unique', 'Question accord', '["a","b"]', 'valide');
insert into public.question_corrige (question_id, bonnes_reponses) values ('40000000-0000-0000-0000-0000000000c1', '[1]');
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-000000000c1a', 'Classe accord', 'ACCBCD');
insert into public.classe_cours values ('60000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1');
insert into public.inscription_classe (classe_id, eleve_id) values
  ('60000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-000000000c11'),
  ('60000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-000000000c13'),
  ('60000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-000000000c14');
-- Question ratée : 2 réponses fausses de chacun de c11, c13, c14 (6 réponses, 3 élèves) ; sans c11, il ne reste que 2 élèves.
create temp table fx on commit drop as
  select i, e from (
    select i, case when i <= 2 then 'c11' when i <= 4 then 'c13' else 'c14' end from generate_series(1, 6) i) x(i, e);
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions, statut, fin, note, reussie)
  select ('70000000-0000-0000-0000-0000000c1' || lpad(i::text, 3, '0'))::uuid, ('00000000-0000-0000-0000-000000000' || e)::uuid,
         'quiz_chapitre', '20000000-0000-0000-0000-0000000000c1', '30000000-0000-0000-0000-0000000000c1', 1, 'terminee', now(), 0, false
    from fx;
insert into public.tentative_question (tentative_id, ordre, question_id, permutation, reponse, correcte)
  select ('70000000-0000-0000-0000-0000000c1' || lpad(i::text, 3, '0'))::uuid, 1, '40000000-0000-0000-0000-0000000000c1', '{0,1}', '[0]', false
    from fx;
-- Rappel à 9 h 10 (événement à 9 h 20, délai de 10 minutes) pour c11 et c13 ; un événement à venir pour le flux iCal.
insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, delai_rappel_minutes) values
  ('00000000-0000-0000-0000-000000000c11', 'devoir', 'Rappel accord', '2027-01-12 09:20+01', 60, 10),
  ('00000000-0000-0000-0000-000000000c13', 'devoir', 'Rappel accord', '2027-01-12 09:20+01', 60, 10);
insert into public.evenement (eleve_id, type, titre, debut, duree_minutes) values
  ('00000000-0000-0000-0000-000000000c11', 'devoir', 'Exposé iCal', now() + interval '2 days', 60),
  ('00000000-0000-0000-0000-000000000c13', 'devoir', 'Exposé iCal', now() + interval '2 days', 60);
insert into prive.jeton_ical (eleve_id, empreinte) values
  ('00000000-0000-0000-0000-000000000c11', extensions.digest(repeat('c', 43), 'sha256')),
  ('00000000-0000-0000-0000-000000000c13', extensions.digest(repeat('d', 43), 'sha256'));
delete from public.notification_planifiee where eleve_id in ('00000000-0000-0000-0000-000000000c11', '00000000-0000-0000-0000-000000000c13');

-- Le parent retire son accord pour c11.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c1f","role":"authenticated"}', true);
select lives_ok($$ select public.retirer_consentement('00000000-0000-0000-0000-000000000c11') $$, 'le parent retire son accord');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c12","role":"authenticated"}', true);
select throws_ok($$ select * from public.rejoindre_classe('ACCBCD') $$, 'P0001', 'consentement_requis', 'rejoindre_classe refuse un élève sans accord');
select throws_ok($$ select public.enregistrer_evenement(null, ('{"type":"devoir","titre":"X","debut":"' || to_char(now() + interval '3 days', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') || '","duree_minutes":60}')::jsonb) $$, 'P0001', 'consentement_requis', 'enregistrer_evenement refuse un élève sans accord');
select throws_ok($$ select public.creer_jeton_ical() $$, 'P0001', 'consentement_requis', 'creer_jeton_ical refuse un élève sans accord');
select throws_ok($$ select public.enregistrer_abonnement_push('https://fcm.googleapis.com/fcm/send/acc-1', repeat('k', 87), repeat('a', 22), 'Test') $$, 'P0001', 'consentement_requis', 'enregistrer_abonnement_push refuse un élève sans accord');
select throws_ok($$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000c9', '{}'::jsonb, '[]'::jsonb) $$, 'P0001', 'consentement_requis', 'accepter_plan_revision refuse un élève sans accord');
reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c11","role":"authenticated"}', true);
select throws_ok($$ select * from public.rejoindre_classe('ACCBCD') $$, 'P0001', 'consentement_requis', 'rejoindre_classe refuse un élève après retrait de l''accord');
select throws_ok($$ select public.enregistrer_evenement(null, ('{"type":"devoir","titre":"X","debut":"' || to_char(now() + interval '3 days', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') || '","duree_minutes":60}')::jsonb) $$, 'P0001', 'consentement_requis', 'enregistrer_evenement refuse un élève après retrait de l''accord');
select throws_ok($$ select public.creer_jeton_ical() $$, 'P0001', 'consentement_requis', 'creer_jeton_ical refuse un élève après retrait de l''accord');
select throws_ok($$ select public.enregistrer_abonnement_push('https://fcm.googleapis.com/fcm/send/acc-1', repeat('k', 87), repeat('a', 22), 'Test') $$, 'P0001', 'consentement_requis', 'enregistrer_abonnement_push refuse un élève après retrait de l''accord');
select throws_ok($$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000c9', '{}'::jsonb, '[]'::jsonb) $$, 'P0001', 'consentement_requis', 'accepter_plan_revision refuse un élève après retrait de l''accord');
reset role;

-- Vue de l'enseignant.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c1a","role":"authenticated"}', true);
select is((select count(*)::int from public.suivi_classe('60000000-0000-0000-0000-0000000000c1') where eleve_id = '00000000-0000-0000-0000-000000000c11'), 0,
  'suivi_classe ne montre plus l''élève dont l''accord est retiré');
select is((select count(*)::int from public.suivi_classe('60000000-0000-0000-0000-0000000000c1') where eleve_id = '00000000-0000-0000-0000-000000000c13'), 1,
  'suivi_classe montre toujours l''élève de 15 ans ou plus');
select is((select count(*)::int from public.suivi_classe('60000000-0000-0000-0000-0000000000c1') where eleve_id = '00000000-0000-0000-0000-000000000c14'), 1,
  'suivi_classe montre toujours l''élève de moins de 15 ans avec un accord valable');
select is((select count(*)::int from public.notes_classe('60000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1') where eleve_id = '00000000-0000-0000-0000-000000000c11'), 0,
  'notes_classe ne montre plus l''élève dont l''accord est retiré');
select is((select count(*)::int from public.notes_classe('60000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1') where eleve_id = '00000000-0000-0000-0000-000000000c13'), 1,
  'notes_classe montre toujours l''autre élève');
select is((select count(*)::int from public.questions_ratees_classe('60000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1')), 0,
  'questions_ratees_classe ne compte plus les réponses de l''élève dont l''accord est retiré');
reset role;

-- Rappels.
select prive.planifier_notifications('2027-01-12 09:00+01');
select is((select count(*)::int from public.notification_planifiee where eleve_id = '00000000-0000-0000-0000-000000000c11'), 0,
  'aucun rappel planifié pour l''élève dont l''accord est retiré');
select is((select count(*)::int from public.notification_planifiee where eleve_id = '00000000-0000-0000-0000-000000000c13' and type = 'rappel_evenement'), 1,
  'le rappel de l''élève de 15 ans ou plus est planifié');

-- Flux iCal.
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*)::int from public.calendrier_ical(repeat('c', 43))), 0, 'le flux iCal ne renvoie rien pour l''élève dont l''accord est retiré');
select is((select count(*)::int from public.calendrier_ical(repeat('d', 43)) where titre = 'Exposé iCal'), 1, 'le flux iCal de l''élève de 15 ans ou plus est servi');
reset role;

-- Régression : les écritures restent possibles sans obstacle d'accord.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c14","role":"authenticated"}', true);
select lives_ok($$ select public.creer_jeton_ical() $$, 'un élève avec un accord valable crée son lien iCal');
select lives_ok($$ select public.enregistrer_abonnement_push('https://fcm.googleapis.com/fcm/send/acc-2', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'un élève avec un accord valable enregistre un abonnement push');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c13","role":"authenticated"}', true);
select lives_ok($$ select public.enregistrer_evenement(null, ('{"type":"devoir","titre":"Y","debut":"' || to_char(now() + interval '3 days', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') || '","duree_minutes":60}')::jsonb) $$,
  'un élève de 15 ans ou plus enregistre un événement');
select results_eq($$ select statut from public.rejoindre_classe('ACCBCD') $$, $$ values ('deja_inscrit'::text) $$,
  'un élève de 15 ans ou plus rejoint sa classe');

-- Annulation du retrait : l'élève redevient visible.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c1f","role":"authenticated"}', true);
select lives_ok($$ select public.annuler_retrait_consentement('00000000-0000-0000-0000-000000000c11') $$, 'le parent annule le retrait');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c1a","role":"authenticated"}', true);
select is((select count(*)::int from public.suivi_classe('60000000-0000-0000-0000-0000000000c1') where eleve_id = '00000000-0000-0000-0000-000000000c11'), 1,
  'après l''annulation, suivi_classe montre de nouveau l''élève');
select is((select count(*)::int from public.notes_classe('60000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1') where eleve_id = '00000000-0000-0000-0000-000000000c11'), 1,
  'après l''annulation, notes_classe montre de nouveau l''élève');
select is((select count(*)::int from public.questions_ratees_classe('60000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1')), 1,
  'après l''annulation, questions_ratees_classe compte de nouveau ses réponses');
reset role;
select prive.planifier_notifications('2027-01-12 09:00+01');
select is((select count(*)::int from public.notification_planifiee where eleve_id = '00000000-0000-0000-0000-000000000c11' and type = 'rappel_evenement'), 1,
  'après l''annulation, le rappel est planifié');
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*)::int from public.calendrier_ical(repeat('c', 43)) where titre = 'Exposé iCal'), 1, 'après l''annulation, le flux iCal est servi');
reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c11","role":"authenticated"}', true);
select lives_ok($$ select public.creer_jeton_ical() $$, 'après l''annulation, l''élève crée de nouveau son lien iCal');
reset role;

-- Les droits restent ceux d'avant.
select ok(has_function_privilege('anon', 'public.calendrier_ical(text)', 'EXECUTE'), 'calendrier_ical reste ouverte à anon');
select ok(not has_function_privilege('anon', 'public.suivi_classe(uuid)', 'EXECUTE'), 'suivi_classe reste fermée à anon');
select ok(not has_function_privilege('anon', 'public.creer_jeton_ical()', 'EXECUTE')
          and has_function_privilege('authenticated', 'public.creer_jeton_ical()', 'EXECUTE'), 'creer_jeton_ical reste réservée aux comptes connectés');
select ok(not has_function_privilege('authenticated', 'prive.planifier_notifications(timestamptz)', 'EXECUTE'), 'planifier_notifications reste inaccessible aux comptes');

select * from finish();
rollback;
