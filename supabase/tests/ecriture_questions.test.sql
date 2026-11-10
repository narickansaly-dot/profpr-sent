begin;
select plan(94);

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
  '{"type":"vrai_faux","enonce":"Q3","bonnes_reponses":[false],"statut":"valide"}') $$, 'vrai_faux créé');
select lives_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"reponse_courte","enonce":"Q4","reponses_acceptees":["Na+"],"marge":null}') $$, 'reponse_courte créée');
select is((select count(*)::int from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101')), 4, 'admin : 4 questions lues');
select is((select statut::text from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where source = 't-q1'),
  'brouillon', 'éditeur : statut a_relire fourni ignoré, création en brouillon');
select is((select statut::text from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q3'),
  'brouillon', 'éditeur : statut valide fourni ignoré, création en brouillon');
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
  '{"type":"reponse_courte","enonce":"x","reponses_acceptees":["5"],"marge":1,"marge_relative":"oui"}') $$, 'P0001', 'question_invalide', 'marge_relative non booléenne');
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
-- Champs texte, champs inutilisés, doublons, réponses vides après normalisation.
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":{"a":1},"bonnes_reponses":[true]}') $$, 'P0001', 'question_invalide', 'énoncé qui n''est pas un texte');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true],"source":{"k":1}}') $$, 'P0001', 'question_invalide', 'source qui n''est pas un texte');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_unique","enonce":"x","propositions":["a","b"],"bonnes_reponses":[0],"marge":1}') $$, 'P0001', 'question_invalide', 'marge sur un QCM');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true],"marge_relative":true}') $$, 'P0001', 'question_invalide', 'marge relative sur un vrai/faux');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_unique","enonce":"x","propositions":["a"," a "],"bonnes_reponses":[0]}') $$, 'P0001', 'question_invalide', 'propositions en double');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"reponse_courte","enonce":"x","reponses_acceptees":["..."]}') $$, 'P0001', 'question_invalide', 'réponse acceptée vide une fois normalisée');
select throws_ok($$ select public.enregistrer_question(gen_random_uuid(), null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, 'P0001', 'chapitre_introuvable', 'chapitre inconnu');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', gen_random_uuid(),
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, 'P0001', 'question_introuvable', 'question inconnue');

-- Import (prive.ecrire_question appelée directement) : le statut fourni s'applique.
reset role;
-- (La ligne écrite n'est pas visible de l'instruction qui appelle la fonction : on lit dans une instruction suivante.)
select set_config('test.imp', (select id_question::text from prive.ecrire_question('00000000-0000-0000-0000-00000000c102', null,
  '{"source":"t-imp","type":"vrai_faux","enonce":"Imp","bonnes_reponses":[true],"statut":"valide"}')), true);
select is((select statut::text from public.question where id = current_setting('test.imp')::uuid), 'valide',
  'import : statut fourni respecté');
-- Modification en place (pas encore utilisée) puis « inchangée ».
select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-q1","type":"qcm_unique","enonce":"Q1 bis","propositions":["a","b","c"],"bonnes_reponses":[1],"statut":"a_relire","notion":"n1"}')),
  'modifiee', 'modification en place par source');
select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-q1","type":"qcm_unique","enonce":"Q1 bis","propositions":["a","b","c"],"bonnes_reponses":[1],"statut":"a_relire","notion":"n1"}')),
  'inchangee', 'réécriture identique : inchangée');
