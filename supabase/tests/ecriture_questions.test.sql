begin;
select plan(60);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000b1', 'admin-q@test.local'),
  ('00000000-0000-0000-0000-0000000000b2', 'eleve-q@test.local'),
  ('00000000-0000-0000-0000-0000000000b3', 'prof-q@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000b1';
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000b3';
insert into public.cours (id, slug, matiere, titre, publie) values
  ('00000000-0000-0000-0000-00000000c001', 'test-q', 'Test', 'Cours test', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('00000000-0000-0000-0000-00000000c101', '00000000-0000-0000-0000-00000000c001', 'ch-a', 1, 'A', true),
  ('00000000-0000-0000-0000-00000000c102', '00000000-0000-0000-0000-00000000c001', 'ch-b', 2, 'B', true);

set local role authenticated;
-- Non-admins.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, 'P0001', 'acces_refuse', 'élève : écriture refusée');
select is((select count(*)::int from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101')), 0,
  'élève : aucune ligne en lecture admin');
select throws_ok($$ select public.supprimer_question(gen_random_uuid()) $$, 'P0001', 'acces_refuse',
  'élève : suppression refusée');
select throws_ok($$ select prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, '42501', null, 'élève : prive.ecrire_question inaccessible');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b3","role":"authenticated"}', true);
select throws_ok($$ select public.changer_statut_question(gen_random_uuid(), 'valide') $$, 'P0001', 'acces_refuse',
  'enseignant : changement de statut refusé');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, 'P0001', 'acces_refuse', 'enseignant : écriture refusée');

-- Admin : création des quatre types.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select lives_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-q1","type":"qcm_unique","enonce":"Q1","propositions":["a","b","c"],"bonnes_reponses":[1],"statut":"a_relire","notion":"n1"}') $$,
  'admin : qcm_unique créé');
select lives_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_multiple","enonce":"Q2","propositions":["a","b","c"],"bonnes_reponses":[0,2]}') $$, 'qcm_multiple créé');
select lives_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"Q3","bonnes_reponses":[false]}') $$, 'vrai_faux créé');
select lives_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"reponse_courte","enonce":"Q4","reponses_acceptees":["Na+"],"marge":null}') $$, 'reponse_courte créée');
select is((select count(*)::int from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101')), 4, 'admin : 4 questions lues');
select is((select statut::text from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where source = 't-q1'),
  'a_relire', 'statut fourni respecté');
select is((select statut::text from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q2'),
  'brouillon', 'statut par défaut : brouillon');
select ok((select 'n1' = any (array(select public.notions_chapitre('00000000-0000-0000-0000-00000000c101')))), 'notion créée');
select is((select bonnes_reponses from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q2'),
  '[0, 2]'::jsonb, 'corrigé enregistré');

-- Un élève ne voit pas les notions par la lecture admin.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select is((select count(*)::int from public.notions_chapitre('00000000-0000-0000-0000-00000000c101')), 0,
  'élève : aucune notion en lecture admin');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);

-- Validation.
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_unique","enonce":"x","propositions":["a","b"],"bonnes_reponses":[2]}') $$, 'P0001', 'question_invalide', 'indice hors limites');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_multiple","enonce":"x","propositions":["a","b"],"bonnes_reponses":[0,0]}') $$, 'P0001', 'question_invalide', 'indice en double');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"reponse_courte","enonce":"x","reponses_acceptees":["5"],"marge_relative":true}') $$, 'P0001', 'question_invalide', 'marge relative sans marge');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true],"statut":"archivee"}') $$, 'P0001', 'question_invalide', 'archivee non choisissable');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true],"difficulte":"dur"}') $$, 'P0001', 'question_invalide', 'difficulté non numérique');
-- Charges malformées : aucun cast ne doit lever 22P02 ou 22003.
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"reponse_courte","enonce":"x","reponses_acceptees":["5"],"marge":"abc"}') $$, 'P0001', 'question_invalide', 'marge non numérique');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true],"statut":"publie"}') $$, 'P0001', 'question_invalide', 'statut inconnu');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true],"marge_relative":"oui"}') $$, 'P0001', 'question_invalide', 'marge_relative non booléenne');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_unique","enonce":"x","propositions":["a","b"],"bonnes_reponses":[99999999999999999999]}') $$, 'P0001', 'question_invalide', 'indice démesuré');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_unique","enonce":"x","propositions":["a","b"],"bonnes_reponses":["0"]}') $$, 'P0001', 'question_invalide', 'indice en chaîne');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true],"propositions":null}') $$, 'P0001', 'question_invalide', 'propositions nulles');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null, '[1, 2]') $$,
  'P0001', 'question_invalide', 'charge qui n''est pas un objet');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null, null) $$,
  'P0001', 'question_invalide', 'charge nulle');
