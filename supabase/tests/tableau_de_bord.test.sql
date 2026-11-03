begin;
select plan(5);

insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000000e1', 'tdb@test.local');
insert into public.filiere (id, voie, code, nom) values
  ('10000000-0000-0000-0000-0000000000e1', 'technologique', 'TDB', 'Filière tableau de bord');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000e1', 'cours-tdb', '10000000-0000-0000-0000-0000000000e1', '1re', 'T', 'T', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000e1', '20000000-0000-0000-0000-0000000000e1', 'ch1', 1, 'Chapitre fragile', true),
  ('30000000-0000-0000-0000-0000000000e2', '20000000-0000-0000-0000-0000000000e1', 'ch2', 2, 'Chapitre solide', true);
insert into public.notion (id, chapitre_id, nom) values
  ('50000000-0000-0000-0000-0000000000e1', '30000000-0000-0000-0000-0000000000e2', 'Notion piège');
insert into public.question (id, chapitre_id, notion_id, type, enonce, propositions, statut) values
  ('40000000-0000-0000-0000-0000000000e1', '30000000-0000-0000-0000-0000000000e1', null, 'qcm_unique', 'A', '["a","b"]', 'valide'),
  ('40000000-0000-0000-0000-0000000000e2', '30000000-0000-0000-0000-0000000000e2', '50000000-0000-0000-0000-0000000000e1', 'qcm_unique', 'B', '["a","b"]', 'valide'),
  ('40000000-0000-0000-0000-0000000000e3', '30000000-0000-0000-0000-0000000000e2', null, 'qcm_unique', 'C', '["a","b"]', 'valide');
insert into public.historique_question (eleve_id, question_id, vue, ratee) values
  ('00000000-0000-0000-0000-0000000000e1', '40000000-0000-0000-0000-0000000000e1', 4, 3),
  ('00000000-0000-0000-0000-0000000000e1', '40000000-0000-0000-0000-0000000000e2', 4, 1),
  ('00000000-0000-0000-0000-0000000000e1', '40000000-0000-0000-0000-0000000000e3', 2, 0);
insert into public.tentative (eleve_id, type, cours_id, chapitre_id, nb_questions, statut, fin, note, reussie) values
  ('00000000-0000-0000-0000-0000000000e1', 'quiz_chapitre', '20000000-0000-0000-0000-0000000000e1', '30000000-0000-0000-0000-0000000000e1', 15, 'terminee', now(), 60, false),
  ('00000000-0000-0000-0000-0000000000e1', 'quiz_chapitre', '20000000-0000-0000-0000-0000000000e1', '30000000-0000-0000-0000-0000000000e1', 15, 'terminee', now() - interval '1 day', 60, false),
  ('00000000-0000-0000-0000-0000000000e1', 'quiz_chapitre', '20000000-0000-0000-0000-0000000000e1', '30000000-0000-0000-0000-0000000000e1', 15, 'terminee', now() - interval '2 days', 60, false),
  ('00000000-0000-0000-0000-0000000000e1', 'quiz_chapitre', '20000000-0000-0000-0000-0000000000e1', '30000000-0000-0000-0000-0000000000e1', 15, 'terminee', now() - interval '5 days', 60, false);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated"}', true);

select is((select libelle from public.points_faibles() limit 1), 'Chapitre fragile', 'le plus faible en premier (75 % d''erreurs)');
select is((select taux_erreur from public.points_faibles() limit 1), 75, 'taux d''erreur arrondi');
select is((select count(*)::int from public.points_faibles() where libelle = 'Notion piège'), 1, 'regroupé par notion quand elle existe');
select is((select count(*)::int from public.points_faibles() where libelle = 'Chapitre solide'), 0, 'moins de 3 réponses ou aucune erreur : ignoré');
select is(public.serie_jours(), 3, 'série de 3 jours (aujourd''hui, hier, avant-hier)');

select * from finish();
rollback;
