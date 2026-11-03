-- Corrections de l'étape 5 (redéfinitions) : l'évaluation ne doit pas pouvoir être lue via les quiz de chapitre.
-- 1. prive.cloturer : une tentative expirée prend fin à sa date limite.

create or replace function prive.cloturer(p_tentative uuid, p_statut public.statut_tentative_t) returns void
language plpgsql security definer set search_path = '' as $$
declare
  t public.tentative;
  v_note numeric(5,2);
  v_fin timestamptz;
begin
  select * into t from public.tentative where id = p_tentative for update;
  if not found or t.statut <> 'en_cours' then
    return;
  end if;
  -- Une tentative expirée se termine à sa date limite, pas au moment (tardif) où on la clôture :
  -- le délai de 24 h entre deux essais part de la vraie fin.
  v_fin := case when p_statut = 'expiree' and t.date_limite is not null then least(now(), t.date_limite) else now() end;

  update public.tentative_question tq
     set correcte = prive.corriger(tq.question_id, tq.reponse)
   where tq.tentative_id = p_tentative;

  select coalesce(round(100.0 * count(*) filter (where correcte) / nullif(count(*), 0), 2), 0) into v_note
    from public.tentative_question where tentative_id = p_tentative;

  update public.tentative
     set statut = p_statut, fin = v_fin, note = v_note, reussie = v_note >= 75
   where id = p_tentative;

  insert into public.historique_question as h (eleve_id, question_id, vue, ratee, derniere_reponse)
    select t.eleve_id, tq.question_id, 1, case when tq.correcte then 0 else 1 end, now()
      from public.tentative_question tq where tq.tentative_id = p_tentative
  on conflict (eleve_id, question_id) do update
    set vue = h.vue + 1, ratee = h.ratee + excluded.ratee, derniere_reponse = now();

  if t.type = 'evaluation_cours' then
    insert into public.progression_cours as p (eleve_id, cours_id, meilleure_note, valide, valide_le, essais, dernier_essai)
      values (t.eleve_id, t.cours_id, v_note, v_note >= 75, case when v_note >= 75 then v_fin end, 1, v_fin)
    on conflict (eleve_id, cours_id) do update set
      meilleure_note = greatest(p.meilleure_note, excluded.meilleure_note),
      valide = p.valide or excluded.valide,
      valide_le = coalesce(p.valide_le, excluded.valide_le),
      essais = p.essais + 1,
      dernier_essai = v_fin;
  else
    insert into public.progression_chapitre as p (eleve_id, chapitre_id, meilleure_note, valide, valide_le)
      values (t.eleve_id, t.chapitre_id, v_note, v_note >= 75, case when v_note >= 75 then now() end)
    on conflict (eleve_id, chapitre_id) do update set
      meilleure_note = greatest(p.meilleure_note, excluded.meilleure_note),
      valide = p.valide or excluded.valide,
      valide_le = coalesce(p.valide_le, excluded.valide_le);
  end if;
end $$;

-- 2. demarrer_quiz : refusé pendant une évaluation ouverte du même cours.

