-- Classes : un élève retiré par l'enseignant ne peut pas rejoindre la classe pendant 24 heures.
-- Les retraits de plus de 30 jours sont purgés chaque nuit. L'export de l'élève retiré en contient la date.

create table prive.retrait_classe (
  classe_id uuid not null references public.classe on delete cascade,
  eleve_id uuid not null references public.profil on delete cascade,
  retire_le timestamptz not null default now(),
  primary key (classe_id, eleve_id)
);
create index retrait_classe_eleve on prive.retrait_classe (eleve_id);
revoke all on prive.retrait_classe from public, anon, authenticated;

create or replace function public.retirer_eleve(p_classe uuid, p_eleve uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- Classe d'un autre enseignant ou inexistante : même erreur, pour ne pas confirmer son existence.
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'classe_introuvable';
  end if;
  -- Pas de départ noté : un élève retiré par l'enseignant n'est plus soumis aux échéances de la classe.
  delete from public.inscription_classe where classe_id = p_classe and eleve_id = p_eleve;
  -- Le retrait est noté (ou daté de nouveau) seulement si l'élève était inscrit.
  if found then
    insert into prive.retrait_classe (classe_id, eleve_id) values (p_classe, p_eleve)
    on conflict (classe_id, eleve_id) do update set retire_le = now();
  end if;
end $$;

-- Pas d'exception pour un code faux : elle annulerait l'enregistrement de l'essai qui sert au frein.
create or replace function public.rejoindre_classe(p_code text) returns table (statut text, classe_nom text)
language plpgsql security definer set search_path = '' as $$
declare
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
  v_classe public.classe;
begin
  -- Une personne en attente de validation enseignant ne rejoint pas de classe : validée, ses résultats d'élève
  -- n'apparaîtraient dans aucune classe de toute façon (traiter_demande_enseignant supprime ses inscriptions).
  if public.role_actuel() is distinct from 'eleve'
     or (select demande_enseignant from public.profil where id = auth.uid()) then
    raise exception 'classe_reservee_eleves';
  end if;
  -- Sérialise les appels d'un même élève : sans cela, des appels simultanés contourneraient le frein.
  perform pg_advisory_xact_lock(hashtextextended('rejoindre_classe:' || auth.uid()::text, 0));
  delete from prive.essai_code where eleve_id = auth.uid() and essai_le < now() - interval '1 hour';
  if (select count(*) from prive.essai_code
       where eleve_id = auth.uid() and essai_le > now() - interval '1 hour') >= 10 then
    return query select 'trop_d_essais'::text, null::text;
    return;
  end if;
  select * into v_classe from public.classe where code = v_code;
  if not found then
    insert into prive.essai_code (eleve_id) values (auth.uid());
    return query select 'code_invalide'::text, null::text;
    return;
  end if;
  -- Élève retiré par l'enseignant depuis moins de 24 heures.
  if exists (select 1 from prive.retrait_classe
              where classe_id = v_classe.id and eleve_id = auth.uid() and retire_le > now() - interval '24 hours') then
    raise exception 'retour_bloque';
  end if;
  delete from prive.depart_classe where classe_id = v_classe.id and eleve_id = auth.uid();
  insert into public.inscription_classe (classe_id, eleve_id) values (v_classe.id, auth.uid())
  on conflict do nothing;
  if not found then
    return query select 'deja_inscrit'::text, v_classe.nom;
    return;
  end if;
  return query select 'ok'::text, v_classe.nom;
end $$;

create or replace function public.exporter_mes_donnees() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  r record;
begin
  -- Même garde que correction_tentative : l'export ne doit pas révéler les corrections pendant une évaluation ouverte.
  for r in select id, type from public.tentative where eleve_id = auth.uid() and statut = 'en_cours' loop
    if not prive.cloturer_si_expiree(r.id) and r.type = 'evaluation_cours' then
      raise exception 'evaluation_en_cours';
    end if;
  end loop;
  return jsonb_build_object(
    'profil', (select jsonb_build_object(
        'nom', p.nom, 'email', p.email, 'role', p.role, 'filiere', f.nom, 'niveau', p.niveau_code,
        'moins_de_15_ans', p.moins_de_15_ans, 'onboarding_termine', p.onboarding_termine,
        'demande_enseignant', p.demande_enseignant, 'inscrit_le', p.inscrit_le, 'etablissement', p.etablissement,
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
    'retraits_classe', coalesce((select jsonb_agg(jsonb_build_object('classe', c.nom, 'retire_le', rc.retire_le) order by rc.retire_le)
      from prive.retrait_classe rc join public.classe c on c.id = rc.classe_id
      where rc.eleve_id = auth.uid()), '[]'::jsonb),
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
        'questions', coalesce((select jsonb_agg(case when t.statut = 'en_cours' then jsonb_build_object('enonce', q.enonce)
                                                       else jsonb_build_object('enonce', q.enonce, 'reponse', tq.reponse, 'correcte', tq.correcte,
                                                                               'repondu_le', tq.repondu_le) end order by tq.ordre)
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
      where s.auteur_id = auth.uid()), '[]'::jsonb),
    -- Signalements traités par l'appelant (administrateur) : sans l'identité de l'auteur.
    'signalements_traites', coalesce((select jsonb_agg(jsonb_build_object(
        'enonce', q.enonce, 'statut', s.statut, 'reponse', s.reponse, 'traite_le', s.traite_le) order by s.traite_le)
      from public.signalement s join public.question q on q.id = s.question_id
      where s.traite_par = auth.uid()), '[]'::jsonb),
    'essais_code_classe', coalesce((select jsonb_agg(e.essai_le order by e.essai_le) from prive.essai_code e where e.eleve_id = auth.uid()), '[]'::jsonb)
  );
end $$;

-- Chaque nuit : comptes dont la suppression est échue, départs et retraits de classe de plus de 30 jours.
create or replace function prive.purges_quotidiennes() returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- Cascade : auth.users -> profil -> classes (et leurs inscriptions, échéances, départs) et toutes les données de la personne.
  delete from auth.users u
   using public.profil p
   where p.id = u.id and p.suppression_demandee_le < now() - interval '30 days'
     -- Le dernier administrateur du contenu est conservé.
     and (p.role <> 'admin_contenu' or exists (
           select 1 from public.profil a where a.role = 'admin_contenu' and a.id <> p.id and a.suppression_demandee_le is null));
  delete from prive.depart_classe where quitte_le < now() - interval '30 days';
  delete from prive.retrait_classe where retire_le < now() - interval '30 days';
end $$;

revoke execute on function public.retirer_eleve(uuid, uuid), public.rejoindre_classe(text), public.exporter_mes_donnees() from public, anon;
grant execute on function public.retirer_eleve(uuid, uuid), public.rejoindre_classe(text), public.exporter_mes_donnees() to authenticated;
revoke execute on function prive.purges_quotidiennes() from public;
