-- Changement de statut d'une sélection de questions (relecture en lot) : mêmes règles que changer_statut_question,
-- dans l'ordre des identifiants (verrous dans un ordre stable), tout ou rien.
create function public.changer_statut_questions(p_questions uuid[], p_statut public.statut_question_t) returns int
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_n int := 0;
begin
  perform prive.exiger_admin();
  if p_questions is null or cardinality(p_questions) = 0 then
    return 0;
  end if;
  if cardinality(p_questions) > 200 then
    raise exception 'trop_de_questions';
  end if;
  for v_id in select distinct x from unnest(p_questions) x order by x loop
    perform public.changer_statut_question(v_id, p_statut);
    v_n := v_n + 1;
  end loop;
  return v_n;
end $$;
revoke execute on function public.changer_statut_questions(uuid[], public.statut_question_t) from public, anon;
grant execute on function public.changer_statut_questions(uuid[], public.statut_question_t) to authenticated;
