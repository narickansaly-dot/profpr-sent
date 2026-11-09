begin;
select plan(7);

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

select * from finish();
rollback;
