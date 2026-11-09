-- Mes données : export JSON, suppression du compte définitive après 30 jours, purges quotidiennes.
-- Toutes les clés étrangères vers public.profil sont en cascade (et profil l'est vers auth.users) :
-- supprimer l'utilisateur Auth supprime donc le profil, les classes d'un enseignant et tout ce qui dépend d'eux.
-- Non exportés, car secrets : empreintes de jeton (consentement, iCal), endpoint et clés des abonnements push.

alter table public.profil add column suppression_demandee_le timestamptz;

create function public.demander_suppression_compte() returns timestamptz
language plpgsql security definer set search_path = '' as $$
declare
  v timestamptz;
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  -- Une nouvelle demande ne repousse pas la date déjà fixée.
  update public.profil set suppression_demandee_le = coalesce(suppression_demandee_le, now())
   where id = auth.uid()
  returning suppression_demandee_le + interval '30 days' into v;
  return v;
end $$;

create function public.annuler_suppression_compte() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  update public.profil set suppression_demandee_le = null where id = auth.uid();
end $$;

-- Une seule requête, uniquement les données de l'appelant (auth.uid()).
create function public.exporter_mes_donnees() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'profil', (select jsonb_build_object(
        'nom', p.nom, 'email', p.email, 'role', p.role, 'filiere', f.nom, 'niveau', p.niveau_code,
        'moins_de_15_ans', p.moins_de_15_ans, 'inscrit_le', p.inscrit_le, 'etablissement', p.etablissement,
        'suppression_demandee_le', p.suppression_demandee_le)
      from public.profil p left join public.filiere f on f.id = p.filiere_id where p.id = auth.uid()),
    'classes', coalesce((select jsonb_agg(jsonb_build_object('classe', c.nom, 'enseignant', e.nom, 'rejoint_le', i.rejoint_le) order by i.rejoint_le)
      from public.inscription_classe i
      join public.classe c on c.id = i.classe_id
      left join public.profil e on e.id = c.enseignant_id
      where i.eleve_id = auth.uid()), '[]'::jsonb),
    'classes_creees', coalesce((select jsonb_agg(jsonb_build_object('nom', c.nom, 'code', c.code, 'cree_le', c.cree_le) order by c.cree_le)
      from public.classe c where c.enseignant_id = auth.uid()), '[]'::jsonb),
    'departs_classe', coalesce((select jsonb_agg(jsonb_build_object('classe', c.nom, 'quitte_le', d.quitte_le) order by d.quitte_le)
      from prive.depart_classe d join public.classe c on c.id = d.classe_id
      where d.eleve_id = auth.uid()), '[]'::jsonb),
    'progression_chapitres', coalesce((select jsonb_agg(jsonb_build_object(
        'chapitre', ch.titre, 'meilleure_note', pc.meilleure_note, 'valide', pc.valide, 'valide_le', pc.valide_le, 'lu', pc.lu) order by ch.titre)
      from public.progression_chapitre pc join public.chapitre ch on ch.id = pc.chapitre_id
      where pc.eleve_id = auth.uid()), '[]'::jsonb),
    'progression_cours', coalesce((select jsonb_agg(jsonb_build_object(
        'cours', co.titre, 'meilleure_note', pc.meilleure_note, 'valide', pc.valide, 'valide_le', pc.valide_le,
        'essais', pc.essais, 'dernier_essai', pc.dernier_essai) order by co.titre)
      from public.progression_cours pc join public.cours co on co.id = pc.cours_id
      where pc.eleve_id = auth.uid()), '[]'::jsonb),
    'tentatives', coalesce((select jsonb_agg(jsonb_build_object(
        'type', t.type, 'cours', co.titre, 'chapitre', ch.titre, 'debut', t.debut, 'fin', t.fin, 'date_limite', t.date_limite,
        'statut', t.statut, 'note', t.note, 'reussie', t.reussie,
        'questions', coalesce((select jsonb_agg(jsonb_build_object('enonce', q.enonce, 'reponse', tq.reponse, 'correcte', tq.correcte,
                                                                    'repondu_le', tq.repondu_le) order by tq.ordre)
                                 from public.tentative_question tq join public.question q on q.id = tq.question_id
                                where tq.tentative_id = t.id), '[]'::jsonb)) order by t.debut)
      from public.tentative t
      join public.cours co on co.id = t.cours_id
      left join public.chapitre ch on ch.id = t.chapitre_id
      where t.eleve_id = auth.uid()), '[]'::jsonb),
    'historique_questions', coalesce((select jsonb_agg(jsonb_build_object(
        'enonce', q.enonce, 'vue', h.vue, 'ratee', h.ratee, 'derniere_reponse', h.derniere_reponse) order by h.derniere_reponse nulls last, q.enonce)
      from public.historique_question h join public.question q on q.id = h.question_id
      where h.eleve_id = auth.uid()), '[]'::jsonb),
    'evenements', coalesce((select jsonb_agg(jsonb_build_object(
        'type', ev.type, 'titre', ev.titre, 'debut', ev.debut, 'duree_minutes', ev.duree_minutes, 'cours', co.titre,
        'repetition', ev.repetition, 'jours_semaine', ev.jours_semaine, 'repeter_jusqu_au', ev.repeter_jusqu_au,
        'revision_generale', ev.revision_generale, 'delai_rappel_minutes', ev.delai_rappel_minutes, 'cree_le', ev.cree_le,
        'chapitres', coalesce((select jsonb_agg(ch.titre order by ch.numero)
                                 from public.evenement_chapitre ec join public.chapitre ch on ch.id = ec.chapitre_id
                                where ec.evenement_id = ev.id), '[]'::jsonb)) order by ev.debut)
      from public.evenement ev left join public.cours co on co.id = ev.cours_id
      where ev.eleve_id = auth.uid()), '[]'::jsonb),
    'plans_revision', coalesce((select jsonb_agg(jsonb_build_object(
        'examen', ex.titre, 'examen_le', ex.debut, 'sessions_par_semaine', pl.sessions_par_semaine, 'duree_minutes', pl.duree_minutes,
        'jours_preferes', pl.jours_preferes, 'heure_debut', pl.heure_debut, 'statut', pl.statut, 'cree_le', pl.cree_le) order by pl.cree_le)
      from public.plan_revision pl join public.evenement ex on ex.id = pl.examen_id
      where pl.eleve_id = auth.uid()), '[]'::jsonb),
    'preferences_notification', (select to_jsonb(pn) - 'eleve_id' from public.preferences_notification pn where pn.eleve_id = auth.uid()),
    'appareils', coalesce((select jsonb_agg(jsonb_build_object('appareil', a.appareil, 'cree_le', a.cree_le) order by a.cree_le)
      from public.abonnement_push a where a.eleve_id = auth.uid()), '[]'::jsonb),
    'notifications', coalesce((select jsonb_agg(jsonb_build_object(
        'titre', n.titre, 'corps', n.corps, 'envoi_prevu', n.envoi_prevu, 'statut', n.statut, 'lue_le', n.lue_le) order by n.envoi_prevu)
      from public.notification_planifiee n where n.eleve_id = auth.uid()), '[]'::jsonb),
    'consentement', (select jsonb_build_object('email_parent', c.email_parent, 'demande_le', c.demande_le, 'donne_le', c.donne_le)
      from public.consentement_parental c where c.eleve_id = auth.uid()),
    'acces_gratuit', (select jsonb_build_object('cours', co.titre, 'choisi_le', a.choisi_le, 'change_utilise', a.change_utilise, 'modifie_le', a.modifie_le)
      from public.acces_gratuit a join public.cours co on co.id = a.cours_id where a.eleve_id = auth.uid()),
    'signalements', coalesce((select jsonb_agg(jsonb_build_object(
        'enonce', q.enonce, 'commentaire', s.commentaire, 'statut', s.statut, 'reponse', s.reponse, 'cree_le', s.cree_le, 'traite_le', s.traite_le) order by s.cree_le)
      from public.signalement s join public.question q on q.id = s.question_id
      where s.auteur_id = auth.uid()), '[]'::jsonb)
  )
$$;

-- Chaque nuit : comptes dont la suppression est échue, départs de classe de plus de 30 jours.
create function prive.purges_quotidiennes() returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- Cascade : auth.users -> profil -> classes (et leurs inscriptions, échéances, départs) et toutes les données de la personne.
  delete from auth.users u
   using public.profil p
   where p.id = u.id and p.suppression_demandee_le < now() - interval '30 days';
  delete from prive.depart_classe where quitte_le < now() - interval '30 days';
end $$;
revoke execute on function prive.purges_quotidiennes() from public;

select cron.unschedule(jobid) from cron.job where jobname = 'purges-quotidiennes';
select cron.schedule('purges-quotidiennes', '23 3 * * *', $$select prive.purges_quotidiennes()$$);

revoke execute on function public.exporter_mes_donnees(), public.demander_suppression_compte(), public.annuler_suppression_compte() from public, anon;
grant execute on function public.exporter_mes_donnees(), public.demander_suppression_compte(), public.annuler_suppression_compte() to authenticated;
