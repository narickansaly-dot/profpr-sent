-- Consentement parental des moins de 15 ans : demande par e-mail, accord par lien, accès bloqué en attendant.
-- L'élève n'obtient jamais le jeton : il est émis par une RPC protégée par le secret d'envoi (comme envoi_reserver).

create table public.consentement_parental (
  eleve_id uuid primary key references public.profil on delete cascade,
  email_parent text not null check (char_length(email_parent) between 3 and 254),
  -- Nul tant que le jeton de la demande n'a pas été émis (et après un renvoi, qui invalide l'ancien lien).
  jeton_empreinte bytea unique,
  demande_le timestamptz not null default now(),
  dernier_envoi_le timestamptz not null default now(),
  envois_du_jour smallint not null default 1 check (envois_du_jour >= 0),
  jour_envois date not null default ((now() at time zone 'Europe/Paris')::date),
  donne_le timestamptz
);
alter table public.consentement_parental enable row level security;
create policy "son consentement" on public.consentement_parental for select to authenticated using (eleve_id = (select auth.uid()));
revoke all on public.consentement_parental from anon, authenticated;
grant select (eleve_id, email_parent, demande_le, dernier_envoi_le, donne_le) on public.consentement_parental to authenticated;

-- L'indicateur « moins de 15 ans » ne change plus une fois renseigné (indépendant de onboarding_termine).
create function prive.verrouiller_age() returns trigger
language plpgsql set search_path = '' as $$
begin
  if auth.uid() is not null and old.moins_de_15_ans is not null and new.moins_de_15_ans is distinct from old.moins_de_15_ans then
    raise exception 'age_verrouille';
  end if;
  return new;
end $$;
revoke execute on function prive.verrouiller_age() from public;
create trigger verrouiller_age before update of moins_de_15_ans on public.profil
  for each row execute function prive.verrouiller_age();

create function prive.consentement_requis(p_eleve uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profil p
     where p.id = p_eleve and p.role = 'eleve' and p.moins_de_15_ans
       and not exists (select 1 from public.consentement_parental c where c.eleve_id = p.id and c.donne_le is not null))
$$;
revoke execute on function prive.consentement_requis(uuid) from public;

-- Pour un moins de 15 ans, l'essai démarre à l'accord parental (corps de la tâche 1 + le greatest).
create or replace function prive.fin_essai(p_eleve uuid) returns timestamptz
language sql stable security definer set search_path = '' as $$
  select greatest(p.inscrit_le, case when p.moins_de_15_ans then c.donne_le end) + interval '7 days'
    from public.profil p
    left join public.consentement_parental c on c.eleve_id = p.id
   where p.id = p_eleve
$$;

-- Corps de la tâche 1, avec la branche « consentement requis » avant l'accès normal.
create or replace function prive.acces_cours(p_eleve uuid, p_cours uuid, p_reprise boolean) returns boolean
language sql stable security definer set search_path = '' as $$
  select case
    when p_eleve is null then false
    when (select p.role from public.profil p where p.id = p_eleve) = 'admin_contenu' then true
    when not exists (select 1 from public.cours where id = p_cours and publie) then false
    when (select p.role from public.profil p where p.id = p_eleve) = 'enseignant' then true
    when prive.consentement_requis(p_eleve) then false
    else coalesce(prive.fin_essai(p_eleve) > now(), false)
      or exists (select 1 from public.acces_gratuit a where a.eleve_id = p_eleve and a.cours_id = p_cours)
      or (p_reprise and exists (select 1 from public.tentative t
                                 where t.eleve_id = p_eleve and t.cours_id = p_cours
                                   and t.statut = 'en_cours'
                                   and t.debut > now() - interval '24 hours'
                                   and t.debut <= prive.fin_essai(p_eleve)))
  end
$$;

