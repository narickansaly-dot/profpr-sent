# Étape 1 : socle (comptes, contenu, import BPH, lecture) — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** un élève crée son compte, indique sa filière et son niveau, puis lit les 7 chapitres BPH 1re ST2S importés depuis l'ancien site, avec l'accès réglé par la base de données (essai de 7 jours).

**Architecture :** Next.js (App Router) affiche les pages côté serveur et lit Supabase avec la session de l'élève. Toutes les règles d'accès sont dans Postgres (RLS), testées avec pgTAP. Le contenu entre en base uniquement par un format JSON validé avec zod. Un script convertit l'ancien site BPH vers ce format, puis un second l'importe.

**Tech Stack :** Next.js (dernière version stable), React, TypeScript, Tailwind CSS, Supabase (Postgres, Auth, CLI locale sous Docker), `@supabase/ssr`, zod, Vitest, pgTAP, Playwright, tsx.

**Spec :** `docs/superpowers/specs/2026-11-03-app-lycee-design.md` (sections 2, 3, 4 « Inscription » et « Lecture d'un chapitre », 6 « Production du contenu » point 1, 11).

## Contraintes globales

- Toute l'interface est **en français**. Les messages s'adressent à l'élève en le tutoyant.
- Les données sont hébergées en Europe (le projet Supabase de production sera créé en région UE).
- Les règles d'accès vivent **dans la base** (RLS). Le code de l'application ne remplace jamais une règle RLS.
- Les élèves ne lisent jamais les bonnes réponses ni les explications (table `question_corrige`, réservée à `admin_contenu`).
- L'essai donne accès à tous les cours pendant **7 jours** à partir de l'inscription.
- On ne collecte pas la date de naissance, seulement l'indicateur `moins_de_15_ans`.
- Niveaux : `2de`, `1re`, `Tle`. Voies : `generale`, `technologique`, `professionnelle`.
- Avant d'écrire du code qui utilise Next.js, `@supabase/ssr` ou la CLI Supabase, consulter leur documentation à jour avec **context7**. Si une API du plan a changé, suivre la documentation et le signaler dans le rapport de tâche.
- Messages de commit en français, à l'impératif présent, terminés par la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hors périmètre de cette étape

Quiz et évaluations (étape 2), classes et rôle enseignant (étape 3), cours gratuit, abonnement et consentement parental (étape 5), page « Méthodologie et vocabulaire » de l'ancien site (`outils.js`, à reprendre en étape 6), PWA (étape 4).

## Prérequis (à faire par le propriétaire du projet, une seule fois)

- Installer **Docker Desktop** ou **OrbStack** et le lancer. La base Supabase locale tourne dans Docker.
- Node.js 24 est déjà installé.

## Structure des fichiers

```
app-lycee/
├─ supabase/
│  ├─ config.toml                         # généré par la CLI
│  ├─ migrations/20261103000001_socle.sql # schéma, fonctions, RLS
│  ├─ seed.sql                            # voies, filières, niveaux
│  └─ tests/rls_socle.test.sql            # tests pgTAP des droits
├─ contenu/1re-st2s/bph.json              # contenu BPH converti (généré, versionné)
├─ scripts/
│  ├─ bph/convertir.ts                    # ancien site → format d'import (fonction pure)
│  ├─ bph/convertir.test.ts
│  ├─ convertir-bph.ts                    # point d'entrée : lit ../BPH 1ST/site, écrit le JSON
│  └─ importer-contenu.ts                 # valide un JSON et l'écrit en base
├─ src/
│  ├─ proxy.ts                            # rafraîchit la session, protège les routes
│  ├─ lib/
│  │  ├─ supabase/client.ts | server.ts | session.ts
│  │  ├─ routes.ts (+ .test.ts)           # règles de redirection (pures)
│  │  ├─ auth/identifiants.ts (+ .test.ts)# validation e-mail / mot de passe
│  │  ├─ auth/erreurs.ts (+ .test.ts)     # messages d'erreur en français
│  │  ├─ profil/onboarding.ts (+ .test.ts)
│  │  ├─ acces/essai.ts (+ .test.ts)      # jours d'essai restants
│  │  └─ contenu/format-import.ts (+ .test.ts) | requetes.ts
│  ├─ styles/chapitre.css                 # styles des schémas et tableaux repris du site BPH
│  ├─ components/EnTete.tsx | BanniereEssai.tsx | CarteCours.tsx | ContenuChapitre.tsx
│  └─ app/
│     ├─ layout.tsx | globals.css
│     ├─ (auth)/actions.ts | connexion/page.tsx | inscription/page.tsx | FormulaireIdentifiants.tsx
│     ├─ auth/callback/route.ts
│     ├─ bienvenue/page.tsx | actions.ts
│     └─ (app)/layout.tsx | page.tsx | cours/[slug]/page.tsx | cours/[slug]/[chapitre]/page.tsx
└─ e2e/parcours-lecture.spec.ts
```

## Modèles et skills par tâche

| Tâche | Modèle | Skills |
|---|---|---|
| 1. Initialisation | Haiku | context7 |
| 2. Schéma, RLS, tests pgTAP | **Opus** | test-driven-development, context7 |
| 3. Session et protection des routes | Sonnet | test-driven-development, context7 |
| 4. Inscription, connexion, accueil | Sonnet | test-driven-development |
| 5. Format d'import et conversion BPH | Sonnet | test-driven-development |
| 6. Import en base | Sonnet | — |
| 7. Système visuel et mise en page | Sonnet | frontend-design, ui-ux-pro-max |
| 8. Catalogue et lecture | Sonnet | — |
| 9. Parcours de bout en bout et revue | Sonnet, puis **Opus** pour la revue | security-review, requesting-code-review, verification-before-completion |

---

### Task 1 : initialisation du projet

**Files :**
- Create : tout le squelette Next.js, `vitest.config.ts`, `playwright.config.ts`, `.env.example`, `supabase/config.toml`
- Modify : `package.json` (scripts), `.gitignore`

**Interfaces :**
- Produces : scripts npm `dev`, `build`, `test`, `test:db`, `e2e`, `typecheck`, `db:start`, `db:reset` ; alias d'import `@/*` → `src/*` ; variables d'environnement `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

- [ ] **Step 1 : générer Next.js dans un dossier temporaire puis le déplacer** (le dossier contient déjà `docs/`)

```bash
cd "/Users/ansaly/Documents/Dev-Code/Claude Code/app-lycee"
npx create-next-app@latest web-tmp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --disable-git --yes
rsync -a web-tmp/ ./ && rm -rf web-tmp
```

- [ ] **Step 2 : installer les dépendances**

```bash
npm i @supabase/supabase-js @supabase/ssr zod
npm i -D vitest vite-tsconfig-paths @playwright/test tsx supabase
npx playwright install chromium
```

- [ ] **Step 3 : configurer Vitest** — créer `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
  },
});
```

- [ ] **Step 4 : configurer Playwright** — créer `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:3000', locale: 'fr-FR' },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'ordinateur', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true },
});
```

- [ ] **Step 5 : ajouter les scripts** dans `package.json` (garder `dev`, `build`, `start`, `lint` générés)

```json
"test": "vitest run",
"test:db": "supabase test db",
"e2e": "playwright test",
"typecheck": "tsc --noEmit",
"db:start": "supabase start",
"db:reset": "supabase db reset"
```

- [ ] **Step 6 : initialiser Supabase en local**

```bash
npx supabase init
npx supabase start
```

Dans `supabase/config.toml`, vérifier que `[auth] site_url = "http://127.0.0.1:3000"` et `[auth.email] enable_confirmations = false` (pas de confirmation d'e-mail en local). Remplacer `127.0.0.1` par `localhost` dans `site_url` et ajouter `"http://localhost:3000/auth/callback"` à `additional_redirect_urls`.

- [ ] **Step 7 : variables d'environnement** — créer `.env.example`

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Copier en `.env.local` et y mettre les clés affichées par `npx supabase status` (clé « anon » ou « publishable », et clé « service_role » ou « secret »). Vérifier que `.gitignore` contient `.env*` et ajouter la ligne `!.env.example`.

- [ ] **Step 8 : vérifier**

Run : `npm run typecheck && npm run build && npm test -- --passWithNoTests`
Expected : les trois commandes réussissent.

- [ ] **Step 9 : commit**

```bash
git add -A
git commit -m "Initialise le projet Next.js, Supabase, Vitest et Playwright"
```

---

### Task 2 : schéma de la base, règles d'accès et tests pgTAP

**Files :**
- Create : `supabase/migrations/20261103000001_socle.sql`, `supabase/seed.sql`, `supabase/tests/rls_socle.test.sql`

**Interfaces :**
- Produces (tables) : `filiere(id, voie, code, nom, ordre)`, `niveau(code, nom, ordre)`, `cours(id, slug, filiere_id, niveau_code, matiere, titre, couleur, ordre, publie)`, `chapitre(id, cours_id, slug, numero, titre, titre_court, duree, resume, chapeau, objectifs, sections, a_retenir, publie)`, `notion(id, chapitre_id, nom)`, `question(id, chapitre_id, notion_id, type, enonce, propositions, difficulte, statut, source)`, `question_corrige(question_id, bonnes_reponses, reponses_acceptees, marge, marge_relative, explication)`, `profil(id, role, nom, email, filiere_id, niveau_code, moins_de_15_ans, onboarding_termine, inscrit_le)`.
- Produces (fonctions SQL) : `role_actuel() → role_t`, `en_essai() → boolean`, `peut_lire_cours(p_cours uuid) → boolean`.
- `chapitre.sections` est un tableau JSON `[{ "id": string, "titre": string, "html": string }]`.
- `question.propositions` est un tableau JSON de chaînes. `question_corrige.bonnes_reponses` vaut un tableau d'indices pour les QCM, `[true]` ou `[false]` pour vrai/faux, `[]` pour la réponse courte.

- [ ] **Step 1 : écrire les tests pgTAP (ils échouent tant que la migration n'existe pas)** — `supabase/tests/rls_socle.test.sql`

```sql
begin;
select plan(11);

