-- Notifications : abonnements Web Push, préférences, notifications planifiées, délai du rappel d'un événement.

create type public.type_notification_t as enum ('rappel_evenement', 'echeance_proche', 'nouvel_essai', 'revision_du_jour', 'inactivite');
create type public.statut_notification_t as enum ('en_attente', 'envoyee', 'echec');

-- Délai du rappel avant chaque occurrence : 10 minutes, 1 heure ou la veille (24 heures).
alter table public.evenement add column delai_rappel_minutes smallint
  check (delai_rappel_minutes is null or delai_rappel_minutes in (10, 60, 1440));

create table public.abonnement_push (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null references public.profil on delete cascade,
  endpoint text not null unique check (endpoint ~ '^https://' and char_length(endpoint) <= 1000),
  p256dh text not null check (char_length(p256dh) between 20 and 200),
  auth text not null check (char_length(auth) between 10 and 100),
  appareil text not null default '' check (char_length(appareil) <= 80),
  cree_le timestamptz not null default now()
);
create index abonnement_push_eleve on public.abonnement_push (eleve_id, cree_le);

create table public.preferences_notification (
  eleve_id uuid primary key references public.profil on delete cascade,
  rappel_evenement boolean not null default true,
  echeance_proche boolean not null default true,
  nouvel_essai boolean not null default true,
  revision_du_jour boolean not null default true,
  inactivite boolean not null default true,
  silence_debut time not null default '22:00',
  silence_fin time not null default '07:00',
  jours_inactivite smallint not null default 3 check (jours_inactivite between 1 and 14),
  modifie_le timestamptz not null default now()
);
create trigger modifie_le before update on public.preferences_notification for each row execute function prive.toucher_modifie_le();

create table public.notification_planifiee (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null references public.profil on delete cascade,
  type public.type_notification_t not null,
  cle text not null check (char_length(cle) <= 200),
  -- Rappels d'un événement : supprimés avec lui.
  evenement_id uuid references public.evenement on delete cascade,
  titre text not null check (char_length(titre) between 1 and 120),
  corps text not null check (char_length(corps) <= 240),
  url text not null check (url ~ '^/' and url !~ '^//' and url !~ '[\\[:cntrl:]]'),
  envoi_prevu timestamptz not null,
  statut public.statut_notification_t not null default 'en_attente',
  essais smallint not null default 0 check (essais >= 0),
  reserve_jusqu_au timestamptz,
  envoyee_le timestamptz,
  lue_le timestamptz,
  cree_le timestamptz not null default now(),
  unique (eleve_id, cle)
);
create index notification_a_envoyer on public.notification_planifiee (envoi_prevu) where statut = 'en_attente';
create index notification_eleve on public.notification_planifiee (eleve_id, envoi_prevu desc);
create index notification_evenement on public.notification_planifiee (evenement_id) where evenement_id is not null;

alter table public.abonnement_push enable row level security;
alter table public.preferences_notification enable row level security;
alter table public.notification_planifiee enable row level security;
create policy "ses appareils" on public.abonnement_push for select to authenticated using (eleve_id = (select auth.uid()));
create policy "ses préférences" on public.preferences_notification for select to authenticated using (eleve_id = (select auth.uid()));
create policy "ses notifications" on public.notification_planifiee for select to authenticated using (eleve_id = (select auth.uid()));
revoke all on public.abonnement_push, public.preferences_notification, public.notification_planifiee from anon, authenticated;
-- Les clés et le point d'envoi ne sortent de la base que vers la route d'envoi.
grant select (id, eleve_id, appareil, cree_le) on public.abonnement_push to authenticated;
grant select on public.preferences_notification, public.notification_planifiee to authenticated;

-- Changer l'heure, la répétition ou le rappel d'un événement : ses rappels non envoyés sont replanifiés.
create function prive.oublier_rappels_evenement() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (new.debut, new.duree_minutes, new.repetition, new.jours_semaine, new.repeter_jusqu_au, new.delai_rappel_minutes)
     is distinct from (old.debut, old.duree_minutes, old.repetition, old.jours_semaine, old.repeter_jusqu_au, old.delai_rappel_minutes) then
    delete from public.notification_planifiee where evenement_id = new.id and statut = 'en_attente';
  end if;
  return new;
end $$;
revoke execute on function prive.oublier_rappels_evenement() from public;
create trigger oublier_rappels after update on public.evenement for each row execute function prive.oublier_rappels_evenement();

