-- Échéances : date d'ouverture et date limite de l'évaluation, par classe et par cours.

create table public.echeance_evaluation (
  classe_id uuid not null,
  cours_id uuid not null,
  ouverture timestamptz,
  limite timestamptz,
  primary key (classe_id, cours_id),
  -- Retirer un cours d'une classe supprime aussi son échéance (on delete cascade).
  foreign key (classe_id, cours_id) references public.classe_cours on delete cascade,
  check (ouverture is null or limite is null or ouverture < limite),
  check (ouverture is not null or limite is not null)
);

alter table public.echeance_evaluation enable row level security;
create policy "échéances de ses classes" on public.echeance_evaluation for select to authenticated
  using (exists (select 1 from public.classe c where c.id = classe_id and c.enseignant_id = (select auth.uid())));
revoke all on public.echeance_evaluation from anon;
revoke insert, update, delete, truncate, references, trigger, maintain on public.echeance_evaluation from authenticated;

create function public.definir_echeance(p_classe uuid, p_cours uuid, p_ouverture timestamptz, p_limite timestamptz) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'classe_introuvable';
  end if;
  if not exists (select 1 from public.classe_cours where classe_id = p_classe and cours_id = p_cours) then
    raise exception 'cours_invalide';
  end if;
  if p_ouverture is not null and p_limite is not null and p_ouverture >= p_limite then
    raise exception 'dates_invalides';
  end if;
  if p_ouverture is null and p_limite is null then
    delete from public.echeance_evaluation where classe_id = p_classe and cours_id = p_cours;
  else
    insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite)
      values (p_classe, p_cours, p_ouverture, p_limite)
    on conflict (classe_id, cours_id) do update set ouverture = excluded.ouverture, limite = excluded.limite;
  end if;
end $$;

