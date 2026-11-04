begin;
select plan(84);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000e1', 'admin-i@test.local'),
  ('00000000-0000-0000-0000-0000000000e2', 'eleve-i@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000e1';
insert into public.cours (id, slug, matiere, titre, publie) values
  ('00000000-0000-0000-0000-00000000e001', 'test-i', 'Test', 'Cours test', true),
  ('00000000-0000-0000-0000-00000000e002', 'test-i2', 'Test', 'Autre cours', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('00000000-0000-0000-0000-00000000e101', '00000000-0000-0000-0000-00000000e001', 'ch-a', 1, 'A', true),
  ('00000000-0000-0000-0000-00000000e102', '00000000-0000-0000-0000-00000000e001', 'ch-b', 2, 'B', true);

-- Charges réutilisées (des réglages locaux à la transaction, lisibles sous tous les rôles).
select set_config('t.q1', '{"source":"imp-1","type":"vrai_faux","enonce":"Q1","bonnes_reponses":[true],"statut":"valide","notion":"nA","difficulte":2,"explication":"E1"}', true);
select set_config('t.q2', '{"source":"imp-2","type":"qcm_unique","enonce":"Q2","propositions":["a","b"],"bonnes_reponses":[0],"statut":"a_relire","notion":"nB","difficulte":3,"explication":"E2"}', true);
select set_config('t.q3', '{"source":"imp-3","type":"reponse_courte","enonce":"Q3","reponses_acceptees":["x"],"statut":"brouillon","difficulte":1}', true);
select set_config('t.ch1', '{"slug":"imp-ch1","numero":1,"titre":"Chapitre 1","objectifs":["o1"],"sections":[{"id":"s1","titre":"S1","html":"<p>un</p>"}],"a_retenir":"<p>r</p>"}', true);
select set_config('t.ch2', '{"slug":"imp-ch2","numero":2,"titre":"Chapitre 2","sections":[]}', true);
select set_config('t.cours', '{"slug":"imp-cours","filiere":"ST2S","niveau":"1re","matiere":"Imp","titre":"Cours importé","couleur":"#112233"}', true);
-- Fichier complet : 2 chapitres, 3 questions.
select set_config('t.p1', (current_setting('t.cours')::jsonb || jsonb_build_object('chapitres', jsonb_build_array(
  current_setting('t.ch1')::jsonb || jsonb_build_object('questions', jsonb_build_array(current_setting('t.q1')::jsonb, current_setting('t.q2')::jsonb)),
  current_setting('t.ch2')::jsonb || jsonb_build_object('questions', jsonb_build_array(current_setting('t.q3')::jsonb))))
)::text, true);
-- Sans imp-3.
select set_config('t.p2', (current_setting('t.cours')::jsonb || jsonb_build_object('chapitres', jsonb_build_array(
  current_setting('t.ch1')::jsonb || jsonb_build_object('questions', jsonb_build_array(current_setting('t.q1')::jsonb, current_setting('t.q2')::jsonb)),
  current_setting('t.ch2')::jsonb || jsonb_build_object('questions', '[]'::jsonb)))
)::text, true);
-- Sans imp-2 ni imp-3.
select set_config('t.p3', (current_setting('t.cours')::jsonb || jsonb_build_object('chapitres', jsonb_build_array(
  current_setting('t.ch1')::jsonb || jsonb_build_object('questions', jsonb_build_array(current_setting('t.q1')::jsonb)),
  current_setting('t.ch2')::jsonb || jsonb_build_object('questions', '[]'::jsonb)))
)::text, true);
-- Chapitre 2 absent du fichier.
select set_config('t.p4', (current_setting('t.cours')::jsonb || jsonb_build_object('chapitres', jsonb_build_array(
  current_setting('t.ch1')::jsonb || jsonb_build_object('questions', jsonb_build_array(current_setting('t.q1')::jsonb))))
)::text, true);
-- Un chapitre valide puis une question invalide.
select set_config('t.p5', (current_setting('t.cours')::jsonb || jsonb_build_object('chapitres', jsonb_build_array(
  current_setting('t.ch1')::jsonb || jsonb_build_object('questions', jsonb_build_array(current_setting('t.q1')::jsonb)),
  '{"slug":"imp-ch3","numero":3,"titre":"Chapitre 3","sections":[]}'::jsonb
    || jsonb_build_object('questions', jsonb_build_array('{"source":"imp-bad","type":"vrai_faux","enonce":"","bonnes_reponses":[true]}'::jsonb))))
)::text, true);

-- Aide de test (annulée avec la transaction) : lit la table question, fermée aux rôles applicatifs.
create function public.t_val(p_sql text) returns text language plpgsql security definer as $$
declare r text;
begin execute p_sql into r; return r; end $$;
grant execute on function public.t_val(text) to authenticated;

set local role authenticated;
-- Non-admins.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e2","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_cours(null, '{"slug":"x","filiere":"ST2S","niveau":"1re","matiere":"M","titre":"T"}') $$,
  'P0001', 'acces_refuse', 'élève : enregistrer_cours refusé');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"x","numero":3,"titre":"T","sections":[]}') $$, 'P0001', 'acces_refuse', 'élève : enregistrer_chapitre refusé');