select throws_ok($$ select public.enregistrer_question(gen_random_uuid(), null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, 'P0001', 'chapitre_introuvable', 'chapitre inconnu');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', gen_random_uuid(),
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, 'P0001', 'question_introuvable', 'question inconnue');

-- Modification en place (pas encore utilisée) puis « inchangée ».
reset role;
select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-q1","type":"qcm_unique","enonce":"Q1 bis","propositions":["a","b","c"],"bonnes_reponses":[1],"statut":"a_relire","notion":"n1"}')),
  'modifiee', 'modification en place par source');
select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-q1","type":"qcm_unique","enonce":"Q1 bis","propositions":["a","b","c"],"bonnes_reponses":[1],"statut":"a_relire","notion":"n1"}')),
  'inchangee', 'réécriture identique : inchangée');
select throws_ok($$ select prive.ecrire_question('00000000-0000-0000-0000-00000000c102', null,
  '{"source":"t-q1","type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, 'P0001', 'question_autre_chapitre',
  'une source ne change pas de chapitre');
set local role authenticated;

-- Statuts.
select throws_ok($$ select public.changer_statut_question(
  (select id from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q2'), 'valide') $$,
  'P0001', 'transition_invalide', 'brouillon → valide refusé');
select lives_ok($$ select public.changer_statut_question(
  (select id from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q2'), 'a_relire') $$,
  'brouillon → a_relire');
select lives_ok($$ select public.changer_statut_question(
  (select id from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q2'), 'valide') $$,
  'a_relire → valide');
select is((select statut::text from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q2'),
  'valide', 'Q2 est valide');
select lives_ok($$ select public.changer_statut_question(
  (select id from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q2'), 'a_relire') $$,
  'valide → a_relire');
select throws_ok($$ select public.changer_statut_question(
  (select id from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q2'), 'archivee') $$,
  'P0001', 'transition_invalide', 'archivee non choisissable');
select throws_ok($$ select public.changer_statut_question(gen_random_uuid(), 'a_relire') $$,
  'P0001', 'question_introuvable', 'statut : question inconnue');

-- Versionnage : t-q1 a été tirée dans une tentative de l'élève et porte un signalement ouvert.
reset role;
select set_config('test.ancien', (select id::text from public.question where source = 't-q1'), true);
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions) values
  ('00000000-0000-0000-0000-00000000d001', '00000000-0000-0000-0000-0000000000b2', 'quiz_chapitre',
   '00000000-0000-0000-0000-00000000c001', '00000000-0000-0000-0000-00000000c101', 1);
insert into public.tentative_question (tentative_id, ordre, question_id, permutation, reponse, correcte, repondu_le) values
  ('00000000-0000-0000-0000-00000000d001', 1, current_setting('test.ancien')::uuid, '{0,1,2}', '[1]', true, now());
insert into public.signalement (question_id, auteur_id, commentaire) values
  (current_setting('test.ancien')::uuid, '00000000-0000-0000-0000-0000000000b3', 'La réponse b est discutable.');

select is((select resultat || ':' || (id_question = current_setting('test.ancien')::uuid)::text
             from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-q1","type":"qcm_unique","enonce":"Q1 ter","propositions":["a","b","c"],"bonnes_reponses":[1],"statut":"a_relire","notion":"n1"}')),
  'modifiee:true', 'énoncé seul modifié : même id');
select is((select resultat from (select e.resultat, set_config('test.nouveau', e.id_question::text, true)
             from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-q1","type":"qcm_unique","enonce":"Q1 ter","propositions":["a","b","d"],"bonnes_reponses":[1],"statut":"a_relire","notion":"n1"}') e) x),
  'versionnee', 'propositions modifiées : versionnée');
select isnt(current_setting('test.nouveau')::uuid, current_setting('test.ancien')::uuid, 'nouvelle version : nouvel id');
select is((select statut::text || ':' || coalesce(source, '-') from public.question where id = current_setting('test.ancien')::uuid),
  'archivee:-', 'ancienne version archivée, sans source');
select is((select version_de from public.question where id = current_setting('test.nouveau')::uuid),
  current_setting('test.ancien')::uuid, 'nouvelle version : version_de');
select is((select source from public.question where id = current_setting('test.nouveau')::uuid), 't-q1', 'nouvelle version : source reprise');
select is((select bonnes_reponses from public.question_corrige where question_id = current_setting('test.ancien')::uuid),
  '[1]'::jsonb, 'corrigé de l''ancienne version inchangé');
select is((select propositions from public.question where id = current_setting('test.ancien')::uuid),
  '["a", "b", "c"]'::jsonb, 'propositions de l''ancienne version inchangées');
select is((select question_id from public.signalement where auteur_id = '00000000-0000-0000-0000-0000000000b3'),
  current_setting('test.nouveau')::uuid, 'le signalement ouvert suit la nouvelle version');
set local role authenticated;
select is((select count(*)::int from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101')
            where id = current_setting('test.ancien')::uuid), 0, 'lecture admin : ancienne version masquée');
select is((select count(*)::int from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101')), 4,
  'lecture admin : toujours 4 questions');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', current_setting('test.ancien')::uuid,
  '{"type":"qcm_unique","enonce":"Q1","propositions":["a","b","c"],"bonnes_reponses":[1]}') $$,
  'P0001', 'question_archivee', 'une version archivée ne se réécrit pas');

-- Suppression.
select lives_ok($$ select public.supprimer_question(
  (select id from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q3')) $$,
  'question jamais tirée : supprimée');
select is((select count(*)::int from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q3'), 0,
  'Q3 a disparu');
select throws_ok($$ select public.supprimer_question(current_setting('test.ancien')::uuid) $$,
  'P0001', 'question_utilisee', 'question tirée : suppression refusée');

-- Clôture des signalements au passage à « valide ».
reset role;
insert into public.signalement (question_id, auteur_id, commentaire)
  select id, '00000000-0000-0000-0000-0000000000b3', 'Il manque une réponse acceptée.' from public.question where enonce = 'Q4'
   and chapitre_id = '00000000-0000-0000-0000-00000000c101';
set local role authenticated;
select lives_ok($$ select public.changer_statut_question(
  (select id from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q4'), 'a_relire') $$,
  'Q4 → a_relire');
select is((select signalements_ouverts from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q4'),
  1, 'signalement encore ouvert avant validation');
select lives_ok($$ select public.changer_statut_question(
  (select id from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q4'), 'valide') $$,
  'Q4 → valide');
reset role;
select is((select s.statut || ':' || s.traite_par::text || ':' || (s.traite_le is not null)::text
             from public.signalement s join public.question q on q.id = s.question_id
            where q.enonce = 'Q4' and q.chapitre_id = '00000000-0000-0000-0000-00000000c101'),
  'traite:00000000-0000-0000-0000-0000000000b1:true', 'validation : signalement clos par l''admin');

select * from finish();
rollback;
