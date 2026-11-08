-- Envoi des notifications : planification, réservation par la route d'envoi, tâche planifiée chaque minute.
-- Vérifier avec context7 la signature de net.http_post (pg_net) et de cron.schedule / cron.unschedule (pg_cron).

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

-- Empreinte du secret partagé avec la route d'envoi : une seule ligne.
create table prive.cle_envoi (
  id boolean primary key default true check (id),
  empreinte bytea not null
);

create function prive.verifier_cle_envoi(p_secret text) returns void
language plpgsql stable set search_path = '' as $$
begin
  if p_secret is null or not exists (
    select 1 from prive.cle_envoi where empreinte = extensions.digest(p_secret, 'sha256')) then
    raise exception 'cle_envoi_invalide';
  end if;
end $$;

-- Crée les notifications dont l'envoi tombe entre p_maintenant - 5 min et p_maintenant + 15 min.
-- Idempotente : la clé (élève, cle) est unique.
create function prive.planifier_notifications(p_maintenant timestamptz) returns int
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

  -- 2. Échéance d'évaluation qui approche : 24 h avant la date limite, cours non validé.
  insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
  select i.eleve_id, 'echeance_proche',
         'echeance:' || ee.classe_id || ':' || ee.cours_id || ':' || extract(epoch from ee.limite)::bigint,
         left('Évaluation ' || c.titre, 120),
         'Elle ferme le ' || to_char(ee.limite at time zone 'Europe/Paris', 'FMDD/MM') || ' à ' || to_char(ee.limite at time zone 'Europe/Paris', 'FMHH24" h "MI'),
         '/cours/' || c.slug || '/evaluation',
         ee.limite - interval '24 hours'
    from public.inscription_classe i
    join public.profil p on p.id = i.eleve_id and p.role = 'eleve'
    join public.echeance_evaluation ee on ee.classe_id = i.classe_id and ee.limite is not null
    join public.cours c on c.id = ee.cours_id and c.publie
    left join public.progression_cours pc on pc.eleve_id = i.eleve_id and pc.cours_id = ee.cours_id
    left join public.preferences_notification pr on pr.eleve_id = i.eleve_id
   where coalesce(pr.echeance_proche, true)
     and not coalesce(pc.valide, false)
     and ee.limite - interval '24 hours' >= v_de
     and ee.limite - interval '24 hours' < v_a
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

create function public.envoi_reserver(p_secret text, p_limite int default 200)
returns table (id uuid, eleve_id uuid, titre text, corps text, url text, envoi_prevu timestamptz, essais smallint,
               silence_debut time, silence_fin time, abonnements jsonb)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  perform prive.verifier_cle_envoi(p_secret);
  return query
  with choisies as (
    select n.id from public.notification_planifiee n
     where n.statut = 'en_attente' and n.envoi_prevu <= now()
       and (n.reserve_jusqu_au is null or n.reserve_jusqu_au < now())
     order by n.envoi_prevu, n.id
     limit least(greatest(coalesce(p_limite, 200), 1), 500)
     for update skip locked
  ), reservees as (
    update public.notification_planifiee n set reserve_jusqu_au = now() + interval '2 minutes'
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

create function public.envoi_terminer(p_secret text, p_resultats jsonb, p_expires text[]) returns void
language plpgsql security definer set search_path = '' as $$
declare
  r jsonb;
  v_issue text;
begin
  perform prive.verifier_cle_envoi(p_secret);
  for r in select * from jsonb_array_elements(coalesce(p_resultats, '[]'::jsonb)) loop
    v_issue := r->>'issue';
    if v_issue is null or v_issue not in ('envoyee', 'decaler', 'reessayer', 'echec')
       or (v_issue in ('decaler', 'reessayer') and (r->>'a') is null) then
      raise exception 'resultat_invalide';
    end if;
    update public.notification_planifiee n set
      statut = case v_issue when 'envoyee' then 'envoyee'::public.statut_notification_t
                            when 'echec' then 'echec'::public.statut_notification_t
                            else 'en_attente'::public.statut_notification_t end,
      envoyee_le = case when v_issue = 'envoyee' then now() else n.envoyee_le end,
      envoi_prevu = case when v_issue in ('decaler', 'reessayer') then (r->>'a')::timestamptz else n.envoi_prevu end,
      essais = n.essais + case when v_issue in ('reessayer', 'echec') then 1 else 0 end,
      reserve_jusqu_au = null
     where n.id = (r->>'id')::uuid and n.statut = 'en_attente';
  end loop;
  delete from public.abonnement_push where endpoint = any (coalesce(p_expires, '{}'::text[]));
end $$;

-- Réservée à service_role (scripts/configurer-envoi.ts) : enregistre l'empreinte du secret et (re)crée la tâche.
create function public.configurer_envoi(p_url text, p_secret text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_url is null or p_url !~ '^https?://[^ ]+$' or char_length(coalesce(p_secret, '')) < 32 then
    raise exception 'configuration_invalide';
  end if;
  insert into prive.cle_envoi (id, empreinte) values (true, extensions.digest(p_secret, 'sha256'))
  on conflict (id) do update set empreinte = excluded.empreinte;
  perform cron.unschedule(j.jobid) from cron.job j where j.jobname = 'envoi-notifications';
  perform cron.schedule('envoi-notifications', '* * * * *', format(
    $c$select net.http_post(url := %L, body := '{}'::jsonb, headers := jsonb_build_object('Authorization', %L, 'Content-Type', 'application/json'), timeout_milliseconds := 50000)$c$,
    p_url, 'Bearer ' || p_secret));
end $$;

-- Planification chaque minute, sous le rôle postgres (anon a un statement_timeout de 3 s). Rejouable.
select cron.unschedule(j.jobid) from cron.job j where j.jobname = 'planifier-notifications';
select cron.schedule('planifier-notifications', '* * * * *', $c$select prive.planifier_notifications(now())$c$);

revoke execute on function prive.verifier_cle_envoi(text), prive.planifier_notifications(timestamptz) from public;
revoke execute on function public.envoi_reserver(text, int), public.envoi_terminer(text, jsonb, text[]) from public, authenticated;
grant execute on function public.envoi_reserver(text, int), public.envoi_terminer(text, jsonb, text[]) to anon;
revoke execute on function public.configurer_envoi(text, text) from public, anon, authenticated;
grant execute on function public.configurer_envoi(text, text) to service_role;
