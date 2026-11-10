-- Suivi par le parent (consentement, abonnement, progression), retrait du consentement, export et purge.

-- Corps de 20261222000002_consentement.sql + un accord retiré ne compte plus.
create or replace function prive.consentement_requis(p_eleve uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profil p
     where p.id = p_eleve and p.role = 'eleve' and p.moins_de_15_ans
       and not exists (select 1 from public.consentement_parental c
                        where c.eleve_id = p.id and c.donne_le is not null and c.retire_le is null))
$$;
revoke execute on function prive.consentement_requis(uuid) from public;

create function public.enfants_du_parent()
returns table (eleve_id uuid, nom text, niveau text, moins_de_15_ans boolean, consentement_donne_le timestamptz,
               consentement_retire_le timestamptz, retire_par_moi boolean, suppression_prevue_le timestamptz,
               origine text, lie_le timestamptz, abonnement jsonb)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if public.role_actuel() is distinct from 'parent' then
    raise exception 'pas_parent';
  end if;
  return query
    select p.id, coalesce(p.nom, '')::text, p.niveau_code::text, coalesce(p.moins_de_15_ans, false),
           c.donne_le, c.retire_le, coalesce(c.retire_par = auth.uid(), false),
           p.suppression_demandee_le + interval '30 days', l.origine, l.cree_le,
           (select jsonb_build_object('formule', a.formule, 'statut', a.statut, 'fin_periode', a.fin_periode,
                                      'fin_grace', a.fin_grace, 'actif', prive.abonnement_actif(p.id))
              from public.abonnement a where a.eleve_id = p.id)
      from public.lien_parent l
      join public.profil p on p.id = l.eleve_id
      left join public.consentement_parental c on c.eleve_id = p.id
     where l.parent_id = auth.uid()
     order by l.cree_le;
end $$;

create function prive.verifier_lien(p_eleve uuid) returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'parent' then
    raise exception 'pas_parent';
  end if;
  if not exists (select 1 from public.lien_parent where parent_id = auth.uid() and eleve_id = p_eleve) then
    raise exception 'lien_introuvable';
  end if;
end $$;
revoke execute on function prive.verifier_lien(uuid) from public;

