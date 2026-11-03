-- Données du tableau de bord : lues avec les droits de l'élève (RLS).

-- Points faibles de l'élève connecté. La RLS s'applique : le contenu retiré (non publié, essai terminé)
-- est volontairement absent. Un même chapitre_id peut figurer sur plusieurs lignes (une par notion) :
-- l'interface ne doit pas s'en servir comme clé unique.
create function public.points_faibles(p_limite int default 5)
returns table (chapitre_id uuid, cours_slug text, chapitre_slug text, libelle text, taux_erreur int, reponses int)
language sql stable set search_path = '' as $$
  select c.id, co.slug, c.slug, coalesce(n.nom, c.titre),
         round(100.0 * sum(h.ratee) / sum(h.vue))::int, sum(h.vue)::int
    from public.historique_question h
    join public.question q on q.id = h.question_id
    join public.chapitre c on c.id = q.chapitre_id
    join public.cours co on co.id = c.cours_id
    left join public.notion n on n.id = q.notion_id
   where h.eleve_id = (select auth.uid())
   group by c.id, co.slug, c.slug, c.titre, n.id, n.nom
  having sum(h.vue) >= 3 and sum(h.ratee) > 0
   order by sum(h.ratee)::numeric / sum(h.vue) desc, sum(h.vue) desc, coalesce(n.nom, c.titre), c.id
   limit greatest(coalesce(p_limite, 5), 0)
$$;

create function public.serie_jours() returns int
language sql stable set search_path = '' as $$
  with jours as (
    select distinct (fin at time zone 'Europe/Paris')::date as j
      from public.tentative
     where eleve_id = (select auth.uid()) and statut <> 'en_cours' and fin is not null
  ), groupes as (
    select j, j - (row_number() over (order by j))::int as g from jours
  ), series as (
    select max(j) as dernier, count(*)::int as longueur from groupes group by g
  )
  select coalesce((select longueur from series
                    where dernier >= (now() at time zone 'Europe/Paris')::date - 1
                    order by dernier desc limit 1), 0)
$$;

revoke execute on function public.points_faibles(int), public.serie_jours() from public, anon;
grant execute on function public.points_faibles(int), public.serie_jours() to authenticated;