-- Utilisateurs : 1 = élève en essai, 2 = admin du contenu, 3 = élève dont l'essai est terminé
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'eleve@test.local'),
  ('00000000-0000-0000-0000-000000000002', 'admin@test.local'),
  ('00000000-0000-0000-0000-000000000003', 'ancien@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-000000000002';
update public.profil set inscrit_le = now() - interval '10 days' where id = '00000000-0000-0000-0000-000000000003';

insert into public.filiere (id, voie, code, nom) values
  ('10000000-0000-0000-0000-000000000001', 'technologique', 'TEST', 'Filière test');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-000000000001', 'cours-test', '10000000-0000-0000-0000-000000000001', '1re', 'Test', 'Cours test', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'ch1', 1, 'Publié', true),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'ch2', 2, 'Brouillon', false);
insert into public.question (id, chapitre_id, type, enonce, propositions, statut) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'qcm_unique', 'Validée', '["a","b"]', 'valide'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'qcm_unique', 'Brouillon', '["a","b"]', 'brouillon');
insert into public.question_corrige (question_id, bonnes_reponses) values
  ('40000000-0000-0000-0000-000000000001', '[0]'),
  ('40000000-0000-0000-0000-000000000002', '[1]');

-- Élève en essai
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', true);

select is((select count(*)::int from public.chapitre), 1, 'élève en essai : voit seulement les chapitres publiés');
select is((select count(*)::int from public.question), 1, 'élève : voit seulement les questions validées');
select is((select count(*)::int from public.question_corrige), 0, 'élève : ne lit aucun corrigé');
select is((select count(*)::int from public.profil), 1, 'élève : ne voit que son propre profil');
select lives_ok($$ update public.profil set nom = 'Léa' where id = '00000000-0000-0000-0000-000000000001' $$, 'élève : peut modifier son nom');
select throws_ok($$ update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-000000000001' $$, '42501', null, 'élève : ne peut pas changer son rôle');
select throws_ok($$ insert into public.cours (slug, matiere, titre) values ('x', 'x', 'x') $$, '42501', null, 'élève : ne peut pas créer de cours');

-- Élève dont l'essai est terminé (pas encore d'abonnement ni de cours gratuit : étape 5)
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
select is((select count(*)::int from public.chapitre), 0, 'élève hors essai : aucun chapitre');
select is((select count(*)::int from public.cours), 1, 'élève hors essai : voit quand même le catalogue');

-- Admin du contenu
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}', true);
select is((select count(*)::int from public.chapitre), 2, 'admin : voit aussi les brouillons');
select is((select count(*)::int from public.question_corrige), 2, 'admin : lit les corrigés');

select * from finish();
rollback;
```

- [ ] **Step 2 : lancer les tests pour vérifier qu'ils échouent**

Run : `npm run test:db`
Expected : FAIL (relation `public.profil` inexistante).

- [ ] **Step 3 : écrire la migration** — `supabase/migrations/20261103000001_socle.sql`

```sql
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
         or public.peut_lire_cours((select cours_id from public.chapitre c where c.id = chapitre_id)));

create policy "lecture" on public.question for select to authenticated
  using (public.role_actuel() = 'admin_contenu'
         or (statut = 'valide'
             and public.peut_lire_cours((select cours_id from public.chapitre c where c.id = chapitre_id))));

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
```

- [ ] **Step 4 : écrire le seed** — `supabase/seed.sql`

```sql
insert into public.niveau (code, nom, ordre) values
  ('2de', 'Seconde', 1), ('1re', 'Première', 2), ('Tle', 'Terminale', 3);

insert into public.filiere (voie, code, nom, ordre) values
  ('generale', 'GEN', 'Voie générale', 1),
  ('technologique', 'STMG', 'STMG — Sciences et technologies du management et de la gestion', 10),
  ('technologique', 'ST2S', 'ST2S — Sciences et technologies de la santé et du social', 11),
  ('technologique', 'STI2D', 'STI2D — Sciences et technologies de l''industrie et du développement durable', 12),
  ('technologique', 'STL', 'STL — Sciences et technologies de laboratoire', 13),
  ('technologique', 'STD2A', 'STD2A — Sciences et technologies du design et des arts appliqués', 14),
  ('technologique', 'STHR', 'STHR — Sciences et technologies de l''hôtellerie et de la restauration', 15),
  ('technologique', 'S2TMD', 'S2TMD — Sciences et techniques du théâtre, de la musique et de la danse', 16),
  ('technologique', 'STAV', 'STAV — Sciences et technologies de l''agronomie et du vivant', 17);
```

Les spécialités de la voie professionnelle seront ajoutées avec leur contenu (étape 7).

- [ ] **Step 5 : appliquer et relancer les tests**

Run : `npm run db:reset && npm run test:db`
Expected : PASS, 11 tests.

- [ ] **Step 6 : générer les types TypeScript de la base**

```bash
npx supabase gen types typescript --local > src/lib/supabase/types.ts
```

- [ ] **Step 7 : commit**

```bash
git add supabase src/lib/supabase/types.ts
git commit -m "Ajoute le schéma du contenu et des profils avec ses règles d'accès"
```

---

### Task 3 : session Supabase et protection des routes

**Files :**
- Create : `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/session.ts`, `src/lib/routes.ts`, `src/lib/routes.test.ts`, `src/proxy.ts`

**Interfaces :**
- Consumes : `Database` depuis `src/lib/supabase/types.ts` (Task 2).
- Produces : `creerClientNavigateur(): SupabaseClient<Database>`, `creerClientServeur(): Promise<SupabaseClient<Database>>`, `redirectionPour(chemin: string, connecte: boolean): string | null`, `ROUTES_PUBLIQUES: string[]`.

Avant de commencer : vérifier avec context7 l'API actuelle de `@supabase/ssr` pour Next.js et le nom du fichier intercepteur. Depuis Next.js 16, c'est `src/proxy.ts` avec une fonction exportée `proxy`. Si la version installée est antérieure, utiliser `src/middleware.ts` avec une fonction `middleware`.

- [ ] **Step 1 : test des règles de redirection** — `src/lib/routes.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { redirectionPour } from './routes';

describe('redirectionPour', () => {
  it('envoie un visiteur non connecté vers la connexion', () => {
    expect(redirectionPour('/', false)).toBe('/connexion');
    expect(redirectionPour('/cours/bph-1re-st2s', false)).toBe('/connexion');
  });
  it('laisse un visiteur non connecté sur les pages publiques', () => {
    expect(redirectionPour('/connexion', false)).toBeNull();
    expect(redirectionPour('/inscription', false)).toBeNull();
    expect(redirectionPour('/auth/callback', false)).toBeNull();
  });
  it('renvoie un élève connecté vers l’accueil depuis connexion et inscription', () => {
    expect(redirectionPour('/connexion', true)).toBe('/');
    expect(redirectionPour('/inscription', true)).toBe('/');
  });
  it('laisse passer un élève connecté ailleurs', () => {
    expect(redirectionPour('/cours/bph-1re-st2s', true)).toBeNull();
    expect(redirectionPour('/bienvenue', true)).toBeNull();
  });
  it('ne confond pas un préfixe avec une page publique', () => {
    expect(redirectionPour('/connexionx', false)).toBe('/connexion');
  });
});
```

- [ ] **Step 2 : lancer le test**

Run : `npx vitest run src/lib/routes.test.ts`
Expected : FAIL (module `./routes` introuvable).

- [ ] **Step 3 : implémenter** — `src/lib/routes.ts`

```ts
export const ROUTES_PUBLIQUES = ['/connexion', '/inscription', '/auth/callback'];
const ROUTES_INVITE = ['/connexion', '/inscription'];

function correspond(chemin: string, route: string) {
  return chemin === route || chemin.startsWith(route + '/');
}

/** Page vers laquelle rediriger, ou null pour laisser passer. */
export function redirectionPour(chemin: string, connecte: boolean): string | null {
  if (!connecte) return ROUTES_PUBLIQUES.some((r) => correspond(chemin, r)) ? null : '/connexion';
  return ROUTES_INVITE.some((r) => correspond(chemin, r)) ? '/' : null;
}
```

- [ ] **Step 4 : relancer le test**

Run : `npx vitest run src/lib/routes.test.ts`
Expected : PASS (5 tests).

- [ ] **Step 5 : clients Supabase** — `src/lib/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function creerClientNavigateur() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

`src/lib/supabase/server.ts`

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

export async function creerClientServeur() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(liste) {
          try {
            liste.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Appelé depuis un Server Component : le proxy rafraîchit déjà la session.
          }
        },
      },
    },
  );
}
```

`src/lib/supabase/session.ts`

```ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './types';

/** Rafraîchit les cookies de session et renvoie l'utilisateur connecté (ou null). */
export async function rafraichirSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(liste) {
          liste.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          liste.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  return { response, user };
}
```

- [ ] **Step 6 : intercepteur** — `src/proxy.ts`

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { rafraichirSession } from '@/lib/supabase/session';
import { redirectionPour } from '@/lib/routes';

export async function proxy(request: NextRequest) {
  const { response, user } = await rafraichirSession(request);
  const cible = redirectionPour(request.nextUrl.pathname, user !== null);
  if (!cible) return response;
  const url = request.nextUrl.clone();
  url.pathname = cible;
  url.search = '';
  const redirection = NextResponse.redirect(url);
  response.cookies.getAll().forEach((c) => redirection.cookies.set(c));
  return redirection;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
```

