-- Comptes parents : rôle, liens avec les enfants (par l'adresse de l'accord ou par un code), déliaison.

create table public.lien_parent (
  eleve_id uuid not null references public.profil on delete cascade,
  parent_id uuid not null references public.profil on delete cascade,
  origine text not null check (origine in ('accord', 'code')),
  cree_le timestamptz not null default now(),
  primary key (eleve_id, parent_id)
);
create index lien_parent_parent on public.lien_parent (parent_id);
alter table public.lien_parent enable row level security;
revoke all on public.lien_parent from anon, authenticated;

create table prive.code_parent (
  eleve_id uuid primary key references public.profil on delete cascade,
  empreinte bytea not null unique,
  expire_le timestamptz not null
);
create table prive.essai_code_parent (
  parent_id uuid not null references public.profil on delete cascade,
  heure timestamptz not null,
  nombre smallint not null default 1 check (nombre >= 1),
  primary key (parent_id, heure)
);
revoke all on prive.code_parent, prive.essai_code_parent from public, anon, authenticated;

-- Crée le lien sous verrou du profil de l'élève ; false s'il existait déjà.
create function prive.lier(p_eleve uuid, p_parent uuid, p_origine text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.profil where id = p_eleve for update;
  if exists (select 1 from public.lien_parent where eleve_id = p_eleve and parent_id = p_parent) then
    return false;
  end if;
  if (select count(*) from public.lien_parent where eleve_id = p_eleve) >= 2 then
    raise exception 'trop_de_parents';
  end if;
  insert into public.lien_parent (eleve_id, parent_id, origine) values (p_eleve, p_parent, p_origine);
  return true;
end $$;
revoke execute on function prive.lier(uuid, uuid, text) from public;

-- Un compte tout neuf (aucune activité d'élève) devient un compte parent.
create function public.devenir_parent(p_nom text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_nom text := btrim(coalesce(p_nom, ''));
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  if char_length(v_nom) not between 1 and 60 or v_nom ~ '[[:cntrl:]]' then
    raise exception 'nom_parent_invalide';
  end if;
  perform 1 from public.profil where id = auth.uid() for update;
  if not exists (select 1 from public.profil p
                  where p.id = auth.uid() and p.role = 'eleve' and not p.onboarding_termine and not p.demande_enseignant)
     or exists (select 1 from public.tentative where eleve_id = auth.uid())
     or exists (select 1 from public.inscription_classe where eleve_id = auth.uid())
     or exists (select 1 from public.consentement_parental where eleve_id = auth.uid())
     or exists (select 1 from public.acces_gratuit where eleve_id = auth.uid())
     or exists (select 1 from public.lien_parent where eleve_id = auth.uid()) then
    raise exception 'deja_inscrit';
  end if;
  update public.profil set role = 'parent', nom = v_nom, onboarding_termine = true where id = auth.uid();
end $$;

-- Relie les enfants dont l'accord a été donné depuis l'adresse (confirmée) du compte parent.
create function public.lier_par_email() returns int
language plpgsql security definer set search_path = '' as $$
declare
  v_email text;
  v_n int := 0;
  r record;
begin
  if public.role_actuel() is distinct from 'parent' then
    raise exception 'pas_parent';
  end if;
  select lower(u.email) into v_email from auth.users u where u.id = auth.uid() and u.email_confirmed_at is not null;
  if v_email is null then
    return 0;
  end if;
  for r in select c.eleve_id from public.consentement_parental c
            where c.email_parent = v_email and c.donne_le is not null and c.retire_le is null
  loop
    begin
      if prive.lier(r.eleve_id, auth.uid(), 'accord') then
        v_n := v_n + 1;
      end if;
    exception when sqlstate 'P0001' then
      -- Un enfant qui a déjà deux parents est ignoré ; toute autre erreur remonte.
      if sqlerrm <> 'trop_de_parents' then
        raise;
      end if;
    end;
  end loop;
  return v_n;
end $$;

-- Code à usage unique, valable 48 heures, pour un élève de 15 ans ou plus ; remplace le précédent.
create function public.generer_code_parent() returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_octets bytea := extensions.gen_random_bytes(8);
  v_code text;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if exists (select 1 from public.profil where id = auth.uid() and (coalesce(moins_de_15_ans, true) or not onboarding_termine)) then
    raise exception 'reserve_15_ans';
  end if;
  if (select count(*) from public.lien_parent where eleve_id = auth.uid()) >= 2 then
    raise exception 'trop_de_parents';
  end if;
  select string_agg(substr(v_alphabet, (get_byte(v_octets, i) % 31) + 1, 1), '' order by i) into v_code
    from generate_series(0, 7) i;
  insert into prive.code_parent (eleve_id, empreinte, expire_le)
    values (auth.uid(), extensions.digest(v_code, 'sha256'), now() + interval '48 hours')
  on conflict (eleve_id) do update set empreinte = excluded.empreinte, expire_le = excluded.expire_le;
  return v_code;
end $$;

-- Renvoie un statut (et ne lève pas d'erreur) pour qu'un essai raté reste compté.
create function public.lier_par_code(p_code text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '[[:space:]-]', '', 'g'));
  v_heure timestamptz := date_trunc('hour', now());
  v_eleve uuid;
begin
  if public.role_actuel() is distinct from 'parent' then
    raise exception 'pas_parent';
  end if;
  perform 1 from public.profil where id = auth.uid() for update;
  if coalesce((select nombre from prive.essai_code_parent where parent_id = auth.uid() and heure = v_heure), 0) >= 5 then
    return 'essais_code_epuises';
  end if;
  delete from prive.code_parent c
   where c.empreinte = extensions.digest(v_code, 'sha256') and c.expire_le > now()
     and exists (select 1 from public.profil p where p.id = c.eleve_id and p.role = 'eleve' and p.suppression_demandee_le is null)
  returning c.eleve_id into v_eleve;
  if v_eleve is null then
    insert into prive.essai_code_parent as e (parent_id, heure) values (auth.uid(), v_heure)
    on conflict (parent_id, heure) do update set nombre = e.nombre + 1;
    return 'code_parent_invalide';
  end if;
  perform prive.lier(v_eleve, auth.uid(), 'code');
  return 'lie';
end $$;

-- Le parent se délie toujours ; l'élève seulement à partir de 15 ans.
create function public.delier_parent(p_autre uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() = 'parent' then
    delete from public.lien_parent where parent_id = auth.uid() and eleve_id = p_autre;
  elsif public.role_actuel() = 'eleve' then
    if exists (select 1 from public.profil where id = auth.uid() and coalesce(moins_de_15_ans, true)) then
      raise exception 'deliaison_interdite';
    end if;
    delete from public.lien_parent where eleve_id = auth.uid() and parent_id = p_autre;
  else
    raise exception 'lien_introuvable';
  end if;
  if not found then
    raise exception 'lien_introuvable';
  end if;
end $$;

revoke execute on function public.devenir_parent(text), public.lier_par_email(), public.generer_code_parent(),
  public.lier_par_code(text), public.delier_parent(uuid) from public, anon;
grant execute on function public.devenir_parent(text), public.lier_par_email(), public.generer_code_parent(),
  public.lier_par_code(text), public.delier_parent(uuid) to authenticated;
