-- Aucun traitement d'un élève de moins de 15 ans sans accord parental, ou après le retrait de l'accord (audit I1).
-- Écritures : refus avec consentement_requis. Lectures de l'enseignant, rappels et flux iCal : l'élève est ignoré tant que
-- prive.consentement_requis(élève) est vrai. Rien n'est supprimé : si le parent annule son retrait, tout redevient visible.
-- Chaque corps est celui de la migration la plus récente qui définit la fonction ; seule la garde ou le filtre s'ajoute.
-- Les signatures ne changent pas : create or replace conserve les droits.


-- Corps de 20261222000004_classes_retour.sql + refus sans accord.
create or replace function public.rejoindre_classe(p_code text) returns table (statut text, classe_nom text)
language plpgsql security definer set search_path = '' as $$
declare
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
  v_classe public.classe;
begin
  if prive.consentement_requis(auth.uid()) then
    raise exception 'consentement_requis';
  end if;
  -- Une personne en attente de validation enseignant ne rejoint pas de classe : validée, ses résultats d'élève
  -- n'apparaîtraient dans aucune classe de toute façon (traiter_demande_enseignant supprime ses inscriptions).
  if public.role_actuel() is distinct from 'eleve'
     or (select demande_enseignant from public.profil where id = auth.uid()) then
    raise exception 'classe_reservee_eleves';
  end if;
  -- Sérialise les appels d'un même élève : sans cela, des appels simultanés contourneraient le frein.
  perform pg_advisory_xact_lock(hashtextextended('rejoindre_classe:' || auth.uid()::text, 0));
  delete from prive.essai_code where eleve_id = auth.uid() and essai_le < now() - interval '1 hour';
  if (select count(*) from prive.essai_code
       where eleve_id = auth.uid() and essai_le > now() - interval '1 hour') >= 10 then
    return query select 'trop_d_essais'::text, null::text;
    return;
  end if;
  select * into v_classe from public.classe where code = v_code;
  if not found then
    insert into prive.essai_code (eleve_id) values (auth.uid());
    return query select 'code_invalide'::text, null::text;
    return;
  end if;
  -- Élève retiré par l'enseignant depuis moins de 24 heures.
  if exists (select 1 from prive.retrait_classe
              where classe_id = v_classe.id and eleve_id = auth.uid() and retire_le > now() - interval '24 hours') then
    raise exception 'retour_bloque';
  end if;
  delete from prive.depart_classe where classe_id = v_classe.id and eleve_id = auth.uid();
  insert into public.inscription_classe (classe_id, eleve_id) values (v_classe.id, auth.uid())
  on conflict do nothing;
  if not found then
    return query select 'deja_inscrit'::text, v_classe.nom;
    return;
  end if;
  return query select 'ok'::text, v_classe.nom;
end $$;

