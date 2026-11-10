-- Révision générale : une tentative « revision » sans chapitre, qui tire dans plusieurs chapitres d'un cours.

-- 1. Contrainte : seul un quiz de chapitre exige un chapitre ; l'évaluation n'en a jamais.
do $$
declare
  v_nom text;
begin
  select conname into v_nom from pg_constraint
   where conrelid = 'public.tentative'::regclass and contype = 'c'
     and pg_get_constraintdef(oid) like '%evaluation_cours%chapitre_id%';
  execute format('alter table public.tentative drop constraint %I', v_nom);
end $$;
alter table public.tentative add constraint tentative_chapitre_selon_type check (
  (type = 'evaluation_cours' and chapitre_id is null)
  or (type = 'quiz_chapitre' and chapitre_id is not null)
  or type = 'revision'
);
create unique index tentative_une_revision_generale_en_cours on public.tentative (eleve_id, cours_id)
  where type = 'revision' and chapitre_id is null and statut = 'en_cours';

-- 2. cloturer : corps de 20261110000007 ; une révision générale (sans chapitre) ne touche pas progression_chapitre.
create or replace function prive.cloturer(p_tentative uuid, p_statut public.statut_tentative_t) returns void
language plpgsql security invoker set search_path = '' as $$
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
  elsif t.chapitre_id is not null then
    insert into public.progression_chapitre as p (eleve_id, chapitre_id, meilleure_note, valide, valide_le)
      values (t.eleve_id, t.chapitre_id, v_note, v_note >= 75, case when v_note >= 75 then v_fin end)
    on conflict (eleve_id, chapitre_id) do update set
      meilleure_note = greatest(p.meilleure_note, excluded.meilleure_note),
      valide = p.valide or excluded.valide,
      valide_le = coalesce(p.valide_le, excluded.valide_le);
  end if;
end $$;

-- 3. Démarrage d'une révision générale depuis une session du calendrier.
create function public.demarrer_revision_generale(p_evenement uuid) returns uuid
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
                 join public.chapitre ch on ch.id = ec.chapitre_id and ch.publie
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
         order by rang, priorite
         limit v_nb
      ) s;
  return v_id;
end $$;

revoke execute on function public.demarrer_revision_generale(uuid) from public, anon;
grant execute on function public.demarrer_revision_generale(uuid) to authenticated;
