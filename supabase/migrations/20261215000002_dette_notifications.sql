-- Dette des notifications : réservations comptées, notifications sans objet retirées à l'envoi,
-- alerte d'échéance à l'ouverture de l'évaluation, et deux reprises du calendrier (étape 4c).

alter table public.notification_planifiee add column reservations smallint not null default 0 check (reservations >= 0);

-- Une notification en attente a-t-elle encore un sens au moment de l'envoi ?
create function prive.notification_encore_valide(n public.notification_planifiee) returns boolean
language sql stable set search_path = '' as $$
  select case n.type
    -- Rappel : l'occurrence (instant dans la clé « rappel:<id>:<epoch>:<délai> ») n'a pas encore commencé.
    when 'rappel_evenement' then coalesce(
      case when split_part(n.cle, ':', 3) ~ '^[0-9]{1,12}$' then to_timestamp(split_part(n.cle, ':', 3)::bigint) > now() end, true)
    -- Échéance : la même date limite existe toujours, l'élève est toujours inscrit, le cours n'est pas validé.
    when 'echeance_proche' then exists (
      select 1 from public.echeance_evaluation ee
        join public.inscription_classe i on i.classe_id = ee.classe_id and i.eleve_id = n.eleve_id
       where ee.classe_id::text = split_part(n.cle, ':', 2) and ee.cours_id::text = split_part(n.cle, ':', 3)
         and extract(epoch from ee.limite)::bigint::text = split_part(n.cle, ':', 4))
      and not exists (
      select 1 from public.progression_cours pc
       where pc.eleve_id = n.eleve_id and pc.cours_id::text = split_part(n.cle, ':', 3) and pc.valide)
    -- Nouvel essai : le cours de l'URL /cours/<slug>/evaluation n'est pas validé.
    when 'nouvel_essai' then not exists (
      select 1 from public.progression_cours pc join public.cours c on c.id = pc.cours_id
       where pc.eleve_id = n.eleve_id and pc.valide and n.url = '/cours/' || c.slug || '/evaluation')
    -- Inactivité : aucune tentative commencée depuis la création de la notification.
    when 'inactivite' then not exists (
      select 1 from public.tentative t where t.eleve_id = n.eleve_id and t.debut > n.cree_le)
    else true
  end
$$;
revoke execute on function prive.notification_encore_valide(public.notification_planifiee) from public;

create or replace function prive.planifier_notifications(p_maintenant timestamptz) returns int
language plpgsql set search_path = '' as $$
declare
  v_de constant timestamptz := p_maintenant - interval '5 minutes';
  v_a constant timestamptz := p_maintenant + interval '15 minutes';
  v_jour date := (p_maintenant at time zone 'Europe/Paris')::date;
  v_matin timestamptz := (v_jour + time '07:30') at time zone 'Europe/Paris';
  v_soir timestamptz := (v_jour + time '17:00') at time zone 'Europe/Paris';
  v_debut_jour timestamptz := v_jour::timestamp at time zone 'Europe/Paris';
  v_fin_jour timestamptz := (v_jour + 1)::timestamp at time zone 'Europe/Paris';
  v_total int := 0;
  v_n int;
