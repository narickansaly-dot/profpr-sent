begin;
select plan(17);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000a01', 'prof-a@test.local'),
  ('00000000-0000-0000-0000-000000000a02', 'prof-b@test.local'),
  ('00000000-0000-0000-0000-000000000a03', 'eleve-1@test.local'),
  ('00000000-0000-0000-0000-000000000a04', 'eleve-2@test.local');
update public.profil set role = 'enseignant', nom = 'Prof A' where id = '00000000-0000-0000-0000-000000000a01';
update public.profil set role = 'enseignant', nom = 'Prof B' where id = '00000000-0000-0000-0000-000000000a02';
update public.profil set nom = 'Élève 1' where id = '00000000-0000-0000-0000-000000000a03';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-000000000a01', 'technologique', 'CLS', 'Filière classes');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-000000000a01', 'cours-classe', '10000000-0000-0000-0000-000000000a01', '1re', 'C', 'Cours publié', true),
  ('20000000-0000-0000-0000-000000000a02', 'cours-cache-classe', '10000000-0000-0000-0000-000000000a01', '1re', 'C', 'Cours caché', false);
create temporary table c (id uuid, code text);
grant all on c to authenticated;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a03","role":"authenticated"}', true);
select throws_ok($$ select public.creer_classe('1re ST2S B', null, '1re', array['20000000-0000-0000-0000-000000000a01']::uuid[]) $$,
  'P0001', 'acces_refuse', 'un élève ne crée pas de classe');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a01","role":"authenticated"}', true);
select throws_ok($$ select public.creer_classe('1re ST2S B', null, '1re', array['20000000-0000-0000-0000-000000000a02']::uuid[]) $$,
  'P0001', 'cours_invalide', 'un cours non publié est refusé');
select throws_ok($$ select public.creer_classe(' ', null, '1re', array['20000000-0000-0000-0000-000000000a01']::uuid[]) $$,
  'P0001', 'nom_invalide', 'un nom vide est refusé');
insert into c (id) select public.creer_classe('1re ST2S B', '10000000-0000-0000-0000-000000000a01', '1re', array['20000000-0000-0000-0000-000000000a01']::uuid[]);
update c set code = (select code from public.classe where id = (select id from c));
select ok((select code ~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$' from c), 'code de 6 caractères sans caractère ambigu');
select is((select cours_ids from public.classes_enseignant() where id = (select id from c)), array['20000000-0000-0000-0000-000000000a01']::uuid[], 'cours rattaché');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a02","role":"authenticated"}', true);
select is((select count(*)::int from public.classe), 0, 'un autre enseignant ne voit pas la classe');
select throws_ok(format($$ select public.regenerer_code_classe(%L) $$, (select id from c)), 'P0001', 'acces_refuse', 'ni ne régénère son code');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a03","role":"authenticated"}', true);
select is((select statut from public.rejoindre_classe('ZZZZZZ')), 'code_invalide', 'code faux');
select is((select statut from public.rejoindre_classe(lower(' ' || (select code from c) || ' '))), 'ok', 'code juste, saisi en minuscules avec des espaces');
select is((select statut from public.rejoindre_classe((select code from c))), 'deja_inscrit', 'deuxième tentative : déjà inscrit');
select is((select nom from public.classes_eleve()), '1re ST2S B', 'l''élève voit sa classe');
select is((select count(*)::int from public.inscription_classe), 1, 'l''élève voit sa seule inscription');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a04","role":"authenticated"}', true);
do $$ begin for i in 1..10 loop perform public.rejoindre_classe('ZZZZZZ'); end loop; end $$;
select is((select statut from public.rejoindre_classe((select code from c))), 'trop_d_essais', 'trop d''essais faux en une heure');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a01","role":"authenticated"}', true);
select is((select nb_eleves from public.classes_enseignant() where id = (select id from c)), 1, 'l''enseignant compte un élève');
select lives_ok(format($$ select public.retirer_eleve(%L, '00000000-0000-0000-0000-000000000a03') $$, (select id from c)), 'l''enseignant retire un élève');
select throws_ok($$ insert into public.classe (enseignant_id, nom, code) values ('00000000-0000-0000-0000-000000000a01', 'X', 'AAAAAA') $$,
  '42501', null, 'aucune écriture directe');

reset role;
set local role anon;
select set_config('request.jwt.claims', '{}', true);
select throws_ok($$ select count(*) from public.classe $$, '42501', null, 'anonyme : aucun accès');

select * from finish();
rollback;
