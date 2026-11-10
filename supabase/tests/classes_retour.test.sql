begin;
select plan(12);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000007a1', 'prof-retour@test.local'),
  ('00000000-0000-0000-0000-0000000007a2', 'eleve-retire@test.local'),
  ('00000000-0000-0000-0000-0000000007a3', 'eleve-etranger@test.local');
update public.profil set role = 'enseignant', nom = 'Prof retour' where id = '00000000-0000-0000-0000-0000000007a1';
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000007a1', '00000000-0000-0000-0000-0000000007a1', 'Classe retour', 'RETBCD');
insert into public.inscription_classe (classe_id, eleve_id) values
  ('60000000-0000-0000-0000-0000000007a1', '00000000-0000-0000-0000-0000000007a2');

-- Retrait par l'enseignant.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000007a1","role":"authenticated"}', true);
select lives_ok($$ select public.retirer_eleve('60000000-0000-0000-0000-0000000007a1', '00000000-0000-0000-0000-0000000007a2') $$, 'l''enseignant retire l''élève');
select lives_ok($$ select public.retirer_eleve('60000000-0000-0000-0000-0000000007a1', '00000000-0000-0000-0000-0000000007a3') $$, 'retirer un non-membre ne lève pas d''erreur');
reset role;
select is((select count(*)::int from prive.retrait_classe where classe_id = '60000000-0000-0000-0000-0000000007a1'), 1, 'le retrait est noté');
select is((select count(*)::int from prive.retrait_classe where eleve_id = '00000000-0000-0000-0000-0000000007a3'), 0, 'un non-membre ne crée aucune ligne');

-- L'élève retiré ne revient pas aussitôt.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000007a2","role":"authenticated"}', true);
select throws_ok($$ select * from public.rejoindre_classe('retbcd') $$, 'P0001', 'retour_bloque', 'retour bloqué juste après le retrait');
select is((select count(*)::int from public.inscription_classe where eleve_id = '00000000-0000-0000-0000-0000000007a2'), 0, 'toujours hors de la classe');
select is((select count(*)::int from jsonb_array_elements(public.exporter_mes_donnees()->'retraits_classe')), 1, 'l''élève retiré exporte la date de son retrait');
reset role;

-- Après 25 heures, il rejoint.
update prive.retrait_classe set retire_le = now() - interval '25 hours' where eleve_id = '00000000-0000-0000-0000-0000000007a2';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000007a2","role":"authenticated"}', true);
select results_eq($$ select statut from public.rejoindre_classe('RETBCD') $$, $$ values ('ok'::text) $$, 'il rejoint après 24 heures');
reset role;

-- Purge : retrait de 31 jours supprimé, retrait de 2 jours conservé.
update prive.retrait_classe set retire_le = now() - interval '31 days' where eleve_id = '00000000-0000-0000-0000-0000000007a2';
insert into prive.retrait_classe (classe_id, eleve_id, retire_le) values
  ('60000000-0000-0000-0000-0000000007a1', '00000000-0000-0000-0000-0000000007a3', now() - interval '2 days');
select prive.purges_quotidiennes();
select is((select count(*)::int from prive.retrait_classe where eleve_id = '00000000-0000-0000-0000-0000000007a2'), 0, 'retrait de 31 jours purgé');
select is((select count(*)::int from prive.retrait_classe where eleve_id = '00000000-0000-0000-0000-0000000007a3'), 1, 'retrait de 2 jours conservé');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000007a2","role":"authenticated"}', true);
select throws_ok($$ select * from prive.retrait_classe $$, '42501', null, 'la table des retraits n''est pas lisible par un compte');
reset role;
set local role anon;
select throws_ok($$ select public.retirer_eleve('60000000-0000-0000-0000-0000000007a1', '00000000-0000-0000-0000-0000000007a2') $$, '42501', null, 'retirer_eleve refusé à anon');

select * from finish();
rollback;