begin
  -- 1. Rappels avant les occurrences d'événements.
  insert into public.notification_planifiee (eleve_id, type, cle, evenement_id, titre, corps, url, envoi_prevu)
  select e.eleve_id, 'rappel_evenement', 'rappel:' || e.id || ':' || extract(epoch from o.debut)::bigint || ':' || e.delai_rappel_minutes, e.id,
         left(e.titre, 120),
         'Le ' || to_char(o.debut at time zone 'Europe/Paris', 'FMDD/MM') || ' à ' || to_char(o.debut at time zone 'Europe/Paris', 'FMHH24" h "MI'),
         '/calendrier/' || e.id,
         o.debut - make_interval(mins => e.delai_rappel_minutes)
    from (select distinct ev.eleve_id from public.evenement ev where ev.delai_rappel_minutes is not null) x
    join public.profil p on p.id = x.eleve_id and p.role = 'eleve'
    left join public.preferences_notification pr on pr.eleve_id = x.eleve_id
    cross join lateral prive.occurrences(x.eleve_id, v_de, v_a + interval '1 day') o
    join public.evenement e on e.id = o.evenement_id and e.delai_rappel_minutes is not null
   where coalesce(pr.rappel_evenement, true)
     and o.debut - make_interval(mins => e.delai_rappel_minutes) >= v_de
     and o.debut - make_interval(mins => e.delai_rappel_minutes) < v_a
  on conflict (eleve_id, cle) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  -- 2. Échéance d'évaluation qui approche : 24 h avant la date limite (ou à l'ouverture), cours non validé.
  insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
  select i.eleve_id, 'echeance_proche',
         'echeance:' || ee.classe_id || ':' || ee.cours_id || ':' || extract(epoch from ee.limite)::bigint,
         left('Évaluation ' || c.titre, 120),
         'Elle ferme le ' || to_char(ee.limite at time zone 'Europe/Paris', 'FMDD/MM') || ' à ' || to_char(ee.limite at time zone 'Europe/Paris', 'FMHH24" h "MI'),
         '/cours/' || c.slug || '/evaluation',
         q.quand
    from public.inscription_classe i
    join public.profil p on p.id = i.eleve_id and p.role = 'eleve'
    join public.echeance_evaluation ee on ee.classe_id = i.classe_id and ee.limite is not null
    -- L'alerte part 24 h avant la date limite, ou à l'ouverture de l'évaluation si elle ouvre plus tard.
    cross join lateral (select greatest(ee.limite - interval '24 hours', coalesce(ee.ouverture, '-infinity'::timestamptz)) as quand) q
    join public.cours c on c.id = ee.cours_id and c.publie
    left join public.progression_cours pc on pc.eleve_id = i.eleve_id and pc.cours_id = ee.cours_id
    left join public.preferences_notification pr on pr.eleve_id = i.eleve_id
   where coalesce(pr.echeance_proche, true)
     and not coalesce(pc.valide, false)
     and q.quand >= v_de
     and q.quand < v_a
  on conflict (eleve_id, cle) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  -- 3. Nouvel essai : 24 h après le dernier essai raté, s'il en reste un.
  insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
  select t.eleve_id, 'nouvel_essai', 'essai:' || t.id,
         left('Évaluation ' || c.titre, 120), 'Tu peux retenter ton évaluation',
         '/cours/' || c.slug || '/evaluation', t.fin + interval '24 hours'
    from public.tentative t
    join public.profil p on p.id = t.eleve_id and p.role = 'eleve'
    join public.cours c on c.id = t.cours_id and c.publie
    left join public.progression_cours pc on pc.eleve_id = t.eleve_id and pc.cours_id = t.cours_id
    left join public.preferences_notification pr on pr.eleve_id = t.eleve_id
   where t.type = 'evaluation_cours' and t.fin is not null and not coalesce(t.reussie, false)
     and coalesce(pr.nouvel_essai, true)
     and not coalesce(pc.valide, false)
     and not exists (select 1 from public.inscription_classe ic
                       join public.echeance_evaluation ev on ev.classe_id = ic.classe_id and ev.cours_id = t.cours_id
                      where ic.eleve_id = t.eleve_id and ev.limite is not null and ev.limite <= t.fin + interval '24 hours')
     and not exists (select 1 from public.tentative te
                      where te.eleve_id = t.eleve_id and te.cours_id = t.cours_id
                        and te.type = 'evaluation_cours' and te.statut = 'en_cours')
     and t.fin + interval '24 hours' >= v_de
     and t.fin + interval '24 hours' < v_a
     and t.fin = (select max(t2.fin) from public.tentative t2
                   where t2.eleve_id = t.eleve_id and t2.cours_id = t.cours_id and t2.type = 'evaluation_cours')
     and (select count(*) from public.tentative t3
           where t3.eleve_id = t.eleve_id and t3.cours_id = t.cours_id and t3.type = 'evaluation_cours') < 3
  on conflict (eleve_id, cle) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  -- 4. Séances de révision du jour, à 7 h 30.
  if v_matin >= v_de and v_matin < v_a then
    insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
    select x.eleve_id, 'revision_du_jour', 'jour:' || v_jour, 'Révisions du jour',
           case when s.n = 1 then '1 séance prévue aujourd’hui' else s.n || ' séances prévues aujourd’hui' end,
           '/calendrier?vue=jour&date=' || v_jour, v_matin
      from (select distinct ev.eleve_id from public.evenement ev where ev.type = 'revision') x
      join public.profil p on p.id = x.eleve_id and p.role = 'eleve'
      left join public.preferences_notification pr on pr.eleve_id = x.eleve_id
      cross join lateral (
        select count(*)::int as n
          from prive.occurrences(x.eleve_id, v_debut_jour, v_fin_jour) o
          join public.evenement e on e.id = o.evenement_id and e.type = 'revision'
         where o.debut >= v_debut_jour and o.debut < v_fin_jour) s
     where coalesce(pr.revision_du_jour, true) and s.n > 0
    on conflict (eleve_id, cle) do nothing;
    get diagnostics v_n = row_count; v_total := v_total + v_n;
  end if;

  -- 5. Relance d'inactivité, à 17 h, au plus une par période de N jours.
  if v_soir >= v_de and v_soir < v_a then
    insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
    select p.id, 'inactivite', 'inactivite:' || v_jour, 'On reprend',
           'Une petite révision de 10 minutes, ça te dit', '/', v_soir
      from public.profil p
      left join public.preferences_notification pr on pr.eleve_id = p.id
      cross join lateral (select greatest(p.inscrit_le, (select max(t.debut) from public.tentative t where t.eleve_id = p.id)) as dernier) a
     where p.role = 'eleve' and p.onboarding_termine and not p.demande_enseignant
       and coalesce(pr.inactivite, true)
       and a.dernier < v_soir - make_interval(days => coalesce(pr.jours_inactivite, 3))
       and (select count(*) from public.notification_planifiee n3
             where n3.eleve_id = p.id and n3.type = 'inactivite' and n3.envoi_prevu > a.dernier) < 3
       and not exists (select 1 from public.notification_planifiee n
                        where n.eleve_id = p.id and n.type = 'inactivite'
                          and n.envoi_prevu > v_soir - make_interval(days => coalesce(pr.jours_inactivite, 3)))
    on conflict (eleve_id, cle) do nothing;
    get diagnostics v_n = row_count; v_total := v_total + v_n;
  end if;

  return v_total;