select throws_ok($$ select public.publier_chapitre('00000000-0000-0000-0000-00000000e101', false) $$,
  'P0001', 'acces_refuse', 'élève : publier_chapitre refusé');
select throws_ok($$ select public.publier_cours('00000000-0000-0000-0000-00000000e001', false) $$,
  'P0001', 'acces_refuse', 'élève : publier_cours refusé');
select throws_ok($$ select public.importer_cours(current_setting('t.p1')::jsonb) $$,
  'P0001', 'acces_refuse', 'élève : importer_cours refusé');
select is((select count(*)::int from public.suivi_contenu()), 0, 'élève : suivi vide');
select throws_ok($$ select prive.ecrire_chapitre('00000000-0000-0000-0000-00000000e001', null, '{}', false) $$,
  '42501', null, 'élève : prive.ecrire_chapitre inaccessible');
set local role anon;
select throws_ok($$ select public.importer_cours(current_setting('t.p1')::jsonb) $$, '42501', null, 'anonyme : importer_cours inaccessible');
select throws_ok($$ select * from public.suivi_contenu() $$, '42501', null, 'anonyme : suivi inaccessible');
set local role authenticated;

-- Admin : chapitres.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated"}', true);
select lives_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"nouveau","numero":3,"titre":"Nouveau","titre_court":"N","objectifs":["a","b"],"sections":[{"id":"intro","titre":"Intro","html":"<p>x</p>"},{"id":"suite","titre":"Suite","html":"<p>y</p>"}]}') $$,
  'admin : chapitre créé');
select set_config('t.nouveau', (select id::text from public.chapitre where slug = 'nouveau'), true);
select is((select jsonb_array_length(sections) from public.chapitre where slug = 'nouveau'), 2, 'deux sections enregistrées');
select is((select publie from public.chapitre where slug = 'nouveau'), false, 'créé non publié');
select is((select objectifs from public.chapitre where slug = 'nouveau'), array['a', 'b'], 'objectifs enregistrés');
select lives_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', current_setting('t.nouveau')::uuid,
  '{"slug":"nouveau","numero":4,"titre":"Renommé","sections":[]}') $$, 'admin : chapitre modifié par son id');
select is((select titre || ':' || numero::text || ':' || jsonb_array_length(sections)::text from public.chapitre where slug = 'nouveau'),
  'Renommé:4:0', 'modification enregistrée');
