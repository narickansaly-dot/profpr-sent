-- Étape 3b : un seul chemin d'écriture des questions (éditeur, import, script) avec validation et versionnage.

create function prive.exiger_admin() returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'admin_contenu' then
    raise exception 'acces_refuse';
  end if;
end $$;

-- Vérifie la forme d'une question avant écriture (la même que src/lib/contenu/format-import.ts).
create function prive.valider_question(p jsonb) returns void
language plpgsql immutable set search_path = '' as $$
declare
  v_type text := p->>'type';
  v_props jsonb := coalesce(p->'propositions', '[]'::jsonb);
  v_bonnes jsonb := coalesce(p->'bonnes_reponses', '[]'::jsonb);
  v_acceptees jsonb := coalesce(p->'reponses_acceptees', '[]'::jsonb);
  v_n int;
begin
  if jsonb_typeof(p) <> 'object'
     or v_type is null or v_type not in ('qcm_unique', 'qcm_multiple', 'vrai_faux', 'reponse_courte')
     or char_length(btrim(coalesce(p->>'enonce', ''))) not between 1 and 2000
     or coalesce(p->>'statut', 'brouillon') not in ('brouillon', 'a_relire', 'valide')
     or coalesce(p->>'difficulte', '2') !~ '^[1-3]$'
     or char_length(coalesce(p->>'explication', '')) > 4000
     or char_length(coalesce(p->>'notion', '')) > 120
     or char_length(coalesce(p->>'source', '')) > 120
     or jsonb_typeof(v_props) <> 'array' or jsonb_typeof(v_bonnes) <> 'array' or jsonb_typeof(v_acceptees) <> 'array'
     or coalesce(p->>'marge', '0') !~ '^\d+(\.\d+)?$'
     or coalesce(p->>'marge_relative', 'false') not in ('true', 'false')
  then
    raise exception 'question_invalide';
  end if;
  v_n := jsonb_array_length(v_props);
  if v_type in ('qcm_unique', 'qcm_multiple') then
    if v_n not between 2 and 10
       or exists (select 1 from jsonb_array_elements(v_props) e
                   where jsonb_typeof(e) <> 'string' or char_length(btrim(e #>> '{}')) not between 1 and 500)
       or exists (select 1 from jsonb_array_elements(v_bonnes) e
                   where case when jsonb_typeof(e) = 'number' and (e #>> '{}') ~ '^\d{1,9}$'
                              then (e #>> '{}')::int >= v_n else true end)
       or (select count(distinct e) from jsonb_array_elements(v_bonnes) e) <> jsonb_array_length(v_bonnes)
       or (v_type = 'qcm_unique' and jsonb_array_length(v_bonnes) <> 1)
       or (v_type = 'qcm_multiple' and jsonb_array_length(v_bonnes) < 1)
       or jsonb_array_length(v_acceptees) <> 0
    then
      raise exception 'question_invalide';
    end if;
  elsif v_type = 'vrai_faux' then
    if v_n <> 0 or jsonb_array_length(v_bonnes) <> 1 or jsonb_typeof(v_bonnes->0) <> 'boolean'
       or jsonb_array_length(v_acceptees) <> 0 then
      raise exception 'question_invalide';
    end if;
  else
    if v_n <> 0 or jsonb_array_length(v_bonnes) <> 0 or jsonb_array_length(v_acceptees) not between 1 and 20
       or exists (select 1 from jsonb_array_elements(v_acceptees) e
                   where jsonb_typeof(e) <> 'string' or char_length(btrim(e #>> '{}')) not between 1 and 200)
       or (coalesce((p->>'marge_relative')::boolean, false) and p->>'marge' is null)
    then
      raise exception 'question_invalide';
    end if;
  end if;
exception
  -- Filet : un cast inattendu sur une charge malformée reste une question invalide, jamais une erreur brute.
  when invalid_text_representation or numeric_value_out_of_range or invalid_parameter_value then
    raise exception 'question_invalide';
end $$;

-- Écrit une question. Crée, modifie en place, ou versionne si la structure d'une question déjà tirée change :
-- l'ancienne passe à « archivee » (les corrections passées restent exactes) et la nouvelle porte version_de.
create function prive.ecrire_question(p_chapitre uuid, p_question uuid, p jsonb, out id_question uuid, out resultat text)
language plpgsql security definer set search_path = '' as $$
declare
  v_ancienne public.question;
  v_corrige public.question_corrige;
  v_type public.type_question_t;
  v_props jsonb := coalesce(p->'propositions', '[]'::jsonb);
  v_bonnes jsonb := coalesce(p->'bonnes_reponses', '[]'::jsonb);
  v_acceptees text[];
  v_marge numeric;
  v_relative boolean;
  v_statut public.statut_question_t;
  v_difficulte smallint;
  v_enonce text := btrim(p->>'enonce');
  v_explication text := coalesce(p->>'explication', '');
  v_source text := nullif(btrim(p->>'source'), '');
  v_notion uuid;
  v_structure boolean;
begin
  perform prive.valider_question(p);
  -- Les casts viennent après la validation (un initialiseur de declare s'évaluerait avant elle).
  v_type := (p->>'type')::public.type_question_t;
  v_marge := (p->>'marge')::numeric;
  v_relative := coalesce((p->>'marge_relative')::boolean, false);
  v_statut := coalesce(p->>'statut', 'brouillon')::public.statut_question_t;
  v_difficulte := coalesce((p->>'difficulte')::smallint, 2);
  select coalesce(array_agg(btrim(x)), '{}') into v_acceptees
    from jsonb_array_elements_text(coalesce(p->'reponses_acceptees', '[]'::jsonb)) x;
  if not exists (select 1 from public.chapitre c where c.id = p_chapitre) then
    raise exception 'chapitre_introuvable';
  end if;
  if nullif(btrim(p->>'notion'), '') is not null then
    insert into public.notion as n (chapitre_id, nom) values (p_chapitre, btrim(p->>'notion'))
      on conflict (chapitre_id, nom) do update set nom = excluded.nom
      returning n.id into v_notion;
  end if;

  if p_question is not null then
    select * into v_ancienne from public.question q where q.id = p_question for update;
    if not found then
      raise exception 'question_introuvable';
    end if;
  elsif v_source is not null then
    select * into v_ancienne from public.question q where q.source = v_source for update;
  end if;

  if v_ancienne.id is null then
    insert into public.question as q (chapitre_id, notion_id, type, enonce, propositions, difficulte, statut, source)
      values (p_chapitre, v_notion, v_type, v_enonce, v_props, v_difficulte, v_statut, v_source)
      returning q.id into id_question;
    insert into public.question_corrige (question_id, bonnes_reponses, reponses_acceptees, marge, marge_relative, explication)
      values (id_question, v_bonnes, v_acceptees, v_marge, v_relative, v_explication);
    resultat := 'cree';
    return;
  end if;

  if v_ancienne.chapitre_id <> p_chapitre then
    raise exception 'question_autre_chapitre';
  end if;
  if v_ancienne.statut = 'archivee' then
    raise exception 'question_archivee';
  end if;
  select * into v_corrige from public.question_corrige c where c.question_id = v_ancienne.id;
  v_structure := v_ancienne.type <> v_type
    or v_ancienne.propositions <> v_props
    or v_corrige.bonnes_reponses is distinct from v_bonnes
    or v_corrige.reponses_acceptees is distinct from v_acceptees
    or v_corrige.marge is distinct from v_marge
    or v_corrige.marge_relative is distinct from v_relative;

  if v_structure and exists (select 1 from public.tentative_question tq where tq.question_id = v_ancienne.id) then
    update public.question q set statut = 'archivee', source = null where q.id = v_ancienne.id;
    insert into public.question as q (chapitre_id, notion_id, type, enonce, propositions, difficulte, statut, source, version_de)
      values (p_chapitre, v_notion, v_type, v_enonce, v_props, v_difficulte, v_statut,
              coalesce(v_source, v_ancienne.source), v_ancienne.id)
      returning q.id into id_question;
    insert into public.question_corrige (question_id, bonnes_reponses, reponses_acceptees, marge, marge_relative, explication)
      values (id_question, v_bonnes, v_acceptees, v_marge, v_relative, v_explication);
    update public.signalement s set question_id = id_question where s.question_id = v_ancienne.id and s.statut = 'ouvert';
    resultat := 'versionnee';
    return;
  end if;

  id_question := v_ancienne.id;
  if not v_structure
     and v_ancienne.enonce = v_enonce and v_ancienne.notion_id is not distinct from v_notion
     and v_ancienne.difficulte = v_difficulte and v_ancienne.statut = v_statut
     and v_corrige.explication = v_explication
     and v_ancienne.source is not distinct from coalesce(v_source, v_ancienne.source) then
    resultat := 'inchangee';
    return;
  end if;
  update public.question q
     set notion_id = v_notion, type = v_type, enonce = v_enonce, propositions = v_props,
         difficulte = v_difficulte, statut = v_statut, source = coalesce(v_source, q.source)
   where q.id = v_ancienne.id;
  update public.question_corrige c
     set bonnes_reponses = v_bonnes, reponses_acceptees = v_acceptees, marge = v_marge,
         marge_relative = v_relative, explication = v_explication
   where c.question_id = v_ancienne.id;
  resultat := 'modifiee';
end $$;

create function public.enregistrer_question(p_chapitre uuid, p_question uuid, p_donnees jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  perform prive.exiger_admin();
  select e.id_question into v_id from prive.ecrire_question(p_chapitre, p_question, p_donnees) e;
  return v_id;
end $$;

-- Ordre des statuts : brouillon → a_relire → valide ; retour possible vers a_relire ou brouillon.
create function public.changer_statut_question(p_question uuid, p_statut public.statut_question_t) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_actuel public.statut_question_t;
begin
  perform prive.exiger_admin();
  select q.statut into v_actuel from public.question q where q.id = p_question for update;
  if not found then
    raise exception 'question_introuvable';
  end if;
  if v_actuel = 'archivee' or p_statut = 'archivee'
     or (p_statut = 'valide' and v_actuel <> 'a_relire')
     or (p_statut = 'a_relire' and v_actuel not in ('brouillon', 'valide'))
     or (p_statut = 'brouillon' and v_actuel not in ('a_relire', 'valide')) then
    raise exception 'transition_invalide';
  end if;
  update public.question q set statut = p_statut where q.id = p_question;
  if p_statut = 'valide' then
    update public.signalement s set statut = 'traite', traite_le = now(), traite_par = auth.uid()
     where s.question_id = p_question and s.statut = 'ouvert';
  end if;
end $$;

-- Une question déjà tirée ne se supprime pas : ses corrections en dépendent (archiver en la modifiant, ou la repasser en brouillon).
create function public.supprimer_question(p_question uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.exiger_admin();
  if exists (select 1 from public.tentative_question tq where tq.question_id = p_question) then
    raise exception 'question_utilisee';
  end if;
  delete from public.question q where q.id = p_question;
  if not found then
    raise exception 'question_introuvable';
  end if;
end $$;

-- Lecture admin d'un chapitre (énoncés et corrigés). Zéro ligne pour un non-admin.
create function public.questions_chapitre_admin(p_chapitre uuid)
returns table (id uuid, source text, type public.type_question_t, statut public.statut_question_t, difficulte smallint,
               notion text, enonce text, propositions jsonb, bonnes_reponses jsonb, reponses_acceptees text[],
               marge numeric, marge_relative boolean, explication text, version_de uuid, utilisee boolean,
               signalements_ouverts int, modifie_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select q.id, q.source, q.type, q.statut, q.difficulte, n.nom, q.enonce, q.propositions,
         c.bonnes_reponses, c.reponses_acceptees, c.marge, c.marge_relative, c.explication, q.version_de,
         exists (select 1 from public.tentative_question tq where tq.question_id = q.id),
         (select count(*)::int from public.signalement s where s.question_id = q.id and s.statut = 'ouvert'),
         q.modifie_le
    from public.question q
    join public.question_corrige c on c.question_id = q.id
    left join public.notion n on n.id = q.notion_id
   where q.chapitre_id = p_chapitre and q.statut <> 'archivee'
     and public.role_actuel() = 'admin_contenu'
   order by q.cree_le, q.id
$$;

create function public.notions_chapitre(p_chapitre uuid) returns setof text
language sql stable security definer set search_path = '' as $$
  select n.nom from public.notion n
   where n.chapitre_id = p_chapitre and public.role_actuel() = 'admin_contenu'
   order by n.nom
$$;

revoke execute on function prive.exiger_admin(), prive.valider_question(jsonb),
  prive.ecrire_question(uuid, uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.enregistrer_question(uuid, uuid, jsonb), public.changer_statut_question(uuid, public.statut_question_t),
  public.supprimer_question(uuid), public.questions_chapitre_admin(uuid), public.notions_chapitre(uuid) from public, anon;
grant execute on function public.enregistrer_question(uuid, uuid, jsonb), public.changer_statut_question(uuid, public.statut_question_t),
  public.supprimer_question(uuid), public.questions_chapitre_admin(uuid), public.notions_chapitre(uuid) to authenticated;