end $$;

create or replace function public.envoi_reserver(p_secret text, p_limite int default 200)
returns table (id uuid, eleve_id uuid, titre text, corps text, url text, envoi_prevu timestamptz, essais smallint,
               silence_debut time, silence_fin time, abonnements jsonb)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  perform prive.verifier_cle_envoi(p_secret);
  -- Réservée 10 fois sans fin d'envoi : abandon.
  update public.notification_planifiee set statut = 'echec', reserve_jusqu_au = null
   where statut = 'en_attente' and envoi_prevu <= now() and reservations >= 10
     and (reserve_jusqu_au is null or reserve_jusqu_au < now());
  -- Sans objet au moment de l'envoi : retirée.
  delete from public.notification_planifiee n
   where n.statut = 'en_attente' and n.envoi_prevu <= now()
     and (n.reserve_jusqu_au is null or n.reserve_jusqu_au < now())
     and not prive.notification_encore_valide(n);
  return query
  with choisies as (
    select n.id from public.notification_planifiee n
     where n.statut = 'en_attente' and n.envoi_prevu <= now()
       and (n.reserve_jusqu_au is null or n.reserve_jusqu_au < now())
     order by n.envoi_prevu, n.id
     limit least(greatest(coalesce(p_limite, 200), 1), 500)
     for update skip locked
  ), reservees as (
    update public.notification_planifiee n set reserve_jusqu_au = now() + interval '2 minutes', reservations = n.reservations + 1
      from choisies c where n.id = c.id
    returning n.id, n.eleve_id, n.titre, n.corps, n.url, n.envoi_prevu, n.essais
  )
  select r.id, r.eleve_id, r.titre, r.corps, r.url, r.envoi_prevu, r.essais,
         coalesce(pr.silence_debut, time '22:00'), coalesce(pr.silence_fin, time '07:00'),
         coalesce((select jsonb_agg(jsonb_build_object('endpoint', a.endpoint, 'p256dh', a.p256dh, 'auth', a.auth) order by a.cree_le)
                     from public.abonnement_push a where a.eleve_id = r.eleve_id), '[]'::jsonb)
    from reservees r
    left join public.preferences_notification pr on pr.eleve_id = r.eleve_id
   order by r.envoi_prevu, r.id;
end $$;

create or replace function public.regler_rappel_evenement(p_id uuid, p_delai int) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if p_delai is not null and p_delai not in (10, 60, 1440) then
    raise exception 'rappel_invalide';
  end if;
  update public.evenement set delai_rappel_minutes = p_delai::smallint
   where id = p_id and eleve_id = auth.uid();
  if not found then
    raise exception 'evenement_introuvable';
  end if;
  -- Le déclencheur ne voit rien si le délai ne change pas : on nettoie ici aussi.
  delete from public.notification_planifiee where evenement_id = p_id and statut = 'en_attente'
     and (reserve_jusqu_au is null or reserve_jusqu_au < now());
end $$;

create or replace function prive.oublier_rappels_evenement() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (new.debut, new.duree_minutes, new.repetition, new.jours_semaine, new.repeter_jusqu_au, new.delai_rappel_minutes)
     is distinct from (old.debut, old.duree_minutes, old.repetition, old.jours_semaine, old.repeter_jusqu_au, old.delai_rappel_minutes) then
    delete from public.notification_planifiee where evenement_id = new.id and statut = 'en_attente'
       and (reserve_jusqu_au is null or reserve_jusqu_au < now());
  end if;
  return new;
