-- Dette du calendrier, du planning et de la révision générale (étape 4c).

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
    delete from public.evenement_chapitre where evenement_id = v_id;
  end if;
  insert into public.evenement_chapitre (evenement_id, chapitre_id) select v_id, unnest(v_chapitres);
  return v_id;
end $$;

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
                        where ec.evenement_id = e.id and ch.publie), '[]'::jsonb)
        from prive.occurrences(auth.uid(), p_de, p_a) o
        join public.evenement e on e.id = o.evenement_id
        left join public.cours c on c.id = e.cours_id and c.publie
      union all
      select x.cle, null::uuid, 'echeance', x.titre, x.instant, x.instant, x.cours_id, x.cours_titre, x.couleur, x.cours_slug,
             true, false, null::uuid, x.classe_nom, '[]'::jsonb
        from prive.echeances_eleve(auth.uid(), p_de, p_a) x
    ) t
    order by 5, 4, 1;
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
      v_titre := btrim(s->>'titre');
      v_debut := (s->>'debut')::timestamptz;
      v_duree := (s->>'duree_minutes')::int;
      v_generale := coalesce((s->>'revision_generale')::boolean, false);
      v_chapitres := array(select distinct x::uuid from jsonb_array_elements_text(s->'chapitres') x);
    exception when others then
      raise exception 'planning_invalide';
    end;
    if v_titre is null or char_length(v_titre) not between 1 and 120
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

create or replace function public.refuser_plan_revision(p_examen uuid, p_reglages jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_examen public.evenement;
  v_reglages record;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  select * into v_examen from public.evenement
   where id = p_examen and eleve_id = auth.uid() and type = 'examen_reel' and cours_id is not null;
  if not found then
    raise exception 'examen_introuvable';
  end if;
  if v_examen.debut <= now() then
    raise exception 'examen_passe';
  end if;
  select * into v_reglages from prive.lire_reglages_plan(p_reglages);
  insert into public.plan_revision (eleve_id, examen_id, sessions_par_semaine, duree_minutes, jours_preferes, heure_debut, statut)
    values (auth.uid(), p_examen, v_reglages.sessions_par_semaine, v_reglages.duree_minutes, v_reglages.jours_preferes,
            v_reglages.heure_debut, 'refuse')
  on conflict (examen_id) do nothing;
end $$;

create or replace function public.demarrer_revision_generale(p_evenement uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_cours uuid;
  v_chapitres uuid[];
  v_dispo int;
  v_nb int;
  v_id uuid;
  r record;
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  select e.cours_id,
         array(select ec.chapitre_id from public.evenement_chapitre ec
                 join public.chapitre ch on ch.id = ec.chapitre_id and ch.publie and ch.cours_id = e.cours_id
                where ec.evenement_id = e.id)
    into v_cours, v_chapitres
    from public.evenement e
   where e.id = p_evenement and e.eleve_id = auth.uid() and e.revision_generale;
  if v_cours is null then
    raise exception 'evenement_introuvable';
  end if;
  if not public.peut_lire_cours(v_cours) then
    raise exception 'acces_refuse';
  end if;
  -- Même règle que demarrer_quiz : pas de quiz du cours pendant une évaluation ouverte.
  for r in select id from public.tentative
            where eleve_id = auth.uid() and cours_id = v_cours and type = 'evaluation_cours' and statut = 'en_cours' loop
    if not prive.cloturer_si_expiree(r.id) then
      raise exception 'evaluation_en_cours';
    end if;
  end loop;
  select t.id into v_id from public.tentative t
   where t.eleve_id = auth.uid() and t.cours_id = v_cours and t.type = 'revision' and t.chapitre_id is null and t.statut = 'en_cours';
  if v_id is not null then
    return v_id;
  end if;
  select count(*) into v_dispo from public.question q where q.chapitre_id = any (v_chapitres) and q.statut = 'valide';
  if v_dispo < 15 then
    raise exception 'quiz_indisponible';
  end if;
  v_nb := least(30, v_dispo);

  insert into public.tentative (eleve_id, type, cours_id, chapitre_id, nb_questions)
    values (auth.uid(), 'revision', v_cours, null, v_nb)
    returning id into v_id;

  -- À tour de rôle entre les chapitres (rang), et dans chaque chapitre : ratées (0), jamais vues (1), les autres (2).
  -- L'ordre d'affichage est ensuite aléatoire.
  insert into public.tentative_question (tentative_id, ordre, question_id, permutation)
    select v_id, row_number() over (order by random()), s.id, prive.melanger(jsonb_array_length(s.propositions))
      from (
        select q.id, q.propositions,
               row_number() over (partition by q.chapitre_id order by p.priorite, random()) as rang, p.priorite
          from public.question q
          left join public.historique_question h on h.question_id = q.id and h.eleve_id = auth.uid()
          cross join lateral (select case when h.question_id is null then 1 when h.ratee > 0 then 0 else 2 end as priorite) p
         where q.chapitre_id = any (v_chapitres) and q.statut = 'valide'
         order by rang, priorite, random()
         limit v_nb
      ) s;
  return v_id;
end $$;

revoke execute on function public.enregistrer_evenement(uuid, jsonb), public.mon_calendrier(timestamptz, timestamptz),
  public.accepter_plan_revision(uuid, jsonb, jsonb), public.refuser_plan_revision(uuid, jsonb),
  public.demarrer_revision_generale(uuid) from public, anon;
grant execute on function public.enregistrer_evenement(uuid, jsonb), public.mon_calendrier(timestamptz, timestamptz),
  public.accepter_plan_revision(uuid, jsonb, jsonb), public.refuser_plan_revision(uuid, jsonb),
  public.demarrer_revision_generale(uuid) to authenticated;
