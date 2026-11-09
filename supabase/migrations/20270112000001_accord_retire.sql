-- Dette 5b : rejouée après un retrait, la page d'accord ne doit plus inviter à créer un compte parent.
-- lire_demande_consentement gagne la colonne « retire » (changement de signature : drop puis create) ;
-- donner_consentement refuse un accord retiré. Corps recopiés de 20261222000002_consentement.sql.

drop function public.lire_demande_consentement(text);

create function public.lire_demande_consentement(p_jeton text)
returns table (prenom text, deja_donne boolean, retire boolean)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if p_jeton is null or p_jeton !~ '^[A-Za-z0-9_-]{43}$' then
    raise exception 'lien_consentement_invalide';
  end if;
  return query
    select coalesce(p.nom, '')::text, c.donne_le is not null, c.retire_le is not null
      from public.consentement_parental c join public.profil p on p.id = c.eleve_id
     where c.jeton_empreinte = extensions.digest(p_jeton, 'sha256')
       and (c.donne_le is not null or c.demande_le > now() - interval '7 days');
  if not found then
    raise exception 'lien_consentement_invalide';
  end if;
end $$;

create or replace function public.donner_consentement(p_jeton text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_prenom text;
  v_retire timestamptz;
begin
  if p_jeton is null or p_jeton !~ '^[A-Za-z0-9_-]{43}$' then
    raise exception 'lien_consentement_invalide';
  end if;
  select c.retire_le into v_retire
    from public.consentement_parental c
   where c.jeton_empreinte = extensions.digest(p_jeton, 'sha256')
     and (c.donne_le is not null or c.demande_le > now() - interval '7 days');
  if v_retire is not null then
    raise exception 'consentement_retire';
  end if;
  update public.consentement_parental c set donne_le = coalesce(c.donne_le, now())
    from public.profil p
   where p.id = c.eleve_id
     and c.jeton_empreinte = extensions.digest(p_jeton, 'sha256')
     and (c.donne_le is not null or c.demande_le > now() - interval '7 days')
  returning coalesce(p.nom, '') into v_prenom;
  if not found then
    raise exception 'lien_consentement_invalide';
  end if;
  return v_prenom;
end $$;

revoke execute on function public.lire_demande_consentement(text) from public;
grant execute on function public.lire_demande_consentement(text) to anon, authenticated;
