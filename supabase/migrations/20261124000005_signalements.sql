-- Étape 3b : un enseignant signale une question ; elle sort des tirages et part en relecture.

create function public.signaler_question(p_question uuid, p_commentaire text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if public.role_actuel() is distinct from 'enseignant' then
    raise exception 'acces_refuse';
  end if;
  if char_length(btrim(coalesce(p_commentaire, ''))) not between 5 and 1000 then
    raise exception 'commentaire_invalide';
  end if;
  -- Verrou par auteur : le comptage et l'insertion se font sans course entre deux appels simultanés.
  perform pg_advisory_xact_lock(hashtextextended('signalement:' || auth.uid()::text, 0));
  if (select count(*) from public.signalement s
       where s.auteur_id = auth.uid() and s.cree_le > now() - interval '24 hours') >= 20 then
    raise exception 'trop_de_signalements';
  end if;
  -- Une question déjà passée en relecture par un autre signalement peut encore être signalée par un autre enseignant.
  if not exists (select 1 from public.question q
                   join public.chapitre c on c.id = q.chapitre_id and c.publie
                   join public.cours co on co.id = c.cours_id and co.publie
                  where q.id = p_question
                    and (q.statut = 'valide'
                         or (q.statut = 'a_relire'
                             and exists (select 1 from public.signalement s2 where s2.question_id = q.id and s2.statut = 'ouvert')))) then
    raise exception 'question_introuvable';
  end if;
  begin
    insert into public.signalement (question_id, auteur_id, commentaire)
      values (p_question, auth.uid(), btrim(p_commentaire))
      returning id into v_id;
  exception when unique_violation then
    raise exception 'deja_signalee';
  end;
  update public.question q set statut = 'a_relire' where q.id = p_question and q.statut = 'valide';
  return v_id;
end $$;

create function public.mes_signalements()
returns table (id uuid, question_id uuid, enonce text, chapitre_titre text, cours_titre text, commentaire text,
               statut text, reponse text, cree_le timestamptz, traite_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select s.id, s.question_id, q.enonce, c.titre, co.titre, s.commentaire, s.statut, s.reponse, s.cree_le, s.traite_le
    from public.signalement s
    join public.question q on q.id = s.question_id
    join public.chapitre c on c.id = q.chapitre_id
    join public.cours co on co.id = c.cours_id
   where s.auteur_id = auth.uid()
   order by s.cree_le desc
   limit 200
$$;

create function public.signalements_admin(p_statut text default 'ouvert')
returns table (id uuid, question_id uuid, chapitre_id uuid, chapitre_titre text, cours_titre text, enonce text,
               statut_question public.statut_question_t, commentaire text, statut text, reponse text,
               auteur_nom text, auteur_email text, cree_le timestamptz, traite_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select s.id, s.question_id, c.id, c.titre, co.titre, q.enonce, q.statut, s.commentaire, s.statut, s.reponse,
         p.nom, p.email, s.cree_le, s.traite_le
    from public.signalement s
    join public.question q on q.id = s.question_id
    join public.chapitre c on c.id = q.chapitre_id
    join public.cours co on co.id = c.cours_id
    left join public.profil p on p.id = s.auteur_id
   where public.role_actuel() = 'admin_contenu' and (p_statut is null or s.statut = p_statut)
   order by s.cree_le
   limit 500
$$;

-- Rejeter le dernier signalement ouvert d'une question encore « a_relire » la remet en « valide ».
create function public.traiter_signalement(p_signalement uuid, p_decision text, p_reponse text default null) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_question uuid;
begin
  perform prive.exiger_admin();
  if p_decision is null or p_decision not in ('traite', 'rejete') then
    raise exception 'decision_invalide';
  end if;
  if char_length(coalesce(p_reponse, '')) > 1000 then
    raise exception 'reponse_trop_longue';
  end if;
  update public.signalement s
     set statut = p_decision, reponse = nullif(btrim(p_reponse), ''), traite_le = now(), traite_par = auth.uid()
   where s.id = p_signalement and s.statut = 'ouvert'
   returning s.question_id into v_question;
  if v_question is null then
    raise exception 'signalement_introuvable';
  end if;
  if p_decision = 'rejete'
     and not exists (select 1 from public.signalement s where s.question_id = v_question and s.statut = 'ouvert') then
    update public.question q set statut = 'valide' where q.id = v_question and q.statut = 'a_relire';
  end if;
end $$;

revoke execute on function public.signaler_question(uuid, text), public.mes_signalements(),
  public.signalements_admin(text), public.traiter_signalement(uuid, text, text) from public, anon;
grant execute on function public.signaler_question(uuid, text), public.mes_signalements(),
  public.signalements_admin(text), public.traiter_signalement(uuid, text, text) to authenticated;
