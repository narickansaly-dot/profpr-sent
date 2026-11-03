-- Quiz de chapitre : tirage, réponses enregistrées au fil de l'eau, correction à la clôture.

create function prive.cloturer(p_tentative uuid, p_statut public.statut_tentative_t) returns void
language plpgsql security definer set search_path = '' as $$
declare
  t public.tentative;
  v_note numeric(5,2);
begin
  select * into t from public.tentative where id = p_tentative for update;
  if not found or t.statut <> 'en_cours' then
    return;
  end if;

  update public.tentative_question tq
     set correcte = prive.corriger(tq.question_id, tq.reponse)
   where tq.tentative_id = p_tentative;

  select round(100.0 * count(*) filter (where correcte) / count(*), 2) into v_note
    from public.tentative_question where tentative_id = p_tentative;

  update public.tentative
     set statut = p_statut, fin = now(), note = v_note, reussie = v_note >= 75
   where id = p_tentative;

  insert into public.historique_question as h (eleve_id, question_id, vue, ratee, derniere_reponse)
    select t.eleve_id, tq.question_id, 1, case when tq.correcte then 0 else 1 end, now()
      from public.tentative_question tq where tq.tentative_id = p_tentative
  on conflict (eleve_id, question_id) do update
    set vue = h.vue + 1, ratee = h.ratee + excluded.ratee, derniere_reponse = now();

  if t.type = 'evaluation_cours' then
    insert into public.progression_cours as p (eleve_id, cours_id, meilleure_note, valide, valide_le, essais, dernier_essai)
      values (t.eleve_id, t.cours_id, v_note, v_note >= 75, case when v_note >= 75 then now() end, 1, now())
    on conflict (eleve_id, cours_id) do update set
      meilleure_note = greatest(p.meilleure_note, excluded.meilleure_note),
      valide = p.valide or excluded.valide,
      valide_le = coalesce(p.valide_le, excluded.valide_le),
      essais = p.essais + 1,
      dernier_essai = now();
  else
    insert into public.progression_chapitre as p (eleve_id, chapitre_id, meilleure_note, valide, valide_le)
      values (t.eleve_id, t.chapitre_id, v_note, v_note >= 75, case when v_note >= 75 then now() end)
    on conflict (eleve_id, chapitre_id) do update set
      meilleure_note = greatest(p.meilleure_note, excluded.meilleure_note),
      valide = p.valide or excluded.valide,
      valide_le = coalesce(p.valide_le, excluded.valide_le);
  end if;
end $$;

create function prive.cloturer_si_expiree(p_tentative uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.tentative
             where id = p_tentative and statut = 'en_cours' and date_limite is not null and date_limite < now()) then
    perform prive.cloturer(p_tentative, 'expiree');
    return true;
  end if;
  return false;
end $$;

create function public.demarrer_quiz(p_chapitre uuid, p_nb int, p_revision boolean default false) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_cours uuid;
  v_dispo int;
  v_nb int;
  v_id uuid;
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

create function public.questions_tentative(p_tentative uuid)
returns table (ordre smallint, question_id uuid, type public.type_question_t, enonce text, propositions jsonb, reponse jsonb)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not exists (select 1 from public.tentative t where t.id = p_tentative and t.eleve_id = auth.uid()) then
    raise exception 'tentative_introuvable';
  end if;
  perform prive.cloturer_si_expiree(p_tentative);
  return query
    select tq.ordre, tq.question_id, q.type, q.enonce,
           prive.propositions_affichees(q.propositions, tq.permutation),
           prive.vers_affiche(q.type, tq.permutation, tq.reponse)
      from public.tentative_question tq
      join public.question q on q.id = tq.question_id
     where tq.tentative_id = p_tentative
     order by tq.ordre;
end $$;

create function public.repondre(p_tentative uuid, p_question uuid, p_reponse jsonb) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_statut public.statut_tentative_t;
  v_type public.type_question_t;
  v_permutation smallint[];
