-- Export complet (audit M6) : déliaisons, date du lien iCal, expiration du code parent, retraits faits,
-- compteurs d'envoi du consentement et données de connexion. Aucune empreinte, aucun jeton.
-- Seule l'enveloppe publique est recréée ; prive.exporter_mes_donnees_5a() n'est pas modifiée.
-- « consentement » est produit par _5a : les compteurs sont donc dans une clé distincte, « consentement_envois ».
create or replace function public.exporter_mes_donnees() returns jsonb
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
      from public.consentement_parental c where c.eleve_id = auth.uid() and c.retire_le is not null),
    'deliaisons', coalesce((select jsonb_agg(jsonb_build_object(
        'role', case when d.eleve_id = auth.uid() then 'eleve' else 'parent' end,
        'nom', p.nom, 'delie_le', d.delie_le) order by d.delie_le)
      from prive.deliaison d
      join public.profil p on p.id = case when d.eleve_id = auth.uid() then d.parent_id else d.eleve_id end
      where auth.uid() in (d.eleve_id, d.parent_id)), '[]'::jsonb),
    'jeton_ical', (select jsonb_build_object('cree_le', j.cree_le) from prive.jeton_ical j where j.eleve_id = auth.uid()),
    'code_parent', (select jsonb_build_object('expire_le', c.expire_le) from prive.code_parent c where c.eleve_id = auth.uid()),
    'retraits_faits', coalesce((select jsonb_agg(jsonb_build_object('enfant', p.nom, 'retire_le', c.retire_le) order by c.retire_le)
      from public.consentement_parental c join public.profil p on p.id = c.eleve_id
      where c.retire_par = auth.uid() and c.retire_le is not null), '[]'::jsonb),
    'consentement_envois', (select jsonb_build_object('dernier_envoi_le', c.dernier_envoi_le, 'envois_du_jour', c.envois_du_jour)
      from public.consentement_parental c where c.eleve_id = auth.uid()),
    'connexion', (select jsonb_build_object(
        'fournisseurs', coalesce((select jsonb_agg(i.provider order by i.provider) from auth.identities i where i.user_id = u.id), '[]'::jsonb),
        'last_sign_in_at', u.last_sign_in_at, 'created_at', u.created_at)
      from auth.users u where u.id = auth.uid()));
end $$;
revoke execute on function public.exporter_mes_donnees() from public, anon;
grant execute on function public.exporter_mes_donnees() to authenticated;