-- Corps de 20261215000003_verrou_profil.sql + refus sans accord.
create or replace function public.enregistrer_evenement(p_id uuid, p jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_type public.type_evenement_t;
  v_titre text;
  v_debut timestamptz;
  v_duree int;
  v_cours uuid;
  v_chapitres uuid[];
  v_rep public.repetition_t;
  v_jours smallint[];
  v_jusqu date;
  v_jour_debut date;
  v_id uuid;
  v_type_actuel public.type_evenement_t;
begin
  if prive.consentement_requis(auth.uid()) then
    raise exception 'consentement_requis';
  end if;
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if jsonb_typeof(p) is distinct from 'object' then
    raise exception 'evenement_invalide';
  end if;
  begin
    v_type := (p->>'type')::public.type_evenement_t;
    v_titre := regexp_replace(p->>'titre', '^[[:space:]]+|[[:space:]]+$', '', 'g');
    v_debut := (p->>'debut')::timestamptz;
    v_duree := (p->>'duree_minutes')::int;
    v_cours := nullif(p->>'cours_id', '')::uuid;
    v_rep := coalesce(p->>'repetition', 'aucune')::public.repetition_t;
    v_jusqu := (p->>'repeter_jusqu_au')::date;
    v_chapitres := array(select distinct x::uuid from jsonb_array_elements_text(coalesce(nullif(p->'chapitres', 'null'::jsonb), '[]')) x);
    v_jours := (select array_agg(distinct x::smallint order by x::smallint)
                  from jsonb_array_elements_text(coalesce(nullif(p->'jours_semaine', 'null'::jsonb), '[]')) x);
  exception when others then
    raise exception 'evenement_invalide';
  end;
  if v_type is null or v_titre is null or char_length(v_titre) not between 1 and 120
     or v_titre ~ '[[:cntrl:]]'
     or v_debut is null or v_duree is null or v_duree not between 5 and 720
     or v_debut < now() - interval '1 year' or v_debut > now() + interval '2 years' then
    raise exception 'evenement_invalide';
  end if;

  v_jour_debut := (v_debut at time zone 'Europe/Paris')::date;
  if v_rep = 'aucune' then
    v_jours := null;
    v_jusqu := null;
  else
    if v_jusqu is null or v_jusqu < v_jour_debut or v_jusqu > v_jour_debut + 366 then
      raise exception 'repetition_invalide';
    end if;
    if v_rep = 'jours' then
      if v_jours is null or not v_jours <@ '{1,2,3,4,5,6,7}'::smallint[] then
        raise exception 'repetition_invalide';
      end if;
    else
      v_jours := null;
    end if;
  end if;

  if v_cours is not null and not public.peut_lire_cours(v_cours) then
    raise exception 'cours_indisponible';
  end if;
  if cardinality(v_chapitres) > 30
     or (cardinality(v_chapitres) > 0 and v_cours is null)
     or exists (select 1 from unnest(v_chapitres) c
                 where not exists (select 1 from public.chapitre ch where ch.id = c and ch.cours_id = v_cours and ch.publie)) then
    raise exception 'chapitres_invalides';
  end if;

  if p_id is null then
    -- Verrou du profil : deux créations simultanées ne peuvent pas dépasser ensemble la limite.
    perform 1 from public.profil where id = auth.uid() for no key update;
    if (select count(*) from public.evenement where eleve_id = auth.uid()) >= 500 then
      raise exception 'trop_d_evenements';
    end if;
    insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, cours_id, repetition, jours_semaine, repeter_jusqu_au)
      values (auth.uid(), v_type, v_titre, v_debut, v_duree, v_cours, v_rep, v_jours, v_jusqu)
      returning id into v_id;
  else
    select e.type into v_type_actuel from public.evenement e where e.id = p_id and e.eleve_id = auth.uid();
    if not found then
      raise exception 'evenement_introuvable';
    end if;
    -- Le type ne change pas après la création.
    if v_type_actuel is distinct from v_type then
      raise exception 'type_non_modifiable';
    end if;
    update public.evenement
       set titre = v_titre, debut = v_debut, duree_minutes = v_duree, cours_id = v_cours,
           repetition = v_rep, jours_semaine = v_jours, repeter_jusqu_au = v_jusqu
     where id = p_id and eleve_id = auth.uid()
     returning id into v_id;
    -- Supprimé entre la vérification et la mise à jour.
    if v_id is null then
      raise exception 'evenement_introuvable';
    end if;
    delete from public.evenement_chapitre where evenement_id = v_id;
  end if;
  insert into public.evenement_chapitre (evenement_id, chapitre_id) select v_id, unnest(v_chapitres);
  return v_id;
end $$;

-- Corps de 20261201000002_ical.sql + refus sans accord.
create or replace function public.creer_jeton_ical() returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_jeton text;
begin
  if prive.consentement_requis(auth.uid()) then
    raise exception 'consentement_requis';
  end if;
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  -- base64url sans remplissage : 32 octets donnent 43 caractères.
  v_jeton := translate(encode(extensions.gen_random_bytes(32), 'base64'), '+/=', '-_');
  insert into prive.jeton_ical (eleve_id, empreinte) values (auth.uid(), extensions.digest(v_jeton, 'sha256'))
  on conflict (eleve_id) do update set empreinte = excluded.empreinte, cree_le = now();
  return v_jeton;
end $$;

