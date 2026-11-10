# Étape 3b : gestion du contenu — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :**
- Un `admin_contenu` rédige et corrige les chapitres et les questions dans l'application, sans passer par un fichier JSON.
- Il fait passer les questions par les statuts `brouillon` → `a_relire` → `valide`, et suit l'avancement des banques (objectif : 150 questions validées par chapitre).
- Il importe un cours complet en JSON depuis l'interface, dans une seule transaction.
- Un enseignant signale une question erronée. Elle sort des quiz et part en relecture avec son commentaire.
- Le HTML des chapitres est nettoyé par une liste blanche, à l'enregistrement et à l'affichage.

**Architecture :**
- **Toutes les écritures de contenu passent par des fonctions RPC `security definer`.** Les droits d'écriture directs et les politiques « ecriture admin » sont supprimés. Raison : les droits par colonne ne distinguent pas l'admin de l'élève, et il faut une validation et un versionnage communs.
- **Un seul chemin d'écriture des questions** : `prive.ecrire_question`, utilisé à la fois par l'éditeur, l'import depuis l'interface et le script d'import.
- **Versionnage.** Si on modifie la structure d'une question déjà tirée dans une tentative (type, propositions, bonnes réponses, réponses acceptées, marge), l'ancienne passe au statut `archivee` et une nouvelle version est créée. Les corrections passées restent exactes.
- **Schémas importés** : stockés dans un bucket Supabase Storage public `schemas`. Seul l'admin peut y écrire.
- **Côté Next.js** :
  - espace `/admin` : tableau de suivi, éditeurs de cours, de chapitre et de questions, import, signalements ;
  - bouton « Signaler » pour les enseignants ;
  - page « Mes signalements » pour les enseignants.

**Tech Stack :** Next.js 16, React 19, TypeScript, Supabase (Postgres 17, plpgsql, Storage), zod 4, `sanitize-html`, Vitest, pgTAP, Playwright.

**Spec :** `docs/superpowers/specs/2026-11-03-app-lycee-design.md`. Sections concernées : 3 « Contenu » et « Sécurité (RLS) », et 6 « Gestion du contenu ».

