-- Accord parental : l'enseignant ne voit plus, ni ne compte, l'élève dont l'accord est requis (jamais donné ou retiré).
-- Rien n'est supprimé : si le parent annule son retrait, l'inscription redevient visible.
--
-- Choix : prive.consentement_requis n'est pas exécutable par « authenticated » (revoke execute ... from public, et pas de
-- usage sur le schéma prive). Or une politique RLS s'exécute avec les droits du rôle qui interroge. On passe donc par un
-- assistant public en security definer. Il ne répond « vrai » que si l'appelant est l'enseignant d'une classe de l'élève,
-- pour ne pas servir à deviner l'état de l'accord d'un identifiant quelconque.
create function public.est_eleve_sans_accord(p_eleve uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.inscription_classe i join public.classe c on c.id = i.classe_id
                  where i.eleve_id = p_eleve and c.enseignant_id = (select auth.uid()))
         and prive.consentement_requis(p_eleve)
$$;
revoke execute on function public.est_eleve_sans_accord(uuid) from public, anon;
grant execute on function public.est_eleve_sans_accord(uuid) to authenticated;

drop policy "inscriptions visibles" on public.inscription_classe;
create policy "inscriptions visibles" on public.inscription_classe for select to authenticated
  using (eleve_id = (select auth.uid())
         or (exists (select 1 from public.classe c where c.id = classe_id and c.enseignant_id = (select auth.uid()))
             and not public.est_eleve_sans_accord(eleve_id)));

-- Corps de la migration 20261117000003, avec le décompte sans les élèves dont l'accord est requis.
create or replace function public.classes_enseignant()
returns table (id uuid, nom text, code text, filiere_id uuid, niveau_code text, nb_eleves int, cours_ids uuid[], cree_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select c.id, c.nom, c.code, c.filiere_id, c.niveau_code,
         (select count(*)::int from public.inscription_classe i where i.classe_id = c.id and not prive.consentement_requis(i.eleve_id)),
         coalesce((select array_agg(cc.cours_id order by cc.cours_id) from public.classe_cours cc where cc.classe_id = c.id), '{}'),
         c.cree_le
    from public.classe c
   where c.enseignant_id = auth.uid()
   order by c.cree_le desc
$$;
