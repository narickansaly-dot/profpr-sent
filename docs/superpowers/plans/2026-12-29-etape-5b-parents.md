# Étape 5b : comptes parents, CGV et fondations des abonnements — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** un parent a un compte relié à ses enfants. Il y voit, pour chacun, le consentement, l'abonnement et la progression. Il peut retirer son accord, ce qui bloque le compte de l'enfant puis le supprime. La table des abonnements existe et ouvre tous les cours, sans Stripe pour l'instant. Une trame de CGV est publiée.

**Architecture :**
- **Données** : trois migrations :
  - `abonnement` et la règle d'accès ;
  - `lien_parent` et les liaisons ;
  - les lectures du parent et le retrait.
- **Fonctions** : toute lecture ou écriture d'un parent passe par des RPC `security definer` qui vérifient le lien. Aucun droit direct sur les nouvelles tables.
- **Liaison** :
  - moins de 15 ans : par l'adresse e-mail confirmée du compte parent, égale à celle qui a donné l'accord (`lier_par_email`) ;
  - 15 ans et plus : par un code à usage unique (`generer_code_parent`, `lier_par_code`).
- **Interface** :
  - un espace `/parent` dans le groupe `(app)` ;
  - le choix « parent » sur `/bienvenue` ;
  - une section « Parents reliés » dans « Mes données » ;
  - l'écran de retrait sur `/consentement` ;
  - la page `/conditions-vente`.

**Tech Stack :** Next.js 16, React 19, TypeScript, zod 4, Supabase (Postgres 17, plpgsql, pgcrypto, pg_cron), Vitest, pgTAP, Playwright, Mailpit.

**Spec :** `docs/superpowers/specs/2026-12-29-etape-5b-parents-design.md`. La spec générale `2026-11-03-app-lycee-design.md` reste la référence pour tout le reste.

**Branche :** `etape-5b-parents`, créée depuis `etape-5a-rgpd`. Sa PR visera `etape-5a-rgpd` (PR n° 8).

## Décisions prises dans ce plan

1. **Étendre une fonction longue sans recopier son corps.** Pour `demander_consentement`, `exporter_mes_donnees` et `purges_quotidiennes`, la fonction existante est renommée et déplacée dans `prive` (suffixe `_5a`, sans aucun droit), puis appelée par la nouvelle fonction qui reprend le nom public. Le corps validé à l'étape 5a reste ainsi intact, et la tâche `pg_cron` appelle toujours `prive.purges_quotidiennes()` par son nom. Les fonctions courtes (`acces_cours`, `consentement_requis`, `mon_acces`, `annuler_suppression_compte`) sont recopiées en entier avec leur changement.
2. **`lier_par_code` renvoie un statut au lieu de lever une erreur** pour un code faux : une exception annulerait l'incrément du compteur d'essais. Les statuts sont `lie`, `code_parent_invalide` et `essais_code_epuises`. L'action serveur traduit le statut avec `messageErreur`.
3. **Un compte parent n'a accès à aucun cours** : `prive.acces_cours` renvoie `false` pour tout rôle autre que élève, enseignant ou admin. Sans cette règle, un parent aurait profité de l'essai de 7 jours.
4. **Codes d'erreur ajoutés à la spec avec ce plan** : `reserve_15_ans` (code demandé par un moins de 15 ans), `lien_introuvable`, `retrait_impossible`, `nom_parent_invalide`.
5. **Annuler un retrait efface toute demande de suppression du compte de l'enfant**, y compris une demande que l'élève aurait faite lui-même avant. C'est un cas rare, accepté et noté dans le bilan.
6. **Code parent** : 8 caractères dans l'alphabet `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (31 signes, 31⁸ ≈ 8,5 × 10¹¹ possibilités). Il est saisi sans tenir compte de la casse, des espaces ni des tirets, et affiché par groupes de 4 (`ABCD-EFGH`).

## Contraintes globales

- Toute l'interface est **en français**. On tutoie l'élève et on vouvoie le parent, sur toutes ses pages. Les formulations ne sont pas genrées.
- Typographie française : espace insécable (U+00A0) avant « : ; ! ? » dans tout texte visible. Dans le code TypeScript, on écrit ` ` dans les chaînes et `&nbsp;` en JSX. Les textes produits en SQL évitent ces signes.
- **Écritures en base uniquement par RPC `security definer`**, avec `set search_path = ''` et des noms qualifiés :
  - fonctions publiques : `revoke execute … from public, anon` puis `grant execute … to authenticated` ;
  - helpers : dans `prive`, avec `revoke execute … from public`.
  - Aucune nouvelle fonction n'est ouverte à `anon`.
- Les RPC réservées aux élèves lèvent `reserve_eleves`. Celles réservées aux parents lèvent `pas_parent`.
- Les codes d'erreur sont des mots-clés `snake_case`, traduits dans `src/lib/erreurs.ts`, avec un test du texte exact. Aucun nouveau code n'est sous-chaîne d'un code existant, ni l'inverse : vérifier avec `grep` avant d'ajouter.
- Un test pgTAP ne compte que ses propres lignes, car la base locale contient des comptes de démo. Chaque test crée ses utilisateurs dans `auth.users` avec des UUID propres au fichier (motif `…05b1`, `…05b2`, etc.).
- Commandes shell : préfixer par `export PATH="$HOME/.orbstack/bin:$PATH";`. Préfixer les commandes git par `DEVELOPER_DIR=/Library/Developer/CommandLineTools` (licence Xcode non acceptée).
- Ne jamais afficher ni commiter `.env.local`. La clé de service n'est utilisée que dans `scripts/` et les aides e2e, derrière la garde « base locale ».
- Après chaque migration : `npm run db:reset`, puis `npx supabase gen types typescript --local > src/lib/supabase/types.ts`.
- Avant d'utiliser une API (Next.js 16, supabase-js), consulter sa documentation à jour avec **context7**.
- La CSP stricte de l'étape 4c reste en place : aucune page ne déclenche de violation (`e2e/securite.spec.ts`), et toute nouvelle page passe la revue axe (`e2e/accessibilite.spec.ts`).
- Les formulaires suivent `FormulaireEcheance` : `useActionState`, `aria-invalid` sur le seul champ en cause, `aria-describedby`, valeurs renvoyées. Ils restent utilisables à 375 px.
- Les actions irréversibles (retrait, déliaison) demandent une confirmation dans la page : une case à cocher, puis le bouton. Jamais de `confirm()` du navigateur.
- Messages de commit en français, à l'impératif présent, terminés par la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hors périmètre

- Stripe : paiement, webhooks, portail client, prix. C'est l'étape 5c.
- E-mails envoyés aux parents en dehors de la demande d'accord existante.
- Accès d'un parent au calendrier, aux réponses ou aux classes de l'enfant.

## Répartition des modèles

| Tâche | Implémentation | Revue |
|---|---|---|
| 1 Fondations des abonnements et règle d'accès | Sonnet | **Opus** |
| 2 Liens parents : rôle, liaisons, déliaison | Sonnet | **Opus** |
| 3 Lectures du parent, retrait, export, purge | Sonnet | **Opus** |
| 4 Interface : choix parent, redirections, bannière | Sonnet | Sonnet |
| 5 Interface : espace parent | Sonnet | Sonnet |
| 6 Interface élève : parents reliés, retrait, page d'accord | Sonnet | Sonnet |
| 7 CGV, confidentialité, pied de page | Sonnet | Sonnet |
| 8 Bout en bout, bilan, revue finale | Sonnet, puis revue finale **Opus** | — |

Les tâches 1, 2 et 3 touchent la base locale partagée : elles s'exécutent l'une après l'autre, dans cet ordre.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `supabase/migrations/20261229000001_abonnement.sql` + `supabase/tests/abonnement.test.sql` | `abonnement`, colonnes de retrait, `acces_cours`, `mon_acces` |
| `supabase/migrations/20261229000002_parents.sql` + `supabase/tests/parents.test.sql` | `lien_parent`, `devenir_parent`, `lier_par_email`, codes, `delier_parent` |
| `supabase/migrations/20261229000003_suivi_parent.sql` + `supabase/tests/suivi_parent.test.sql` | `enfants_du_parent`, `progression_enfant`, retrait, export, purge |
| `src/lib/erreurs.ts` (+ test) | nouveaux codes |
| `src/lib/acces/etat.ts`, `requetes.ts` (+ test), `src/components/BanniereEssai.tsx` (+ test) | abonnement et délai de grâce |
| `src/lib/profil/onboarding.ts` (+ test), `src/app/bienvenue/*` | choix « parent » |
| `src/app/(app)/layout.tsx`, `src/app/(app)/page.tsx`, `src/components/EnTete.tsx` | redirections et navigation du parent |
| `src/lib/parent/*` (+ tests), `src/app/(app)/parent/*`, `src/components/parent/*` | espace parent |
| `src/app/mes-donnees/*`, `src/components/donnees/ParentsRelies.tsx` | section « Parents reliés » et « Enfants suivis » |
| `src/app/consentement/page.tsx`, `src/app/accord-parental/[jeton]/*` | écran de retrait, bouton « Créer mon compte parent » |
| `src/app/(legal)/conditions-vente/page.tsx`, `confidentialite/page.tsx`, `src/components/PiedDePage.tsx`, `src/lib/routes.ts` (+ test) | pages légales |
| `e2e/parents.spec.ts`, `e2e/aide-db.ts`, `e2e/accessibilite.spec.ts`, `e2e/securite.spec.ts` | bout en bout |

---

### Task 1 : fondations des abonnements et règle d'accès