select throws_ok($$ select prive.ecrire_question('00000000-0000-0000-0000-00000000c102', null,
  '{"source":"t-q1","type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, 'P0001', 'question_autre_chapitre',
  'une source ne change pas de chapitre');
select set_config('test.q2', (select id::text from public.question
  where enonce = 'Q2' and chapitre_id = '00000000-0000-0000-0000-00000000c101'), true);
select set_config('test.q3', (select id::text from public.question
  where enonce = 'Q3' and chapitre_id = '00000000-0000-0000-0000-00000000c101'), true);
set local role authenticated;

-- Statuts.
select throws_ok($$ select public.changer_statut_question(current_setting('test.q2')::uuid, 'valide') $$,
  'P0001', 'transition_invalide', 'brouillon → valide refusé');
select lives_ok($$ select public.changer_statut_question(current_setting('test.q2')::uuid, 'a_relire') $$, 'brouillon → a_relire');
select lives_ok($$ select public.changer_statut_question(current_setting('test.q2')::uuid, 'valide') $$, 'a_relire → valide');
select is((select statut::text from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q2'),
  'valide', 'Q2 est valide');
select lives_ok($$ select public.changer_statut_question(current_setting('test.q2')::uuid, 'a_relire') $$, 'valide → a_relire');
select throws_ok($$ select public.changer_statut_question(current_setting('test.q2')::uuid, 'archivee') $$,
  'P0001', 'transition_invalide', 'archivee non choisissable');
select throws_ok($$ select public.changer_statut_question(current_setting('test.q2')::uuid, null) $$,
  'P0001', 'transition_invalide', 'statut nul refusé');
select throws_ok($$ select public.changer_statut_question(gen_random_uuid(), 'a_relire') $$,
  'P0001', 'question_introuvable', 'statut : question inconnue');

-- Éditeur, question non tirée et non validée : modification structurelle en place, statut conservé.
reset role;
select is((select resultat || ':' || (id_question = current_setting('test.q2')::uuid)::text
             from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', current_setting('test.q2')::uuid,
  '{"type":"qcm_multiple","enonce":"Q2","propositions":["a","b","c"],"bonnes_reponses":[1],"statut":"brouillon"}', true)),
  'modifiee:true', 'question non tirée : modification structurelle en place');
select is((select bonnes_reponses from public.question_corrige where question_id = current_setting('test.q2')::uuid),
  '[1]'::jsonb, 'corrigé mis à jour en place');
select is((select statut::text from public.question where id = current_setting('test.q2')::uuid),
  'a_relire', 'éditeur : la modification en place garde le statut');
set local role authenticated;

-- Question valide jamais tirée : une modification structurelle versionne quand même (course avec un tirage),
-- et la nouvelle version repasse à « a_relire ».
select lives_ok($$ select public.changer_statut_question(current_setting('test.q2')::uuid, 'valide') $$, 'Q2 revalidée');
select lives_ok($$ select set_config('test.q2v', public.enregistrer_question('00000000-0000-0000-0000-00000000c101',
  current_setting('test.q2')::uuid,
  '{"type":"qcm_multiple","enonce":"Q2","propositions":["a","b","c","d"],"bonnes_reponses":[1,3],"statut":"valide"}')::text, true) $$,
  'éditeur : modification structurelle d''une question valide');
reset role;
select isnt(current_setting('test.q2v')::uuid, current_setting('test.q2')::uuid, 'question valide non tirée : versionnée');
select is((select statut::text from public.question where id = current_setting('test.q2')::uuid), 'archivee',
  'ancienne version valide archivée');
select is((select statut::text || ':' || (version_de = current_setting('test.q2')::uuid)::text
             from public.question where id = current_setting('test.q2v')::uuid),
  'a_relire:true', 'nouvelle version d''une question valide : a_relire');
set local role authenticated;
select throws_ok($$ select public.supprimer_question(current_setting('test.q2')::uuid) $$,
  'P0001', 'question_utilisee', 'version archivée remplacée : suppression refusée');

-- Collision de source.
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', current_setting('test.q3')::uuid,
  '{"source":"t-q1","type":"vrai_faux","enonce":"Q3","bonnes_reponses":[false]}') $$,
  'P0001', 'source_deja_prise', 'source déjà portée par une autre question');

-- Versionnage : t-q1 a été tirée dans une tentative terminée de l'élève et porte deux signalements.
reset role;
select set_config('test.ancien', (select id::text from public.question where source = 't-q1'), true);
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions, statut, fin, note, reussie) values
  ('00000000-0000-0000-0000-00000000d001', '00000000-0000-0000-0000-0000000000b2', 'quiz_chapitre',
   '00000000-0000-0000-0000-00000000c001', '00000000-0000-0000-0000-00000000c101', 6, 'terminee', now(), 100, true);
-- Permutation {2,0,1} : affichage c, a, b ; la réponse 1 (« b ») est affichée en position 2.
insert into public.tentative_question (tentative_id, ordre, question_id, permutation, reponse, correcte, repondu_le) values
  ('00000000-0000-0000-0000-00000000d001', 1, current_setting('test.ancien')::uuid, '{2,0,1}', '[1]', true, now());
insert into public.signalement (question_id, auteur_id, commentaire) values
  (current_setting('test.ancien')::uuid, '00000000-0000-0000-0000-0000000000b3', 'La réponse b est discutable.');
insert into public.signalement (question_id, auteur_id, commentaire, statut, traite_le) values
  (current_setting('test.ancien')::uuid, '00000000-0000-0000-0000-0000000000b3', 'Ancienne remarque déjà traitée.', 'traite', now());

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
select is((select question_id from public.signalement where auteur_id = '00000000-0000-0000-0000-0000000000b3' and statut = 'ouvert'),
  current_setting('test.nouveau')::uuid, 'le signalement ouvert suit la nouvelle version');
select is((select question_id from public.signalement where auteur_id = '00000000-0000-0000-0000-0000000000b3' and statut = 'traite'),
  current_setting('test.ancien')::uuid, 'le signalement traité reste sur l''ancienne version');

