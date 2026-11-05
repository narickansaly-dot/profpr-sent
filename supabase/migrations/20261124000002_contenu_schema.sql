-- Étape 3b : schéma de la gestion du contenu.

-- 1. Contraintes (reports de l'étape 1).
update public.cours set couleur = lower(couleur);
alter table public.cours add constraint cours_couleur_ck check (couleur ~ '^#[0-9a-f]{6}$');
alter table public.cours add constraint cours_slug_ck check (slug ~ '^[a-z0-9-]+$');
alter table public.chapitre add constraint chapitre_slug_ck check (slug ~ '^[a-z0-9-]+$');
alter table public.chapitre add constraint chapitre_sections_ck check (jsonb_typeof(sections) = 'array');

-- 2. Versionnage : la nouvelle version pointe vers celle qu'elle remplace.
alter table public.question add column version_de uuid references public.question on delete restrict;
create index question_version_de on public.question (version_de) where version_de is not null;

-- 3. modifie_le tenu à jour par la base (report de l'étape 1).
alter table public.cours add column modifie_le timestamptz not null default now();
alter table public.chapitre add column modifie_le timestamptz not null default now();

create function prive.toucher_modifie_le() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.modifie_le := now();
  return new;
end $$;

create trigger modifie_le before update on public.cours for each row execute function prive.toucher_modifie_le();
create trigger modifie_le before update on public.chapitre for each row execute function prive.toucher_modifie_le();
create trigger modifie_le before update on public.question for each row execute function prive.toucher_modifie_le();

-- 4. Signalements des enseignants (RPC en 20261124000005).
create table public.signalement (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.question on delete cascade,
  auteur_id uuid not null references public.profil on delete cascade,
  commentaire text not null check (char_length(btrim(commentaire)) between 5 and 1000),
  statut text not null default 'ouvert' check (statut in ('ouvert', 'traite', 'rejete')),
  reponse text check (reponse is null or char_length(reponse) <= 1000),
  cree_le timestamptz not null default now(),
  traite_le timestamptz,
  traite_par uuid references public.profil on delete set null
);
create unique index signalement_un_ouvert on public.signalement (question_id, auteur_id) where statut = 'ouvert';
create index signalement_auteur_date on public.signalement (auteur_id, cree_le);
alter table public.signalement enable row level security;
-- Aucune politique : lecture et écriture uniquement par les RPC.
revoke all on public.signalement from anon, authenticated;

-- 5. Plus d'écriture directe du contenu : tout passe par les RPC (validation et versionnage communs).
drop policy "ecriture admin" on public.filiere;
drop policy "ecriture admin" on public.cours;
drop policy "ecriture admin" on public.chapitre;
drop policy "ecriture admin" on public.notion;
drop policy "ecriture admin" on public.question;
drop policy "ecriture admin" on public.question_corrige;
revoke insert, update, delete on public.filiere, public.cours, public.chapitre, public.notion,
  public.question, public.question_corrige from authenticated;
