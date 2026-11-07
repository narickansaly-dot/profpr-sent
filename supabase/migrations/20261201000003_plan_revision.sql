-- Planning de révision : le calcul se fait en TypeScript (src/lib/planning/generer.ts) ;
-- la base vérifie chaque session et crée les événements dans une seule transaction.

-- Réglages communs à l'acceptation et au refus. Lève planning_invalide si un champ manque ou sort des bornes.
create function prive.lire_reglages_plan(p jsonb, out sessions_par_semaine smallint, out duree_minutes smallint,
                                          out jours_preferes smallint[], out heure_debut time)
language plpgsql immutable set search_path = '' as $$
begin
  begin
    sessions_par_semaine := (p->>'sessions_par_semaine')::smallint;
    duree_minutes := (p->>'duree_minutes')::smallint;
    jours_preferes := array(select distinct x::smallint from jsonb_array_elements_text(p->'jours_preferes') x order by 1);
    heure_debut := (p->>'heure_debut')::time;
  exception when others then
    raise exception 'planning_invalide';
  end;
  if sessions_par_semaine is null or sessions_par_semaine not between 1 and 7
     or duree_minutes is null or duree_minutes not between 15 and 180
     or cardinality(jours_preferes) not between 1 and 7 or not jours_preferes <@ '{1,2,3,4,5,6,7}'::smallint[]
     or heure_debut is null or heure_debut not between '06:00' and '21:00' then
    raise exception 'planning_invalide';
  end if;
end $$;

create function public.accepter_plan_revision(p_examen uuid, p_reglages jsonb, p_sessions jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_examen public.evenement;
  v_reglages record;
  v_ancien uuid;
  v_plan uuid;
  v_id uuid;
  s jsonb;
  v_titre text;
  v_debut timestamptz;
  v_duree int;
  v_generale boolean;
  v_chapitres uuid[];
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  select * into v_examen from public.evenement
   where id = p_examen and eleve_id = auth.uid() and type = 'examen_reel' and cours_id is not null
   for update;
  if not found then
    raise exception 'examen_introuvable';
  end if;
  if v_examen.debut <= now() then
    raise exception 'examen_passe';
  end if;
  if v_examen.debut > now() + interval '365 days'
     or jsonb_typeof(p_sessions) is distinct from 'array' or jsonb_array_length(p_sessions) not between 1 and 120 then
    raise exception 'planning_invalide';
  end if;
  select * into v_reglages from prive.lire_reglages_plan(p_reglages);

  -- Réorganisation : les sessions à venir de l'ancien plan disparaissent, les passées restent sans plan.
  select id into v_ancien from public.plan_revision where examen_id = p_examen;
  if v_ancien is not null then
    delete from public.evenement where plan_id = v_ancien and debut > now();
    delete from public.plan_revision where id = v_ancien;
  end if;
  -- Verrou du profil : deux acceptations simultanées ne peuvent pas dépasser ensemble la limite.
  perform 1 from public.profil where id = auth.uid() for update;
  if (select count(*) from public.evenement where eleve_id = auth.uid()) + jsonb_array_length(p_sessions) > 500 then
    raise exception 'trop_d_evenements';
  end if;

  insert into public.plan_revision (eleve_id, examen_id, sessions_par_semaine, duree_minutes, jours_preferes, heure_debut, statut)
    values (auth.uid(), p_examen, v_reglages.sessions_par_semaine, v_reglages.duree_minutes, v_reglages.jours_preferes,
            v_reglages.heure_debut, 'accepte')
    returning id into v_plan;

  for s in select value from jsonb_array_elements(p_sessions) loop
    begin
      v_titre := btrim(s->>'titre');
      v_debut := (s->>'debut')::timestamptz;
      v_duree := (s->>'duree_minutes')::int;
      v_generale := coalesce((s->>'revision_generale')::boolean, false);
      v_chapitres := array(select distinct x::uuid from jsonb_array_elements_text(s->'chapitres') x);
    exception when others then
      raise exception 'planning_invalide';
    end;
    if v_titre is null or char_length(v_titre) not between 1 and 120
       or v_debut is null or v_debut < now() - interval '1 hour' or v_debut >= v_examen.debut
       or v_duree is null or v_duree not between 15 and 180
       or cardinality(v_chapitres) not between 1 and 30
       or exists (select 1 from unnest(v_chapitres) c
                   where not exists (select 1 from public.chapitre ch where ch.id = c and ch.cours_id = v_examen.cours_id and ch.publie)) then
      raise exception 'planning_invalide';
    end if;
    insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, cours_id, plan_id, revision_generale)
      values (auth.uid(), 'revision', v_titre, v_debut, v_duree, v_examen.cours_id, v_plan, v_generale)
      returning id into v_id;
    insert into public.evenement_chapitre (evenement_id, chapitre_id) select v_id, unnest(v_chapitres);
  end loop;
  return v_plan;