- [ ] **Step 7 : vérifier**

Run : `npm test && npm run typecheck`
Expected : PASS.

- [ ] **Step 8 : commit**

```bash
git add src
git commit -m "Ajoute la session Supabase et la protection des pages"
```

---

### Task 4 : inscription, connexion, choix de la filière

**Files :**
- Create : `src/lib/auth/identifiants.ts` (+ `.test.ts`), `src/lib/auth/erreurs.ts` (+ `.test.ts`), `src/lib/profil/onboarding.ts` (+ `.test.ts`), `src/app/(auth)/actions.ts`, `src/app/(auth)/FormulaireIdentifiants.tsx`, `src/app/(auth)/connexion/page.tsx`, `src/app/(auth)/inscription/page.tsx`, `src/app/auth/callback/route.ts`, `src/app/bienvenue/page.tsx`, `src/app/bienvenue/actions.ts`

**Interfaces :**
- Consumes : `creerClientServeur()` (Task 3), tables `profil` et `filiere` (Task 2).
- Produces : `schemaIdentifiants`, `traduireErreurAuth(message: string): string`, `lireFormulaireOnboarding(form: FormData)`, server actions `inscrire`, `connecter`, `connecterAvecGoogle`, `deconnecter`, `terminerOnboarding` ; type `EtatFormulaire = { erreur?: string; info?: string }`.

- [ ] **Step 1 : tests de validation** — `src/lib/auth/identifiants.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { schemaIdentifiants } from './identifiants';

describe('schemaIdentifiants', () => {
  it('accepte un e-mail et un mot de passe de 8 caractères', () => {
    expect(schemaIdentifiants.safeParse({ email: 'lea@exemple.fr', motDePasse: '12345678' }).success).toBe(true);
  });
  it('refuse un e-mail invalide avec un message en français', () => {
    const r = schemaIdentifiants.safeParse({ email: 'lea', motDePasse: '12345678' });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe('Saisis une adresse e-mail valide.');
  });
  it('refuse un mot de passe trop court', () => {
    const r = schemaIdentifiants.safeParse({ email: 'lea@exemple.fr', motDePasse: '1234' });
    expect(r.error?.issues[0].message).toBe('Ton mot de passe doit contenir au moins 8 caractères.');
  });
});
```

`src/lib/auth/erreurs.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { traduireErreurAuth } from './erreurs';

describe('traduireErreurAuth', () => {
  it('traduit les erreurs connues', () => {
    expect(traduireErreurAuth('Invalid login credentials')).toBe('E-mail ou mot de passe incorrect.');
    expect(traduireErreurAuth('User already registered')).toBe('Un compte existe déjà avec cet e-mail.');
  });
  it('donne un message générique sinon', () => {
    expect(traduireErreurAuth('boom')).toBe('Une erreur est survenue. Réessaie dans un instant.');
  });
});
```

`src/lib/profil/onboarding.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { lireFormulaireOnboarding } from './onboarding';

function formulaire(champs: Record<string, string>) {
  const f = new FormData();
  Object.entries(champs).forEach(([k, v]) => f.set(k, v));
  return f;
}

describe('lireFormulaireOnboarding', () => {
  const filiereId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

  it('lit un formulaire complet', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: ' Léa ', filiereId, niveau: '1re', moinsDe15Ans: 'on' }));
    expect(r.success && r.data).toEqual({ nom: 'Léa', filiereId, niveau: '1re', moinsDe15Ans: true });
  });
  it('considère une case non cochée comme « non »', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: 'Léa', filiereId, niveau: 'Tle' }));
    expect(r.success && r.data.moinsDe15Ans).toBe(false);
  });
  it('exige une filière', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: 'Léa', filiereId: '', niveau: '1re' }));
    expect(r.error?.issues[0].message).toBe('Choisis ta filière.');
  });
  it('refuse un niveau inconnu', () => {
    const r = lireFormulaireOnboarding(formulaire({ nom: 'Léa', filiereId, niveau: '3e' }));
    expect(r.error?.issues[0].message).toBe('Choisis ton niveau.');
  });
});
```

- [ ] **Step 2 : lancer les tests**

Run : `npx vitest run src/lib/auth src/lib/profil`
Expected : FAIL (modules introuvables).

- [ ] **Step 3 : implémenter les trois modules**

`src/lib/auth/identifiants.ts`

```ts
import { z } from 'zod';

export const schemaIdentifiants = z.object({
  email: z.string().trim().email('Saisis une adresse e-mail valide.'),
  motDePasse: z.string().min(8, 'Ton mot de passe doit contenir au moins 8 caractères.'),
});
```

`src/lib/auth/erreurs.ts`

```ts
const TRADUCTIONS: [RegExp, string][] = [
  [/invalid login credentials/i, 'E-mail ou mot de passe incorrect.'],
  [/already registered|already exists/i, 'Un compte existe déjà avec cet e-mail.'],
  [/email not confirmed/i, 'Confirme d’abord ton adresse e-mail grâce au lien reçu.'],
  [/rate limit/i, 'Trop de tentatives. Patiente quelques minutes.'],
];

export function traduireErreurAuth(message: string): string {
  return TRADUCTIONS.find(([motif]) => motif.test(message))?.[1]
    ?? 'Une erreur est survenue. Réessaie dans un instant.';
}
```

`src/lib/profil/onboarding.ts`

```ts
import { z } from 'zod';

export const NIVEAUX = ['2de', '1re', 'Tle'] as const;

export const schemaOnboarding = z.object({
  nom: z.string().trim().min(2, 'Indique ton prénom.').max(60, 'Ton prénom est trop long.'),
  filiereId: z.string().uuid('Choisis ta filière.'),
  niveau: z.enum(NIVEAUX, { message: 'Choisis ton niveau.' }),
  moinsDe15Ans: z.boolean(),
});

export type DonneesOnboarding = z.infer<typeof schemaOnboarding>;

export function lireFormulaireOnboarding(form: FormData) {
  return schemaOnboarding.safeParse({
    nom: form.get('nom') ?? '',
    filiereId: form.get('filiereId') ?? '',
    niveau: form.get('niveau') ?? '',
    moinsDe15Ans: form.get('moinsDe15Ans') === 'on',
  });
}
```

- [ ] **Step 4 : relancer les tests**

Run : `npx vitest run src/lib/auth src/lib/profil`
Expected : PASS (9 tests).

- [ ] **Step 5 : actions d'authentification** — `src/app/(auth)/actions.ts`

```ts
'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { creerClientServeur } from '@/lib/supabase/server';
import { schemaIdentifiants } from '@/lib/auth/identifiants';
import { traduireErreurAuth } from '@/lib/auth/erreurs';

export type EtatFormulaire = { erreur?: string; info?: string };

function lireIdentifiants(form: FormData) {
  return schemaIdentifiants.safeParse({ email: form.get('email'), motDePasse: form.get('motDePasse') });
}

export async function inscrire(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const r = lireIdentifiants(form);
  if (!r.success) return { erreur: r.error.issues[0].message };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.auth.signUp({ email: r.data.email, password: r.data.motDePasse });
  if (error) return { erreur: traduireErreurAuth(error.message) };
  if (!data.session) return { info: 'Compte créé ! Clique sur le lien reçu par e-mail pour l’activer.' };
  redirect('/bienvenue');
}

export async function connecter(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const r = lireIdentifiants(form);
  if (!r.success) return { erreur: r.error.issues[0].message };
  const supabase = await creerClientServeur();
  const { error } = await supabase.auth.signInWithPassword({ email: r.data.email, password: r.data.motDePasse });
  if (error) return { erreur: traduireErreurAuth(error.message) };
  redirect('/');
}

export async function connecterAvecGoogle() {
  const supabase = await creerClientServeur();
  const origine = (await headers()).get('origin') ?? 'http://localhost:3000';
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origine}/auth/callback` },
  });
  if (error || !data.url) redirect('/connexion?erreur=google');
  redirect(data.url);
}

export async function deconnecter() {
  const supabase = await creerClientServeur();
  await supabase.auth.signOut();
  redirect('/connexion');
}
```

- [ ] **Step 6 : retour de Google** — `src/app/auth/callback/route.ts`

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { creerClientServeur } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (code) {
    const supabase = await creerClientServeur();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.redirect(new URL('/connexion?erreur=google', request.url));
}
```

- [ ] **Step 7 : formulaire partagé** — `src/app/(auth)/FormulaireIdentifiants.tsx`

```tsx
'use client';

import { useActionState } from 'react';
import type { EtatFormulaire } from './actions';

type Props = {
  action: (etat: EtatFormulaire, form: FormData) => Promise<EtatFormulaire>;
  libelle: string;
  autocompleteMotDePasse: 'current-password' | 'new-password';
};

export function FormulaireIdentifiants({ action, libelle, autocompleteMotDePasse }: Props) {
  const [etat, envoyer, enCours] = useActionState(action, {});
  return (
    <form action={envoyer} className="formulaire">
      <label>
        Adresse e-mail
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Mot de passe
        <input name="motDePasse" type="password" autoComplete={autocompleteMotDePasse} minLength={8} required />
      </label>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      {etat.info && <p role="status" className="message-info">{etat.info}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Un instant…' : libelle}
      </button>
    </form>
  );
}
```

- [ ] **Step 8 : pages** — `src/app/(auth)/inscription/page.tsx`

