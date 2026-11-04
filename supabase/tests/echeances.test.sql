begin;
select plan(17);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000c01', 'prof@test.local'),
  ('00000000-0000-0000-0000-000000000c02', 'autre-prof@test.local'),
  ('00000000-0000-0000-0000-000000000c03', 'eleve@test.local'),
  ('00000000-0000-0000-0000-000000000c04', 'libre@test.local');
update public.profil set role = 'enseignant' where id in ('00000000-0000-0000-0000-000000000c01', '00000000-0000-0000-0000-000000000c02');
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-000000000c01', 'technologique', 'ECH', 'Filière échéances');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-000000000c01', 'cours-echeance', '10000000-0000-0000-0000-000000000c01', '1re', 'E', 'E', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01', 'ch1', 1, 'Un', true);
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select '30000000-0000-0000-0000-000000000c01', 'qcm_unique', 'Q', '["a","b"]', 'valide', 'ech:' || i from generate_series(1, 20) i;
insert into public.question_corrige (question_id, bonnes_reponses) select id, '[0]' from public.question where source like 'ech:%';
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide) values
  ('00000000-0000-0000-0000-000000000c03', '30000000-0000-0000-0000-000000000c01', 90, true),
  ('00000000-0000-0000-0000-000000000c04', '30000000-0000-0000-0000-000000000c01', 90, true);
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-000000000c01', '00000000-0000-0000-0000-000000000c01', 'Classe', 'BCDEFG');
insert into public.classe_cours values ('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-000000000c01', '00000000-0000-0000-0000-000000000c03');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c02","role":"authenticated"}', true);
select throws_ok($$ select public.definir_echeance('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01', null, now() + interval '1 day') $$,
  'P0001', 'acces_refuse', 'seul le propriétaire fixe une échéance');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c01","role":"authenticated"}', true);
select throws_ok($$ select public.definir_echeance('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01', now() + interval '2 days', now() + interval '1 day') $$,
  'P0001', 'dates_invalides', 'ouverture après la limite refusée');
select lives_ok($$ select public.definir_echeance('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01', now() + interval '1 day', null) $$,
  'ouverture fixée demain');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c03","role":"authenticated"}', true);
select is((select count(*)::int from public.mes_echeances('20000000-0000-0000-0000-000000000c01')), 1, 'l''élève voit l''échéance de sa classe');
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01') $$, 'P0001', 'evaluation_pas_ouverte', 'pas encore ouverte');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c04","role":"authenticated"}', true);
select lives_ok($$ select public.terminer_tentative(public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01')) $$,
  'un élève hors classe n''est pas concerné');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c01","role":"authenticated"}', true);
select lives_ok($$ select public.definir_echeance('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01', null, now() + interval '1 hour') $$,
  'fenêtre ouverte jusqu''à dans une heure');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c03","role":"authenticated"}', true);
create temporary table e as select public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01') as id;

reset role;
update public.echeance_evaluation set limite = now() - interval '1 minute';
set local role authenticated;
select is(public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01'), (select id from e),
  'une évaluation commencée avant la limite se reprend après');
reset role;
update public.tentative set statut = 'terminee', fin = now() - interval '2 days' where id = (select id from e);
set local role authenticated;
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01') $$, 'P0001', 'evaluation_close', 'après la limite');

-- Plusieurs classes : une classe liée sans échéance n'impose rien.
reset role;
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-000000000c02', '00000000-0000-0000-0000-000000000c01', 'Classe B', 'CDEFGH'),
  ('60000000-0000-0000-0000-000000000c03', '00000000-0000-0000-0000-000000000c01', 'Classe C', 'DEFGHJ');
insert into public.classe_cours values ('60000000-0000-0000-0000-000000000c02', '20000000-0000-0000-0000-000000000c01');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-000000000c02', '00000000-0000-0000-0000-000000000c03');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c03","role":"authenticated"}', true);
select lives_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01') $$,
  'classe close + seconde classe sans dates : ouverte');

reset role;
update public.tentative set statut = 'terminee', fin = now() - interval '2 days' where statut = 'en_cours';
insert into public.echeance_evaluation (classe_id, cours_id, limite)
  values ('60000000-0000-0000-0000-000000000c02', '20000000-0000-0000-0000-000000000c01', now() - interval '1 minute');
set local role authenticated;
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01') $$, 'P0001', 'evaluation_close',
  'les deux classes closes : fermée');

-- mes_echeances ne montre pas les échéances d'une classe dont on ne fait pas partie.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c04","role":"authenticated"}', true);
select is((select count(*)::int from public.mes_echeances()), 0, 'un élève hors classe ne voit aucune échéance');

-- Seconde classe où le cours n'est pas lié : ne rouvre rien.
reset role;
update public.tentative set fin = now() - interval '2 days' where eleve_id = '00000000-0000-0000-0000-000000000c04';
insert into public.inscription_classe (classe_id, eleve_id) values
  ('60000000-0000-0000-0000-000000000c01', '00000000-0000-0000-0000-000000000c04'),
  ('60000000-0000-0000-0000-000000000c03', '00000000-0000-0000-0000-000000000c04');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c04","role":"authenticated"}', true);
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01') $$, 'P0001', 'evaluation_close',
  'seconde classe sans le cours : reste fermée');

-- Propriétaire : cours non rattaché, suppression, accès.
reset role;
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-000000000c02', 'cours-libre', '10000000-0000-0000-0000-000000000c01', '1re', 'F', 'F', true);
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c01","role":"authenticated"}', true);
select throws_ok($$ select public.definir_echeance('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c02', null, now() + interval '1 day') $$,
  'P0001', 'cours_invalide', 'cours non rattaché à la classe');
select public.definir_echeance('60000000-0000-0000-0000-000000000c02', '20000000-0000-0000-0000-000000000c01', null, null);
select is((select count(*)::int from public.echeances_classe('60000000-0000-0000-0000-000000000c02')), 0, 'dates nulles : échéance supprimée');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c02","role":"authenticated"}', true);
select throws_ok($$ select * from public.echeances_classe('60000000-0000-0000-0000-000000000c01') $$, 'P0001', 'acces_refuse',
  'echeances_classe réservée au propriétaire');

-- Une classe liée sans échéance apparaît avec des dates nulles.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c03","role":"authenticated"}', true);
select is((select count(*)::int from public.mes_echeances('20000000-0000-0000-0000-000000000c01') where ouverture is null and limite is null),
  1, 'classe liée sans dates : ligne aux dates nulles');

select * from finish();
rollback;
