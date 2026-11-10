-- Revue finale de l'étape 5a.
-- 1. Le secret d'envoi n'est plus écrit dans la commande de la tâche planifiée (cron.job, cron.job_run_details) :
--    il est rangé dans Supabase Vault et lu au moment de l'exécution.
-- 2. Le jeton de consentement est émis avec un secret distinct (prive.cle_consentement), et non plus avec le secret d'envoi.
-- 3. en_essai() est faux tant que l'accord parental manque.
-- 4. Au plus 3 demandes d'accord par jour vers une même adresse, tous comptes confondus.
-- 5. La purge d'un compte qui avait signalé une question remet celle-ci en « valide » si plus aucun signalement ne la retient.

-- Corps de 20261208000002_envoi.sql, avec le secret rangé dans Vault et lu par la commande au moment de l'exécution.
create or replace function public.configurer_envoi(p_url text, p_secret text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if p_url is null or p_url !~ '^https?://[^ ]+$' or char_length(coalesce(p_secret, '')) < 32 then
    raise exception 'configuration_invalide';
  end if;
  insert into prive.cle_envoi (id, empreinte) values (true, extensions.digest(p_secret, 'sha256'))
  on conflict (id) do update set empreinte = excluded.empreinte;
  select s.id into v_id from vault.secrets s where s.name = 'envoi_secret';
  if v_id is null then
    perform vault.create_secret(p_secret, 'envoi_secret', 'Secret partagé avec la route d''envoi des notifications');
  else
    perform vault.update_secret(v_id, p_secret);
  end if;
  perform cron.unschedule(j.jobid) from cron.job j where j.jobname = 'envoi-notifications';
  -- La commande stockée ne contient aucun secret : il est déchiffré à chaque exécution.
  perform cron.schedule('envoi-notifications', '* * * * *', format(
    $c$select net.http_post(url := %L, body := '{}'::jsonb, headers := jsonb_build_object('Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'envoi_secret'), 'Content-Type', 'application/json'), timeout_milliseconds := 50000)$c$,
    p_url));
end $$;
revoke execute on function public.configurer_envoi(text, text) from public, anon, authenticated;
grant execute on function public.configurer_envoi(text, text) to service_role;

-- L'ancienne tâche contient le secret en clair dans sa commande : elle est supprimée.
-- Relancer scripts/configurer-envoi.ts pour la recréer (npm run db:reset le fait en local).
select cron.unschedule(j.jobid) from cron.job j
 where j.jobname = 'envoi-notifications' and j.command not like '%vault.decrypted_secrets%';

-- Secret du consentement parental : empreinte seulement, une seule ligne (même modèle que prive.cle_envoi).
create table prive.cle_consentement (
  id boolean primary key default true check (id),
  empreinte bytea not null
);
revoke all on prive.cle_consentement from public, anon, authenticated;

create function prive.verifier_cle_consentement(p_secret text) returns void
language plpgsql stable set search_path = '' as $$
begin
  if p_secret is null or not exists (
    select 1 from prive.cle_consentement where empreinte = extensions.digest(p_secret, 'sha256')) then
    raise exception 'cle_consentement_invalide';
  end if;
end $$;
revoke execute on function prive.verifier_cle_consentement(text) from public;

-- Réservée à service_role (scripts/configurer-envoi.ts) : enregistre l'empreinte du secret de consentement.
create function public.configurer_consentement(p_secret text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if char_length(coalesce(p_secret, '')) < 32 then
    raise exception 'configuration_invalide';
  end if;
  insert into prive.cle_consentement (id, empreinte) values (true, extensions.digest(p_secret, 'sha256'))
  on conflict (id) do update set empreinte = excluded.empreinte;
end $$;
revoke execute on function public.configurer_consentement(text) from public, anon, authenticated;
grant execute on function public.configurer_consentement(text) to service_role;

-- Corps de 20261222000002_consentement.sql, avec le secret de consentement au lieu du secret d'envoi.
create or replace function public.emettre_jeton_consentement(p_secret text, p_eleve uuid)
returns table (jeton text, prenom text, email text)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_jeton text;
  v_prenom text;
  v_email text;
begin
  perform prive.verifier_cle_consentement(p_secret);
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
revoke execute on function public.emettre_jeton_consentement(text, uuid) from public, authenticated;
grant execute on function public.emettre_jeton_consentement(text, uuid) to anon;

-- Corps de 20261222000001_acces_gratuit.sql + faux tant que l'accord parental manque.
create or replace function public.en_essai() returns boolean
language sql stable security definer set search_path = '' as $$
  select case when prive.consentement_requis(auth.uid()) then false
              else coalesce(prive.fin_essai(auth.uid()) > now(), false) end
$$;
revoke execute on function public.en_essai() from public, anon;
grant execute on function public.en_essai() to authenticated;

-- Demandes d'accord par adresse de destination et par jour (empreinte de l'adresse seulement), purgées chaque nuit.
create table prive.envoi_consentement_adresse (
  email_hash bytea not null,
  jour date not null,
  nombre smallint not null default 1 check (nombre >= 1),
  primary key (email_hash, jour)
);
revoke all on prive.envoi_consentement_adresse from public, anon, authenticated;

-- Corps de 20261222000002_consentement.sql + au plus 3 demandes par jour vers une même adresse, tous comptes confondus.
create or replace function public.demander_consentement(p_email text) returns void
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
  -- Une même adresse ne reçoit pas plus de 3 demandes par jour, quel que soit le compte qui les envoie.
  -- Le compteur est annulé avec la transaction si une erreur survient plus loin.
  insert into prive.envoi_consentement_adresse as e (email_hash, jour, nombre)
    values (extensions.digest(v_email, 'sha256'), v_jour, 1)
  on conflict (email_hash, jour) do update set nombre = e.nombre + 1 where e.nombre < 3;
  if not found then
    raise exception 'envois_epuises';
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
revoke execute on function public.demander_consentement(text) from public, anon;
grant execute on function public.demander_consentement(text) to authenticated;

-- Corps de 20261222000004_classes_retour.sql + questions libérées des signalements des comptes purgés
-- + purge des compteurs de demandes par adresse.
create or replace function prive.purges_quotidiennes() returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_purges uuid[];
  v_questions uuid[];
begin
  v_purges := array(
    select p.id from public.profil p
     where p.suppression_demandee_le < now() - interval '30 days'
       -- Le dernier administrateur du contenu est conservé.
       and (p.role <> 'admin_contenu' or exists (
             select 1 from public.profil a where a.role = 'admin_contenu' and a.id <> p.id and a.suppression_demandee_le is null)));
  -- Questions « a_relire » retenues par un signalement ouvert d'un compte purgé : verrouillées (même verrou que
  -- signaler_question et traiter_signalement), puis remises en « valide » si aucun autre signalement ouvert ne les
  -- retient, comme au rejet du dernier signalement (sauf si la question a été modifiée depuis : elle reste à relire).
  v_questions := array(
    select distinct s.question_id from public.signalement s
     where s.statut = 'ouvert' and s.auteur_id = any (v_purges));
  perform 1 from public.question q where q.id = any (v_questions) order by q.id for update;
  update public.question q set statut = 'valide'
   where q.id = any (v_questions) and q.statut = 'a_relire'
     and not exists (select 1 from public.signalement s
                      where s.question_id = q.id and s.statut = 'ouvert' and s.auteur_id <> all (v_purges))
     and q.modifie_le <= (select max(s.cree_le) from public.signalement s where s.question_id = q.id);
  -- Cascade : auth.users -> profil -> classes (et leurs inscriptions, échéances, départs) et toutes les données de la personne.
  delete from auth.users u where u.id = any (v_purges);
  delete from prive.depart_classe where quitte_le < now() - interval '30 days';
  delete from prive.retrait_classe where retire_le < now() - interval '30 days';
  delete from prive.envoi_consentement_adresse where jour < (now() at time zone 'Europe/Paris')::date;
end $$;
revoke execute on function prive.purges_quotidiennes() from public;
