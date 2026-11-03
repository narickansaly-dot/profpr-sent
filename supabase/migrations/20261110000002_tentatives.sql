-- Résultats des élèves : lus par leur propriétaire, écrits uniquement par les fonctions de quiz.
-- Suppression de contenu : on() restreint (et non en cascade) vers le contenu, car le contenu se retire
-- par publie/statut et n'est jamais supprimé une fois que des élèves ont des résultats ;
-- sinon supprimer une question effacerait les notes. Seuls les profils et les tentatives cascadent.

create type public.type_tentative_t as enum ('quiz_chapitre', 'revision', 'evaluation_cours');
create type public.statut_tentative_t as enum ('en_cours', 'terminee', 'expiree');

create table public.tentative (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null references public.profil on delete cascade,
  type public.type_tentative_t not null,
  cours_id uuid not null references public.cours on delete restrict,
  chapitre_id uuid references public.chapitre on delete restrict,
  nb_questions smallint not null check (nb_questions between 1 and 40),
  debut timestamptz not null default now(),
  date_limite timestamptz,
  fin timestamptz,
  statut public.statut_tentative_t not null default 'en_cours',
  note numeric(5,2) check (note between 0 and 100),
  reussie boolean,
  check ((type = 'evaluation_cours') = (chapitre_id is null))
);
create index tentative_eleve_debut on public.tentative (eleve_id, debut desc);
create unique index tentative_une_evaluation_en_cours on public.tentative (eleve_id, cours_id)
  where type = 'evaluation_cours' and statut = 'en_cours';

create table public.tentative_question (
  tentative_id uuid not null references public.tentative on delete cascade,
  ordre smallint not null check (ordre >= 1),
  question_id uuid not null references public.question on delete restrict,
  permutation smallint[] not null default '{}',
  reponse jsonb,
  correcte boolean,
  repondu_le timestamptz,
  primary key (tentative_id, ordre),
  unique (tentative_id, question_id)
);

create table public.progression_chapitre (
  eleve_id uuid not null references public.profil on delete cascade,
  chapitre_id uuid not null references public.chapitre on delete restrict,
  meilleure_note numeric(5,2) check (meilleure_note between 0 and 100),
  valide boolean not null default false,
  valide_le timestamptz,
  lu boolean not null default false,
  primary key (eleve_id, chapitre_id)
);

create table public.progression_cours (
  eleve_id uuid not null references public.profil on delete cascade,
  cours_id uuid not null references public.cours on delete restrict,
  meilleure_note numeric(5,2) check (meilleure_note between 0 and 100),
  valide boolean not null default false,
  valide_le timestamptz,
  essais smallint not null default 0 check (essais >= 0),
  dernier_essai timestamptz,
  primary key (eleve_id, cours_id)
);

create table public.historique_question (
  eleve_id uuid not null references public.profil on delete cascade,
  question_id uuid not null references public.question on delete restrict,
  vue integer not null default 0,
  ratee integer not null default 0,
  derniere_reponse timestamptz,
  primary key (eleve_id, question_id),
  check (vue >= 0 and ratee >= 0 and ratee <= vue)
);

alter table public.tentative enable row level security;
alter table public.tentative_question enable row level security;
alter table public.progression_chapitre enable row level security;
alter table public.progression_cours enable row level security;
alter table public.historique_question enable row level security;

create policy "ses tentatives" on public.tentative for select to authenticated
  using (eleve_id = (select auth.uid()));
create policy "ses questions" on public.tentative_question for select to authenticated
  using (exists (select 1 from public.tentative t where t.id = tentative_id and t.eleve_id = (select auth.uid())));
create policy "sa progression" on public.progression_chapitre for select to authenticated
  using (eleve_id = (select auth.uid()));
create policy "sa progression" on public.progression_cours for select to authenticated
  using (eleve_id = (select auth.uid()));
create policy "son historique" on public.historique_question for select to authenticated
  using (eleve_id = (select auth.uid()));

revoke all on public.tentative, public.tentative_question, public.progression_chapitre,
  public.progression_cours, public.historique_question from anon;
revoke insert, update, delete on public.tentative, public.tentative_question, public.progression_chapitre,
  public.progression_cours, public.historique_question from authenticated;
revoke truncate, references, trigger, maintain on public.tentative, public.tentative_question,
  public.progression_chapitre, public.progression_cours, public.historique_question from anon, authenticated;
