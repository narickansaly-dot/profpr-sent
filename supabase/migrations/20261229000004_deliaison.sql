-- Déliaison durable : un lien retiré n'est pas recréé automatiquement à partir de l'adresse de l'accord.
-- Corrige aussi devenir_parent (prénom de 2 à 60 caractères, comme profil_nom_ck).

create table prive.deliaison (
  eleve_id uuid not null references public.profil on delete cascade,
  parent_id uuid not null references public.profil on delete cascade,
  delie_le timestamptz not null default now(),
  primary key (eleve_id, parent_id)
);
revoke all on prive.deliaison from public, anon, authenticated;

create or replace function public.delier_parent(p_autre uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_eleve uuid;
  v_parent uuid;
begin
  if public.role_actuel() = 'parent' then
    -- Pas de déliaison tant que le parent a retiré son accord : le compte de l'enfant serait supprimé sans lui.
    if exists (select 1 from public.consentement_parental c
                where c.eleve_id = p_autre and c.retire_le is not null and c.retire_par = auth.uid()) then
      raise exception 'retrait_en_cours';
    end if;
    delete from public.lien_parent where parent_id = auth.uid() and eleve_id = p_autre;
    v_eleve := p_autre;
    v_parent := auth.uid();
  elsif public.role_actuel() = 'eleve' then
    if exists (select 1 from public.profil where id = auth.uid() and coalesce(moins_de_15_ans, true)) then
      raise exception 'deliaison_interdite';
    end if;
    delete from public.lien_parent where eleve_id = auth.uid() and parent_id = p_autre;
    v_eleve := auth.uid();
    v_parent := p_autre;
  else
    raise exception 'lien_introuvable';
  end if;
  if not found then
    raise exception 'lien_introuvable';
  end if;
  insert into prive.deliaison (eleve_id, parent_id) values (v_eleve, v_parent) on conflict do nothing;
end $$;

create or replace function public.lier_par_email() returns int
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
              and not exists (select 1 from prive.deliaison d where d.eleve_id = c.eleve_id and d.parent_id = auth.uid())
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

create or replace function public.lier_par_code(p_code text) returns text
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
  -- Re-liaison volontaire (code généré par un élève de 15 ans ou plus) : la trace de déliaison disparaît.
  delete from prive.deliaison where eleve_id = v_eleve and parent_id = auth.uid();
  return 'lie';
end $$;

create or replace function public.devenir_parent(p_nom text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_nom text := btrim(coalesce(p_nom, ''));
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  if char_length(v_nom) not between 2 and 60 or v_nom ~ '[[:cntrl:]]' then
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

revoke execute on function public.devenir_parent(text), public.lier_par_email(), public.lier_par_code(text),
  public.delier_parent(uuid) from public, anon;
grant execute on function public.devenir_parent(text), public.lier_par_email(), public.lier_par_code(text),
  public.delier_parent(uuid) to authenticated;