select is((select titre_court is null from public.chapitre where slug = 'nouveau'), true, 'champ absent remis à null');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"dup","numero":5,"titre":"T","sections":[{"id":"a","titre":"A","html":""},{"id":"a","titre":"B","html":""}]}') $$,
  'P0001', 'chapitre_invalide', 'ids de sections dupliqués');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"maj","numero":5,"titre":"T","sections":[{"id":"Sec 1","titre":"A","html":""}]}') $$,
  'P0001', 'chapitre_invalide', 'id de section hors [a-z0-9-]');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"nsa","numero":5,"titre":"T","sections":{"id":"a"}}') $$, 'P0001', 'chapitre_invalide', 'sections objet');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"nsa","numero":5,"titre":"T","sections":"x"}') $$, 'P0001', 'chapitre_invalide', 'sections chaîne');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"nsa","numero":5,"titre":"T"}') $$, 'P0001', 'chapitre_invalide', 'sections absentes');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"Slug Mauvais","numero":5,"titre":"T","sections":[]}') $$, 'P0001', 'chapitre_invalide', 'slug invalide');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"num","numero":"zéro","titre":"T","sections":[]}') $$, 'P0001', 'chapitre_invalide', 'numéro invalide');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"obj","numero":5,"titre":"T","objectifs":"a","sections":[]}') $$, 'P0001', 'chapitre_invalide', 'objectifs non tableau');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null, null) $$,
  'P0001', 'chapitre_invalide', 'charge nulle');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e002', current_setting('t.nouveau')::uuid,
  '{"slug":"nouveau","numero":4,"titre":"T","sections":[]}') $$, 'P0001', 'chapitre_introuvable', 'un chapitre ne change pas de cours');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', null,
  '{"slug":"ch-a","numero":9,"titre":"T","sections":[]}') $$, 'P0001', 'slug_deja_pris', 'création : slug déjà pris');
select throws_ok($$ select public.enregistrer_chapitre('00000000-0000-0000-0000-00000000e001', current_setting('t.nouveau')::uuid,
  '{"slug":"ch-a","numero":4,"titre":"T","sections":[]}') $$, 'P0001', 'slug_deja_pris', 'modification : slug déjà pris');
select throws_ok($$ select public.enregistrer_chapitre(gen_random_uuid(), null,
  '{"slug":"zz","numero":4,"titre":"T","sections":[]}') $$, 'P0001', 'cours_introuvable', 'cours inconnu');
select lives_ok($$ select public.publier_chapitre(current_setting('t.nouveau')::uuid, true) $$, 'chapitre publié');
select is((select publie from public.chapitre where slug = 'nouveau'), true, 'publie vrai');
select lives_ok($$ select public.publier_chapitre(current_setting('t.nouveau')::uuid, false) $$, 'chapitre dépublié');
select is((select publie from public.chapitre where slug = 'nouveau'), false, 'publie faux');
select throws_ok($$ select public.publier_chapitre(gen_random_uuid(), true) $$, 'P0001', 'chapitre_introuvable', 'publier : chapitre inconnu');

-- Admin : cours.
select lives_ok($$ select public.enregistrer_cours(null,
  '{"slug":"cours-ed","filiere":"ST2S","niveau":"Tle","matiere":"Maths","titre":"Cours éditeur","couleur":"#AABBCC","ordre":3}') $$,
  'admin : cours créé');
select set_config('t.ced', (select id::text from public.cours where slug = 'cours-ed'), true);
select is((select couleur || ':' || niveau_code || ':' || ordre::text || ':' || publie::text from public.cours where slug = 'cours-ed'),
  '#aabbcc:Tle:3:false', 'cours enregistré (couleur en minuscules, non publié)');
select lives_ok($$ select public.enregistrer_cours(current_setting('t.ced')::uuid,
  '{"slug":"cours-ed","filiere":"STMG","niveau":"1re","matiere":"Maths","titre":"Modifié"}') $$, 'admin : cours modifié');
select is((select titre || ':' || couleur from public.cours where slug = 'cours-ed'), 'Modifié:#2563eb', 'modification enregistrée');
select throws_ok($$ select public.enregistrer_cours(null,
  '{"slug":"c1","filiere":"ST2S","niveau":"1re","matiere":"M","titre":"T","couleur":"#ABC"}') $$, 'P0001', 'cours_invalide', 'couleur courte');
select throws_ok($$ select public.enregistrer_cours(null,
  '{"slug":"c1","filiere":"ST2S","niveau":"1re","matiere":"M","titre":"T","couleur":"rouge"}') $$, 'P0001', 'cours_invalide', 'couleur nommée');
select throws_ok($$ select public.enregistrer_cours(null,
  '{"slug":"c1","filiere":"ST2S","niveau":"CM2","matiere":"M","titre":"T"}') $$, 'P0001', 'cours_invalide', 'niveau inconnu');
select throws_ok($$ select public.enregistrer_cours(null,
  '{"slug":"c1","filiere":"ZZZ","niveau":"1re","matiere":"M","titre":"T"}') $$, 'P0001', 'filiere_inconnue', 'filière inconnue');