**Bilans précédents (points reportés à l'étape 3b) :**
- `docs/superpowers/plans/2026-11-03-etape-1-bilan.md` : nettoyage du HTML, contrainte sur `cours.couleur`, import (variables d'environnement, ne plus dépublier, supprimer les éléments retirés, transaction), `Array.isArray` sur `sections`, collisions d'ids de section, contraste des couleurs, trigger sur `modifie_le`.
- `docs/superpowers/plans/2026-11-10-etape-2-bilan.md` : éditeur en `security definer`, versionnage des questions utilisées, interdiction de déplacer un chapitre qui a des résultats, guide des auteurs, chemin « réponse courte » testé dans un navigateur, tests unitaires des actions.
- `docs/superpowers/plans/2026-11-17-etape-3a-bilan.md` : rien de spécifique à 3b, au-delà de ces points.

**Branche :** `etape-3b-contenu`, créée depuis `etape-3a-enseignant`. Sa PR vise `etape-3a-enseignant`, puis `main` quand les PR n°2 et n°3 sont fusionnées.

## Décisions prises dans ce plan (à valider avec la relecture)

1. **Écritures uniquement par RPC.**
   - On supprime les politiques « ecriture admin » et les droits `insert, update, delete` de `authenticated` sur `filiere`, `cours`, `chapitre`, `notion`, `question` et `question_corrige`.
   - Le script d'import appelle la RPC `importer_cours` avec la clé de service. La RPC accepte `service_role` ou `admin_contenu`.
2. **Versionnage des questions.**
   - Une modification « structurelle » d'une question déjà tirée dans une tentative crée une nouvelle version. Sont structurels : le type, les propositions, `bonnes_reponses`, `reponses_acceptees`, `marge` et `marge_relative`.
   - L'ancienne version passe à `archivee`, perd sa `source`, et la nouvelle porte `version_de`.
   - Les autres champs (énoncé, explication, notion, difficulté, statut) se modifient en place : corriger une faute de frappe ne change pas la correction.
   - L'historique de tirage (`historique_question`) repart de zéro pour la nouvelle version.
   - Les signalements ouverts suivent la nouvelle version.
3. **Statuts.**
   - `valide` s'atteint seulement depuis `a_relire`.
   - `a_relire` s'atteint depuis `brouillon` ou `valide`, et `brouillon` depuis `a_relire` ou `valide`.
   - `archivee` n'est jamais choisi à la main.
   - Passer une question à `valide` clôt ses signalements ouverts (statut `traite`).
4. **Import.**
   - Toute l'opération se fait dans une seule fonction, donc une seule transaction.
   - Un réimport ne dépublie jamais : `publie = ancien publie or p_publier`.
   - Une question à `source` absente du fichier est archivée si elle a déjà servi, sinon supprimée.
   - Les questions créées dans l'éditeur (sans `source`) ne sont jamais touchées.
   - Les chapitres absents du fichier ne sont pas touchés ; le bilan les liste.
   - Une `source` déjà utilisée dans un autre chapitre fait échouer tout l'import (`question_autre_chapitre`).
5. **Chapitres.**
   - Un chapitre ne change jamais de cours : `enregistrer_chapitre` n'accepte pas de nouveau `cours_id`.
   - On ne supprime pas un chapitre, on le dépublie.
6. **Éditeur de chapitre.**
   - Les sections sont du HTML édité dans une zone de texte, avec un aperçu nettoyé par le serveur et des boutons qui insèrent des modèles : encadré, figure, tableau.
   - Pas d'éditeur WYSIWYG : il abîmerait les schémas SVG en ligne du contenu BPH.
7. **Nettoyage HTML.**
   - `nettoyerHtml` s'appuie sur `sanitize-html` avec une liste blanche HTML + SVG établie d'après l'inventaire du contenu BPH. Aucun script, aucun `on*`, aucune `url()` externe.
   - Liens : seulement `https:` et `mailto:`, avec `rel="noopener noreferrer"`.
   - Images : seulement depuis le bucket `schemas` du projet.
   - Le nettoyage s'applique à l'enregistrement (serveur), à l'import et à l'affichage (défense en profondeur).
8. **Schémas importés.**
   - Bucket public `schemas` : PNG, JPEG ou WebP, 2 Mo au plus.
   - Les SVG restent en ligne dans le HTML, où ils sont nettoyés. Un fichier SVG servi tel quel pourrait exécuter du script.
9. **Signalement.**
   - Réservé aux comptes `enseignant` validés, sur une question `valide` d'un cours publié.
   - Un commentaire de 5 à 1000 caractères est obligatoire.
   - 20 signalements au plus par 24 heures, et un seul signalement ouvert par question et par enseignant.
   - La question repasse à `a_relire`, donc elle sort des tirages. Les tentatives déjà ouvertes ne changent pas.
   - Si l'admin rejette le dernier signalement ouvert d'une question encore `a_relire`, elle redevient `valide`.
   - L'enseignant suit ses signalements et la réponse de l'admin sur `/enseignant/signalements`.
10. **Tableau de suivi.**
    - Pour chaque chapitre : questions validées sur 150, à relire, brouillons et signalements ouverts.
    - Un signal apparaît sous 30 questions validées.
11. **Couleur de cours.**
    - Contrainte `^#[0-9a-f]{6}$` en minuscules.
    - L'éditeur refuse une couleur dont le contraste avec le blanc est inférieur à 3:1. La couleur sert de bordure et d'accent, pas de texte (WCAG 1.4.11).

## Contraintes globales

- Toute l'interface est **en français**. On tutoie l'élève et l'enseignant, et on garde le même ton dans l'espace admin. Les formulations ne sont pas genrées.
- **Aucune écriture directe sur les tables de contenu** pour `authenticated` ni `anon`. Tout passe par une RPC `security definer` qui vérifie `public.role_actuel() = 'admin_contenu'`, sauf `importer_cours`, qui accepte aussi `service_role`.
- **Les élèves et les enseignants ne lisent jamais `question.enonce`, `question.propositions` ni `question_corrige` directement.** Les RPC de lecture admin renvoient zéro ligne aux non-admins. Les droits par colonne posés à l'étape 2 restent inchangés.
- Chaque fonction exposée :
  - a `set search_path = ''` et des noms qualifiés ;
  - reçoit `revoke execute … from public, anon`, puis `grant execute … to authenticated`, et `service_role` pour `importer_cours`.
  - Les helpers vont dans `prive`.
- Les codes d'erreur levés par la base sont des mots-clés `snake_case`, traduits en français dans `src/lib/erreurs.ts`, avec un test du texte exact.
- **Le HTML stocké ou affiché passe par `nettoyerHtml`** (`src/lib/contenu/html.ts`). `dangerouslySetInnerHTML` n'est permis que sur une valeur qui sort de `nettoyerHtml` dans le même composant.
- Lors d'un `create or replace` sur une fonction existante, on recopie son **corps actuel** depuis la migration la plus récente qui la définit, et on n'ajoute que le changement décrit.
- Le seuil de réussite et les règles de quiz et d'évaluation restent inchangés.
- Commandes shell : préfixer par `export PATH="$HOME/.orbstack/bin:$PATH";`. Ne jamais afficher ni commiter `.env.local`. La clé de service n'est utilisée que dans `scripts/` et dans les aides e2e, derrière la garde « base locale ».
- Après chaque migration : `npm run db:reset`, puis `npx supabase gen types typescript --local > src/lib/supabase/types.ts`.
- Avant d'utiliser une API de Next.js, de supabase-js (Storage compris), de `sanitize-html` ou de plpgsql, consulter sa documentation à jour avec **context7**.
- Messages de commit en français, à l'impératif présent, terminés par la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hors périmètre

- Génération des banques de 150 questions (étape 6).
- Calendrier et notifications (étape 4) ; CSP et en-têtes de sécurité (étape 4).
- Abonnements (étape 5).
- Nouveaux types de questions (étape 7).
- Historique des modifications (journal d'audit) : seul `modifie_le` est tenu à jour.

## Répartition des modèles

| Tâche | Implémentation | Revue |
|---|---|---|
| 1 Schéma | Sonnet | Sonnet |
| 2 Écriture des questions | **Opus** | **Opus** |
| 3 Chapitres, cours, import | Sonnet | **Opus** |
| 4 Signalements | Sonnet | Sonnet |
| 5 Bucket des schémas | Haiku | Sonnet |
| 6 Nettoyage HTML | Sonnet | **Opus** |
| 7 Couche TypeScript et script d'import | Sonnet | Sonnet |
| 8 à 12 Interfaces | Sonnet | Sonnet |
| 13 Bout en bout, guide, revue | Sonnet, puis revue finale **Opus** | — |

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `supabase/migrations/20261124000001_statut_archivee.sql` | nouvelle valeur d'enum (seule dans sa migration) |
| `supabase/migrations/20261124000002_contenu_schema.sql` | contraintes, `version_de`, `modifie_le`, table `signalement`, retrait des écritures directes |
| `supabase/migrations/20261124000003_ecriture_questions.sql` | `prive.valider_question`, `prive.ecrire_question`, RPC questions |
| `supabase/migrations/20261124000004_chapitres_import.sql` | RPC chapitres, cours, `importer_cours`, `suivi_contenu` |
| `supabase/migrations/20261124000005_signalements.sql` | RPC de signalement |
| `supabase/migrations/20261124000006_schemas_storage.sql` | bucket `schemas` et politiques |
| `supabase/tests/contenu_schema.test.sql`, `ecriture_questions.test.sql`, `chapitres_import.test.sql`, `signalements.test.sql`, `schemas_storage.test.sql` | pgTAP |
| `src/lib/contenu/html.ts` (+ test) | `nettoyerHtml` |
| `src/lib/contenu/donnees-question.ts` (+ test) | conversion d'une question de l'import ou de l'éditeur vers le JSON des RPC |
| `src/lib/contenu/couleur.ts` (+ test) | contraste WCAG |
| `src/lib/admin/garde.ts`, `requetes.ts` | `exigerAdmin`, lectures admin |
| `scripts/importer-contenu.ts` | réécrit autour de `importer_cours` |
| `src/app/(app)/admin/page.tsx` | tableau de suivi |
| `src/app/(app)/admin/cours/[id]/…`, `admin/chapitres/[id]/…`, `admin/questions/[id]/…` | éditeurs |
| `src/app/(app)/admin/import/…`, `admin/signalements/…` | import et signalements |
| `src/app/(app)/enseignant/signalements/page.tsx`, `src/components/BoutonSignaler.tsx` | côté enseignant |
| `src/styles/admin.css` | styles de l'espace admin |
| `docs/guide-auteurs.md` | guide des auteurs |
| `e2e/contenu.spec.ts` | parcours de bout en bout |

---

### Task 1 : schéma du contenu

**Files :**
- Create : `supabase/migrations/20261124000001_statut_archivee.sql`, `supabase/migrations/20261124000002_contenu_schema.sql`, `supabase/tests/contenu_schema.test.sql`
- Modify : `supabase/tests/rls_socle.test.sql` (les écritures directes de l'admin sont désormais refusées)

**Interfaces :**
- Produces : valeur `archivee` de `statut_question_t`, colonne `question.version_de`, colonnes `modifie_le` sur `cours` et `chapitre`, table `public.signalement`, trigger `prive.toucher_modifie_le`.

- [ ] **Step 1 : écrire le test pgTAP qui échoue.** Créer `supabase/tests/contenu_schema.test.sql` :

```sql
begin;
select plan(14);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin-schema@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', 'eleve-schema@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000a1';

select has_column('public', 'question', 'version_de', 'question.version_de existe');
select has_column('public', 'chapitre', 'modifie_le', 'chapitre.modifie_le existe');
select has_column('public', 'cours', 'modifie_le', 'cours.modifie_le existe');
select has_table('public', 'signalement', 'la table signalement existe');
select ok('archivee' = any (enum_range(null::public.statut_question_t)::text[]), 'statut archivee disponible');

-- Slug réel du cours BPH : le lire dans contenu/1re-st2s/bph.json.
select throws_ok($$ update public.cours set couleur = 'rouge' where slug = 'bph-1re-st2s' $$,
  '23514', null, 'couleur de cours invalide refusée');
select throws_ok($$ update public.chapitre set slug = 'Pas Bon' where numero = 1 $$,
  '23514', null, 'slug de chapitre invalide refusé');

-- modifie_le avance à chaque mise à jour.
update public.chapitre set modifie_le = '2000-01-01' where numero = 1;
update public.chapitre set titre = titre where numero = 1;
select ok((select bool_and(modifie_le > '2000-01-02') from public.chapitre where numero = 1), 'trigger modifie_le sur chapitre');

-- Plus aucune écriture directe, même pour l'admin.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select throws_ok($$ update public.chapitre set titre = 'x' $$, '42501', null, 'admin : update direct de chapitre refusé');
select throws_ok($$ insert into public.question (chapitre_id, type, enonce) select id, 'vrai_faux', 'x' from public.chapitre limit 1 $$,
  '42501', null, 'admin : insert direct de question refusé');
select throws_ok($$ delete from public.question_corrige $$, '42501', null, 'admin : delete direct de corrigé refusé');
select throws_ok($$ insert into public.signalement (question_id, auteur_id, commentaire) values (gen_random_uuid(), auth.uid(), 'abcdef') $$,
  '42501', null, 'signalement : pas d''insert direct');
select throws_ok($$ select count(*) from public.signalement $$, '42501', null, 'signalement : aucune lecture directe');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);
select throws_ok($$ update public.cours set titre = 'x' $$, '42501', null, 'élève : update direct de cours refusé');

select * from finish();
rollback;
```

- [ ] **Step 2 : lancer et voir l'échec.** Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db`. Expected : FAIL sur `contenu_schema` (colonnes absentes).

- [ ] **Step 3 : migration de l'enum.** `supabase/migrations/20261124000001_statut_archivee.sql` :

```sql
-- Statut « archivee » : ancienne version d'une question déjà tirée dans des tentatives (voir 20261124000003).
-- Seul dans sa migration : une valeur d'enum ajoutée ne peut pas servir dans la transaction qui la crée.
alter type public.statut_question_t add value if not exists 'archivee';
```

- [ ] **Step 4 : migration du schéma.** `supabase/migrations/20261124000002_contenu_schema.sql` :

```sql
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
```

Vérifier avant d'écrire le `drop policy` : le nom exact des politiques (une migration de l'étape 2, `20261110000001_optimise_politiques.sql`, les modifie avec `alter policy`) et le nom de la contrainte d'unicité éventuelle. Adapter si besoin.

- [ ] **Step 5 : adapter `rls_socle.test.sql`.** Les assertions « l'admin peut écrire » deviennent « l'admin ne peut pas écrire directement » (`throws_ok … '42501'`). Ne pas en supprimer : les retourner.

- [ ] **Step 6 : vérifier.** Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npm run test:db`. Expected : PASS.

  Attention : à ce stade, `db:reset` importe encore BPH par le script actuel (écritures avec la clé de service), ce qui marche toujours, car la clé de service contourne RLS et les droits retirés à `authenticated`.

  Régénérer les types et lancer `npm run typecheck`.

- [ ] **Step 7 : commit.**

```bash
git add supabase src/lib/supabase/types.ts
git commit -m "Prépare le schéma de la gestion du contenu et retire les écritures directes"
```

---

### Task 2 : écriture et versionnage des questions (base)

**Files :**
- Create : `supabase/migrations/20261124000003_ecriture_questions.sql`, `supabase/tests/ecriture_questions.test.sql`

**Interfaces :**
- Consumes : Task 1 (`archivee`, `version_de`, `signalement`).
- Produces :
  - `prive.valider_question(p jsonb) returns void` (lève `question_invalide`) ;
  - `prive.ecrire_question(p_chapitre uuid, p_question uuid, p jsonb, out id_question uuid, out resultat text)`, où `resultat` vaut `'cree' | 'modifiee' | 'versionnee' | 'inchangee'` ;
  - `public.enregistrer_question(p_chapitre uuid, p_question uuid, p_donnees jsonb) returns uuid` ;
  - `public.changer_statut_question(p_question uuid, p_statut public.statut_question_t) returns void` ;
  - `public.supprimer_question(p_question uuid) returns void` ;
  - `public.questions_chapitre_admin(p_chapitre uuid)` (colonnes ci-dessous) ;
  - `public.notions_chapitre(p_chapitre uuid) returns setof text`.

**Format JSON d'une question (`p_donnees`), commun à l'éditeur et à l'import :**

```json
{ "source": "bph-ch1-q01", "type": "qcm_unique", "enonce": "…", "propositions": ["…", "…"],
  "bonnes_reponses": [1], "reponses_acceptees": [], "marge": null, "marge_relative": false,
  "notion": "débit cardiaque", "difficulte": 2, "statut": "a_relire", "explication": "…" }
```

- `vrai_faux` : `propositions` vaut `[]` et `bonnes_reponses` vaut `[true]` ou `[false]`.
- `reponse_courte` : `propositions` et `bonnes_reponses` valent `[]`, et `reponses_acceptees` contient au moins une chaîne.
- `source` est facultatif. Les questions créées dans l'éditeur n'en ont pas.

- [ ] **Step 1 : écrire le test pgTAP qui échoue.** `supabase/tests/ecriture_questions.test.sql` couvre, avec des données créées dans le test (un cours et un chapitre de test, un admin, un élève, un enseignant) :

```sql
begin;
select plan(30);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000b1', 'admin-q@test.local'),
  ('00000000-0000-0000-0000-0000000000b2', 'eleve-q@test.local'),
  ('00000000-0000-0000-0000-0000000000b3', 'prof-q@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000b1';
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000b3';
insert into public.cours (id, slug, matiere, titre, publie) values
  ('00000000-0000-0000-0000-00000000c001', 'test-q', 'Test', 'Cours test', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('00000000-0000-0000-0000-00000000c101', '00000000-0000-0000-0000-00000000c001', 'ch-a', 1, 'A', true),
  ('00000000-0000-0000-0000-00000000c102', '00000000-0000-0000-0000-00000000c001', 'ch-b', 2, 'B', true);

set local role authenticated;
-- Non-admins.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, 'P0001', 'acces_refuse', 'élève : écriture refusée');
select is((select count(*)::int from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101')), 0,
  'élève : aucune ligne en lecture admin');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b3","role":"authenticated"}', true);
select throws_ok($$ select public.changer_statut_question(gen_random_uuid(), 'valide') $$, 'P0001', 'acces_refuse',
  'enseignant : changement de statut refusé');

-- Admin : création des quatre types.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select lives_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-q1","type":"qcm_unique","enonce":"Q1","propositions":["a","b","c"],"bonnes_reponses":[1],"statut":"a_relire","notion":"n1"}') $$,
  'admin : qcm_unique créé');
select lives_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_multiple","enonce":"Q2","propositions":["a","b","c"],"bonnes_reponses":[0,2]}') $$, 'qcm_multiple créé');
select lives_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"Q3","bonnes_reponses":[false]}') $$, 'vrai_faux créé');
select lives_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"reponse_courte","enonce":"Q4","reponses_acceptees":["Na+"],"marge":null}') $$, 'reponse_courte créée');
select is((select count(*)::int from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101')), 4, 'admin : 4 questions lues');
select is((select statut::text from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where source = 't-q1'),
  'a_relire', 'statut fourni respecté');
select is((select statut::text from public.questions_chapitre_admin('00000000-0000-0000-0000-00000000c101') where enonce = 'Q2'),
  'brouillon', 'statut par défaut : brouillon');
select ok((select 'n1' = any (array(select public.notions_chapitre('00000000-0000-0000-0000-00000000c101')))), 'notion créée');

-- Validation.
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_unique","enonce":"x","propositions":["a","b"],"bonnes_reponses":[2]}') $$, 'P0001', 'question_invalide', 'indice hors limites');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"qcm_multiple","enonce":"x","propositions":["a","b"],"bonnes_reponses":[0,0]}') $$, 'P0001', 'question_invalide', 'indice en double');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"reponse_courte","enonce":"x","reponses_acceptees":["5"],"marge_relative":true}') $$, 'P0001', 'question_invalide', 'marge relative sans marge');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true],"statut":"archivee"}') $$, 'P0001', 'question_invalide', 'archivee non choisissable');
select throws_ok($$ select public.enregistrer_question('00000000-0000-0000-0000-00000000c101', null,
  '{"type":"vrai_faux","enonce":"x","bonnes_reponses":[true],"difficulte":"dur"}') $$, 'P0001', 'question_invalide', 'difficulté non numérique');

-- Modification en place (pas encore utilisée) puis « inchangée ».
select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-q1","type":"qcm_unique","enonce":"Q1 bis","propositions":["a","b","c"],"bonnes_reponses":[1],"statut":"a_relire","notion":"n1"}')),
  'modifiee', 'modification en place par source');
select is((select resultat from prive.ecrire_question('00000000-0000-0000-0000-00000000c101', null,
  '{"source":"t-q1","type":"qcm_unique","enonce":"Q1 bis","propositions":["a","b","c"],"bonnes_reponses":[1],"statut":"a_relire","notion":"n1"}')),
  'inchangee', 'réécriture identique : inchangée');
select throws_ok($$ select prive.ecrire_question('00000000-0000-0000-0000-00000000c102', null,
  '{"source":"t-q1","type":"vrai_faux","enonce":"x","bonnes_reponses":[true]}') $$, 'P0001', 'question_autre_chapitre',
  'une source ne change pas de chapitre');
```

Note : `prive` n'est pas accessible à `authenticated`. Les trois appels directs à `prive.ecrire_question` se font après `reset role;` et se remettent ensuite en `set local role authenticated`. Faire de même pour les vérifications sur les tables.

Le test continue avec ces scénarios, sur le même modèle :
  - **Statuts.**
    - `changer_statut_question(Q2, 'valide')` depuis `brouillon` lève `transition_invalide`.
    - `brouillon` → `a_relire` → `valide` passe.
    - `valide` → `a_relire` passe.
    - Choisir `archivee` lève `transition_invalide`.
  - **Versionnage.** Insérer en SQL (rôle `postgres`) une tentative et une `tentative_question` pour l'élève sur `t-q1`. Ensuite :
    - modifier l'énoncé seul donne `modifiee`, et c'est le même id ;
    - modifier les propositions donne `versionnee`, avec un nouvel id ;
    - l'ancienne question est `archivee` avec `source` nulle, la nouvelle a `version_de` égal à l'ancien id et `source = 't-q1'` ;
    - le corrigé de l'ancienne n'a pas changé (`bonnes_reponses = [1]`) ;
    - un signalement ouvert sur l'ancienne (inséré en SQL) suit la nouvelle version ;
    - `questions_chapitre_admin` ne renvoie plus l'ancienne version ;
    - réécrire l'ancienne par son id lève `question_archivee`.
  - **Suppression.**
    - `supprimer_question` d'une question jamais tirée réussit.
    - Sur une question tirée, elle lève `question_utilisee`.
  - **Clôture des signalements.** Passer une question à `valide` clôt ses signalements ouverts (`statut = 'traite'`).

  Terminer par `select * from finish(); rollback;` et ajuster `plan(N)` au nombre réel d'assertions.

- [ ] **Step 2 : lancer et voir l'échec.** Run : `npm run test:db`. Expected : FAIL (fonctions absentes).

- [ ] **Step 3 : écrire la migration.** `supabase/migrations/20261124000003_ecriture_questions.sql` :

```sql
-- Étape 3b : un seul chemin d'écriture des questions (éditeur, import, script) avec validation et versionnage.

create function prive.exiger_admin() returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'admin_contenu' then
    raise exception 'acces_refuse';
  end if;
end $$;

-- Vérifie la forme d'une question avant écriture (la même que src/lib/contenu/format-import.ts).
create function prive.valider_question(p jsonb) returns void
language plpgsql immutable set search_path = '' as $$
declare
  v_type text := p->>'type';
  v_props jsonb := coalesce(p->'propositions', '[]'::jsonb);
  v_bonnes jsonb := coalesce(p->'bonnes_reponses', '[]'::jsonb);
  v_acceptees jsonb := coalesce(p->'reponses_acceptees', '[]'::jsonb);
  v_n int;
begin
  if jsonb_typeof(p) <> 'object'
     or v_type is null or v_type not in ('qcm_unique', 'qcm_multiple', 'vrai_faux', 'reponse_courte')
     or char_length(btrim(coalesce(p->>'enonce', ''))) not between 1 and 2000
     or coalesce(p->>'statut', 'brouillon') not in ('brouillon', 'a_relire', 'valide')
     or coalesce(p->>'difficulte', '2') !~ '^[1-3]$'
     or char_length(coalesce(p->>'explication', '')) > 4000
     or char_length(coalesce(p->>'notion', '')) > 120
     or char_length(coalesce(p->>'source', '')) > 120
     or jsonb_typeof(v_props) <> 'array' or jsonb_typeof(v_bonnes) <> 'array' or jsonb_typeof(v_acceptees) <> 'array'
     or coalesce(p->>'marge', '0') !~ '^\d+(\.\d+)?$'
     or coalesce(p->>'marge_relative', 'false') not in ('true', 'false')
  then
    raise exception 'question_invalide';
  end if;
  v_n := jsonb_array_length(v_props);
  if v_type in ('qcm_unique', 'qcm_multiple') then
    if v_n not between 2 and 10
       or exists (select 1 from jsonb_array_elements(v_props) e
                   where jsonb_typeof(e) <> 'string' or char_length(btrim(e #>> '{}')) not between 1 and 500)
       or exists (select 1 from jsonb_array_elements(v_bonnes) e
                   where jsonb_typeof(e) <> 'number' or (e #>> '{}') !~ '^\d+$' or (e #>> '{}')::int >= v_n)
       or (select count(distinct e) from jsonb_array_elements(v_bonnes) e) <> jsonb_array_length(v_bonnes)
       or (v_type = 'qcm_unique' and jsonb_array_length(v_bonnes) <> 1)
       or (v_type = 'qcm_multiple' and jsonb_array_length(v_bonnes) < 1)
       or jsonb_array_length(v_acceptees) <> 0
    then
      raise exception 'question_invalide';
    end if;
  elsif v_type = 'vrai_faux' then
    if v_n <> 0 or jsonb_array_length(v_bonnes) <> 1 or jsonb_typeof(v_bonnes->0) <> 'boolean'
       or jsonb_array_length(v_acceptees) <> 0 then
      raise exception 'question_invalide';
    end if;
  else
    if v_n <> 0 or jsonb_array_length(v_bonnes) <> 0 or jsonb_array_length(v_acceptees) not between 1 and 20
       or exists (select 1 from jsonb_array_elements(v_acceptees) e
                   where jsonb_typeof(e) <> 'string' or char_length(btrim(e #>> '{}')) not between 1 and 200)
       or (coalesce((p->>'marge_relative')::boolean, false) and p->>'marge' is null)
    then
      raise exception 'question_invalide';
    end if;
  end if;
end $$;

-- Écrit une question. Crée, modifie en place, ou versionne si la structure d'une question déjà tirée change :
-- l'ancienne passe à « archivee » (les corrections passées restent exactes) et la nouvelle porte version_de.
create function prive.ecrire_question(p_chapitre uuid, p_question uuid, p jsonb, out id_question uuid, out resultat text)
language plpgsql security definer set search_path = '' as $$
declare
  v_ancienne public.question;
  v_corrige public.question_corrige;
  v_type public.type_question_t;
  v_props jsonb := coalesce(p->'propositions', '[]'::jsonb);
  v_bonnes jsonb := coalesce(p->'bonnes_reponses', '[]'::jsonb);
  v_acceptees text[];
  v_marge numeric := (p->>'marge')::numeric;
  v_relative boolean := coalesce((p->>'marge_relative')::boolean, false);
  v_statut public.statut_question_t := coalesce(p->>'statut', 'brouillon')::public.statut_question_t;
  v_difficulte smallint := coalesce((p->>'difficulte')::smallint, 2);
  v_enonce text := btrim(p->>'enonce');
  v_explication text := coalesce(p->>'explication', '');
  v_source text := nullif(btrim(p->>'source'), '');
  v_notion uuid;
  v_structure boolean;
begin
  perform prive.valider_question(p);
  v_type := (p->>'type')::public.type_question_t;
  select coalesce(array_agg(btrim(x)), '{}') into v_acceptees
    from jsonb_array_elements_text(coalesce(p->'reponses_acceptees', '[]'::jsonb)) x;
  if not exists (select 1 from public.chapitre c where c.id = p_chapitre) then
    raise exception 'chapitre_introuvable';
  end if;
  if nullif(btrim(p->>'notion'), '') is not null then
    insert into public.notion as n (chapitre_id, nom) values (p_chapitre, btrim(p->>'notion'))
      on conflict (chapitre_id, nom) do update set nom = excluded.nom
      returning n.id into v_notion;
  end if;

  if p_question is not null then
    select * into v_ancienne from public.question q where q.id = p_question for update;
    if not found then
      raise exception 'question_introuvable';
    end if;
  elsif v_source is not null then
    select * into v_ancienne from public.question q where q.source = v_source for update;
  end if;

  if v_ancienne.id is null then
    insert into public.question as q (chapitre_id, notion_id, type, enonce, propositions, difficulte, statut, source)
      values (p_chapitre, v_notion, v_type, v_enonce, v_props, v_difficulte, v_statut, v_source)
      returning q.id into id_question;
    insert into public.question_corrige (question_id, bonnes_reponses, reponses_acceptees, marge, marge_relative, explication)
      values (id_question, v_bonnes, v_acceptees, v_marge, v_relative, v_explication);
    resultat := 'cree';
    return;
  end if;

  if v_ancienne.chapitre_id <> p_chapitre then
    raise exception 'question_autre_chapitre';
  end if;
  if v_ancienne.statut = 'archivee' then
    raise exception 'question_archivee';
  end if;
  select * into v_corrige from public.question_corrige c where c.question_id = v_ancienne.id;
  v_structure := v_ancienne.type <> v_type
    or v_ancienne.propositions <> v_props
    or v_corrige.bonnes_reponses is distinct from v_bonnes
    or v_corrige.reponses_acceptees is distinct from v_acceptees
    or v_corrige.marge is distinct from v_marge
    or v_corrige.marge_relative is distinct from v_relative;

  if v_structure and exists (select 1 from public.tentative_question tq where tq.question_id = v_ancienne.id) then
    update public.question q set statut = 'archivee', source = null where q.id = v_ancienne.id;
    insert into public.question as q (chapitre_id, notion_id, type, enonce, propositions, difficulte, statut, source, version_de)
      values (p_chapitre, v_notion, v_type, v_enonce, v_props, v_difficulte, v_statut,
              coalesce(v_source, v_ancienne.source), v_ancienne.id)
      returning q.id into id_question;
    insert into public.question_corrige (question_id, bonnes_reponses, reponses_acceptees, marge, marge_relative, explication)
      values (id_question, v_bonnes, v_acceptees, v_marge, v_relative, v_explication);
    update public.signalement s set question_id = id_question where s.question_id = v_ancienne.id and s.statut = 'ouvert';
    resultat := 'versionnee';
    return;
  end if;

  id_question := v_ancienne.id;
  if not v_structure
     and v_ancienne.enonce = v_enonce and v_ancienne.notion_id is not distinct from v_notion
     and v_ancienne.difficulte = v_difficulte and v_ancienne.statut = v_statut
     and v_corrige.explication = v_explication
     and v_ancienne.source is not distinct from coalesce(v_source, v_ancienne.source) then
    resultat := 'inchangee';
    return;
  end if;
  update public.question q
     set notion_id = v_notion, type = v_type, enonce = v_enonce, propositions = v_props,
         difficulte = v_difficulte, statut = v_statut, source = coalesce(v_source, q.source)
   where q.id = v_ancienne.id;
  update public.question_corrige c
     set bonnes_reponses = v_bonnes, reponses_acceptees = v_acceptees, marge = v_marge,
         marge_relative = v_relative, explication = v_explication
   where c.question_id = v_ancienne.id;
  resultat := 'modifiee';
end $$;

create function public.enregistrer_question(p_chapitre uuid, p_question uuid, p_donnees jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  perform prive.exiger_admin();
  select e.id_question into v_id from prive.ecrire_question(p_chapitre, p_question, p_donnees) e;
  return v_id;
end $$;

-- Ordre des statuts : brouillon → a_relire → valide ; retour possible vers a_relire ou brouillon.
create function public.changer_statut_question(p_question uuid, p_statut public.statut_question_t) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_actuel public.statut_question_t;
begin
  perform prive.exiger_admin();
  select q.statut into v_actuel from public.question q where q.id = p_question for update;
  if not found then
    raise exception 'question_introuvable';
  end if;
  if v_actuel = 'archivee' or p_statut = 'archivee'
     or (p_statut = 'valide' and v_actuel <> 'a_relire')
     or (p_statut = 'a_relire' and v_actuel not in ('brouillon', 'valide'))
     or (p_statut = 'brouillon' and v_actuel not in ('a_relire', 'valide')) then
    raise exception 'transition_invalide';
  end if;
  update public.question q set statut = p_statut where q.id = p_question;
  if p_statut = 'valide' then
    update public.signalement s set statut = 'traite', traite_le = now(), traite_par = auth.uid()
     where s.question_id = p_question and s.statut = 'ouvert';
  end if;
end $$;

-- Une question déjà tirée ne se supprime pas : ses corrections en dépendent (archiver en la modifiant, ou la repasser en brouillon).
create function public.supprimer_question(p_question uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.exiger_admin();
  if exists (select 1 from public.tentative_question tq where tq.question_id = p_question) then
    raise exception 'question_utilisee';
  end if;
  delete from public.question q where q.id = p_question;
  if not found then
    raise exception 'question_introuvable';
  end if;
end $$;

-- Lecture admin d'un chapitre (énoncés et corrigés). Zéro ligne pour un non-admin.
create function public.questions_chapitre_admin(p_chapitre uuid)
returns table (id uuid, source text, type public.type_question_t, statut public.statut_question_t, difficulte smallint,
               notion text, enonce text, propositions jsonb, bonnes_reponses jsonb, reponses_acceptees text[],
               marge numeric, marge_relative boolean, explication text, version_de uuid, utilisee boolean,
               signalements_ouverts int, modifie_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select q.id, q.source, q.type, q.statut, q.difficulte, n.nom, q.enonce, q.propositions,
         c.bonnes_reponses, c.reponses_acceptees, c.marge, c.marge_relative, c.explication, q.version_de,
         exists (select 1 from public.tentative_question tq where tq.question_id = q.id),
         (select count(*)::int from public.signalement s where s.question_id = q.id and s.statut = 'ouvert'),
         q.modifie_le
    from public.question q
    join public.question_corrige c on c.question_id = q.id
    left join public.notion n on n.id = q.notion_id
   where q.chapitre_id = p_chapitre and q.statut <> 'archivee'
     and public.role_actuel() = 'admin_contenu'
   order by q.cree_le, q.id
$$;

create function public.notions_chapitre(p_chapitre uuid) returns setof text
language sql stable security definer set search_path = '' as $$
  select n.nom from public.notion n
   where n.chapitre_id = p_chapitre and public.role_actuel() = 'admin_contenu'
   order by n.nom
$$;

revoke execute on function prive.exiger_admin(), prive.valider_question(jsonb),
  prive.ecrire_question(uuid, uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.enregistrer_question(uuid, uuid, jsonb), public.changer_statut_question(uuid, public.statut_question_t),
  public.supprimer_question(uuid), public.questions_chapitre_admin(uuid), public.notions_chapitre(uuid) from public, anon;
grant execute on function public.enregistrer_question(uuid, uuid, jsonb), public.changer_statut_question(uuid, public.statut_question_t),
  public.supprimer_question(uuid), public.questions_chapitre_admin(uuid), public.notions_chapitre(uuid) to authenticated;
```

Vérifier : les casts `::boolean`, `::numeric` et `::smallint` ne peuvent plus échouer après `valider_question`, sauf `marge`, déjà filtrée par l'expression régulière. Si un cast lève malgré tout une erreur 22P02, envelopper `valider_question` d'un bloc `exception when invalid_text_representation then raise exception 'question_invalide'`.

- [ ] **Step 4 : lancer les tests.** Run : `npm run db:reset && npm run test:db`. Expected : PASS sur tous les fichiers. Les tests de quiz et d'évaluation de l'étape 2 doivent rester verts : le tirage filtre déjà `statut = 'valide'`.

- [ ] **Step 5 : types, puis commit.**

```bash
npx supabase gen types typescript --local > src/lib/supabase/types.ts
git add supabase src/lib/supabase/types.ts
git commit -m "Ajoute l'écriture des questions par RPC avec validation et versionnage"
```

---

### Task 3 : chapitres, cours, import transactionnel et tableau de suivi (base)

**Files :**
- Create : `supabase/migrations/20261124000004_chapitres_import.sql`, `supabase/tests/chapitres_import.test.sql`

**Interfaces :**
- Consumes : `prive.exiger_admin`, `prive.ecrire_question` (Task 2).
- Produces :
  - `public.enregistrer_cours(p_cours uuid, p_donnees jsonb) returns uuid`, avec les clés `slug, filiere (code), niveau, matiere, titre, couleur, ordre` ;
  - `public.publier_cours(p_cours uuid, p_publie boolean) returns void` ;
  - `public.enregistrer_chapitre(p_cours uuid, p_chapitre uuid, p_donnees jsonb) returns uuid`, avec les clés `slug, numero, titre, titre_court, duree, resume, chapeau, objectifs[], sections[{id,titre,html}], a_retenir` ;
  - `public.publier_chapitre(p_chapitre uuid, p_publie boolean) returns void` ;
  - `public.importer_cours(p_cours jsonb, p_publier boolean default false) returns jsonb`, qui renvoie `{cours_id, chapitres, cree, modifiee, versionnee, inchangee, archivee, supprimee, chapitres_absents: [slug…]}` ;
  - `public.suivi_contenu()`, qui renvoie `cours_id, cours_slug, cours_titre, cours_publie, chapitre_id, numero, chapitre_titre, chapitre_publie, valides, a_relire, brouillons, signalements`.

- [ ] **Step 1 : écrire le test pgTAP qui échoue.** `supabase/tests/chapitres_import.test.sql`, avec un admin, un élève et le cours de test de la Task 2 recréé dans le test. Il couvre :
  - **Non-admins.** Un élève reçoit `acces_refuse` sur `enregistrer_cours`, `enregistrer_chapitre`, `publier_chapitre`, `publier_cours` et `importer_cours`. `suivi_contenu()` lui renvoie 0 ligne.
  - **`enregistrer_chapitre`.**
    - Il crée un chapitre (slug `nouveau`, deux sections), puis le modifie par son id.
    - Il refuse avec `chapitre_invalide` :
      - des sections dont l'id est dupliqué ;
      - un id de section qui n'est pas en `[a-z0-9-]` ;
      - `sections` qui n'est pas un tableau ;
      - un slug invalide.
    - Il lève `chapitre_introuvable` si on change de cours (`p_cours` d'un autre cours avec l'id du chapitre).
    - Il lève `slug_deja_pris` si le slug est déjà utilisé dans le cours.
  - **`enregistrer_cours`.**
    - Il crée et modifie un cours.
    - Il refuse avec `cours_invalide` une couleur `#ABC` ou `rouge`, et un niveau inconnu.
    - Il lève `filiere_inconnue` si la filière n'existe pas.
  - **`publier_*`.** Ils modifient `publie`.
  - **`importer_cours`.** Le fichier contient un cours de test avec 2 chapitres et 3 questions, sous le rôle admin.
    - Le premier import renvoie `cree = 3`.
    - Un réimport identique renvoie `inchangee = 3`.
    - Un réimport sans `p_publier` sur un cours publié le laisse publié.
    - Un réimport sans la question `imp-3` renvoie `supprimee = 1`.
    - Le même réimport, quand `imp-2` a été tirée (tentative insérée en SQL) et a disparu du fichier, renvoie `archivee = 1`.
    - Une question créée dans l'éditeur (sans `source`) dans un chapitre importé survit au réimport.
    - Un chapitre absent du fichier apparaît dans `chapitres_absents` et n'est pas supprimé.
    - Un import dont une question est invalide lève `question_invalide`, et **rien n'est écrit** : on compte les chapitres avant et après, dans un sous-bloc `throws_ok`.
  - **`importer_cours` avec la clé de service.** Avec `request.jwt.claims` à `{"role":"service_role"}` et `set local role service_role`, l'import passe.
  - **`suivi_contenu()`.** Pour l'admin, il renvoie les comptes `valides`, `a_relire` et `brouillons` attendus pour le cours de test.

- [ ] **Step 2 : lancer et voir l'échec.**

- [ ] **Step 3 : écrire la migration.** `supabase/migrations/20261124000004_chapitres_import.sql` :

```sql
-- Étape 3b : écriture des cours et chapitres, import transactionnel, tableau de suivi.

create function prive.valider_chapitre(p jsonb) returns void
language plpgsql immutable set search_path = '' as $$
begin
  if jsonb_typeof(p) <> 'object'
     or coalesce(p->>'slug', '') !~ '^[a-z0-9-]{1,80}$'
     or coalesce(p->>'numero', '') !~ '^[1-9][0-9]?$'
     or char_length(btrim(coalesce(p->>'titre', ''))) not between 1 and 200
     or char_length(coalesce(p->>'titre_court', '')) > 80
     or char_length(coalesce(p->>'duree', '')) > 40
     or char_length(coalesce(p->>'resume', '')) > 1000
     or char_length(coalesce(p->>'chapeau', '')) > 4000
     or char_length(coalesce(p->>'a_retenir', '')) > 50000
     or jsonb_typeof(coalesce(p->'objectifs', '[]'::jsonb)) <> 'array'
     or exists (select 1 from jsonb_array_elements(coalesce(p->'objectifs', '[]'::jsonb)) o
                 where jsonb_typeof(o) <> 'string' or char_length(o #>> '{}') > 300)
     or jsonb_typeof(coalesce(p->'sections', 'null'::jsonb)) <> 'array'
     or jsonb_array_length(p->'sections') > 40
     or exists (select 1 from jsonb_array_elements(p->'sections') s
                 where jsonb_typeof(s) <> 'object'
                    or coalesce(s->>'id', '') !~ '^[a-z0-9-]{1,80}$'
                    or char_length(btrim(coalesce(s->>'titre', ''))) not between 1 and 200
                    or jsonb_typeof(s->'html') <> 'string'
                    or char_length(s->>'html') > 200000)
     or (select count(distinct s->>'id') from jsonb_array_elements(p->'sections') s) <> jsonb_array_length(p->'sections')
  then
    raise exception 'chapitre_invalide';
  end if;
end $$;

-- Crée (p_chapitre null : par slug dans le cours) ou modifie un chapitre. Un chapitre ne change jamais de cours.
-- Un réimport ne dépublie jamais : publie = ancien publie or p_publier.
create function prive.ecrire_chapitre(p_cours uuid, p_chapitre uuid, p jsonb, p_publier boolean) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_objectifs text[];
begin
  perform prive.valider_chapitre(p);
  select coalesce(array_agg(o), '{}') into v_objectifs from jsonb_array_elements_text(coalesce(p->'objectifs', '[]'::jsonb)) o;
  begin
    if p_chapitre is null then
      insert into public.chapitre as c (cours_id, slug, numero, titre, titre_court, duree, resume, chapeau, objectifs, sections, a_retenir, publie)
        values (p_cours, p->>'slug', (p->>'numero')::smallint, btrim(p->>'titre'), nullif(p->>'titre_court', ''),
                nullif(p->>'duree', ''), nullif(p->>'resume', ''), nullif(p->>'chapeau', ''), v_objectifs,
                p->'sections', nullif(p->>'a_retenir', ''), p_publier)
      on conflict (cours_id, slug) do update set
        numero = excluded.numero, titre = excluded.titre, titre_court = excluded.titre_court, duree = excluded.duree,
        resume = excluded.resume, chapeau = excluded.chapeau, objectifs = excluded.objectifs,
        sections = excluded.sections, a_retenir = excluded.a_retenir, publie = c.publie or p_publier
      returning c.id into v_id;
    else
      update public.chapitre c set
        slug = p->>'slug', numero = (p->>'numero')::smallint, titre = btrim(p->>'titre'),
        titre_court = nullif(p->>'titre_court', ''), duree = nullif(p->>'duree', ''), resume = nullif(p->>'resume', ''),
        chapeau = nullif(p->>'chapeau', ''), objectifs = v_objectifs, sections = p->'sections',
        a_retenir = nullif(p->>'a_retenir', '')
       where c.id = p_chapitre and c.cours_id = p_cours
       returning c.id into v_id;
      if v_id is null then
        raise exception 'chapitre_introuvable';
      end if;
    end if;
  exception when unique_violation then
    raise exception 'slug_deja_pris';
  end;
  return v_id;
end $$;

create function public.enregistrer_chapitre(p_cours uuid, p_chapitre uuid, p_donnees jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.exiger_admin();
  if not exists (select 1 from public.cours c where c.id = p_cours) then
    raise exception 'cours_introuvable';
  end if;
  return prive.ecrire_chapitre(p_cours, p_chapitre, p_donnees, false);
end $$;

create function public.publier_chapitre(p_chapitre uuid, p_publie boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.exiger_admin();
  update public.chapitre c set publie = coalesce(p_publie, false) where c.id = p_chapitre;
  if not found then
    raise exception 'chapitre_introuvable';
  end if;
end $$;

create function public.enregistrer_cours(p_cours uuid, p_donnees jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_filiere uuid;
  v_id uuid;
begin
  perform prive.exiger_admin();
  if coalesce(p_donnees->>'slug', '') !~ '^[a-z0-9-]{1,80}$'
     or coalesce(p_donnees->>'niveau', '') not in ('2de', '1re', 'Tle')
     or char_length(btrim(coalesce(p_donnees->>'titre', ''))) not between 1 and 200
     or char_length(btrim(coalesce(p_donnees->>'matiere', ''))) not between 1 and 120
     or lower(coalesce(p_donnees->>'couleur', '#2563eb')) !~ '^#[0-9a-f]{6}$'
     or coalesce(p_donnees->>'ordre', '0') !~ '^\d{1,4}$' then
    raise exception 'cours_invalide';
  end if;
  select f.id into v_filiere from public.filiere f where f.code = p_donnees->>'filiere';
  if v_filiere is null then
    raise exception 'filiere_inconnue';
  end if;
  begin
    if p_cours is null then
      insert into public.cours as c (slug, filiere_id, niveau_code, matiere, titre, couleur, ordre)
        values (p_donnees->>'slug', v_filiere, p_donnees->>'niveau', btrim(p_donnees->>'matiere'), btrim(p_donnees->>'titre'),
                lower(coalesce(p_donnees->>'couleur', '#2563eb')), coalesce((p_donnees->>'ordre')::smallint, 0))
        returning c.id into v_id;
    else
      update public.cours c set slug = p_donnees->>'slug', filiere_id = v_filiere, niveau_code = p_donnees->>'niveau',
        matiere = btrim(p_donnees->>'matiere'), titre = btrim(p_donnees->>'titre'),
        couleur = lower(coalesce(p_donnees->>'couleur', '#2563eb')), ordre = coalesce((p_donnees->>'ordre')::smallint, 0)
       where c.id = p_cours returning c.id into v_id;
      if v_id is null then
        raise exception 'cours_introuvable';
      end if;
    end if;
  exception when unique_violation then
    raise exception 'slug_deja_pris';
  end;
  return v_id;
end $$;

create function public.publier_cours(p_cours uuid, p_publie boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform prive.exiger_admin();
  update public.cours c set publie = coalesce(p_publie, false) where c.id = p_cours;
  if not found then
    raise exception 'cours_introuvable';
  end if;
end $$;

-- Import d'un cours complet (même format que contenu/1re-st2s/bph.json, HTML déjà nettoyé par l'appelant).
-- Une seule transaction : une erreur annule tout. Accepte l'admin (interface) ou la clé de service (script).
create function public.importer_cours(p_cours jsonb, p_publier boolean default false) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_cours uuid;
  v_filiere uuid;
  v_chapitre uuid;
  ch jsonb;
  q jsonb;
  r record;
  v_sources text[];
  v_slugs text[];
  v_bilan jsonb := '{"cree":0,"modifiee":0,"versionnee":0,"inchangee":0,"archivee":0,"supprimee":0}';
begin
  if not ((select auth.role()) = 'service_role' or public.role_actuel() = 'admin_contenu') then
    raise exception 'acces_refuse';
  end if;
  if jsonb_typeof(p_cours) <> 'object' or jsonb_typeof(p_cours->'chapitres') <> 'array'
     or jsonb_array_length(p_cours->'chapitres') = 0
     or coalesce(p_cours->>'slug', '') !~ '^[a-z0-9-]{1,80}$'
     or coalesce(p_cours->>'niveau', '') not in ('2de', '1re', 'Tle')
     or char_length(btrim(coalesce(p_cours->>'titre', ''))) not between 1 and 200
     or char_length(btrim(coalesce(p_cours->>'matiere', ''))) not between 1 and 120
     or lower(coalesce(p_cours->>'couleur', '#2563eb')) !~ '^#[0-9a-f]{6}$' then
    raise exception 'import_invalide';
  end if;
  select f.id into v_filiere from public.filiere f where f.code = p_cours->>'filiere';
  if v_filiere is null then
    raise exception 'filiere_inconnue';
  end if;
  insert into public.cours as c (slug, filiere_id, niveau_code, matiere, titre, couleur, publie)
    values (p_cours->>'slug', v_filiere, p_cours->>'niveau', btrim(p_cours->>'matiere'), btrim(p_cours->>'titre'),
            lower(coalesce(p_cours->>'couleur', '#2563eb')), coalesce(p_publier, false))
  on conflict (slug) do update set filiere_id = excluded.filiere_id, niveau_code = excluded.niveau_code,
    matiere = excluded.matiere, titre = excluded.titre, couleur = excluded.couleur, publie = c.publie or excluded.publie
  returning c.id into v_cours;

  for ch in select * from jsonb_array_elements(p_cours->'chapitres') loop
    v_chapitre := prive.ecrire_chapitre(v_cours, null, ch, coalesce(p_publier, false));
    if jsonb_typeof(ch->'questions') <> 'array' then
      raise exception 'import_invalide';
    end if;
    for q in select * from jsonb_array_elements(ch->'questions') loop
      if nullif(btrim(q->>'source'), '') is null then
        raise exception 'import_invalide';
      end if;
      select * into r from prive.ecrire_question(v_chapitre, null, q);
      v_bilan := jsonb_set(v_bilan, array[r.resultat], to_jsonb((v_bilan->>r.resultat)::int + 1));
    end loop;
    -- Questions venues d'un import précédent et retirées du fichier : archivées si déjà tirées, sinon supprimées.
    -- Les questions créées dans l'éditeur (source nulle) ne sont jamais touchées.
    select coalesce(array_agg(btrim(x->>'source')), '{}') into v_sources from jsonb_array_elements(ch->'questions') x;
    for r in select q2.id, exists (select 1 from public.tentative_question tq where tq.question_id = q2.id) as utilisee
               from public.question q2
              where q2.chapitre_id = v_chapitre and q2.source is not null and q2.statut <> 'archivee'
                and not (q2.source = any (v_sources)) loop
      if r.utilisee then
        update public.question q3 set statut = 'archivee', source = null where q3.id = r.id;
        v_bilan := jsonb_set(v_bilan, '{archivee}', to_jsonb((v_bilan->>'archivee')::int + 1));
      else
        delete from public.question q3 where q3.id = r.id;
        v_bilan := jsonb_set(v_bilan, '{supprimee}', to_jsonb((v_bilan->>'supprimee')::int + 1));
      end if;
    end loop;
  end loop;

  select coalesce(array_agg(x->>'slug'), '{}') into v_slugs from jsonb_array_elements(p_cours->'chapitres') x;
  return v_bilan || jsonb_build_object(
    'cours_id', v_cours,
    'chapitres', jsonb_array_length(p_cours->'chapitres'),
    'chapitres_absents', coalesce((select jsonb_agg(c.slug order by c.numero) from public.chapitre c
                                    where c.cours_id = v_cours and not (c.slug = any (v_slugs))), '[]'::jsonb));
end $$;

-- Tableau de suivi des banques de questions (objectif : 150 validées par chapitre). Zéro ligne pour un non-admin.
create function public.suivi_contenu()
returns table (cours_id uuid, cours_slug text, cours_titre text, cours_publie boolean, chapitre_id uuid, numero smallint,
               chapitre_titre text, chapitre_publie boolean, valides int, a_relire int, brouillons int, signalements int)
language sql stable security definer set search_path = '' as $$
  select c.id, c.slug, c.titre, c.publie, ch.id, ch.numero, ch.titre, ch.publie,
         count(q.id) filter (where q.statut = 'valide')::int,
         count(q.id) filter (where q.statut = 'a_relire')::int,
         count(q.id) filter (where q.statut = 'brouillon')::int,
         (select count(*)::int from public.signalement s join public.question q2 on q2.id = s.question_id
           where q2.chapitre_id = ch.id and s.statut = 'ouvert')
    from public.cours c
    left join public.chapitre ch on ch.cours_id = c.id
    left join public.question q on q.chapitre_id = ch.id
   where public.role_actuel() = 'admin_contenu'
   group by c.id, ch.id
   order by c.ordre, c.titre, ch.numero
$$;

revoke execute on function prive.valider_chapitre(jsonb), prive.ecrire_chapitre(uuid, uuid, jsonb, boolean) from public, anon, authenticated;
revoke execute on function public.enregistrer_chapitre(uuid, uuid, jsonb), public.publier_chapitre(uuid, boolean),
  public.enregistrer_cours(uuid, jsonb), public.publier_cours(uuid, boolean), public.importer_cours(jsonb, boolean),
  public.suivi_contenu() from public, anon;
grant execute on function public.enregistrer_chapitre(uuid, uuid, jsonb), public.publier_chapitre(uuid, boolean),
  public.enregistrer_cours(uuid, jsonb), public.publier_cours(uuid, boolean), public.importer_cours(jsonb, boolean),
  public.suivi_contenu() to authenticated;
grant execute on function public.importer_cours(jsonb, boolean) to service_role;
```

Points à vérifier pendant l'implémentation :
- `auth.role()` existe dans la version locale de Supabase et renvoie `'service_role'` avec la clé de service. Vérifier avec context7 (Supabase, « auth.role »). Sinon, lire `current_setting('request.jwt.claims', true)::jsonb->>'role'`.
- Le bloc `exception when unique_violation` de `ecrire_chapitre` ne doit pas masquer `chapitre_invalide` ni `chapitre_introuvable`, qui sont levés hors du sous-bloc ou relevés tels quels.
- `prive.ecrire_question` est appelé par `importer_cours` avec les droits du propriétaire. Pas besoin d'`exiger_admin` à l'intérieur.

- [ ] **Step 4 : lancer les tests** (`npm run db:reset && npm run test:db`). Expected : PASS.

- [ ] **Step 5 : types, puis commit.**

```bash
git add supabase src/lib/supabase/types.ts
git commit -m "Ajoute l'écriture des cours et chapitres, l'import transactionnel et le tableau de suivi"
```

---

### Task 4 : signalements (base)

**Files :**
- Create : `supabase/migrations/20261124000005_signalements.sql`, `supabase/tests/signalements.test.sql`

**Interfaces :**
- Produces :
  - `public.signaler_question(p_question uuid, p_commentaire text) returns uuid` ;
  - `public.mes_signalements()`, qui renvoie `id, question_id, enonce, chapitre_titre, cours_titre, commentaire, statut, reponse, cree_le, traite_le` ;
  - `public.signalements_admin(p_statut text default 'ouvert')`, qui renvoie `id, question_id, chapitre_id, chapitre_titre, cours_titre, enonce, statut_question, commentaire, statut, reponse, auteur_nom, auteur_email, cree_le, traite_le` ;
  - `public.traiter_signalement(p_signalement uuid, p_decision text, p_reponse text default null) returns void`.

- [ ] **Step 1 : écrire le test pgTAP qui échoue.** `supabase/tests/signalements.test.sql` couvre :
  - **Qui peut signaler.**
    - Un élève, un parent, un admin et une personne en attente de validation (`demande_enseignant = true`, rôle `eleve`) reçoivent `acces_refuse`.
    - Un enseignant peut signaler une question `valide` d'un cours publié.
  - **Effet du signalement.**
    - La question passe à `a_relire`.
    - `mes_signalements()` la montre avec `statut = 'ouvert'`.
    - Un second signalement de la même question par le même enseignant lève `deja_signalee`.
    - Un second enseignant peut signaler la même question.
  - **Questions refusées** (`question_introuvable`) :
    - une question `brouillon` ;
    - une question d'un chapitre ou d'un cours non publié ;
    - un uuid inconnu.
  - **Commentaire.** Moins de 5 caractères après `btrim` lève `commentaire_invalide`, plus de 1000 aussi.
  - **Limite.** Après 20 signalements dans les 24 dernières heures (insérés en SQL avec `cree_le = now()`), le suivant lève `trop_de_signalements`.
  - **Lectures.**
    - `mes_signalements()` ne renvoie jamais ceux d'un autre enseignant.
    - `signalements_admin()` renvoie 0 ligne à un non-admin.
  - **Traitement par l'admin.**
    - `traiter_signalement(…, 'rejete', 'La réponse est juste.')` sur le dernier signalement ouvert remet la question à `valide`.
    - Avec deux signalements ouverts, rejeter le premier laisse la question `a_relire`.
    - `'traite'` ne change pas le statut de la question.
    - Une décision inconnue lève `decision_invalide`.
    - Un signalement déjà traité lève `signalement_introuvable`.
    - Une réponse de plus de 1000 caractères lève `reponse_invalide`.
  - **Non-admin.** Il reçoit `acces_refuse` sur `traiter_signalement`.
  - **Confidentialité.** `mes_signalements()` ne renvoie ni les propositions ni les bonnes réponses : vérifier les noms de colonnes avec `results_eq` sur `pg_get_function_result`.

- [ ] **Step 2 : lancer et voir l'échec.**

- [ ] **Step 3 : écrire la migration.** `supabase/migrations/20261124000005_signalements.sql` :

```sql
-- Étape 3b : un enseignant signale une question ; elle sort des tirages et part en relecture.

create function public.signaler_question(p_question uuid, p_commentaire text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if public.role_actuel() is distinct from 'enseignant' then
    raise exception 'acces_refuse';
  end if;
  if char_length(btrim(coalesce(p_commentaire, ''))) not between 5 and 1000 then
    raise exception 'commentaire_invalide';
  end if;
  -- Verrou par auteur : le comptage et l'insertion se font sans course entre deux appels simultanés.
  perform pg_advisory_xact_lock(hashtextextended('signalement:' || auth.uid()::text, 0));
  if (select count(*) from public.signalement s
       where s.auteur_id = auth.uid() and s.cree_le > now() - interval '24 hours') >= 20 then
    raise exception 'trop_de_signalements';
  end if;
  -- Une question déjà passée en relecture par un autre signalement peut encore être signalée par un autre enseignant.
  if not exists (select 1 from public.question q
                   join public.chapitre c on c.id = q.chapitre_id and c.publie
                   join public.cours co on co.id = c.cours_id and co.publie
                  where q.id = p_question
                    and (q.statut = 'valide'
                         or (q.statut = 'a_relire'
                             and exists (select 1 from public.signalement s2 where s2.question_id = q.id and s2.statut = 'ouvert')))) then
    raise exception 'question_introuvable';
  end if;
  begin
    insert into public.signalement (question_id, auteur_id, commentaire)
      values (p_question, auth.uid(), btrim(p_commentaire))
      returning id into v_id;
  exception when unique_violation then
    raise exception 'deja_signalee';
  end;
  update public.question q set statut = 'a_relire' where q.id = p_question and q.statut = 'valide';
  return v_id;
end $$;
```

```sql
create function public.mes_signalements()
returns table (id uuid, question_id uuid, enonce text, chapitre_titre text, cours_titre text, commentaire text,
               statut text, reponse text, cree_le timestamptz, traite_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select s.id, s.question_id, q.enonce, c.titre, co.titre, s.commentaire, s.statut, s.reponse, s.cree_le, s.traite_le
    from public.signalement s
    join public.question q on q.id = s.question_id
    join public.chapitre c on c.id = q.chapitre_id
    join public.cours co on co.id = c.cours_id
   where s.auteur_id = auth.uid()
   order by s.cree_le desc
   limit 200
$$;

create function public.signalements_admin(p_statut text default 'ouvert')
returns table (id uuid, question_id uuid, chapitre_id uuid, chapitre_titre text, cours_titre text, enonce text,
               statut_question public.statut_question_t, commentaire text, statut text, reponse text,
               auteur_nom text, auteur_email text, cree_le timestamptz, traite_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select s.id, s.question_id, c.id, c.titre, co.titre, q.enonce, q.statut, s.commentaire, s.statut, s.reponse,
         p.nom, p.email, s.cree_le, s.traite_le
    from public.signalement s
    join public.question q on q.id = s.question_id
    join public.chapitre c on c.id = q.chapitre_id
    join public.cours co on co.id = c.cours_id
    left join public.profil p on p.id = s.auteur_id
   where public.role_actuel() = 'admin_contenu' and (p_statut is null or s.statut = p_statut)
   order by s.cree_le
   limit 500
$$;

-- Rejeter le dernier signalement ouvert d'une question encore « a_relire » la remet en « valide ».
create function public.traiter_signalement(p_signalement uuid, p_decision text, p_reponse text default null) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_question uuid;
begin
  perform prive.exiger_admin();
  if p_decision is null or p_decision not in ('traite', 'rejete') then
    raise exception 'decision_invalide';
  end if;
  if char_length(coalesce(p_reponse, '')) > 1000 then
    raise exception 'reponse_invalide';
  end if;
  update public.signalement s
     set statut = p_decision, reponse = nullif(btrim(p_reponse), ''), traite_le = now(), traite_par = auth.uid()
   where s.id = p_signalement and s.statut = 'ouvert'
   returning s.question_id into v_question;
  if v_question is null then
    raise exception 'signalement_introuvable';
  end if;
  if p_decision = 'rejete'
     and not exists (select 1 from public.signalement s where s.question_id = v_question and s.statut = 'ouvert') then
    update public.question q set statut = 'valide' where q.id = v_question and q.statut = 'a_relire';
  end if;
end $$;

revoke execute on function public.signaler_question(uuid, text), public.mes_signalements(),
  public.signalements_admin(text), public.traiter_signalement(uuid, text, text) from public, anon;
grant execute on function public.signaler_question(uuid, text), public.mes_signalements(),
  public.signalements_admin(text), public.traiter_signalement(uuid, text, text) to authenticated;
```

- [ ] **Step 4 : lancer les tests.** Expected : PASS.
- [ ] **Step 5 : types, puis commit.** Message : « Ajoute le signalement des questions par les enseignants ».

---

### Task 5 : bucket des schémas

**Files :**
- Create : `supabase/migrations/20261124000006_schemas_storage.sql`, `supabase/tests/schemas_storage.test.sql`

- [ ] **Step 1 : écrire le test pgTAP qui échoue.** `supabase/tests/schemas_storage.test.sql` :

```sql
begin;
select plan(6);
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000d1', 'admin-st@test.local'),
  ('00000000-0000-0000-0000-0000000000d2', 'eleve-st@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000d1';

select is((select public from storage.buckets where id = 'schemas'), true, 'bucket schemas public');
select is((select file_size_limit from storage.buckets where id = 'schemas'), 2097152::bigint, 'limite de 2 Mo');
select is((select allowed_mime_types from storage.buckets where id = 'schemas'),
  array['image/png', 'image/jpeg', 'image/webp'], 'types d''image autorisés');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);
select lives_ok($$ insert into storage.objects (bucket_id, name, owner) values ('schemas', 'test/a.png', auth.uid()) $$,
  'admin : dépôt autorisé');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d2","role":"authenticated"}', true);
select throws_ok($$ insert into storage.objects (bucket_id, name, owner) values ('schemas', 'test/b.png', auth.uid()) $$,
  '42501', null, 'élève : dépôt refusé');
select is((select count(*)::int from storage.objects where bucket_id = 'schemas' and name = 'test/a.png'), 0,
  'élève : pas de lecture par l''API (le public lit par l''URL publique)');
select * from finish();
rollback;
```

Si l'insertion directe dans `storage.objects` est impossible localement (colonnes obligatoires, triggers), adapter l'insertion à la version installée, après lecture du schéma `storage` avec `\d storage.objects`. Garder les mêmes assertions.

- [ ] **Step 2 : écrire la migration.**

```sql
-- Étape 3b : schémas importés par l'admin (PNG, JPEG, WebP ; les SVG restent en ligne dans le HTML, où ils sont nettoyés).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('schemas', 'schemas', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "schemas : lecture admin" on storage.objects for select to authenticated
  using (bucket_id = 'schemas' and (select public.role_actuel()) = 'admin_contenu');
create policy "schemas : ajout admin" on storage.objects for insert to authenticated
  with check (bucket_id = 'schemas' and (select public.role_actuel()) = 'admin_contenu');
create policy "schemas : modification admin" on storage.objects for update to authenticated
  using (bucket_id = 'schemas' and (select public.role_actuel()) = 'admin_contenu');
create policy "schemas : suppression admin" on storage.objects for delete to authenticated
  using (bucket_id = 'schemas' and (select public.role_actuel()) = 'admin_contenu');
```

- [ ] **Step 3 : vérifier** (`npm run db:reset && npm run test:db`), **puis commit.** Message : « Ajoute le stockage des schémas réservé à l'admin ».

---

### Task 6 : nettoyage HTML par liste blanche

**Files :**
- Create : `src/lib/contenu/html.ts`, `src/lib/contenu/html.test.ts`
- Modify : `src/components/ContenuChapitre.tsx`, `package.json` (`sanitize-html`, `@types/sanitize-html`)

**Interfaces :**
- Produces : `nettoyerHtml(html: string): string` (pur, côté serveur).

- [ ] **Step 1 : installer.** `npm install sanitize-html && npm install -D @types/sanitize-html`. Lire sa documentation avec context7, en particulier :
  - `allowedTags` et `allowedAttributes` ;
  - `allowedSchemes` et `allowedSchemesByTag` ;
  - `allowedStyles` ;
  - `transformTags` et `exclusiveFilter` ;
  - les options du parseur `lowerCaseTags` et `lowerCaseAttributeNames`, indispensables pour garder `viewBox` et `linearGradient`.

- [ ] **Step 2 : écrire les tests qui échouent.** `src/lib/contenu/html.test.ts` :

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { nettoyerHtml } from './html';

const bph = JSON.parse(readFileSync('contenu/1re-st2s/bph.json', 'utf8')) as {
  chapitres: { sections: { html: string }[]; a_retenir?: string }[];
};
const morceaux = bph.chapitres.flatMap((c) => [...c.sections.map((s) => s.html), c.a_retenir ?? '']);

/** Inventaire « balise@attribut » d'un fragment, pour vérifier que rien d'utile n'est retiré. */
function inventaire(html: string): string[] {
  const sortie: string[] = [];
  for (const m of html.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g)) {
    sortie.push(m[1]);
    for (const a of m[2].matchAll(/([a-zA-Z:-]+)=/g)) sortie.push(`${m[1]}@${a[1]}`);
  }
  return sortie.sort();
}

describe('nettoyerHtml', () => {
  it('garde intact tout le contenu BPH (balises et attributs)', () => {
    for (const html of morceaux) expect(inventaire(nettoyerHtml(html))).toEqual(inventaire(html));
  });
  it('garde viewBox et linearGradient avec leur casse', () => {
    const svg = '<svg viewBox="0 0 10 10" role="img" aria-label="x"><defs><linearGradient id="g"><stop offset="0" /></linearGradient></defs></svg>';
    expect(nettoyerHtml(svg)).toContain('viewBox="0 0 10 10"');
    expect(nettoyerHtml(svg)).toContain('<linearGradient');
  });
  it.each([
    ['<script>alert(1)</script><p>ok</p>', '<p>ok</p>'],
    ['<img src="x" onerror="alert(1)">', ''],
    ['<a href="javascript:alert(1)">x</a>', '<a>x</a>'],
    ['<svg><script>alert(1)</script></svg>', '<svg></svg>'],
    ['<svg><foreignObject><p>x</p></foreignObject></svg>', '<svg></svg>'],
    ['<iframe src="https://exemple.fr"></iframe>', ''],
    ['<style>body{display:none}</style>', ''],
    ['<p style="background:url(https://x.fr/a.png)">x</p>', '<p>x</p>'],
    ['<line marker-end="url(https://x.fr/m.svg#a)" />', '<line />'],
    ['<svg><use href="https://x.fr/s.svg#a" /></svg>', '<svg></svg>'],
    ['<form action="https://x.fr"><input name="a"></form>', '<input />'],
  ])('retire ce qui est dangereux : %s', (entree, attendu) => {
    expect(nettoyerHtml(entree).replace(/\s+/g, ' ').trim()).toBe(attendu);
  });
  it('garde marker-end="url(#id)"', () => {
    expect(nettoyerHtml('<line marker-end="url(#fleche)" />')).toContain('marker-end="url(#fleche)"');
  });
  it('ajoute rel="noopener noreferrer" aux liens https', () => {
    expect(nettoyerHtml('<a href="https://eduscol.education.fr" target="_blank">x</a>'))
      .toBe('<a href="https://eduscol.education.fr" target="_blank" rel="noopener noreferrer">x</a>');
  });
  it('accepte une image du bucket schemas et refuse les autres', () => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';
    const bonne = `${base}/storage/v1/object/public/schemas/bph/a.png`;
    expect(nettoyerHtml(`<img src="${bonne}" alt="Coeur">`)).toContain(`src="${bonne}"`);
    expect(nettoyerHtml('<img src="https://ailleurs.fr/a.png" alt="x">')).toBe('');
  });
});
```

Les sorties exactes de la table `it.each` dépendent de la façon dont `sanitize-html` écrit les balises vides (`<line />` ou `<line></line>`). Ajuster **les valeurs attendues** à son écriture réelle, mais jamais au point de laisser passer un élément dangereux. Le premier test (inventaire BPH) est le garde-fou : la liste blanche se règle jusqu'à ce qu'il passe sans perte.

- [ ] **Step 3 : lancer et voir l'échec** (`npx vitest run src/lib/contenu/html.test.ts`).

- [ ] **Step 4 : implémenter `src/lib/contenu/html.ts`.** Structure imposée :

```ts
import sanitizeHtml from 'sanitize-html';

// Liste blanche établie d'après l'inventaire du contenu BPH (voir html.test.ts). SVG en ligne compris.
const BALISES_HTML = ['p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 'sub', 'sup', 'small', 'span', 'div',
  'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'table', 'caption', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'figure', 'figcaption', 'img', 'a', 'label', 'input', 'output'];
const BALISES_SVG = ['svg', 'g', 'defs', 'marker', 'pattern', 'linearGradient', 'radialGradient', 'stop',
  'line', 'polyline', 'polygon', 'path', 'rect', 'circle', 'ellipse', 'text', 'tspan', 'title', 'desc'];
const ATTRIBUTS_SVG = ['x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'dx', 'dy', 'width', 'height',
  'd', 'points', 'viewBox', 'preserveAspectRatio', 'transform', 'fill', 'stroke', 'stroke-width', 'stroke-dasharray',
  'stroke-linecap', 'stroke-linejoin', 'opacity', 'fill-opacity', 'text-anchor', 'dominant-baseline', 'font-size',
  'font-weight', 'marker-start', 'marker-mid', 'marker-end', 'markerWidth', 'markerHeight', 'refX', 'refY', 'orient',
  'markerUnits', 'patternUnits', 'gradientUnits', 'offset', 'stop-color', 'stop-opacity'];
const COMMUNS = ['class', 'id', 'style', 'role', 'aria-label', 'aria-hidden', 'aria-describedby', 'title'];
/** Valeur de style sûre : pas d'url(), pas d'expression. */
const STYLE_SUR = /^(?!.*(url|expression)\s*\()[#\w\s.,%()+-]+$/i;
const PROPRIETES_STYLE = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'opacity', 'font-size', 'font-weight',
  'font-style', 'text-anchor', 'text-align', 'vertical-align', 'color', 'background', 'background-color', 'width',
  'max-width', 'height', 'margin', 'padding', 'border', 'display'];
/** Une référence SVG interne uniquement : url(#identifiant). */
const URL_INTERNE = /^url\(#[\w-]+\)$/;

function origineSchemas(): string {
  return `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')}/storage/v1/object/public/schemas/`;
}

export function nettoyerHtml(html: string): string {
  // … sanitizeHtml(html, { allowedTags, allowedAttributes, allowedSchemes: ['https', 'mailto'],
  //   allowedSchemesByTag: { img: ['https', 'http'] }, allowProtocolRelative: false,
  //   allowedStyles: { '*': Object.fromEntries(PROPRIETES_STYLE.map((p) => [p, [STYLE_SUR]])) },
  //   parser: { lowerCaseTags: false, lowerCaseAttributeNames: false },
  //   transformTags: { a: lien sûr avec rel, '*': retire tout attribut contenant « url( » qui ne vérifie pas URL_INTERNE },
  //   exclusiveFilter: retire <img> dont src ne commence pas par origineSchemas() }) …
}
```

Le commentaire `// …` décrit l'appel attendu. L'implémentation l'écrit en entier, en suivant la documentation de context7 pour la signature exacte de chaque option.

`input` ne garde que `type` (valeurs `number`, `range` ou `text`), `id`, `min`, `max`, `step`, `value`, `inputmode` et `aria-*`. `label` garde `for`, `a` garde `href`, `target` (valeur `_blank`) et `rel`, et `img` garde `src`, `alt`, `width`, `height` et `loading`.

- [ ] **Step 5 : brancher l'affichage.** Dans `src/components/ContenuChapitre.tsx`, `s.html` et `aRetenir` passent par `nettoyerHtml` juste avant `dangerouslySetInnerHTML`. Le composant reste un composant serveur : vérifier qu'aucun `'use client'` n'est en tête, et que ses importateurs sont des composants serveur.

- [ ] **Step 6 : vérifier.** Run : `npm test && npm run typecheck && npm run lint && npm run build && npm run e2e`. Expected : PASS. Les parcours de lecture de l'étape 1 affichent toujours les schémas SVG des chapitres BPH.

- [ ] **Step 7 : commit.** Message : « Nettoie le HTML des chapitres par liste blanche ».

---

### Task 7 : couche TypeScript et script d'import

**Files :**
- Create :
  - `src/lib/contenu/donnees-question.ts` (+ test) ;
  - `src/lib/contenu/couleur.ts` (+ test) ;
  - `src/lib/admin/garde.ts` ;
  - `src/lib/admin/requetes.ts`.
- Modify :
  - `src/lib/contenu/format-import.ts` (+ test) ;
  - `scripts/importer-contenu.ts` ;
  - `src/lib/erreurs.ts` (+ test) ;
  - `package.json` (scripts).

**Interfaces :**
- Produces :
  - `versDonneesQuestion(q: QuestionImport): DonneesQuestion`, qui produit le JSON de la Task 2 ;
  - `versDonneesCours(c: CoursImport): unknown`, qui nettoie le HTML par `nettoyerHtml` et convertit les questions ;
  - `contraste(a: string, b: string): number` et `couleurCoursAcceptable(hex: string): boolean` (contraste d'au moins 3 avec `#ffffff`) ;
  - `exigerAdmin(): Promise<Profil>` (lève `notFound()` sinon) ;
  - `lireSuiviContenu()`, `lireCoursAdmin(id)`, `lireChapitreAdmin(id)`, `lireQuestionsChapitre(chapitreId)`, `lireNotionsChapitre(chapitreId)`, `lireSignalementsAdmin(statut)` et `lireMesSignalements()`.

- [ ] **Step 1 : renforcer le format d'import, en TDD.** Dans `format-import.ts` :
  - **ids de section** : uniques dans un chapitre, au format `^[a-z0-9-]+$` (`refine` sur `schemaChapitreImport`) ;
  - **`sources`** : uniques dans tout le fichier (`refine` sur `schemaCoursImport`) ;
  - **propositions** : de 2 à 10, chacune de 500 caractères au plus ;
  - **énoncé** : 2000 caractères au plus ;
  - **`couleur`** : convertie en minuscules, et refusée si `couleurCoursAcceptable` échoue, avec le message « Couleur trop claire : contraste insuffisant avec le fond blanc. ».

  Ajouter les tests correspondants dans `format-import.test.ts`, dont un « contenu/1re-st2s/bph.json est valide ».

- [ ] **Step 2 : `donnees-question.ts` (TDD).** Il reprend la fonction `corrige` du script actuel :

```ts
import type { CoursImport, QuestionImport } from './format-import';
import { nettoyerHtml } from './html';

export type DonneesQuestion = {
  source?: string; type: QuestionImport['type']; enonce: string; propositions: string[]; bonnes_reponses: (number | boolean)[];
  reponses_acceptees: string[]; marge: number | null; marge_relative: boolean; notion: string | null;
  difficulte: number; statut: 'brouillon' | 'a_relire' | 'valide'; explication: string;
};

export function versDonneesQuestion(q: QuestionImport): DonneesQuestion {
  const commun = { source: q.source, type: q.type, enonce: q.enonce, notion: q.notion ?? null, difficulte: q.difficulte,
    statut: q.statut, explication: q.explication };
  switch (q.type) {
    case 'qcm_unique':
    case 'qcm_multiple':
      return { ...commun, propositions: q.propositions, bonnes_reponses: q.bonnes_reponses, reponses_acceptees: [], marge: null, marge_relative: false };
    case 'vrai_faux':
      return { ...commun, propositions: [], bonnes_reponses: [q.bonne_reponse], reponses_acceptees: [], marge: null, marge_relative: false };
    case 'reponse_courte':
      return { ...commun, propositions: [], bonnes_reponses: [], reponses_acceptees: q.reponses_acceptees, marge: q.marge ?? null, marge_relative: q.marge_relative };
  }
}

export function versDonneesCours(c: CoursImport) {
  return {
    slug: c.slug, filiere: c.filiere, niveau: c.niveau, matiere: c.matiere, titre: c.titre, couleur: c.couleur.toLowerCase(),
    chapitres: c.chapitres.map((ch) => ({
      slug: ch.slug, numero: ch.numero, titre: ch.titre, titre_court: ch.titre_court ?? '', duree: ch.duree ?? '',
      resume: ch.resume ?? '', chapeau: ch.chapeau ?? '', objectifs: ch.objectifs,
      sections: ch.sections.map((s) => ({ id: s.id, titre: s.titre, html: nettoyerHtml(s.html) })),
      a_retenir: ch.a_retenir ? nettoyerHtml(ch.a_retenir) : '',
      questions: ch.questions.map(versDonneesQuestion),
    })),
  };
}
```

Tests : un cas par type de question, plus un cas qui vérifie que `versDonneesCours` retire un `<script>` d'une section.

- [ ] **Step 3 : réécrire `scripts/importer-contenu.ts`.**
  - Il vérifie la présence de `NEXT_PUBLIC_SUPABASE_URL` et de `SUPABASE_SERVICE_ROLE_KEY`, avec un message clair en français.
  - Il garde la garde « base locale » si le script en a une, sinon il en ajoute une sur le modèle de `e2e/aide-db.ts`. Une option explicite `--distant` sert pour la production, qui sera documentée à l'étape 4.
  - Il lit et valide le fichier avec `schemaCoursImport`. En cas d'échec, il affiche chaque erreur zod avec son chemin.
  - Il appelle `db.rpc('importer_cours', { p_cours: versDonneesCours(cours), p_publier: publier })`.
  - Il affiche le bilan : `cree`, `modifiee`, `versionnee`, `inchangee`, `archivee`, `supprimee` et `chapitres_absents`.

  Le script ne fait plus aucune écriture directe dans les tables.

- [ ] **Step 4 : `couleur.ts` (TDD).**
  - Il calcule la luminance relative WCAG 2.1 et le contraste.
  - Tests : `contraste('#000000', '#ffffff') ≈ 21` et `contraste('#2563eb', '#ffffff') ≥ 3` ; `couleurCoursAcceptable('#ffff00')` vaut `false`.
  - Vérifier que les couleurs des cours importés (BPH) passent.

- [ ] **Step 5 : `garde.ts` et `requetes.ts`.**
  - `exigerAdmin` suit le modèle de `src/lib/enseignant/garde.ts`.
  - Les lectures passent par les RPC des Tasks 2 à 4.
  - Les cours et chapitres se lisent par `select` sur les tables : l'admin les lit déjà par RLS.
  - Chaque lecture lève une `Error` en français si la requête échoue, sur le modèle de `src/lib/enseignant/requetes.ts`.

- [ ] **Step 6 : messages d'erreur.** Dans `src/lib/erreurs.ts`, ajouter avec un test du texte exact :

| Code | Message |
|---|---|
| `question_invalide` | « Cette question est incomplète ou mal formée. » |
| `question_introuvable` | « Cette question n'existe plus. » |
| `question_archivee` | « Cette question a été remplacée par une nouvelle version. » |
| `question_autre_chapitre` | « Cette source est déjà utilisée dans un autre chapitre. » |
| `question_utilisee` | « Cette question a déjà servi dans des quiz : elle ne peut pas être supprimée. Repasse-la en brouillon. » |
| `transition_invalide` | « Ce changement de statut n'est pas possible : une question passe par « à relire » avant d'être validée. » |
| `chapitre_invalide` | « Ce chapitre est incomplet ou mal formé (vérifie le slug et les identifiants de section). » |
| `chapitre_introuvable` | « Ce chapitre n'existe plus. » |
| `cours_invalide` | « Ce cours est incomplet ou mal formé. » |
| `cours_introuvable` | « Ce cours n'existe plus. » |
| `slug_deja_pris` | « Cet identifiant d'URL est déjà utilisé. » |
| `filiere_inconnue` | « Filière inconnue. » |
| `import_invalide` | « Le fichier d'import est incomplet ou mal formé. » |
| `commentaire_invalide` | « Ton commentaire doit faire entre 5 et 1000 caractères. » |
| `deja_signalee` | « Tu as déjà signalé cette question. » |
| `trop_de_signalements` | « Tu as atteint la limite de 20 signalements par jour. » |
| `signalement_introuvable` | « Ce signalement a déjà été traité. » |
| `reponse_invalide` | « La réponse ne doit pas dépasser 1000 caractères. » |

  Vérifier `decision_invalide`, qui existe depuis l'étape 3a, et ne pas le dupliquer.

- [ ] **Step 7 : vérifier.** `db:reset` utilise maintenant le nouveau script, qui doit afficher `cree: 140`, ou le nombre réel de questions BPH. Run : `npm run db:reset && npm test && npm run test:db && npm run typecheck && npm run lint && npm run build && npm run e2e`. Expected : PASS.

  Réimporter une seconde fois avec `npm run import:contenu -- contenu/1re-st2s/bph.json --publier` : le bilan affiche `inchangee: 140`.

- [ ] **Step 8 : commit.** Message : « Fait passer l'import par la RPC transactionnelle et ajoute les lectures admin ».

---

### Task 8 : espace admin — tableau de suivi et éditeur de cours

**Files :**
- Create :
  - `src/app/(app)/admin/page.tsx` ;
  - `src/app/(app)/admin/actions.ts` ;
  - `src/app/(app)/admin/cours/nouveau/page.tsx` ;
  - `src/app/(app)/admin/cours/[id]/page.tsx` ;
  - `src/components/admin/FormulaireCours.tsx` ;
  - `src/components/admin/BoutonPublier.tsx` ;
  - `src/styles/admin.css`.
- Modify :
  - `src/components/EnTete.tsx`, pour la navigation `admin_contenu` : Contenu (`/admin`), Import (`/admin/import`), Signalements (`/admin/signalements`), Demandes (`/admin/enseignants`) ;
  - la feuille de styles globale, pour importer `admin.css` comme les autres.

Charger **frontend-design**, **ui-ux-pro-max** et **dataviz** pour les barres de progression.

- [ ] **Step 1 : tableau de suivi `/admin`.**
  - `exigerAdmin()`, puis `lireSuiviContenu()`. Un bloc par cours.
  - **En-tête de chaque bloc** : titre et pastille de couleur, statut « Publié » ou « Brouillon », boutons « Modifier le cours » et « Publier » ou « Dépublier ».
  - **Tableau** (`th scope`), avec une ligne par chapitre :
    - « Ch. n — titre » ;
    - « Validées » : `n / 150` avec une barre. Si `n < 30`, la ligne porte la mention « Banque insuffisante » (icône + texte, jamais la couleur seule) ;
    - « À relire », « Brouillons » et « Signalements » (lien vers `/admin/signalements` si plus de 0) ;
    - « Publié » (oui/non + bouton) ;
    - liens « Modifier » (`/admin/chapitres/[id]`) et « Questions » (`/admin/chapitres/[id]/questions`).
  - **Bas de page** : « Nouveau cours » (`/admin/cours/nouveau`). Dans chaque bloc : « Nouveau chapitre » (`/admin/cours/[id]/chapitres/nouveau`, page créée en Task 9).
  - Sans aucun cours, le tableau est remplacé par : « Aucun cours pour l'instant. Importe un fichier ou crée un cours. »

- [ ] **Step 2 : actions serveur** (`actions.ts`). Chaque action valide ses entrées avec zod, appelle la RPC et renvoie `{ erreur?: string }` passé par `messageErreur`, comme dans `src/app/(app)/admin/enseignants/actions.ts`. Elle fait ensuite `revalidatePath('/admin')`.
  - `publierCours(_, form)` et `publierChapitre(_, form)`.
  - `enregistrerCours(_, form)`. En cas d'erreur, elle renvoie aussi les valeurs saisies, pour que le formulaire les garde (même modèle qu'à l'étape 3a). En cas de réussite, elle redirige vers `/admin?enregistre=cours`.

- [ ] **Step 3 : formulaire de cours.** Les champs, tous avec `label` :
  - slug ;
  - filière (`select` alimenté par la table `filiere`) ;
  - niveau ;
  - matière ;
  - titre ;
  - couleur (`input type=color` + champ texte hexadécimal + aperçu de la carte du cours) ;
  - ordre.

  Les erreurs sont reliées à leur champ par `aria-describedby`. La couleur est vérifiée côté serveur avec `couleurCoursAcceptable`.

- [ ] **Step 4 : vérifier.** Run : `npm test && npm run typecheck && npm run lint && npm run build`.

  Vérification visuelle, avec un script jetable sur le modèle des étapes précédentes, placé dans `.superpowers/` : se connecter en admin (compte `@test.local` passé admin par la clé de service), capturer `/admin` à 375 et à 1280 px, en clair et en sombre. Aucun débordement horizontal ; le tableau défile dans sa propre région focusable.

- [ ] **Step 5 : commit.** Message : « Ajoute le tableau de suivi du contenu et l'éditeur de cours ».

---

### Task 9 : éditeur de chapitre

**Files :**
- Create :
  - `src/app/(app)/admin/chapitres/[id]/page.tsx` ;
  - `src/app/(app)/admin/cours/[id]/chapitres/nouveau/page.tsx` ;
  - `src/app/(app)/admin/chapitres/actions.ts` ;
  - `src/components/admin/EditeurChapitre.tsx` (client) ;
  - `src/components/admin/EditeurSection.tsx` (client) ;
  - `src/components/admin/DepotSchema.tsx` (client).

Charger **frontend-design**.

- [ ] **Step 1 : formulaire.**
  - **Métadonnées** : slug, numéro, titre, titre court, durée, résumé et chapeau ; objectifs, un par ligne dans une zone de texte.
  - **Liste des sections.** Chaque section a un identifiant, un titre et une zone de texte HTML, avec `font-family: monospace` et au moins 16 lignes. Les boutons sont « Monter », « Descendre », « Supprimer » (avec `confirm`) et « Ajouter une section ».
  - **Zone « Je retiens »** (`a_retenir`).
  - **Barre d'insertion au-dessus de chaque zone HTML.** Les modèles s'insèrent à la position du curseur :
    - Encadré : `<div class="encadre">…</div>` ;
    - Figure : `<figure class="schema"><svg viewBox="0 0 400 200" role="img" aria-label="…"></svg><figcaption>…</figcaption></figure>` ;
    - Tableau : `<table><thead><tr><th>…</th></tr></thead><tbody><tr><td>…</td></tr></tbody></table>` ;
    - Image, par `DepotSchema`.

    Vérifier les classes réellement utilisées par le CSS des chapitres (`.contenu-chapitre …`) et prendre celles-là.
  - **Bouton « Aperçu ».** Une action serveur `apercuChapitre` renvoie le HTML passé par `nettoyerHtml`. Il est affiché dans un panneau qui réutilise `ContenuChapitre`, ou son rendu HTML, avec les mêmes styles que la page élève. Un message signale si le nettoyage a retiré quelque chose : on compare la longueur de l'inventaire avant et après.
  - **Bouton « Enregistrer ».** L'action `enregistrerChapitre` :
    - valide avec un schéma zod dérivé de `schemaChapitreImport`, sans `questions` ;
    - nettoie tout le HTML ;
    - appelle `enregistrer_chapitre` ;
    - garde la saisie en cas d'erreur, et redirige vers `/admin/chapitres/[id]?enregistre=1` en cas de réussite.
  - Le statut de publication se change sur la même page, avec `BoutonPublier`.

- [ ] **Step 2 : dépôt d'image (`DepotSchema`).**
  - `input type=file accept="image/png,image/jpeg,image/webp"`. Le fichier doit faire 2 Mo au plus, ce qui est vérifié côté client avant l'envoi. Le texte alternatif est obligatoire (champ `alt`).
  - L'envoi passe par `supabase.storage.from('schemas').upload(`${coursSlug}/${crypto.randomUUID()}.${ext}`, fichier)` avec le client navigateur, qui porte la session admin. La politique de stockage refuse tout autre rôle.
  - En cas de réussite, le composant insère `<figure class="schema"><img src="{URL publique}" alt="{alt}" loading="lazy"><figcaption>{alt}</figcaption></figure>`.
  - Les erreurs sont affichées en français : trop lourd, type refusé, échec de l'envoi.

- [ ] **Step 3 : page de création.** `/admin/cours/[id]/chapitres/nouveau` propose le même éditeur, vide, avec le numéro suivant proposé par défaut. Une fois enregistré, il redirige vers `/admin/chapitres/[id]`.

- [ ] **Step 4 : vérifier.** `npm test`, typecheck, lint et build. Vérification visuelle : éditer une section BPH, prévisualiser, enregistrer, puis rouvrir la page élève du chapitre. Le schéma SVG est intact et le texte est modifié. Captures à 375 et 1280 px.

- [ ] **Step 5 : commit.** Message : « Ajoute l'éditeur de chapitre avec aperçu et dépôt de schémas ».

---

### Task 10 : éditeur de questions

**Files :**
- Create :
  - `src/app/(app)/admin/chapitres/[id]/questions/page.tsx` ;
  - `src/app/(app)/admin/chapitres/[id]/questions/nouvelle/page.tsx` ;
  - `src/app/(app)/admin/questions/[id]/page.tsx` ;
  - `src/app/(app)/admin/questions/actions.ts` ;
  - `src/components/admin/FormulaireQuestion.tsx` (client) ;
  - `src/components/admin/ListeQuestionsAdmin.tsx`.

- [ ] **Step 1 : liste.** `/admin/chapitres/[id]/questions` lit `lireQuestionsChapitre`.
  - **Filtres** : statut (Tous, Brouillon, À relire, Validée), type, « Signalées seulement » et une recherche dans l'énoncé. Ils passent par `searchParams` et le filtrage se fait côté serveur.
  - **Chaque ligne affiche** :
    - l'énoncé (tronqué à 140 caractères) ;
    - le type ;
    - la notion ;
    - la difficulté ;
    - le statut (pastille avec texte) ;
    - « Déjà utilisée » si `utilisee` ;
    - le nombre de signalements ouverts ;
    - un lien « Modifier ».
  - **En haut** : compteurs par statut, « Nouvelle question » et un lien retour vers `/admin`.

- [ ] **Step 2 : formulaire** (même composant pour la création et la modification).
  - **Champs**, tous avec `label` :
    - type : `select`. En modification d'une question `utilisee`, un texte prévient : « Cette question a déjà servi : changer le type, les propositions ou les réponses crée une nouvelle version. » ;
    - énoncé ;
    - propositions (de 2 à 10) : chacune a un champ texte et une case « Bonne réponse », qui est une radio pour `qcm_unique`. Boutons « Ajouter une proposition » et « Retirer » ;
    - pour `vrai_faux` : radios « Vrai » et « Faux » ;
    - pour `reponse_courte` : réponses acceptées (une par ligne), marge (nombre, virgule acceptée) et case « Marge relative (en %) ». Rappel du guide des auteurs sous le champ, avec un lien vers `docs/guide-auteurs.md` affiché en clair ;
    - notion : champ texte avec `datalist` alimentée par `lireNotionsChapitre` ;
    - difficulté : radios 1, 2 et 3, libellées Facile, Moyenne et Difficile ;
    - explication.
  - **Aperçu élève.** L'énoncé et les propositions sont rendus avec les composants du lecteur de quiz s'ils sont réutilisables sans état ; sinon, un rendu statique proche.
  - **Action `enregistrerQuestion`.**
    - Elle valide avec `schemaQuestionImport`, en rendant `source` facultatif : schéma dérivé avec `.omit({ source: true }).extend({ source: z.string().optional() })`. Les schémas avec `refine` ne se dérivent pas tous ainsi ; si besoin, extraire les objets de base dans `format-import.ts`.
    - Elle convertit avec `versDonneesQuestion` et appelle `enregistrer_question` avec le statut actuel de la question.
    - Elle garde la saisie en cas d'erreur.
    - En cas de réussite, elle redirige vers `/admin/questions/[nouvel id]?enregistre=…`. Le nouvel id diffère de l'ancien si la question a été versionnée ; le message dit alors « Nouvelle version créée : l'ancienne reste dans les corrections passées. ».
  - **Boutons de statut**, d'après les transitions permises. Depuis `brouillon` : « Envoyer en relecture ». Depuis `a_relire` : « Valider » et « Repasser en brouillon ». Depuis `valide` : « Renvoyer en relecture » et « Repasser en brouillon ». Chacun appelle l'action `changerStatut`.
  - **« Supprimer »** n'apparaît que si la question n'est pas `utilisee`, avec `confirm`.
  - **Signalements ouverts.** S'il y en a sur la question, ils s'affichent au-dessus du formulaire (commentaire, date), avec un lien vers `/admin/signalements`.

- [ ] **Step 3 : vérifier.** `npm test`, typecheck, lint et build.
  - Vérification visuelle : créer une question de chaque type, l'envoyer en relecture puis la valider. Lancer un quiz élève sur le chapitre et vérifier qu'elle peut être tirée.
  - **Tester le chemin « réponse courte » de bout en bout** (report de l'étape 2) :
    - créer une question à réponse courte « Na+ » avec une marge numérique ;
    - la valider ;
    - faire un quiz qui la contient (script jetable : passer les autres questions en brouillon en SQL dans un cours de test) ;
    - répondre « na + » : la réponse est fausse, car la charge est significative. Répondre « Na+ » : elle est juste.
    - Noter le résultat dans le rapport.

- [ ] **Step 4 : commit.** Message : « Ajoute l'éditeur de questions et le cycle de relecture ».

---

### Task 11 : import depuis l'interface et traitement des signalements

**Files :**
- Create :
  - `src/app/(app)/admin/import/page.tsx` ;
  - `src/app/(app)/admin/import/actions.ts` ;
  - `src/components/admin/FormulaireImport.tsx` (client) ;
  - `src/app/(app)/admin/signalements/page.tsx` ;
  - `src/app/(app)/admin/signalements/actions.ts`.
- Modify : `next.config.ts` (`experimental.serverActions.bodySizeLimit: '4mb'`, après vérification de l'option avec context7 pour Next 16).

- [ ] **Step 1 : import.**
  - Le formulaire comprend un fichier JSON et une case « Publier le cours et les nouveaux chapitres ».
  - **Étape « Vérifier ».** L'action `verifierImport` lit le fichier côté serveur (`File.text()`), fait un `JSON.parse` dans un try/catch, puis `schemaCoursImport.safeParse`.
    - Elle renvoie soit la liste des erreurs, avec le chemin lisible (« Chapitre 3, question 12 : … ») ;
    - soit un résumé : titre du cours, nombre de chapitres, nombre de questions par statut, et chapitres déjà existants (slug connu dans la base).
  - **Étape « Importer ».** Le contenu validé est renvoyé dans un champ caché, puis l'action `importer` le revalide entièrement : on ne fait jamais confiance au champ caché. Elle appelle `importer_cours` avec la session admin.
  - Elle affiche le bilan : créées, modifiées, nouvelles versions, inchangées, archivées, supprimées, et chapitres absents du fichier.
  - Le format est rappelé sous le formulaire avec un lien vers `docs/guide-auteurs.md`, ainsi que la limite de 4 Mo.

- [ ] **Step 2 : signalements.**
  - `/admin/signalements` est filtrable : Ouverts (par défaut), Traités, Rejetés, Tous.
  - **Chaque carte affiche** :
    - le cours et le chapitre ;
    - l'énoncé ;
    - le statut actuel de la question ;
    - le commentaire ;
    - l'auteur (nom et e-mail) ;
    - la date ;
    - un lien « Modifier la question » (`/admin/questions/[id]`).
  - **Actions** : un champ « Réponse à l'enseignant » (facultatif, 1000 caractères au plus) avec les boutons « Marquer comme traité » et « Rejeter (la question est juste) ».
  - Une région `role="status"` toujours présente annonce la confirmation. Pour qu'elle soit réannoncée à chaque décision, ajouter un compteur ou un horodatage à l'URL de redirection (correction de l'étape 3a appliquée ici d'emblée).

- [ ] **Step 3 : vérifier.**
  - Importer `contenu/1re-st2s/bph.json` depuis l'interface : le bilan affiche « 140 inchangées ».
  - Importer un fichier volontairement faux : les erreurs sont lisibles et rien n'est écrit.
  - `npm test`, typecheck, lint et build.

- [ ] **Step 4 : commit.** Message : « Ajoute l'import JSON depuis l'interface et le traitement des signalements ».

---

### Task 12 : signalement côté enseignant

**Files :**
- Create : `src/components/BoutonSignaler.tsx` (client), `src/app/(app)/enseignant/signalements/page.tsx`, `src/app/(app)/enseignant/signalements/actions.ts`
- Modify :
  - la page de suivi par cours `src/app/(app)/enseignant/classes/[id]/cours/[coursId]/page.tsx` (questions les plus ratées) ;
  - `src/components/ListeCorrection.tsx` (correction d'un quiz passé par l'enseignant) ;
  - `src/components/EnTete.tsx` (lien « Signalements » dans la navigation enseignant).

- [ ] **Step 1 : `BoutonSignaler`.**
  - Bouton « Signaler une erreur ». Au clic, il déplie un formulaire en ligne (`<details>` ou bouton `aria-expanded`), sans fenêtre modale, avec :
    - une zone de texte « Qu'est-ce qui ne va pas ? » (de 5 à 1000 caractères, compteur de caractères relié par `aria-describedby`) ;
    - un bouton « Envoyer le signalement ».
  - L'action `signaler` appelle `signaler_question`. Une réussite affiche « Merci : la question est retirée des quiz le temps de la relecture. » dans une région `role="status"`. Une erreur s'affiche avec `role="alert"`, en passant par `messageErreur`.
  - Le composant ne reçoit que `questionId`.

- [ ] **Step 2 : intégration.**
  - Sur la page de suivi, chaque question ratée a son bouton.
  - Dans `ListeCorrection`, le bouton n'apparaît que si le profil est `enseignant` : passer une prop depuis la page de correction, qui lit le profil.
  - Vérifier que la correction renvoie bien l'id de chaque question. Sinon, l'ajouter à la RPC de correction sans exposer d'autre colonne, en recopiant le corps actuel de la fonction.

- [ ] **Step 3 : `/enseignant/signalements`.**
  - `exigerEnseignant()` puis `lireMesSignalements()`.
  - La page liste les signalements avec : énoncé, cours et chapitre, commentaire, statut (Ouvert, Traité ou Rejeté, en texte), réponse de l'administration et dates.
  - Sans signalement : « Tu n'as encore signalé aucune question. Utilise « Signaler une erreur » dans la correction d'un quiz ou dans le suivi d'une classe. »

- [ ] **Step 4 : vérifier.** `npm test`, typecheck, lint et build. Vérification visuelle de bout en bout :
  - un enseignant signale une question depuis le suivi ;
  - l'admin la voit, la rejette avec une réponse ;
  - l'enseignant voit « Rejeté » et la réponse.

- [ ] **Step 5 : commit.** Message : « Permet aux enseignants de signaler une question et de suivre leurs signalements ».

---

### Task 13 : guide des auteurs, parcours de bout en bout et revue

**Files :**
- Create : `docs/guide-auteurs.md`, `e2e/contenu.spec.ts`
- Modify : `e2e/aide-db.ts` (nouvelles aides si besoin), `README.md`

- [ ] **Step 1 : guide des auteurs** (`docs/guide-auteurs.md`, en français, ton du README). Il couvre :
  - **Le format JSON** d'un cours : champs, types de questions et exemple minimal valide pour chaque type. Ajouter un test Vitest qui lit les exemples du guide et les valide avec `schemaCoursImport`.
  - **Les statuts et le cycle de relecture.** Le contenu généré arrive à `a_relire`.
  - **Les réponses courtes** (report de l'étape 2) :
    - la normalisation (accents, casse, ponctuation finale) ;
    - ce qui reste significatif (« Na+ » et « Na », % et °) ;
    - ne pas écrire de séparateur de milliers (« 1 000 » ou « 1000 » ? préciser ce que fait `prive.normaliser`) ;
    - « Na + » contre « Na+ » contre « Na⁺ » : préciser le comportement réel de `prive.normaliser` et recommander d'ajouter les variantes dans `reponses_acceptees` ;
    - la marge : seule la première valeur numérique de chaque réponse acceptée sert de référence.

    Lire `prive.normaliser` et `prive.en_nombre` (migrations de l'étape 2) avant d'écrire ces règles, et donner un exemple vérifié pour chacune.
  - **Le HTML autorisé** : la liste blanche, et pourquoi les scripts, les styles externes et les images hors du bucket sont retirés.
  - **Le versionnage** : ce qui crée une nouvelle version.
  - **L'import** : commande du script et page `/admin/import`.

- [ ] **Step 2 : parcours de bout en bout** (`e2e/contenu.spec.ts`). Un seul test séquentiel, avec `test.setTimeout(240_000)` et un `browser.newContext()` par acteur. Les e-mails sont uniques par projet et par lancement.
  1. Un admin (compte créé, puis promu par la clé de service) ouvre `/admin` : le tableau liste le cours BPH et ses 7 chapitres.
  2. L'admin crée une question `vrai_faux` dans BPH ch1, l'envoie en relecture puis la valide. La liste affiche « Validée ».
  3. **Versionnage.** Un élève fait le quiz de ch1 jusqu'au bout (aide `repondreJuste`). L'admin modifie ensuite les propositions d'une question QCM tirée dans ce quiz. Le message « Nouvelle version créée » s'affiche, et la page de correction de l'élève montre toujours l'ancienne version de la question.
  4. **Nettoyage.** L'admin enregistre dans une section de ch1 le HTML `<p id="xss-test">ok</p><img src="x" onerror="window.__xss=1"><script>window.__xss=2</script>`. Sur la page élève du chapitre :
     - `#xss-test` est visible ;
     - `window.__xss` est indéfini ;
     - la page ne contient aucune balise `script` dans la section ;
     - il n'y a aucun `img[onerror]`.

     Remettre ensuite la section d'origine, en réimportant BPH dans le teardown du test ou par la RPC.
  5. **Signalement.** Un enseignant validé (créé et promu par la clé de service) passe le quiz de ch1, signale une question depuis la correction, et voit le message de confirmation. L'admin ouvre `/admin/signalements`, voit le commentaire et rejette avec une réponse. La question est de nouveau « Validée », et `/enseignant/signalements` affiche « Rejeté » avec la réponse.
  6. **Import.** L'admin importe un fichier faux, dont une proposition a un indice hors limites : l'erreur s'affiche avec son chemin. Il réimporte ensuite `bph.json` sans publication : le bilan affiche 0 créée, et le cours est toujours publié.

- [ ] **Step 3 : README.**
  - Dans la section « Rôles », compléter la partie admin : éditeurs, statuts, import et signalements.
  - Dans la partie enseignant, ajouter le signalement.
  - Mettre à jour la section import : nouvelle commande et bilan.

- [ ] **Step 4 : toute la chaîne.** Run : `npm run db:reset && npm test && npm run test:db && npm run typecheck && npm run lint && npm run build && npm run e2e`, avec l'e2e lancé deux fois. Expected : tout passe sur les deux projets, et le port 3000 est libre à la fin.

- [ ] **Step 5 : commit.**

```bash
git add docs/guide-auteurs.md e2e README.md src
git commit -m "Ajoute le guide des auteurs et le parcours de bout en bout de la gestion du contenu"
```

- [ ] **Step 6 : revue de fin d'étape (Opus).**
  - **D'abord security-review**, centré sur :
    - aucune écriture directe du contenu ;
    - les RPC admin (rôle, `search_path`, EXECUTE, lecture des corrigés limitée à l'admin) ;
    - `importer_cours` et `service_role` ;
    - le versionnage, en particulier : une modification peut-elle fausser une correction passée ou une tentative ouverte ?
    - le nettoyage HTML : essayer de contourner la liste blanche (SVG, `style`, entités, casse, balises imbriquées) ;
    - les politiques de Storage ;
    - les signalements (abus, limite, fuite des corrigés vers l'enseignant).
  - **Ensuite design:accessibility-review**, sur les éditeurs et les tableaux de l'espace admin et sur le bouton de signalement.
  - **Enfin superpowers:requesting-code-review.**

  Corriger les points bloquants.

- [ ] **Step 7 : vérification finale.** Suivre **superpowers:verification-before-completion** : relancer la chaîne du Step 4, rédiger `docs/superpowers/plans/2026-11-24-etape-3b-bilan.md` et mettre à jour la feuille de route.
