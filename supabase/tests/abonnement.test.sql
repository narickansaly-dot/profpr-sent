begin;
select plan(12);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000005b1', 'abonne@test.local'),
  ('00000000-0000-0000-0000-0000000005b2', 'grace@test.local'),
  ('00000000-0000-0000-0000-0000000005b3', 'expire@test.local'),
  ('00000000-0000-0000-0000-0000000005b4', 'parent-acces@test.local');
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005b1', 'technologique', 'ABN', 'Filière abonnement');
update public.profil set onboarding_termine = true, inscrit_le = now() - interval '30 days', moins_de_15_ans = false,
       filiere_id = '10000000-0000-0000-0000-0000000005b1', niveau_code = '1re'
 where id in ('00000000-0000-0000-0000-0000000005b1', '00000000-0000-0000-0000-0000000005b2', '00000000-0000-0000-0000-0000000005b3');
update public.profil set role = 'parent', onboarding_termine = true where id = '00000000-0000-0000-0000-0000000005b4';
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005b1', 'cours-abn-a', '10000000-0000-0000-0000-0000000005b1', '1re', 'A', 'Cours A', true);
insert into public.abonnement (eleve_id, formule, statut, fin_periode, fin_grace) values
  ('00000000-0000-0000-0000-0000000005b1', 'mensuelle', 'actif', now() + interval '20 days', null),
  ('00000000-0000-0000-0000-0000000005b2', 'annuelle', 'impaye', now() - interval '1 day', now() + interval '6 days'),
  ('00000000-0000-0000-0000-0000000005b3', 'mensuelle', 'impaye', now() - interval '10 days', now() - interval '3 days');

select is(prive.abonnement_actif('00000000-0000-0000-0000-0000000005b1'), true, 'abonnement actif');
select is(prive.abonnement_actif('00000000-0000-0000-0000-0000000005b2'), true, 'impayé pendant le délai de grâce');
select is(prive.abonnement_actif('00000000-0000-0000-0000-0000000005b3'), false, 'délai de grâce dépassé');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), true, 'un abonné lit tous les cours après l''essai');
select results_eq($$ select abonnement->>'statut', abonnement->>'formule' from public.mon_acces() $$,
  $$ values ('actif'::text, 'mensuelle'::text) $$, 'mon_acces expose l''abonnement');
select throws_ok($$ insert into public.abonnement (eleve_id, formule, statut, fin_periode) values ('00000000-0000-0000-0000-0000000005b1', 'mensuelle', 'actif', now()) $$,
  '42501', null, 'un élève n''écrit pas dans abonnement');
select throws_ok($$ update public.abonnement set fin_periode = now() + interval '5 years' $$,
  '42501', null, 'un élève ne prolonge pas son abonnement');
select is((select count(*)::int from public.abonnement), 1, 'un élève ne lit que son abonnement');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b2","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), true, 'délai de grâce : accès conservé');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b3","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), false, 'abonnement échu, sans cours gratuit : fermé');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b4","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), false, 'un parent ne lit aucun cours, même inscrit depuis peu');
select is((select count(*)::int from public.abonnement), 0, 'un parent ne lit pas abonnement directement');

select * from finish();
rollback;
