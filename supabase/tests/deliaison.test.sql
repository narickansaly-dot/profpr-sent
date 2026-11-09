begin;
select plan(14);

insert into auth.users (id, email, email_confirmed_at) values
  ('00000000-0000-0000-0000-0000000005d1', 'enfant-mail@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d2', 'parent-mail@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d3', 'enfant-retrait@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d4', 'parent-retrait@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d5', 'enfant-majeur@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d6', 'parent-code@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d7', 'parent-nom@test.local', now());
update public.profil set onboarding_termine = true, moins_de_15_ans = true
  where id in ('00000000-0000-0000-0000-0000000005d1', '00000000-0000-0000-0000-0000000005d3');
update public.profil set onboarding_termine = true, moins_de_15_ans = false where id = '00000000-0000-0000-0000-0000000005d5';
update public.profil set role = 'parent', onboarding_termine = true
  where id in ('00000000-0000-0000-0000-0000000005d2', '00000000-0000-0000-0000-0000000005d4', '00000000-0000-0000-0000-0000000005d6');
insert into public.consentement_parental (eleve_id, email_parent, donne_le) values
  ('00000000-0000-0000-0000-0000000005d1', 'parent-mail@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d3', 'parent-retrait@test.local', now());

set local role authenticated;

-- Parent relié par l'adresse de l'accord : la déliaison n'est pas annulée par lier_par_email.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select is(public.lier_par_email(), 1, 'relié par l''adresse de l''accord');
select lives_ok($$ select public.delier_parent('00000000-0000-0000-0000-0000000005d1') $$, 'le parent se délie');
select is(public.lier_par_email(), 0, 'lier_par_email ne recrée pas le lien délié');
reset role;
select is((select count(*)::int from public.lien_parent where eleve_id = '00000000-0000-0000-0000-0000000005d1'), 0, 'aucun lien après déliaison');
select is((select count(*)::int from prive.deliaison where eleve_id = '00000000-0000-0000-0000-0000000005d1'
  and parent_id = '00000000-0000-0000-0000-0000000005d2'), 1, 'la déliaison est tracée');

-- Un parent qui a retiré l'accord ne peut pas se délier avant d'annuler le retrait.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d4","role":"authenticated"}', true);
select is(public.lier_par_email(), 1, 'second parent relié');
select lives_ok($$ select public.retirer_consentement('00000000-0000-0000-0000-0000000005d3') $$, 'retrait de l''accord');
select throws_ok($$ select public.delier_parent('00000000-0000-0000-0000-0000000005d3') $$,
  'P0001', 'retrait_en_cours', 'pas de déliaison pendant un retrait');
select lives_ok($$ select public.annuler_retrait_consentement('00000000-0000-0000-0000-0000000005d3') $$, 'retrait annulé');
select lives_ok($$ select public.delier_parent('00000000-0000-0000-0000-0000000005d3') $$, 'déliaison possible ensuite');

-- Re-liaison volontaire par code pour un élève de 15 ans ou plus : la trace est effacée.
reset role;
select prive.lier('00000000-0000-0000-0000-0000000005d5', '00000000-0000-0000-0000-0000000005d6', 'code');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d5","role":"authenticated"}', true);
select lives_ok($$ select public.delier_parent('00000000-0000-0000-0000-0000000005d6') $$, 'l''élève de 15 ans ou plus délie');
create temporary table code_deliaison (code text) on commit drop;
grant all on code_deliaison to authenticated;
insert into code_deliaison select public.generer_code_parent();
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d6","role":"authenticated"}', true);
select is(public.lier_par_code((select code from code_deliaison)), 'lie', 're-liaison par code');
reset role;
select is((select count(*)::int from prive.deliaison where eleve_id = '00000000-0000-0000-0000-0000000005d5'), 0, 'la trace est effacée');

-- devenir_parent : un prénom d'un seul caractère est refusé.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d7","role":"authenticated"}', true);
select throws_ok($$ select public.devenir_parent('A') $$, 'P0001', 'nom_parent_invalide', 'prénom d''un caractère refusé');

select * from finish();
rollback;
