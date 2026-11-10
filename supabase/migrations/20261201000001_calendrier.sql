-- Calendrier de l'élève : événements (avec répétition), plans de révision.
-- Lecture : le propriétaire seulement (RLS). Écriture : uniquement par les RPC de ce fichier et de 20261201000003.
-- Toutes les heures sont celles de Paris : une série garde son heure locale après un changement d'heure.

create type public.type_evenement_t as enum ('revision', 'devoir', 'examen_reel');
create type public.repetition_t as enum ('aucune', 'quotidienne', 'hebdomadaire', 'jours');
create type public.statut_plan_t as enum ('propose', 'accepte', 'refuse');

create table public.evenement (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null references public.profil on delete cascade,
  type public.type_evenement_t not null,
  titre text not null check (char_length(titre) between 1 and 120 and titre = btrim(titre)),
  debut timestamptz not null,
  duree_minutes smallint not null check (duree_minutes between 5 and 720),
  cours_id uuid references public.cours on delete restrict,
  repetition public.repetition_t not null default 'aucune',
  -- Jours ISO : 1 = lundi … 7 = dimanche. Seulement pour la répétition « jours ».
  jours_semaine smallint[],
  repeter_jusqu_au date,
  plan_id uuid,
  revision_generale boolean not null default false,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now(),
  check ((repetition = 'aucune') = (repeter_jusqu_au is null)),
  check ((repetition = 'jours') = (jours_semaine is not null)),
  check (jours_semaine is null or (cardinality(jours_semaine) between 1 and 7 and jours_semaine <@ '{1,2,3,4,5,6,7}'::smallint[])),
  check (not revision_generale or type = 'revision')
);
create index evenement_eleve_debut on public.evenement (eleve_id, debut);
create index evenement_plan on public.evenement (plan_id) where plan_id is not null;
create trigger modifie_le before update on public.evenement for each row execute function prive.toucher_modifie_le();

create table public.evenement_chapitre (
  evenement_id uuid not null references public.evenement on delete cascade,
  chapitre_id uuid not null references public.chapitre on delete restrict,
  primary key (evenement_id, chapitre_id)
);

-- Un plan par examen. Supprimer l'examen supprime le plan ; ses sessions passées restent, sans plan (on delete set null).
create table public.plan_revision (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null references public.profil on delete cascade,
  examen_id uuid not null unique references public.evenement on delete cascade,
  sessions_par_semaine smallint not null check (sessions_par_semaine between 1 and 7),
  duree_minutes smallint not null check (duree_minutes between 15 and 180),
  jours_preferes smallint[] not null check (cardinality(jours_preferes) between 1 and 7 and jours_preferes <@ '{1,2,3,4,5,6,7}'::smallint[]),
  heure_debut time not null check (heure_debut between '06:00' and '21:00'),
  statut public.statut_plan_t not null,
  cree_le timestamptz not null default now(),
  -- Dernier « Plus tard » sur la proposition de réorganisation.
  reorganisation_vue_le timestamptz
);
alter table public.evenement add constraint evenement_plan_fk foreign key (plan_id) references public.plan_revision on delete set null;

alter table public.evenement enable row level security;
alter table public.evenement_chapitre enable row level security;
alter table public.plan_revision enable row level security;
create policy "ses événements" on public.evenement for select to authenticated using (eleve_id = (select auth.uid()));
create policy "chapitres de ses événements" on public.evenement_chapitre for select to authenticated
  using (exists (select 1 from public.evenement e where e.id = evenement_id and e.eleve_id = (select auth.uid())));
create policy "ses plans" on public.plan_revision for select to authenticated using (eleve_id = (select auth.uid()));
revoke all on public.evenement, public.evenement_chapitre, public.plan_revision from anon;
revoke insert, update, delete, truncate, references, trigger, maintain
  on public.evenement, public.evenement_chapitre, public.plan_revision from authenticated;

