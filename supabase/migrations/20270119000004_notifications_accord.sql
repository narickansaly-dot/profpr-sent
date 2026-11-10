-- Une notification déjà planifiée n'est plus envoyée si l'élève de moins de 15 ans n'a plus d'accord valable (audit I1).
-- envoi_reserver retire les notifications que cette fonction rejette. Corps de 20261215000002_dette_notifications.sql + la condition d'accord.
-- Signature inchangée : create or replace conserve les droits.
create or replace function prive.notification_encore_valide(n public.notification_planifiee) returns boolean
language sql stable set search_path = '' as $$
  select not prive.consentement_requis(n.eleve_id) and (case n.type
    -- Rappel : l'occurrence (instant dans la clé « rappel:<id>:<epoch>:<délai> ») n'a pas encore commencé.
    when 'rappel_evenement' then coalesce(
      case when split_part(n.cle, ':', 3) ~ '^[0-9]{1,12}$' then to_timestamp(split_part(n.cle, ':', 3)::bigint) > now() end, true)
      -- ... et l'événement garde le délai de rappel de la clé (clé mal formée : tolérée).
      and (n.evenement_id is null or split_part(n.cle, ':', 4) !~ '^[0-9]+$'
           or exists (select 1 from public.evenement e
                       where e.id = n.evenement_id and e.delai_rappel_minutes::text = split_part(n.cle, ':', 4)))
    -- Échéance : la même date limite existe toujours, l'élève est toujours inscrit, le cours n'est pas validé.
    when 'echeance_proche' then exists (
      select 1 from public.echeance_evaluation ee
        join public.inscription_classe i on i.classe_id = ee.classe_id and i.eleve_id = n.eleve_id
       where ee.classe_id::text = split_part(n.cle, ':', 2) and ee.cours_id::text = split_part(n.cle, ':', 3)
         and extract(epoch from ee.limite)::bigint::text = split_part(n.cle, ':', 4)
         -- Pas après la fermeture, ni avant une ouverture repoussée.
         and ee.limite > now() and (ee.ouverture is null or ee.ouverture <= now()))
      and not exists (
      select 1 from public.progression_cours pc
       where pc.eleve_id = n.eleve_id and pc.cours_id::text = split_part(n.cle, ':', 3) and pc.valide)
    -- Nouvel essai : le cours de l'URL /cours/<slug>/evaluation n'est pas validé.
    when 'nouvel_essai' then not exists (
      select 1 from public.progression_cours pc join public.cours c on c.id = pc.cours_id
       where pc.eleve_id = n.eleve_id and pc.valide and n.url = '/cours/' || c.slug || '/evaluation')
    -- Inactivité : aucune tentative commencée depuis la création de la notification.
    when 'inactivite' then not exists (
      select 1 from public.tentative t where t.eleve_id = n.eleve_id and t.debut > n.cree_le)
    else true
  end)
$$;
