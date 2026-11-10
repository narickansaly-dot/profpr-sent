begin;
select plan(30);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000f1', 'prof@test.local'),
  ('00000000-0000-0000-0000-0000000000f2', 'admin@test.local'),
  ('00000000-0000-0000-0000-0000000000f3', 'eleve@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000f2';
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000f4', 'refus@test.local'),
  ('00000000-0000-0000-0000-0000000000f5', 'parent@test.local'),
  ('00000000-0000-0000-0000-0000000000f6', 'ens@test.local');
update public.profil set etablissement = 'Lycée Refus', demande_enseignant = true where id = '00000000-0000-0000-0000-0000000000f4';
update public.profil set role = 'parent', etablissement = 'Lycée P', demande_enseignant = true where id = '00000000-0000-0000-0000-0000000000f5';
update public.profil set role = 'enseignant', etablissement = 'Lycée E', demande_enseignant = true where id = '00000000-0000-0000-0000-0000000000f6';

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f1","role":"authenticated"}', true);
select lives_ok($$ update public.profil set demande_enseignant = true, etablissement = 'Lycée Test', nom = 'Camille'
  where id = '00000000-0000-0000-0000-0000000000f1' $$, 'une personne peut demander le rôle enseignant');
select is((select role::text from public.profil where id = '00000000-0000-0000-0000-0000000000f1'), 'eleve', 'la demande ne change pas le rôle');
select is((select count(*)::int from public.demandes_enseignant()), 0, 'un non-admin ne voit aucune demande');
select throws_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f1', true) $$,
  'P0001', 'acces_refuse', 'un non-admin ne peut pas traiter une demande');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated"}', true);
select is((select etablissement from public.demandes_enseignant() where id = '00000000-0000-0000-0000-0000000000f1'), 'Lycée Test', 'l''admin voit la demande');
select lives_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f1', true) $$, 'l''admin accepte');
reset role;
select is((select role::text || '/' || demande_enseignant::text from public.profil where id = '00000000-0000-0000-0000-0000000000f1'),
  'enseignant/false', 'rôle enseignant, demande close');
set local role authenticated;
select throws_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f3', true) $$,
  'P0001', 'demande_introuvable', 'impossible de promouvoir quelqu''un sans demande');

-- refus
select lives_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f4', false) $$, 'l''admin refuse');
reset role;
select is((select role::text || '/' || demande_enseignant::text from public.profil where id = '00000000-0000-0000-0000-0000000000f4'),
  'eleve/false', 'refus : reste élève, demande close');
-- Sans retour à l'accueil, la personne refusée arriverait sur un tableau de bord vide, sans filière ni niveau.
select is((select onboarding_termine::text || '/' || coalesce(etablissement, 'null') from public.profil where id = '00000000-0000-0000-0000-0000000000f4'),
  'false/null', 'refus : accueil à refaire, établissement effacé');
set local role authenticated;

-- demandes sur des profils qui ne sont pas des élèves
select is((select count(*)::int from public.demandes_enseignant() where id in ('00000000-0000-0000-0000-0000000000f5', '00000000-0000-0000-0000-0000000000f6')),
  0, 'parent et enseignant avec demande absents de la liste');
select throws_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f5', true) $$,
  'P0001', 'demande_introuvable', 'un parent ne peut pas être promu');
select throws_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f6', true) $$,
  'P0001', 'demande_introuvable', 'un enseignant ne peut pas être retraité');

-- un enseignant n'est pas admin : une demande ouverte d'élève existe, pour que les refus soient dus au rôle
reset role;
insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000000f7', 'ouverte@test.local');
update public.profil set etablissement = 'Lycée Ouvert', demande_enseignant = true where id = '00000000-0000-0000-0000-0000000000f7';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated"}', true);
select cmp_ok((select count(*)::int from public.demandes_enseignant() where id = '00000000-0000-0000-0000-0000000000f7'), '>=', 1,
  'l''admin voit la demande ouverte de l''élève (le test enseignant n''est pas vide)');
select throws_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f7', null) $$,
  'P0001', 'decision_invalide', 'une décision nulle est refusée');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f1","role":"authenticated"}', true);
select is((select count(*)::int from public.demandes_enseignant()), 0, 'un enseignant ne voit aucune demande');
select throws_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f7', true) $$,
  'P0001', 'acces_refuse', 'un enseignant ne peut pas traiter une demande');

-- Un élève déjà inscrit dans une classe puis validé enseignant quitte ses classes.
reset role;
insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000000f8', 'inscrit@test.local');
update public.profil set etablissement = 'Lycée Inscrit', demande_enseignant = true where id = '00000000-0000-0000-0000-0000000000f8';
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f1', 'Classe', 'FGHJKM'),
  ('60000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000f1', 'Classe quittée', 'GHJKMN');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f8');
insert into prive.depart_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000f8');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated"}', true);
select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f8', true);
reset role;
select is((select count(*)::int from public.inscription_classe where eleve_id = '00000000-0000-0000-0000-0000000000f8'), 0,
  'acceptation : les inscriptions de classe sont supprimées');
select is((select count(*)::int from prive.depart_classe where eleve_id = '00000000-0000-0000-0000-0000000000f8'), 0,
  'acceptation : les départs de classe sont supprimés');
set local role authenticated;

-- anon
select is(has_function_privilege('anon', 'public.demandes_enseignant()', 'EXECUTE'), false, 'anon ne peut pas lister les demandes');
select is(has_function_privilege('anon', 'public.traiter_demande_enseignant(uuid, boolean)', 'EXECUTE'), false, 'anon ne peut pas traiter les demandes');

-- élève : colonnes protégées et contraintes
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f3","role":"authenticated"}', true);
select throws_ok($$ update public.profil set email = 'autre@test.local' where id = '00000000-0000-0000-0000-0000000000f3' $$,
  '42501', null, 'un élève ne peut pas modifier son email');
select throws_ok($$ update public.profil set etablissement = '  Lycée' where id = '00000000-0000-0000-0000-0000000000f3' $$,
  '23514', null, 'établissement avec espaces en bordure refusé');
select throws_ok($$ update public.profil set demande_enseignant = true where id = '00000000-0000-0000-0000-0000000000f3' $$,
  '23514', null, 'demande sans établissement refusée');

-- prénom visible par d'autres comptes : longueur de l'accueil (2 à 60), sans espace en bordure ni caractère de contrôle ou bidi
select lives_ok($$ update public.profil set nom = 'Léa-Marie' where id = '00000000-0000-0000-0000-0000000000f3' $$, 'prénom ordinaire accepté');
select throws_ok($$ update public.profil set nom = ' Léa' where id = '00000000-0000-0000-0000-0000000000f3' $$,
  '23514', null, 'prénom avec espace en bordure refusé');
select throws_ok($$ update public.profil set nom = repeat('a', 61) where id = '00000000-0000-0000-0000-0000000000f3' $$,
  '23514', null, 'prénom de plus de 60 caractères refusé');
select throws_ok($$ update public.profil set nom = 'Lé' || chr(8238) || 'a' where id = '00000000-0000-0000-0000-0000000000f3' $$,
  '23514', null, 'prénom avec caractère bidi refusé');
select throws_ok($$ update public.profil set nom = 'Lé' || chr(10) || 'a' where id = '00000000-0000-0000-0000-0000000000f3' $$,
  '23514', null, 'prénom avec caractère de contrôle refusé');

select * from finish();
rollback;
