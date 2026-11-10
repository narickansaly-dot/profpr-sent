-- Dette de l'étape 2.

-- Le catalogue filtre par filière et niveau.
create index if not exists cours_filiere_niveau on public.cours (filiere_id, niveau_code);

-- Ces helpers ne sont appelés que par des fonctions security definer : ils n'ont pas besoin de l'être eux-mêmes.
-- En security invoker, une erreur de droits accordés par mégarde ne donnerait accès à rien de plus.
alter function prive.cloturer(uuid, public.statut_tentative_t) security invoker;
alter function prive.cloturer_si_expiree(uuid) security invoker;
