begin;
select plan(11);

-- Utilisateurs : 1 = élève en essai, 2 = admin du contenu, 3 = élève dont l'essai est terminé
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'eleve@test.local'),
  ('00000000-0000-0000-0000-000000000002', 'admin@test.local'),
  ('00000000-0000-0000-0000-000000000003', 'ancien@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-000000000002';
update public.profil set inscrit_le = now() - interval '10 days' where id = '00000000-0000-0000-0000-000000000003';

insert into public.filiere (id, voie, code, nom) values
  ('10000000-0000-0000-0000-000000000001', 'technologique', 'TEST', 'Filière test');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-000000000001', 'cours-test', '10000000-0000-0000-0000-000000000001', '1re', 'Test', 'Cours test', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'ch1', 1, 'Publié', true),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'ch2', 2, 'Brouillon', false);
insert into public.question (id, chapitre_id, type, enonce, propositions, statut) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'qcm_unique', 'Validée', '["a","b"]', 'valide'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'qcm_unique', 'Brouillon', '["a","b"]', 'brouillon');
insert into public.question_corrige (question_id, bonnes_reponses) values
  ('40000000-0000-0000-0000-000000000001', '[0]'),
  ('40000000-0000-0000-0000-000000000002', '[1]');

-- Élève en essai
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', true);

select is((select count(*)::int from public.chapitre), 1, 'élève en essai : voit seulement les chapitres publiés');
select is((select count(*)::int from public.question), 1, 'élève : voit seulement les questions validées');
select is((select count(*)::int from public.question_corrige), 0, 'élève : ne lit aucun corrigé');
select is((select count(*)::int from public.profil), 1, 'élève : ne voit que son propre profil');
select lives_ok($$ update public.profil set nom = 'Léa' where id = '00000000-0000-0000-0000-000000000001' $$, 'élève : peut modifier son nom');
select throws_ok($$ update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-000000000001' $$, '42501', null, 'élève : ne peut pas changer son rôle');
select throws_ok($$ insert into public.cours (slug, matiere, titre) values ('x', 'x', 'x') $$, '42501', null, 'élève : ne peut pas créer de cours');

-- Élève dont l'essai est terminé (pas encore d'abonnement ni de cours gratuit : étape 5)
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
select is((select count(*)::int from public.chapitre), 0, 'élève hors essai : aucun chapitre');
select is((select count(*)::int from public.cours), 1, 'élève hors essai : voit quand même le catalogue');

-- Admin du contenu
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}', true);
select is((select count(*)::int from public.chapitre), 2, 'admin : voit aussi les brouillons');
select is((select count(*)::int from public.question_corrige), 2, 'admin : lit les corrigés');

select * from finish();
rollback;
