-- Effacement complet d'un compte et hygiène des droits (audit sécurité I2, M2, M4, M5).

-- M5 : l'adresse d'un parent qui n'a pas donné son accord est effacée 30 jours après la demande ;
-- la contrainte de longueur existante (CHECK) ne s'applique qu'à une adresse renseignée.
alter table public.consentement_parental alter column email_parent drop not null;

-- I2 + M5 : purge quotidienne. Le journal d'Auth (adresses IP, identifiants) est vidé des comptes purgés avant leur
-- suppression, puis conservé 90 jours au plus. Corps de 20261229000003_suivi_parent.sql, avec ses droits.
create or replace function prive.purges_quotidiennes() returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_purges text[];
begin
  -- Même règle que prive.purges_quotidiennes_5a, dernier administrateur du contenu compris.
  v_purges := array(
    select p.id::text from public.profil p
     where p.suppression_demandee_le < now() - interval '30 days'
       and (p.role <> 'admin_contenu' or exists (
             select 1 from public.profil a where a.role = 'admin_contenu' and a.id <> p.id and a.suppression_demandee_le is null)));
  delete from auth.audit_log_entries l
   where l.payload->>'actor_id' = any (v_purges) or l.payload->'traits'->>'user_id' = any (v_purges);
  perform prive.purges_quotidiennes_5a();
  delete from prive.code_parent where expire_le < now();
  delete from prive.essai_code_parent where heure < date_trunc('hour', now());
  delete from auth.audit_log_entries where created_at < now() - interval '90 days';
  update public.consentement_parental set email_parent = null
   where email_parent is not null and donne_le is null and demande_le < now() - interval '30 days';
end $$;
revoke execute on function prive.purges_quotidiennes() from public;

-- M2 : plus d'écriture sur niveau pour les comptes connectés, et plus de droits automatiques sur les tables à venir.
revoke insert, update, delete on public.niveau from authenticated;
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;

-- M4 : l'adresse du profil suit celle du compte.
create function prive.recopier_email() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.profil set email = new.email where id = new.id;
  return new;
end $$;
revoke execute on function prive.recopier_email() from public;
create trigger recopier_email after update of email on auth.users
  for each row when (new.email is distinct from old.email) execute function prive.recopier_email();