select throws_ok($$ select public.enregistrer_cours(null,
  '{"slug":"test-i","filiere":"ST2S","niveau":"1re","matiere":"M","titre":"T"}') $$, 'P0001', 'slug_deja_pris', 'slug de cours déjà pris');
select throws_ok($$ select public.enregistrer_cours(gen_random_uuid(),
  '{"slug":"inconnu","filiere":"ST2S","niveau":"1re","matiere":"M","titre":"T"}') $$, 'P0001', 'cours_introuvable', 'cours à modifier inconnu');
select lives_ok($$ select public.publier_cours(current_setting('t.ced')::uuid, true) $$, 'cours publié');
select is((select publie from public.cours where slug = 'cours-ed'), true, 'cours : publie vrai');
select lives_ok($$ select public.publier_cours(current_setting('t.ced')::uuid, false) $$, 'cours dépublié');
select is((select publie from public.cours where slug = 'cours-ed'), false, 'cours : publie faux');
select throws_ok($$ select public.publier_cours(gen_random_uuid(), true) $$, 'P0001', 'cours_introuvable', 'publier : cours inconnu');

-- Import : premier passage.
select is((select public.importer_cours(current_setting('t.p1')::jsonb) ->> 'cree'), '3', 'import : 3 questions créées');
select is((select publie from public.cours where slug = 'imp-cours'), false, 'import sans p_publier : cours non publié');
select is((select count(*)::int from public.chapitre where cours_id = (select id from public.cours where slug = 'imp-cours') and not publie),
  2, 'import sans p_publier : chapitres non publiés');
select is(public.t_val($q$ select statut::text from public.question where source = 'imp-1' $q$), 'valide', 'le statut du fichier s''applique à l''import');

-- Suivi.
select is((select array_agg(valides || ':' || a_relire || ':' || brouillons order by numero) from public.suivi_contenu() where cours_slug = 'imp-cours'),
  array['1:1:0', '0:0:1'], 'suivi : comptes par chapitre');
select is((select count(*)::int from public.suivi_contenu() where cours_slug = 'test-i'), 3, 'suivi : un cours existant liste ses chapitres');

-- Réimport identique et publication.
select is((select public.importer_cours(current_setting('t.p1')::jsonb) ->> 'inchangee'), '3', 'réimport identique : 3 inchangées');
select lives_ok($$ select public.publier_cours((select id from public.cours where slug = 'imp-cours'), true) $$, 'cours importé publié');
select lives_ok($$ select public.publier_chapitre((select id from public.chapitre where slug = 'imp-ch1'), true) $$, 'chapitre 1 publié');
select is((select public.importer_cours(current_setting('t.p1')::jsonb) ->> 'inchangee'), '3', 'réimport sur cours publié : 3 inchangées');
select is((select publie from public.cours where slug = 'imp-cours'), true, 'réimport sans p_publier : cours reste publié');
select is((select publie from public.chapitre where slug = 'imp-ch1'), true, 'réimport sans p_publier : chapitre reste publié');
select is((select publie from public.chapitre where slug = 'imp-ch2'), false, 'chapitre non publié reste non publié');

-- Une question créée dans l'éditeur survit aux réimports.
select lives_ok($$ select public.enregistrer_question((select id from public.chapitre where slug = 'imp-ch1'), null,
  '{"type":"vrai_faux","enonce":"Maison","bonnes_reponses":[true]}') $$, 'question d''éditeur créée dans un chapitre importé');

-- Réimport sans imp-3 : supprimée.
select is((select public.importer_cours(current_setting('t.p2')::jsonb) ->> 'supprimee'), '1', 'imp-3 retirée du fichier et jamais tirée : supprimée');
select is(public.t_val($q$ select count(*) from public.question where source = 'imp-3' $q$), '0', 'imp-3 n''existe plus');
select is(public.t_val($q$ select count(*) from public.question where enonce = 'Maison' $q$), '1', 'la question d''éditeur survit');

-- Réimport sans imp-2 alors qu'elle a été tirée : archivée.
reset role;
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions, statut, fin, note, reussie) values
  ('00000000-0000-0000-0000-00000000e301', '00000000-0000-0000-0000-0000000000e2', 'quiz_chapitre',
   (select id from public.cours where slug = 'imp-cours'), (select id from public.chapitre where slug = 'imp-ch1'), 1, 'terminee', now(), 100, true);
