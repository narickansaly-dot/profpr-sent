-- Fondations des abonnements (sans Stripe) et colonnes du retrait de consentement (tâches 2 et 3).

create table public.abonnement (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null unique references public.profil on delete cascade,
  payeur_id uuid references public.profil on delete set null,
  formule text not null check (formule in ('mensuelle', 'annuelle')),
  statut text not null check (statut in ('actif', 'impaye', 'resilie', 'expire')),
  fin_periode timestamptz not null,
  fin_grace timestamptz,
  stripe_client_id text unique,
  stripe_abonnement_id text unique,
  cree_le timestamptz not null default now(),
  maj_le timestamptz not null default now()
);
alter table public.abonnement enable row level security;
create policy "son abonnement" on public.abonnement for select to authenticated using (eleve_id = (select auth.uid()));
revoke all on public.abonnement from anon, authenticated;
grant select (eleve_id, formule, statut, fin_periode, fin_grace) on public.abonnement to authenticated;

create function prive.abonnement_actif(p_eleve uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.abonnement a
     where a.eleve_id = p_eleve
       and ((a.statut = 'actif' and a.fin_periode > now())
         or (a.statut = 'impaye' and a.fin_grace > now())))
$$;
revoke execute on function prive.abonnement_actif(uuid) from public;

alter table public.consentement_parental
  add column retire_le timestamptz,
  add column retire_par uuid references public.profil on delete set null;
alter table public.profil add column suppression_imposee boolean not null default false;

-- Corps de 20261222000002_consentement.sql + : aucun cours pour un autre rôle qu'élève (un parent n'a pas d'essai),
-- et l'abonnement actif ou en délai de grâce ouvre tout, avant l'essai.
create or replace function prive.acces_cours(p_eleve uuid, p_cours uuid, p_reprise boolean) returns boolean
language sql stable security definer set search_path = '' as $$
  select case
    when p_eleve is null then false
    when (select p.role from public.profil p where p.id = p_eleve) = 'admin_contenu' then true
    when not exists (select 1 from public.cours where id = p_cours and publie) then false
    when (select p.role from public.profil p where p.id = p_eleve) = 'enseignant' then true
    when (select p.role from public.profil p where p.id = p_eleve) is distinct from 'eleve' then false
    when prive.consentement_requis(p_eleve) then false
    when prive.abonnement_actif(p_eleve) then true
    else coalesce(prive.fin_essai(p_eleve) > now(), false)
      or exists (select 1 from public.acces_gratuit a where a.eleve_id = p_eleve and a.cours_id = p_cours)
      or (p_reprise and exists (select 1 from public.tentative t
                                 where t.eleve_id = p_eleve and t.cours_id = p_cours
                                   and t.statut = 'en_cours'
                                   and t.debut > now() - interval '24 hours'
                                   and t.debut <= prive.fin_essai(p_eleve)))
  end
$$;

drop function public.mon_acces();
create function public.mon_acces()
returns table (role text, en_essai boolean, fin_essai timestamptz, cours_gratuit_id uuid, changement_possible_jusqu_au timestamptz,
               consentement_requis boolean, email_parent text, consentement_envoye_le timestamptz,
               abonnement jsonb, consentement_retire_le timestamptz, suppression_prevue_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.role::text,
         case when prive.consentement_requis(p.id) then false else public.en_essai() end,
         case when prive.consentement_requis(p.id) then null else prive.fin_essai(p.id) end, c.id,
         case when c.id is not null and not a.change_utilise and a.choisi_le > now() - interval '48 hours'
              then a.choisi_le + interval '48 hours' end,
         prive.consentement_requis(p.id), k.email_parent, k.dernier_envoi_le,
         (select jsonb_build_object('formule', b.formule, 'statut', b.statut, 'fin_periode', b.fin_periode,
                                    'fin_grace', b.fin_grace, 'actif', prive.abonnement_actif(p.id))
            from public.abonnement b where b.eleve_id = p.id),
         k.retire_le,
         p.suppression_demandee_le + interval '30 days'
    from public.profil p
    left join public.acces_gratuit a on a.eleve_id = p.id
    left join public.cours c on c.id = a.cours_id and c.publie
    left join public.consentement_parental k on k.eleve_id = p.id
   where p.id = auth.uid()
$$;
revoke execute on function public.mon_acces() from public, anon;
grant execute on function public.mon_acces() to authenticated;