**Files :**
- Create : `supabase/migrations/20261229000001_abonnement.sql`, `supabase/tests/abonnement.test.sql`
- Modify : `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes :
  - `prive.acces_cours`, `prive.fin_essai` et `public.mon_acces`, dont le corps actuel est dans `20261222000002_consentement.sql` ;
  - `prive.consentement_requis(uuid)` ;
  - `public.en_essai()`, dont le corps actuel est dans `20261222000005_secrets.sql`.
- Produces :
  - la table `public.abonnement` ;
  - les colonnes `consentement_parental.retire_le`, `consentement_parental.retire_par` et `profil.suppression_imposee` ;
  - `prive.abonnement_actif(p_eleve uuid) returns boolean` ;
  - `public.mon_acces()`, qui renvoie en plus `abonnement jsonb`, `consentement_retire_le timestamptz` et `suppression_prevue_le timestamptz`.

- [ ] **Step 1 : écrire le test**

`supabase/tests/abonnement.test.sql` :

```sql
begin;
select plan(12);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000005b1', 'abonne@test.local'),
  ('00000000-0000-0000-0000-0000000005b2', 'grace@test.local'),
  ('00000000-0000-0000-0000-0000000005b3', 'expire@test.local'),
  ('00000000-0000-0000-0000-0000000005b4', 'parent-acces@test.local');
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005b1', 'technologique', 'ABN', 'Filière abonnement');
update public.profil set onboarding_termine = true, inscrit_le = now() - interval '30 days', moins_de_15_ans = false,
       filiere_id = '10000000-0000-0000-0000-0000000005b1', niveau_code = '1re'
 where id in ('00000000-0000-0000-0000-0000000005b1', '00000000-0000-0000-0000-0000000005b2', '00000000-0000-0000-0000-0000000005b3');
update public.profil set role = 'parent', onboarding_termine = true where id = '00000000-0000-0000-0000-0000000005b4';
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005b1', 'cours-abn-a', '10000000-0000-0000-0000-0000000005b1', '1re', 'A', 'Cours A', true);
insert into public.abonnement (eleve_id, formule, statut, fin_periode, fin_grace) values
  ('00000000-0000-0000-0000-0000000005b1', 'mensuelle', 'actif', now() + interval '20 days', null),
  ('00000000-0000-0000-0000-0000000005b2', 'annuelle', 'impaye', now() - interval '1 day', now() + interval '6 days'),
  ('00000000-0000-0000-0000-0000000005b3', 'mensuelle', 'impaye', now() - interval '10 days', now() - interval '3 days');

select is(prive.abonnement_actif('00000000-0000-0000-0000-0000000005b1'), true, 'abonnement actif');
select is(prive.abonnement_actif('00000000-0000-0000-0000-0000000005b2'), true, 'impayé pendant le délai de grâce');
select is(prive.abonnement_actif('00000000-0000-0000-0000-0000000005b3'), false, 'délai de grâce dépassé');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), true, 'un abonné lit tous les cours après l''essai');
select results_eq($$ select abonnement->>'statut', abonnement->>'formule' from public.mon_acces() $$,
  $$ values ('actif'::text, 'mensuelle'::text) $$, 'mon_acces expose l''abonnement');
select throws_ok($$ insert into public.abonnement (eleve_id, formule, statut, fin_periode) values ('00000000-0000-0000-0000-0000000005b1', 'mensuelle', 'actif', now()) $$,
  '42501', null, 'un élève n''écrit pas dans abonnement');
select throws_ok($$ update public.abonnement set fin_periode = now() + interval '5 years' $$,
  '42501', null, 'un élève ne prolonge pas son abonnement');
select is((select count(*)::int from public.abonnement), 1, 'un élève ne lit que son abonnement');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b2","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), true, 'délai de grâce : accès conservé');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b3","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), false, 'abonnement échu, sans cours gratuit : fermé');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b4","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), false, 'un parent ne lit aucun cours, même inscrit depuis peu');
select is((select count(*)::int from public.abonnement), 0, 'un parent ne lit pas abonnement directement');

select * from finish();
rollback;
```

- [ ] **Step 2 : vérifier l'échec**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db`
Expected : FAIL sur `abonnement.test.sql` (la relation `public.abonnement` n'existe pas).

- [ ] **Step 3 : écrire la migration**

`supabase/migrations/20261229000001_abonnement.sql` :

```sql
-- Fondations des abonnements (sans Stripe) et colonnes du retrait de consentement (tâches 2 et 3).

create table public.abonnement (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null unique references public.profil on delete cascade,
  payeur_id uuid references public.profil on delete set null,
  formule text not null check (formule in ('mensuelle', 'annuelle')),
  statut text not null check (statut in ('actif', 'impaye', 'resilie', 'expire')),
  fin_periode timestamptz not null,
  fin_grace timestamptz,
  stripe_client_id text unique,
  stripe_abonnement_id text unique,
  cree_le timestamptz not null default now(),
  maj_le timestamptz not null default now()
);
alter table public.abonnement enable row level security;
create policy "son abonnement" on public.abonnement for select to authenticated using (eleve_id = (select auth.uid()));
revoke all on public.abonnement from anon, authenticated;
grant select (eleve_id, formule, statut, fin_periode, fin_grace) on public.abonnement to authenticated;

create function prive.abonnement_actif(p_eleve uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.abonnement a
     where a.eleve_id = p_eleve
       and ((a.statut = 'actif' and a.fin_periode > now())
         or (a.statut = 'impaye' and a.fin_grace > now())))
$$;
revoke execute on function prive.abonnement_actif(uuid) from public;

alter table public.consentement_parental
  add column retire_le timestamptz,
  add column retire_par uuid references public.profil on delete set null;
alter table public.profil add column suppression_imposee boolean not null default false;

-- Corps de 20261222000002_consentement.sql + : aucun cours pour un autre rôle qu'élève (un parent n'a pas d'essai),
-- et l'abonnement actif ou en délai de grâce ouvre tout, avant l'essai.
create or replace function prive.acces_cours(p_eleve uuid, p_cours uuid, p_reprise boolean) returns boolean
language sql stable security definer set search_path = '' as $$
  select case
    when p_eleve is null then false
    when (select p.role from public.profil p where p.id = p_eleve) = 'admin_contenu' then true
    when not exists (select 1 from public.cours where id = p_cours and publie) then false
    when (select p.role from public.profil p where p.id = p_eleve) = 'enseignant' then true
    when (select p.role from public.profil p where p.id = p_eleve) is distinct from 'eleve' then false
    when prive.consentement_requis(p_eleve) then false
    when prive.abonnement_actif(p_eleve) then true
    else coalesce(prive.fin_essai(p_eleve) > now(), false)
      or exists (select 1 from public.acces_gratuit a where a.eleve_id = p_eleve and a.cours_id = p_cours)
      or (p_reprise and exists (select 1 from public.tentative t
                                 where t.eleve_id = p_eleve and t.cours_id = p_cours
                                   and t.statut = 'en_cours'
                                   and t.debut > now() - interval '24 hours'
                                   and t.debut <= prive.fin_essai(p_eleve)))
  end
$$;

drop function public.mon_acces();
create function public.mon_acces()
returns table (role text, en_essai boolean, fin_essai timestamptz, cours_gratuit_id uuid, changement_possible_jusqu_au timestamptz,
               consentement_requis boolean, email_parent text, consentement_envoye_le timestamptz,
               abonnement jsonb, consentement_retire_le timestamptz, suppression_prevue_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.role::text,
         case when prive.consentement_requis(p.id) then false else public.en_essai() end,
         case when prive.consentement_requis(p.id) then null else prive.fin_essai(p.id) end, c.id,
         case when c.id is not null and not a.change_utilise and a.choisi_le > now() - interval '48 hours'
              then a.choisi_le + interval '48 hours' end,
         prive.consentement_requis(p.id), k.email_parent, k.dernier_envoi_le,
         (select jsonb_build_object('formule', b.formule, 'statut', b.statut, 'fin_periode', b.fin_periode,
                                    'fin_grace', b.fin_grace, 'actif', prive.abonnement_actif(p.id))
            from public.abonnement b where b.eleve_id = p.id),
         k.retire_le,
         p.suppression_demandee_le + interval '30 days'
    from public.profil p
    left join public.acces_gratuit a on a.eleve_id = p.id
    left join public.cours c on c.id = a.cours_id and c.publie
    left join public.consentement_parental k on k.eleve_id = p.id
   where p.id = auth.uid()
$$;
revoke execute on function public.mon_acces() from public, anon;
grant execute on function public.mon_acces() to authenticated;
```

Avant d'écrire, vérifier que `prive.acces_cours` et `public.mon_acces` n'ont pas été redéfinies après `20261222000002_consentement.sql` (`grep -l "function prive.acces_cours\|function public.mon_acces" supabase/migrations/*.sql`). Si c'est le cas, partir de la version la plus récente.

- [ ] **Step 4 : appliquer et vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm run typecheck`
Expected : PASS, dont `abonnement.test.sql` 12/12 et toute la suite existante. `npm run typecheck` peut signaler `lireMonAcces` : la tâche 4 l'adapte. S'il échoue ici, ajouter seulement les trois champs à l'objet renvoyé par `src/lib/acces/requetes.ts` et au type `MonAcces` (`abonnement: AbonnementResume | null`, `consentementRetireLe: string | null`, `suppressionPrevueLe: string | null`, avec le type `AbonnementResume = { formule: 'mensuelle' | 'annuelle'; statut: string; finPeriode: string; finGrace: string | null; actif: boolean }`), et compléter l'objet `base` de `etat.test.ts`.

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261229000001_abonnement.sql supabase/tests/abonnement.test.sql src/lib/supabase/types.ts src/lib/acces
git commit -m "Ajoute la table des abonnements et l'accès complet des abonnés

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2 : liens parents — rôle, liaisons, déliaison

**Files :**
- Create : `supabase/migrations/20261229000002_parents.sql`, `supabase/tests/parents.test.sql`
- Modify : `src/lib/erreurs.ts`, `src/lib/erreurs.test.ts`, `src/lib/supabase/types.ts`

**Interfaces :**
- Consumes : `public.role_actuel()` ; les colonnes `consentement_parental.retire_le` et `profil.suppression_imposee` (tâche 1).
- Produces :
  - table `public.lien_parent(eleve_id, parent_id, origine, cree_le)` ;
  - `prive.lier(p_eleve uuid, p_parent uuid, p_origine text) returns boolean` ;
  - `public.devenir_parent(p_nom text) returns void` ;
  - `public.lier_par_email() returns int` ;
  - `public.generer_code_parent() returns text` ;
  - `public.lier_par_code(p_code text) returns text` (`lie`, `code_parent_invalide`, `essais_code_epuises`) ;
  - `public.delier_parent(p_autre uuid) returns void` ;
  - codes `pas_parent`, `deja_inscrit`, `nom_parent_invalide`, `trop_de_parents`, `reserve_15_ans`, `code_parent_invalide`, `essais_code_epuises`, `deliaison_interdite`, `lien_introuvable`.

- [ ] **Step 1 : écrire le test**

`supabase/tests/parents.test.sql` :

```sql
begin;
select plan(26);

insert into auth.users (id, email, email_confirmed_at) values
  ('00000000-0000-0000-0000-0000000005c1', 'enfant-mineur@test.local', now()),
  ('00000000-0000-0000-0000-0000000005c2', 'enfant-majeur@test.local', now()),
  ('00000000-0000-0000-0000-0000000005c3', 'Parent.Un@Test.local', now()),
  ('00000000-0000-0000-0000-0000000005c4', 'parent-deux@test.local', now()),
  ('00000000-0000-0000-0000-0000000005c5', 'parent-trois@test.local', now()),
  ('00000000-0000-0000-0000-0000000005c6', 'parent-non-confirme@test.local', null),
  ('00000000-0000-0000-0000-0000000005c7', 'eleve-actif@test.local', now());
update public.profil set onboarding_termine = true, moins_de_15_ans = true where id = '00000000-0000-0000-0000-0000000005c1';
update public.profil set onboarding_termine = true, moins_de_15_ans = false where id in ('00000000-0000-0000-0000-0000000005c2', '00000000-0000-0000-0000-0000000005c7');
insert into public.consentement_parental (eleve_id, email_parent, donne_le) values
  ('00000000-0000-0000-0000-0000000005c1', 'parent.un@test.local', now());
-- Un élève qui a commencé à utiliser l'application ne peut plus devenir parent.
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005c1', 'technologique', 'PAR', 'Filière parents');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005c1', 'cours-parents', '10000000-0000-0000-0000-0000000005c1', '1re', 'P', 'Cours parents', true);
insert into public.acces_gratuit (eleve_id, cours_id) values ('00000000-0000-0000-0000-0000000005c7', '20000000-0000-0000-0000-0000000005c1');
update public.profil set onboarding_termine = false where id = '00000000-0000-0000-0000-0000000005c7';

