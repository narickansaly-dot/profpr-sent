begin;
select plan(58);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin-s@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', 'eleve-s@test.local'),
  ('00000000-0000-0000-0000-0000000000a3', 'parent-s@test.local'),
  ('00000000-0000-0000-0000-0000000000a4', 'attente-s@test.local'),
  ('00000000-0000-0000-0000-0000000000a5', 'prof1-s@test.local'),
  ('00000000-0000-0000-0000-0000000000a6', 'prof2-s@test.local'),
  ('00000000-0000-0000-0000-0000000000a7', 'prof3-s@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000a1';
update public.profil set role = 'parent' where id = '00000000-0000-0000-0000-0000000000a3';
update public.profil set demande_enseignant = true, etablissement = 'Lycée Test'
  where id = '00000000-0000-0000-0000-0000000000a4';
update public.profil set role = 'enseignant' where id in
  ('00000000-0000-0000-0000-0000000000a5', '00000000-0000-0000-0000-0000000000a6', '00000000-0000-0000-0000-0000000000a7');

insert into public.cours (id, slug, matiere, titre, publie) values
  ('00000000-0000-0000-0000-00000000d001', 'test-s-pub', 'Test', 'Cours publié', true),
  ('00000000-0000-0000-0000-00000000d002', 'test-s-np', 'Test', 'Cours caché', false),
  ('00000000-0000-0000-0000-00000000d003', 'test-s-autre', 'Test', 'Cours d''une autre classe', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('00000000-0000-0000-0000-00000000d101', '00000000-0000-0000-0000-00000000d001', 'ch-a', 1, 'A', true),
  ('00000000-0000-0000-0000-00000000d102', '00000000-0000-0000-0000-00000000d001', 'ch-b', 2, 'B', false),
  ('00000000-0000-0000-0000-00000000d103', '00000000-0000-0000-0000-00000000d002', 'ch-c', 1, 'C', true),
  ('00000000-0000-0000-0000-00000000d104', '00000000-0000-0000-0000-00000000d003', 'ch-d', 1, 'D', true);
insert into public.question (id, chapitre_id, type, enonce, statut) values
  ('00000000-0000-0000-0000-00000000e001', '00000000-0000-0000-0000-00000000d101', 'vrai_faux', 'Q valide', 'valide'),
  ('00000000-0000-0000-0000-00000000e002', '00000000-0000-0000-0000-00000000d101', 'vrai_faux', 'Q brouillon', 'brouillon'),
  ('00000000-0000-0000-0000-00000000e003', '00000000-0000-0000-0000-00000000d102', 'vrai_faux', 'Q chapitre caché', 'valide'),
  ('00000000-0000-0000-0000-00000000e004', '00000000-0000-0000-0000-00000000d103', 'vrai_faux', 'Q cours caché', 'valide'),
  ('00000000-0000-0000-0000-00000000e005', '00000000-0000-0000-0000-00000000d104', 'vrai_faux', 'Q jamais vue', 'valide'),
  ('00000000-0000-0000-0000-00000000e008', '00000000-0000-0000-0000-00000000d101', 'vrai_faux', 'Q modifiée après signalement', 'valide'),
  ('00000000-0000-0000-0000-00000000e009', '00000000-0000-0000-0000-00000000d101', 'vrai_faux', 'Q à relire sans signalement', 'a_relire'),
  ('00000000-0000-0000-0000-00000000e010', '00000000-0000-0000-0000-00000000d101', 'vrai_faux', 'Q archivée', 'archivee'),
  ('00000000-0000-0000-0000-00000000e011', '00000000-0000-0000-0000-00000000d101', 'vrai_faux', 'Q pour la limite', 'valide');
insert into public.question (id, chapitre_id, type, enonce, statut, source) values
  ('00000000-0000-0000-0000-00000000e006', '00000000-0000-0000-0000-00000000d101', 'vrai_faux', 'Q importée', 'valide', 'test-s:1'),
  ('00000000-0000-0000-0000-00000000e007', '00000000-0000-0000-0000-00000000d101', 'vrai_faux', 'Q importée 2', 'valide', 'test-s:2');
insert into public.question_corrige (question_id, bonnes_reponses) values
  ('00000000-0000-0000-0000-00000000e006', '[true]'), ('00000000-0000-0000-0000-00000000e007', '[true]'),
  ('00000000-0000-0000-0000-00000000e008', '[true]');
-- L'enseignant 1 voit le cours publié par sa classe ; l'enseignant 2 n'a pas de classe mais a tiré e001 dans une tentative.
insert into public.classe (id, enseignant_id, nom, code) values
  ('00000000-0000-0000-0000-00000000f001', '00000000-0000-0000-0000-0000000000a5', 'Classe S', 'SGNRAB'),
  ('00000000-0000-0000-0000-00000000f002', '00000000-0000-0000-0000-0000000000a7', 'Classe T', 'SGNRAC');
insert into public.classe_cours (classe_id, cours_id) values
  ('00000000-0000-0000-0000-00000000f001', '00000000-0000-0000-0000-00000000d001'),
  ('00000000-0000-0000-0000-00000000f002', '00000000-0000-0000-0000-00000000d001');
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions) values
  ('00000000-0000-0000-0000-00000000f101', '00000000-0000-0000-0000-0000000000a6', 'quiz_chapitre',
   '00000000-0000-0000-0000-00000000d001', '00000000-0000-0000-0000-00000000d101', 1);
insert into public.tentative_question (tentative_id, ordre, question_id) values
  ('00000000-0000-0000-0000-00000000f101', 1, '00000000-0000-0000-0000-00000000e001'),
  ('00000000-0000-0000-0000-00000000f101', 2, '00000000-0000-0000-0000-00000000e007');
-- 20 questions pour le test de limite.
insert into public.question (chapitre_id, type, enonce, statut)
  select '00000000-0000-0000-0000-00000000d101', 'vrai_faux', 'Q limite ' || g, 'valide' from generate_series(1, 20) g;
insert into public.signalement (question_id, auteur_id, commentaire, cree_le)
  select q.id, '00000000-0000-0000-0000-0000000000a7', 'commentaire de test', now()
    from public.question q where q.enonce like 'Q limite %';

set local role authenticated;

-- Qui peut signaler.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', 'Une erreur ici') $$,
  'P0001', 'acces_refuse', 'élève : refusé');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a3","role":"authenticated"}', true);
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', 'Une erreur ici') $$,
  'P0001', 'acces_refuse', 'parent : refusé');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', 'Une erreur ici') $$,
  'P0001', 'acces_refuse', 'admin : refusé');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a4","role":"authenticated"}', true);
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', 'Une erreur ici') $$,
  'P0001', 'acces_refuse', 'enseignant en attente de validation : refusé');

