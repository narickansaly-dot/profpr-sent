begin;
select plan(14);

insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000006a1', 'technologique', 'GST', 'Filière garder');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000006a1', 'cours-garder', '10000000-0000-0000-0000-0000000006a1', '1re', 'G', 'Cours garder', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000006a1', '20000000-0000-0000-0000-0000000006a1', 'ch1', 1, 'Chapitre 1', true);

-- Deux questions importées puis validées par l'enseignant.
select prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:1","type":"qcm_unique","enonce":"Question un","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"valide"}');
select prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:2","type":"qcm_unique","enonce":"Question deux","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"valide"}');

-- Réimport avec garder_statut et le statut a_relire du fichier : structure inchangée, le statut valide reste.
select is((select resultat from prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:1","type":"qcm_unique","enonce":"Question un","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"a_relire","garder_statut":true}')),
  'inchangee', 'structure inchangée : rien ne change');
select is((select statut::text from public.question where source = 'g:1'), 'valide', 'le statut valide est conservé');

-- Énoncé modifié, structure identique : modifiée en place, toujours valide.
select is((select resultat from prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:1","type":"qcm_unique","enonce":"Question un, reformulée","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"a_relire","garder_statut":true}')),
  'modifiee', 'énoncé modifié en place');
select is((select statut::text from public.question where source = 'g:1'), 'valide', 'toujours valide après une modification de texte');

-- Structure changée : nouvelle version à relire, même avec garder_statut.
select is((select resultat from prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:2","type":"qcm_unique","enonce":"Question deux","propositions":["A","C"],"bonnes_reponses":[1],"explication":"E","statut":"a_relire","garder_statut":true}')),
  'versionnee', 'structure changée : nouvelle version');
select is((select statut::text from public.question where source = 'g:2'), 'a_relire', 'la nouvelle version part en relecture');

-- Non-régression : sans garder_statut, le statut du fichier s'applique.
select prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:1","type":"qcm_unique","enonce":"Question un, reformulée","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"a_relire"}');
select is((select statut::text from public.question where source = 'g:1'), 'a_relire', 'sans garder_statut, le réimport repasse à a_relire');

-- Brouillon : conservé au réimport avec garder_statut (le fichier ne rend jamais une question plus visible).
select prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:3","type":"qcm_unique","enonce":"Question trois","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"brouillon"}');
select prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:4","type":"qcm_unique","enonce":"Question quatre","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"brouillon"}');

select is((select resultat from prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:3","type":"qcm_unique","enonce":"Question trois","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"valide","garder_statut":true}')),
  'inchangee', 'brouillon, structure inchangée : rien ne change');
select is((select statut::text from public.question where source = 'g:3'), 'brouillon', 'le statut brouillon est conservé');

select is((select resultat from prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:3","type":"qcm_unique","enonce":"Question trois, reformulée","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"valide","garder_statut":true}')),
  'modifiee', 'brouillon : énoncé modifié en place');
select is((select statut::text from public.question where source = 'g:3'), 'brouillon', 'toujours brouillon après une modification de texte');

-- Structure changée sur un brouillon déjà tiré : la nouvelle version reste brouillon.
insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000006a9', 'eleve-garder@test.local');
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions, statut, fin, note, reussie) values
  ('00000000-0000-0000-0000-0000000006a2', '00000000-0000-0000-0000-0000000006a9', 'quiz_chapitre',
   '20000000-0000-0000-0000-0000000006a1', '30000000-0000-0000-0000-0000000006a1', 1, 'terminee', now(), 100, true);
insert into public.tentative_question (tentative_id, ordre, question_id, permutation, reponse, correcte, repondu_le) values
  ('00000000-0000-0000-0000-0000000006a2', 1, (select id from public.question where source = 'g:4'), '{1,0}', '[0]', true, now());
select is((select resultat from prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:4","type":"qcm_unique","enonce":"Question quatre","propositions":["A","C"],"bonnes_reponses":[1],"explication":"E","statut":"valide","garder_statut":true}')),
  'versionnee', 'brouillon, structure changée : nouvelle version');
select is((select statut::text from public.question where source = 'g:4'), 'brouillon', 'la nouvelle version reste brouillon');

-- Sans garder_statut, le statut du fichier s'applique à un brouillon.
select prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:3","type":"qcm_unique","enonce":"Question trois, reformulée","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"a_relire"}');
select is((select statut::text from public.question where source = 'g:3'), 'a_relire', 'sans garder_statut, un brouillon passe au statut du fichier');

select * from finish();
rollback;