set local role authenticated;

-- devenir_parent
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c3","role":"authenticated"}', true);
select throws_ok($$ select public.devenir_parent('  ') $$, 'P0001', 'nom_parent_invalide', 'nom vide refusé');
select lives_ok($$ select public.devenir_parent('Camille') $$, 'un nouveau compte devient parent');
select results_eq($$ select role::text, onboarding_termine from public.profil where id = auth.uid() $$,
  $$ values ('parent'::text, true) $$, 'rôle parent et accueil terminé');
select throws_ok($$ select public.devenir_parent('Camille') $$, 'P0001', 'deja_inscrit', 'pas deux fois');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c2","role":"authenticated"}', true);
select throws_ok($$ select public.devenir_parent('Lou') $$, 'P0001', 'deja_inscrit', 'un élève inscrit ne devient pas parent');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c7","role":"authenticated"}', true);
select throws_ok($$ select public.devenir_parent('Lou') $$, 'P0001', 'deja_inscrit', 'un élève avec un cours gratuit ne devient pas parent');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c4","role":"authenticated"}', true);
select lives_ok($$ select public.devenir_parent('Sacha') $$, 'deuxième parent');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c5","role":"authenticated"}', true);
select lives_ok($$ select public.devenir_parent('Alix') $$, 'troisième parent');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c6","role":"authenticated"}', true);
select lives_ok($$ select public.devenir_parent('Noa') $$, 'parent à l''adresse non confirmée');

-- lier_par_email
select is(public.lier_par_email(), 0, 'adresse non confirmée : aucun lien');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c3","role":"authenticated"}', true);
select is(public.lier_par_email(), 1, 'adresse de l''accord, casse ignorée : enfant relié');
select is(public.lier_par_email(), 0, 'déjà relié : rien de nouveau');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c2","role":"authenticated"}', true);
select throws_ok($$ select public.lier_par_email() $$, 'P0001', 'pas_parent', 'réservé aux parents');

-- codes
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c1","role":"authenticated"}', true);
select throws_ok($$ select public.generer_code_parent() $$, 'P0001', 'reserve_15_ans', 'pas de code avant 15 ans');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c2","role":"authenticated"}', true);
create temporary table code_test (code text) on commit drop;
grant all on code_test to authenticated;
insert into code_test select public.generer_code_parent();
select matches((select code from code_test), '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$', 'code de 8 caractères sans ambiguïté');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c4","role":"authenticated"}', true);
select is(public.lier_par_code('ZZZZ-ZZZZ'), 'code_parent_invalide', 'code faux');
select is(public.lier_par_code(lower(substr((select code from code_test), 1, 4)) || '-' || substr((select code from code_test), 5)),
  'lie', 'code juste, casse et tiret ignorés');
select is(public.lier_par_code((select code from code_test)), 'code_parent_invalide', 'usage unique');
select is(public.lier_par_code('AAAA-AAAA'), 'code_parent_invalide', 'troisième essai faux');
select is(public.lier_par_code('BBBB-BBBB'), 'code_parent_invalide', 'quatrième');
select is(public.lier_par_code('CCCC-CCCC'), 'code_parent_invalide', 'cinquième');
select is(public.lier_par_code('DDDD-DDDD'), 'essais_code_epuises', 'au-delà de 5 échecs dans l''heure');

-- limite de 2 parents et déliaison
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c1","role":"authenticated"}', true);
select throws_ok($$ select public.delier_parent('00000000-0000-0000-0000-0000000005c3') $$,
  'P0001', 'deliaison_interdite', 'un moins de 15 ans ne délie pas');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005c2","role":"authenticated"}', true);
select lives_ok($$ select public.delier_parent('00000000-0000-0000-0000-0000000005c4') $$, 'un 15 ans ou plus délie');

-- Limite de 2 parents (c1 est déjà relié à c3).
reset role;
select lives_ok($$ select prive.lier('00000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c4', 'code') $$, 'deuxième parent relié');
select throws_ok($$ select prive.lier('00000000-0000-0000-0000-0000000005c1', '00000000-0000-0000-0000-0000000005c5', 'code') $$,
  'P0001', 'trop_de_parents', 'pas de troisième parent');

select * from finish();
rollback;
```

- [ ] **Step 2 : vérifier l'échec**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db`
Expected : FAIL sur `parents.test.sql`.

- [ ] **Step 3 : écrire la migration**

`supabase/migrations/20261229000002_parents.sql` :

