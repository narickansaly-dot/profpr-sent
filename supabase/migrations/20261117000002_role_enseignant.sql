-- Rôle enseignant : demande à l'inscription, validation par un admin du contenu.

alter table public.profil
  add column demande_enseignant boolean not null default false,
  add column etablissement text check (
    etablissement is null
    or (char_length(etablissement) between 2 and 120
        and btrim(etablissement) = etablissement
        and etablissement !~ '[[:cntrl:]]')
  ),
  add constraint profil_demande_etablissement_ck check (not demande_enseignant or etablissement is not null);

grant update (demande_enseignant, etablissement) on public.profil to authenticated;

create function public.demandes_enseignant()
returns table (id uuid, nom text, email text, etablissement text, inscrit_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, p.nom, p.email, p.etablissement, p.inscrit_le
    from public.profil p
   where p.demande_enseignant and p.role = 'eleve'
     and public.role_actuel() = 'admin_contenu'
   order by p.inscrit_le
$$;

create function public.traiter_demande_enseignant(p_profil uuid, p_accepter boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'admin_contenu' then
    raise exception 'acces_refuse';
  end if;
  update public.profil
     set role = case when p_accepter then 'enseignant'::public.role_t else role end,
         demande_enseignant = false
   where id = p_profil and demande_enseignant and role = 'eleve';
  if not found then
    raise exception 'demande_introuvable';
  end if;
end $$;

revoke execute on function public.demandes_enseignant(), public.traiter_demande_enseignant(uuid, boolean) from public, anon;
grant execute on function public.demandes_enseignant(), public.traiter_demande_enseignant(uuid, boolean) to authenticated;