create or replace function public.demarrer_quiz(p_chapitre uuid, p_nb int, p_revision boolean default false) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_cours uuid;
  v_dispo int;
  v_nb int;
  v_id uuid;
  r record;
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  if p_nb is null or p_nb not in (15, 20, 30) then
    raise exception 'longueur_invalide';
  end if;
  select c.cours_id into v_cours from public.chapitre c where c.id = p_chapitre and c.publie;
  if v_cours is null or not public.peut_lire_cours(v_cours) then
    raise exception 'acces_refuse';
  end if;
  -- Pendant une évaluation ouverte, les quiz du même cours sont fermés : ils tirent dans le même fonds de questions
  -- et leur correction révélerait les réponses de l'évaluation.
  for r in select id from public.tentative
            where eleve_id = auth.uid() and cours_id = v_cours and type = 'evaluation_cours' and statut = 'en_cours' loop
    if not prive.cloturer_si_expiree(r.id) then
      raise exception 'evaluation_en_cours';
    end if;
  end loop;
  -- Tentative déjà ouverte sur ce chapitre : on la renvoie (après avoir clos celle qui a expiré).
  select t.id into v_id from public.tentative t
   where t.eleve_id = auth.uid() and t.chapitre_id = p_chapitre and t.statut = 'en_cours';
  if v_id is not null then
    if not prive.cloturer_si_expiree(v_id) then
      return v_id;
    end if;
  end if;
  select count(*) into v_dispo from public.question q where q.chapitre_id = p_chapitre and q.statut = 'valide';
  if v_dispo < 15 then
    raise exception 'quiz_indisponible';
  end if;
  v_nb := least(p_nb, v_dispo);

  insert into public.tentative (eleve_id, type, cours_id, chapitre_id, nb_questions)
    values (auth.uid(), case when p_revision then 'revision' else 'quiz_chapitre' end::public.type_tentative_t,
            v_cours, p_chapitre, v_nb)
    returning id into v_id;

  -- Priorité : jamais vues (0), ratées (1), les autres (2). En révision, les ratées passent devant.
  insert into public.tentative_question (tentative_id, ordre, question_id, permutation)
    select v_id, row_number() over (order by s.priorite, s.alea), s.id, prive.melanger(jsonb_array_length(s.propositions))
      from (
        select q.id, q.propositions, random() as alea,
               case
                 when h.question_id is null then case when p_revision then 1 else 0 end
                 when h.ratee > 0 then case when p_revision then 0 else 1 end
                 else 2
               end as priorite
          from public.question q
          left join public.historique_question h on h.question_id = q.id and h.eleve_id = auth.uid()
         where q.chapitre_id = p_chapitre and q.statut = 'valide'
         order by priorite, alea
         limit v_nb
      ) s;
  return v_id;
end $$;

-- 3. correction_tentative : refusée pour un autre quiz pendant une évaluation ouverte.

create or replace function public.correction_tentative(p_tentative uuid)
returns table (ordre smallint, question_id uuid, type public.type_question_t, enonce text, propositions jsonb,
               reponse jsonb, bonnes_reponses jsonb, reponses_acceptees text[], explication text, correcte boolean)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_statut public.statut_tentative_t;
  v_type public.type_tentative_t;
  v_cours uuid;
  r record;
begin
  select t.statut, t.type, t.cours_id into v_statut, v_type, v_cours from public.tentative t where t.id = p_tentative and t.eleve_id = auth.uid();
  if not found then
    raise exception 'tentative_introuvable';
  end if;
  if prive.cloturer_si_expiree(p_tentative) then
    v_statut := 'expiree';
  end if;
  if v_statut = 'en_cours' then
    raise exception 'tentative_en_cours';
  end if;
  -- Pendant une évaluation ouverte du même cours, aucune autre correction n'est lisible.
  if v_type <> 'evaluation_cours' then
    for r in select id from public.tentative
              where eleve_id = auth.uid() and cours_id = v_cours and type = 'evaluation_cours' and statut = 'en_cours' loop
      if not prive.cloturer_si_expiree(r.id) then
        raise exception 'evaluation_en_cours';
      end if;
    end loop;
  end if;
  return query
    select tq.ordre, tq.question_id, q.type, q.enonce,
           prive.propositions_affichees(q.propositions, tq.permutation),
           prive.vers_affiche(q.type, tq.permutation, tq.reponse),
           prive.vers_affiche(q.type, tq.permutation, c.bonnes_reponses),
           c.reponses_acceptees, coalesce(c.explication, ''), coalesce(tq.correcte, false)
      from public.tentative_question tq
      join public.question q on q.id = tq.question_id
      left join public.question_corrige c on c.question_id = tq.question_id
     where tq.tentative_id = p_tentative
     order by tq.ordre;
end $$;

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