create function public.enregistrer_abonnement_push(p_endpoint text, p_p256dh text, p_auth text, p_appareil text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_hote text;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  -- Le point d'envoi doit viser un service push connu (sinon le serveur posterait n'importe où).
  -- Ni antislash, espace ou caractère de contrôle (un analyseur d'URL traite « \ » comme « / »),
  -- ni identifiants, ni port : l'hôte n'a que lettres, chiffres, tirets et points, puis / ? # ou la fin.
  if p_endpoint ~ '[\\[:space:][:cntrl:]]' then
    raise exception 'abonnement_invalide';
  end if;
  v_hote := substring(lower(coalesce(p_endpoint, '')) from '^https://([a-z0-9-]+(\.[a-z0-9-]+)*)(?:[/?#]|$)');
  if v_hote is null
     or not (v_hote in ('fcm.googleapis.com', 'updates.push.services.mozilla.com')
             or v_hote like '%.push.services.mozilla.com'
             or v_hote like '%.push.apple.com'
             or v_hote like '%.notify.windows.com') then
    raise exception 'abonnement_invalide';
  end if;
  if p_endpoint is null or p_endpoint !~ '^https://' or char_length(p_endpoint) > 1000
     or char_length(coalesce(p_p256dh, '')) not between 20 and 200
     or char_length(coalesce(p_auth, '')) not between 10 and 100 then
    raise exception 'abonnement_invalide';
  end if;
  -- Un même appareil passe au dernier élève qui l'a enregistré (appareil partagé).
  insert into public.abonnement_push (eleve_id, endpoint, p256dh, auth, appareil)
    values (auth.uid(), p_endpoint, p_p256dh, p_auth, left(btrim(coalesce(p_appareil, '')), 80))
  on conflict (endpoint) do update
    set eleve_id = excluded.eleve_id, p256dh = excluded.p256dh, auth = excluded.auth,
        appareil = excluded.appareil, cree_le = now()
  returning id into v_id;
  -- 10 appareils au plus : on retire les plus anciens.
  delete from public.abonnement_push a
   where a.eleve_id = auth.uid()
     and a.id not in (select b.id from public.abonnement_push b where b.eleve_id = auth.uid()
                       order by b.cree_le desc, b.id limit 10);
  return v_id;
end $$;

create function public.supprimer_abonnement_push(p_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  delete from public.abonnement_push where id = p_id and eleve_id = auth.uid();
end $$;

-- Désactivation depuis l'appareil lui-même : le navigateur ne connaît que son point d'envoi.
create function public.supprimer_abonnement_push_endpoint(p_endpoint text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  delete from public.abonnement_push where endpoint = p_endpoint and eleve_id = auth.uid();
end $$;

create function public.enregistrer_preferences_notification(p jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v public.preferences_notification;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if p is null or jsonb_typeof(p) <> 'object'
     or exists (select 1 from unnest(array['rappel_evenement', 'echeance_proche', 'nouvel_essai', 'revision_du_jour', 'inactivite']) k
                 where p ? k and jsonb_typeof(p -> k) <> 'boolean') then
    raise exception 'preferences_invalides';
  end if;
  begin
    v.rappel_evenement := coalesce((p->>'rappel_evenement')::boolean, true);
    v.echeance_proche := coalesce((p->>'echeance_proche')::boolean, true);
    v.nouvel_essai := coalesce((p->>'nouvel_essai')::boolean, true);
    v.revision_du_jour := coalesce((p->>'revision_du_jour')::boolean, true);
    v.inactivite := coalesce((p->>'inactivite')::boolean, true);
    v.silence_debut := coalesce((p->>'silence_debut')::time, time '22:00');
    v.silence_fin := coalesce((p->>'silence_fin')::time, time '07:00');
    v.jours_inactivite := coalesce((p->>'jours_inactivite')::smallint, 3);
  exception when others then
    raise exception 'preferences_invalides';
  end;
  if (p->>'silence_debut') is not null and (p->>'silence_debut') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
     or (p->>'silence_fin') is not null and (p->>'silence_fin') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
     or v.jours_inactivite not between 1 and 14 then
    raise exception 'preferences_invalides';
  end if;
  insert into public.preferences_notification as pr (eleve_id, rappel_evenement, echeance_proche, nouvel_essai, revision_du_jour,
                                                     inactivite, silence_debut, silence_fin, jours_inactivite)
    values (auth.uid(), v.rappel_evenement, v.echeance_proche, v.nouvel_essai, v.revision_du_jour,
            v.inactivite, v.silence_debut, v.silence_fin, v.jours_inactivite)
  on conflict (eleve_id) do update set
    rappel_evenement = excluded.rappel_evenement, echeance_proche = excluded.echeance_proche,
    nouvel_essai = excluded.nouvel_essai, revision_du_jour = excluded.revision_du_jour,
    inactivite = excluded.inactivite, silence_debut = excluded.silence_debut,
    silence_fin = excluded.silence_fin, jours_inactivite = excluded.jours_inactivite;
  -- Un type désactivé : ses notifications pas encore envoyées disparaissent.
  delete from public.notification_planifiee n
   where n.eleve_id = auth.uid() and n.statut = 'en_attente'
     and ((n.type = 'rappel_evenement' and not v.rappel_evenement)
       or (n.type = 'echeance_proche' and not v.echeance_proche)
       or (n.type = 'nouvel_essai' and not v.nouvel_essai)
       or (n.type = 'revision_du_jour' and not v.revision_du_jour)
       or (n.type = 'inactivite' and not v.inactivite));
end $$;

create function public.regler_rappel_evenement(p_id uuid, p_delai int) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if p_delai is not null and p_delai not in (10, 60, 1440) then
    raise exception 'rappel_invalide';
  end if;
  update public.evenement set delai_rappel_minutes = p_delai::smallint
   where id = p_id and eleve_id = auth.uid();
  if not found then
    raise exception 'evenement_introuvable';
  end if;
  -- Le déclencheur ne voit rien si le délai ne change pas : on nettoie ici aussi.
  delete from public.notification_planifiee where evenement_id = p_id and statut = 'en_attente';
end $$;

create function public.marquer_rappels_lus() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  update public.notification_planifiee set lue_le = now()
   where eleve_id = auth.uid() and lue_le is null and envoi_prevu <= now();
end $$;

revoke execute on function public.enregistrer_abonnement_push(text, text, text, text), public.supprimer_abonnement_push(uuid),
  public.supprimer_abonnement_push_endpoint(text), public.enregistrer_preferences_notification(jsonb),
  public.regler_rappel_evenement(uuid, int), public.marquer_rappels_lus() from public, anon;
grant execute on function public.enregistrer_abonnement_push(text, text, text, text), public.supprimer_abonnement_push(uuid),
  public.supprimer_abonnement_push_endpoint(text), public.enregistrer_preferences_notification(jsonb),
  public.regler_rappel_evenement(uuid, int), public.marquer_rappels_lus() to authenticated;
