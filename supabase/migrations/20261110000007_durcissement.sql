-- Durcissement de fin d'étape 2 (revue finale).

-- 1. tentative_question : plus aucune lecture de permutation / reponse / correcte par l'élève.
--    Pendant une évaluation, ces colonnes permettaient de déduire les bonnes réponses.
revoke select on public.tentative_question from authenticated;
grant select (tentative_id, ordre, question_id, repondu_le) on public.tentative_question to authenticated;

-- 2. questions_tentative : refusée dès que la tentative n'est plus en cours.
create or replace function public.questions_tentative(p_tentative uuid)
returns table (ordre smallint, question_id uuid, type public.type_question_t, enonce text, propositions jsonb, reponse jsonb)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not exists (select 1 from public.tentative t where t.id = p_tentative and t.eleve_id = auth.uid()) then
    raise exception 'tentative_introuvable';
  end if;
  perform prive.cloturer_si_expiree(p_tentative);
  if not exists (select 1 from public.tentative t where t.id = p_tentative and t.statut = 'en_cours') then
    raise exception 'tentative_terminee';
  end if;
  return query
    select tq.ordre, tq.question_id, q.type, q.enonce,
           prive.propositions_affichees(q.propositions, tq.permutation),
           prive.vers_affiche(q.type, tq.permutation, tq.reponse)
      from public.tentative_question tq
      join public.question q on q.id = tq.question_id
     where tq.tentative_id = p_tentative
     order by tq.ordre;
end $$;

-- 3. prive.cloturer : ordre déterministe de l'upsert d'historique (évite les interblocages 40P01
--    entre deux clôtures concurrentes). Corps de 005, plus « order by tq.question_id ».
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
     order by tq.question_id
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
      values (t.eleve_id, t.chapitre_id, v_note, v_note >= 75, case when v_note >= 75 then v_fin end)
    on conflict (eleve_id, chapitre_id) do update set
      meilleure_note = greatest(p.meilleure_note, excluded.meilleure_note),
      valide = p.valide or excluded.valide,
      valide_le = coalesce(p.valide_le, excluded.valide_le);
  end if;
end $$;

-- 4. Schéma prive : la migration 003 contient « alter default privileges in schema prive revoke execute
--    on functions from public », qui est sans effet (les privilèges par défaut de PUBLIC sont accordés
--    hors de ce schéma). La protection réelle vient du fait que USAGE sur le schéma prive est retiré à
--    anon et authenticated : ils ne peuvent appeler aucune de ses fonctions, même si EXECUTE reste
--    accordé à PUBLIC. Les fonctions publiques en security definer y accèdent avec les droits de leur propriétaire.
