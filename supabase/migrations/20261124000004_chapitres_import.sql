-- Étape 3b : écriture des cours et chapitres, import transactionnel, tableau de suivi.

create function prive.valider_chapitre(p jsonb) returns void
language plpgsql immutable set search_path = '' as $$
begin
  if jsonb_typeof(p) <> 'object'
     or coalesce(p->>'slug', '') !~ '^[a-z0-9-]{1,80}$'
     or coalesce(p->>'numero', '') !~ '^[1-9][0-9]?$'
     or char_length(btrim(coalesce(p->>'titre', ''))) not between 1 and 200
     or char_length(coalesce(p->>'titre_court', '')) > 80
     or char_length(coalesce(p->>'duree', '')) > 40
     or char_length(coalesce(p->>'resume', '')) > 1000
     or char_length(coalesce(p->>'chapeau', '')) > 4000
     or char_length(coalesce(p->>'a_retenir', '')) > 50000
     or jsonb_typeof(coalesce(p->'objectifs', '[]'::jsonb)) <> 'array'
     or exists (select 1 from jsonb_array_elements(coalesce(p->'objectifs', '[]'::jsonb)) o
                 where jsonb_typeof(o) <> 'string' or char_length(o #>> '{}') > 300)
     or jsonb_typeof(coalesce(p->'sections', 'null'::jsonb)) <> 'array'
     or jsonb_array_length(p->'sections') > 40
     or exists (select 1 from jsonb_array_elements(p->'sections') s
                 where jsonb_typeof(s) <> 'object'
                    -- Même motif que nettoyerHtml (MOTIF_ID) ; « a-retenir » est réservé au bloc « Je retiens ».
                    or coalesce(s->>'id', '') !~ '^[a-z][a-z0-9-]{0,63}$'
                    or s->>'id' = 'a-retenir'
                    or char_length(btrim(coalesce(s->>'titre', ''))) not between 1 and 200
                    or jsonb_typeof(s->'html') <> 'string'
                    or char_length(s->>'html') > 200000)
     or (select count(distinct s->>'id') from jsonb_array_elements(p->'sections') s) <> jsonb_array_length(p->'sections')
  then
    raise exception 'chapitre_invalide';
  end if;
exception
  -- Filet : l'ordre d'évaluation des « or » n'est pas garanti, un type inattendu reste un chapitre invalide.
  when invalid_text_representation or numeric_value_out_of_range or invalid_parameter_value then
    raise exception 'chapitre_invalide';
end $$;

-- Crée (p_chapitre null : par slug dans le cours) ou modifie un chapitre. Un chapitre ne change jamais de cours.
-- Un réimport ne dépublie jamais : publie = ancien publie or p_publier.
create function prive.ecrire_chapitre(p_cours uuid, p_chapitre uuid, p jsonb, p_publier boolean) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_objectifs text[];
begin
  perform prive.valider_chapitre(p);
  select coalesce(array_agg(o), '{}') into v_objectifs from jsonb_array_elements_text(coalesce(p->'objectifs', '[]'::jsonb)) o;
  begin
    if p_chapitre is null then
      insert into public.chapitre as c (cours_id, slug, numero, titre, titre_court, duree, resume, chapeau, objectifs, sections, a_retenir, publie)
        values (p_cours, p->>'slug', (p->>'numero')::smallint, btrim(p->>'titre'), nullif(p->>'titre_court', ''),
                nullif(p->>'duree', ''), nullif(p->>'resume', ''), nullif(p->>'chapeau', ''), v_objectifs,
                p->'sections', nullif(p->>'a_retenir', ''), p_publier)
      on conflict (cours_id, slug) do update set
        numero = excluded.numero, titre = excluded.titre, titre_court = excluded.titre_court, duree = excluded.duree,
        resume = excluded.resume, chapeau = excluded.chapeau, objectifs = excluded.objectifs,
        sections = excluded.sections, a_retenir = excluded.a_retenir, publie = c.publie or p_publier
      returning c.id into v_id;
    else
      update public.chapitre c set
        slug = p->>'slug', numero = (p->>'numero')::smallint, titre = btrim(p->>'titre'),
        titre_court = nullif(p->>'titre_court', ''), duree = nullif(p->>'duree', ''), resume = nullif(p->>'resume', ''),
        chapeau = nullif(p->>'chapeau', ''), objectifs = v_objectifs, sections = p->'sections',
        a_retenir = nullif(p->>'a_retenir', '')
       where c.id = p_chapitre and c.cours_id = p_cours
       returning c.id into v_id;
      if v_id is null then
        raise exception 'chapitre_introuvable';
      end if;
    end if;
  exception when unique_violation then
    raise exception 'slug_deja_pris';
  end;
  return v_id;
end $$;

create function public.enregistrer_chapitre(p_cours uuid, p_chapitre uuid, p_donnees jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.exiger_admin();
  if not exists (select 1 from public.cours c where c.id = p_cours) then
    raise exception 'cours_introuvable';
  end if;
  perform prive.valider_chapitre(p_donnees);
  -- L'éditeur ne crée jamais par écrasement : seul l'import réécrit un chapitre existant à partir de son slug.
  if p_chapitre is null and exists (select 1 from public.chapitre c where c.cours_id = p_cours and c.slug = p_donnees->>'slug') then
    raise exception 'slug_deja_pris';
  end if;
  if exists (select 1 from public.chapitre c
              where c.cours_id = p_cours and c.numero = (p_donnees->>'numero')::smallint
                and c.id is distinct from p_chapitre) then
    raise exception 'numero_deja_pris';
  end if;
  return prive.ecrire_chapitre(p_cours, p_chapitre, p_donnees, false);
end $$;

create function public.publier_chapitre(p_chapitre uuid, p_publie boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.exiger_admin();
  update public.chapitre c set publie = coalesce(p_publie, false) where c.id = p_chapitre;
  if not found then
    raise exception 'chapitre_introuvable';
  end if;
end $$;

create function public.enregistrer_cours(p_cours uuid, p_donnees jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_filiere uuid;
  v_id uuid;
begin
  perform prive.exiger_admin();
  if coalesce(p_donnees->>'slug', '') !~ '^[a-z0-9-]{1,80}$'
     or coalesce(p_donnees->>'niveau', '') not in ('2de', '1re', 'Tle')
     or char_length(btrim(coalesce(p_donnees->>'titre', ''))) not between 1 and 200
     or char_length(btrim(coalesce(p_donnees->>'matiere', ''))) not between 1 and 120
     or lower(coalesce(p_donnees->>'couleur', '#2563eb')) !~ '^#[0-9a-f]{6}$'
     or coalesce(p_donnees->>'ordre', '0') !~ '^\d{1,4}$' then
    raise exception 'cours_mal_forme';
  end if;
  select f.id into v_filiere from public.filiere f where f.code = p_donnees->>'filiere';
  if v_filiere is null then
    raise exception 'filiere_inconnue';
  end if;
  begin
    if p_cours is null then
      insert into public.cours as c (slug, filiere_id, niveau_code, matiere, titre, couleur, ordre)
        values (p_donnees->>'slug', v_filiere, p_donnees->>'niveau', btrim(p_donnees->>'matiere'), btrim(p_donnees->>'titre'),
                lower(coalesce(p_donnees->>'couleur', '#2563eb')), coalesce((p_donnees->>'ordre')::smallint, 0))
        returning c.id into v_id;
    else
      update public.cours c set slug = p_donnees->>'slug', filiere_id = v_filiere, niveau_code = p_donnees->>'niveau',
        matiere = btrim(p_donnees->>'matiere'), titre = btrim(p_donnees->>'titre'),
        couleur = lower(coalesce(p_donnees->>'couleur', '#2563eb')), ordre = coalesce((p_donnees->>'ordre')::smallint, 0)
       where c.id = p_cours returning c.id into v_id;
      if v_id is null then
        raise exception 'cours_introuvable';
      end if;
    end if;
  exception when unique_violation then
    raise exception 'slug_deja_pris';
  end;
  return v_id;
end $$;

create function public.publier_cours(p_cours uuid, p_publie boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.exiger_admin();
  update public.cours c set publie = coalesce(p_publie, false) where c.id = p_cours;
  if not found then
    raise exception 'cours_introuvable';
  end if;
end $$;

-- Import d'un cours complet (même format que contenu/1re-st2s/bph.json, HTML déjà nettoyé par l'appelant).
-- Une seule transaction : une erreur annule tout. Accepte l'admin (interface) ou la clé de service (script).
create function public.importer_cours(p_cours jsonb, p_publier boolean default false) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_cours uuid;
  v_filiere uuid;
  v_chapitre uuid;
  ch jsonb;
  q jsonb;
  r record;
  v_sources text[];
  v_chapitres uuid[] := '{}';
  v_slugs text[];
  v_bilan jsonb := '{"cree":0,"modifiee":0,"versionnee":0,"inchangee":0,"archivee":0,"supprimee":0}';
begin
  -- Un rôle nul (compte sans profil) est refusé : exiger_admin compare avec « is distinct from ».
  if (select auth.role()) is distinct from 'service_role' then
    perform prive.exiger_admin();
  end if;
  if jsonb_typeof(p_cours) is distinct from 'object'
     or coalesce(jsonb_typeof(p_cours->'chapitres'), '') <> 'array'
     or coalesce(p_cours->>'slug', '') !~ '^[a-z0-9-]{1,80}$'
     or coalesce(p_cours->>'niveau', '') not in ('2de', '1re', 'Tle')
     or char_length(btrim(coalesce(p_cours->>'titre', ''))) not between 1 and 200
     or char_length(btrim(coalesce(p_cours->>'matiere', ''))) not between 1 and 120
     or lower(coalesce(p_cours->>'couleur', '#2563eb')) !~ '^#[0-9a-f]{6}$' then
    raise exception 'import_invalide';
  end if;
  select f.id into v_filiere from public.filiere f where f.code = p_cours->>'filiere';
  if v_filiere is null then
    raise exception 'filiere_inconnue';
  end if;
  -- Structure du fichier, vérifiée avant toute écriture : chapitres et questions présents, objets, sans doublon.
  if jsonb_array_length(p_cours->'chapitres') = 0
     or exists (select 1 from jsonb_array_elements(p_cours->'chapitres') x
                 where jsonb_typeof(x) <> 'object' or coalesce(jsonb_typeof(x->'questions'), '') <> 'array') then
    raise exception 'import_invalide';
  end if;
  if exists (select 1 from jsonb_array_elements(p_cours->'chapitres') x, jsonb_array_elements(x->'questions') y
              where jsonb_typeof(y) <> 'object' or nullif(btrim(y->>'source'), '') is null) then
    raise exception 'import_invalide';
  end if;
  if (select count(distinct x->>'slug') from jsonb_array_elements(p_cours->'chapitres') x) <> jsonb_array_length(p_cours->'chapitres')
     or (select count(distinct x->>'numero') from jsonb_array_elements(p_cours->'chapitres') x) <> jsonb_array_length(p_cours->'chapitres')
     or (select count(distinct btrim(y->>'source')) from jsonb_array_elements(p_cours->'chapitres') x,
                jsonb_array_elements(x->'questions') y)
        <> (select count(*) from jsonb_array_elements(p_cours->'chapitres') x, jsonb_array_elements(x->'questions') y) then
    raise exception 'import_invalide';
  end if;
  -- Un chapitre absent du fichier (conservé) garde son numéro : un chapitre du fichier ne peut pas le reprendre.
  if exists (select 1 from public.chapitre c join public.cours co on co.id = c.cours_id
              where co.slug = p_cours->>'slug'
                and not exists (select 1 from jsonb_array_elements(p_cours->'chapitres') x where x->>'slug' = c.slug)
                and exists (select 1 from jsonb_array_elements(p_cours->'chapitres') x where x->>'numero' = c.numero::text)) then
    raise exception 'numero_deja_pris';
  end if;
  insert into public.cours as c (slug, filiere_id, niveau_code, matiere, titre, couleur, publie)
    values (p_cours->>'slug', v_filiere, p_cours->>'niveau', btrim(p_cours->>'matiere'), btrim(p_cours->>'titre'),
            lower(coalesce(p_cours->>'couleur', '#2563eb')), coalesce(p_publier, false))
  on conflict (slug) do update set filiere_id = excluded.filiere_id, niveau_code = excluded.niveau_code,
    matiere = excluded.matiere, titre = excluded.titre, couleur = excluded.couleur, publie = c.publie or excluded.publie
  returning c.id into v_cours;

  for ch in select * from jsonb_array_elements(p_cours->'chapitres') loop
    v_chapitre := prive.ecrire_chapitre(v_cours, null, ch, coalesce(p_publier, false));
    v_chapitres := v_chapitres || v_chapitre;
    for q in select * from jsonb_array_elements(ch->'questions') loop
      select * into r from prive.ecrire_question(v_chapitre, null, q);
      v_bilan := jsonb_set(v_bilan, array[r.resultat], to_jsonb((v_bilan->>r.resultat)::int + 1));
    end loop;
  end loop;

  -- Questions venues d'un import précédent et retirées du fichier : archivées si déjà tirées ou signalées (le
  -- signalement ouvert reste visible et à traiter), sinon supprimées.
  -- Le nettoyage vient après tous les chapitres et porte sur toutes les sources du fichier : une source déplacée
  -- vers un autre chapitre est donc refusée (question_autre_chapitre) quel que soit l'ordre des chapitres.
  -- Les questions créées dans l'éditeur (source nulle) ne sont jamais touchées.
  select coalesce(array_agg(btrim(y->>'source')), '{}') into v_sources
    from jsonb_array_elements(p_cours->'chapitres') x, jsonb_array_elements(x->'questions') y;
  for r in select q2.id, (exists (select 1 from public.tentative_question tq where tq.question_id = q2.id)
                          or exists (select 1 from public.historique_question hq where hq.question_id = q2.id)
                          or exists (select 1 from public.signalement s where s.question_id = q2.id and s.statut = 'ouvert')) as utilisee
             from public.question q2
            where q2.chapitre_id = any (v_chapitres) and q2.source is not null and q2.statut <> 'archivee'
              and not (q2.source = any (v_sources)) loop
    if r.utilisee then
      update public.question q3 set statut = 'archivee', source = null where q3.id = r.id;
      v_bilan := jsonb_set(v_bilan, '{archivee}', to_jsonb((v_bilan->>'archivee')::int + 1));
    else
      delete from public.question q3 where q3.id = r.id;
      v_bilan := jsonb_set(v_bilan, '{supprimee}', to_jsonb((v_bilan->>'supprimee')::int + 1));
    end if;
  end loop;

  select coalesce(array_agg(x->>'slug'), '{}') into v_slugs from jsonb_array_elements(p_cours->'chapitres') x;
  return v_bilan || jsonb_build_object(
    'cours_id', v_cours,
    'chapitres', jsonb_array_length(p_cours->'chapitres'),
    'chapitres_absents', coalesce((select jsonb_agg(c.slug order by c.numero) from public.chapitre c
                                    where c.cours_id = v_cours and not (c.slug = any (v_slugs))), '[]'::jsonb));
end $$;

-- Tableau de suivi des banques de questions (objectif : 150 validées par chapitre). Zéro ligne pour un non-admin.
create function public.suivi_contenu()
returns table (cours_id uuid, cours_slug text, cours_titre text, cours_publie boolean, chapitre_id uuid, numero smallint,
               chapitre_titre text, chapitre_publie boolean, valides int, a_relire int, brouillons int, signalements int)
language sql stable security definer set search_path = '' as $$
  select c.id, c.slug, c.titre, c.publie, ch.id, ch.numero, ch.titre, ch.publie,
         count(q.id) filter (where q.statut = 'valide')::int,
         count(q.id) filter (where q.statut = 'a_relire')::int,
         count(q.id) filter (where q.statut = 'brouillon')::int,
         (select count(*)::int from public.signalement s join public.question q2 on q2.id = s.question_id
           where q2.chapitre_id = ch.id and q2.statut <> 'archivee' and s.statut = 'ouvert')
    from public.cours c
    left join public.chapitre ch on ch.cours_id = c.id
    left join public.question q on q.chapitre_id = ch.id
   where public.role_actuel() = 'admin_contenu'
   group by c.id, ch.id
   order by c.ordre, c.titre, ch.numero
$$;

revoke execute on function prive.valider_chapitre(jsonb), prive.ecrire_chapitre(uuid, uuid, jsonb, boolean) from public, anon, authenticated;
revoke execute on function public.enregistrer_chapitre(uuid, uuid, jsonb), public.publier_chapitre(uuid, boolean),
  public.enregistrer_cours(uuid, jsonb), public.publier_cours(uuid, boolean), public.importer_cours(jsonb, boolean),
  public.suivi_contenu() from public, anon;
grant execute on function public.enregistrer_chapitre(uuid, uuid, jsonb), public.publier_chapitre(uuid, boolean),
  public.enregistrer_cours(uuid, jsonb), public.publier_cours(uuid, boolean), public.importer_cours(jsonb, boolean),
  public.suivi_contenu() to authenticated;
grant execute on function public.importer_cours(jsonb, boolean) to service_role;