```tsx
import Link from 'next/link';
import { inscrire, connecterAvecGoogle } from '../actions';
import { FormulaireIdentifiants } from '../FormulaireIdentifiants';

export const metadata = { title: 'Créer un compte' };

export default function PageInscription() {
  return (
    <main className="page-auth">
      <h1>Crée ton compte</h1>
      <p>7 jours pour découvrir tous les cours, gratuitement.</p>
      <FormulaireIdentifiants action={inscrire} libelle="Créer mon compte" autocompleteMotDePasse="new-password" />
      <form action={connecterAvecGoogle}>
        <button type="submit" className="bouton bouton-secondaire">Continuer avec Google</button>
      </form>
      <p>Déjà inscrit ? <Link href="/connexion">Se connecter</Link></p>
    </main>
  );
}
```

`src/app/(auth)/connexion/page.tsx`

```tsx
import Link from 'next/link';
import { connecter, connecterAvecGoogle } from '../actions';
import { FormulaireIdentifiants } from '../FormulaireIdentifiants';

export const metadata = { title: 'Connexion' };

export default async function PageConnexion({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  return (
    <main className="page-auth">
      <h1>Content de te revoir !</h1>
      {erreur === 'google' && <p role="alert" className="message-erreur">La connexion avec Google a échoué. Réessaie.</p>}
      <FormulaireIdentifiants action={connecter} libelle="Se connecter" autocompleteMotDePasse="current-password" />
      <form action={connecterAvecGoogle}>
        <button type="submit" className="bouton bouton-secondaire">Continuer avec Google</button>
      </form>
      <p>Pas encore de compte ? <Link href="/inscription">Créer un compte</Link></p>
    </main>
  );
}
```

- [ ] **Step 9 : choix de la filière** — `src/app/bienvenue/actions.ts`

```ts
'use server';

import { redirect } from 'next/navigation';
import { creerClientServeur } from '@/lib/supabase/server';
import { lireFormulaireOnboarding } from '@/lib/profil/onboarding';

export async function terminerOnboarding(_: { erreur?: string }, form: FormData): Promise<{ erreur?: string }> {
  const r = lireFormulaireOnboarding(form);
  if (!r.success) return { erreur: r.error.issues[0].message };
  const supabase = await creerClientServeur();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');
  const { error } = await supabase.from('profil').update({
    nom: r.data.nom,
    filiere_id: r.data.filiereId,
    niveau_code: r.data.niveau,
    moins_de_15_ans: r.data.moinsDe15Ans,
    onboarding_termine: true,
  }).eq('id', user.id);
  if (error) return { erreur: 'Impossible d’enregistrer ton profil. Réessaie.' };
  redirect('/');
}
```

`src/app/bienvenue/page.tsx` — Server Component qui charge les filières et rend un formulaire client. Créer aussi `src/app/bienvenue/FormulaireBienvenue.tsx` :

```tsx
// src/app/bienvenue/page.tsx
import { creerClientServeur } from '@/lib/supabase/server';
import { FormulaireBienvenue } from './FormulaireBienvenue';

export const metadata = { title: 'Bienvenue' };

export default async function PageBienvenue() {
  const supabase = await creerClientServeur();
  const { data: filieres } = await supabase.from('filiere').select('id, voie, nom').order('ordre');
  return (
    <main className="page-auth">
      <h1>Bienvenue !</h1>
      <p>Dis-nous où tu en es pour qu’on te montre les bons cours.</p>
      <FormulaireBienvenue filieres={filieres ?? []} />
    </main>
  );
}
```

```tsx
// src/app/bienvenue/FormulaireBienvenue.tsx
'use client';

import { useActionState } from 'react';
import { terminerOnboarding } from './actions';

const VOIES = { generale: 'Voie générale', technologique: 'Voie technologique', professionnelle: 'Voie professionnelle' } as const;
type Filiere = { id: string; voie: keyof typeof VOIES; nom: string };

export function FormulaireBienvenue({ filieres }: { filieres: Filiere[] }) {
  const [etat, envoyer, enCours] = useActionState(terminerOnboarding, {});
  return (
    <form action={envoyer} className="formulaire">
      <label>Ton prénom<input name="nom" autoComplete="given-name" required /></label>
      <label>
        Ta filière
        <select name="filiereId" required defaultValue="">
          <option value="" disabled>Choisis…</option>
          {(Object.keys(VOIES) as (keyof typeof VOIES)[]).map((voie) => {
            const liste = filieres.filter((f) => f.voie === voie);
            return liste.length > 0 && (
              <optgroup key={voie} label={VOIES[voie]}>
                {liste.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
              </optgroup>
            );
          })}
        </select>
      </label>
      <fieldset>
        <legend>Ton niveau</legend>
        <label><input type="radio" name="niveau" value="2de" required /> Seconde</label>
        <label><input type="radio" name="niveau" value="1re" /> Première</label>
        <label><input type="radio" name="niveau" value="Tle" /> Terminale</label>
      </fieldset>
      <label className="case"><input type="checkbox" name="moinsDe15Ans" /> J’ai moins de 15 ans</label>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>C’est parti !</button>
    </form>
  );
}
```

- [ ] **Step 10 : vérification manuelle** — `npm run dev`, créer un compte sur `/inscription`, remplir `/bienvenue`, puis vérifier dans Supabase Studio (`http://127.0.0.1:54323`) que la ligne `profil` contient la filière, le niveau et `onboarding_termine = true`.

- [ ] **Step 11 : commit**

```bash
git add src
git commit -m "Ajoute l'inscription, la connexion et le choix de la filière"
```

---

### Task 5 : format d'import et conversion du cours BPH

**Files :**
- Create : `src/lib/contenu/format-import.ts` (+ `.test.ts`), `scripts/bph/convertir.ts` (+ `.test.ts`), `scripts/convertir-bph.ts`, `contenu/1re-st2s/bph.json` (généré)

**Interfaces :**
- Produces : `schemaCoursImport` (zod) et les types `CoursImport`, `ChapitreImport`, `QuestionImport` ; `convertirBph(chapitres: ChapitreBph[], quizBis: Record<string, QuestionBph[]>): CoursImport` ; `chargerSourcesBph(dossier: string): { chapitres: ChapitreBph[]; quizBis: Record<string, QuestionBph[]> }`.
- Format d'une question de l'ancien site : `{ q: string, c: string[], a: number, e: string }`. Un chapitre : `{ id, num, short, title, duree, summary, lead, objectifs, sections: [{ id, titre, html }], retenir, quiz }`. Les fichiers déclarent `window.CHAPTERS.push(...)` et `window.QUIZ_BIS = {...}`.

- [ ] **Step 1 : tests du format** — `src/lib/contenu/format-import.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { schemaCoursImport, schemaQuestionImport } from './format-import';

describe('schemaQuestionImport', () => {
  it('accepte un QCM à une réponse et met les valeurs par défaut', () => {
    const r = schemaQuestionImport.parse({
      source: 'x:1', type: 'qcm_unique', enonce: 'Q ?', propositions: ['a', 'b'], bonnes_reponses: [1],
    });
    expect(r).toMatchObject({ difficulte: 2, statut: 'a_relire', explication: '' });
  });
  it('refuse un QCM à une réponse avec deux bonnes réponses', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:1', type: 'qcm_unique', enonce: 'Q ?', propositions: ['a', 'b'], bonnes_reponses: [0, 1],
    }).success).toBe(false);
  });
  it('refuse un indice de bonne réponse hors des propositions', () => {
    expect(schemaQuestionImport.safeParse({
      source: 'x:1', type: 'qcm_multiple', enonce: 'Q ?', propositions: ['a', 'b'], bonnes_reponses: [2],
    }).success).toBe(false);
  });
  it('accepte vrai/faux et réponse courte', () => {
    expect(schemaQuestionImport.safeParse({ source: 'x:2', type: 'vrai_faux', enonce: 'Q', bonne_reponse: true }).success).toBe(true);
    expect(schemaQuestionImport.safeParse({
      source: 'x:3', type: 'reponse_courte', enonce: 'Q', reponses_acceptees: ['FC', 'fréquence cardiaque'],
    }).success).toBe(true);
  });
});

describe('schemaCoursImport', () => {
  it('refuse deux chapitres avec le même slug', () => {
    const chapitre = { slug: 'ch1', numero: 1, titre: 'T', sections: [], questions: [] };
    expect(schemaCoursImport.safeParse({
      slug: 'c', filiere: 'ST2S', niveau: '1re', matiere: 'BPH', titre: 'C', chapitres: [chapitre, chapitre],
    }).success).toBe(false);
  });
});
```

- [ ] **Step 2 : lancer les tests**

Run : `npx vitest run src/lib/contenu`
Expected : FAIL (module introuvable).

- [ ] **Step 3 : implémenter** — `src/lib/contenu/format-import.ts`