```sql
-- Comptes parents : rôle, liens avec les enfants (par l'adresse de l'accord ou par un code), déliaison.

create table public.lien_parent (
  eleve_id uuid not null references public.profil on delete cascade,
  parent_id uuid not null references public.profil on delete cascade,
  origine text not null check (origine in ('accord', 'code')),
  cree_le timestamptz not null default now(),
  primary key (eleve_id, parent_id)
);
create index lien_parent_parent on public.lien_parent (parent_id);
alter table public.lien_parent enable row level security;
revoke all on public.lien_parent from anon, authenticated;

create table prive.code_parent (
  eleve_id uuid primary key references public.profil on delete cascade,
  empreinte bytea not null unique,
  expire_le timestamptz not null
);
create table prive.essai_code_parent (
  parent_id uuid not null references public.profil on delete cascade,
  heure timestamptz not null,
  nombre smallint not null default 1 check (nombre >= 1),
  primary key (parent_id, heure)
);
revoke all on prive.code_parent, prive.essai_code_parent from public, anon, authenticated;

-- Crée le lien sous verrou du profil de l'élève ; false s'il existait déjà.
create function prive.lier(p_eleve uuid, p_parent uuid, p_origine text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.profil where id = p_eleve for update;
  if exists (select 1 from public.lien_parent where eleve_id = p_eleve and parent_id = p_parent) then
    return false;
  end if;
  if (select count(*) from public.lien_parent where eleve_id = p_eleve) >= 2 then
    raise exception 'trop_de_parents';
  end if;
  insert into public.lien_parent (eleve_id, parent_id, origine) values (p_eleve, p_parent, p_origine);
  return true;
end $$;
revoke execute on function prive.lier(uuid, uuid, text) from public;

-- Un compte tout neuf (aucune activité d'élève) devient un compte parent.
create function public.devenir_parent(p_nom text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_nom text := btrim(coalesce(p_nom, ''));
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  if char_length(v_nom) not between 1 and 60 or v_nom ~ '[[:cntrl:]]' then
    raise exception 'nom_parent_invalide';
  end if;
  perform 1 from public.profil where id = auth.uid() for update;
  if not exists (select 1 from public.profil p
                  where p.id = auth.uid() and p.role = 'eleve' and not p.onboarding_termine and not p.demande_enseignant)
     or exists (select 1 from public.tentative where eleve_id = auth.uid())
     or exists (select 1 from public.inscription_classe where eleve_id = auth.uid())
     or exists (select 1 from public.consentement_parental where eleve_id = auth.uid())
     or exists (select 1 from public.acces_gratuit where eleve_id = auth.uid())
     or exists (select 1 from public.lien_parent where eleve_id = auth.uid()) then
    raise exception 'deja_inscrit';
  end if;
  update public.profil set role = 'parent', nom = v_nom, onboarding_termine = true where id = auth.uid();
end $$;

-- Relie les enfants dont l'accord a été donné depuis l'adresse (confirmée) du compte parent.
create function public.lier_par_email() returns int
language plpgsql security definer set search_path = '' as $$
declare
  v_email text;
  v_n int := 0;
  r record;
begin
  if public.role_actuel() is distinct from 'parent' then
    raise exception 'pas_parent';
  end if;
  select lower(u.email) into v_email from auth.users u where u.id = auth.uid() and u.email_confirmed_at is not null;
  if v_email is null then
    return 0;
  end if;
  for r in select c.eleve_id from public.consentement_parental c
            where c.email_parent = v_email and c.donne_le is not null and c.retire_le is null
  loop
    begin
      if prive.lier(r.eleve_id, auth.uid(), 'accord') then
        v_n := v_n + 1;
      end if;
    exception when sqlstate 'P0001' then
      -- Un enfant qui a déjà deux parents est ignoré ; toute autre erreur remonte.
      if sqlerrm <> 'trop_de_parents' then
        raise;
      end if;
    end;
  end loop;
  return v_n;
end $$;

-- Code à usage unique, valable 48 heures, pour un élève de 15 ans ou plus ; remplace le précédent.
create function public.generer_code_parent() returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_octets bytea := extensions.gen_random_bytes(8);
  v_code text;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if exists (select 1 from public.profil where id = auth.uid() and (coalesce(moins_de_15_ans, true) or not onboarding_termine)) then
    raise exception 'reserve_15_ans';
  end if;
  if (select count(*) from public.lien_parent where eleve_id = auth.uid()) >= 2 then
    raise exception 'trop_de_parents';
  end if;
  select string_agg(substr(v_alphabet, (get_byte(v_octets, i) % 31) + 1, 1), '' order by i) into v_code
    from generate_series(0, 7) i;
  insert into prive.code_parent (eleve_id, empreinte, expire_le)
    values (auth.uid(), extensions.digest(v_code, 'sha256'), now() + interval '48 hours')
  on conflict (eleve_id) do update set empreinte = excluded.empreinte, expire_le = excluded.expire_le;
  return v_code;
end $$;

-- Renvoie un statut (et ne lève pas d'erreur) pour qu'un essai raté reste compté.
create function public.lier_par_code(p_code text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '[[:space:]-]', '', 'g'));
  v_heure timestamptz := date_trunc('hour', now());
  v_eleve uuid;
begin
  if public.role_actuel() is distinct from 'parent' then
    raise exception 'pas_parent';
  end if;
  perform 1 from public.profil where id = auth.uid() for update;
  if coalesce((select nombre from prive.essai_code_parent where parent_id = auth.uid() and heure = v_heure), 0) >= 5 then
    return 'essais_code_epuises';
  end if;
  delete from prive.code_parent c
   where c.empreinte = extensions.digest(v_code, 'sha256') and c.expire_le > now()
     and exists (select 1 from public.profil p where p.id = c.eleve_id and p.role = 'eleve' and p.suppression_demandee_le is null)
  returning c.eleve_id into v_eleve;
  if v_eleve is null then
    insert into prive.essai_code_parent as e (parent_id, heure) values (auth.uid(), v_heure)
    on conflict (parent_id, heure) do update set nombre = e.nombre + 1;
    return 'code_parent_invalide';
  end if;
  perform prive.lier(v_eleve, auth.uid(), 'code');
  return 'lie';
end $$;

-- Le parent se délie toujours ; l'élève seulement à partir de 15 ans.
create function public.delier_parent(p_autre uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() = 'parent' then
    delete from public.lien_parent where parent_id = auth.uid() and eleve_id = p_autre;
  elsif public.role_actuel() = 'eleve' then
    if exists (select 1 from public.profil where id = auth.uid() and coalesce(moins_de_15_ans, true)) then
      raise exception 'deliaison_interdite';
    end if;
    delete from public.lien_parent where eleve_id = auth.uid() and parent_id = p_autre;
  else
    raise exception 'lien_introuvable';
  end if;
  if not found then
    raise exception 'lien_introuvable';
  end if;
end $$;

revoke execute on function public.devenir_parent(text), public.lier_par_email(), public.generer_code_parent(),
  public.lier_par_code(text), public.delier_parent(uuid) from public, anon;
grant execute on function public.devenir_parent(text), public.lier_par_email(), public.generer_code_parent(),
  public.lier_par_code(text), public.delier_parent(uuid) to authenticated;
```

`src/lib/erreurs.ts`, avec un test du texte exact pour chacun :

```ts
  pas_parent: 'Cette page est réservée aux comptes parents.',
  deja_inscrit: 'Ce compte a déjà commencé comme élève : il ne peut pas devenir un compte parent.',
  nom_parent_invalide: 'Indiquez votre prénom (60 caractères au plus).',
  trop_de_parents: 'Ce compte élève est déjà relié à deux parents.',
  reserve_15_ans: 'Avant 15 ans, c’est ton parent qui crée le lien, avec l’adresse qui a reçu la demande d’accord.',
  code_parent_invalide: 'Ce code n’est pas valable ou a expiré. Demandez un nouveau code à votre enfant.',
  essais_code_epuises: 'Trop d’essais. Réessayez dans une heure.',
  deliaison_interdite: 'Avant 15 ans, seul ton parent peut retirer ce lien.',
  lien_introuvable: 'Ce lien n’existe pas ou a déjà été retiré.',
```

Les codes existants `code_invalide` et `trop_d_essais` servent déjà aux codes de classe : les nouveaux codes s'appellent donc `code_parent_invalide` et `essais_code_epuises`. Avant d'ajouter, vérifier qu'aucun nouveau code n'est sous-chaîne d'un code existant ni l'inverse (`grep -oE "^  [a-z_]+:" src/lib/erreurs.ts`).

- [ ] **Step 4 : appliquer et vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm test && npm run typecheck`
Expected : PASS, dont `parents.test.sql` 26/26.

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261229000002_parents.sql supabase/tests/parents.test.sql src/lib/erreurs.ts src/lib/erreurs.test.ts src/lib/supabase/types.ts
git commit -m "Relie les comptes parents aux élèves par l'adresse de l'accord ou par un code

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3 : lectures du parent, retrait du consentement, export et purge

**Files :**
- Create : `supabase/migrations/20261229000003_suivi_parent.sql`, `supabase/tests/suivi_parent.test.sql`
- Modify : `src/lib/erreurs.ts`, `src/lib/erreurs.test.ts`, `src/lib/supabase/types.ts`, `supabase/tests/mes_donnees.test.sql` (seulement si une assertion sur la liste exacte des clés de l'export existe)

**Interfaces :**
- Consumes :
  - `public.lien_parent` (tâche 2) et `public.abonnement` (tâche 1) ;
  - `prive.consentement_requis` (`20261222000002_consentement.sql`) ;
  - `public.annuler_suppression_compte` (`20261222000003_mes_donnees.sql`) ;
  - `public.demander_consentement` (`20261222000005_secrets.sql`) ;
  - `public.exporter_mes_donnees` (`20261222000004_classes_retour.sql`) ;
  - `prive.purges_quotidiennes` (`20261222000005_secrets.sql`).
- Produces :
  - `public.enfants_du_parent() returns table (eleve_id uuid, nom text, niveau text, moins_de_15_ans boolean, consentement_donne_le timestamptz, consentement_retire_le timestamptz, retire_par_moi boolean, suppression_prevue_le timestamptz, origine text, lie_le timestamptz, abonnement jsonb)` ;
  - `public.progression_enfant(p_eleve uuid) returns table (cours_id uuid, titre text, chapitres_valides int, chapitres_total int, meilleure_note numeric, cours_valide boolean, derniere_activite timestamptz)` ;
  - `public.parents_de_l_eleve() returns table (parent_id uuid, nom text, origine text, lie_le timestamptz)` ;
  - `public.retirer_consentement(p_eleve uuid) returns timestamptz` (date de suppression prévue) ;
  - `public.annuler_retrait_consentement(p_eleve uuid) returns void` ;
  - codes `retrait_impossible`, `consentement_retire`, `suppression_imposee`.

- [ ] **Step 1 : écrire le test**

`supabase/tests/suivi_parent.test.sql` :

```sql
begin;
select plan(21);

insert into auth.users (id, email, email_confirmed_at) values
  ('00000000-0000-0000-0000-0000000005d1', 'suivi-enfant@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d2', 'suivi-parent@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d3', 'suivi-autre-parent@test.local', now()),
  ('00000000-0000-0000-0000-0000000005d4', 'suivi-majeur@test.local', now());
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005d1', 'technologique', 'SVP', 'Filière suivi');
update public.profil set onboarding_termine = true, moins_de_15_ans = true, nom = 'Lou',
       filiere_id = '10000000-0000-0000-0000-0000000005d1', niveau_code = '1re'
 where id = '00000000-0000-0000-0000-0000000005d1';
update public.profil set onboarding_termine = true, moins_de_15_ans = false, nom = 'Max',
       filiere_id = '10000000-0000-0000-0000-0000000005d1', niveau_code = '1re'
 where id = '00000000-0000-0000-0000-0000000005d4';
update public.profil set role = 'parent', onboarding_termine = true, nom = 'Camille'
 where id in ('00000000-0000-0000-0000-0000000005d2', '00000000-0000-0000-0000-0000000005d3');
