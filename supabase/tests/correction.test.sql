begin;
select plan(30);

insert into public.filiere (id, voie, code, nom) values
  ('10000000-0000-0000-0000-0000000000b1', 'technologique', 'CRR', 'Filière correction');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000b1', 'cours-correction', '10000000-0000-0000-0000-0000000000b1', '1re', 'C', 'C', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000b1', '20000000-0000-0000-0000-0000000000b1', 'ch1', 1, 'Ch', true);
insert into public.question (id, chapitre_id, type, enonce, propositions, statut) values
  ('40000000-0000-0000-0000-0000000000b1', '30000000-0000-0000-0000-0000000000b1', 'qcm_unique', 'U', '["a","b","c"]', 'valide'),
  ('40000000-0000-0000-0000-0000000000b2', '30000000-0000-0000-0000-0000000000b1', 'qcm_multiple', 'M', '["a","b","c","d"]', 'valide'),
  ('40000000-0000-0000-0000-0000000000b3', '30000000-0000-0000-0000-0000000000b1', 'vrai_faux', 'V', '[]', 'valide'),
  ('40000000-0000-0000-0000-0000000000b4', '30000000-0000-0000-0000-0000000000b1', 'reponse_courte', 'C', '[]', 'valide'),
  ('40000000-0000-0000-0000-0000000000b5', '30000000-0000-0000-0000-0000000000b1', 'reponse_courte', 'N', '[]', 'valide'),
  ('40000000-0000-0000-0000-0000000000b6', '30000000-0000-0000-0000-0000000000b1', 'reponse_courte', 'R', '[]', 'valide');
insert into public.question_corrige (question_id, bonnes_reponses, reponses_acceptees, marge, marge_relative) values
  ('40000000-0000-0000-0000-0000000000b1', '[1]', '{}', null, false),
  ('40000000-0000-0000-0000-0000000000b2', '[2,0]', '{}', null, false),
  ('40000000-0000-0000-0000-0000000000b3', '[true]', '{}', null, false),
  ('40000000-0000-0000-0000-0000000000b4', '[]', '{"Fréquence cardiaque","FC"}', null, false),
  ('40000000-0000-0000-0000-0000000000b5', '[]', '{"5"}', 0.5, false),
  ('40000000-0000-0000-0000-0000000000b6', '[]', '{"70"}', 0.1, true);

-- Normalisation
select is(prive.normaliser('  Éléphant   ROSE !'), 'elephant rose', 'normaliser : casse, accents, espaces, ponctuation finale');
select is(prive.en_nombre('5,4'), 5.4::numeric, 'en_nombre : virgule décimale');
select is(prive.en_nombre('abc'), null, 'en_nombre : texte non numérique');

-- QCM à une réponse
select ok(prive.corriger('40000000-0000-0000-0000-0000000000b1', '[1]'), 'qcm_unique : bonne réponse');
select ok(not prive.corriger('40000000-0000-0000-0000-0000000000b1', '[0]'), 'qcm_unique : mauvaise réponse');
select ok(not prive.corriger('40000000-0000-0000-0000-0000000000b1', null), 'qcm_unique : sans réponse');
-- QCM à plusieurs réponses : toutes les bonnes et aucune autre
select ok(prive.corriger('40000000-0000-0000-0000-0000000000b2', '[0,2]'), 'qcm_multiple : bonnes réponses dans un autre ordre');
select ok(not prive.corriger('40000000-0000-0000-0000-0000000000b2', '[0]'), 'qcm_multiple : incomplet');
select ok(not prive.corriger('40000000-0000-0000-0000-0000000000b2', '[0,2,3]'), 'qcm_multiple : une case en trop');
-- Vrai / faux
select ok(prive.corriger('40000000-0000-0000-0000-0000000000b3', '[true]'), 'vrai_faux : bonne réponse');
select ok(not prive.corriger('40000000-0000-0000-0000-0000000000b3', '[false]'), 'vrai_faux : mauvaise réponse');
-- Réponse courte
select ok(prive.corriger('40000000-0000-0000-0000-0000000000b4', '["frequence  CARDIAQUE."]'), 'courte : accents, casse, espaces, point');
select ok(prive.corriger('40000000-0000-0000-0000-0000000000b4', '["fc"]'), 'courte : autre réponse acceptée');
select ok(not prive.corriger('40000000-0000-0000-0000-0000000000b4', '["débit"]'), 'courte : mauvaise réponse');
select ok(prive.corriger('40000000-0000-0000-0000-0000000000b5', '["5,4"]'), 'numérique : dans la marge absolue');
select ok(not prive.corriger('40000000-0000-0000-0000-0000000000b5', '["5.6"]'), 'numérique : hors de la marge absolue');
select ok(prive.corriger('40000000-0000-0000-0000-0000000000b6', '["76"]'), 'numérique : dans la marge relative (10 %)');
select ok(not prive.corriger('40000000-0000-0000-0000-0000000000b6', '["78"]'), 'numérique : hors de la marge relative');

-- Permutations (affiché → origine et retour)
select is(prive.vers_original('qcm_unique', '{2,0,1}', '[0]'), '[2]'::jsonb, 'vers_original : qcm_unique');
select is(prive.vers_original('qcm_multiple', '{2,0,1}', '[0,1]'), '[0,2]'::jsonb, 'vers_original : qcm_multiple trié');
select is(prive.vers_original('reponse_courte', '{}', '["  abc "]'), '["abc"]'::jsonb, 'vers_original : texte nettoyé');
select is(prive.vers_original('qcm_unique', '{2,0,1}', '[]'), null, 'vers_original : réponse vide → null');
select throws_ok($$ select prive.vers_original('qcm_unique', '{2,0,1}', '[3]') $$, 'P0001', 'reponse_invalide', 'vers_original : indice hors limites');
select throws_ok($$ select prive.vers_original('qcm_multiple', '{2,0,1}', '[1,1]') $$, 'P0001', 'reponse_invalide', 'vers_original : indice en double');
select throws_ok($$ select prive.vers_original('vrai_faux', '{}', '["oui"]') $$, 'P0001', 'reponse_invalide', 'vers_original : vrai_faux non booléen');
select throws_ok($$ select prive.vers_original('qcm_unique', '{2,0,1}', '[1.5]') $$, 'P0001', 'reponse_invalide', 'vers_original : indice non entier');
select is(prive.vers_affiche('qcm_multiple', '{2,0,1}', '[0,2]'), '[0,1]'::jsonb, 'vers_affiche : qcm_multiple');
select is(prive.propositions_affichees('["a","b","c"]', '{2,0,1}'), '["c","a","b"]'::jsonb, 'propositions_affichees');
select is((select array_agg(x order by x) from unnest(prive.melanger(4)) x), '{0,1,2,3}'::smallint[], 'melanger : permutation complète');

-- Le schéma prive n'est pas accessible aux élèves
set local role authenticated;
select throws_ok($$ select prive.normaliser('a') $$, '42501', null, 'élève : pas d''accès au schéma prive');

select * from finish();
rollback;
