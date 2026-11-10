-- Étape 6a : option garder_statut de l'import. Une question validée garde son statut au réimport si sa structure
-- est inchangée ; si la structure change, la nouvelle version repart en a_relire.

create or replace function prive.ecrire_question(p_chapitre uuid, p_question uuid, p jsonb, p_editeur boolean default false,
                                      out id_question uuid, out resultat text)
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
  v_contrainte text;
  v_garder boolean := not p_editeur and coalesce((p->>'garder_statut')::boolean, false);
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
    if p_editeur then
      v_statut := 'brouillon';
    end if;
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
  if not p_editeur
     and exists (select 1 from public.signalement s where s.question_id = v_ancienne.id and s.statut = 'ouvert') then
    v_statut := v_ancienne.statut;
  end if;
  -- Réimport avec garder_statut : une question déjà validée garde son statut (le fichier ne la dégrade pas).
  if v_garder and v_ancienne.statut = 'valide' then
    v_statut := 'valide';
  end if;
  select * into v_corrige from public.question_corrige c where c.question_id = v_ancienne.id;
  v_structure := v_ancienne.type <> v_type
    or v_ancienne.propositions <> v_props
    or v_corrige.bonnes_reponses is distinct from v_bonnes
    or v_corrige.reponses_acceptees is distinct from v_acceptees
    or v_corrige.marge is distinct from v_marge
    or v_corrige.marge_relative is distinct from v_relative;

  if v_structure and (v_ancienne.statut = 'valide'
                      or exists (select 1 from public.tentative_question tq where tq.question_id = v_ancienne.id)) then
    if p_editeur then
      v_statut := case when v_ancienne.statut = 'valide' then 'a_relire' else v_ancienne.statut end;
    end if;
    -- Un changement de structure crée toujours une nouvelle version à relire, même avec garder_statut.
    if v_garder and v_statut = 'valide' then
      v_statut := 'a_relire';
    end if;
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
  if p_editeur then
    v_statut := v_ancienne.statut;
  end if;
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
exception
  when unique_violation then
    get stacked diagnostics v_contrainte = constraint_name;
    if v_contrainte = 'question_source_key' then
      raise exception 'source_deja_prise';
    end if;
    raise;
end $$;

revoke execute on function prive.ecrire_question(uuid, uuid, jsonb, boolean) from public, anon, authenticated;