insert into public.consentement_parental (eleve_id, email_parent, donne_le) values
  ('00000000-0000-0000-0000-0000000005d1', 'suivi-parent@test.local', now() - interval '2 days');
insert into public.lien_parent (eleve_id, parent_id, origine) values
  ('00000000-0000-0000-0000-0000000005d1', '00000000-0000-0000-0000-0000000005d2', 'accord'),
  ('00000000-0000-0000-0000-0000000005d4', '00000000-0000-0000-0000-0000000005d2', 'code');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005d1', 'cours-svp', '10000000-0000-0000-0000-0000000005d1', '1re', 'S', 'Cours suivi', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000005d1', '20000000-0000-0000-0000-0000000005d1', 'ch1', 1, 'Chapitre 1', true),
  ('30000000-0000-0000-0000-0000000005d2', '20000000-0000-0000-0000-0000000005d1', 'ch2', 2, 'Chapitre 2', true);
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide, valide_le) values
  ('00000000-0000-0000-0000-0000000005d1', '30000000-0000-0000-0000-0000000005d1', 80, true, now());

set local role authenticated;

-- lectures
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select is((select count(*)::int from public.enfants_du_parent()), 2, 'le parent voit ses deux enfants');
select results_eq($$ select chapitres_valides, chapitres_total from public.progression_enfant('00000000-0000-0000-0000-0000000005d1') $$,
  $$ values (1, 2) $$, 'progression par cours');
select is((select count(*)::int from public.tentative where eleve_id = '00000000-0000-0000-0000-0000000005d1'), 0,
  'le parent ne lit pas les tentatives de l''enfant');
select throws_ok($$ select count(*) from public.lien_parent $$, '42501', null, 'aucune lecture directe des liens');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d3","role":"authenticated"}', true);
select throws_ok($$ select * from public.progression_enfant('00000000-0000-0000-0000-0000000005d1') $$,
  'P0001', 'lien_introuvable', 'un parent non relié ne lit rien');
select is((select count(*)::int from public.enfants_du_parent()), 0, 'aucun enfant pour un parent non relié');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d4","role":"authenticated"}', true);
select throws_ok($$ select * from public.enfants_du_parent() $$, 'P0001', 'pas_parent', 'réservé aux parents');
select results_eq($$ select nom, origine from public.parents_de_l_eleve() $$,
  $$ values ('Camille'::text, 'code'::text) $$, 'l''élève voit ses parents reliés');

-- retrait
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select throws_ok($$ select public.retirer_consentement('00000000-0000-0000-0000-0000000005d4') $$,
  'P0001', 'retrait_impossible', 'pas de retrait pour un 15 ans ou plus');
select ok(public.retirer_consentement('00000000-0000-0000-0000-0000000005d1') > now() + interval '29 days', 'retrait : suppression dans 30 jours');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005d1'), false, 'compte bloqué après le retrait');
select results_eq($$ select consentement_requis, consentement_retire_le is not null, suppression_prevue_le is not null from public.mon_acces() $$,
  $$ values (true, true, true) $$, 'mon_acces annonce le retrait et la date');
select throws_ok($$ select public.demander_consentement('autre-adresse@test.local') $$,
  'P0001', 'consentement_retire', 'pas de nouvelle demande vers une autre adresse');
select throws_ok($$ select public.annuler_suppression_compte() $$,
  'P0001', 'suppression_imposee', 'l''élève n''annule pas la suppression imposée');
select lives_ok($$ select public.exporter_mes_donnees() $$, 'l''export reste disponible');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d3","role":"authenticated"}', true);
select throws_ok($$ select public.annuler_retrait_consentement('00000000-0000-0000-0000-0000000005d1') $$,
  'P0001', 'lien_introuvable', 'un autre parent n''annule pas');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select lives_ok($$ select public.annuler_retrait_consentement('00000000-0000-0000-0000-0000000005d1') $$, 'le parent annule le retrait');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d1","role":"authenticated"}', true);
select results_eq($$ select consentement_requis, suppression_prevue_le is null from public.mon_acces() $$,
  $$ values (false, true) $$, 'accès rétabli, plus de suppression prévue');

-- export
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d2","role":"authenticated"}', true);
select is(jsonb_array_length(public.exporter_mes_donnees()->'enfants_suivis'), 2, 'export du parent : ses enfants suivis');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005d1","role":"authenticated"}', true);
select is(public.exporter_mes_donnees()->'parents_relies'->0->>'nom', 'Camille', 'export de l''élève : ses parents');

-- purge des codes expirés
reset role;
insert into prive.code_parent (eleve_id, empreinte, expire_le) values
  ('00000000-0000-0000-0000-0000000005d4', extensions.digest('X', 'sha256'), now() - interval '1 hour');
select prive.purges_quotidiennes();
select is((select count(*)::int from prive.code_parent where eleve_id = '00000000-0000-0000-0000-0000000005d4'), 0, 'codes expirés purgés');

select * from finish();
rollback;
```

- [ ] **Step 2 : vérifier l'échec**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db`
Expected : FAIL sur `suivi_parent.test.sql`.

- [ ] **Step 3 : écrire la migration**

`supabase/migrations/20261229000003_suivi_parent.sql` :

```sql
-- Suivi par le parent (consentement, abonnement, progression), retrait du consentement, export et purge.

-- Corps de 20261222000002_consentement.sql + un accord retiré ne compte plus.
create or replace function prive.consentement_requis(p_eleve uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profil p
     where p.id = p_eleve and p.role = 'eleve' and p.moins_de_15_ans
       and not exists (select 1 from public.consentement_parental c
                        where c.eleve_id = p.id and c.donne_le is not null and c.retire_le is null))
$$;
revoke execute on function prive.consentement_requis(uuid) from public;

create function public.enfants_du_parent()
returns table (eleve_id uuid, nom text, niveau text, moins_de_15_ans boolean, consentement_donne_le timestamptz,
               consentement_retire_le timestamptz, retire_par_moi boolean, suppression_prevue_le timestamptz,
               origine text, lie_le timestamptz, abonnement jsonb)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if public.role_actuel() is distinct from 'parent' then
    raise exception 'pas_parent';
  end if;
  return query
    select p.id, coalesce(p.nom, '')::text, p.niveau_code::text, coalesce(p.moins_de_15_ans, false),
           c.donne_le, c.retire_le, coalesce(c.retire_par = auth.uid(), false),
           p.suppression_demandee_le + interval '30 days', l.origine, l.cree_le,
           (select jsonb_build_object('formule', a.formule, 'statut', a.statut, 'fin_periode', a.fin_periode,
                                      'fin_grace', a.fin_grace, 'actif', prive.abonnement_actif(p.id))
              from public.abonnement a where a.eleve_id = p.id)
      from public.lien_parent l
      join public.profil p on p.id = l.eleve_id
      left join public.consentement_parental c on c.eleve_id = p.id
     where l.parent_id = auth.uid()
     order by l.cree_le;
end $$;

create function prive.verifier_lien(p_eleve uuid) returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'parent' then
    raise exception 'pas_parent';
  end if;
  if not exists (select 1 from public.lien_parent where parent_id = auth.uid() and eleve_id = p_eleve) then
    raise exception 'lien_introuvable';
  end if;
end $$;
revoke execute on function prive.verifier_lien(uuid) from public;

-- Résumé par cours de la filière et du niveau de l'enfant ; jamais de réponse ni de tentative détaillée.
create function public.progression_enfant(p_eleve uuid)
returns table (cours_id uuid, titre text, chapitres_valides int, chapitres_total int, meilleure_note numeric,
               cours_valide boolean, derniere_activite timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  perform prive.verifier_lien(p_eleve);
  return query
    select co.id, co.titre,
           (select count(*)::int from public.progression_chapitre pc join public.chapitre ch on ch.id = pc.chapitre_id
             where pc.eleve_id = p_eleve and ch.cours_id = co.id and ch.publie and pc.valide),
           (select count(*)::int from public.chapitre ch where ch.cours_id = co.id and ch.publie),
           pco.meilleure_note, coalesce(pco.valide, false),
           (select max(t.fin) from public.tentative t
             where t.eleve_id = p_eleve and t.cours_id = co.id and t.statut = 'terminee')
      from public.profil p
      join public.cours co on co.filiere_id = p.filiere_id and co.niveau_code = p.niveau_code and co.publie
      left join public.progression_cours pco on pco.eleve_id = p_eleve and pco.cours_id = co.id
     where p.id = p_eleve
     order by co.ordre, co.titre;
end $$;

create function public.parents_de_l_eleve()
returns table (parent_id uuid, nom text, origine text, lie_le timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  return query
    select p.id, coalesce(p.nom, '')::text, l.origine, l.cree_le
      from public.lien_parent l join public.profil p on p.id = l.parent_id
     where l.eleve_id = auth.uid()
     order by l.cree_le;
end $$;

create function public.retirer_consentement(p_eleve uuid) returns timestamptz
language plpgsql security definer set search_path = '' as $$
declare
  v timestamptz;
begin
  perform prive.verifier_lien(p_eleve);
  perform 1 from public.profil where id = p_eleve for update;
  update public.consentement_parental c set retire_le = now(), retire_par = auth.uid()
   where c.eleve_id = p_eleve and c.donne_le is not null and c.retire_le is null
     and exists (select 1 from public.profil p where p.id = p_eleve and p.moins_de_15_ans);
  if not found then
    raise exception 'retrait_impossible';
  end if;
  update public.profil set suppression_demandee_le = coalesce(suppression_demandee_le, now()), suppression_imposee = true
   where id = p_eleve
  returning suppression_demandee_le + interval '30 days' into v;
  return v;
end $$;

-- Seul le parent qui a retiré son accord l'annule ; toute demande de suppression du compte est effacée.
create function public.annuler_retrait_consentement(p_eleve uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.verifier_lien(p_eleve);
  perform 1 from public.profil where id = p_eleve for update;
  update public.consentement_parental set retire_le = null, retire_par = null
   where eleve_id = p_eleve and retire_le is not null and retire_par = auth.uid();
  if not found then
    raise exception 'retrait_impossible';
  end if;
  update public.profil set suppression_demandee_le = null, suppression_imposee = false where id = p_eleve;
end $$;

-- Corps de 20261222000003_mes_donnees.sql + refus si la suppression a été imposée par le retrait de l'accord.
create or replace function public.annuler_suppression_compte() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  if exists (select 1 from public.profil where id = auth.uid() and suppression_imposee) then
    raise exception 'suppression_imposee';
  end if;
  update public.profil set suppression_demandee_le = null where id = auth.uid();
end $$;

-- demander_consentement : corps de l'étape 5a conservé tel quel dans prive, précédé du refus après un retrait.
alter function public.demander_consentement(text) rename to demander_consentement_5a;
alter function public.demander_consentement_5a(text) set schema prive;
revoke execute on function prive.demander_consentement_5a(text) from public, anon, authenticated;
create function public.demander_consentement(p_email text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.consentement_parental where eleve_id = auth.uid() and retire_le is not null) then
    raise exception 'consentement_retire';
  end if;
  perform prive.demander_consentement_5a(p_email);
end $$;

-- exporter_mes_donnees : export de l'étape 5a + parents reliés, enfants suivis, abonnement, retrait.
alter function public.exporter_mes_donnees() rename to exporter_mes_donnees_5a;
alter function public.exporter_mes_donnees_5a() set schema prive;
revoke execute on function prive.exporter_mes_donnees_5a() from public, anon, authenticated;
create function public.exporter_mes_donnees() returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  return prive.exporter_mes_donnees_5a() || jsonb_build_object(
    'parents_relies', coalesce((select jsonb_agg(jsonb_build_object('nom', p.nom, 'origine', l.origine, 'lie_le', l.cree_le) order by l.cree_le)
      from public.lien_parent l join public.profil p on p.id = l.parent_id where l.eleve_id = auth.uid()), '[]'::jsonb),
    'enfants_suivis', coalesce((select jsonb_agg(jsonb_build_object('nom', p.nom, 'lie_le', l.cree_le) order by l.cree_le)
      from public.lien_parent l join public.profil p on p.id = l.eleve_id where l.parent_id = auth.uid()), '[]'::jsonb),
    'abonnement', (select jsonb_build_object('formule', a.formule, 'statut', a.statut, 'fin_periode', a.fin_periode,
                                             'fin_grace', a.fin_grace, 'cree_le', a.cree_le)
      from public.abonnement a where a.eleve_id = auth.uid()),
    'retrait_consentement', (select jsonb_build_object('retire_le', c.retire_le)
      from public.consentement_parental c where c.eleve_id = auth.uid() and c.retire_le is not null));
end $$;

-- purges_quotidiennes : purges de l'étape 5a + codes parents expirés et compteurs d'essais passés.
alter function prive.purges_quotidiennes() rename to purges_quotidiennes_5a;
revoke execute on function prive.purges_quotidiennes_5a() from public;
create function prive.purges_quotidiennes() returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.purges_quotidiennes_5a();
  delete from prive.code_parent where expire_le < now();
  delete from prive.essai_code_parent where heure < date_trunc('hour', now());
end $$;
revoke execute on function prive.purges_quotidiennes() from public;

revoke execute on function public.enfants_du_parent(), public.progression_enfant(uuid), public.parents_de_l_eleve(),
  public.retirer_consentement(uuid), public.annuler_retrait_consentement(uuid),
  public.demander_consentement(text), public.exporter_mes_donnees() from public, anon;
grant execute on function public.enfants_du_parent(), public.progression_enfant(uuid), public.parents_de_l_eleve(),
  public.retirer_consentement(uuid), public.annuler_retrait_consentement(uuid),
  public.demander_consentement(text), public.exporter_mes_donnees() to authenticated;
```