-- Enseignant 1.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a5","role":"authenticated"}', true);
select lives_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', '  La réponse attendue est fausse.  ') $$,
  'enseignant : signale une question d''un cours lié à sa classe');
select is((select count(*)::int from public.mes_signalements() where question_id = '00000000-0000-0000-0000-00000000e001' and statut = 'ouvert'
  and commentaire = 'La réponse attendue est fausse.'), 1, 'mes_signalements : signalement ouvert, commentaire nettoyé');
reset role;
select is((select statut::text from public.question where id = '00000000-0000-0000-0000-00000000e001'), 'a_relire',
  'la question passe à a_relire');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a5","role":"authenticated"}', true);
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', 'Encore la même erreur') $$,
  'P0001', 'deja_signalee', 'second signalement du même enseignant refusé');

-- Enseignant 2 : la question est déjà en relecture mais reste signalable.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a6","role":"authenticated"}', true);
select lives_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', 'Je confirme le problème') $$,
  'un second enseignant, sans classe, signale une question tirée dans sa propre tentative');
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e005', 'Une erreur ici') $$,
  'P0001', 'question_introuvable', 'question jamais tirée, cours sans classe : introuvable');
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e006', 'Une erreur ici') $$,
  'P0001', 'question_introuvable', 'question non tirée d''un cours publié sans classe : introuvable');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a5","role":"authenticated"}', true);
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e005', 'Une erreur ici') $$,
  'P0001', 'question_introuvable', 'question d''un cours non lié à ses classes : introuvable');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a6","role":"authenticated"}', true);

-- Questions refusées.
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e002', 'Une erreur ici') $$,
  'P0001', 'question_introuvable', 'brouillon : introuvable');
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e003', 'Une erreur ici') $$,
  'P0001', 'question_introuvable', 'chapitre non publié : introuvable');
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e004', 'Une erreur ici') $$,
  'P0001', 'question_introuvable', 'cours non publié : introuvable');
select throws_ok($$ select public.signaler_question(gen_random_uuid(), 'Une erreur ici') $$,
  'P0001', 'question_introuvable', 'uuid inconnu : introuvable');
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e009', 'Une erreur ici') $$,
  'P0001', 'question_introuvable', 'a_relire sans signalement ouvert : introuvable');
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e010', 'Une erreur ici') $$,
  'P0001', 'question_introuvable', 'archivée : introuvable');

