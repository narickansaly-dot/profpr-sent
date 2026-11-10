begin;
select plan(8);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000005f1', 'retire-a@test.local'),
  ('00000000-0000-0000-0000-0000000005f2', 'retire-b@test.local');
update public.profil set nom = 'Zoé' where id = '00000000-0000-0000-0000-0000000005f1';
update public.profil set nom = 'Noa' where id = '00000000-0000-0000-0000-0000000005f2';
-- Deux accords donnés : l'un reste valable (jeton 'a'), l'autre est retiré (jeton 'b').
insert into public.consentement_parental (eleve_id, email_parent, jeton_empreinte, donne_le, retire_le) values
  ('00000000-0000-0000-0000-0000000005f1', 'retire-a@test.local', extensions.digest(repeat('a', 43), 'sha256'), now() - interval '2 days', null),
  ('00000000-0000-0000-0000-0000000005f2', 'retire-b@test.local', extensions.digest(repeat('b', 43), 'sha256'), now() - interval '2 days', now() - interval '1 day');

set local role anon;
select results_eq($$ select prenom, deja_donne, retire from public.lire_demande_consentement(repeat('a', 43)) $$,
  $$ values ('Zoé'::text, true, false) $$, 'accord non retiré : retire = faux');
select results_eq($$ select prenom, deja_donne, retire from public.lire_demande_consentement(repeat('b', 43)) $$,
  $$ values ('Noa'::text, true, true) $$, 'accord retiré : retire = vrai');
select throws_ok($$ select public.donner_consentement(repeat('b', 43)) $$, 'P0001', 'consentement_retire', 'après un retrait, donner_consentement refuse');
select is(public.donner_consentement(repeat('a', 43)), 'Zoé', 'sans retrait, donner_consentement fonctionne comme avant');
select throws_ok($$ select * from public.lire_demande_consentement('mauvais') $$, 'P0001', 'lien_consentement_invalide', 'jeton mal formé toujours refusé');
select throws_ok($$ select public.donner_consentement('mauvais') $$, 'P0001', 'lien_consentement_invalide', 'jeton mal formé toujours refusé (donner)');
select ok(has_function_privilege('anon', 'public.lire_demande_consentement(text)', 'EXECUTE'), 'lire_demande_consentement reste ouverte à anon');
select ok(has_function_privilege('authenticated', 'public.lire_demande_consentement(text)', 'EXECUTE'), 'lire_demande_consentement reste ouverte à authenticated');

select * from finish();
rollback;
