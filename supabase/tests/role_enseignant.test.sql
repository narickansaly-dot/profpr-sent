begin;
select plan(8);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000f1', 'prof@test.local'),
  ('00000000-0000-0000-0000-0000000000f2', 'admin@test.local'),
  ('00000000-0000-0000-0000-0000000000f3', 'eleve@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000f2';

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

select * from finish();
rollback;