-- Bout en bout : la note et la correction passées restent exactes.
select ok(prive.corriger(current_setting('test.ancien')::uuid, '[1]'), 'ancienne version : la réponse donnée reste correcte');
select ok(not prive.corriger(current_setting('test.ancien')::uuid, '[2]'), 'ancienne version : une autre réponse reste fausse');
select is((select tq.correcte::text || ':' || t.note::text from public.tentative_question tq
             join public.tentative t on t.id = tq.tentative_id
            where tq.tentative_id = '00000000-0000-0000-0000-00000000d001' and tq.ordre = 1),
  'true:100.00', 'correction et note enregistrées inchangées');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select is((select propositions from public.correction_tentative('00000000-0000-0000-0000-00000000d001') where ordre = 1),
  '["c", "a", "b"]'::jsonb, 'correction de l''élève : anciennes propositions dans l''ordre affiché');
select is((select bonnes_reponses::text || ':' || reponse::text || ':' || correcte::text
             from public.correction_tentative('00000000-0000-0000-0000-00000000d001') where ordre = 1),
  '[2]:[2]:true', 'correction de l''élève : corrigé et réponse inchangés');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select is((select count(*)::int from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101')
            where id = current_setting('test.ancien')::uuid), 0, 'lecture admin : ancienne version masquée');
select is((select count(*)::int from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where source = 't-q1'), 1,
  'lecture admin : une seule version de t-q1');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', current_setting('test.ancien')::uuid,
  '{"type":"qcm_unique","enonce":"Q1","propositions":["a","b","c"],"bonnes_reponses":[1]}') $$,
  'P0001', 'question_archivee', 'une version archivée ne se réécrit pas');

-- Chaque champ lu par la correction versionne une question tirée.
reset role;
select prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null, x::jsonb) from unnest(array[
  '{"source":"t-bonnes","type":"qcm_unique","enonce":"Bonnes","propositions":["a","b","c"],"bonnes_reponses":[1]}',
  '{"source":"t-type","type":"qcm_unique","enonce":"Type","propositions":["a","b","c"],"bonnes_reponses":[1]}',
  '{"source":"t-acc","type":"reponse_courte","enonce":"Acc","reponses_acceptees":["5"],"statut":"a_relire"}',
  '{"source":"t-marge","type":"reponse_courte","enonce":"Marge","reponses_acceptees":["5"],"marge":0.5}']) x;
select set_config('test.qid', (select e.id_question::text from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_unique","enonce":"Par id","propositions":["a","b"],"bonnes_reponses":[0]}') e), true);
insert into public.tentative_question (tentative_id, ordre, question_id, permutation, reponse, correcte)
  select '00000000-0000-0000-0000-00000000d001', 1 + row_number() over (order by q.enonce), q.id, '{}', null, false
    from public.question q
   where q.source in ('t-bonnes', 't-type', 't-acc', 't-marge') or q.id = current_setting('test.qid')::uuid;

select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-bonnes","type":"qcm_unique","enonce":"Bonnes","propositions":["a","b","c"],"bonnes_reponses":[2]}')),
  'versionnee', 'question tirée : bonnes_reponses modifiées → versionnée');
select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-type","type":"qcm_multiple","enonce":"Type","propositions":["a","b","c"],"bonnes_reponses":[1]}')),
  'versionnee', 'question tirée : type modifié → versionnée');
select is((select resultat from (select e.resultat, set_config('test.acc', e.id_question::text, true)
             from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-acc","type":"reponse_courte","enonce":"Acc","reponses_acceptees":["5","cinq"],"statut":"valide"}', true) e) x),
  'versionnee', 'question tirée : reponses_acceptees modifiées → versionnée');
select is((select statut::text from public.question where id = current_setting('test.acc')::uuid), 'a_relire',
  'éditeur : la nouvelle version d''une question non valide hérite de son statut');
select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-marge","type":"reponse_courte","enonce":"Marge","reponses_acceptees":["5"],"marge":1}')),
  'versionnee', 'question tirée : marge modifiée → versionnée');
select is((select resultat from (select e.resultat, set_config('test.qidv', e.id_question::text, true)
             from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', current_setting('test.qid')::uuid,
  '{"type":"qcm_unique","enonce":"Par id","propositions":["a","b"],"bonnes_reponses":[1]}') e) x),
  'versionnee', 'par id, sans source : versionnée');
select is((select coalesce(source, '-') || ':' || (version_de = current_setting('test.qid')::uuid)::text
             from public.question where id = current_setting('test.qidv')::uuid),
  '-:true', 'par id : nouvelle version sans source, version_de posée');
select is((select bonnes_reponses from public.question_corrige where question_id = current_setting('test.qid')::uuid),
  '[0]'::jsonb, 'par id : corrigé de l''ancienne version inchangé');
set local role authenticated;

-- Suppression.
select lives_ok($$ select public.supprimer_question(current_setting('test.q3')::uuid) $$, 'question jamais tirée : supprimée');
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
select throws_ok($$ select public.supprimer_question(
  (select id from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q4')) $$,
  'P0001', 'question_signalee', 'question avec un signalement ouvert : suppression refusée');
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