drop function public.mon_acces();
create function public.mon_acces()
returns table (role text, en_essai boolean, fin_essai timestamptz, cours_gratuit_id uuid, changement_possible_jusqu_au timestamptz,
               consentement_requis boolean, email_parent text, consentement_envoye_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.role::text,
         case when prive.consentement_requis(p.id) then false else public.en_essai() end,
         case when prive.consentement_requis(p.id) then null else prive.fin_essai(p.id) end, c.id,
         case when c.id is not null and not a.change_utilise and a.choisi_le > now() - interval '48 hours'
              then a.choisi_le + interval '48 hours' end,
         prive.consentement_requis(p.id), k.email_parent, k.dernier_envoi_le
    from public.profil p
    left join public.acces_gratuit a on a.eleve_id = p.id
    left join public.cours c on c.id = a.cours_id and c.publie
    left join public.consentement_parental k on k.eleve_id = p.id
   where p.id = auth.uid()
$$;
revoke execute on function public.mon_acces() from public, anon;
grant execute on function public.mon_acces() to authenticated;

-- Valide, applique les limites et enregistre la demande ; ne renvoie aucun secret.
-- Le jeton est ensuite émis par emettre_jeton_consentement (appelée par le serveur avec le secret d'envoi).
create function public.demander_consentement(p_email text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v public.consentement_parental;
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_jour date := (now() at time zone 'Europe/Paris')::date;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if not exists (select 1 from public.profil where id = auth.uid() and moins_de_15_ans and onboarding_termine) then
    raise exception 'consentement_inutile';
  end if;
  if char_length(v_email) not between 3 and 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'email_parent_invalide';
  end if;
  -- Sérialise les appels simultanés du même élève (la ligne de consentement n'existe pas encore au premier envoi).
  perform 1 from public.profil where id = auth.uid() for update;
  select * into v from public.consentement_parental where eleve_id = auth.uid() for update;
  if found then
    if v.donne_le is not null then
      raise exception 'consentement_deja_donne';
    end if;
    if v.dernier_envoi_le > now() - interval '10 minutes' then
      raise exception 'envoi_trop_rapproche';
    end if;
    if v.jour_envois = v_jour and v.envois_du_jour >= 5 then
      raise exception 'envois_epuises';
    end if;
  end if;
  insert into public.consentement_parental as c (eleve_id, email_parent)
    values (auth.uid(), v_email)
  on conflict (eleve_id) do update set
    email_parent = excluded.email_parent,
    jeton_empreinte = null,
    demande_le = now(),
    dernier_envoi_le = now(),
    envois_du_jour = case when c.jour_envois = v_jour then c.envois_du_jour + 1 else 1 end,
    jour_envois = v_jour;
end $$;

-- Émet le jeton de la demande en attente (une seule fois par demande). Réservée à la route serveur : secret d'envoi.
create function public.emettre_jeton_consentement(p_secret text, p_eleve uuid)
returns table (jeton text, prenom text, email text)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_jeton text;
  v_prenom text;
  v_email text;
begin
  perform prive.verifier_cle_envoi(p_secret);
  -- Jeton de 256 bits en base64url sans remplissage (43 caractères) ; seule l'empreinte est gardée.
  v_jeton := translate(encode(extensions.gen_random_bytes(32), 'base64'), '+/=', '-_');
  update public.consentement_parental c
     set jeton_empreinte = extensions.digest(v_jeton, 'sha256')
    from public.profil p
   where p.id = c.eleve_id and c.eleve_id = p_eleve
     and c.donne_le is null and c.jeton_empreinte is null
     and c.demande_le > now() - interval '7 days'
  returning coalesce(p.nom, ''), c.email_parent into v_prenom, v_email;
  if not found then
    raise exception 'lien_consentement_invalide';
  end if;
  return query select v_jeton, v_prenom, v_email;
end $$;

create function public.lire_demande_consentement(p_jeton text)
returns table (prenom text, deja_donne boolean)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if p_jeton is null or p_jeton !~ '^[A-Za-z0-9_-]{43}$' then
    raise exception 'lien_consentement_invalide';
  end if;
  return query
    select coalesce(p.nom, '')::text, c.donne_le is not null
      from public.consentement_parental c join public.profil p on p.id = c.eleve_id
     where c.jeton_empreinte = extensions.digest(p_jeton, 'sha256')
       and (c.donne_le is not null or c.demande_le > now() - interval '7 days');
  if not found then
    raise exception 'lien_consentement_invalide';
  end if;
end $$;

create function public.donner_consentement(p_jeton text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_prenom text;
begin
  if p_jeton is null or p_jeton !~ '^[A-Za-z0-9_-]{43}$' then
    raise exception 'lien_consentement_invalide';
  end if;
  update public.consentement_parental c set donne_le = coalesce(c.donne_le, now())
    from public.profil p
   where p.id = c.eleve_id
     and c.jeton_empreinte = extensions.digest(p_jeton, 'sha256')
     and (c.donne_le is not null or c.demande_le > now() - interval '7 days')
  returning coalesce(p.nom, '') into v_prenom;
  if not found then
    raise exception 'lien_consentement_invalide';
  end if;
  return v_prenom;
end $$;

revoke execute on function public.demander_consentement(text) from public, anon;
grant execute on function public.demander_consentement(text) to authenticated;
revoke execute on function public.emettre_jeton_consentement(text, uuid) from public, authenticated;
grant execute on function public.emettre_jeton_consentement(text, uuid) to anon;
revoke execute on function public.lire_demande_consentement(text), public.donner_consentement(text) from public;
grant execute on function public.lire_demande_consentement(text), public.donner_consentement(text) to anon, authenticated;

-- Corps de la tâche 1 + refus tant que l'accord parental manque.
create or replace function public.choisir_cours_gratuit(p_cours uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v public.acces_gratuit;
  v_publie boolean;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  -- Sans accord parental, aucun choix : il figerait le délai de 48 heures avant tout accès.
  if prive.consentement_requis(auth.uid()) then
    raise exception 'consentement_requis';
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
  -- Sérialise les appels simultanés du même élève (la ligne acces_gratuit n'existe pas encore au premier choix).
  perform 1 from public.profil where id = auth.uid() for update;
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