end $$;

create or replace function public.enregistrer_evenement(p_id uuid, p jsonb) returns uuid
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
  v_type_actuel public.type_evenement_t;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if jsonb_typeof(p) is distinct from 'object' then
    raise exception 'evenement_invalide';
  end if;
  begin
    v_type := (p->>'type')::public.type_evenement_t;
    v_titre := regexp_replace(p->>'titre', '^[[:space:]]+|[[:space:]]+$', '', 'g');
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
     or v_titre ~ '[[:cntrl:]]'
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
    -- Verrou du profil : deux créations simultanées ne peuvent pas dépasser ensemble la limite.
    perform 1 from public.profil where id = auth.uid() for update;
    if (select count(*) from public.evenement where eleve_id = auth.uid()) >= 500 then
      raise exception 'trop_d_evenements';
    end if;
    insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, cours_id, repetition, jours_semaine, repeter_jusqu_au)
      values (auth.uid(), v_type, v_titre, v_debut, v_duree, v_cours, v_rep, v_jours, v_jusqu)
      returning id into v_id;
  else
    select e.type into v_type_actuel from public.evenement e where e.id = p_id and e.eleve_id = auth.uid();
    if not found then
      raise exception 'evenement_introuvable';
    end if;
    -- Le type ne change pas après la création.
    if v_type_actuel is distinct from v_type then
      raise exception 'type_non_modifiable';
    end if;
    update public.evenement
       set titre = v_titre, debut = v_debut, duree_minutes = v_duree, cours_id = v_cours,
           repetition = v_rep, jours_semaine = v_jours, repeter_jusqu_au = v_jusqu
     where id = p_id and eleve_id = auth.uid()
     returning id into v_id;
    -- Supprimé entre la vérification et la mise à jour.
    if v_id is null then
      raise exception 'evenement_introuvable';
    end if;
    delete from public.evenement_chapitre where evenement_id = v_id;
  end if;
  insert into public.evenement_chapitre (evenement_id, chapitre_id) select v_id, unnest(v_chapitres);
  return v_id;
end $$;

create or replace function public.accepter_plan_revision(p_examen uuid, p_reglages jsonb, p_sessions jsonb) returns uuid
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
  v_nb_generales int := 0;
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
      v_titre := regexp_replace(s->>'titre', '^[[:space:]]+|[[:space:]]+$', '', 'g');
      v_debut := (s->>'debut')::timestamptz;
      v_duree := (s->>'duree_minutes')::int;
      v_generale := coalesce((s->>'revision_generale')::boolean, false);
      v_chapitres := array(select distinct x::uuid from jsonb_array_elements_text(s->'chapitres') x);
    exception when others then
      raise exception 'planning_invalide';
    end;
    if v_titre is null or char_length(v_titre) not between 1 and 120
       or v_titre ~ '[[:cntrl:]]'
       or v_debut is null or v_debut < now() or v_debut >= v_examen.debut
       or v_duree is null or v_duree not between 15 and 180
       or cardinality(v_chapitres) not between 1 and 30
       or (v_generale and ((v_debut at time zone 'Europe/Paris')::date <> (v_examen.debut at time zone 'Europe/Paris')::date - 1
                           or v_nb_generales > 0))
       or exists (select 1 from unnest(v_chapitres) c
                   where not exists (select 1 from public.chapitre ch where ch.id = c and ch.cours_id = v_examen.cours_id and ch.publie)) then
      raise exception 'planning_invalide';
    end if;
    insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, cours_id, plan_id, revision_generale)
      values (auth.uid(), 'revision', v_titre, v_debut, v_duree, v_examen.cours_id, v_plan, v_generale)
      returning id into v_id;
    insert into public.evenement_chapitre (evenement_id, chapitre_id) select v_id, unnest(v_chapitres);
    if v_generale then
      v_nb_generales := v_nb_generales + 1;
    end if;
  end loop;
  return v_plan;
end $$;

revoke execute on function prive.planifier_notifications(timestamptz), prive.oublier_rappels_evenement() from public;
revoke execute on function public.envoi_reserver(text, int) from public, authenticated;
grant execute on function public.envoi_reserver(text, int) to anon;
revoke execute on function public.regler_rappel_evenement(uuid, int), public.enregistrer_evenement(uuid, jsonb),
  public.accepter_plan_revision(uuid, jsonb, jsonb) from public, anon;
grant execute on function public.regler_rappel_evenement(uuid, int), public.enregistrer_evenement(uuid, jsonb),
  public.accepter_plan_revision(uuid, jsonb, jsonb) to authenticated;