-- Corps de 20261208000001_notifications.sql + refus sans accord.
create or replace function public.enregistrer_abonnement_push(p_endpoint text, p_p256dh text, p_auth text, p_appareil text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_hote text;
begin
  if prive.consentement_requis(auth.uid()) then
    raise exception 'consentement_requis';
  end if;
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

-- Corps de 20261215000003_verrou_profil.sql + refus sans accord.
create or replace function public.accepter_plan_revision(p_examen uuid, p_reglages jsonb, p_sessions jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_examen public.evenement;
  v_reglages record;
  v_ancien uuid;
  v_plan uuid;
  v_id uuid;
  s jsonb;
  v_titre text;
  v_debut timestamptz;
  v_duree int;
  v_generale boolean;
  v_chapitres uuid[];
  v_nb_generales int := 0;
begin
  if prive.consentement_requis(auth.uid()) then
    raise exception 'consentement_requis';
  end if;
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  select * into v_examen from public.evenement
   where id = p_examen and eleve_id = auth.uid() and type = 'examen_reel' and cours_id is not null
   for update;
  if not found then
    raise exception 'examen_introuvable';
  end if;
  if v_examen.debut <= now() then
    raise exception 'examen_passe';
  end if;
  if v_examen.debut > now() + interval '365 days'
     or jsonb_typeof(p_sessions) is distinct from 'array' or jsonb_array_length(p_sessions) not between 1 and 120 then
    raise exception 'planning_invalide';
  end if;
  select * into v_reglages from prive.lire_reglages_plan(p_reglages);

  -- Réorganisation : les sessions à venir de l'ancien plan disparaissent, les passées restent sans plan.
  select id into v_ancien from public.plan_revision where examen_id = p_examen;
  if v_ancien is not null then
    delete from public.evenement where plan_id = v_ancien and debut > now();
    delete from public.plan_revision where id = v_ancien;
  end if;
  -- Verrou du profil : deux acceptations simultanées ne peuvent pas dépasser ensemble la limite.
  perform 1 from public.profil where id = auth.uid() for no key update;
  if (select count(*) from public.evenement where eleve_id = auth.uid()) + jsonb_array_length(p_sessions) > 500 then
    raise exception 'trop_d_evenements';
  end if;

  insert into public.plan_revision (eleve_id, examen_id, sessions_par_semaine, duree_minutes, jours_preferes, heure_debut, statut)
    values (auth.uid(), p_examen, v_reglages.sessions_par_semaine, v_reglages.duree_minutes, v_reglages.jours_preferes,
            v_reglages.heure_debut, 'accepte')
    returning id into v_plan;

  for s in select value from jsonb_array_elements(p_sessions) loop
    begin
      v_titre := regexp_replace(s->>'titre', '^[[:space:]]+|[[:space:]]+$', '', 'g');
      v_debut := (s->>'debut')::timestamptz;
      v_duree := (s->>'duree_minutes')::int;
      v_generale := coalesce((s->>'revision_generale')::boolean, false);
      v_chapitres := array(select distinct x::uuid from jsonb_array_elements_text(s->'chapitres') x);
    exception when others then
      raise exception 'planning_invalide';
    end;
    if v_titre is null or char_length(v_titre) not between 1 and 120
       or v_titre ~ '[[:cntrl:]]'
       or v_debut is null or v_debut < now() or v_debut >= v_examen.debut
       or v_duree is null or v_duree not between 15 and 180
       or cardinality(v_chapitres) not between 1 and 30
       or (v_generale and ((v_debut at time zone 'Europe/Paris')::date <> (v_examen.debut at time zone 'Europe/Paris')::date - 1
                           or v_nb_generales > 0))
       or exists (select 1 from unnest(v_chapitres) c
                   where not exists (select 1 from public.chapitre ch where ch.id = c and ch.cours_id = v_examen.cours_id and ch.publie)) then
      raise exception 'planning_invalide';
    end if;
    insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, cours_id, plan_id, revision_generale)
      values (auth.uid(), 'revision', v_titre, v_debut, v_duree, v_examen.cours_id, v_plan, v_generale)
      returning id into v_id;
    insert into public.evenement_chapitre (evenement_id, chapitre_id) select v_id, unnest(v_chapitres);
    if v_generale then
      v_nb_generales := v_nb_generales + 1;
    end if;
  end loop;
  return v_plan;
end $$;

-- Corps de 20261117000004_suivi_enseignant.sql + élève sans accord ignoré.
create or replace function public.suivi_classe(p_classe uuid)
returns table (eleve_id uuid, nom text, cours_id uuid, cours_titre text, chapitres_valides int, chapitres_total int,
               note_evaluation numeric, evaluation_validee boolean, essais_evaluation int, derniere_activite timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'classe_introuvable';
  end if;
  return query
    select p.id, p.nom, co.id, co.titre,
           (select count(*)::int from public.progression_chapitre pc join public.chapitre c on c.id = pc.chapitre_id
             where pc.eleve_id = p.id and c.cours_id = co.id and c.publie and pc.valide),
           (select count(*)::int from public.chapitre c where c.cours_id = co.id and c.publie),
           pco.meilleure_note, coalesce(pco.valide, false), coalesce(pco.essais, 0)::int,
           (select max(t.fin) from public.tentative t where t.eleve_id = p.id and t.cours_id = co.id)
      from public.inscription_classe i
      join public.profil p on p.id = i.eleve_id
      join public.classe_cours cc on cc.classe_id = i.classe_id
      join public.cours co on co.id = cc.cours_id
      left join public.progression_cours pco on pco.eleve_id = p.id and pco.cours_id = co.id
     where i.classe_id = p_classe
       and not prive.consentement_requis(p.id)
     order by p.nom, co.titre;
end $$;

-- Corps de 20261117000004_suivi_enseignant.sql + élève sans accord ignoré.
create or replace function public.notes_classe(p_classe uuid, p_cours uuid)
returns table (eleve_id uuid, nom text, chapitre_id uuid, chapitre_numero smallint, chapitre_titre text, meilleure_note numeric, valide boolean)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'classe_introuvable';
  end if;
  if not exists (select 1 from public.classe_cours where classe_id = p_classe and cours_id = p_cours) then
    raise exception 'cours_invalide';
  end if;
  return query
    select p.id, p.nom, c.id, c.numero, c.titre, pc.meilleure_note, coalesce(pc.valide, false)
      from public.inscription_classe i
      join public.profil p on p.id = i.eleve_id
      join public.chapitre c on c.cours_id = p_cours and c.publie
      left join public.progression_chapitre pc on pc.eleve_id = p.id and pc.chapitre_id = c.id
     where i.classe_id = p_classe
       and not prive.consentement_requis(p.id)
     order by p.nom, c.numero;
end $$;

-- Corps de 20261117000004_suivi_enseignant.sql + réponses d'un élève sans accord ignorées.
create or replace function public.questions_ratees_classe(p_classe uuid, p_cours uuid, p_limite int default 10)
returns table (question_id uuid, chapitre_titre text, type public.type_question_t, enonce text, propositions jsonb, bonnes_reponses jsonb,
               reponses_acceptees text[], reponses int, taux_erreur int)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'classe_introuvable';
  end if;
  if not exists (select 1 from public.classe_cours where classe_id = p_classe and cours_id = p_cours) then
    raise exception 'cours_invalide';
  end if;
  return query
    select q.id, c.titre, q.type, q.enonce, q.propositions, qc.bonnes_reponses, qc.reponses_acceptees,
           count(*)::int, round(100.0 * count(*) filter (where not tq.correcte) / count(*))::int
      from public.tentative_question tq
      join public.tentative t on t.id = tq.tentative_id
      join public.inscription_classe i on i.eleve_id = t.eleve_id and i.classe_id = p_classe
      join public.question q on q.id = tq.question_id
      join public.chapitre c on c.id = q.chapitre_id
      left join public.question_corrige qc on qc.question_id = q.id
     where t.cours_id = p_cours and t.statut <> 'en_cours' and tq.correcte is not null
       and not prive.consentement_requis(t.eleve_id)
     group by q.id, c.titre, q.type, q.enonce, q.propositions, qc.bonnes_reponses, qc.reponses_acceptees
    having count(*) >= 5 and count(distinct t.eleve_id) >= 3 and count(*) filter (where not tq.correcte) > 0
     order by count(*) filter (where not tq.correcte)::numeric / count(*) desc, count(*) desc, q.id
     limit greatest(coalesce(p_limite, 10), 0);
end $$;

-- Corps de 20261215000002_dette_notifications.sql + aucun rappel pour un élève sans accord (cinq types).
create or replace function prive.planifier_notifications(p_maintenant timestamptz) returns int
language plpgsql set search_path = '' as $$
declare
  v_de constant timestamptz := p_maintenant - interval '5 minutes';
  v_a constant timestamptz := p_maintenant + interval '15 minutes';
  v_jour date := (p_maintenant at time zone 'Europe/Paris')::date;
  v_matin timestamptz := (v_jour + time '07:30') at time zone 'Europe/Paris';
  v_soir timestamptz := (v_jour + time '17:00') at time zone 'Europe/Paris';
  v_debut_jour timestamptz := v_jour::timestamp at time zone 'Europe/Paris';
  v_fin_jour timestamptz := (v_jour + 1)::timestamp at time zone 'Europe/Paris';
  v_total int := 0;
  v_n int;
begin
  -- 1. Rappels avant les occurrences d'événements.
  insert into public.notification_planifiee (eleve_id, type, cle, evenement_id, titre, corps, url, envoi_prevu)
  select e.eleve_id, 'rappel_evenement', 'rappel:' || e.id || ':' || extract(epoch from o.debut)::bigint || ':' || e.delai_rappel_minutes, e.id,
         left(e.titre, 120),
         'Le ' || to_char(o.debut at time zone 'Europe/Paris', 'FMDD/MM') || ' à ' || to_char(o.debut at time zone 'Europe/Paris', 'FMHH24" h "MI'),
         '/calendrier/' || e.id,
         o.debut - make_interval(mins => e.delai_rappel_minutes)
    from (select distinct ev.eleve_id from public.evenement ev where ev.delai_rappel_minutes is not null) x
    join public.profil p on p.id = x.eleve_id and p.role = 'eleve' and not prive.consentement_requis(p.id)
    left join public.preferences_notification pr on pr.eleve_id = x.eleve_id
    cross join lateral prive.occurrences(x.eleve_id, v_de, v_a + interval '1 day') o
    join public.evenement e on e.id = o.evenement_id and e.delai_rappel_minutes is not null
   where coalesce(pr.rappel_evenement, true)
     and o.debut - make_interval(mins => e.delai_rappel_minutes) >= v_de
     and o.debut - make_interval(mins => e.delai_rappel_minutes) < v_a
  on conflict (eleve_id, cle) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  -- 2. Échéance d'évaluation qui approche : 24 h avant la date limite (ou à l'ouverture), cours non validé.
  insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
  select i.eleve_id, 'echeance_proche',
         'echeance:' || ee.classe_id || ':' || ee.cours_id || ':' || extract(epoch from ee.limite)::bigint,
         left('Évaluation ' || c.titre, 120),
         'Elle ferme le ' || to_char(ee.limite at time zone 'Europe/Paris', 'FMDD/MM') || ' à ' || to_char(ee.limite at time zone 'Europe/Paris', 'FMHH24" h "MI'),
         '/cours/' || c.slug || '/evaluation',
         q.quand
    from public.inscription_classe i
    join public.profil p on p.id = i.eleve_id and p.role = 'eleve' and not prive.consentement_requis(p.id)
    join public.echeance_evaluation ee on ee.classe_id = i.classe_id and ee.limite is not null
    -- L'alerte part 24 h avant la date limite, ou à l'ouverture de l'évaluation si elle ouvre plus tard.
    cross join lateral (select greatest(ee.limite - interval '24 hours', coalesce(ee.ouverture, '-infinity'::timestamptz)) as quand) q
    join public.cours c on c.id = ee.cours_id and c.publie
    left join public.progression_cours pc on pc.eleve_id = i.eleve_id and pc.cours_id = ee.cours_id
    left join public.preferences_notification pr on pr.eleve_id = i.eleve_id
   where coalesce(pr.echeance_proche, true)
     and not coalesce(pc.valide, false)
     and q.quand >= v_de
     and q.quand < v_a
  on conflict (eleve_id, cle) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  -- 3. Nouvel essai : 24 h après le dernier essai raté, s'il en reste un.
  insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
  select t.eleve_id, 'nouvel_essai', 'essai:' || t.id,
         left('Évaluation ' || c.titre, 120), 'Tu peux retenter ton évaluation',
         '/cours/' || c.slug || '/evaluation', t.fin + interval '24 hours'
    from public.tentative t
    join public.profil p on p.id = t.eleve_id and p.role = 'eleve' and not prive.consentement_requis(p.id)
    join public.cours c on c.id = t.cours_id and c.publie
    left join public.progression_cours pc on pc.eleve_id = t.eleve_id and pc.cours_id = t.cours_id
    left join public.preferences_notification pr on pr.eleve_id = t.eleve_id
   where t.type = 'evaluation_cours' and t.fin is not null and not coalesce(t.reussie, false)
     and coalesce(pr.nouvel_essai, true)
     and not coalesce(pc.valide, false)
     and not exists (select 1 from public.inscription_classe ic
                       join public.echeance_evaluation ev on ev.classe_id = ic.classe_id and ev.cours_id = t.cours_id
                      where ic.eleve_id = t.eleve_id and ev.limite is not null and ev.limite <= t.fin + interval '24 hours')
     and not exists (select 1 from public.tentative te
                      where te.eleve_id = t.eleve_id and te.cours_id = t.cours_id
                        and te.type = 'evaluation_cours' and te.statut = 'en_cours')
     and t.fin + interval '24 hours' >= v_de
     and t.fin + interval '24 hours' < v_a
     and t.fin = (select max(t2.fin) from public.tentative t2
                   where t2.eleve_id = t.eleve_id and t2.cours_id = t.cours_id and t2.type = 'evaluation_cours')
     and (select count(*) from public.tentative t3
           where t3.eleve_id = t.eleve_id and t3.cours_id = t.cours_id and t3.type = 'evaluation_cours') < 3
  on conflict (eleve_id, cle) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  -- 4. Séances de révision du jour, à 7 h 30.
  if v_matin >= v_de and v_matin < v_a then
    insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
    select x.eleve_id, 'revision_du_jour', 'jour:' || v_jour, 'Révisions du jour',
           case when s.n = 1 then '1 séance prévue aujourd’hui' else s.n || ' séances prévues aujourd’hui' end,
           '/calendrier?vue=jour&date=' || v_jour, v_matin
      from (select distinct ev.eleve_id from public.evenement ev where ev.type = 'revision') x
      join public.profil p on p.id = x.eleve_id and p.role = 'eleve' and not prive.consentement_requis(p.id)
      left join public.preferences_notification pr on pr.eleve_id = x.eleve_id
      cross join lateral (
        select count(*)::int as n
          from prive.occurrences(x.eleve_id, v_debut_jour, v_fin_jour) o
          join public.evenement e on e.id = o.evenement_id and e.type = 'revision'
         where o.debut >= v_debut_jour and o.debut < v_fin_jour) s
     where coalesce(pr.revision_du_jour, true) and s.n > 0
    on conflict (eleve_id, cle) do nothing;
    get diagnostics v_n = row_count; v_total := v_total + v_n;
  end if;

  -- 5. Relance d'inactivité, à 17 h, au plus une par période de N jours.
  if v_soir >= v_de and v_soir < v_a then
    insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
    select p.id, 'inactivite', 'inactivite:' || v_jour, 'On reprend',
           'Une petite révision de 10 minutes, ça te dit', '/', v_soir
      from public.profil p
      left join public.preferences_notification pr on pr.eleve_id = p.id
      cross join lateral (select greatest(p.inscrit_le, (select max(t.debut) from public.tentative t where t.eleve_id = p.id)) as dernier) a
     where p.role = 'eleve' and not prive.consentement_requis(p.id) and p.onboarding_termine and not p.demande_enseignant
       and coalesce(pr.inactivite, true)
       and a.dernier < v_soir - make_interval(days => coalesce(pr.jours_inactivite, 3))
       and (select count(*) from public.notification_planifiee n3
             where n3.eleve_id = p.id and n3.type = 'inactivite' and n3.envoi_prevu > a.dernier) < 3
       and not exists (select 1 from public.notification_planifiee n
                        where n.eleve_id = p.id and n.type = 'inactivite'
                          and n.envoi_prevu > v_soir - make_interval(days => coalesce(pr.jours_inactivite, 3)))
    on conflict (eleve_id, cle) do nothing;
    get diagnostics v_n = row_count; v_total := v_total + v_n;
  end if;

  return v_total;
end $$;

-- Corps de 20261201000006_pagination.sql + rien pour un élève sans accord (le jeton reste valable si le retrait est annulé).
create or replace function public.calendrier_ical(p_jeton text)
returns table (uid text, titre text, debut timestamptz, fin timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_eleve uuid;
begin
  if p_jeton is null or p_jeton !~ '^[A-Za-z0-9_-]{43}$' then
    raise exception 'jeton_inconnu';
  end if;
  select j.eleve_id into v_eleve from prive.jeton_ical j where j.empreinte = extensions.digest(p_jeton, 'sha256');
  if v_eleve is null then
    raise exception 'jeton_inconnu';
  end if;
  return query
    select * from (
      select o.evenement_id::text || '-' || to_char(o.debut at time zone 'UTC', 'YYYYMMDD"T"HH24MISS"Z"'), e.titre, o.debut, o.fin
        from prive.occurrences(v_eleve, now() - interval '30 days', now() + interval '365 days') o
        join public.evenement e on e.id = o.evenement_id
      union all
      select x.cle, x.titre, x.instant, x.instant
        from prive.echeances_eleve(v_eleve, now() - interval '30 days', now() + interval '365 days') x
    ) t
    where not prive.consentement_requis(v_eleve)
    order by 3, 1
    limit 5000;
end $$;
