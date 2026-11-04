-- Classes : un enseignant crée une classe, partage un code, les élèves la rejoignent.

create table public.classe (
  id uuid primary key default gen_random_uuid(),
  enseignant_id uuid not null references public.profil on delete cascade,
  nom text not null check (char_length(trim(nom)) between 2 and 60),
  filiere_id uuid references public.filiere,
  niveau_code text references public.niveau,
  code text not null unique check (code ~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$'),
  cree_le timestamptz not null default now()
);
create index classe_enseignant on public.classe (enseignant_id);

create table public.classe_cours (
  classe_id uuid not null references public.classe on delete cascade,
  cours_id uuid not null references public.cours on delete restrict,
  primary key (classe_id, cours_id)
);

create table public.inscription_classe (
  classe_id uuid not null references public.classe on delete cascade,
  eleve_id uuid not null references public.profil on delete cascade,
  rejoint_le timestamptz not null default now(),
  primary key (classe_id, eleve_id)
);
create index inscription_classe_eleve on public.inscription_classe (eleve_id);

create table prive.essai_code (
  eleve_id uuid not null references public.profil on delete cascade,
  essai_le timestamptz not null default now()
);
create index essai_code_eleve on prive.essai_code (eleve_id, essai_le);

alter table public.classe enable row level security;
alter table public.classe_cours enable row level security;
alter table public.inscription_classe enable row level security;

create policy "ses classes" on public.classe for select to authenticated
  using (enseignant_id = (select auth.uid()));
create policy "cours de ses classes" on public.classe_cours for select to authenticated
  using (exists (select 1 from public.classe c where c.id = classe_id and c.enseignant_id = (select auth.uid())));
create policy "inscriptions visibles" on public.inscription_classe for select to authenticated
  using (eleve_id = (select auth.uid())
         or exists (select 1 from public.classe c where c.id = classe_id and c.enseignant_id = (select auth.uid())));

revoke all on public.classe, public.classe_cours, public.inscription_classe from anon;
revoke insert, update, delete, truncate, references, trigger, maintain
  on public.classe, public.classe_cours, public.inscription_classe from authenticated;

create function prive.est_enseignant_de(p_classe uuid) returns boolean
language sql stable set search_path = '' as $$
  select exists (select 1 from public.classe where id = p_classe and enseignant_id = auth.uid())
$$;

create function prive.nouveau_code_classe() returns text
language plpgsql volatile set search_path = '' as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v text;
begin
  loop
    select string_agg(substr(alphabet, 1 + (get_byte(b.octets, i) % 31), 1), '' order by i) into v
      from (select extensions.gen_random_bytes(6) as octets) b, generate_series(0, 5) i;
    exit when not exists (select 1 from public.classe where code = v);
  end loop;
  return v;
end $$;

create function prive.verifier_cours_publies(p_cours uuid[]) returns void
language plpgsql stable set search_path = '' as $$
begin
  if p_cours is null or cardinality(p_cours) = 0
     or exists (select 1 from unnest(p_cours) x
                where not exists (select 1 from public.cours c where c.id = x and c.publie)) then
    raise exception 'cours_invalide';
  end if;
end $$;

create function public.creer_classe(p_nom text, p_filiere uuid, p_niveau text, p_cours uuid[]) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if public.role_actuel() is distinct from 'enseignant' then
    raise exception 'acces_refuse';
  end if;
  if p_nom is null or char_length(trim(p_nom)) not between 2 and 60 then
    raise exception 'nom_invalide';
  end if;
  perform prive.verifier_cours_publies(p_cours);
  insert into public.classe (enseignant_id, nom, filiere_id, niveau_code, code)
    values (auth.uid(), trim(p_nom), p_filiere, p_niveau, prive.nouveau_code_classe())
    returning id into v_id;
  insert into public.classe_cours (classe_id, cours_id) select v_id, x from (select distinct unnest(p_cours) x) d;
  return v_id;
end $$;

create function public.definir_cours_classe(p_classe uuid, p_cours uuid[]) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  perform prive.verifier_cours_publies(p_cours);
  delete from public.classe_cours where classe_id = p_classe and cours_id <> all (p_cours);
  insert into public.classe_cours (classe_id, cours_id)
    select p_classe, x from (select distinct unnest(p_cours) x) d
  on conflict do nothing;
end $$;

create function public.regenerer_code_classe(p_classe uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v text;
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  v := prive.nouveau_code_classe();
  update public.classe set code = v where id = p_classe;
  return v;
end $$;

-- Pas d'exception pour un code faux : elle annulerait l'enregistrement de l'essai qui sert au frein.
create function public.rejoindre_classe(p_code text) returns table (statut text, classe_nom text)
language plpgsql security definer set search_path = '' as $$
declare
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
  v_classe public.classe;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'acces_refuse';
  end if;
  -- Sérialise les appels d'un même élève : sans cela, des appels simultanés contourneraient le frein.
  perform pg_advisory_xact_lock(hashtextextended('rejoindre_classe:' || auth.uid()::text, 0));
  delete from prive.essai_code where eleve_id = auth.uid() and essai_le < now() - interval '1 hour';
  if (select count(*) from prive.essai_code
       where eleve_id = auth.uid() and essai_le > now() - interval '1 hour') >= 10 then
    return query select 'trop_d_essais'::text, null::text;
    return;
  end if;
  select * into v_classe from public.classe where code = v_code;
  if not found then
    insert into prive.essai_code (eleve_id) values (auth.uid());
    return query select 'code_invalide'::text, null::text;
    return;
  end if;
  insert into public.inscription_classe (classe_id, eleve_id) values (v_classe.id, auth.uid())
  on conflict do nothing;
  if not found then
    return query select 'deja_inscrit'::text, v_classe.nom;
    return;
  end if;
  return query select 'ok'::text, v_classe.nom;
end $$;

create function public.quitter_classe(p_classe uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.inscription_classe where classe_id = p_classe and eleve_id = auth.uid();
  if not found then
    raise exception 'classe_introuvable';
  end if;
end $$;

create function public.retirer_eleve(p_classe uuid, p_eleve uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  delete from public.inscription_classe where classe_id = p_classe and eleve_id = p_eleve;
end $$;

create function public.classes_enseignant()
returns table (id uuid, nom text, code text, filiere_id uuid, niveau_code text, nb_eleves int, cours_ids uuid[], cree_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select c.id, c.nom, c.code, c.filiere_id, c.niveau_code,
         (select count(*)::int from public.inscription_classe i where i.classe_id = c.id),
         coalesce((select array_agg(cc.cours_id order by cc.cours_id) from public.classe_cours cc where cc.classe_id = c.id), '{}'),
         c.cree_le
    from public.classe c
   where c.enseignant_id = auth.uid()
   order by c.cree_le desc
$$;

create function public.classes_eleve()
returns table (id uuid, nom text, enseignant_nom text, rejoint_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select c.id, c.nom, p.nom, i.rejoint_le
    from public.inscription_classe i
    join public.classe c on c.id = i.classe_id
    join public.profil p on p.id = c.enseignant_id
   where i.eleve_id = auth.uid()
   order by i.rejoint_le desc
$$;

revoke execute on all functions in schema prive from public, anon, authenticated;
revoke execute on function public.creer_classe(text, uuid, text, uuid[]), public.definir_cours_classe(uuid, uuid[]),
  public.regenerer_code_classe(uuid), public.rejoindre_classe(text), public.quitter_classe(uuid),
  public.retirer_eleve(uuid, uuid), public.classes_enseignant(), public.classes_eleve() from public, anon;
grant execute on function public.creer_classe(text, uuid, text, uuid[]), public.definir_cours_classe(uuid, uuid[]),
  public.regenerer_code_classe(uuid), public.rejoindre_classe(text), public.quitter_classe(uuid),
  public.retirer_eleve(uuid, uuid), public.classes_enseignant(), public.classes_eleve() to authenticated;