-- generate_series(date, date, interval) renvoie des timestamptz : on repasse par une date (j.jour::date) avant d'ajouter l'heure de Paris.
-- Occurrences d'un élève qui chevauchent [p_de, p_a[. Une série garde l'heure de Paris de son début.
-- Un événement sans répétition garde son instant exact (pas de recalcul dans l'heure ambiguë d'octobre).
create function prive.occurrences(p_eleve uuid, p_de timestamptz, p_a timestamptz)
returns table (evenement_id uuid, debut timestamptz, fin timestamptz)
language sql stable set search_path = '' as $$
  select e.id, o.debut, o.debut + make_interval(mins => e.duree_minutes)
    from public.evenement e
    cross join lateral (
      select case when e.repetition = 'aucune' then e.debut
                  else (j.jour::date + (e.debut at time zone 'Europe/Paris')::time) at time zone 'Europe/Paris' end as debut
        from generate_series(
               greatest((e.debut at time zone 'Europe/Paris')::date, (p_de at time zone 'Europe/Paris')::date - 1),
               least(coalesce(e.repeter_jusqu_au, (e.debut at time zone 'Europe/Paris')::date), (p_a at time zone 'Europe/Paris')::date),
               interval '1 day') as j(jour)
       where e.repetition = 'quotidienne'
          or (e.repetition = 'aucune' and j.jour::date = (e.debut at time zone 'Europe/Paris')::date)
          or (e.repetition = 'hebdomadaire' and extract(isodow from j.jour::date) = extract(isodow from e.debut at time zone 'Europe/Paris'))
          or (e.repetition = 'jours' and extract(isodow from j.jour::date)::smallint = any (e.jours_semaine))
    ) o
   where e.eleve_id = p_eleve
     and o.debut < p_a
     and o.debut + make_interval(mins => e.duree_minutes) > p_de
$$;

-- Repères d'échéance (ouverture, date limite) des classes où l'élève est inscrit aujourd'hui, pour les cours publiés.
create function prive.echeances_eleve(p_eleve uuid, p_de timestamptz, p_a timestamptz)
returns table (cle text, titre text, instant timestamptz, cours_id uuid, cours_titre text, couleur text, cours_slug text, classe_nom text)
language sql stable set search_path = '' as $$
  select 'echeance-' || x.quoi || '-' || ee.classe_id || '-' || ee.cours_id,
         case x.quoi when 'ouverture' then 'Ouverture de l''évaluation · ' else 'Date limite de l''évaluation · ' end || c.titre,
         x.instant, c.id, c.titre, c.couleur, c.slug, cl.nom
    from public.inscription_classe i
    join public.echeance_evaluation ee on ee.classe_id = i.classe_id
    join public.classe cl on cl.id = i.classe_id
    join public.cours c on c.id = ee.cours_id and c.publie
    cross join lateral (values ('ouverture', ee.ouverture), ('limite', ee.limite)) as x(quoi, instant)
   where i.eleve_id = p_eleve and x.instant is not null and x.instant >= p_de and x.instant < p_a
$$;