```ts
import { z } from 'zod';

const commun = {
  source: z.string().min(1),
  enonce: z.string().min(1),
  notion: z.string().optional(),
  difficulte: z.number().int().min(1).max(3).default(2),
  explication: z.string().default(''),
  statut: z.enum(['brouillon', 'a_relire', 'valide']).default('a_relire'),
};

const indicesValides = (q: { propositions: string[]; bonnes_reponses: number[] }) =>
  q.bonnes_reponses.every((i) => i < q.propositions.length);

export const schemaQuestionImport = z.discriminatedUnion('type', [
  z.object({ ...commun, type: z.literal('qcm_unique'), propositions: z.array(z.string().min(1)).min(2),
    bonnes_reponses: z.array(z.number().int().min(0)).length(1) }),
  z.object({ ...commun, type: z.literal('qcm_multiple'), propositions: z.array(z.string().min(1)).min(2),
    bonnes_reponses: z.array(z.number().int().min(0)).min(1) }),
  z.object({ ...commun, type: z.literal('vrai_faux'), bonne_reponse: z.boolean() }),
  z.object({ ...commun, type: z.literal('reponse_courte'), reponses_acceptees: z.array(z.string().min(1)).min(1),
    marge: z.number().nonnegative().optional(), marge_relative: z.boolean().default(false) }),
]).refine((q) => !('bonnes_reponses' in q) || indicesValides(q), {
  message: 'Une bonne réponse ne correspond à aucune proposition.',
});

export const schemaChapitreImport = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  numero: z.number().int().min(1),
  titre: z.string().min(1),
  titre_court: z.string().optional(),
  duree: z.string().optional(),
  resume: z.string().optional(),
  chapeau: z.string().optional(),
  objectifs: z.array(z.string()).default([]),
  sections: z.array(z.object({ id: z.string().min(1), titre: z.string().min(1), html: z.string() })),
  a_retenir: z.string().optional(),
  questions: z.array(schemaQuestionImport),
});

export const schemaCoursImport = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  filiere: z.string().min(1),
  niveau: z.enum(['2de', '1re', 'Tle']),
  matiere: z.string().min(1),
  titre: z.string().min(1),
  couleur: z.string().regex(/^#[0-9a-f]{6}$/i).default('#2563eb'),
  chapitres: z.array(schemaChapitreImport).min(1),
}).refine((c) => new Set(c.chapitres.map((ch) => ch.slug)).size === c.chapitres.length, {
  message: 'Deux chapitres ont le même slug.',
});

export type QuestionImport = z.infer<typeof schemaQuestionImport>;
export type ChapitreImport = z.infer<typeof schemaChapitreImport>;
export type CoursImport = z.infer<typeof schemaCoursImport>;
```

- [ ] **Step 4 : relancer les tests**

Run : `npx vitest run src/lib/contenu`
Expected : PASS (5 tests).

- [ ] **Step 5 : test de la conversion** — `scripts/bph/convertir.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { convertirBph, type ChapitreBph } from './convertir';
import { schemaCoursImport } from '../../src/lib/contenu/format-import';

const chapitre: ChapitreBph = {
  id: 'ch1', num: '1', short: 'Organisation', title: "Organisation générale de l'organisme humain",
  duree: '5 semaines', summary: 'Résumé', lead: 'Chapeau', objectifs: ['nommer les niveaux ;'],
  sections: [{ id: 'niveaux', titre: "Les niveaux d'organisation", html: '<p>Texte</p>' }],
  retenir: '<p>À retenir</p>',
  quiz: [{ q: 'Quel organite produit l’ATP ?', c: ['Ribosome', 'Mitochondrie'], a: 1, e: 'La mitochondrie.' }],
};

describe('convertirBph', () => {
  const cours = convertirBph([chapitre], { ch1: [{ q: 'Bis ?', c: ['x', 'y'], a: 0, e: 'Car.' }] });

  it('produit un cours valide pour le format d’import', () => {
    expect(schemaCoursImport.safeParse(cours).success).toBe(true);
  });
  it('reprend les champs du chapitre', () => {
    expect(cours.chapitres[0]).toMatchObject({
      slug: 'ch1', numero: 1, titre: "Organisation générale de l'organisme humain", titre_court: 'Organisation',
      resume: 'Résumé', chapeau: 'Chapeau', a_retenir: '<p>À retenir</p>',
    });
  });
  it('fusionne le quiz et la deuxième série, avec des sources stables et le statut validé', () => {
    expect(cours.chapitres[0].questions).toEqual([
      { source: 'bph:ch1:quiz:0', type: 'qcm_unique', enonce: 'Quel organite produit l’ATP ?',
        propositions: ['Ribosome', 'Mitochondrie'], bonnes_reponses: [1], explication: 'La mitochondrie.',
        difficulte: 2, statut: 'valide' },
      { source: 'bph:ch1:bis:0', type: 'qcm_unique', enonce: 'Bis ?', propositions: ['x', 'y'],
        bonnes_reponses: [0], explication: 'Car.', difficulte: 2, statut: 'valide' },
    ]);
  });
  it('trie les chapitres par numéro', () => {
    const c = convertirBph([{ ...chapitre, id: 'ch2', num: '2' }, chapitre], {});
    expect(c.chapitres.map((ch) => ch.slug)).toEqual(['ch1', 'ch2']);
  });
});
```

- [ ] **Step 6 : lancer le test**

Run : `npx vitest run scripts/bph`
Expected : FAIL (module introuvable).

- [ ] **Step 7 : implémenter** — `scripts/bph/convertir.ts`

```ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import type { CoursImport, QuestionImport } from '../../src/lib/contenu/format-import';

export type QuestionBph = { q: string; c: string[]; a: number; e: string };
export type ChapitreBph = {
  id: string; num: string; short?: string; title: string; duree?: string; summary?: string; lead?: string;
  objectifs?: string[]; sections: { id: string; titre: string; html: string }[]; retenir?: string; quiz?: QuestionBph[];
};

function versQuestion(q: QuestionBph, source: string): QuestionImport {
  return {
    source, type: 'qcm_unique', enonce: q.q, propositions: q.c, bonnes_reponses: [q.a],
    explication: q.e, difficulte: 2, statut: 'valide',
  };
}

/** Les questions de l'ancien site ont été relues en classe : elles sont importées comme validées. */
export function convertirBph(chapitres: ChapitreBph[], quizBis: Record<string, QuestionBph[]>): CoursImport {
  return {
    slug: 'bph-1re-st2s', filiere: 'ST2S', niveau: '1re', matiere: 'BPH',
    titre: 'Biologie et physiopathologie humaines', couleur: '#0f766e',
    chapitres: [...chapitres].sort((a, b) => Number(a.num) - Number(b.num)).map((c) => ({
      slug: c.id, numero: Number(c.num), titre: c.title, titre_court: c.short, duree: c.duree,
      resume: c.summary, chapeau: c.lead, objectifs: c.objectifs ?? [], sections: c.sections, a_retenir: c.retenir,
      questions: [
        ...(c.quiz ?? []).map((q, i) => versQuestion(q, `bph:${c.id}:quiz:${i}`)),
        ...(quizBis[c.id] ?? []).map((q, i) => versQuestion(q, `bph:${c.id}:bis:${i}`)),
      ],
    })),
  };
}

/** Exécute les fichiers du site (ch*.js, quiz-bis.js) dans un bac à sable qui imite `window`. */
export function chargerSourcesBph(dossier: string) {
  const fenetre: { CHAPTERS?: ChapitreBph[]; QUIZ_BIS?: Record<string, QuestionBph[]> } = {};
  const contexte = vm.createContext({ window: fenetre });
  const fichiers = readdirSync(dossier).filter((f) => /^ch\d+\.js$/.test(f)).sort();
  for (const f of [...fichiers, 'quiz-bis.js']) {
    vm.runInContext(readFileSync(join(dossier, f), 'utf8'), contexte, { filename: f });
  }
  return { chapitres: fenetre.CHAPTERS ?? [], quizBis: fenetre.QUIZ_BIS ?? {} };
}
```

- [ ] **Step 8 : relancer le test**

Run : `npx vitest run scripts/bph`
Expected : PASS (4 tests).

- [ ] **Step 9 : point d'entrée** — `scripts/convertir-bph.ts`

```ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { chargerSourcesBph, convertirBph } from './bph/convertir';
import { schemaCoursImport } from '../src/lib/contenu/format-import';

const dossier = process.argv[2];
if (!dossier) throw new Error('Usage : npx tsx scripts/convertir-bph.ts <dossier site du cours BPH>');

const { chapitres, quizBis } = chargerSourcesBph(dossier);
const cours = schemaCoursImport.parse(convertirBph(chapitres, quizBis));
mkdirSync('contenu/1re-st2s', { recursive: true });
writeFileSync('contenu/1re-st2s/bph.json', JSON.stringify(cours, null, 2) + '\n');
const total = cours.chapitres.reduce((n, c) => n + c.questions.length, 0);
console.log(`${cours.chapitres.length} chapitres et ${total} questions écrits dans contenu/1re-st2s/bph.json`);
```

- [ ] **Step 10 : lancer la conversion**

Run : `npx tsx scripts/convertir-bph.ts "../BPH 1ST/site"`
Expected : `7 chapitres et … questions écrits dans contenu/1re-st2s/bph.json`.

- [ ] **Step 11 : commit**

```bash
git add src/lib/contenu scripts contenu
git commit -m "Ajoute le format d'import du contenu et convertit le cours BPH"
```

---

### Task 6 : import du contenu en base

**Files :**
- Create : `scripts/importer-contenu.ts`

**Interfaces :**
- Consumes : `schemaCoursImport`, `CoursImport` (Task 5), tables de la Task 2, `SUPABASE_SERVICE_ROLE_KEY`.
- Produces : commande `npx tsx --env-file=.env.local scripts/importer-contenu.ts <fichier.json> [--publier]`. L'import est **idempotent** : relancé, il met à jour au lieu de dupliquer (cours par `slug`, chapitre par `(cours_id, slug)`, question par `source`).

- [ ] **Step 1 : écrire le script**