-- Commentaire.
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', 'abcd') $$,
  'P0001', 'commentaire_invalide', 'commentaire trop court');
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', '   abcd   ') $$,
  'P0001', 'commentaire_invalide', 'commentaire trop court après btrim');
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', repeat('x', 1001)) $$,
  'P0001', 'commentaire_invalide', 'commentaire trop long');
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', null) $$,
  'P0001', 'commentaire_invalide', 'commentaire nul');

-- Limite : l'enseignant 3 a déjà 20 signalements dans les dernières 24 h.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a7","role":"authenticated"}', true);
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', 'Une erreur ici') $$,
  'P0001', 'trop_de_signalements', 'limite de 20 signalements par 24 h');
reset role;
update public.signalement set cree_le = now() - interval '25 hours'
 where id = (select id from public.signalement where auteur_id = '00000000-0000-0000-0000-0000000000a7' limit 1);
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a7","role":"authenticated"}', true);
select lives_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e011', 'Une erreur ici') $$,
  'un signalement de plus de 24 h ne compte plus : le 20e passe');
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e008', 'Une erreur ici') $$,
  'P0001', 'trop_de_signalements', 'le 21e est refusé');

-- Lectures.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a5","role":"authenticated"}', true);
select is((select count(*)::int from public.mes_signalements()), 1, 'mes_signalements : seulement les siens');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a6","role":"authenticated"}', true);
select is((select array_agg(commentaire) from public.mes_signalements()), array['Je confirme le problème'],
  'mes_signalements : l''enseignant 2 ne voit pas le signalement de l''enseignant 1');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a5","role":"authenticated"}', true);
select is((select count(*)::int from public.signalements_admin()), 0, 'enseignant : signalements_admin vide');
select throws_ok($$ select public.traiter_signalement(gen_random_uuid(), 'traite') $$,
  'P0001', 'acces_refuse', 'enseignant : traiter_signalement refusé');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);
select throws_ok($$ select public.traiter_signalement(gen_random_uuid(), 'traite') $$,
  'P0001', 'acces_refuse', 'élève : traiter_signalement refusé');
select is((select count(*)::int from public.signalements_admin(null)), 0, 'élève : signalements_admin vide');

-- Confidentialité des colonnes.
select is(pg_get_function_result('public.mes_signalements()'::regprocedure),
  'TABLE(id uuid, question_id uuid, enonce text, chapitre_titre text, cours_titre text, commentaire text, statut text, reponse text, cree_le timestamp with time zone, traite_le timestamp with time zone)',
  'mes_signalements : colonnes attendues, ni propositions ni corrigé');

-- Traitement par l'admin.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select is((select count(*)::int from public.signalements_admin() where question_id = '00000000-0000-0000-0000-00000000e001'), 2,
  'admin : deux signalements ouverts');
select lives_ok($$ select public.traiter_signalement((select id from public.signalements_admin()
  where question_id = '00000000-0000-0000-0000-00000000e001' and auteur_email = 'prof1-s@test.local'), 'rejete') $$,
  'admin : rejette le premier signalement');
reset role;
select is((select statut::text from public.question where id = '00000000-0000-0000-0000-00000000e001'), 'a_relire',
  'un autre signalement ouvert : la question reste a_relire');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select lives_ok($$ select public.traiter_signalement((select id from public.signalements_admin()
  where question_id = '00000000-0000-0000-0000-00000000e001' and auteur_email = 'prof2-s@test.local'), 'rejete', 'La réponse est juste.') $$,
  'admin : rejette le dernier signalement avec une réponse');
reset role;
select is((select statut::text from public.question where id = '00000000-0000-0000-0000-00000000e001'), 'valide',
  'dernier signalement rejeté : la question redevient valide');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a6","role":"authenticated"}', true);
select is((select reponse from public.mes_signalements() where question_id = '00000000-0000-0000-0000-00000000e001'),
  'La réponse est juste.', 'l''enseignant lit la réponse de l''admin');

-- « traite » ne change pas le statut de la question.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a5","role":"authenticated"}', true);
select lives_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', 'Nouveau problème constaté') $$,
  'après rejet, le même enseignant peut signaler de nouveau');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select lives_ok($$ select public.traiter_signalement((select id from public.signalements_admin()
  where question_id = '00000000-0000-0000-0000-00000000e001'), 'traite') $$, 'admin : marque comme traité');
