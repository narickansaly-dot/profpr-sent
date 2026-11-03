-- Évaluation de cours : 40 questions réparties entre les chapitres, 60 minutes, 3 essais, 24 heures entre deux essais.

create function public.demarrer_evaluation(p_cours uuid) returns uuid
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
    select v_id, row_number() over (order by s.rang, s.alea), s.id, prive.melanger(jsonb_array_length(s.propositions))
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

create function public.cloturer_mes_tentatives_expirees() returns int
language plpgsql security definer set search_path = '' as $$
declare
  r record;
  n int := 0;
begin
  for r in select id from public.tentative
            where eleve_id = auth.uid() and statut = 'en_cours' and date_limite is not null and date_limite < now() loop
    perform prive.cloturer(r.id, 'expiree');
    n := n + 1;
  end loop;
  return n;
end $$;

revoke execute on function public.demarrer_evaluation(uuid), public.cloturer_mes_tentatives_expirees() from public, anon;
grant execute on function public.demarrer_evaluation(uuid), public.cloturer_mes_tentatives_expirees() to authenticated;
