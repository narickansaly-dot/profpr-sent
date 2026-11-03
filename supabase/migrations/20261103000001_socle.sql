-- Socle : structure du contenu, profils, règles d'accès.

create type public.voie_t as enum ('generale', 'technologique', 'professionnelle');
create type public.role_t as enum ('eleve', 'parent', 'enseignant', 'admin_contenu');
create type public.type_question_t as enum ('qcm_unique', 'qcm_multiple', 'vrai_faux', 'reponse_courte');
create type public.statut_question_t as enum ('brouillon', 'a_relire', 'valide');

create table public.niveau (
  code text primary key check (code in ('2de', '1re', 'Tle')),
  nom text not null,
  ordre smallint not null
);

create table public.filiere (
  id uuid primary key default gen_random_uuid(),
  voie public.voie_t not null,
  code text not null unique,
  nom text not null,
  ordre smallint not null default 0
);

create table public.cours (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  filiere_id uuid references public.filiere on delete restrict,
  niveau_code text references public.niveau,
  matiere text not null,
  titre text not null,
  couleur text not null default '#2563eb',
  ordre smallint not null default 0,
  publie boolean not null default false
);

create table public.chapitre (
  id uuid primary key default gen_random_uuid(),
  cours_id uuid not null references public.cours on delete cascade,
  slug text not null,
  numero smallint not null,
  titre text not null,
  titre_court text,
  duree text,
  resume text,
  chapeau text,
  objectifs text[] not null default '{}',
  sections jsonb not null default '[]',
  a_retenir text,
  publie boolean not null default false,
  unique (cours_id, slug)
);

create table public.notion (
  id uuid primary key default gen_random_uuid(),
  chapitre_id uuid not null references public.chapitre on delete cascade,
  nom text not null,
  unique (chapitre_id, nom)
);

create table public.question (
  id uuid primary key default gen_random_uuid(),
  chapitre_id uuid not null references public.chapitre on delete cascade,
  notion_id uuid references public.notion on delete set null,
  type public.type_question_t not null,
  enonce text not null,
  propositions jsonb not null default '[]',
  difficulte smallint not null default 2 check (difficulte between 1 and 3),
  statut public.statut_question_t not null default 'brouillon',
  source text unique,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
create index question_chapitre_statut on public.question (chapitre_id, statut);

-- Corrigés à part : jamais lisibles par les élèves, la correction se fait côté serveur.
create table public.question_corrige (
  question_id uuid primary key references public.question on delete cascade,
  bonnes_reponses jsonb not null default '[]',
  reponses_acceptees text[] not null default '{}',
  marge numeric,
  marge_relative boolean not null default false,
  explication text not null default ''
);

create table public.profil (
  id uuid primary key references auth.users on delete cascade,
  role public.role_t not null default 'eleve',
  nom text,
  email text,
  filiere_id uuid references public.filiere,
  niveau_code text references public.niveau,
  moins_de_15_ans boolean,
  onboarding_termine boolean not null default false,
  inscrit_le timestamptz not null default now()
);

-- Un profil est créé à chaque inscription.
create function public.creer_profil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profil (id, email) values (new.id, new.email);
  return new;
end $$;

create trigger apres_inscription after insert on auth.users
  for each row execute function public.creer_profil();

create function public.role_actuel() returns public.role_t
language sql stable security definer set search_path = '' as $$
  select role from public.profil where id = auth.uid()
$$;

create function public.en_essai() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select inscrit_le > now() - interval '7 days' from public.profil where id = auth.uid()), false)
$$;

-- L'étape 5 ajoutera l'abonnement et le cours gratuit à cette fonction.
create function public.peut_lire_cours(p_cours uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select case
    when auth.uid() is null then false
    when public.role_actuel() = 'admin_contenu' then true
    when not exists (select 1 from public.cours where id = p_cours and publie) then false
    when public.role_actuel() = 'enseignant' then true
    else public.en_essai()
  end
$$;

alter table public.niveau enable row level security;
alter table public.filiere enable row level security;
alter table public.cours enable row level security;
alter table public.chapitre enable row level security;
alter table public.notion enable row level security;
alter table public.question enable row level security;
alter table public.question_corrige enable row level security;
alter table public.profil enable row level security;

create policy "lecture publique" on public.niveau for select using (true);
create policy "lecture publique" on public.filiere for select using (true);

create policy "catalogue" on public.cours for select to authenticated
  using (publie or public.role_actuel() = 'admin_contenu');

create policy "lecture" on public.chapitre for select to authenticated
  using (public.role_actuel() = 'admin_contenu' or (publie and public.peut_lire_cours(cours_id)));

create policy "lecture" on public.notion for select to authenticated
  using (public.role_actuel() = 'admin_contenu'
         or public.peut_lire_cours((select cours_id from public.chapitre c where c.id = chapitre_id and c.publie)));

create policy "lecture" on public.question for select to authenticated
  using (public.role_actuel() = 'admin_contenu'
         or (statut = 'valide'
             and public.peut_lire_cours((select cours_id from public.chapitre c where c.id = chapitre_id and c.publie))));

create policy "lecture admin" on public.question_corrige for select to authenticated
  using (public.role_actuel() = 'admin_contenu');

-- Écriture du contenu : admin du contenu uniquement.
create policy "ecriture admin" on public.filiere for all to authenticated
  using (public.role_actuel() = 'admin_contenu') with check (public.role_actuel() = 'admin_contenu');
create policy "ecriture admin" on public.cours for all to authenticated
  using (public.role_actuel() = 'admin_contenu') with check (public.role_actuel() = 'admin_contenu');
create policy "ecriture admin" on public.chapitre for all to authenticated
  using (public.role_actuel() = 'admin_contenu') with check (public.role_actuel() = 'admin_contenu');
create policy "ecriture admin" on public.notion for all to authenticated
  using (public.role_actuel() = 'admin_contenu') with check (public.role_actuel() = 'admin_contenu');
create policy "ecriture admin" on public.question for all to authenticated
  using (public.role_actuel() = 'admin_contenu') with check (public.role_actuel() = 'admin_contenu');
create policy "ecriture admin" on public.question_corrige for all to authenticated
  using (public.role_actuel() = 'admin_contenu') with check (public.role_actuel() = 'admin_contenu');

-- Profil : chacun lit et modifie le sien, sans pouvoir changer son rôle ni sa date d'inscription.
create policy "son profil" on public.profil for select to authenticated using (id = auth.uid());
create policy "modifier son profil" on public.profil for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
revoke all on public.profil from anon;
revoke insert, update, delete on public.profil from authenticated;
grant update (nom, filiere_id, niveau_code, moins_de_15_ans, onboarding_termine) on public.profil to authenticated;

-- Droits par défaut de Supabase : on retire ce que RLS ne protège pas (TRUNCATE ignore RLS)
-- et toute écriture anonyme. Les écritures de l'admin du contenu passent par les politiques ci-dessus.
revoke truncate, references, trigger on all tables in schema public from anon, authenticated;
revoke all on public.question_corrige from anon;
revoke insert, update, delete on public.niveau, public.filiere, public.cours, public.chapitre,
  public.notion, public.question, public.question_corrige from anon;
alter default privileges in schema public revoke truncate, references, trigger on tables from anon, authenticated;

-- Fonctions d'accès : réservées aux utilisateurs connectés (les politiques RLS en dépendent).
revoke execute on function public.role_actuel(), public.en_essai(), public.peut_lire_cours(uuid) from public, anon;
grant execute on function public.role_actuel(), public.en_essai(), public.peut_lire_cours(uuid) to authenticated;