```ts
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { schemaCoursImport, type QuestionImport } from '../src/lib/contenu/format-import';
import type { Database } from '../src/lib/supabase/types';

const [fichier, option] = process.argv.slice(2);
if (!fichier) throw new Error('Usage : npx tsx --env-file=.env.local scripts/importer-contenu.ts <fichier.json> [--publier]');
const publier = option === '--publier';

const db = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

function verifier<T>(r: { data: T; error: { message: string } | null }, contexte: string): NonNullable<T> {
  if (r.error || r.data == null) throw new Error(`${contexte} : ${r.error?.message ?? 'aucune donnée'}`);
  return r.data as NonNullable<T>;
}

function corrige(q: QuestionImport) {
  switch (q.type) {
    case 'qcm_unique':
    case 'qcm_multiple':
      return { bonnes_reponses: q.bonnes_reponses, reponses_acceptees: [], marge: null, marge_relative: false };
    case 'vrai_faux':
      return { bonnes_reponses: [q.bonne_reponse], reponses_acceptees: [], marge: null, marge_relative: false };
    case 'reponse_courte':
      return { bonnes_reponses: [], reponses_acceptees: q.reponses_acceptees, marge: q.marge ?? null, marge_relative: q.marge_relative };
  }
}

// Pas d'await au niveau supérieur : le projet est en CommonJS.
async function main() {
const cours = schemaCoursImport.parse(JSON.parse(readFileSync(fichier, 'utf8')));

const filiere = verifier(await db.from('filiere').select('id').eq('code', cours.filiere).single(), `Filière ${cours.filiere}`);
const { id: coursId } = verifier(await db.from('cours').upsert({
  slug: cours.slug, filiere_id: filiere.id, niveau_code: cours.niveau, matiere: cours.matiere,
  titre: cours.titre, couleur: cours.couleur, publie,
}, { onConflict: 'slug' }).select('id').single(), `Cours ${cours.slug}`);

let total = 0;
for (const ch of cours.chapitres) {
  const { id: chapitreId } = verifier(await db.from('chapitre').upsert({
    cours_id: coursId, slug: ch.slug, numero: ch.numero, titre: ch.titre, titre_court: ch.titre_court ?? null,
    duree: ch.duree ?? null, resume: ch.resume ?? null, chapeau: ch.chapeau ?? null, objectifs: ch.objectifs,
    sections: ch.sections, a_retenir: ch.a_retenir ?? null, publie,
  }, { onConflict: 'cours_id,slug' }).select('id').single(), `Chapitre ${ch.slug}`);

  for (const q of ch.questions) {
    let notionId: string | null = null;
    if (q.notion) {
      notionId = verifier(await db.from('notion').upsert({ chapitre_id: chapitreId, nom: q.notion },
        { onConflict: 'chapitre_id,nom' }).select('id').single(), `Notion ${q.notion}`).id;
    }
    const { id: questionId } = verifier(await db.from('question').upsert({
      source: q.source, chapitre_id: chapitreId, notion_id: notionId, type: q.type, enonce: q.enonce,
      propositions: 'propositions' in q ? q.propositions : [], difficulte: q.difficulte, statut: q.statut,
      modifie_le: new Date().toISOString(),
    }, { onConflict: 'source' }).select('id').single(), `Question ${q.source}`);
    verifier(await db.from('question_corrige').upsert({
      question_id: questionId, explication: q.explication, ...corrige(q),
    }).select('question_id').single(), `Corrigé ${q.source}`);
    total++;
  }
}
console.log(`Importé : ${cours.titre}, ${cours.chapitres.length} chapitres, ${total} questions${publier ? ' (publié)' : ' (non publié)'}.`);
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
```

Indenter le corps de `main` à l'écriture du fichier.

- [ ] **Step 2 : importer deux fois pour vérifier l'idempotence**

Run : `npx tsx --env-file=.env.local scripts/importer-contenu.ts contenu/1re-st2s/bph.json --publier` (deux fois)
Expected : le même message les deux fois. Puis vérifier dans Studio, avec l'éditeur SQL :

```sql
select (select count(*) from cours) as cours, (select count(*) from chapitre) as chapitres,
       (select count(*) from question) as questions, (select count(*) from question_corrige) as corriges;
```

Expected : `1 | 7 | N | N`, avec N égal au total affiché par la Task 5 (aucun doublon).

- [ ] **Step 3 : ajouter le script npm** dans `package.json` : `"import:contenu": "tsx --env-file=.env.local scripts/importer-contenu.ts"`, et compléter `"db:reset"` en `"supabase db reset && npm run import:contenu -- contenu/1re-st2s/bph.json --publier"` pour que la base locale contienne toujours le cours.

- [ ] **Step 4 : commit**

```bash
git add scripts package.json
git commit -m "Ajoute l'import idempotent du contenu en base"
```

---

### Task 7 : système visuel et mise en page

**Files :**
- Create : `src/styles/chapitre.css`, `src/components/EnTete.tsx`, `src/components/BanniereEssai.tsx`, `src/lib/acces/essai.ts` (+ `.test.ts`), `src/app/(app)/layout.tsx`
- Modify : `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces :**
- Consumes : `deconnecter` (Task 4), `creerClientServeur` (Task 3).
- Produces : `joursEssaiRestants(inscritLe: Date, maintenant: Date): number` ; composants `EnTete({ prenom })`, `BanniereEssai({ joursRestants })` ; jetons CSS `--couleur-cours` (chaque page de cours le définit), `--encre`, `--attenue`, `--trait`, `--surface`, `--papier`, `--accent`, `--succes`, `--danger`, `--rayon`, `--police-corps`, `--police-titres`, `--police-mono`.

Avant d'écrire le CSS, charger les skills **frontend-design** et **ui-ux-pro-max**. Objectif visuel : garder la base du site BPH (lisible, sobre, schémas SVG) et la rendre plus **scolaire et ludique** : une couleur par matière, des titres arrondis et chaleureux, des cartes avec une légère ombre, des micro-animations (respectant `prefers-reduced-motion`), un mode sombre. Les jetons et les noms de classes de cette tâche sont l'interface : les skills affinent les valeurs, pas les noms.

- [ ] **Step 1 : test des jours d'essai** — `src/lib/acces/essai.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { joursEssaiRestants } from './essai';

const inscription = new Date('2026-11-03T10:00:00Z');

describe('joursEssaiRestants', () => {
  it('vaut 7 le jour de l’inscription', () => {
    expect(joursEssaiRestants(inscription, new Date('2026-11-03T12:00:00Z'))).toBe(7);
  });
  it('arrondit à la journée supérieure', () => {
    expect(joursEssaiRestants(inscription, new Date('2026-11-09T09:00:00Z'))).toBe(2);
  });
  it('vaut 0 une fois l’essai terminé', () => {
    expect(joursEssaiRestants(inscription, new Date('2026-11-10T10:00:00Z'))).toBe(0);
    expect(joursEssaiRestants(inscription, new Date('2026-12-01T00:00:00Z'))).toBe(0);
  });
});
```

- [ ] **Step 2 : lancer le test**

Run : `npx vitest run src/lib/acces`
Expected : FAIL.

- [ ] **Step 3 : implémenter** — `src/lib/acces/essai.ts`

```ts
export const DUREE_ESSAI_JOURS = 7;
const JOUR_MS = 24 * 60 * 60 * 1000;

export function joursEssaiRestants(inscritLe: Date, maintenant: Date): number {
  const fin = inscritLe.getTime() + DUREE_ESSAI_JOURS * JOUR_MS;
  return Math.max(0, Math.ceil((fin - maintenant.getTime()) / JOUR_MS));
}
```

- [ ] **Step 4 : relancer le test**

Run : `npx vitest run src/lib/acces`
Expected : PASS (3 tests).

- [ ] **Step 5 : reprendre les styles des schémas du site BPH** — créer `src/styles/chapitre.css`

Copier depuis `../BPH 1ST/site/index.html` (bloc `<style>`) toutes les règles dont le sélecteur commence par `.fig`, `.tbl`, `.def`, `.warn`, `.grid`, `.tool`, `.mono`, `.small` ou `.num`. Ce sont les classes utilisées dans le HTML des sections, vérifiées avec `grep -o 'class="[^"]*"' site/ch*.js`. Puis :
- préfixer chaque sélecteur par `.contenu-chapitre ` ;
- remplacer `var(--ch)` par `var(--couleur-cours)`, `var(--ink)` par `var(--encre)`, `var(--muted)` par `var(--attenue)`, `var(--line)` par `var(--trait)`, `var(--paper)` par `var(--papier)`, `var(--body)` par `var(--police-corps)`, `var(--mono)` par `var(--police-mono)`. Garder `var(--surface)`.
- Si `var(--alt)` apparaît, le remplacer par `var(--accent)`.

Vérification : `grep -oE 'var\(--[a-z-]+\)' src/styles/chapitre.css | sort -u` ne doit lister que des jetons de la liste « Produces » ci-dessus.

- [ ] **Step 6 : jetons et styles de base** — remplacer `src/app/globals.css`

```css
@import "tailwindcss";
@import "../styles/chapitre.css";

:root {
  --encre: #1c1b29; --attenue: #5b5d72; --trait: #e3e1ee; --surface: #ffffff; --papier: #f7f5ff;
  --accent: #f59e0b; --succes: #16a34a; --danger: #dc2626; --couleur-cours: #4f46e5;
  --rayon: 14px;
  --police-titres: "Fredoka", "Nunito", system-ui, sans-serif;
  --police-corps: "Nunito", system-ui, sans-serif;
  --police-mono: ui-monospace, "SF Mono", Menlo, monospace;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root {
    --encre: #eeedf7; --attenue: #a8a9be; --trait: #2f2e44; --surface: #1b1a2b; --papier: #131222;
    color-scheme: dark;
  }
}