insert into public.tentative_question (tentative_id, ordre, question_id, permutation, reponse, correcte, repondu_le) values
  ('00000000-0000-0000-0000-00000000e301', 1, (select id from public.question where source = 'imp-2'), '{1,0}', '[0]', true, now());
set local role authenticated;
select is((select public.importer_cours(current_setting('t.p3')::jsonb) ->> 'archivee'), '1', 'imp-2 retirée du fichier et déjà tirée : archivée');
select is(public.t_val($q$ select statut::text || ':' || coalesce(source, 'null') from public.question where enonce = 'Q2' $q$), 'archivee:null',
  'imp-2 archivée et détachée de sa source');
select is(public.t_val($q$ select count(*) from public.question where enonce = 'Maison' $q$), '1', 'la question d''éditeur survit encore');

-- Chapitre absent du fichier : signalé, jamais supprimé.
select is((select public.importer_cours(current_setting('t.p4')::jsonb) -> 'chapitres_absents'), '["imp-ch2"]'::jsonb, 'chapitre absent signalé');
select is((select count(*)::int from public.chapitre where slug = 'imp-ch2'), 1, 'chapitre absent non supprimé');

-- Rien n'est écrit en cas d'échec.
select set_config('t.avant_ch', (select count(*)::text from public.chapitre), true);
select set_config('t.avant_q', public.t_val($q$ select count(*) from public.question $q$), true);
select throws_ok($$ select public.importer_cours(current_setting('t.p5')::jsonb) $$, 'P0001', 'question_invalide',
  'import : question invalide refusée');
select is((select count(*)::int from public.chapitre), current_setting('t.avant_ch')::int, 'échec : aucun chapitre écrit');
select is(public.t_val($q$ select count(*) from public.question $q$), current_setting('t.avant_q'), 'échec : aucune question écrite');
select is((select count(*)::int from public.chapitre where slug = 'imp-ch3'), 0, 'échec : le chapitre 3 n''existe pas');
select throws_ok($$ select public.importer_cours('{"slug":"Mauvais","filiere":"ST2S","niveau":"1re","matiere":"M","titre":"T","chapitres":[{}]}') $$,
  'P0001', 'import_invalide', 'import : cours invalide');
select throws_ok($$ select public.importer_cours('{"slug":"ok","filiere":"ST2S","niveau":"1re","matiere":"M","titre":"T","chapitres":[]}') $$,
  'P0001', 'import_invalide', 'import : aucun chapitre');
select throws_ok($$ select public.importer_cours('{"slug":"ok","filiere":"ZZZ","niveau":"1re","matiere":"M","titre":"T","chapitres":[{}]}') $$,
  'P0001', 'filiere_inconnue', 'import : filière inconnue');
select throws_ok($$ select public.importer_cours('{"slug":"ok","filiere":"ST2S","niveau":"1re","matiere":"M","titre":"T","chapitres":[{"slug":"c","numero":1,"titre":"T","sections":[],"questions":[{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}]}]}') $$,
  'P0001', 'import_invalide', 'import : question sans source');

-- Publication à l'import.
select lives_ok($$ select public.importer_cours(current_setting('t.p4')::jsonb, true) $$, 'import avec p_publier');
select is((select publie from public.chapitre where slug = 'imp-ch1'), true, 'p_publier : chapitre publié');

-- Clé de service.
reset role;
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
set local role service_role;
select is((select auth.role()), 'service_role', 'auth.role() renvoie service_role');
select is((select public.importer_cours('{"slug":"imp-svc","filiere":"ST2S","niveau":"1re","matiere":"S","titre":"Service","chapitres":[{"slug":"svc-ch","numero":1,"titre":"T","sections":[],"questions":[{"source":"svc-1","type":"vrai_faux","enonce":"S1","bonnes_reponses":[false]}]}]}') ->> 'cree'),
  '1', 'clé de service : import accepté');
select throws_ok($$ select public.enregistrer_cours(null, '{"slug":"x","filiere":"ST2S","niveau":"1re","matiere":"M","titre":"T"}') $$,
  'P0001', 'acces_refuse', 'clé de service : pas d''écriture hors import');

select * from finish();
rollback;