Points à vérifier :
- **Tâche `pg_cron`** : vérifier dans `20261222000003_mes_donnees.sql` que la commande appelle bien `prive.purges_quotidiennes()` par son nom.
- **Ordre de la purge** : `prive.purges_quotidiennes_5a` supprime les comptes avant les codes. C'est sans effet, puisque les codes partent en cascade avec le profil.
- **Assertions existantes** : si `mes_donnees.test.sql` ou `consentement.test.sql` vérifient la liste exacte des clés de l'export, ou les droits de `demander_consentement` par OID, les adapter et le signaler dans le rapport.

`src/lib/erreurs.ts`, avec un test du texte exact :

```ts
  retrait_impossible: 'Ce retrait n’est pas possible pour ce compte.',
  consentement_retire: 'Ton parent a retiré son accord : tu ne peux pas faire de nouvelle demande.',
  suppression_imposee: 'La suppression a été demandée par ton parent : seul ton parent peut l’annuler.',
```

- [ ] **Step 4 : appliquer et vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm test && npm run typecheck`
Expected : PASS, dont `suivi_parent.test.sql` 21/21 et toute la suite (les tests de l'export et du consentement de l'étape 5a passent toujours).

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261229000003_suivi_parent.sql supabase/tests/ src/lib/erreurs.ts src/lib/erreurs.test.ts src/lib/supabase/types.ts
git commit -m "Permet au parent de suivre ses enfants et de retirer son accord

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4 : interface — choix « parent », redirections, bannière d'abonnement

**Files :**
- Modify :
  - `src/lib/acces/etat.ts`, `src/lib/acces/etat.test.ts`, `src/lib/acces/requetes.ts`
  - `src/components/BanniereEssai.tsx`, plus un test s'il n'existe pas : `src/components/BanniereEssai.test.tsx`
  - `src/lib/profil/onboarding.ts` (+ test)
  - `src/app/bienvenue/FormulaireBienvenue.tsx`, `src/app/bienvenue/actions.ts`
  - `src/app/(app)/layout.tsx`, `src/app/(app)/page.tsx`, `src/components/EnTete.tsx`

**Interfaces :**
- Consumes : `mon_acces()` (tâche 1), `devenir_parent(p_nom)` (tâche 2).
- Produces :
  - le type `MonAcces`, avec en plus `abonnement: AbonnementResume | null`, `consentementRetireLe: string | null` et `suppressionPrevueLe: string | null` ;
  - `abonne(a: MonAcces): boolean` ;
  - la route `/parent`, cible de la redirection d'un parent.

- [ ] **Step 1 : tests unitaires**

Dans `etat.test.ts`, compléter `base` avec `abonnement: null, consentementRetireLe: null, suppressionPrevueLe: null`, puis ajouter :

```ts
  it('un abonné voit tout et n’a rien à choisir, même après l’essai', () => {
    const a = { ...base, abonnement: { formule: 'mensuelle' as const, statut: 'actif', finPeriode: '2027-01-01T00:00:00Z', finGrace: null, actif: true } };
    expect(abonne(a)).toBe(true);
    expect(coursOuvert(a, 'x')).toBe(true);
    expect(doitChoisirCours(a)).toBe(false);
  });
  it('un abonnement inactif ne change rien', () => {
    const a = { ...base, abonnement: { formule: 'mensuelle' as const, statut: 'expire', finPeriode: '2026-01-01T00:00:00Z', finGrace: null, actif: false } };
    expect(abonne(a)).toBe(false);
    expect(doitChoisirCours(a)).toBe(true);
  });
```

Dans `BanniereEssai.test.tsx` (Testing Library, comme les autres tests de composants du projet ; s'il n'y en a aucun, tester avec `renderToStaticMarkup` de `react-dom/server`) :

- abonné actif : aucune bannière ;
- statut `impaye` et actif : le texte `Le paiement de ton abonnement a échoué. Tu gardes l’accès à tous les cours jusqu’au 7 janvier.`, avec `finGrace` = `2027-01-07T12:00:00Z`.

Dans le test d'`onboarding.ts` :

- `profil=parent` avec `nom=Camille` est valide ;
- `profil=parent` avec un nom vide renvoie le message de `schemaNom`.

- [ ] **Step 2 : vérifier l'échec**

Run : `npm test`
Expected : FAIL (`abonne` n'existe pas, la bannière affiche l'essai).

- [ ] **Step 3 : implémenter**

`src/lib/acces/etat.ts` :

```ts
export type AbonnementResume = { formule: 'mensuelle' | 'annuelle'; statut: string; finPeriode: string; finGrace: string | null; actif: boolean };
// ajouter au type MonAcces :
//   abonnement: AbonnementResume | null;
//   consentementRetireLe: string | null;
//   suppressionPrevueLe: string | null;

export function abonne(a: MonAcces): boolean {
  return a.abonnement?.actif === true;
}

export function coursOuvert(a: MonAcces, coursId: string): boolean {
  if (a.role !== 'eleve') return true;
  if (a.consentementRequis) return false;
  return abonne(a) || a.enEssai || a.coursGratuitId === coursId;
}

export function doitChoisirCours(a: MonAcces): boolean {
  return a.role === 'eleve' && !a.consentementRequis && !abonne(a) && !a.enEssai && a.coursGratuitId === null;
}
```

`src/lib/acces/requetes.ts` : lire les trois nouvelles colonnes.

```ts
    abonnement: l.abonnement ? lireAbonnement(l.abonnement) : null,
    consentementRetireLe: l.consentement_retire_le,
    suppressionPrevueLe: l.suppression_prevue_le,