create function public.enregistrer_evenement(p_id uuid, p jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_type public.type_evenement_t;
  v_titre text;
  v_debut timestamptz;
  v_duree int;
  v_cours uuid;
  v_chapitres uuid[];
  v_rep public.repetition_t;
  v_jours smallint[];
  v_jusqu date;
  v_jour_debut date;
  v_id uuid;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if jsonb_typeof(p) is distinct from 'object' then
    raise exception 'evenement_invalide';
  end if;
  begin
    v_type := (p->>'type')::public.type_evenement_t;
    v_titre := btrim(p->>'titre');
    v_debut := (p->>'debut')::timestamptz;
    v_duree := (p->>'duree_minutes')::int;
    v_cours := nullif(p->>'cours_id', '')::uuid;
    v_rep := coalesce(p->>'repetition', 'aucune')::public.repetition_t;
    v_jusqu := (p->>'repeter_jusqu_au')::date;
    v_chapitres := array(select distinct x::uuid from jsonb_array_elements_text(coalesce(nullif(p->'chapitres', 'null'::jsonb), '[]')) x);
    v_jours := (select array_agg(distinct x::smallint order by x::smallint)
                  from jsonb_array_elements_text(coalesce(nullif(p->'jours_semaine', 'null'::jsonb), '[]')) x);
  exception when others then
    raise exception 'evenement_invalide';
  end;
  if v_type is null or v_titre is null or char_length(v_titre) not between 1 and 120
     or v_debut is null or v_duree is null or v_duree not between 5 and 720
     or v_debut < now() - interval '1 year' or v_debut > now() + interval '2 years' then
    raise exception 'evenement_invalide';
  end if;

  v_jour_debut := (v_debut at time zone 'Europe/Paris')::date;
  if v_rep = 'aucune' then
    v_jours := null;
    v_jusqu := null;
  else
    if v_jusqu is null or v_jusqu < v_jour_debut or v_jusqu > v_jour_debut + 366 then
      raise exception 'repetition_invalide';
    end if;
    if v_rep = 'jours' then
      if v_jours is null or not v_jours <@ '{1,2,3,4,5,6,7}'::smallint[] then
        raise exception 'repetition_invalide';
      end if;
    else
      v_jours := null;
    end if;
  end if;

  if v_cours is not null and not public.peut_lire_cours(v_cours) then
    raise exception 'cours_indisponible';
  end if;
  if cardinality(v_chapitres) > 30
     or (cardinality(v_chapitres) > 0 and v_cours is null)
     or exists (select 1 from unnest(v_chapitres) c
                 where not exists (select 1 from public.chapitre ch where ch.id = c and ch.cours_id = v_cours and ch.publie)) then
    raise exception 'chapitres_invalides';
  end if;

  if p_id is null then
    if (select count(*) from public.evenement where eleve_id = auth.uid()) >= 500 then
      raise exception 'trop_d_evenements';
    end if;
    insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, cours_id, repetition, jours_semaine, repeter_jusqu_au)
      values (auth.uid(), v_type, v_titre, v_debut, v_duree, v_cours, v_rep, v_jours, v_jusqu)
      returning id into v_id;
  else
    -- Le type ne change pas après la création.
    update public.evenement
       set titre = v_titre, debut = v_debut, duree_minutes = v_duree, cours_id = v_cours,
           repetition = v_rep, jours_semaine = v_jours, repeter_jusqu_au = v_jusqu
     where id = p_id and eleve_id = auth.uid() and type = v_type
     returning id into v_id;
    if v_id is null then
      raise exception 'evenement_introuvable';
    end if;
    delete from public.evenement_chapitre where evenement_id = v_id;
  end if;
  insert into public.evenement_chapitre (evenement_id, chapitre_id) select v_id, unnest(v_chapitres);
  return v_id;
end $$;

create function public.supprimer_evenement(p_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if not exists (select 1 from public.evenement where id = p_id and eleve_id = auth.uid()) then
    raise exception 'evenement_introuvable';
  end if;
  -- Un examen emporte les sessions à venir de son plan ; le plan lui-même part en cascade.
  delete from public.evenement
   where debut > now() and plan_id in (select pr.id from public.plan_revision pr where pr.examen_id = p_id);
  delete from public.evenement where id = p_id;
end $$;

create function public.mon_calendrier(p_de timestamptz, p_a timestamptz)
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
    order by 5, 4;
end $$;

revoke execute on function prive.occurrences(uuid, timestamptz, timestamptz), prive.echeances_eleve(uuid, timestamptz, timestamptz) from public;
revoke execute on function public.enregistrer_evenement(uuid, jsonb), public.supprimer_evenement(uuid),
  public.mon_calendrier(timestamptz, timestamptz) from public, anon;
grant execute on function public.enregistrer_evenement(uuid, jsonb), public.supprimer_evenement(uuid),
  public.mon_calendrier(timestamptz, timestamptz) to authenticated;
