begin;
select plan(43);

-- Utilisateurs : 1 = élève en essai, 2 = admin du contenu, 3 = élève dont l'essai est terminé, 4 = enseignant
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'eleve@test.local'),
  ('00000000-0000-0000-0000-000000000002', 'admin@test.local'),
  ('00000000-0000-0000-0000-000000000003', 'ancien@test.local'),
  ('00000000-0000-0000-0000-000000000004', 'prof@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-000000000002';
update public.profil set inscrit_le = now() - interval '10 days' where id = '00000000-0000-0000-0000-000000000003';
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-000000000004';

insert into public.filiere (id, voie, code, nom) values
  ('10000000-0000-0000-0000-000000000001', 'technologique', 'TEST', 'Filière test');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-000000000001', 'cours-test', '10000000-0000-0000-0000-000000000001', '1re', 'Test', 'Cours test', true),
  ('20000000-0000-0000-0000-000000000002', 'cours-cache', '10000000-0000-0000-0000-000000000001', '1re', 'Test', 'Cours non publié', false);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'ch1', 1, 'Publié', true),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'ch2', 2, 'Brouillon', false),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'ch1', 1, 'Publié dans un cours caché', true);
insert into public.notion (id, chapitre_id, nom) values
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Notion test');
insert into public.question (id, chapitre_id, type, enonce, propositions, statut) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'qcm_unique', 'Validée', '["a","b"]', 'valide'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'qcm_unique', 'Brouillon', '["a","b"]', 'brouillon'),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'qcm_unique', 'Validée dans un chapitre brouillon', '["a","b"]', 'valide');
insert into public.question_corrige (question_id, bonnes_reponses) values
  ('40000000-0000-0000-0000-000000000001', '[0]'),
  ('40000000-0000-0000-0000-000000000002', '[1]');

-- Élève en essai
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', true);