reset role;
select is((select statut::text from public.question where id = '00000000-0000-0000-0000-00000000e001'), 'a_relire',
  'traite : la question reste a_relire');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

-- Erreurs de traitement.
select throws_ok($$ select public.traiter_signalement(gen_random_uuid(), 'autre') $$,
  'P0001', 'decision_invalide', 'décision inconnue');
select throws_ok($$ select public.traiter_signalement(gen_random_uuid(), 'traite', repeat('x', 1001)) $$,
  'P0001', 'reponse_trop_longue', 'réponse trop longue');
select throws_ok($$ select public.traiter_signalement((select id from public.signalements_admin('traite')
  where question_id = '00000000-0000-0000-0000-00000000e001'), 'rejete') $$,
  'P0001', 'signalement_introuvable', 'signalement déjà traité');

-- Réimport d'une question signalée : elle garde son statut, le signalement reste ouvert.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a5","role":"authenticated"}', true);
select lives_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e006', 'La réponse est fausse.') $$,
  'signalement d''une question importée');
select lives_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e007', 'La réponse est fausse.') $$,
  'signalement d''une seconde question importée');
reset role;
select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000d101', null,
  '{"source":"test-s:1","type":"vrai_faux","enonce":"Q importée, texte revu","bonnes_reponses":[true],"statut":"valide"}')),
  'modifiee', 'réimport d''une question signalée : modifiée en place');
select is((select statut::text from public.question where id = '00000000-0000-0000-0000-00000000e006'), 'a_relire',
  'réimport : la question signalée reste a_relire malgré le statut valide du fichier');
select is((select statut from public.signalement where question_id = '00000000-0000-0000-0000-00000000e006'), 'ouvert',
  'réimport : le signalement reste ouvert');
select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000d101', null,
  '{"source":"test-s:2","type":"vrai_faux","enonce":"Q importée 2","bonnes_reponses":[false],"statut":"valide"}')),
  'versionnee', 'réimport d''une question signalée, déjà tirée, dont la structure change : versionnée');
select is((select q.statut::text || ':' || s.statut from public.question q join public.signalement s on s.question_id = q.id
            where q.source = 'test-s:2'), 'a_relire:ouvert',
  'réimport versionné : la nouvelle version reste a_relire et porte le signalement ouvert');

-- Rejeter un signalement d'une question modifiée depuis ne la remet pas en valide.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a5","role":"authenticated"}', true);
select lives_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e008', 'La réponse est fausse.') $$,
  'signalement avant modification');
reset role;
-- Simule une modification faite après le signalement (même transaction : now() ne bouge pas).
update public.signalement set cree_le = now() - interval '1 hour' where question_id = '00000000-0000-0000-0000-00000000e008';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select lives_ok($$ select public.traiter_signalement((select id from public.signalements_admin()
  where question_id = '00000000-0000-0000-0000-00000000e008'), 'rejete') $$, 'admin : rejette après une modification');
reset role;
select is((select statut::text from public.question where id = '00000000-0000-0000-0000-00000000e008'), 'a_relire',
  'question modifiée depuis le signalement : reste a_relire après rejet');
set local role authenticated;

-- Liste admin « tous » : les plus récents d'abord.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select ok((select bool_and(a.cree_le >= b.cree_le)
             from public.signalements_admin(null) with ordinality a
             join public.signalements_admin(null) with ordinality b on b.ordinality = a.ordinality + 1),
  'signalements_admin(null) : les plus récents d''abord');

-- Droits d'exécution.
set local role anon;
select throws_ok($$ select public.signaler_question('00000000-0000-0000-0000-00000000e001', 'Une erreur ici') $$,
  '42501', null, 'anon : exécution refusée');
reset role;
select ok(not has_function_privilege('anon', 'public.mes_signalements()', 'execute')
          and not has_function_privilege('anon', 'public.signalements_admin(text)', 'execute')
          and not has_function_privilege('anon', 'public.traiter_signalement(uuid, text, text)', 'execute'),
  'anon : aucune des trois autres fonctions');
select ok(has_function_privilege('authenticated', 'public.signaler_question(uuid, text)', 'execute')
          and has_function_privilege('authenticated', 'public.mes_signalements()', 'execute')
          and has_function_privilege('authenticated', 'public.signalements_admin(text)', 'execute')
          and has_function_privilege('authenticated', 'public.traiter_signalement(uuid, text, text)', 'execute'),
  'authenticated : les quatre fonctions');

select * from finish();
rollback;
