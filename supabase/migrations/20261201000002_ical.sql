-- Lien iCal privé : un jeton aléatoire de 256 bits par élève. Seule son empreinte SHA-256 est stockée.

create table prive.jeton_ical (
  eleve_id uuid primary key references public.profil on delete cascade,
  empreinte bytea not null unique,
  cree_le timestamptz not null default now()
);

create function public.creer_jeton_ical() returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_jeton text;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  -- base64url sans remplissage : 32 octets donnent 43 caractères.
  v_jeton := translate(encode(extensions.gen_random_bytes(32), 'base64'), '+/=', '-_');
  insert into prive.jeton_ical (eleve_id, empreinte) values (auth.uid(), extensions.digest(v_jeton, 'sha256'))
  on conflict (eleve_id) do update set empreinte = excluded.empreinte, cree_le = now();
  return v_jeton;
end $$;

create function public.revoquer_jeton_ical() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  delete from prive.jeton_ical where eleve_id = auth.uid();
end $$;

create function public.mon_jeton_ical() returns timestamptz
language plpgsql stable security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  return (select cree_le from prive.jeton_ical where eleve_id = auth.uid());
end $$;

-- Ouverte à anon : le jeton est la seule preuve. Occurrences des 30 derniers jours et des 365 prochains.
create function public.calendrier_ical(p_jeton text)
returns table (uid text, titre text, debut timestamptz, fin timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_eleve uuid;
begin
  if p_jeton is null or p_jeton !~ '^[A-Za-z0-9_-]{43}$' then
    raise exception 'jeton_inconnu';
  end if;
  select j.eleve_id into v_eleve from prive.jeton_ical j where j.empreinte = extensions.digest(p_jeton, 'sha256');
  if v_eleve is null then
    raise exception 'jeton_inconnu';
  end if;
  return query
    select * from (
      select o.evenement_id::text || '-' || to_char(o.debut at time zone 'UTC', 'YYYYMMDD"T"HH24MISS"Z"'), e.titre, o.debut, o.fin
        from prive.occurrences(v_eleve, now() - interval '30 days', now() + interval '365 days') o
        join public.evenement e on e.id = o.evenement_id
      union all
      select x.cle, x.titre, x.instant, x.instant
        from prive.echeances_eleve(v_eleve, now() - interval '30 days', now() + interval '365 days') x
    ) t
    order by 3;
end $$;

revoke execute on function public.creer_jeton_ical(), public.revoquer_jeton_ical(), public.mon_jeton_ical(),
  public.calendrier_ical(text) from public, anon;
grant execute on function public.creer_jeton_ical(), public.revoquer_jeton_ical(), public.mon_jeton_ical() to authenticated;
grant execute on function public.calendrier_ical(text) to anon, authenticated;
