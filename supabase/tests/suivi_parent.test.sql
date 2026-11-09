begin;
select plan(21);

insert into auth.users (id, email, email_confirmed_at) values
  ('00000000-0000-0000-0000-0000000005d1', 'suivi-enfant@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d2', 'suivi-parent@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d3', 'suivi-autre-parent@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d4', 'suivi-majeur@test.local', now());
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005d1', 'technologique', 'SVP', 'Filière suivi');
update public.profil set onboarding_termine = true, moins_de_15_ans = true, nom = 'Lou',
       filiere_id = '10000000-0000-0000-0000-0000000005d1', niveau_code = '1re'
 where id = '00000000-0000-0000-0000-0000000005d1';
update public.profil set onboarding_termine = true, moins_de_15_ans = false, nom = 'Max',
       filiere_id = '10000000-0000-0000-0000-0000000005d1', niveau_code = '1re'
 where id = '00000000-0000-0000-0000-0000000005d4';
update public.profil set role = 'parent', onboarding_termine = true, nom = 'Camille'
 where id in ('00000000-0000-0000-0000-0000000005d2', '00000000-0000-0000-0000-0000000005d3');
insert into public.consentement_parental (eleve_id, email_parent, donne_le) values
  ('00000000-0000-0000-0000-0000000005d1', 'suivi-parent@test.local', now() - interval '2 days');
insert into public.lien_parent (eleve_id, parent_id, origine) values
  ('00000000-0000-0000-0000-0000000005d1', '00000000-0000-0000-0000-0000000005d2', 'accord'),
  ('00000000-0000-0000-0000-0000000005d4', '00000000-0000-0000-0000-0000000005d2', 'code');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005d1', 'cours-svp', '10000000-0000-0000-0000-0000000005d1', '1re', 'S', 'Cours suivi', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000005d1', '20000000-0000-0000-0000-0000000005d1', 'ch1', 1, 'Chapitre 1', true),
  ('30000000-0000-0000-0000-0000000005d2', '20000000-0000-0000-0000-0000000005d1', 'ch2', 2, 'Chapitre 2', true);
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide, valide_le) values
  ('00000000-0000-0000-0000-0000000005d1', '30000000-0000-0000-0000-0000000005d1', 80, true, now());

set local role authenticated;

-- lectures
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select is((select count(*)::int from public.enfants_du_parent()), 2, 'le parent voit ses deux enfants');
select results_eq($$ select chapitres_valides, chapitres_total from public.progression_enfant('00000000-0000-0000-0000-0000000005d1') $$,
  $$ values (1, 2) $$, 'progression par cours');
select is((select count(*)::int from public.tentative where eleve_id = '00000000-0000-0000-0000-0000000005d1'), 0,
  'le parent ne lit pas les tentatives de l''enfant');
select throws_ok($$ select count(*) from public.lien_parent $$, '42501', null, 'aucune lecture directe des liens');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d3","role":"authenticated"}', true);
select throws_ok($$ select * from public.progression_enfant('00000000-0000-0000-0000-0000000005d1') $$,
  'P0001', 'lien_introuvable', 'un parent non relié ne lit rien');
select is((select count(*)::int from public.enfants_du_parent()), 0, 'aucun enfant pour un parent non relié');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d4","role":"authenticated"}', true);
select throws_ok($$ select * from public.enfants_du_parent() $$, 'P0001', 'pas_parent', 'réservé aux parents');
select results_eq($$ select nom, origine from public.parents_de_l_eleve() $$,
  $$ values ('Camille'::text, 'code'::text) $$, 'l''élève voit ses parents reliés');

-- retrait
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select throws_ok($$ select public.retirer_consentement('00000000-0000-0000-0000-0000000005d4') $$,
  'P0001', 'retrait_impossible', 'pas de retrait pour un 15 ans ou plus');
select ok(public.retirer_consentement('00000000-0000-0000-0000-0000000005d1') > now() + interval '29 days', 'retrait : suppression dans 30 jours');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005d1'), false, 'compte bloqué après le retrait');
select results_eq($$ select consentement_requis, consentement_retire_le is not null, suppression_prevue_le is not null from public.mon_acces() $$,
  $$ values (true, true, true) $$, 'mon_acces annonce le retrait et la date');
select throws_ok($$ select public.demander_consentement('autre-adresse@test.local') $$,
  'P0001', 'consentement_retire', 'pas de nouvelle demande vers une autre adresse');
select throws_ok($$ select public.annuler_suppression_compte() $$,
  'P0001', 'suppression_imposee', 'l''élève n''annule pas la suppression imposée');
select lives_ok($$ select public.exporter_mes_donnees() $$, 'l''export reste disponible');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d3","role":"authenticated"}', true);
select throws_ok($$ select public.annuler_retrait_consentement('00000000-0000-0000-0000-0000000005d1') $$,
  'P0001', 'lien_introuvable', 'un autre parent n''annule pas');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select lives_ok($$ select public.annuler_retrait_consentement('00000000-0000-0000-0000-0000000005d1') $$, 'le parent annule le retrait');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d1","role":"authenticated"}', true);
select results_eq($$ select consentement_requis, suppression_prevue_le is null from public.mon_acces() $$,
  $$ values (false, true) $$, 'accès rétabli, plus de suppression prévue');

-- export
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select is(jsonb_array_length(public.exporter_mes_donnees()->'enfants_suivis'), 2, 'export du parent : ses enfants suivis');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d1","role":"authenticated"}', true);
select is(public.exporter_mes_donnees()->'parents_relies'->0->>'nom', 'Camille', 'export de l''élève : ses parents');

-- purge des codes expirés
reset role;
insert into prive.code_parent (eleve_id, empreinte, expire_le) values
  ('00000000-0000-0000-0000-0000000005d4', extensions.digest('X', 'sha256'), now() - interval '1 hour');
select prive.purges_quotidiennes();
select is((select count(*)::int from prive.code_parent where eleve_id = '00000000-0000-0000-0000-0000000005d4'), 0, 'codes expirés purgés');

select * from finish();
rollback;