-- Résumé par cours de la filière et du niveau de l'enfant ; jamais de réponse ni de tentative détaillée.
create function public.progression_enfant(p_eleve uuid)
returns table (cours_id uuid, titre text, chapitres_valides int, chapitres_total int, meilleure_note numeric,
               cours_valide boolean, derniere_activite timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  perform prive.verifier_lien(p_eleve);
  return query
    select co.id, co.titre,
           (select count(*)::int from public.progression_chapitre pc join public.chapitre ch on ch.id = pc.chapitre_id
             where pc.eleve_id = p_eleve and ch.cours_id = co.id and ch.publie and pc.valide),
           (select count(*)::int from public.chapitre ch where ch.cours_id = co.id and ch.publie),
           pco.meilleure_note, coalesce(pco.valide, false),
           (select max(t.fin) from public.tentative t
             where t.eleve_id = p_eleve and t.cours_id = co.id and t.statut = 'terminee')
      from public.profil p
      join public.cours co on co.filiere_id = p.filiere_id and co.niveau_code = p.niveau_code and co.publie
      left join public.progression_cours pco on pco.eleve_id = p_eleve and pco.cours_id = co.id
     where p.id = p_eleve
     order by co.ordre, co.titre;
end $$;

create function public.parents_de_l_eleve()
returns table (parent_id uuid, nom text, origine text, lie_le timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  return query
    select p.id, coalesce(p.nom, '')::text, l.origine, l.cree_le
      from public.lien_parent l join public.profil p on p.id = l.parent_id
     where l.eleve_id = auth.uid()
     order by l.cree_le;
end $$;

create function public.retirer_consentement(p_eleve uuid) returns timestamptz
language plpgsql security definer set search_path = '' as $$
declare
  v timestamptz;
begin
  perform prive.verifier_lien(p_eleve);
  perform 1 from public.profil where id = p_eleve for update;
  update public.consentement_parental c set retire_le = now(), retire_par = auth.uid()
   where c.eleve_id = p_eleve and c.donne_le is not null and c.retire_le is null
     and exists (select 1 from public.profil p where p.id = p_eleve and p.moins_de_15_ans);
  if not found then
    raise exception 'retrait_impossible';
  end if;
  update public.profil set suppression_demandee_le = coalesce(suppression_demandee_le, now()), suppression_imposee = true
   where id = p_eleve
  returning suppression_demandee_le + interval '30 days' into v;
  return v;
end $$;

-- Seul le parent qui a retiré son accord l'annule ; toute demande de suppression du compte est effacée.
create function public.annuler_retrait_consentement(p_eleve uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.verifier_lien(p_eleve);
  perform 1 from public.profil where id = p_eleve for update;
  update public.consentement_parental set retire_le = null, retire_par = null
   where eleve_id = p_eleve and retire_le is not null and retire_par = auth.uid();
  if not found then
    raise exception 'retrait_impossible';
  end if;
  update public.profil set suppression_demandee_le = null, suppression_imposee = false where id = p_eleve;
end $$;

-- Corps de 20261222000003_mes_donnees.sql + refus si la suppression a été imposée par le retrait de l'accord.
create or replace function public.annuler_suppression_compte() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  if exists (select 1 from public.profil where id = auth.uid() and suppression_imposee) then
    raise exception 'suppression_imposee';
  end if;
  update public.profil set suppression_demandee_le = null where id = auth.uid();
end $$;

-- demander_consentement : corps de l'étape 5a conservé tel quel dans prive, précédé du refus après un retrait.
alter function public.demander_consentement(text) rename to demander_consentement_5a;
alter function public.demander_consentement_5a(text) set schema prive;
revoke execute on function prive.demander_consentement_5a(text) from public, anon, authenticated;
create function public.demander_consentement(p_email text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.consentement_parental where eleve_id = auth.uid() and retire_le is not null) then
    raise exception 'consentement_retire';
  end if;
  perform prive.demander_consentement_5a(p_email);
end $$;

-- exporter_mes_donnees : export de l'étape 5a + parents reliés, enfants suivis, abonnement, retrait.
alter function public.exporter_mes_donnees() rename to exporter_mes_donnees_5a;
alter function public.exporter_mes_donnees_5a() set schema prive;
revoke execute on function prive.exporter_mes_donnees_5a() from public, anon, authenticated;
create function public.exporter_mes_donnees() returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  return prive.exporter_mes_donnees_5a() || jsonb_build_object(
    'parents_relies', coalesce((select jsonb_agg(jsonb_build_object('nom', p.nom, 'origine', l.origine, 'lie_le', l.cree_le) order by l.cree_le)
      from public.lien_parent l join public.profil p on p.id = l.parent_id where l.eleve_id = auth.uid()), '[]'::jsonb),
    'enfants_suivis', coalesce((select jsonb_agg(jsonb_build_object('nom', p.nom, 'lie_le', l.cree_le) order by l.cree_le)
      from public.lien_parent l join public.profil p on p.id = l.eleve_id where l.parent_id = auth.uid()), '[]'::jsonb),
    'abonnement', (select jsonb_build_object('formule', a.formule, 'statut', a.statut, 'fin_periode', a.fin_periode,
                                             'fin_grace', a.fin_grace, 'cree_le', a.cree_le)
      from public.abonnement a where a.eleve_id = auth.uid()),
    'retrait_consentement', (select jsonb_build_object('retire_le', c.retire_le)
      from public.consentement_parental c where c.eleve_id = auth.uid() and c.retire_le is not null));
end $$;

-- purges_quotidiennes : purges de l'étape 5a + codes parents expirés et compteurs d'essais passés.
alter function prive.purges_quotidiennes() rename to purges_quotidiennes_5a;
revoke execute on function prive.purges_quotidiennes_5a() from public;
create function prive.purges_quotidiennes() returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.purges_quotidiennes_5a();
  delete from prive.code_parent where expire_le < now();
  delete from prive.essai_code_parent where heure < date_trunc('hour', now());
end $$;
revoke execute on function prive.purges_quotidiennes() from public;

revoke execute on function public.enfants_du_parent(), public.progression_enfant(uuid), public.parents_de_l_eleve(),
  public.retirer_consentement(uuid), public.annuler_retrait_consentement(uuid),
  public.demander_consentement(text), public.exporter_mes_donnees() from public, anon;
grant execute on function public.enfants_du_parent(), public.progression_enfant(uuid), public.parents_de_l_eleve(),
  public.retirer_consentement(uuid), public.annuler_retrait_consentement(uuid),
  public.demander_consentement(text), public.exporter_mes_donnees() to authenticated;
