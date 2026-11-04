-- Suivi d'une classe par son enseignant : progression, notes, questions les plus ratées.
-- Fonctions security definer : l'enseignant ne lit jamais directement les tables de résultats.

create function public.suivi_classe(p_classe uuid)
returns table (eleve_id uuid, nom text, cours_id uuid, cours_titre text, chapitres_valides int, chapitres_total int,
               note_evaluation numeric, evaluation_validee boolean, essais_evaluation int, derniere_activite timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  return query
    select p.id, p.nom, co.id, co.titre,
           (select count(*)::int from public.progression_chapitre pc join public.chapitre c on c.id = pc.chapitre_id
             where pc.eleve_id = p.id and c.cours_id = co.id and c.publie and pc.valide),
           (select count(*)::int from public.chapitre c where c.cours_id = co.id and c.publie),
           pco.meilleure_note, coalesce(pco.valide, false), coalesce(pco.essais, 0)::int,
           (select max(t.fin) from public.tentative t where t.eleve_id = p.id and t.cours_id = co.id)
      from public.inscription_classe i
      join public.profil p on p.id = i.eleve_id
      join public.classe_cours cc on cc.classe_id = i.classe_id
      join public.cours co on co.id = cc.cours_id
      left join public.progression_cours pco on pco.eleve_id = p.id and pco.cours_id = co.id
     where i.classe_id = p_classe
     order by p.nom, co.titre;
end $$;

create function public.notes_classe(p_classe uuid, p_cours uuid)
returns table (eleve_id uuid, nom text, chapitre_id uuid, chapitre_numero smallint, chapitre_titre text, meilleure_note numeric, valide boolean)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  if not exists (select 1 from public.classe_cours where classe_id = p_classe and cours_id = p_cours) then
    raise exception 'cours_invalide';
  end if;
  return query
    select p.id, p.nom, c.id, c.numero, c.titre, pc.meilleure_note, coalesce(pc.valide, false)
      from public.inscription_classe i
      join public.profil p on p.id = i.eleve_id
      join public.chapitre c on c.cours_id = p_cours and c.publie
      left join public.progression_chapitre pc on pc.eleve_id = p.id and pc.chapitre_id = c.id
     where i.classe_id = p_classe
     order by p.nom, c.numero;
end $$;

create function public.questions_ratees_classe(p_classe uuid, p_cours uuid, p_limite int default 10)
returns table (question_id uuid, chapitre_titre text, enonce text, propositions jsonb, bonnes_reponses jsonb,
               reponses_acceptees text[], reponses int, taux_erreur int)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  if not exists (select 1 from public.classe_cours where classe_id = p_classe and cours_id = p_cours) then
    raise exception 'cours_invalide';
  end if;
  return query
    select q.id, c.titre, q.enonce, q.propositions, qc.bonnes_reponses, qc.reponses_acceptees,
           count(*)::int, round(100.0 * count(*) filter (where not tq.correcte) / count(*))::int
      from public.tentative_question tq
      join public.tentative t on t.id = tq.tentative_id
      join public.inscription_classe i on i.eleve_id = t.eleve_id and i.classe_id = p_classe
      join public.question q on q.id = tq.question_id
      join public.chapitre c on c.id = q.chapitre_id
      left join public.question_corrige qc on qc.question_id = q.id
     where t.cours_id = p_cours and t.statut <> 'en_cours' and tq.correcte is not null
     group by q.id, c.titre, q.enonce, q.propositions, qc.bonnes_reponses, qc.reponses_acceptees
    having count(*) >= 5 and count(*) filter (where not tq.correcte) > 0
     order by count(*) filter (where not tq.correcte)::numeric / count(*) desc, count(*) desc, q.id
     limit greatest(coalesce(p_limite, 10), 0);
end $$;

revoke execute on function public.suivi_classe(uuid), public.notes_classe(uuid, uuid),
  public.questions_ratees_classe(uuid, uuid, int) from public, anon;
grant execute on function public.suivi_classe(uuid), public.notes_classe(uuid, uuid),
  public.questions_ratees_classe(uuid, uuid, int) to authenticated;
