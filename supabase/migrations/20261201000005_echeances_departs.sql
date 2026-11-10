-- Classes quittées depuis moins de 30 jours : seules leurs échéances comptent encore.
-- Une classe quittée sans échéance n'ouvre plus la fenêtre d'évaluation (bilan de l'étape 3a).

create or replace function prive.fenetre_evaluation(p_eleve uuid, p_cours uuid) returns text
language sql stable set search_path = '' as $$
  with inscrites as (
    select i.classe_id from public.inscription_classe i where i.eleve_id = p_eleve
  ),
  classes as (
    select classe_id from inscrites
    union
    select d.classe_id from prive.depart_classe d where d.eleve_id = p_eleve and d.quitte_le > now() - interval '30 days'
  ),
  fenetres as (
    select e.ouverture, e.limite
      from classes k
      join public.echeance_evaluation e on e.classe_id = k.classe_id and e.cours_id = p_cours
  )
  select case
    when not exists (select 1 from fenetres) then 'ok'
    -- Une classe actuelle liée au cours sans échéance n'impose rien : la fenêtre est ouverte.
    -- Une classe quittée sans échéance ne compte pas.
    when exists (
      select 1 from inscrites k
        join public.classe_cours cc on cc.classe_id = k.classe_id and cc.cours_id = p_cours
       where not exists (select 1 from public.echeance_evaluation e where e.classe_id = k.classe_id and e.cours_id = p_cours)
    ) then 'ok'
    when exists (select 1 from fenetres where (ouverture is null or ouverture <= now()) and (limite is null or now() <= limite)) then 'ok'
    when exists (select 1 from fenetres where ouverture > now()) then 'pas_ouverte'
    else 'close'
  end
$$;

-- Le type de retour change (colonne quittee) : drop puis create.
drop function public.mes_echeances(uuid);
create function public.mes_echeances(p_cours uuid default null)
returns table (cours_id uuid, classe_nom text, ouverture timestamptz, limite timestamptz, quittee boolean)
language sql stable security definer set search_path = '' as $$
  -- Une ligne par classe actuelle liée au cours (dates nulles : pas d'échéance, fenêtre ouverte),
  -- plus les classes quittées depuis moins de 30 jours qui ont une échéance. Mêmes règles que prive.fenetre_evaluation.
  with classes as (
    select i.classe_id, false as quittee from public.inscription_classe i where i.eleve_id = auth.uid()
    union
    select d.classe_id, true from prive.depart_classe d where d.eleve_id = auth.uid() and d.quitte_le > now() - interval '30 days'
  )
  select cc.cours_id, c.nom, e.ouverture, e.limite, k.quittee
    from classes k
    join public.classe c on c.id = k.classe_id
    join public.classe_cours cc on cc.classe_id = k.classe_id
    left join public.echeance_evaluation e on e.classe_id = cc.classe_id and e.cours_id = cc.cours_id
   where (p_cours is null or cc.cours_id = p_cours)
     and (not k.quittee or e.classe_id is not null)
   order by e.limite nulls last, e.ouverture nulls first
$$;

revoke execute on function public.mes_echeances(uuid) from public, anon;
grant execute on function public.mes_echeances(uuid) to authenticated;
revoke execute on function prive.fenetre_evaluation(uuid, uuid) from public, anon, authenticated;
