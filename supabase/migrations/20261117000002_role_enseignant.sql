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

-- Le prénom devient visible par d'autres comptes (l'enseignant voit celui de ses élèves, les élèves celui de l'enseignant).
-- Mêmes bornes que l'accueil (src/lib/profil/onboarding.ts : 2 à 60 caractères après trim), sans caractère de
-- contrôle ni de mise en forme bidirectionnelle (U+202E permettrait d'imiter le prénom d'un camarade).
-- Nettoyage des données existantes d'abord, pour que la contrainte s'applique sans échec.
update public.profil
   set nom = btrim(left(btrim(regexp_replace(nom, '[[:cntrl:]\u200e\u200f\u202a-\u202e\u2066-\u2069]', '', 'g')), 60))
 where nom is not null;
update public.profil set nom = null where char_length(nom) < 2;
alter table public.profil add constraint profil_nom_ck check (
  nom is null
  or (char_length(nom) between 2 and 60
      and btrim(nom) = nom
      and nom !~ '[[:cntrl:]\u200e\u200f\u202a-\u202e\u2066-\u2069]')
);

create function public.demandes_enseignant()
returns table (id uuid, nom text, email text, etablissement text, inscrit_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, p.nom, p.email, p.etablissement, p.inscrit_le
    from public.profil p
   where p.demande_enseignant and p.role = 'eleve'
     and public.role_actuel() = 'admin_contenu'
   order by p.inscrit_le
$$;

-- Acceptation : la personne devient enseignante et quitte ses classes d'élève (ses résultats n'apparaissent
-- dans aucune classe). Refus : elle reste élève et repasse par l'accueil, qui recueille filière, niveau et âge.
-- inscription_classe et prive.depart_classe sont créées en 20261117000003 : PL/pgSQL ne résout ces noms qu'à l'exécution.
create function public.traiter_demande_enseignant(p_profil uuid, p_accepter boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'admin_contenu' then
    raise exception 'acces_refuse';
  end if;
  if p_accepter is null then
    raise exception 'decision_invalide';
  end if;
  update public.profil
     set role = case when p_accepter then 'enseignant'::public.role_t else role end,
         demande_enseignant = false,
         onboarding_termine = case when p_accepter then onboarding_termine else false end,
         etablissement = case when p_accepter then etablissement else null end
   where id = p_profil and demande_enseignant and role = 'eleve';
  if not found then
    raise exception 'demande_introuvable';
  end if;
  if p_accepter then
    delete from public.inscription_classe where eleve_id = p_profil;
    delete from prive.depart_classe where eleve_id = p_profil;
  end if;
end $$;

revoke execute on function public.demandes_enseignant(), public.traiter_demande_enseignant(uuid, boolean) from public, anon;
grant execute on function public.demandes_enseignant(), public.traiter_demande_enseignant(uuid, boolean) to authenticated;