begin
  select statut into v_statut from public.tentative where id = p_tentative and eleve_id = auth.uid();
  if not found then
    raise exception 'tentative_introuvable';
  end if;
  -- Pas d'exception ici : elle annulerait la clôture.
  if prive.cloturer_si_expiree(p_tentative) then
    return 'temps_ecoule';
  end if;
  if v_statut <> 'en_cours' then
    return 'terminee';
  end if;
  select q.type, tq.permutation into v_type, v_permutation
    from public.tentative_question tq join public.question q on q.id = tq.question_id
   where tq.tentative_id = p_tentative and tq.question_id = p_question;
  if not found then
    raise exception 'question_hors_tentative';
  end if;
  update public.tentative_question
     set reponse = prive.vers_original(v_type, v_permutation, p_reponse), repondu_le = now()
   where tentative_id = p_tentative and question_id = p_question;
  return 'ok';
end $$;

create function public.terminer_tentative(p_tentative uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  t public.tentative;
begin
  select * into t from public.tentative where id = p_tentative and eleve_id = auth.uid();
  if not found then
    raise exception 'tentative_introuvable';
  end if;
  if t.statut = 'en_cours' then
    perform prive.cloturer(p_tentative,
      case when t.date_limite is not null and t.date_limite < now() then 'expiree' else 'terminee' end::public.statut_tentative_t);
  end if;
end $$;

create function public.correction_tentative(p_tentative uuid)
returns table (ordre smallint, question_id uuid, type public.type_question_t, enonce text, propositions jsonb,
               reponse jsonb, bonnes_reponses jsonb, reponses_acceptees text[], explication text, correcte boolean)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_statut public.statut_tentative_t;
begin
  select t.statut into v_statut from public.tentative t where t.id = p_tentative and t.eleve_id = auth.uid();
  if not found then
    raise exception 'tentative_introuvable';
  end if;
  if prive.cloturer_si_expiree(p_tentative) then
    v_statut := 'expiree';
  end if;
  if v_statut = 'en_cours' then
    raise exception 'tentative_en_cours';
  end if;
  return query
    select tq.ordre, tq.question_id, q.type, q.enonce,
           prive.propositions_affichees(q.propositions, tq.permutation),
           prive.vers_affiche(q.type, tq.permutation, tq.reponse),
           prive.vers_affiche(q.type, tq.permutation, c.bonnes_reponses),
           c.reponses_acceptees, c.explication, coalesce(tq.correcte, false)
      from public.tentative_question tq
      join public.question q on q.id = tq.question_id
      join public.question_corrige c on c.question_id = tq.question_id
     where tq.tentative_id = p_tentative
     order by tq.ordre;
end $$;

create function public.marquer_chapitre_lu(p_chapitre uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_cours uuid;
begin
  select c.cours_id into v_cours from public.chapitre c where c.id = p_chapitre and c.publie;
  if auth.uid() is null or v_cours is null or not public.peut_lire_cours(v_cours) then
    raise exception 'acces_refuse';
  end if;
  insert into public.progression_chapitre as p (eleve_id, chapitre_id, lu)
    values (auth.uid(), p_chapitre, true)
  on conflict (eleve_id, chapitre_id) do update set lu = true;
end $$;

revoke execute on function prive.cloturer(uuid, public.statut_tentative_t), prive.cloturer_si_expiree(uuid)
  from public, anon, authenticated;
revoke execute on function public.demarrer_quiz(uuid, int, boolean), public.questions_tentative(uuid),
  public.repondre(uuid, uuid, jsonb), public.terminer_tentative(uuid), public.correction_tentative(uuid),
  public.marquer_chapitre_lu(uuid) from public, anon;
grant execute on function public.demarrer_quiz(uuid, int, boolean), public.questions_tentative(uuid),
  public.repondre(uuid, uuid, jsonb), public.terminer_tentative(uuid), public.correction_tentative(uuid),
  public.marquer_chapitre_lu(uuid) to authenticated;
