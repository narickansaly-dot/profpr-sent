begin;
select plan(12);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000e1', 'eleve-rg@test.local'),
  ('00000000-0000-0000-0000-0000000000e2', 'autre-rg@test.local'),
  ('00000000-0000-0000-0000-0000000000e3', 'prof-rg@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000e3';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000e1', 'technologique', 'RGE', 'Filière révision');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000e1', 'cours-rg', '10000000-0000-0000-0000-0000000000e1', '1re', 'R', 'Cours révision', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000e1', '20000000-0000-0000-0000-0000000000e1', 'ch1', 1, 'Un', true),
  ('30000000-0000-0000-0000-0000000000e2', '20000000-0000-0000-0000-0000000000e1', 'ch2', 2, 'Deux', true);
-- 12 questions par chapitre : trop peu pour un quiz de chapitre (15), assez pour une révision générale (24).
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select c.id, 'qcm_unique', 'Q', '["a","b"]', 'valide', 'rg:' || c.slug || ':' || i
    from public.chapitre c cross join generate_series(1, 12) i where c.cours_id = '20000000-0000-0000-0000-0000000000e1';
insert into public.question_corrige (question_id, bonnes_reponses) select id, '[0]' from public.question where source like 'rg:%';
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, cours_id, revision_generale) values
  ('40000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-0000000000e1', 'revision', 'Révision générale', now() + interval '1 day', 60, '20000000-0000-0000-0000-0000000000e1', true),
  ('40000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-0000000000e1', 'revision', 'Révision générale courte', now() + interval '2 days', 60, '20000000-0000-0000-0000-0000000000e1', true);
insert into public.evenement_chapitre values
  ('40000000-0000-0000-0000-0000000000e1', '30000000-0000-0000-0000-0000000000e1'),
  ('40000000-0000-0000-0000-0000000000e1', '30000000-0000-0000-0000-0000000000e2'),
  ('40000000-0000-0000-0000-0000000000e2', '30000000-0000-0000-0000-0000000000e1');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e2","role":"authenticated"}', true);
select throws_ok($$ select public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e1') $$,
  'P0001', 'evenement_introuvable', 'on ne lance que ses propres révisions générales');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e3","role":"authenticated"}', true);
select throws_ok($$ select public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e1') $$,
  'P0001', 'reserve_eleves', 'réservé aux élèves');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated"}', true);
select throws_ok($$ select public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e2') $$,
  'P0001', 'quiz_indisponible', 'moins de 15 questions validées au total');
select set_config('test.tentative', public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e1')::text, true);
select results_eq(
  $$ select type::text, chapitre_id, nb_questions::int from public.tentative where id = current_setting('test.tentative')::uuid $$,
  $$ values ('revision'::text, null::uuid, 24) $$,
  'tentative de révision sans chapitre, 24 questions (toutes celles disponibles)');
select is((select count(distinct q.chapitre_id)::int from public.tentative_question tq join public.question q on q.id = tq.question_id
            where tq.tentative_id = current_setting('test.tentative')::uuid), 2, 'les deux chapitres sont représentés');
select is(public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e1'), current_setting('test.tentative')::uuid,
  'relancer renvoie la révision générale ouverte');
select lives_ok($$ select public.terminer_tentative(current_setting('test.tentative')::uuid) $$, 'la tentative se termine');
select is((select count(*)::int from public.progression_chapitre where eleve_id = '00000000-0000-0000-0000-0000000000e1'), 0,
  'la progression des chapitres n''est pas touchée');
select is((select count(*)::int from public.historique_question where eleve_id = '00000000-0000-0000-0000-0000000000e1'), 24,
  'l''historique des questions est alimenté');
select is((select statut::text from public.tentative where id = current_setting('test.tentative')::uuid), 'terminee', 'statut terminé');
select is((select count(*)::int from public.correction_tentative(current_setting('test.tentative')::uuid)), 24,
  'la correction d''une révision générale se lit');

reset role;
select throws_ok($$ insert into public.tentative (eleve_id, type, cours_id, chapitre_id, nb_questions)
                    values ('00000000-0000-0000-0000-0000000000e1', 'quiz_chapitre', '20000000-0000-0000-0000-0000000000e1', null, 15) $$,
  '23514', null, 'un quiz de chapitre a toujours un chapitre');

select * from finish();
rollback;
