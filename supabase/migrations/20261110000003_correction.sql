-- Correction des réponses. Schéma prive : non exposé par l'API, appelé par les fonctions de quiz.

create extension if not exists unaccent with schema extensions;

create schema prive;
revoke all on schema prive from public, anon, authenticated;

create function prive.normaliser(p text) returns text
language sql stable set search_path = '' as $$
  -- Les guillemets français sont retirés avant unaccent (qui les changerait en << >>).
  -- Seule la ponctuation de phrase est retirée aux bords : + - % ° = < > restent significatifs (Na+, Cl-, 70 %).
  -- Un trait d'union entre deux caractères de mot devient un espace (chaînes comprises) ; un « - » final est conservé.
  select regexp_replace(
           regexp_replace(
             regexp_replace(
               regexp_replace(
                 lower(extensions.unaccent(translate(trim(coalesce(p, '')), '«»‹›', ''))),
                 '(\w)[-–—](?=\w)', '\1 ', 'g'),
               '\s+', ' ', 'g'),
             '[\s.!?;:,»"''’”)\]…]+$', ''),
           '^[\s«"''‘“(\[¿¡]+', '')
$$;

create function prive.en_nombre(p text) returns numeric
language plpgsql immutable set search_path = '' as $$
begin
  if p is null or trim(p) !~ '^[+-]?\d+([.,]\d+)?$' then
    return null;
  end if;
  return replace(trim(p), ',', '.')::numeric;
exception when others then
  return null;
end $$;

create function prive.corriger(p_question uuid, p_reponse jsonb) returns boolean
language plpgsql stable set search_path = '' as $$
declare
  q record;
  donne numeric;
  attendu numeric;
  acc text;
  tolerance numeric;
begin
  if p_reponse is null or jsonb_typeof(p_reponse) <> 'array' or jsonb_array_length(p_reponse) = 0 then
    return false;
  end if;
  select qu.type, c.bonnes_reponses, c.reponses_acceptees, c.marge, c.marge_relative into q
    from public.question qu join public.question_corrige c on c.question_id = qu.id
    where qu.id = p_question;
  if not found then
    return false;
  end if;

  case q.type
    when 'qcm_unique', 'vrai_faux' then
      return p_reponse = q.bonnes_reponses;
    when 'qcm_multiple' then
      return (select array_agg(distinct v order by v) from jsonb_array_elements_text(p_reponse) v)
           = (select array_agg(distinct v order by v) from jsonb_array_elements_text(q.bonnes_reponses) v);
    when 'reponse_courte' then
      if jsonb_typeof(p_reponse -> 0) <> 'string' then
        return false;
      end if;
      if exists (select 1 from unnest(q.reponses_acceptees) a
                 where prive.normaliser(a) = prive.normaliser(p_reponse ->> 0)) then
        return true;
      end if;
      donne := prive.en_nombre(p_reponse ->> 0);
      if donne is null then
        return false;
      end if;
      foreach acc in array q.reponses_acceptees loop
        attendu := prive.en_nombre(acc);
        if attendu is not null then
          tolerance := coalesce(q.marge, 0);
          if q.marge_relative then
            tolerance := tolerance * abs(attendu);
          end if;
          if abs(donne - attendu) <= tolerance then
            return true;
          end if;
        end if;
      end loop;
      return false;
  end case;
end $$;

create function prive.melanger(n int) returns smallint[]
language sql volatile set search_path = '' as $$
  select coalesce(array_agg(i::smallint order by random()), '{}') from generate_series(0, n - 1) as i
$$;

create function prive.vers_original(p_type public.type_question_t, p_permutation smallint[], p_reponse jsonb)
returns jsonb
language plpgsql immutable set search_path = '' as $$
declare
  n int := coalesce(array_length(p_permutation, 1), 0);
  v jsonb;
  idx int;
  resultat jsonb := '[]';
begin
  if p_reponse is null or p_reponse = '[]'::jsonb then
    return null;
  end if;
  if jsonb_typeof(p_reponse) <> 'array' then
    raise exception 'reponse_invalide';
  end if;
  case p_type
    when 'qcm_unique', 'qcm_multiple' then
      if p_type = 'qcm_unique' and jsonb_array_length(p_reponse) <> 1 then
        raise exception 'reponse_invalide';
      end if;
      for v in select * from jsonb_array_elements(p_reponse) loop
        if jsonb_typeof(v) <> 'number' or v::text !~ '^\d+$'
           or char_length(v::text) > 4 then
          raise exception 'reponse_invalide';
        end if;
        idx := v::text::int;
        if idx >= n or resultat @> jsonb_build_array(p_permutation[idx + 1]) then
          raise exception 'reponse_invalide';
        end if;
        resultat := resultat || jsonb_build_array(p_permutation[idx + 1]);
      end loop;
      return (select jsonb_agg(x order by x::text::int) from jsonb_array_elements(resultat) x);
    when 'vrai_faux' then
      if jsonb_array_length(p_reponse) <> 1 or jsonb_typeof(p_reponse -> 0) <> 'boolean' then
        raise exception 'reponse_invalide';
      end if;
      return p_reponse;
    when 'reponse_courte' then
      if jsonb_array_length(p_reponse) <> 1 or jsonb_typeof(p_reponse -> 0) <> 'string'
         or char_length(trim(p_reponse ->> 0)) not between 1 and 200 then
        raise exception 'reponse_invalide';
      end if;
      return jsonb_build_array(trim(p_reponse ->> 0));
  end case;
end $$;

create function prive.vers_affiche(p_type public.type_question_t, p_permutation smallint[], p_valeur jsonb)
returns jsonb
language sql immutable set search_path = '' as $$
  select case
    when p_valeur is null then null
    when p_type in ('qcm_unique', 'qcm_multiple') then
      (select coalesce(jsonb_agg(a.pos order by a.pos), '[]'::jsonb)
         from (select array_position(p_permutation, (v::text)::smallint) - 1 as pos
                 from jsonb_array_elements(p_valeur) v) a)
    else p_valeur
  end
$$;

create function prive.propositions_affichees(p_propositions jsonb, p_permutation smallint[]) returns jsonb
language sql immutable set search_path = '' as $$
  select coalesce(jsonb_agg(p_propositions -> (u.p)::int order by u.ord), '[]'::jsonb)
  from unnest(p_permutation) with ordinality as u(p, ord)
$$;

revoke execute on all functions in schema prive from public, anon, authenticated;

alter default privileges in schema prive revoke execute on functions from public;
