begin;
select plan(4);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000f1', 'prof-dep@test.local'),
  ('00000000-0000-0000-0000-0000000000f2', 'eleve-dep@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000f1';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000f1', 'technologique', 'DEP', 'Filière départs');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000f1', 'cours-dep', '10000000-0000-0000-0000-0000000000f1', '1re', 'D', 'D', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1', 'ch1', 1, 'Un', true);
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select '30000000-0000-0000-0000-0000000000f1', 'qcm_unique', 'Q', '["a","b"]', 'valide', 'dep:' || i from generate_series(1, 20) i;
insert into public.question_corrige (question_id, bonnes_reponses) select id, '[0]' from public.question where source like 'dep:%';
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide) values
  ('00000000-0000-0000-0000-0000000000f2', '30000000-0000-0000-0000-0000000000f1', 90, true);
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f1', 'Classe A', 'DEPBCD'),
  ('60000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000f1', 'Classe B', 'DEPCDF');
insert into public.classe_cours values
  ('60000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1'),
  ('60000000-0000-0000-0000-0000000000f2', '20000000-0000-0000-0000-0000000000f1');
-- Classe A (actuelle) : date limite passée. Classe B (quittée hier) : pas d'échéance.
insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite) values
  ('60000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1', null, now() - interval '1 day');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f2');
insert into prive.depart_classe (classe_id, eleve_id, quitte_le) values
  ('60000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000f2', now() - interval '1 day');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated"}', true);
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000f1') $$,
  'P0001', 'evaluation_close', 'une classe quittée sans échéance n''ouvre plus la fenêtre');
select results_eq($$ select classe_nom, quittee from public.mes_echeances('20000000-0000-0000-0000-0000000000f1') $$,
  $$ values ('Classe A'::text, false) $$, 'la classe quittée sans échéance n''est pas listée');

reset role;
insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite) values
  ('60000000-0000-0000-0000-0000000000f2', '20000000-0000-0000-0000-0000000000f1', null, now() + interval '1 day');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated"}', true);
select results_eq($$ select classe_nom, quittee from public.mes_echeances('20000000-0000-0000-0000-0000000000f1') order by classe_nom $$,
  $$ values ('Classe A'::text, false), ('Classe B'::text, true) $$, 'une classe quittée avec échéance est listée comme quittée');
select lives_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000f1') $$,
  'l''échéance ouverte de la classe quittée s''applique encore pendant 30 jours');

select * from finish();
rollback;
