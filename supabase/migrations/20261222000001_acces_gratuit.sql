-- Accès après l'essai : un cours gratuit, modifiable une fois dans les 48 heures.
-- Ordre de l'accès d'un élève : essai, cours gratuit, reprise d'une tentative commencée pendant l'essai (24 heures).
-- (La tâche du consentement remplace prive.fin_essai ; l'étape 5b ajoutera l'abonnement en tête.)

create table public.acces_gratuit (
  eleve_id uuid primary key references public.profil on delete cascade,
  cours_id uuid not null references public.cours on delete restrict,
  choisi_le timestamptz not null default now(),
  change_utilise boolean not null default false,
  modifie_le timestamptz
);
alter table public.acces_gratuit enable row level security;
create policy "son cours gratuit" on public.acces_gratuit for select to authenticated using (eleve_id = (select auth.uid()));
revoke all on public.acces_gratuit from anon, authenticated;
grant select on public.acces_gratuit to authenticated;

-- Une seule source pour la fin de l'essai (7 jours après l'inscription).
create function prive.fin_essai(p_eleve uuid) returns timestamptz
language sql stable security definer set search_path = '' as $$
  select p.inscrit_le + interval '7 days' from public.profil p where p.id = p_eleve
$$;

create or replace function public.en_essai() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(prive.fin_essai(auth.uid()) > now(), false)
$$;

-- p_reprise : vrai pour la lecture (une tentative commencée pendant l'essai se termine dans les 24 heures) ;
-- faux pour démarrer un quiz, une évaluation ou une révision.
create function prive.acces_cours(p_eleve uuid, p_cours uuid, p_reprise boolean) returns boolean
language sql stable security definer set search_path = '' as $$
  select case
    when p_eleve is null then false
    when (select p.role from public.profil p where p.id = p_eleve) = 'admin_contenu' then true
    when not exists (select 1 from public.cours where id = p_cours and publie) then false
    when (select p.role from public.profil p where p.id = p_eleve) = 'enseignant' then true
    else coalesce(prive.fin_essai(p_eleve) > now(), false)
      or exists (select 1 from public.acces_gratuit a where a.eleve_id = p_eleve and a.cours_id = p_cours)
      or (p_reprise and exists (select 1 from public.tentative t
                                 where t.eleve_id = p_eleve and t.cours_id = p_cours
                                   and t.statut = 'en_cours'
                                   and t.debut > now() - interval '24 hours'
                                   and t.debut <= prive.fin_essai(p_eleve)))
  end
$$;

create or replace function public.peut_lire_cours(p_cours uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select prive.acces_cours(auth.uid(), p_cours, true)
$$;

revoke execute on function prive.fin_essai(uuid), prive.acces_cours(uuid, uuid, boolean) from public, anon, authenticated;

create function public.choisir_cours_gratuit(p_cours uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v public.acces_gratuit;
  v_publie boolean;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if public.en_essai() then
    raise exception 'essai_en_cours';
  end if;
  if not exists (select 1 from public.cours where id = p_cours and publie) then
    raise exception 'cours_indisponible';
  end if;
  if not exists (select 1 from public.cours c join public.profil p on p.id = auth.uid()
                  where c.id = p_cours and c.filiere_id = p.filiere_id and c.niveau_code = p.niveau_code) then
    raise exception 'cours_hors_filiere';
  end if;
  select * into v from public.acces_gratuit where eleve_id = auth.uid() for update;
  if not found then
    insert into public.acces_gratuit (eleve_id, cours_id) values (auth.uid(), p_cours)
    on conflict (eleve_id) do nothing;
    return;
  end if;
  if v.cours_id = p_cours then
    return;
  end if;
  select publie into v_publie from public.cours where id = v.cours_id;
  if not coalesce(v_publie, false) then
    -- Le cours choisi n'est plus publié : nouveau choix, sans consommer le changement unique.
    update public.acces_gratuit set cours_id = p_cours, choisi_le = now(), modifie_le = now()
     where eleve_id = auth.uid();
    return;
  end if;
  if v.change_utilise or v.choisi_le < now() - interval '48 hours' then
    raise exception 'choix_definitif';
  end if;
  update public.acces_gratuit set cours_id = p_cours, change_utilise = true, modifie_le = now()
   where eleve_id = auth.uid();
end $$;

-- cours_gratuit_id est nul quand le cours choisi n'est plus publié : l'élève doit alors en choisir un autre.
create function public.mon_acces()
returns table (role text, en_essai boolean, fin_essai timestamptz, cours_gratuit_id uuid, changement_possible_jusqu_au timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.role::text, public.en_essai(), prive.fin_essai(p.id), c.id,
         case when c.id is not null and not a.change_utilise and a.choisi_le > now() - interval '48 hours'
              then a.choisi_le + interval '48 hours' end
    from public.profil p
    left join public.acces_gratuit a on a.eleve_id = p.id
    left join public.cours c on c.id = a.cours_id and c.publie
   where p.id = auth.uid()
$$;

-- Démarrer un quiz, une évaluation ou une révision exige l'accès sans reprise (corps recopiés des migrations les plus récentes).
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
  if v_cours is null or not prive.acces_cours(auth.uid(), v_cours, false) then
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
  if not prive.acces_cours(auth.uid(), p_cours, false) then
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
  if not prive.acces_cours(auth.uid(), v_cours, false) then
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

revoke execute on function public.choisir_cours_gratuit(uuid), public.mon_acces(),
  public.demarrer_quiz(uuid, int, boolean), public.demarrer_evaluation(uuid), public.demarrer_revision_generale(uuid) from public, anon;
grant execute on function public.choisir_cours_gratuit(uuid), public.mon_acces(),
  public.demarrer_quiz(uuid, int, boolean), public.demarrer_evaluation(uuid), public.demarrer_revision_generale(uuid) to authenticated;
