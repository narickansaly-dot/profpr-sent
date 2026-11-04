begin;
select plan(6);
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000d1', 'admin-st@test.local'),
  ('00000000-0000-0000-0000-0000000000d2', 'eleve-st@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000d1';

select is((select public from storage.buckets where id = 'schemas'), true, 'bucket schemas public');
select is((select file_size_limit from storage.buckets where id = 'schemas'), 2097152::bigint, 'limite de 2 Mo');
select is((select allowed_mime_types from storage.buckets where id = 'schemas'),
  array['image/png', 'image/jpeg', 'image/webp'], 'types d''image autorisés');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);
select lives_ok($$ insert into storage.objects (bucket_id, name, owner) values ('schemas', 'test/a.png', auth.uid()) $$,
  'admin : dépôt autorisé');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d2","role":"authenticated"}', true);
select throws_ok($$ insert into storage.objects (bucket_id, name, owner) values ('schemas', 'test/b.png', auth.uid()) $$,
  '42501', null, 'élève : dépôt refusé');
select is((select count(*)::int from storage.objects where bucket_id = 'schemas' and name = 'test/a.png'), 0,
  'élève : pas de lecture par l''API (le public lit par l''URL publique)');
select * from finish();
rollback;