select is((select count(*)::int from public.chapitre where cours_id in ('20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002')), 1, 'élève en essai : voit seulement les chapitres publiés des cours publiés');
select is((select count(*)::int from public.question where chapitre_id in ('30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000003')), 1, 'élève : voit seulement les questions validées des chapitres publiés');
select is((select count(*)::int from public.question where id = '40000000-0000-0000-0000-000000000003'), 0, 'élève : ne voit pas une question validée d''un chapitre brouillon');
select is((select count(*)::int from public.notion where chapitre_id in ('30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000003')), 1, 'élève en essai : voit les notions des chapitres publiés');
select is((select count(*)::int from public.question_corrige where question_id in ('40000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003')), 0, 'élève : ne lit aucun corrigé');
select is((select count(*)::int from public.question_corrige), 0, 'élève : aucun corrigé, tous corrigés confondus');
select is((select count(*)::int from public.profil where id in ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000004')), 1, 'élève : ne voit que son propre profil');
select is((select count(*)::int from public.cours where id = '20000000-0000-0000-0000-000000000002'), 0, 'élève : ne voit pas un cours non publié');
select is(public.peut_lire_cours('20000000-0000-0000-0000-000000000002'), false, 'élève en essai : peut_lire_cours faux sur un cours non publié');
select lives_ok($$ update public.profil set nom = 'Léa' where id = '00000000-0000-0000-0000-000000000001' $$, 'élève : peut modifier son nom');
select is((select nom from public.profil where id = '00000000-0000-0000-0000-000000000001'), 'Léa', 'élève : son nom a bien été modifié');
select throws_ok($$ update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-000000000001' $$, '42501', null, 'élève : ne peut pas changer son rôle');
select throws_ok($$ update public.profil set inscrit_le = now() where id = '00000000-0000-0000-0000-000000000001' $$, '42501', null, 'élève : ne peut pas changer sa date d''inscription');
select results_eq($$ with u as (update public.profil set nom = 'Pirate' where id = '00000000-0000-0000-0000-000000000003' returning 1) select count(*)::int from u $$,
  $$ values (0) $$, 'élève : ne modifie pas le profil d''un autre élève');
select throws_ok($$ insert into public.cours (slug, matiere, titre) values ('x', 'x', 'x') $$, '42501', null, 'élève : ne peut pas créer de cours');
select throws_ok($$ insert into public.chapitre (cours_id, slug, numero, titre) values ('20000000-0000-0000-0000-000000000001', 'x', 9, 'x') $$, '42501', null, 'élève : ne peut pas créer de chapitre');
select throws_ok($$ insert into public.question (chapitre_id, type, enonce) values ('30000000-0000-0000-0000-000000000001', 'vrai_faux', 'x') $$, '42501', null, 'élève : ne peut pas créer de question');
select throws_ok($$ insert into public.question_corrige (question_id, bonnes_reponses) values ('40000000-0000-0000-0000-000000000003', '[0]') $$, '42501', null, 'élève : ne peut pas créer de corrigé');
select throws_ok($$ truncate public.question_corrige $$, '42501', null, 'élève : ne peut pas vider une table (TRUNCATE ignore RLS)');

-- Élève dont l'essai est terminé (pas encore d'abonnement ni de cours gratuit : étape 5)
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
select is((select nom from public.profil where id = '00000000-0000-0000-0000-000000000003'), null, 'le profil de l''autre élève est intact');
select is((select count(*)::int from public.chapitre where cours_id in ('20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002')), 0, 'élève hors essai : aucun chapitre');
select is((select count(*)::int from public.question where chapitre_id in ('30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000003')), 0, 'élève hors essai : aucune question');
select is((select count(*)::int from public.notion where chapitre_id in ('30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000003')), 0, 'élève hors essai : aucune notion');
select is((select count(*)::int from public.cours where id in ('20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002')), 1, 'élève hors essai : voit quand même le catalogue');

-- Enseignant
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000004","role":"authenticated"}', true);
select is((select count(*)::int from public.chapitre where cours_id in ('20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002')), 1, 'enseignant : lit les chapitres publiés des cours publiés');
select is((select count(*)::int from public.question where chapitre_id in ('30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000003')), 1, 'enseignant : ne voit pas les questions brouillon');
select is((select count(*)::int from public.question_corrige where question_id in ('40000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003')), 0, 'enseignant : ne lit aucun corrigé');

select is((select count(*)::int from public.question_corrige), 0, 'enseignant : aucun corrigé, tous corrigés confondus');

-- Admin du contenu
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}', true);
select is((select count(*)::int from public.chapitre where cours_id in ('20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002')), 3, 'admin : voit aussi les brouillons et les cours non publiés');
select is((select count(*)::int from public.question_corrige where question_id in ('40000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003')), 2, 'admin : lit les corrigés');
select throws_ok($$ insert into public.notion (chapitre_id, nom) values ('30000000-0000-0000-0000-000000000001', 'Notion admin') $$, '42501', null, 'admin : ne peut plus écrire le contenu directement');

-- Visiteur anonyme
set local role anon;
select set_config('request.jwt.claims', '{}', true);
select throws_ok($$ select count(*) from public.cours $$, '42501', null, 'anonyme : aucun accès à cours (droit SELECT retiré)');
select throws_ok($$ select count(*) from public.chapitre $$, '42501', null, 'anonyme : aucun accès à chapitre (droit SELECT retiré)');
select throws_ok($$ select count(*) from public.question $$, '42501', null, 'anonyme : aucun accès à question (droit SELECT retiré)');
select throws_ok($$ select count(*) from public.question_corrige $$, '42501', null, 'anonyme : aucun accès aux corrigés');
select is((select count(*)::int from public.niveau), 3, 'anonyme : lit les niveaux');
select ok((select count(*)::int from public.filiere) >= 1, 'anonyme : lit les filières');
select throws_ok($$ insert into public.filiere (voie, code, nom) values ('generale', 'Z', 'z') $$, '42501', null, 'anonyme : ne peut pas créer de filière');
select throws_ok($$ select public.role_actuel() $$, '42501', null, 'anonyme : ne peut pas appeler les fonctions d''accès');

select is((select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'EXECUTE')), 0, 'anonyme : aucun EXECUTE sur les fonctions du schéma public');
select is(has_table_privilege('anon', 'public.question_corrige', 'MAINTAIN'), false, 'anonyme : pas de MAINTAIN sur question_corrige');
select is(has_table_privilege('anon', 'public.profil', 'MAINTAIN'), false, 'anonyme : pas de MAINTAIN sur profil');
select is(has_table_privilege('anon', 'public.question', 'SELECT'), false, 'anonyme : pas de SELECT sur question');

select * from finish();
rollback;