body { background: var(--papier); color: var(--encre); font-family: var(--police-corps); font-size: 17px; line-height: 1.6; margin: 0; }
h1, h2, h3 { font-family: var(--police-titres); line-height: 1.2; }
a { color: var(--couleur-cours); }

.conteneur { max-width: 860px; margin: 0 auto; padding: 0 16px 48px; }
.carte { background: var(--surface); border: 1px solid var(--trait); border-radius: var(--rayon); padding: 20px; box-shadow: 0 2px 0 var(--trait); }

.bouton { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 20px;
  border-radius: 999px; border: 2px solid transparent; font: 700 16px var(--police-titres); cursor: pointer;
  transition: transform .15s ease; }
.bouton:active { transform: scale(.97); }
.bouton:disabled { opacity: .6; cursor: progress; }
.bouton-principal { background: var(--couleur-cours); color: #fff; box-shadow: 0 4px 0 color-mix(in srgb, var(--couleur-cours) 70%, #000); }
.bouton-secondaire { background: var(--surface); color: var(--encre); border-color: var(--trait); }

.formulaire { display: grid; gap: 16px; }
.formulaire label { display: grid; gap: 6px; font-weight: 700; }
.formulaire input:not([type=radio]):not([type=checkbox]), .formulaire select {
  min-height: 48px; padding: 0 14px; border: 2px solid var(--trait); border-radius: 12px; background: var(--surface); color: var(--encre); font: inherit; }
.formulaire fieldset { border: 2px solid var(--trait); border-radius: 12px; display: flex; flex-wrap: wrap; gap: 16px; }
.formulaire .case, .formulaire fieldset label { display: flex; align-items: center; gap: 8px; font-weight: 400; }
.message-erreur { color: var(--danger); font-weight: 700; margin: 0; }
.message-info { color: var(--succes); font-weight: 700; margin: 0; }

.page-auth { max-width: 420px; margin: 0 auto; padding: 48px 16px; display: grid; gap: 16px; }

@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
```

- [ ] **Step 7 : polices et mise en page racine** — `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';

const fredoka = Fredoka({ subsets: ['latin'], variable: '--police-fredoka' });
const nunito = Nunito({ subsets: ['latin'], variable: '--police-nunito' });

export const metadata: Metadata = {
  title: { default: 'App lycée', template: '%s · App lycée' },
  description: 'Cours détaillés, quiz et évaluations pour réussir au lycée.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Dans `globals.css`, remplacer les valeurs de `--police-titres` et `--police-corps` par `var(--police-fredoka), system-ui, sans-serif` et `var(--police-nunito), system-ui, sans-serif`. Le nom « App lycée » est provisoire (voir spec, section 13).

- [ ] **Step 8 : en-tête et bannière d'essai**

`src/components/EnTete.tsx`

```tsx
import Link from 'next/link';
import { deconnecter } from '@/app/(auth)/actions';

export function EnTete({ prenom }: { prenom: string | null }) {
  return (
    <header className="en-tete">
      <Link href="/" className="logo">App lycée</Link>
      <nav aria-label="Navigation principale"><Link href="/">Mes cours</Link></nav>
      <form action={deconnecter}>
        <button type="submit" className="bouton bouton-secondaire" aria-label="Se déconnecter">
          {prenom ?? 'Mon compte'} · Quitter
        </button>
      </form>
    </header>
  );
}
```

`src/components/BanniereEssai.tsx`

```tsx
export function BanniereEssai({ joursRestants }: { joursRestants: number }) {
  if (joursRestants === 0) {
    return <p className="banniere banniere-fin" role="status">Ton essai est terminé. Bientôt : choisis ton cours gratuit ou abonne-toi.</p>;
  }
  return (
    <p className="banniere" role="status">
      🎁 Essai gratuit : encore <strong>{joursRestants} jour{joursRestants > 1 ? 's' : ''}</strong> pour découvrir tous les cours.
    </p>
  );
}
```

Ajouter à `globals.css` :

```css
.en-tete { display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: var(--surface); border-bottom: 1px solid var(--trait); position: sticky; top: 0; z-index: 10; }
.en-tete nav { flex: 1; }
.logo { font: 700 22px var(--police-titres); color: var(--couleur-cours); text-decoration: none; }
.banniere { margin: 16px auto; max-width: 860px; padding: 12px 16px; border-radius: var(--rayon); background: color-mix(in srgb, var(--accent) 18%, var(--surface)); }
.banniere-fin { background: color-mix(in srgb, var(--danger) 12%, var(--surface)); }
@media (max-width: 520px) { .en-tete nav { display: none; } }
```

- [ ] **Step 9 : mise en page des pages connectées** — `src/app/(app)/layout.tsx`

```tsx
import { redirect } from 'next/navigation';
import { creerClientServeur } from '@/lib/supabase/server';
import { joursEssaiRestants } from '@/lib/acces/essai';
import { EnTete } from '@/components/EnTete';
import { BanniereEssai } from '@/components/BanniereEssai';

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const supabase = await creerClientServeur();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');
  const { data: profil } = await supabase.from('profil')
    .select('nom, role, onboarding_termine, inscrit_le').eq('id', user.id).single();
  if (!profil?.onboarding_termine) redirect('/bienvenue');
  const eleve = profil.role === 'eleve';
  return (
    <>
      <EnTete prenom={profil.nom} />
      {eleve && <BanniereEssai joursRestants={joursEssaiRestants(new Date(profil.inscrit_le), new Date())} />}
      <main className="conteneur">{children}</main>
    </>
  );
}
```

- [ ] **Step 10 : vérifier**

Run : `npm test && npm run typecheck && npm run build`
Expected : PASS.

- [ ] **Step 11 : commit**

```bash
git add src
git commit -m "Ajoute le système visuel, l'en-tête et la bannière d'essai"
```

---

### Task 8 : catalogue des cours et lecture des chapitres

**Files :**
- Create : `src/lib/contenu/requetes.ts`, `src/components/CarteCours.tsx`, `src/components/ContenuChapitre.tsx`, `src/app/(app)/page.tsx`, `src/app/(app)/cours/[slug]/page.tsx`, `src/app/(app)/cours/[slug]/[chapitre]/page.tsx`

**Interfaces :**
- Consumes : `creerClientServeur` (Task 3), tables et RLS (Task 2), contenu importé (Task 6).
- Produces : `listerCoursDuProfil()`, `lireCours(slug: string)`, `lireChapitre(coursSlug: string, chapitreSlug: string)`. Chaque fonction renvoie `null` (ou `[]`) si la RLS ne donne pas accès, et la page affiche alors un message clair au lieu d'une erreur.

Le HTML des sections vient uniquement de la base, et seul `admin_contenu` peut l'écrire (RLS, Task 2). C'est pour cette raison qu'il est affiché tel quel avec `dangerouslySetInnerHTML`.

- [ ] **Step 1 : requêtes** — `src/lib/contenu/requetes.ts`

```ts
import { creerClientServeur } from '@/lib/supabase/server';

export type Section = { id: string; titre: string; html: string };

export async function listerCoursDuProfil() {
  const supabase = await creerClientServeur();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: profil } = await supabase.from('profil').select('filiere_id, niveau_code').eq('id', user.id).single();
  if (!profil?.filiere_id || !profil.niveau_code) return [];
  const { data } = await supabase.from('cours')
    .select('id, slug, titre, matiere, couleur, chapitre(count)')
    .eq('filiere_id', profil.filiere_id).eq('niveau_code', profil.niveau_code).order('ordre');
  return (data ?? []).map((c) => ({ ...c, nbChapitres: c.chapitre[0]?.count ?? 0 }));
}

export async function lireCours(slug: string) {
  const supabase = await creerClientServeur();
  const { data } = await supabase.from('cours')
    .select('id, slug, titre, matiere, couleur, chapitre(slug, numero, titre, titre_court, resume, duree)')
    .eq('slug', slug).order('numero', { referencedTable: 'chapitre' }).maybeSingle();
  return data;
}

export async function lireChapitre(coursSlug: string, chapitreSlug: string) {
  const cours = await lireCours(coursSlug);
  if (!cours) return null;
  const supabase = await creerClientServeur();
  const { data } = await supabase.from('chapitre')
    .select('slug, numero, titre, duree, chapeau, objectifs, sections, a_retenir')
    .eq('cours_id', cours.id).eq('slug', chapitreSlug).maybeSingle();
  if (!data) return null;
  const index = cours.chapitre.findIndex((c) => c.slug === chapitreSlug);
  return {
    cours, chapitre: { ...data, sections: data.sections as Section[] },
    precedent: cours.chapitre[index - 1] ?? null, suivant: cours.chapitre[index + 1] ?? null,
  };
}
```

- [ ] **Step 2 : carte de cours et page d'accueil**

`src/components/CarteCours.tsx`

```tsx
import Link from 'next/link';

type Props = { slug: string; titre: string; matiere: string; couleur: string; nbChapitres: number };

export function CarteCours({ slug, titre, matiere, couleur, nbChapitres }: Props) {
  return (
    <Link href={`/cours/${slug}`} className="carte carte-cours" style={{ '--couleur-cours': couleur } as React.CSSProperties}>
      <span className="pastille">{matiere}</span>
      <h2>{titre}</h2>
      <p>{nbChapitres} chapitre{nbChapitres > 1 ? 's' : ''}</p>
    </Link>
  );
}
```

`src/app/(app)/page.tsx`

```tsx
import { listerCoursDuProfil } from '@/lib/contenu/requetes';
import { CarteCours } from '@/components/CarteCours';

export const metadata = { title: 'Mes cours' };

export default async function Accueil() {
  const cours = await listerCoursDuProfil();
  return (
    <>
      <h1>Mes cours</h1>
      {cours.length === 0
        ? <p className="carte">Les cours de ta filière arrivent bientôt. Reviens vite !</p>
        : <div className="grille-cours">{cours.map((c) => <CarteCours key={c.id} {...c} />)}</div>}
    </>
  );
}
```

Ajouter à `globals.css` :

```css
.grille-cours { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
.carte-cours { display: grid; gap: 8px; text-decoration: none; color: var(--encre); border-top: 6px solid var(--couleur-cours); transition: transform .15s ease; }
.carte-cours:hover { transform: translateY(-3px); }
.carte-cours h2 { margin: 0; font-size: 20px; }
.pastille { justify-self: start; padding: 2px 10px; border-radius: 999px; font-size: 13px; font-weight: 700;
  background: color-mix(in srgb, var(--couleur-cours) 15%, var(--surface)); color: var(--couleur-cours); }
.liste-chapitres { list-style: none; padding: 0; display: grid; gap: 12px; }
.liste-chapitres a { display: flex; gap: 14px; align-items: center; text-decoration: none; color: var(--encre); }
.numero-chapitre { flex: none; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center;
  background: var(--couleur-cours); color: #fff; font: 700 18px var(--police-titres); }
.navigation-chapitres { display: flex; justify-content: space-between; gap: 12px; margin-top: 32px; flex-wrap: wrap; }
.a-retenir { border-left: 6px solid var(--accent); }
```

- [ ] **Step 3 : page d'un cours** — `src/app/(app)/cours/[slug]/page.tsx`

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lireCours } from '@/lib/contenu/requetes';

export default async function PageCours({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cours = await lireCours(slug);
  if (!cours) notFound();
  return (
    <div style={{ '--couleur-cours': cours.couleur } as React.CSSProperties}>
      <p className="pastille">{cours.matiere}</p>
      <h1>{cours.titre}</h1>
      {cours.chapitre.length === 0 ? (
        <p className="carte">Ton essai est terminé : ce cours n’est plus accessible pour le moment.</p>
      ) : (
        <ol className="liste-chapitres">
          {cours.chapitre.map((ch) => (
            <li key={ch.slug}>
              <Link href={`/cours/${cours.slug}/${ch.slug}`} className="carte">
                <span className="numero-chapitre">{ch.numero}</span>
                <span><strong>{ch.titre}</strong><br /><small>{ch.resume}</small></span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
```

- [ ] **Step 4 : contenu et page d'un chapitre**

`src/components/ContenuChapitre.tsx`

```tsx
import type { Section } from '@/lib/contenu/requetes';

export function ContenuChapitre({ sections, aRetenir }: { sections: Section[]; aRetenir: string | null }) {
  return (
    <div className="contenu-chapitre">
      {sections.map((s) => (
        <section key={s.id} id={s.id}>
          <h2>{s.titre}</h2>
          <div dangerouslySetInnerHTML={{ __html: s.html }} />
        </section>
      ))}
      {aRetenir && (
        <section id="a-retenir" className="carte a-retenir">
          <h2>Je retiens</h2>
          <div dangerouslySetInnerHTML={{ __html: aRetenir }} />
        </section>
      )}
    </div>
  );
}
```

`src/app/(app)/cours/[slug]/[chapitre]/page.tsx`

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lireChapitre } from '@/lib/contenu/requetes';
import { ContenuChapitre } from '@/components/ContenuChapitre';

type Params = { params: Promise<{ slug: string; chapitre: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug, chapitre } = await params;
  const r = await lireChapitre(slug, chapitre);
  return { title: r?.chapitre.titre ?? 'Chapitre' };
}

export default async function PageChapitre({ params }: Params) {
  const { slug, chapitre } = await params;
  const r = await lireChapitre(slug, chapitre);
  if (!r) notFound();
  const { cours, chapitre: ch, precedent, suivant } = r;
  return (
    <article style={{ '--couleur-cours': cours.couleur } as React.CSSProperties}>
      <Link href={`/cours/${cours.slug}`}>← {cours.titre}</Link>
      <p className="pastille">Chapitre {ch.numero}{ch.duree ? ` · ${ch.duree}` : ''}</p>
      <h1>{ch.titre}</h1>
      {ch.chapeau && <p><strong>{ch.chapeau}</strong></p>}
      {ch.objectifs.length > 0 && (
        <div className="carte">
          <h2>À la fin du chapitre, tu sais :</h2>
          <ul>{ch.objectifs.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
      )}
      <ContenuChapitre sections={ch.sections} aRetenir={ch.a_retenir} />
      <nav className="navigation-chapitres" aria-label="Chapitres">
        {precedent ? <Link className="bouton bouton-secondaire" href={`/cours/${cours.slug}/${precedent.slug}`}>← {precedent.titre_court ?? precedent.titre}</Link> : <span />}
        {suivant && <Link className="bouton bouton-principal" href={`/cours/${cours.slug}/${suivant.slug}`}>{suivant.titre_court ?? suivant.titre} →</Link>}
      </nav>
    </article>
  );
}
```

- [ ] **Step 5 : vérification visuelle** — `npm run dev`, se connecter avec un compte de filière ST2S et de niveau 1re, ouvrir les 7 chapitres. Comparer chaque schéma avec l'ancien site (`../BPH 1ST/dist/index.html`) : ils doivent être lisibles, en couleur, et défiler horizontalement sur mobile (largeur 375 px) sans faire déborder la page. Vérifier aussi le mode sombre.

- [ ] **Step 6 : vérifier**

Run : `npm run typecheck && npm run build`
Expected : PASS.

- [ ] **Step 7 : commit**

```bash
git add src
git commit -m "Ajoute le catalogue des cours et la lecture des chapitres"
```

---

### Task 9 : parcours de bout en bout et revue de l'étape

**Files :**
- Create : `e2e/parcours-lecture.spec.ts`, `README.md`

**Interfaces :**
- Consumes : toutes les pages précédentes, base locale réinitialisée avec le cours BPH (`npm run db:reset`).

- [ ] **Step 1 : test de bout en bout** — `e2e/parcours-lecture.spec.ts`

```ts
import { expect, test } from '@playwright/test';

test('un élève s’inscrit, choisit sa filière et lit un chapitre', async ({ page }) => {
  const email = `eleve-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.local`;

  await page.goto('/');
  await expect(page).toHaveURL(/\/connexion$/);

  await page.getByRole('link', { name: 'Créer un compte' }).click();
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByLabel('Mot de passe').fill('motdepasse-test');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();

  await expect(page).toHaveURL(/\/bienvenue$/);
  await page.getByLabel('Ton prénom').fill('Léa');
  await page.getByLabel('Ta filière').selectOption({ label: 'ST2S — Sciences et technologies de la santé et du social' });
  await page.getByLabel('Première').check();
  await page.getByRole('button', { name: 'C’est parti !' }).click();

  await expect(page.getByRole('heading', { name: 'Mes cours' })).toBeVisible();
  await expect(page.getByText(/Essai gratuit : encore 7 jours/)).toBeVisible();
  await page.getByRole('link', { name: /Biologie et physiopathologie humaines/ }).click();

  await page.getByRole('link', { name: /Organisation générale de l'organisme humain/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: "Organisation générale de l'organisme humain" })).toBeVisible();
  await expect(page.locator('.contenu-chapitre svg').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Je retiens' })).toBeVisible();
});

test('un visiteur non connecté ne peut pas lire un chapitre', async ({ page }) => {
  await page.goto('/cours/bph-1re-st2s/ch1');
  await expect(page).toHaveURL(/\/connexion$/);
});
```

- [ ] **Step 2 : lancer tous les tests**

Run : `npm run db:reset && npm test && npm run test:db && npm run e2e`
Expected : tout passe, sur les projets `mobile` et `ordinateur`.

- [ ] **Step 3 : README** — `README.md`

```markdown
# App lycée (nom provisoire)

Cours détaillés, quiz et évaluations pour les lycéens, de la seconde à la terminale.

- Spec : `docs/superpowers/specs/2026-11-03-app-lycee-design.md`
- Feuille de route : `docs/superpowers/plans/2026-11-03-feuille-de-route.md`

## Démarrer en local

Prérequis : Node.js 24 et Docker (Docker Desktop ou OrbStack) lancé.

1. `npm install`
2. `npm run db:start`, puis copier `.env.example` en `.env.local` et y mettre les clés affichées par `npx supabase status`.
3. `npm run db:reset` (crée la base et importe le cours BPH 1re ST2S).
4. `npm run dev`, puis ouvrir http://localhost:3000.

## Tests

- `npm test` : règles de l'application (Vitest)
- `npm run test:db` : règles d'accès de la base (pgTAP)
- `npm run e2e` : parcours complets (Playwright)

## Contenu

Le contenu entre en base uniquement par des fichiers JSON validés (`src/lib/contenu/format-import.ts`) :
`npm run import:contenu -- contenu/1re-st2s/bph.json --publier`.
```

- [ ] **Step 4 : commit**

```bash
git add e2e README.md
git commit -m "Ajoute le parcours de bout en bout et le README"
```

- [ ] **Step 5 : revue de fin d'étape (Opus)** — lancer le skill **security-review** sur la branche, centré sur la migration (RLS, fonctions `security definer`, droits sur `profil`), le proxy et les server actions. Puis **superpowers:requesting-code-review** pour la revue générale. Corriger les points bloquants, avec un commit par correction.

- [ ] **Step 6 : vérification finale** — suivre **superpowers:verification-before-completion** : relancer `npm run typecheck && npm test && npm run test:db && npm run e2e && npm run build` et joindre la sortie au rapport de l'étape.