end $$;

-- Un refus n'écrase jamais un plan accepté : il sert seulement à ne plus reproposer le planning.
create function public.refuser_plan_revision(p_examen uuid, p_reglages jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_reglages record;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if not exists (select 1 from public.evenement where id = p_examen and eleve_id = auth.uid() and type = 'examen_reel') then
    raise exception 'examen_introuvable';
  end if;
  select * into v_reglages from prive.lire_reglages_plan(p_reglages);
  insert into public.plan_revision (eleve_id, examen_id, sessions_par_semaine, duree_minutes, jours_preferes, heure_debut, statut)
    values (auth.uid(), p_examen, v_reglages.sessions_par_semaine, v_reglages.duree_minutes, v_reglages.jours_preferes,
            v_reglages.heure_debut, 'refuse')
  on conflict (examen_id) do nothing;
end $$;

create function public.mes_creneaux_occupes(p_de timestamptz, p_a timestamptz)
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
     order by o.debut;
end $$;

-- Plans acceptés dont une session à venir (hors révision générale) porte un chapitre validé
-- après la création du plan ou après le dernier « Plus tard ».
create function public.plans_a_reorganiser()
returns table (plan_id uuid, examen_id uuid, examen_titre text)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  return query
    select p.id, p.examen_id, x.titre
      from public.plan_revision p
      join public.evenement x on x.id = p.examen_id
     where p.eleve_id = auth.uid() and p.statut = 'accepte' and x.debut > now()
       and exists (
         select 1
           from public.evenement s
           join public.evenement_chapitre ec on ec.evenement_id = s.id
           join public.progression_chapitre pc on pc.chapitre_id = ec.chapitre_id and pc.eleve_id = p.eleve_id
          where s.plan_id = p.id and s.debut > now() and not s.revision_generale
            and pc.valide and pc.valide_le > greatest(p.cree_le, coalesce(p.reorganisation_vue_le, p.cree_le)));
end $$;

create function public.ignorer_reorganisation(p_plan uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  -- clock_timestamp et non now() : une validation enregistrée plus tôt dans la même transaction reste antérieure.
  update public.plan_revision set reorganisation_vue_le = clock_timestamp() where id = p_plan and eleve_id = auth.uid();
  if not found then
    raise exception 'plan_introuvable';
  end if;
end $$;

revoke execute on function prive.lire_reglages_plan(jsonb) from public;
revoke execute on function public.accepter_plan_revision(uuid, jsonb, jsonb), public.refuser_plan_revision(uuid, jsonb),
  public.mes_creneaux_occupes(timestamptz, timestamptz), public.plans_a_reorganiser(), public.ignorer_reorganisation(uuid)
  from public, anon;
grant execute on function public.accepter_plan_revision(uuid, jsonb, jsonb), public.refuser_plan_revision(uuid, jsonb),
  public.mes_creneaux_occupes(timestamptz, timestamptz), public.plans_a_reorganiser(), public.ignorer_reorganisation(uuid)
  to authenticated;
