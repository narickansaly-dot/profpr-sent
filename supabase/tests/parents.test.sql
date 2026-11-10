begin;
select plan(28);

insert into auth.users (id, email, email_confirmed_at) values
  ('00000000-0000-0000-0000-0000000005c1', 'enfant-mineur@test.local', now()),
  ('00000000-0000-0000-0000-0000000005c2', 'enfant-majeur@test.local', now()),
  ('00000000-0000-0000-0000-0000000005c3', 'Parent.Un@Test.local', now()),
  ('00000000-0000-0000-0000-0000000005c4', 'parent-deux@test.local', now()),
  ('00000000-0000-0000-0000-0000000005c5', 'parent-trois@test.local', now()),
  ('00000000-0000-0000-0000-0000000005c6', 'parent-non-confirme@test.local', null),
  ('00000000-0000-0000-0000-0000000005c7', 'eleve-actif@test.local', now()),
  ('00000000-0000-0000-0000-0000000005c8', 'enfant-accord-donne@test.local', now()),
  ('00000000-0000-0000-0000-0000000005c9', 'enfant-accord-attente@test.local', now()),
  ('00000000-0000-0000-0000-0000000005ca', 'enfant-accord-retire@test.local', now());
update public.profil set onboarding_termine = true, moins_de_15_ans = true
  where id in ('00000000-0000-0000-0000-0000000005c8', '00000000-0000-0000-0000-0000000005c9', '00000000-0000-0000-0000-0000000005ca');
update public.profil set onboarding_termine = true, moins_de_15_ans = true where id = '00000000-0000-0000-0000-0000000005c1';
update public.profil set onboarding_termine = true, moins_de_15_ans = false where id in ('00000000-0000-0000-0000-0000000005c2', '00000000-0000-0000-0000-0000000005c7');
insert into public.consentement_parental (eleve_id, email_parent, donne_le) values
  ('00000000-0000-0000-0000-0000000005c1', 'parent.un@test.local', now());
-- Accord donné à une adresse dont le compte n'est pas confirmé ; accord en attente ; accord retiré.
insert into public.consentement_parental (eleve_id, email_parent, donne_le, retire_le) values
  ('00000000-0000-0000-0000-0000000005c8', 'parent-non-confirme@test.local', now(), null),
  ('00000000-0000-0000-0000-0000000005c9', 'parent-trois@test.local', null, null),
  ('00000000-0000-0000-0000-0000000005ca', 'parent-trois@test.local', now(), now());
-- Un élève qui a commencé à utiliser l'application ne peut plus devenir parent.
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005c1', 'technologique', 'PAR', 'Filière parents');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005c1', 'cours-parents', '10000000-0000-0000-0000-0000000005c1', '1re', 'P', 'Cours parents', true);
insert into public.acces_gratuit (eleve_id, cours_id) values ('00000000-0000-0000-0000-0000000005c7', '20000000-0000-0000-0000-0000000005c1');
update public.profil set onboarding_termine = false where id = '00000000-0000-0000-0000-0000000005c7';

set local role authenticated;

-- devenir_parent
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c3","role":"authenticated"}', true);
select throws_ok($$ select public.devenir_parent('  ') $$, 'P0001', 'nom_parent_invalide', 'nom vide refusé');
select lives_ok($$ select public.devenir_parent('Camille') $$, 'un nouveau compte devient parent');
select results_eq($$ select role::text, onboarding_termine from public.profil where id = auth.uid() $$,
  $$ values ('parent'::text, true) $$, 'rôle parent et accueil terminé');
select throws_ok($$ select public.devenir_parent('Camille') $$, 'P0001', 'deja_inscrit', 'pas deux fois');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c2","role":"authenticated"}', true);
select throws_ok($$ select public.devenir_parent('Lou') $$, 'P0001', 'deja_inscrit', 'un élève inscrit ne devient pas parent');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c7","role":"authenticated"}', true);
select throws_ok($$ select public.devenir_parent('Lou') $$, 'P0001', 'deja_inscrit', 'un élève avec un cours gratuit ne devient pas parent');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c4","role":"authenticated"}', true);
select lives_ok($$ select public.devenir_parent('Sacha') $$, 'deuxième parent');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c5","role":"authenticated"}', true);
select lives_ok($$ select public.devenir_parent('Alix') $$, 'troisième parent');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c6","role":"authenticated"}', true);
select lives_ok($$ select public.devenir_parent('Noa') $$, 'parent à l''adresse non confirmée');

-- lier_par_email
select is(public.lier_par_email(), 0, 'adresse non confirmée : aucun lien, même avec un accord donné');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c5","role":"authenticated"}', true);
select is(public.lier_par_email(), 0, 'accord non donné ou retiré : aucun lien');
reset role;
select is((select count(*)::int from public.lien_parent where eleve_id in
  ('00000000-0000-0000-0000-0000000005c8', '00000000-0000-0000-0000-0000000005c9', '00000000-0000-0000-0000-0000000005ca')),
  0, 'aucun lien créé pour ces trois enfants');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c3","role":"authenticated"}', true);
select is(public.lier_par_email(), 1, 'adresse de l''accord, casse ignorée : enfant relié');
select is(public.lier_par_email(), 0, 'déjà relié : rien de nouveau');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c2","role":"authenticated"}', true);
select throws_ok($$ select public.lier_par_email() $$, 'P0001', 'pas_parent', 'réservé aux parents');

-- codes
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c1","role":"authenticated"}', true);
select throws_ok($$ select public.generer_code_parent() $$, 'P0001', 'reserve_15_ans', 'pas de code avant 15 ans');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c2","role":"authenticated"}', true);
create temporary table code_test (code text) on commit drop;
grant all on code_test to authenticated;
insert into code_test select public.generer_code_parent();
select matches((select code from code_test), '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$', 'code de 8 caractères sans ambiguïté');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c4","role":"authenticated"}', true);
select is(public.lier_par_code('ZZZZ-ZZZZ'), 'code_parent_invalide', 'code faux');
select is(public.lier_par_code(lower(substr((select code from code_test), 1, 4)) || '-' || substr((select code from code_test), 5)),
  'lie', 'code juste, casse et tiret ignorés');
select is(public.lier_par_code((select code from code_test)), 'code_parent_invalide', 'usage unique');
select is(public.lier_par_code('AAAA-AAAA'), 'code_parent_invalide', 'troisième essai faux');
select is(public.lier_par_code('BBBB-BBBB'), 'code_parent_invalide', 'quatrième');
select is(public.lier_par_code('CCCC-CCCC'), 'code_parent_invalide', 'cinquième');
select is(public.lier_par_code('DDDD-DDDD'), 'essais_code_epuises', 'au-delà de 5 échecs dans l''heure');

-- limite de 2 parents et déliaison
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c1","role":"authenticated"}', true);
select throws_ok($$ select public.delier_parent('00000000-0000-0000-0000-0000000005c3') $$,
  'P0001', 'deliaison_interdite', 'un moins de 15 ans ne délie pas');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c2","role":"authenticated"}', true);
select lives_ok($$ select public.delier_parent('00000000-0000-0000-0000-0000000005c4') $$, 'un 15 ans ou plus délie');

-- Limite de 2 parents (c1 est déjà relié à c3).
reset role;
select lives_ok($$ select prive.lier('00000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c4', 'code') $$, 'deuxième parent relié');
select throws_ok($$ select prive.lier('00000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c5', 'code') $$,
  'P0001', 'trop_de_parents', 'pas de troisième parent');

select * from finish();
rollback;
