-- Pagination côté client (PostgREST plafonne à 1000 lignes) : ordre total sur chaque fonction,
-- et flux iCal borné aux 5000 occurrences les plus proches.

create or replace function public.mon_calendrier(p_de timestamptz, p_a timestamptz)
returns table (cle text, evenement_id uuid, type text, titre text, debut timestamptz, fin timestamptz,
               cours_id uuid, cours_titre text, couleur text, cours_slug text, lecture_seule boolean,
               revision_generale boolean, plan_id uuid, classe_nom text, chapitres jsonb)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if p_de is null or p_a is null or p_a <= p_de or p_a - p_de > interval '62 days' then
    raise exception 'periode_invalide';
  end if;
  return query
    select * from (
      select e.id::text || '@' || extract(epoch from o.debut)::bigint::text, e.id, e.type::text, e.titre, o.debut, o.fin,
             e.cours_id, c.titre, c.couleur, c.slug, false, e.revision_generale, e.plan_id, null::text,
             coalesce((select jsonb_agg(jsonb_build_object('id', ch.id, 'slug', ch.slug, 'titre', ch.titre, 'numero', ch.numero) order by ch.numero)
                         from public.evenement_chapitre ec join public.chapitre ch on ch.id = ec.chapitre_id
                        where ec.evenement_id = e.id), '[]'::jsonb)
        from prive.occurrences(auth.uid(), p_de, p_a) o
        join public.evenement e on e.id = o.evenement_id
        left join public.cours c on c.id = e.cours_id
      union all
      select x.cle, null::uuid, 'echeance', x.titre, x.instant, x.instant, x.cours_id, x.cours_titre, x.couleur, x.cours_slug,
             true, false, null::uuid, x.classe_nom, '[]'::jsonb
        from prive.echeances_eleve(auth.uid(), p_de, p_a) x
    ) t
    order by 5, 4, 1;
end $$;

create or replace function public.mes_creneaux_occupes(p_de timestamptz, p_a timestamptz)
returns table (evenement_id uuid, plan_id uuid, debut timestamptz, fin timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if p_de is null or p_a is null or p_a <= p_de or p_a - p_de > interval '366 days' then
    raise exception 'periode_invalide';
  end if;
  return query
    select o.evenement_id, e.plan_id, o.debut, o.fin
      from prive.occurrences(auth.uid(), p_de, p_a) o
      join public.evenement e on e.id = o.evenement_id
     order by o.debut, o.evenement_id;
end $$;

-- Ouverte à anon : le jeton est la seule preuve. Occurrences des 30 derniers jours et des 365 prochains, au plus 5000.
create or replace function public.calendrier_ical(p_jeton text)
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
    order by 3, 1
    limit 5000;
end $$;

revoke execute on function public.mon_calendrier(timestamptz, timestamptz), public.mes_creneaux_occupes(timestamptz, timestamptz),
  public.calendrier_ical(text) from public, anon;
grant execute on function public.mon_calendrier(timestamptz, timestamptz), public.mes_creneaux_occupes(timestamptz, timestamptz)
  to authenticated;
grant execute on function public.calendrier_ical(text) to anon, authenticated;
