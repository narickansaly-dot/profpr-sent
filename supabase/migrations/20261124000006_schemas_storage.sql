-- Étape 3b : schémas importés par l'admin (PNG, JPEG, WebP ; les SVG restent en ligne dans le HTML, où ils sont nettoyés).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('schemas', 'schemas', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "schemas : lecture admin" on storage.objects for select to authenticated
  using (bucket_id = 'schemas' and (select public.role_actuel()) = 'admin_contenu');
create policy "schemas : ajout admin" on storage.objects for insert to authenticated
  with check (bucket_id = 'schemas' and (select public.role_actuel()) = 'admin_contenu');
create policy "schemas : modification admin" on storage.objects for update to authenticated
  using (bucket_id = 'schemas' and (select public.role_actuel()) = 'admin_contenu');
create policy "schemas : suppression admin" on storage.objects for delete to authenticated
  using (bucket_id = 'schemas' and (select public.role_actuel()) = 'admin_contenu');