```

`lireAbonnement` est définie dans `etat.ts` et testée. Elle valide le JSON avec zod (formule, statut, `fin_periode`, `fin_grace`, `actif`) et renvoie `null` si le format est inattendu.

`BanniereEssai.tsx`, en tête de la fonction, après le test du consentement :

```tsx
  if (acces.abonnement?.actif) {
    if (acces.abonnement.statut === 'impaye' && acces.abonnement.finGrace) {
      return (
        <p className="banniere banniere-fin" role="status">
          Le paiement de ton abonnement a échoué. Tu gardes l’accès à tous les cours jusqu’au {jourMois.format(new Date(acces.abonnement.finGrace))}.
        </p>
      );
    }
    return null;
  }
```

avec `const jourMois = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });`.

`src/lib/profil/onboarding.ts` : ajouter une troisième branche au schéma discriminé, `z.object({ profil: z.literal('parent'), nom: schemaNom })`. `lireFormulaireOnboarding` lit `profil` parmi `eleve`, `enseignant` et `parent`.

`src/app/bienvenue/FormulaireBienvenue.tsx` : le groupe de boutons radio « Je suis… » existant reçoit une troisième option, « Parent d’un élève ». Quand elle est choisie, on n'affiche que le champ du prénom, avec le libellé « Votre prénom ». Le texte d'aide dit : « Vous pourrez ensuite relier le compte de votre enfant. »

`src/app/bienvenue/actions.ts` : pour `profil === 'parent'`, appeler `supabase.rpc('devenir_parent', { p_nom: nom })`. En cas d'erreur, afficher `messageErreur(error.message)` (aide existante de `src/lib/erreurs.ts`), puis `redirect('/parent')`. Étendre `ValeursBienvenue['profil']` à `'parent'`.

`src/app/(app)/layout.tsx` : un parent n'a pas d'accès à lire. Il reçoit l'en-tête `role="parent"` et la bannière de suppression, comme les autres. Aucun changement de logique au-delà de `eleve` déjà calculé.

`src/app/(app)/page.tsx` : `if (profil?.role === 'parent') redirect('/parent');`, à côté des redirections existantes.

`src/components/EnTete.tsx` : `parent: [{ href: '/parent', libelle: 'Mes enfants' }]`.

- [ ] **Step 4 : vérifier**

Run : `npm test && npm run typecheck && npm run lint`
Expected : PASS.

- [ ] **Step 5 : commit**

```bash
git add src/lib/acces src/components/BanniereEssai.tsx src/components/BanniereEssai.test.tsx src/lib/profil src/app/bienvenue "src/app/(app)/layout.tsx" "src/app/(app)/page.tsx" src/components/EnTete.tsx
git commit -m "Propose le compte parent à l'inscription et gère l'accès des abonnés

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5 : interface — espace parent

**Files :**
- Create :
  - `src/lib/parent/requetes.ts`, `src/lib/parent/format.ts`, `src/lib/parent/format.test.ts`
  - `src/app/(app)/parent/page.tsx`, `src/app/(app)/parent/actions.ts`
  - `src/app/(app)/parent/enfant/[id]/page.tsx`
  - `src/components/parent/CarteEnfant.tsx`, `src/components/parent/FormulaireCodeParent.tsx`, `src/components/parent/ActionsEnfant.tsx`

**Interfaces :**
- Consumes : `enfants_du_parent()`, `progression_enfant(uuid)`, `lier_par_email()`, `lier_par_code(text)`, `retirer_consentement(uuid)`, `annuler_retrait_consentement(uuid)`, `delier_parent(uuid)`.
- Produces : les routes `/parent` et `/parent/enfant/[id]`.

- [ ] **Step 1 : tests unitaires de `format.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { etatConsentement, normaliserCode, resumeProgression } from './format';

describe('espace parent', () => {
  it('normalise le code saisi', () => {
    expect(normaliserCode(' abcd-efgh ')).toBe('ABCDEFGH');
    expect(normaliserCode('ab cd ef gh')).toBe('ABCDEFGH');
  });
  it('décrit le consentement', () => {
    expect(etatConsentement({ moins15: false, donneLe: null, retireLe: null, suppressionPrevueLe: null }))
      .toBe('Plus de 15 ans : aucun accord n’est nécessaire.');
    expect(etatConsentement({ moins15: true, donneLe: '2026-12-01T10:00:00Z', retireLe: null, suppressionPrevueLe: null }))
      .toBe('Accord donné le 1 décembre 2026.');
    expect(etatConsentement({ moins15: true, donneLe: '2026-12-01T10:00:00Z', retireLe: '2026-12-20T10:00:00Z', suppressionPrevueLe: '2027-01-19T10:00:00Z' }))
      .toBe('Accord retiré le 20 décembre 2026. Le compte sera supprimé le 19 janvier 2027.');
  });
  it('résume la progression', () => {
    expect(resumeProgression([
      { chapitresValides: 1, chapitresTotal: 4, derniereActivite: '2026-12-10T10:00:00Z' },
      { chapitresValides: 2, chapitresTotal: 2, derniereActivite: null },
    ])).toEqual({ valides: 3, total: 6, derniereActivite: '2026-12-10T10:00:00Z' });
  });
});
```

Tous les formats de date utilisent `Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' })`.

- [ ] **Step 2 : vérifier l'échec**, puis **Step 3 : implémenter**

- **`src/lib/parent/requetes.ts`** (`server-only`) : `lireEnfants()` et `lireProgressionEnfant(id)`. Elles appellent les RPC et renvoient des objets en camelCase. En cas d'erreur, elles lèvent `new Error(messageErreur(error.message))`.
- **`src/app/(app)/parent/page.tsx`** :
  - lire le profil, et rediriger vers `/` s'il n'est pas `parent` ;
  - appeler `lier_par_email()` à chaque affichage. C'est sans danger et idempotent, et le nombre renvoyé est ignoré ;
  - puis `lireEnfants()`.
  - Contenu :
    - titre « Mes enfants » ;
    - une `CarteEnfant` par enfant : nom, niveau, `etatConsentement`, abonnement (« Aucun abonnement » ou « Abonnement mensuel jusqu’au … »), résumé `x chapitres validés sur y`, lien « Voir le détail » ;
    - le bloc « Relier un enfant » avec `FormulaireCodeParent` ;
    - le texte : « Votre enfant a moins de 15 ans ? Il est relié automatiquement si vous avez créé ce compte avec l’adresse qui a reçu la demande d’accord. »
  - Sans aucun enfant : « Aucun enfant n’est relié à votre compte pour l’instant. »
- **`src/app/(app)/parent/actions.ts`** (`'use server'`) :
  - `relierParCode(etat, form)` : zod `code` de 8 à 12 caractères. Elle appelle `lier_par_code` et traduit le statut : `lie` donne « Votre enfant est maintenant relié à votre compte. » ; les autres statuts passent par `messageErreur`. Elle appelle `revalidatePath('/parent')` sur succès ;
  - `retirerAccord(etat, form)`, `annulerRetrait(etat, form)` et `delier(etat, form)` : chacune exige la case `confirme=on` (sinon « Cochez la case pour confirmer. »), un `eleveId` uuid valide par zod, puis appelle la RPC. Ensuite `revalidatePath`, puis la redirection : vers `/parent/enfant/<id>` après un retrait ou une annulation, vers `/parent` après une déliaison.
- **`src/app/(app)/parent/enfant/[id]/page.tsx`** :
  - si l'enfant n'est pas parmi `lireEnfants()` : `notFound()` ;
  - un tableau accessible (`<caption>`, `<th scope="col">`) : Cours, Chapitres validés, Meilleure note à l'évaluation (`formaterNote` existant, ou « — »), Cours validé (Oui/Non), Dernière activité ;
  - puis `ActionsEnfant`, qui affiche :
    - « Retirer mon accord » si l'enfant a moins de 15 ans, un accord donné et non retiré. Avec le texte : « Le compte de votre enfant sera bloqué immédiatement, puis supprimé définitivement dans 30 jours. Vous pourrez annuler pendant ce délai. » ;
    - « Annuler le retrait » si `retirePerMoi` ;
    - « Ne plus suivre cet enfant », toujours.
  - Chaque action est un formulaire avec une case de confirmation obligatoire.
- **Composants** : ils suivent `FormulaireEcheance` (`useActionState`, `role="status"` pour le succès, `.message-erreur` avec `role="alert"`). Le parent est vouvoyé.

- [ ] **Step 4 : vérifier**

Run : `npm test && npm run typecheck && npm run lint && npm run build`
Expected : PASS.

- [ ] **Step 5 : commit**