create function public.echeances_classe(p_classe uuid)
returns table (cours_id uuid, ouverture timestamptz, limite timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'classe_introuvable';
  end if;
  return query select e.cours_id, e.ouverture, e.limite from public.echeance_evaluation e where e.classe_id = p_classe;
end $$;

create function public.mes_echeances(p_cours uuid default null)
returns table (cours_id uuid, classe_nom text, ouverture timestamptz, limite timestamptz)
language sql stable security definer set search_path = '' as $$
  -- Une ligne par classe de l'élève liée au cours ; sans échéance, les deux dates sont nulles (fenêtre ouverte).
  -- Mêmes classes que prive.fenetre_evaluation : inscriptions et départs volontaires de moins de 30 jours,
  -- pour que l'interface annonce la fenêtre que le serveur applique.
  with classes as (
    select i.classe_id from public.inscription_classe i where i.eleve_id = auth.uid()
    union
    select d.classe_id from prive.depart_classe d where d.eleve_id = auth.uid() and d.quitte_le > now() - interval '30 days'
  )
  select cc.cours_id, c.nom, e.ouverture, e.limite
    from classes k
    join public.classe c on c.id = k.classe_id
    join public.classe_cours cc on cc.classe_id = k.classe_id
    left join public.echeance_evaluation e on e.classe_id = cc.classe_id and e.cours_id = cc.cours_id
   where p_cours is null or cc.cours_id = p_cours
   order by e.limite nulls last, e.ouverture nulls first
$$;

-- Ouverte si au moins une classe de l'élève liée au cours a une fenêtre ouverte ou sans échéance, ou si l'élève n'a aucune classe liée.
-- « Classes de l'élève » : ses inscriptions, plus les classes qu'il a quittées lui-même depuis moins de 30 jours
-- (prive.depart_classe), traitées exactement comme des inscriptions. Sans cela, quitter la classe puis la rejoindre
-- suffirait à commencer l'évaluation avant l'ouverture ou après la limite. Un retrait par l'enseignant ne compte pas.
create function prive.fenetre_evaluation(p_eleve uuid, p_cours uuid) returns text
language sql stable set search_path = '' as $$
  with classes as (
    select i.classe_id from public.inscription_classe i where i.eleve_id = p_eleve
    union
    select d.classe_id from prive.depart_classe d where d.eleve_id = p_eleve and d.quitte_le > now() - interval '30 days'
  ),
  fenetres as (
    select e.ouverture, e.limite
      from classes k
      join public.echeance_evaluation e on e.classe_id = k.classe_id and e.cours_id = p_cours
  )
  select case
    when not exists (select 1 from fenetres) then 'ok'
    -- Une classe liée au cours sans échéance n'impose rien : la fenêtre est ouverte.
    when exists (
      select 1 from classes k
        join public.classe_cours cc on cc.classe_id = k.classe_id and cc.cours_id = p_cours
       where not exists (select 1 from public.echeance_evaluation e where e.classe_id = k.classe_id and e.cours_id = p_cours)
    ) then 'ok'
    when exists (select 1 from fenetres where (ouverture is null or ouverture <= now()) and (limite is null or now() <= limite)) then 'ok'
    when exists (select 1 from fenetres where ouverture > now()) then 'pas_ouverte'
    else 'close'
  end
$$;

-- demarrer_evaluation : corps de 20261110000005 + contrôle de la fenêtre d'évaluation.
create or replace function public.demarrer_evaluation(p_cours uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_nb_chapitres int;
  v_nb_valides int;
  v_essais int;
  v_derniere_fin timestamptz;
  v_dispo int;
  r record;
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  if not public.peut_lire_cours(p_cours) then
    raise exception 'acces_refuse';
  end if;

  for r in select id from public.tentative
            where eleve_id = auth.uid() and cours_id = p_cours and type = 'evaluation_cours' and statut = 'en_cours' loop
    if not prive.cloturer_si_expiree(r.id) then
      return r.id;
    end if;
  end loop;

  select count(*), count(*) filter (where pc.valide) into v_nb_chapitres, v_nb_valides
    from public.chapitre c
    left join public.progression_chapitre pc on pc.chapitre_id = c.id and pc.eleve_id = auth.uid()
   where c.cours_id = p_cours and c.publie;
  if v_nb_chapitres = 0 or v_nb_valides < v_nb_chapitres then
    raise exception 'evaluation_verrouillee';
  end if;
  case prive.fenetre_evaluation(auth.uid(), p_cours)
    when 'pas_ouverte' then raise exception 'evaluation_pas_ouverte';
    when 'close' then raise exception 'evaluation_close';
    else null;
  end case;

  select count(*), max(fin) into v_essais, v_derniere_fin from public.tentative
   where eleve_id = auth.uid() and cours_id = p_cours and type = 'evaluation_cours';
  if v_essais >= 3 then
    raise exception 'essais_epuises';
  end if;
  if v_derniere_fin > now() - interval '24 hours' then
    raise exception 'delai_attente';
  end if;

  select count(*) into v_dispo
    from public.question q join public.chapitre c on c.id = q.chapitre_id
   where c.cours_id = p_cours and c.publie and q.statut = 'valide';
  if v_dispo = 0 then
    raise exception 'quiz_indisponible';
  end if;

  insert into public.tentative (eleve_id, type, cours_id, nb_questions, date_limite)
    values (auth.uid(), 'evaluation_cours', p_cours, least(40, v_dispo), now() + interval '60 minutes')
    returning id into v_id;

  -- Le rang dans chaque chapitre, tiré au hasard, alterne les chapitres : la répartition est équilibrée
  -- et un chapitre trop court laisse automatiquement sa place aux autres.
  insert into public.tentative_question (tentative_id, ordre, question_id, permutation)
    select v_id, row_number() over (order by random()), s.id, prive.melanger(jsonb_array_length(s.propositions))
      from (
        select q.id, q.propositions, random() as alea,
               row_number() over (partition by q.chapitre_id order by random()) as rang
          from public.question q join public.chapitre c on c.id = q.chapitre_id
         where c.cours_id = p_cours and c.publie and q.statut = 'valide'
         order by rang, alea
         limit 40
      ) s;
  return v_id;
end $$;

revoke execute on all functions in schema prive from public, anon, authenticated;
revoke execute on function public.definir_echeance(uuid, uuid, timestamptz, timestamptz), public.echeances_classe(uuid),
  public.mes_echeances(uuid) from public, anon;
grant execute on function public.definir_echeance(uuid, uuid, timestamptz, timestamptz), public.echeances_classe(uuid),
  public.mes_echeances(uuid) to authenticated;