```bash
git add src/lib/parent "src/app/(app)/parent" src/components/parent
git commit -m "Ajoute l'espace parent : enfants, progression, code, retrait de l'accord

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6 : interface élève — parents reliés, écran de retrait, page d'accord

**Files :**
- Create : `src/components/donnees/ParentsRelies.tsx`
- Modify :
  - `src/app/mes-donnees/page.tsx`, `src/app/mes-donnees/actions.ts`
  - `src/app/consentement/page.tsx`
  - `src/app/accord-parental/[jeton]/page.tsx` et le composant de confirmation (`src/components/consentement/FormulaireAccord.tsx`)
  - `src/components/BanniereSuppression.tsx` (si elle propose « Annuler » : la masquer quand `suppression_imposee`)

**Interfaces :**
- Consumes : `parents_de_l_eleve()`, `generer_code_parent()`, `delier_parent(uuid)`, `enfants_du_parent()` (pour le parent), `mon_acces().consentement_retire_le` et `suppression_prevue_le`.
- Produces : rien de nouveau pour les tâches suivantes.

- [ ] **Step 1 : implémenter**

- **`/mes-donnees`** :
  - **pour un élève**, une section « Parents reliés » (`ParentsRelies`) :
    - la liste des parents (nom, « relié le … ») ;
    - pour un élève de 15 ans ou plus : un bouton « Ne plus partager avec ce parent » par parent (case de confirmation, action `delierParent`), et un bouton « Créer un code pour un parent ». Ce bouton appelle `generer_code_parent` et affiche le code une seule fois, en groupes de 4 (`ABCD-EFGH`), avec la phrase : « Donne ce code à ton parent. Il est valable 48 heures et ne sert qu’une fois. » ;
    - pour un élève de moins de 15 ans : « Ton parent se relie à ton compte avec l’adresse qui a reçu la demande d’accord. » ;
  - **pour un parent**, une section « Enfants suivis » : la liste des noms, avec un lien vers `/parent`.
  - Le code n'est jamais stocké côté client au-delà de l'état du formulaire.
- **`/consentement`** : si `acces.consentementRetireLe`, afficher à la place du formulaire :
  - un titre « Ton parent a retiré son accord » ;
  - le texte « Ton compte est bloqué et sera supprimé le <date>. Tu peux encore télécharger tes données. » ;
  - un lien « Mes données ».
  - Garder la redirection vers `/` quand `consentementRequis` est faux.
- **`BanniereSuppression`** : quand le profil a `suppression_imposee`, le bouton « Annuler la suppression » est remplacé par « La suppression a été demandée par ton parent. » Lire la colonne dans `lireProfil` si elle n'y est pas.
- **Page `/accord-parental/[jeton]`**, après un accord réussi (état de confirmation du formulaire), ajouter :
  - « Vous pouvez suivre la progression de votre enfant avec un compte parent. » ;
  - un lien « Créer mon compte parent » vers `/inscription` ;
  - la précision « Utilisez l’adresse e-mail qui a reçu cette demande ».
  - Le lien ne contient aucun jeton.

- [ ] **Step 2 : vérifier**

Run : `npm test && npm run typecheck && npm run lint && npm run build`
Expected : PASS.

- [ ] **Step 3 : commit**

```bash
git add src/components/donnees src/app/mes-donnees src/app/consentement src/app/accord-parental src/components/consentement src/components/BanniereSuppression.tsx src/lib/supabase
git commit -m "Montre les parents reliés à l'élève et l'écran de retrait de l'accord

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7 : CGV, confidentialité, pied de page

**Files :**
- Create : `src/app/(legal)/conditions-vente/page.tsx`
- Modify : `src/app/(legal)/confidentialite/page.tsx`, `src/components/PiedDePage.tsx`, `src/lib/routes.ts`, `src/lib/routes.test.ts`

- [ ] **Step 1 : test des routes**

Dans `routes.test.ts` : `redirectionPour('/conditions-vente', false)` vaut `null`.

- [ ] **Step 2 : implémenter**

- Ajouter `'/conditions-vente'` à `ROUTES_PUBLIQUES`.
- `PiedDePage` : un lien « Conditions de vente » après « Conditions d’utilisation ».
- **`/conditions-vente`** : reprendre la structure et les composants de `conditions-utilisation/page.tsx` (`src/app/(legal)/composants.tsx`, avertissement « Trame à faire relire par un juriste avant la mise en vente »). Sections :
  1. Objet : abonnement donnant accès à tous les cours d'App lycée.
  2. Formules : mensuelle et annuelle (l'annuelle équivaut à 2 mois offerts). Prix : `[À compléter]`, indiqués TTC sur la page de souscription.
  3. Essai et version gratuite : 7 jours d'accès complet, puis un cours gratuit sans limite de durée.
  4. Souscription et paiement : par un prestataire de paiement sécurisé `[À compléter : nom du prestataire]`. Le payeur est l'élève majeur ou un parent.
  5. Renouvellement et résiliation : renouvellement automatique, résiliation à tout moment avec effet à la fin de la période en cours.
  6. Échec de paiement : 7 jours de délai de grâce avec accès maintenu, puis retour à la version gratuite. Les résultats sont conservés.
  7. Droit de rétractation : 14 jours. Pour un contenu numérique fourni immédiatement, l'acheteur y renonce expressément au moment de la souscription (art. L221-28 du Code de la consommation). Formulation à faire valider.
  8. Médiation de la consommation : `[À compléter : médiateur et coordonnées]`.
  9. Données personnelles : renvoi à la politique de confidentialité.
  10. Droit applicable : droit français.
- **Confidentialité**, nouvelle section « Comptes parents » :
  - les données du parent (prénom, adresse e-mail) ;
  - le lien avec l'enfant (adresse de l'accord ou code) ;
  - ce que le parent voit : état de l'accord, abonnement, résumé de progression par cours. Ce qu'il ne voit jamais : calendrier, réponses, classes ;
  - le retrait de l'accord : blocage immédiat, suppression après 30 jours, annulable par le parent ;
  - à partir de 15 ans, l'élève peut retirer le lien ;
  - la conservation : les liens sont supprimés avec l'un des deux comptes.
  - Mettre à jour la mention « pas de compte parent », écrite à l'étape 5a, si elle existe.

- [ ] **Step 3 : vérifier**

Run : `npm test && npm run typecheck && npm run lint && npm run build`
Expected : PASS.

- [ ] **Step 4 : commit**

```bash
git add "src/app/(legal)" src/components/PiedDePage.tsx src/lib/routes.ts src/lib/routes.test.ts
git commit -m "Publie la trame des conditions de vente et décrit les comptes parents

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8 : bout en bout, bilan et revue finale

**Files :**
- Create : `e2e/parents.spec.ts`, `docs/superpowers/plans/2026-12-29-etape-5b-bilan.md`
- Modify :
  - `e2e/aide-db.ts`, `e2e/accessibilite.spec.ts`, `e2e/securite.spec.ts`, `e2e/nettoyage.ts` (si les comptes de test ne sont pas déjà couverts par leur préfixe)
  - `docs/superpowers/plans/2026-11-03-feuille-de-route.md`, `README.md`

- [ ] **Step 1 : aides**

Dans `e2e/aide-db.ts` :
- `confirmerEmail(email)` : met `email_confirmed_at = now()` par l'API admin, si l'inscription locale ne le fait pas déjà ;
- `simulerAbonnement(email, statut, finPeriode, finGrace?)` : insère ou met à jour `abonnement` avec la clé de service.

Ajouter dans `e2e/aide-parcours.ts` :
- `inscrireParent(page, email)` : inscription, puis choix « Parent d’un élève » sur `/bienvenue`, prénom « Camille ». On attend `/parent`.

- [ ] **Step 2 : parcours**

`e2e/parents.spec.ts`, avec des adresses de `emailDeTest('parent-…')` :

1. **Accord, puis compte parent.**
   - Un élève de moins de 15 ans demande l'accord. Le parent ouvre le lien Mailpit et donne son accord, puis clique « Créer mon compte parent ».
   - Il s'inscrit avec la même adresse, puis choisit « Parent d’un élève ».
   - Sur `/parent`, la carte de l'enfant affiche « Accord donné le … ».
   - « Voir le détail » montre le tableau de progression.
2. **Code.**
   - Un élève de plus de 15 ans crée un code dans « Mes données ».
   - Un parent, dans un autre contexte de navigation, saisit d'abord un code faux (message `code_parent_invalide`), puis le bon. L'enfant apparaît.
   - Côté élève, « Mes données » liste le parent.
3. **Retrait.**
   - Depuis le parcours 1, le parent coche la case puis clique « Retirer mon accord ».
   - Côté élève, `/` mène à `/consentement`, qui affiche « Ton parent a retiré son accord ».
   - Le parent clique « Annuler le retrait ». Côté élève, `/` affiche de nouveau le tableau de bord.
4. **Déliaison.**
   - L'élève de plus de 15 ans du parcours 2 retire le lien. La page `/parent` du parent n'affiche plus l'enfant.
5. **Abonné.**
   - `simulerAbonnement(email, 'actif', +20 jours)` pour un élève dont l'essai est fini (`vieillirInscription`).
   - Aucune bannière d'essai, et un deuxième cours s'ouvre.
   - Puis `impaye` avec un délai de grâce : la bannière « Le paiement de ton abonnement a échoué » est visible.

Ajouter `/parent`, `/parent/enfant/<id>` et `/conditions-vente` à la revue axe et à la vérification CSP.

- [ ] **Step 3 : vérification complète**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npm run test:db && npm test && npm run typecheck && npm run lint && npm run build && npm run e2e`
Expected : tout passe. Relever les nombres (pgTAP, Vitest, e2e) pour le bilan.

- [ ] **Step 4 : bilan et documents**

Le bilan `2026-12-29-etape-5b-bilan.md` reprend la forme de `2026-12-22-etape-5a-bilan.md` : ce qui est livré, les tests, les décisions, les limites acceptées. Les limites acceptées viennent du § 12 de la spec et de la décision 5 de ce plan, plus le code parent attaquable en force brute par une multitude de comptes parents (5 essais par heure et par compte, 31⁸ codes, 48 heures de validité).

Mettre aussi à jour :
- la feuille de route : 5b « Terminé (branche etape-5b-parents) », avec le lien du bilan ;
- le README : section Parents.

- [ ] **Step 5 : commit, puis revue finale Opus et `security-review`**

```bash
git add e2e docs README.md
git commit -m "Ajoute les parcours parents de bout en bout et le bilan de l'étape 5b

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

La revue finale porte sur toute la branche depuis `etape-5a-rgpd`. Points d'attention :
- aucune fuite des données d'un enfant vers un parent non relié ;
- `devenir_parent` ne peut pas servir à changer de rôle après une activité d'élève ;
- le retrait ne peut pas être contourné par l'élève (nouvelle demande d'accord, annulation, changement d'âge) ;
- les fonctions renommées `_5a` n'ont plus aucun droit ;
- les codes parents ne sont jamais stockés en clair.
