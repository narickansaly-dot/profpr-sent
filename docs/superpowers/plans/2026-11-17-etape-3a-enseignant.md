# Étape 3a : espace enseignant — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :**
- Un enseignant s'inscrit et est validé par un administrateur.
- Il crée des classes et partage un code d'invitation que ses élèves utilisent pour les rejoindre.
- Il suit leur progression et leurs notes, repère les questions les plus ratées et exporte les notes en CSV.
- Il fixe une date d'ouverture et une date limite pour l'évaluation de chaque cours.

**Architecture :**
- Données dans Postgres : tables `classe`, `classe_cours`, `inscription_classe`, `echeance_evaluation`.
- Écriture par des fonctions RPC `security definer` qui vérifient le rôle et la propriété.
- Lecture du suivi uniquement par des RPC réservées au propriétaire de la classe. Un enseignant ne lit jamais directement les tables de résultats des élèves, ni leurs calendriers ou abonnements.
- `demarrer_evaluation` applique les fenêtres d'ouverture des classes de l'élève.
- Côté Next.js : pages enseignant (`/enseignant`), page élève « Mes classes » (`/classes`), page d'administration des demandes (`/admin/enseignants`).

**Tech Stack :** Next.js 16, React 19, TypeScript, Supabase (Postgres 17, plpgsql, pgcrypto), zod, Vitest, pgTAP, Playwright.

**Spec :** `docs/superpowers/specs/2026-11-03-app-lycee-design.md`. Sections concernées : 3 « Comptes », 4 « Évaluation du cours » (dates fixées par l'enseignant), 5 « Enseignant », 6 (signalement : étape 3b).

**Bilans précédents (points reportés à l'étape 3) :** `docs/superpowers/plans/2026-11-03-etape-1-bilan.md` et `docs/superpowers/plans/2026-11-10-etape-2-bilan.md`.

**Branche :** `etape-3a-enseignant`, créée depuis `etape-2-quiz`. Sa PR vise `main` une fois la PR n°2 fusionnée.

## Découpage de l'étape 3

- **3a (ce plan)** : rôle enseignant et validation, classes et codes, suivi, questions ratées, export CSV, échéances d'évaluation. S'y ajoute la dette de l'étape 2 qui touche ces mêmes zones.
- **3b (plan suivant)** :
  - éditeurs de chapitre et de questions, avec RPC d'administration (lecture d'`enonce` et de `propositions`) ;
  - nettoyage HTML par liste blanche et stockage des schémas ;
  - versionnage des questions déjà utilisées ;
  - import JSON depuis l'interface ;
  - signalement des questions par les enseignants ;
  - contrainte CHECK sur `cours.couleur` ;
  - guide des auteurs ;
  - améliorations du script d'import.

## Décisions prises dans ce plan (à valider avec la relecture)

1. **Inscription enseignant.**
   - Sur `/bienvenue`, la personne choisit « Je suis élève » ou « J’enseigne ».
   - Une personne qui enseigne donne son prénom et son établissement. Son profil reste `eleve`, avec `demande_enseignant = true`.
   - Tant que la demande n'est pas traitée, l'application affiche seulement une page d'attente.
   - Un `admin_contenu` accepte la demande (le rôle passe à `enseignant`) ou la refuse.
   - Le premier administrateur est désigné à la main en SQL ; le README explique comment.
2. **Code de classe.**
   - 6 caractères tirés de `ABCDEFGHJKMNPQRSTUVWXYZ23456789`, générés avec `gen_random_bytes` pour être imprévisibles. L'enseignant peut le régénérer.
   - Saisie tolérante : majuscules ou minuscules, espaces ignorés.
   - Au-delà de 10 codes faux en une heure, `rejoindre_classe` répond `trop_d_essais`, pour freiner les essais au hasard.
3. **Échéances.**
   - Pour chaque couple classe et cours : `ouverture` et `limite`, chacune facultative.
   - Un élève peut commencer l'évaluation si au moins une de ses classes liées au cours a une fenêtre ouverte, ou si aucune ne fixe de dates.
   - Une évaluation commencée avant la limite peut être terminée après.
4. **Questions les plus ratées.**
   - Calculées sur les tentatives closes des élèves de la classe, pour un cours, avec au moins 5 réponses par question.
   - L'enseignant voit l'énoncé, les propositions et la bonne réponse : les comptes enseignants sont validés à la main.
5. **Accès des enseignants au catalogue.**
   - Un enseignant voit tous les cours publiés sur une page `/cours`, et `/` le redirige vers `/enseignant`.
   - Il peut ouvrir les chapitres et lancer des quiz (`peut_lire_cours` le permet déjà) ; ses résultats n'apparaissent dans aucune classe.
6. **Courses entre deux démarrages.** Quand deux `demarrer_quiz` ou deux `demarrer_evaluation` arrivent en même temps, l'index unique lève 23505. L'action serveur relance l'appel une fois, et la seconde tentative renvoie la tentative déjà ouverte.

## Contraintes globales

- Toute l'interface est **en français** : tutoiement pour les élèves, formulations neutres et tutoiement aussi pour les enseignants (« Ta classe »). Les formulations ne sont pas genrées.
- **Un enseignant ne voit que les élèves inscrits dans ses propres classes, et seulement pour les cours rattachés à ces classes.** Il ne voit jamais les calendriers, les abonnements, les réponses individuelles ni les permutations.
- Toute écriture sur `classe`, `classe_cours`, `inscription_classe`, `echeance_evaluation` et `prive.essai_code` passe par une fonction. Aucune écriture directe pour `authenticated`. Aucun accès pour `anon`.
- Chaque fonction exposée a `set search_path = ''` et des noms qualifiés. On applique `revoke execute … from public, anon`, puis `grant execute … to authenticated`. Les helpers vont dans `prive`.
- Les codes d'erreur levés par la base sont des mots-clés `snake_case`, traduits en français dans `src/lib/quiz/erreurs.ts` (fichier renommé en Task 7, voir plus bas).
- Le seuil de réussite reste 75 %. Les règles de l'évaluation restent inchangées : 40 questions, 60 minutes, 3 essais, 24 heures entre deux essais.
- Lors d'un `create or replace` sur une fonction existante, on recopie son **corps actuel** à partir de la migration la plus récente qui la définit, et on n'ajoute que le changement décrit.
- Commandes shell : préfixer par `export PATH="$HOME/.orbstack/bin:$PATH";`. Ne jamais afficher ni commiter `.env.local`.
- Après chaque migration : `npm run db:reset`, puis `npx supabase gen types typescript --local > src/lib/supabase/types.ts`.
- Avant d'utiliser une API de Next.js, de supabase-js ou de plpgsql, consulter sa documentation à jour avec **context7**.
- Messages de commit en français, à l'impératif présent, terminés par la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hors périmètre

Étape 3b (gestion du contenu, signalements), calendrier et notifications (étape 4 : les échéances y seront affichées), abonnements et consentement parental (étape 5), comptes parents.

## Structure des fichiers

```
supabase/migrations/
  20261117000001_dette.sql                 # index, prive.cloturer* en security invoker
  20261117000002_role_enseignant.sql       # demande_enseignant, etablissement, RPC d'administration
  20261117000003_classes.sql               # classe, classe_cours, inscription_classe, codes, RPC
  20261117000004_suivi_enseignant.sql      # suivi_classe, notes_classe, questions_ratees_classe
  20261117000005_echeances.sql             # echeance_evaluation, fenêtre, demarrer_evaluation
supabase/tests/
  role_enseignant.test.sql | classes.test.sql | suivi_enseignant.test.sql | echeances.test.sql
src/lib/
  profil/onboarding.ts (+ .test.ts)        # deux profils : élève ou enseignant
  routes.ts (+ .test.ts)                   # paramètre ?suite= après connexion
  quiz/regles.ts (+ .test.ts)              # fenetreEvaluation, nouveaux états de l'évaluation
  erreurs.ts (+ .test.ts)                  # (renommé depuis quiz/erreurs.ts) nouveaux codes
  enseignant/csv.ts (+ .test.ts)           # notes → CSV
  enseignant/requetes.ts                   # lectures enseignant
  supabase/rpc.ts (+ .test.ts)             # appel RPC avec une relance sur 23505
src/app/
  bienvenue/…                              # choix élève / enseignant
  (app)/layout.tsx, page.tsx               # page d'attente, redirection enseignant
  (app)/cours/page.tsx                     # catalogue (enseignants, admins)
  (app)/classes/page.tsx, actions.ts       # élève : rejoindre, quitter
  (app)/enseignant/page.tsx, actions.ts    # liste, création de classe
  (app)/enseignant/classes/[id]/page.tsx   # élèves, code, cours, échéances
  (app)/enseignant/classes/[id]/cours/[coursId]/page.tsx       # notes et questions ratées
  (app)/enseignant/classes/[id]/cours/[coursId]/export/route.ts # CSV
  (app)/admin/enseignants/page.tsx, actions.ts
src/components/EnTete.tsx, CarteEvaluation.tsx, AttenteValidation.tsx
src/styles/enseignant.css
e2e/enseignant.spec.ts, e2e/aide-db.ts (ajouts)
```

## Modèles et skills par tâche

| Tâche | Implémentation | Revue | Skills |
|---|---|---|---|
| 1. Dette base | Haiku | Sonnet | — |
| 2. Dette application (`?suite=`, relance 23505, erreurs bienvenue) | Sonnet | Sonnet | test-driven-development |
| 3. Rôle enseignant (base) | Sonnet | **Opus** | test-driven-development |
| 4. Classes et codes (base) | Sonnet | **Opus** | test-driven-development |
| 5. Suivi enseignant (base) | Sonnet | **Opus** | test-driven-development |
| 6. Échéances d'évaluation (base) | Sonnet | **Opus** | test-driven-development |
| 7. Couche TypeScript | Sonnet | Sonnet | test-driven-development, context7 |
| 8. Inscription enseignant, attente, administration | Sonnet | Sonnet | frontend-design |
| 9. Élève : mes classes, échéances affichées | Sonnet | Sonnet | frontend-design |
| 10. Enseignant : classes | Sonnet | Sonnet | frontend-design, ui-ux-pro-max |
| 11. Enseignant : suivi par cours et export | Sonnet | Sonnet | dataviz, frontend-design |
| 12. Parcours de bout en bout et revue | Sonnet | **Opus** | security-review, design:accessibility-review, verification-before-completion |

---

### Task 1 : dette de l'étape 2 côté base

**Files :**
- Create : `supabase/migrations/20261117000001_dette.sql`

- [ ] **Step 1 : migration.**

```sql
-- Dette de l'étape 2.

-- Le catalogue filtre par filière et niveau.
create index if not exists cours_filiere_niveau on public.cours (filiere_id, niveau_code);

-- Ces helpers ne sont appelés que par des fonctions security definer : ils n'ont pas besoin de l'être eux-mêmes.
-- En security invoker, une erreur de droits accordés par mégarde ne donnerait accès à rien de plus.
alter function prive.cloturer(uuid, public.statut_tentative_t) security invoker;
alter function prive.cloturer_si_expiree(uuid) security invoker;
```

- [ ] **Step 2 : vérifier.** Run : `npm run db:reset && npm run test:db`. Expected : PASS sur les 7 fichiers (187 tests).

Si un test échoue parce qu'une fonction appelante n'est pas `security definer`, l'indiquer dans le rapport et annuler le changement pour cette fonction seulement. Ne pas toucher aux tests.

- [ ] **Step 3 : commit.**

```bash
git add supabase
git commit -m "Ajoute un index au catalogue et retire security definer des helpers de clôture"
```

---

### Task 2 : dette de l'étape 2 côté application

**Files :**
- Create : `src/lib/supabase/rpc.ts` (+ `.test.ts`)
- Modify : `src/lib/routes.ts` (+ `.test.ts`), `src/proxy.ts`, `src/app/(auth)/actions.ts`, `src/app/(auth)/connexion/page.tsx`, `src/app/(auth)/FormulaireIdentifiants.tsx`, `src/app/(app)/tentative/actions.ts`, `src/app/bienvenue/page.tsx`

**Interfaces :**
- Produces :
  - `redirectionPour(chemin, connecte)` renvoie maintenant `{ pathname: string; suite?: string } | null` ;
  - `cheminSuiteSur(valeur: unknown): string | null` ;
  - `appelerAvecRelance<T>(appel: () => Promise<{ data: T | null; error: { code?: string; message: string } | null }>)`, qui relance une fois sur le code `23505`.

- [ ] **Step 1 : tests.** Ajouter à `src/lib/routes.test.ts` :

```ts
import { cheminSuiteSur } from './routes';

describe('cheminSuiteSur', () => {
  it('accepte un chemin relatif de l’application', () => {
    expect(cheminSuiteSur('/cours/bph-1re-st2s/ch1')).toBe('/cours/bph-1re-st2s/ch1');
    expect(cheminSuiteSur('/classes?code=ABC')).toBe('/classes?code=ABC');
  });
  it('refuse les adresses externes et les chemins dangereux', () => {
    expect(cheminSuiteSur('https://exemple.com')).toBeNull();
    expect(cheminSuiteSur('//exemple.com')).toBeNull();
    expect(cheminSuiteSur('/\\exemple.com')).toBeNull();
    expect(cheminSuiteSur('javascript:alert(1)')).toBeNull();
    expect(cheminSuiteSur('/connexion')).toBeNull();
    expect(cheminSuiteSur(null)).toBeNull();
  });
});
```

Adapter aussi les tests existants de `redirectionPour` à la nouvelle forme de retour. Un visiteur non connecté qui demande `/cours/bph-1re-st2s` obtient `{ pathname: '/connexion', suite: '/cours/bph-1re-st2s' }`. Un visiteur qui demande `/` obtient `{ pathname: '/connexion' }`, sans `suite`.

Créer `src/lib/supabase/rpc.test.ts` :

```ts
import { describe, expect, it, vi } from 'vitest';
import { appelerAvecRelance } from './rpc';

describe('appelerAvecRelance', () => {
  it('relance une fois sur une violation d’unicité', async () => {
    const appel = vi.fn()
      .mockResolvedValueOnce({ data: null, error: { code: '23505', message: 'duplicate key' } })
      .mockResolvedValueOnce({ data: 'id-1', error: null });
    await expect(appelerAvecRelance(appel)).resolves.toEqual({ data: 'id-1', error: null });
    expect(appel).toHaveBeenCalledTimes(2);
  });
  it('ne relance pas les autres erreurs', async () => {
    const appel = vi.fn().mockResolvedValue({ data: null, error: { code: 'P0001', message: 'quiz_indisponible' } });
    await appelerAvecRelance(appel);
    expect(appel).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2 : lancer.** Run : `npx vitest run src/lib/routes.test.ts src/lib/supabase/rpc.test.ts`. Expected : FAIL.

- [ ] **Step 3 : implémenter.**

`src/lib/routes.ts` :
- ajouter `cheminSuiteSur` : le chemin doit commencer par un seul `/`, ne pas commencer par `//` ni par `/\`, et ne pas mener à une route d'invité (`ROUTES_INVITE`). Sinon, renvoyer `null` ;
- faire renvoyer à `redirectionPour` l'objet décrit. `suite` vaut le chemin demandé (avec sa query) uniquement s'il est différent de `/` et passe `cheminSuiteSur`.

`src/proxy.ts` : `url.pathname = cible.pathname; url.search = cible.suite ? '?suite=' + encodeURIComponent(cible.suite) : ''`.

Connexion :
- `FormulaireIdentifiants` reçoit une prop `suite?: string` et l'envoie dans un `<input type="hidden" name="suite">` ;
- la page de connexion lit `searchParams.suite`, la valide avec `cheminSuiteSur` et la passe au formulaire ;
- dans `connecter`, après une connexion réussie, faire `redirect(cheminSuiteSur(form.get('suite')) ?? '/')`.

`src/lib/supabase/rpc.ts` :

```ts
type Reponse<T> = { data: T | null; error: { code?: string; message: string } | null };

/**
 * Deux démarrages simultanés peuvent heurter l'index « une tentative ouverte » (23505) :
 * le second appel renvoie alors la tentative ouverte par le premier.
 */
export async function appelerAvecRelance<T>(appel: () => PromiseLike<Reponse<T>>): Promise<Reponse<T>> {
  const premiere = await appel();
  if (premiere.error?.code !== '23505') return premiere;
  return appel();
}
```

Dans `lancerQuiz` et `lancerEvaluation`, envelopper l'appel `supabase.rpc(...)` dans `appelerAvecRelance(() => supabase.rpc(...))`.

`src/app/bienvenue/page.tsx` : si la requête des filières échoue, afficher `<p role="alert" className="message-erreur">Impossible de charger les filières. Recharge la page.</p>` à la place du formulaire.

- [ ] **Step 4 : vérifier.** Run : `npm test && npm run typecheck && npm run build && npm run e2e`. Expected : PASS. Le test « un visiteur non connecté ne peut pas lire un chapitre » attend `/connexion$`. Le remplacer par `toHaveURL(/\/connexion\?suite=%2Fcours%2Fbph-1re-st2s%2Fch1$/)`, ce qui renforce l'assertion.

- [ ] **Step 5 : commit.**

```bash
git add src e2e
git commit -m "Ramène l'élève à la page demandée après connexion et relance les démarrages simultanés"
```

---

### Task 3 : rôle enseignant (base)

**Files :**
- Create : `supabase/migrations/20261117000002_role_enseignant.sql`, `supabase/tests/role_enseignant.test.sql`

**Interfaces :**
- Produces : colonnes `profil.demande_enseignant boolean`, `profil.etablissement text`, modifiables par leur propriétaire.
- Produces : RPC `demandes_enseignant() → table(id uuid, nom text, email text, etablissement text, inscrit_le timestamptz)`, qui ne renvoie des lignes qu'à un `admin_contenu`.
- Produces : RPC `traiter_demande_enseignant(p_profil uuid, p_accepter boolean) → void`.
- Codes d'erreur : `acces_refuse`, `demande_introuvable`.

- [ ] **Step 1 : tests.** `supabase/tests/role_enseignant.test.sql` :

```sql
begin;
select plan(8);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000f1', 'prof@test.local'),
  ('00000000-0000-0000-0000-0000000000f2', 'admin@test.local'),
  ('00000000-0000-0000-0000-0000000000f3', 'eleve@test.local');
update public.profil set role = 'admin_contenu' where id = '00000000-0000-0000-0000-0000000000f2';

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f1","role":"authenticated"}', true);
select lives_ok($$ update public.profil set demande_enseignant = true, etablissement = 'Lycée Test', nom = 'Camille'
  where id = '00000000-0000-0000-0000-0000000000f1' $$, 'une personne peut demander le rôle enseignant');
select is((select role::text from public.profil where id = '00000000-0000-0000-0000-0000000000f1'), 'eleve', 'la demande ne change pas le rôle');
select is((select count(*)::int from public.demandes_enseignant()), 0, 'un non-admin ne voit aucune demande');
select throws_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f1', true) $$,
  'P0001', 'acces_refuse', 'un non-admin ne peut pas traiter une demande');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated"}', true);
select is((select etablissement from public.demandes_enseignant() where id = '00000000-0000-0000-0000-0000000000f1'), 'Lycée Test', 'l''admin voit la demande');
select lives_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f1', true) $$, 'l''admin accepte');
select is((select role::text || '/' || demande_enseignant::text from public.profil where id = '00000000-0000-0000-0000-0000000000f1'),
  'enseignant/false', 'rôle enseignant, demande close');
select throws_ok($$ select public.traiter_demande_enseignant('00000000-0000-0000-0000-0000000000f3', true) $$,
  'P0001', 'demande_introuvable', 'impossible de promouvoir quelqu''un sans demande');

select * from finish();
rollback;
```

Note : le `select is(... from public.profil where id = f1)` exécuté par l'admin passe par `reset role`, car la RLS du profil ne laisse lire que son propre profil. Le mettre juste avant cette assertion, puis faire `set local role authenticated` pour la suite si besoin.

- [ ] **Step 2 : lancer.** Expected : FAIL.

- [ ] **Step 3 : migration.**

```sql
-- Rôle enseignant : demande à l'inscription, validation par un admin du contenu.

alter table public.profil
  add column demande_enseignant boolean not null default false,
  add column etablissement text check (etablissement is null or char_length(etablissement) between 2 and 120);

grant update (demande_enseignant, etablissement) on public.profil to authenticated;

create function public.demandes_enseignant()
returns table (id uuid, nom text, email text, etablissement text, inscrit_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, p.nom, p.email, p.etablissement, p.inscrit_le
    from public.profil p
   where p.demande_enseignant and p.role = 'eleve'
     and public.role_actuel() = 'admin_contenu'
   order by p.inscrit_le
$$;

create function public.traiter_demande_enseignant(p_profil uuid, p_accepter boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'admin_contenu' then
    raise exception 'acces_refuse';
  end if;
  update public.profil
     set role = case when p_accepter then 'enseignant'::public.role_t else role end,
         demande_enseignant = false
   where id = p_profil and demande_enseignant and role = 'eleve';
  if not found then
    raise exception 'demande_introuvable';
  end if;
end $$;

revoke execute on function public.demandes_enseignant(), public.traiter_demande_enseignant(uuid, boolean) from public, anon;
grant execute on function public.demandes_enseignant(), public.traiter_demande_enseignant(uuid, boolean) to authenticated;
```

- [ ] **Step 4 : appliquer, tester, types, commit.**

```bash
npm run db:reset && npm run test:db
npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run typecheck
git add supabase src/lib/supabase/types.ts
git commit -m "Ajoute la demande de rôle enseignant et sa validation par un admin"
```

---

### Task 4 : classes et codes d'invitation (base)

**Files :**
- Create : `supabase/migrations/20261117000003_classes.sql`, `supabase/tests/classes.test.sql`

**Interfaces :**
- Tables :
  - `classe(id, enseignant_id, nom, filiere_id, niveau_code, code char(6) unique, cree_le)` ;
  - `classe_cours(classe_id, cours_id)` ;
  - `inscription_classe(classe_id, eleve_id, rejoint_le)` ;
  - `prive.essai_code(eleve_id, essai_le)`.
- RPC :
  - `creer_classe(p_nom text, p_filiere uuid, p_niveau text, p_cours uuid[]) → uuid` ;
  - `definir_cours_classe(p_classe uuid, p_cours uuid[]) → void` ;
  - `regenerer_code_classe(p_classe uuid) → text` ;
  - `rejoindre_classe(p_code text) → table(statut text, classe_nom text)`, où `statut` vaut `'ok' | 'deja_inscrit' | 'code_invalide' | 'trop_d_essais'` ;
  - `quitter_classe(p_classe uuid) → void` ;
  - `retirer_eleve(p_classe uuid, p_eleve uuid) → void` ;
  - `classes_enseignant() → table(id uuid, nom text, code text, filiere_id uuid, niveau_code text, nb_eleves int, cours_ids uuid[], cree_le timestamptz)` ;
  - `classes_eleve() → table(id uuid, nom text, enseignant_nom text, rejoint_le timestamptz)`.
- Helpers `prive` :
  - `prive.est_enseignant_de(p_classe uuid) → boolean` ;
  - `prive.nouveau_code_classe() → text` ;
  - `prive.verifier_cours_publies(p_cours uuid[])`, qui lève `cours_invalide`.
- Codes d'erreur : `acces_refuse`, `nom_invalide`, `cours_invalide`, `classe_introuvable`.

- [ ] **Step 1 : tests.** `supabase/tests/classes.test.sql` :

```sql
begin;
select plan(17);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000a01', 'prof-a@test.local'),
  ('00000000-0000-0000-0000-000000000a02', 'prof-b@test.local'),
  ('00000000-0000-0000-0000-000000000a03', 'eleve-1@test.local'),
  ('00000000-0000-0000-0000-000000000a04', 'eleve-2@test.local');
update public.profil set role = 'enseignant', nom = 'Prof A' where id = '00000000-0000-0000-0000-000000000a01';
update public.profil set role = 'enseignant', nom = 'Prof B' where id = '00000000-0000-0000-0000-000000000a02';
update public.profil set nom = 'Élève 1' where id = '00000000-0000-0000-0000-000000000a03';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-000000000a01', 'technologique', 'CLS', 'Filière classes');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-000000000a01', 'cours-classe', '10000000-0000-0000-0000-000000000a01', '1re', 'C', 'Cours publié', true),
  ('20000000-0000-0000-0000-000000000a02', 'cours-cache-classe', '10000000-0000-0000-0000-000000000a01', '1re', 'C', 'Cours caché', false);
create temporary table c (id uuid, code text);
grant all on c to authenticated;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a03","role":"authenticated"}', true);
select throws_ok($$ select public.creer_classe('1re ST2S B', null, '1re', array['20000000-0000-0000-0000-000000000a01']::uuid[]) $$,
  'P0001', 'acces_refuse', 'un élève ne crée pas de classe');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a01","role":"authenticated"}', true);
select throws_ok($$ select public.creer_classe('1re ST2S B', null, '1re', array['20000000-0000-0000-0000-000000000a02']::uuid[]) $$,
  'P0001', 'cours_invalide', 'un cours non publié est refusé');
select throws_ok($$ select public.creer_classe(' ', null, '1re', array['20000000-0000-0000-0000-000000000a01']::uuid[]) $$,
  'P0001', 'nom_invalide', 'un nom vide est refusé');
insert into c (id) select public.creer_classe('1re ST2S B', '10000000-0000-0000-0000-000000000a01', '1re', array['20000000-0000-0000-0000-000000000a01']::uuid[]);
update c set code = (select code from public.classe where id = (select id from c));
select ok((select code ~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$' from c), 'code de 6 caractères sans caractère ambigu');
select is((select cours_ids from public.classes_enseignant() where id = (select id from c)), array['20000000-0000-0000-0000-000000000a01']::uuid[], 'cours rattaché');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a02","role":"authenticated"}', true);
select is((select count(*)::int from public.classe), 0, 'un autre enseignant ne voit pas la classe');
select throws_ok(format($$ select public.regenerer_code_classe(%L) $$, (select id from c)), 'P0001', 'acces_refuse', 'ni ne régénère son code');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a03","role":"authenticated"}', true);
select is((select statut from public.rejoindre_classe('ZZZZZZ')), 'code_invalide', 'code faux');
select is((select statut from public.rejoindre_classe(lower(' ' || (select code from c) || ' '))), 'ok', 'code juste, saisi en minuscules avec des espaces');
select is((select statut from public.rejoindre_classe((select code from c))), 'deja_inscrit', 'deuxième tentative : déjà inscrit');
select is((select nom from public.classes_eleve()), '1re ST2S B', 'l''élève voit sa classe');
select is((select count(*)::int from public.inscription_classe), 1, 'l''élève voit sa seule inscription');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a04","role":"authenticated"}', true);
do $$ begin for i in 1..10 loop perform public.rejoindre_classe('ZZZZZZ'); end loop; end $$;
select is((select statut from public.rejoindre_classe((select code from c))), 'trop_d_essais', 'trop d''essais faux en une heure');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000a01","role":"authenticated"}', true);
select is((select nb_eleves from public.classes_enseignant() where id = (select id from c)), 1, 'l''enseignant compte un élève');
select lives_ok(format($$ select public.retirer_eleve(%L, '00000000-0000-0000-0000-000000000a03') $$, (select id from c)), 'l''enseignant retire un élève');
select throws_ok($$ insert into public.classe (enseignant_id, nom, code) values ('00000000-0000-0000-0000-000000000a01', 'X', 'AAAAAA') $$,
  '42501', null, 'aucune écriture directe');

reset role;
set local role anon;
select set_config('request.jwt.claims', '{}', true);
select throws_ok($$ select count(*) from public.classe $$, '42501', null, 'anonyme : aucun accès');

select * from finish();
rollback;
```

- [ ] **Step 2 : lancer.** Expected : FAIL.

- [ ] **Step 3 : migration.**

```sql
-- Classes : un enseignant crée une classe, partage un code, les élèves la rejoignent.

create table public.classe (
  id uuid primary key default gen_random_uuid(),
  enseignant_id uuid not null references public.profil on delete cascade,
  nom text not null check (char_length(trim(nom)) between 2 and 60),
  filiere_id uuid references public.filiere,
  niveau_code text references public.niveau,
  code char(6) not null unique,
  cree_le timestamptz not null default now()
);
create index classe_enseignant on public.classe (enseignant_id);

create table public.classe_cours (
  classe_id uuid not null references public.classe on delete cascade,
  cours_id uuid not null references public.cours on delete restrict,
  primary key (classe_id, cours_id)
);

create table public.inscription_classe (
  classe_id uuid not null references public.classe on delete cascade,
  eleve_id uuid not null references public.profil on delete cascade,
  rejoint_le timestamptz not null default now(),
  primary key (classe_id, eleve_id)
);
create index inscription_classe_eleve on public.inscription_classe (eleve_id);

create table prive.essai_code (
  eleve_id uuid not null references public.profil on delete cascade,
  essai_le timestamptz not null default now()
);
create index essai_code_eleve on prive.essai_code (eleve_id, essai_le);

alter table public.classe enable row level security;
alter table public.classe_cours enable row level security;
alter table public.inscription_classe enable row level security;

create policy "ses classes" on public.classe for select to authenticated
  using (enseignant_id = (select auth.uid()));
create policy "cours de ses classes" on public.classe_cours for select to authenticated
  using (exists (select 1 from public.classe c where c.id = classe_id and c.enseignant_id = (select auth.uid())));
create policy "inscriptions visibles" on public.inscription_classe for select to authenticated
  using (eleve_id = (select auth.uid())
         or exists (select 1 from public.classe c where c.id = classe_id and c.enseignant_id = (select auth.uid())));

revoke all on public.classe, public.classe_cours, public.inscription_classe from anon;
revoke insert, update, delete, truncate, references, trigger, maintain
  on public.classe, public.classe_cours, public.inscription_classe from authenticated;

create function prive.est_enseignant_de(p_classe uuid) returns boolean
language sql stable set search_path = '' as $$
  select exists (select 1 from public.classe where id = p_classe and enseignant_id = auth.uid())
$$;

create function prive.nouveau_code_classe() returns text
language plpgsql volatile set search_path = '' as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v text;
begin
  loop
    select string_agg(substr(alphabet, 1 + (get_byte(b.octets, i) % 31), 1), '' order by i) into v
      from (select extensions.gen_random_bytes(6) as octets) b, generate_series(0, 5) i;
    exit when not exists (select 1 from public.classe where code = v);
  end loop;
  return v;
end $$;

create function prive.verifier_cours_publies(p_cours uuid[]) returns void
language plpgsql stable set search_path = '' as $$
begin
  if p_cours is null or cardinality(p_cours) = 0
     or exists (select 1 from unnest(p_cours) x
                where not exists (select 1 from public.cours c where c.id = x and c.publie)) then
    raise exception 'cours_invalide';
  end if;
end $$;

create function public.creer_classe(p_nom text, p_filiere uuid, p_niveau text, p_cours uuid[]) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if public.role_actuel() is distinct from 'enseignant' then
    raise exception 'acces_refuse';
  end if;
  if p_nom is null or char_length(trim(p_nom)) not between 2 and 60 then
    raise exception 'nom_invalide';
  end if;
  perform prive.verifier_cours_publies(p_cours);
  insert into public.classe (enseignant_id, nom, filiere_id, niveau_code, code)
    values (auth.uid(), trim(p_nom), p_filiere, p_niveau, prive.nouveau_code_classe())
    returning id into v_id;
  insert into public.classe_cours (classe_id, cours_id) select v_id, x from (select distinct unnest(p_cours) x) d;
  return v_id;
end $$;

create function public.definir_cours_classe(p_classe uuid, p_cours uuid[]) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  perform prive.verifier_cours_publies(p_cours);
  delete from public.classe_cours where classe_id = p_classe and cours_id <> all (p_cours);
  insert into public.classe_cours (classe_id, cours_id)
    select p_classe, x from (select distinct unnest(p_cours) x) d
  on conflict do nothing;
end $$;

create function public.regenerer_code_classe(p_classe uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v text;
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  v := prive.nouveau_code_classe();
  update public.classe set code = v where id = p_classe;
  return v;
end $$;

-- Pas d'exception pour un code faux : elle annulerait l'enregistrement de l'essai qui sert au frein.
create function public.rejoindre_classe(p_code text) returns table (statut text, classe_nom text)
language plpgsql security definer set search_path = '' as $$
declare
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
  v_classe public.classe;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'acces_refuse';
  end if;
  if (select count(*) from prive.essai_code
       where eleve_id = auth.uid() and essai_le > now() - interval '1 hour') >= 10 then
    return query select 'trop_d_essais'::text, null::text;
    return;
  end if;
  select * into v_classe from public.classe where code = v_code;
  if not found then
    insert into prive.essai_code (eleve_id) values (auth.uid());
    return query select 'code_invalide'::text, null::text;
    return;
  end if;
  insert into public.inscription_classe (classe_id, eleve_id) values (v_classe.id, auth.uid())
  on conflict do nothing;
  if not found then
    return query select 'deja_inscrit'::text, v_classe.nom;
    return;
  end if;
  return query select 'ok'::text, v_classe.nom;
end $$;

create function public.quitter_classe(p_classe uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.inscription_classe where classe_id = p_classe and eleve_id = auth.uid();
  if not found then
    raise exception 'classe_introuvable';
  end if;
end $$;

create function public.retirer_eleve(p_classe uuid, p_eleve uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  delete from public.inscription_classe where classe_id = p_classe and eleve_id = p_eleve;
end $$;

create function public.classes_enseignant()
returns table (id uuid, nom text, code text, filiere_id uuid, niveau_code text, nb_eleves int, cours_ids uuid[], cree_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select c.id, c.nom, c.code::text, c.filiere_id, c.niveau_code,
         (select count(*)::int from public.inscription_classe i where i.classe_id = c.id),
         coalesce((select array_agg(cc.cours_id order by cc.cours_id) from public.classe_cours cc where cc.classe_id = c.id), '{}'),
         c.cree_le
    from public.classe c
   where c.enseignant_id = auth.uid()
   order by c.cree_le desc
$$;

create function public.classes_eleve()
returns table (id uuid, nom text, enseignant_nom text, rejoint_le timestamptz)
language sql stable security definer set search_path = '' as $$
  select c.id, c.nom, p.nom, i.rejoint_le
    from public.inscription_classe i
    join public.classe c on c.id = i.classe_id
    join public.profil p on p.id = c.enseignant_id
   where i.eleve_id = auth.uid()
   order by i.rejoint_le desc
$$;

revoke execute on all functions in schema prive from public, anon, authenticated;
revoke execute on function public.creer_classe(text, uuid, text, uuid[]), public.definir_cours_classe(uuid, uuid[]),
  public.regenerer_code_classe(uuid), public.rejoindre_classe(text), public.quitter_classe(uuid),
  public.retirer_eleve(uuid, uuid), public.classes_enseignant(), public.classes_eleve() from public, anon;
grant execute on function public.creer_classe(text, uuid, text, uuid[]), public.definir_cours_classe(uuid, uuid[]),
  public.regenerer_code_classe(uuid), public.rejoindre_classe(text), public.quitter_classe(uuid),
  public.retirer_eleve(uuid, uuid), public.classes_enseignant(), public.classes_eleve() to authenticated;
```

Note pour l'implémenteur : dans `rejoindre_classe`, la colonne `classe.code` est de type `char(6)`. Comparer `code = v_code` fonctionne, car les espaces de remplissage sont ignorés. Si `found` après un `insert … on conflict do nothing` ne se comporte pas comme attendu, remplacer le test par `get diagnostics v_n = row_count`.

- [ ] **Step 4 : appliquer, tester, types, commit.**

```bash
npm run db:reset && npm run test:db
npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run typecheck
git add supabase src/lib/supabase/types.ts
git commit -m "Ajoute les classes, les codes d'invitation et les inscriptions"
```

---

### Task 5 : suivi enseignant (base)

**Files :**
- Create : `supabase/migrations/20261117000004_suivi_enseignant.sql`, `supabase/tests/suivi_enseignant.test.sql`

**Interfaces :**
- RPC (propriétaire de la classe uniquement, sinon `acces_refuse`) :
  - `suivi_classe(p_classe uuid) → table(eleve_id uuid, nom text, cours_id uuid, cours_titre text, chapitres_valides int, chapitres_total int, note_evaluation numeric, evaluation_validee boolean, essais_evaluation int, derniere_activite timestamptz)`, avec une ligne par élève et par cours de la classe ;
  - `notes_classe(p_classe uuid, p_cours uuid) → table(eleve_id uuid, nom text, chapitre_id uuid, chapitre_numero smallint, chapitre_titre text, meilleure_note numeric, valide boolean)`, avec une ligne par élève et par chapitre publié. Le cours doit appartenir à la classe ;
  - `questions_ratees_classe(p_classe uuid, p_cours uuid, p_limite int default 10) → table(question_id uuid, chapitre_titre text, enonce text, propositions jsonb, bonnes_reponses jsonb, reponses_acceptees text[], reponses int, taux_erreur int)`, avec au moins 5 réponses closes par question.

- [ ] **Step 1 : tests.** `supabase/tests/suivi_enseignant.test.sql` :

```sql
begin;
select plan(9);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000b01', 'prof@test.local'),
  ('00000000-0000-0000-0000-000000000b02', 'autre-prof@test.local'),
  ('00000000-0000-0000-0000-000000000b03', 'dans-classe@test.local'),
  ('00000000-0000-0000-0000-000000000b04', 'hors-classe@test.local');
update public.profil set role = 'enseignant' where id in ('00000000-0000-0000-0000-000000000b01', '00000000-0000-0000-0000-000000000b02');
update public.profil set nom = 'Alix' where id = '00000000-0000-0000-0000-000000000b03';
update public.profil set nom = 'Sam' where id = '00000000-0000-0000-0000-000000000b04';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-000000000b01', 'technologique', 'SUI', 'Filière suivi');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-000000000b01', 'cours-suivi', '10000000-0000-0000-0000-000000000b01', '1re', 'S', 'Cours suivi', true),
  ('20000000-0000-0000-0000-000000000b02', 'cours-hors', '10000000-0000-0000-0000-000000000b01', '1re', 'S', 'Hors classe', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01', 'ch1', 1, 'Un', true),
  ('30000000-0000-0000-0000-000000000b02', '20000000-0000-0000-0000-000000000b01', 'ch2', 2, 'Deux', true);
insert into public.question (id, chapitre_id, type, enonce, propositions, statut) values
  ('40000000-0000-0000-0000-000000000b01', '30000000-0000-0000-0000-000000000b01', 'qcm_unique', 'Question piège', '["a","b"]', 'valide');
insert into public.question_corrige (question_id, bonnes_reponses) values ('40000000-0000-0000-0000-000000000b01', '[1]');
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-000000000b01', '00000000-0000-0000-0000-000000000b01', 'Ma classe', 'ABCDEF');
insert into public.classe_cours values ('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-000000000b01', '00000000-0000-0000-0000-000000000b03');
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide) values
  ('00000000-0000-0000-0000-000000000b03', '30000000-0000-0000-0000-000000000b01', 80, true),
  ('00000000-0000-0000-0000-000000000b04', '30000000-0000-0000-0000-000000000b01', 90, true);
-- 6 réponses closes de l'élève de la classe à la question piège, dont 5 fausses ; 6 de l'élève hors classe, toutes justes.
insert into public.tentative (id, eleve_id, type, cours_id, chapitre_id, nb_questions, statut, fin, note, reussie)
  select ('70000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
         case when i <= 6 then '00000000-0000-0000-0000-000000000b03'::uuid else '00000000-0000-0000-0000-000000000b04'::uuid end,
         'quiz_chapitre', '20000000-0000-0000-0000-000000000b01', '30000000-0000-0000-0000-000000000b01', 1, 'terminee', now(), 0, false
    from generate_series(1, 12) i;
insert into public.tentative_question (tentative_id, ordre, question_id, permutation, reponse, correcte)
  select ('70000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid, 1, '40000000-0000-0000-0000-000000000b01', '{0,1}', '[0]',
         not (i <= 5)
    from generate_series(1, 12) i;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000b01","role":"authenticated"}', true);
select is((select count(*)::int from public.suivi_classe('60000000-0000-0000-0000-000000000b01')), 1, 'une ligne : un élève, un cours de la classe');
select is((select chapitres_valides || '/' || chapitres_total from public.suivi_classe('60000000-0000-0000-0000-000000000b01')), '1/2', 'progression de l''élève');
select is((select count(*)::int from public.notes_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 2, 'notes : un élève × deux chapitres');
select throws_ok($$ select * from public.notes_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b02') $$,
  'P0001', 'cours_invalide', 'un cours hors classe est refusé');
select is((select taux_erreur from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 83,
  'taux d''erreur calculé sur les seuls élèves de la classe (5/6)');
select is((select enonce from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01')), 'Question piège', 'énoncé visible pour l''enseignant');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000b02","role":"authenticated"}', true);
select throws_ok($$ select * from public.suivi_classe('60000000-0000-0000-0000-000000000b01') $$, 'P0001', 'acces_refuse', 'un autre enseignant est refusé');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000b03","role":"authenticated"}', true);
select throws_ok($$ select * from public.questions_ratees_classe('60000000-0000-0000-0000-000000000b01', '20000000-0000-0000-0000-000000000b01') $$,
  'P0001', 'acces_refuse', 'un élève est refusé');
select is((select count(*)::int from public.tentative where eleve_id <> '00000000-0000-0000-0000-000000000b03'), 0,
  'les règles des tentatives restent inchangées : l''élève ne voit que les siennes');

select * from finish();
rollback;
```

- [ ] **Step 2 : lancer.** Expected : FAIL.

- [ ] **Step 3 : migration.**

```sql
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
```

Attention : `prive.est_enseignant_de` doit être appelable depuis ces fonctions. Elles tournent en tant que `postgres`, qui a tous les droits sur `prive`.

- [ ] **Step 4 : appliquer, tester, types, commit.**

```bash
npm run db:reset && npm run test:db
npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run typecheck
git add supabase src/lib/supabase/types.ts
git commit -m "Ajoute le suivi d'une classe par son enseignant"
```

---

### Task 6 : échéances d'évaluation (base)

**Files :**
- Create : `supabase/migrations/20261117000005_echeances.sql`, `supabase/tests/echeances.test.sql`

**Interfaces :**
- Table : `echeance_evaluation(classe_id, cours_id, ouverture timestamptz, limite timestamptz)`, avec une clé étrangère vers `classe_cours`.
- RPC :
  - `definir_echeance(p_classe uuid, p_cours uuid, p_ouverture timestamptz, p_limite timestamptz) → void`. Si les deux dates sont nulles, l'échéance est supprimée.
  - `echeances_classe(p_classe uuid) → table(cours_id uuid, ouverture timestamptz, limite timestamptz)`, réservée au propriétaire.
  - `mes_echeances(p_cours uuid default null) → table(cours_id uuid, classe_nom text, ouverture timestamptz, limite timestamptz)`, pour l'élève.
- Helper : `prive.fenetre_evaluation(p_eleve uuid, p_cours uuid) → text`, qui renvoie `'ok' | 'pas_ouverte' | 'close'`.
- `demarrer_evaluation` est recréée avec la vérification de fenêtre.
- Codes d'erreur : `acces_refuse`, `dates_invalides`, `cours_invalide`, `evaluation_pas_ouverte`, `evaluation_close`.

- [ ] **Step 1 : tests.** `supabase/tests/echeances.test.sql` :

```sql
begin;
select plan(9);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000c01', 'prof@test.local'),
  ('00000000-0000-0000-0000-000000000c02', 'autre-prof@test.local'),
  ('00000000-0000-0000-0000-000000000c03', 'eleve@test.local'),
  ('00000000-0000-0000-0000-000000000c04', 'libre@test.local');
update public.profil set role = 'enseignant' where id in ('00000000-0000-0000-0000-000000000c01', '00000000-0000-0000-0000-000000000c02');
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-000000000c01', 'technologique', 'ECH', 'Filière échéances');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-000000000c01', 'cours-echeance', '10000000-0000-0000-0000-000000000c01', '1re', 'E', 'E', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01', 'ch1', 1, 'Un', true);
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select '30000000-0000-0000-0000-000000000c01', 'qcm_unique', 'Q', '["a","b"]', 'valide', 'ech:' || i from generate_series(1, 20) i;
insert into public.question_corrige (question_id, bonnes_reponses) select id, '[0]' from public.question where source like 'ech:%';
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide) values
  ('00000000-0000-0000-0000-000000000c03', '30000000-0000-0000-0000-000000000c01', 90, true),
  ('00000000-0000-0000-0000-000000000c04', '30000000-0000-0000-0000-000000000c01', 90, true);
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-000000000c01', '00000000-0000-0000-0000-000000000c01', 'Classe', 'BCDEFG');
insert into public.classe_cours values ('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-000000000c01', '00000000-0000-0000-0000-000000000c03');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c02","role":"authenticated"}', true);
select throws_ok($$ select public.definir_echeance('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01', null, now() + interval '1 day') $$,
  'P0001', 'acces_refuse', 'seul le propriétaire fixe une échéance');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c01","role":"authenticated"}', true);
select throws_ok($$ select public.definir_echeance('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01', now() + interval '2 days', now() + interval '1 day') $$,
  'P0001', 'dates_invalides', 'ouverture après la limite refusée');
select lives_ok($$ select public.definir_echeance('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01', now() + interval '1 day', null) $$,
  'ouverture fixée demain');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c03","role":"authenticated"}', true);
select is((select count(*)::int from public.mes_echeances('20000000-0000-0000-0000-000000000c01')), 1, 'l''élève voit l''échéance de sa classe');
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01') $$, 'P0001', 'evaluation_pas_ouverte', 'pas encore ouverte');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c04","role":"authenticated"}', true);
select lives_ok($$ select public.terminer_tentative(public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01')) $$,
  'un élève hors classe n''est pas concerné');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c01","role":"authenticated"}', true);
select lives_ok($$ select public.definir_echeance('60000000-0000-0000-0000-000000000c01', '20000000-0000-0000-0000-000000000c01', null, now() + interval '1 hour') $$,
  'fenêtre ouverte jusqu''à dans une heure');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000c03","role":"authenticated"}', true);
create temporary table e as select public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01') as id;

reset role;
update public.echeance_evaluation set limite = now() - interval '1 minute';
set local role authenticated;
select is(public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01'), (select id from e),
  'une évaluation commencée avant la limite se reprend après');
reset role;
update public.tentative set statut = 'terminee', fin = now() - interval '2 days' where id = (select id from e);
set local role authenticated;
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-000000000c01') $$, 'P0001', 'evaluation_close', 'après la limite');

select * from finish();
rollback;
```

Si la création de la table temporaire `e` sous le rôle `authenticated` est refusée, la créer vide en tant que postgres et l'accorder, comme dans `evaluation.test.sql`.

- [ ] **Step 2 : lancer.** Expected : FAIL.

- [ ] **Step 3 : migration.**

```sql
-- Échéances : date d'ouverture et date limite de l'évaluation, par classe et par cours.

create table public.echeance_evaluation (
  classe_id uuid not null,
  cours_id uuid not null,
  ouverture timestamptz,
  limite timestamptz,
  primary key (classe_id, cours_id),
  foreign key (classe_id, cours_id) references public.classe_cours on delete cascade,
  check (ouverture is null or limite is null or ouverture < limite),
  check (ouverture is not null or limite is not null)
);

alter table public.echeance_evaluation enable row level security;
create policy "échéances de ses classes" on public.echeance_evaluation for select to authenticated
  using (exists (select 1 from public.classe c where c.id = classe_id and c.enseignant_id = (select auth.uid())));
revoke all on public.echeance_evaluation from anon;
revoke insert, update, delete, truncate, references, trigger, maintain on public.echeance_evaluation from authenticated;

create function public.definir_echeance(p_classe uuid, p_cours uuid, p_ouverture timestamptz, p_limite timestamptz) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  if not exists (select 1 from public.classe_cours where classe_id = p_classe and cours_id = p_cours) then
    raise exception 'cours_invalide';
  end if;
  if p_ouverture is not null and p_limite is not null and p_ouverture >= p_limite then
    raise exception 'dates_invalides';
  end if;
  if p_ouverture is null and p_limite is null then
    delete from public.echeance_evaluation where classe_id = p_classe and cours_id = p_cours;
  else
    insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite)
      values (p_classe, p_cours, p_ouverture, p_limite)
    on conflict (classe_id, cours_id) do update set ouverture = excluded.ouverture, limite = excluded.limite;
  end if;
end $$;

create function public.echeances_classe(p_classe uuid)
returns table (cours_id uuid, ouverture timestamptz, limite timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not prive.est_enseignant_de(p_classe) then
    raise exception 'acces_refuse';
  end if;
  return query select e.cours_id, e.ouverture, e.limite from public.echeance_evaluation e where e.classe_id = p_classe;
end $$;

create function public.mes_echeances(p_cours uuid default null)
returns table (cours_id uuid, classe_nom text, ouverture timestamptz, limite timestamptz)
language sql stable security definer set search_path = '' as $$
  select e.cours_id, c.nom, e.ouverture, e.limite
    from public.inscription_classe i
    join public.classe c on c.id = i.classe_id
    join public.echeance_evaluation e on e.classe_id = i.classe_id
   where i.eleve_id = auth.uid() and (p_cours is null or e.cours_id = p_cours)
   order by e.limite nulls last, e.ouverture nulls first
$$;

-- Ouverte si au moins une classe de l'élève liée au cours a une fenêtre ouverte, ou si aucune n'impose de dates.
create function prive.fenetre_evaluation(p_eleve uuid, p_cours uuid) returns text
language sql stable set search_path = '' as $$
  with fenetres as (
    select e.ouverture, e.limite
      from public.inscription_classe i
      join public.echeance_evaluation e on e.classe_id = i.classe_id and e.cours_id = p_cours
     where i.eleve_id = p_eleve
  )
  select case
    when not exists (select 1 from fenetres) then 'ok'
    when exists (select 1 from fenetres where (ouverture is null or ouverture <= now()) and (limite is null or now() <= limite)) then 'ok'
    when exists (select 1 from fenetres where ouverture > now()) then 'pas_ouverte'
    else 'close'
  end
$$;
```

Ensuite, dans la même migration, recréer `public.demarrer_evaluation` avec `create or replace function`. Reprendre le corps **exact** de `supabase/migrations/20261110000005_evaluation.sql` (la seule définition à ce jour), en gardant sa signature, `security definer` et `set search_path = ''`. Insérer le bloc suivant **juste après** le contrôle `evaluation_verrouillee` et **avant** le comptage des essais. La reprise d'une évaluation en cours a lieu plus haut et n'est donc pas concernée.

```sql
  case prive.fenetre_evaluation(auth.uid(), p_cours)
    when 'pas_ouverte' then raise exception 'evaluation_pas_ouverte';
    when 'close' then raise exception 'evaluation_close';
    else null;
  end case;
```

Terminer la migration par :

```sql
revoke execute on all functions in schema prive from public, anon, authenticated;
revoke execute on function public.definir_echeance(uuid, uuid, timestamptz, timestamptz), public.echeances_classe(uuid),
  public.mes_echeances(uuid) from public, anon;
grant execute on function public.definir_echeance(uuid, uuid, timestamptz, timestamptz), public.echeances_classe(uuid),
  public.mes_echeances(uuid) to authenticated;
```

- [ ] **Step 4 : appliquer, tester, types, commit.** Tous les fichiers pgTAP doivent passer, en particulier `evaluation.test.sql`.

```bash
npm run db:reset && npm run test:db
npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run typecheck
git add supabase src/lib/supabase/types.ts
git commit -m "Ajoute les dates d'ouverture et les dates limites des évaluations"
```

---

### Task 7 : couche TypeScript

**Files :**
- Rename : `src/lib/quiz/erreurs.ts` (+ `.test.ts`) devient `src/lib/erreurs.ts` (+ `.test.ts`). Mettre à jour les imports et renommer `messageErreurQuiz` en `messageErreur`.
- Modify : `src/lib/quiz/regles.ts` (+ `.test.ts`), `src/lib/quiz/requetes.ts`, `src/lib/profil/onboarding.ts` (+ `.test.ts`)
- Create : `src/lib/enseignant/csv.ts` (+ `.test.ts`), `src/lib/enseignant/requetes.ts`

**Interfaces :**
- Produces :
  - `messageErreur(message)`, avec les nouveaux codes ;
  - `fenetreEvaluation(echeances: { ouverture: string | null; limite: string | null }[], maintenant: Date) → { etat: 'ok'; limite?: Date } | { etat: 'pas_ouverte'; ouverture: Date } | { etat: 'close'; limite: Date }` ;
  - `etatEvaluation` reçoit `fenetre` en plus. `EtatEvaluation` gagne `{ etat: 'pas_ouverte'; ouverture: Date }` et `{ etat: 'close'; limite: Date }`, et l'état `disponible` gagne `limite?: Date` ;
  - `progressionDuCours` appelle `mes_echeances` ;
  - `lireFormulaireOnboarding(form)` renvoie une union `{ profil: 'eleve', … } | { profil: 'enseignant', nom, etablissement }` ;
  - `notesEnCsv(entree) → string` ;
  - `lireClassesEnseignant()`, `lireClasseEnseignant(id)`, `lireSuiviClasse(id)`, `lireNotesCours(classeId, coursId)`, `lireQuestionsRatees(classeId, coursId)`, `lireClassesEleve()`, `lireCatalogue()`, `lireDemandesEnseignant()`.

- [ ] **Step 1 : tests qui échouent.**

Ajouter à `src/lib/erreurs.test.ts` :

```ts
  it('traduit les codes de l’espace enseignant', () => {
    expect(messageErreur('evaluation_pas_ouverte')).toBe('L’évaluation n’est pas encore ouverte pour ta classe.');
    expect(messageErreur('evaluation_close')).toBe('La date limite de l’évaluation est passée.');
    expect(messageErreur('dates_invalides')).toBe('La date d’ouverture doit être avant la date limite.');
  });
```

Codes à ajouter à `MESSAGES` :

| Code | Message |
|---|---|
| `evaluation_pas_ouverte` | L’évaluation n’est pas encore ouverte pour ta classe. |
| `evaluation_close` | La date limite de l’évaluation est passée. |
| `dates_invalides` | La date d’ouverture doit être avant la date limite. |
| `cours_invalide` | Choisis au moins un cours publié. |
| `nom_invalide` | Le nom de la classe doit faire entre 2 et 60 caractères. |
| `classe_introuvable` | Cette classe est introuvable. |
| `demande_introuvable` | Cette demande a déjà été traitée. |

Ajouter à `src/lib/quiz/regles.test.ts` :

```ts
import { fenetreEvaluation } from './regles';

describe('fenetreEvaluation', () => {
  const m = new Date('2026-11-17T12:00:00Z');
  it('ok sans échéance', () => expect(fenetreEvaluation([], m)).toEqual({ etat: 'ok' }));
  it('pas encore ouverte', () => {
    expect(fenetreEvaluation([{ ouverture: '2026-11-18T08:00:00Z', limite: null }], m))
      .toEqual({ etat: 'pas_ouverte', ouverture: new Date('2026-11-18T08:00:00Z') });
  });
  it('ouverte avec une limite, renvoyée pour l’affichage', () => {
    expect(fenetreEvaluation([{ ouverture: null, limite: '2026-11-20T18:00:00Z' }], m))
      .toEqual({ etat: 'ok', limite: new Date('2026-11-20T18:00:00Z') });
  });
  it('close quand toutes les limites sont passées', () => {
    expect(fenetreEvaluation([{ ouverture: null, limite: '2026-11-10T18:00:00Z' }], m))
      .toEqual({ etat: 'close', limite: new Date('2026-11-10T18:00:00Z') });
  });
  it('ouverte si au moins une classe l’ouvre', () => {
    expect(fenetreEvaluation([
      { ouverture: null, limite: '2026-11-10T18:00:00Z' },
      { ouverture: '2026-11-16T08:00:00Z', limite: null },
    ], m)).toEqual({ etat: 'ok' });
  });
});

describe('etatEvaluation et fenêtre', () => {
  const m = new Date('2026-11-17T12:00:00Z');
  it('pas_ouverte après le verrouillage des chapitres', () => {
    expect(etatEvaluation({ nbChapitres: 2, nbValides: 2, essais: [], maintenant: m,
      fenetre: { etat: 'pas_ouverte', ouverture: new Date('2026-11-18T08:00:00Z') } }))
      .toEqual({ etat: 'pas_ouverte', ouverture: new Date('2026-11-18T08:00:00Z') });
  });
  it('une évaluation en cours prime sur une limite passée', () => {
    expect(etatEvaluation({ nbChapitres: 2, nbValides: 2, essais: [{ id: 'x', statut: 'en_cours', fin: null }], maintenant: m,
      fenetre: { etat: 'close', limite: new Date('2026-11-10T18:00:00Z') } })).toEqual({ etat: 'en_cours', tentativeId: 'x' });
  });
  it('disponible porte la limite', () => {
    expect(etatEvaluation({ nbChapitres: 1, nbValides: 1, essais: [], maintenant: m,
      fenetre: { etat: 'ok', limite: new Date('2026-11-20T18:00:00Z') } }))
      .toEqual({ etat: 'disponible', essaisRestants: 3, limite: new Date('2026-11-20T18:00:00Z') });
  });
});
```

Les tests existants de `etatEvaluation` passent `fenetre: { etat: 'ok' }`. Le paramètre est facultatif et vaut `{ etat: 'ok' }` par défaut, pour ne pas les modifier.

`src/lib/enseignant/csv.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { notesEnCsv } from './csv';

describe('notesEnCsv', () => {
  const entree = {
    chapitres: [{ id: 'c1', numero: 1, titre: 'Organisation' }, { id: 'c2', numero: 2, titre: 'Le « cœur »; ses rôles' }],
    eleves: [
      { id: 'e1', nom: 'Alix', notes: { c1: 80, c2: null }, evaluation: 75.5 },
      { id: 'e2', nom: 'Sam "le grand"', notes: { c1: 66.67, c2: 90 }, evaluation: null },
    ],
  };
  it('écrit un CSV au point-virgule, avec BOM, virgule décimale et champs échappés', () => {
    expect(notesEnCsv(entree)).toBe(
      '﻿Élève;Ch. 1 – Organisation;"Ch. 2 – Le « cœur »; ses rôles";Évaluation\r\n'
      + 'Alix;80;;75,5\r\n'
      + '"Sam ""le grand""";66,67;90;\r\n',
    );
  });
  it('neutralise les formules dans les noms', () => {
    const csv = notesEnCsv({ chapitres: [], eleves: [{ id: 'x', nom: '=HYPERLINK("x")', notes: {}, evaluation: null }] });
    expect(csv.split('\r\n')[1]).toBe('"\'=HYPERLINK(""x"")";');
  });
});
```

Ajouter à `src/lib/profil/onboarding.test.ts` :

```ts
  it('lit un profil enseignant sans filière ni niveau', () => {
    const r = lireFormulaireOnboarding(formulaire({ profil: 'enseignant', nom: 'Camille', etablissement: 'Lycée Pasteur' }));
    expect(r.success && r.data).toEqual({ profil: 'enseignant', nom: 'Camille', etablissement: 'Lycée Pasteur' });
  });
  it('exige l’établissement d’un profil enseignant', () => {
    const r = lireFormulaireOnboarding(formulaire({ profil: 'enseignant', nom: 'Camille', etablissement: '' }));
    expect(r.error?.issues[0].message).toBe('Indique ton établissement.');
  });
```

Les tests élèves existants ajoutent `profil: 'eleve'`. Sans `profil`, le formulaire est lu comme un profil élève, par compatibilité.

- [ ] **Step 2 : lancer.** Run : `npx vitest run src/lib`. Expected : FAIL.

- [ ] **Step 3 : implémenter.**

`src/lib/quiz/regles.ts` :
- ajouter `export type FenetreEvaluation` et `fenetreEvaluation`, selon les tests. Une fenêtre est ouverte si `(ouverture == null || ouverture <= maintenant) && (limite == null || maintenant <= limite)`. Pour `ok`, `limite` vaut la plus lointaine limite parmi les fenêtres ouvertes qui en ont une. Pour `pas_ouverte`, `ouverture` vaut la plus proche ouverture future. Pour `close`, `limite` vaut la plus récente limite passée ;
- dans `etatEvaluation`, l'ordre devient : `en_cours`, `verrouillee`, `pas_ouverte`/`close` (selon `fenetre`), `epuisee`, `attente`, puis `disponible` (avec `limite` si `fenetre.limite`). Cet ordre est celui de `demarrer_evaluation`.

`src/lib/quiz/requetes.ts` :
- dans `progressionDuCours`, ajouter au `Promise.all` l'appel `supabase.rpc('mes_echeances', { p_cours: coursId })` et l'inclure dans la gestion d'erreur ;
- passer `fenetre: fenetreEvaluation(echeances ?? [], new Date())` à `etatEvaluation` ;
- renvoyer aussi `echeances`.

`src/lib/profil/onboarding.ts` :

```ts
const schemaEleve = z.object({
  profil: z.literal('eleve'),
  nom: z.string().trim().min(2, 'Indique ton prénom.').max(60, 'Ton prénom est trop long.'),
  filiereId: z.string().uuid('Choisis ta filière.'),
  niveau: z.enum(NIVEAUX, { message: 'Choisis ton niveau.' }),
  moinsDe15Ans: z.boolean(),
});
const schemaEnseignant = z.object({
  profil: z.literal('enseignant'),
  nom: z.string().trim().min(2, 'Indique ton prénom.').max(60, 'Ton prénom est trop long.'),
  etablissement: z.string().trim().min(2, 'Indique ton établissement.').max(120, 'Le nom de l’établissement est trop long.'),
});
export const schemaOnboarding = z.discriminatedUnion('profil', [schemaEleve, schemaEnseignant]);
export type DonneesOnboarding = z.infer<typeof schemaOnboarding>;

export function lireFormulaireOnboarding(form: FormData) {
  const profil = form.get('profil') === 'enseignant' ? 'enseignant' : 'eleve';
  return profil === 'enseignant'
    ? schemaOnboarding.safeParse({ profil, nom: form.get('nom') ?? '', etablissement: form.get('etablissement') ?? '' })
    : schemaOnboarding.safeParse({
        profil, nom: form.get('nom') ?? '', filiereId: form.get('filiereId') ?? '',
        niveau: form.get('niveau') ?? '', moinsDe15Ans: form.get('moinsDe15Ans') === 'on',
      });
}
```

`src/lib/enseignant/csv.ts` :

```ts
type Entree = {
  chapitres: { id: string; numero: number; titre: string }[];
  eleves: { id: string; nom: string; notes: Record<string, number | null>; evaluation: number | null }[];
};

// Un tableur exécute une cellule qui commence par = + - @ : on la préfixe d'une apostrophe.
function champ(valeur: string): string {
  const sur = /^[=+\-@\t\r]/.test(valeur) ? `'${valeur}` : valeur;
  return /[;"\r\n]/.test(sur) || sur !== valeur ? `"${sur.replace(/"/g, '""')}"` : sur;
}

function note(n: number | null | undefined): string {
  return n == null ? '' : String(Math.round(n * 100) / 100).replace('.', ',');
}

/** CSV lisible par Excel en français : point-virgule, virgule décimale, BOM UTF-8, fins de ligne CRLF. */
export function notesEnCsv({ chapitres, eleves }: Entree): string {
  const entete = ['Élève', ...chapitres.map((c) => `Ch. ${c.numero} – ${c.titre}`), 'Évaluation'].map(champ).join(';');
  const lignes = eleves.map((e) => [champ(e.nom), ...chapitres.map((c) => note(e.notes[c.id])), note(e.evaluation)].join(';'));
  return '﻿' + [entete, ...lignes].map((l) => l + '\r\n').join('');
}
```

Contrôler que le test « neutralise les formules » donne bien `"'=HYPERLINK(""x"")";`. Le champ est entre guillemets parce qu'il a été modifié. La ligne n'a pas de colonne de chapitre : elle contient le nom, puis une évaluation vide.

`src/lib/enseignant/requetes.ts`. Toutes les fonctions lèvent une `Error` en français en cas d'erreur Supabase, et `lireClasseEnseignant` renvoie `null` si la classe est introuvable.

```ts
import { cache } from 'react';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';

const estUuid = (id: string) => z.string().uuid().safeParse(id).success;

export const lireClassesEnseignant = cache(async () => {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('classes_enseignant');
  if (error) throw new Error('Impossible de charger tes classes.');
  return data ?? [];
});

export const lireClasseEnseignant = cache(async (id: string) => {
  if (!estUuid(id)) return null;
  const classes = await lireClassesEnseignant();
  return classes.find((c) => c.id === id) ?? null;
});

export async function lireSuiviClasse(id: string) {
  const supabase = await creerClientServeur();
  const [suivi, echeances] = await Promise.all([
    supabase.rpc('suivi_classe', { p_classe: id }),
    supabase.rpc('echeances_classe', { p_classe: id }),
  ]);
  if (suivi.error || echeances.error) throw new Error('Impossible de charger le suivi de la classe.');
  return { suivi: suivi.data ?? [], echeances: echeances.data ?? [] };
}

export async function lireNotesCours(classeId: string, coursId: string) {
  const supabase = await creerClientServeur();
  const [notes, ratees] = await Promise.all([
    supabase.rpc('notes_classe', { p_classe: classeId, p_cours: coursId }),
    supabase.rpc('questions_ratees_classe', { p_classe: classeId, p_cours: coursId, p_limite: 10 }),
  ]);
  if (notes.error || ratees.error) throw new Error('Impossible de charger les notes.');
  return { notes: notes.data ?? [], ratees: ratees.data ?? [] };
}

export async function lireClassesEleve() {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('classes_eleve');
  if (error) throw new Error('Impossible de charger tes classes.');
  return data ?? [];
}

export async function lireCatalogue() {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.from('cours')
    .select('id, slug, titre, matiere, couleur, niveau_code, filiere(code, nom, ordre), chapitre(count)')
    .eq('publie', true).order('ordre');
  if (error) throw new Error('Impossible de charger le catalogue.');
  return (data ?? []).map((c) => ({ ...c, nbChapitres: c.chapitre[0]?.count ?? 0 }));
}

export async function lireDemandesEnseignant() {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('demandes_enseignant');
  if (error) throw new Error('Impossible de charger les demandes.');
  return data ?? [];
}
```

- [ ] **Step 4 : vérifier et commit.**

```bash
npm test && npm run typecheck && npm run build
git add src
git commit -m "Ajoute la fenêtre d'évaluation, le CSV des notes et les lectures de l'espace enseignant"
```

---

### Task 8 : inscription enseignant, page d'attente, administration

**Files :**
- Modify : `src/app/bienvenue/FormulaireBienvenue.tsx`, `src/app/bienvenue/actions.ts`, `src/app/(app)/layout.tsx`, `src/app/(app)/page.tsx`, `src/components/EnTete.tsx`, `README.md`
- Create : `src/components/AttenteValidation.tsx`, `src/app/(app)/cours/page.tsx`, `src/app/(app)/admin/enseignants/page.tsx`, `src/app/(app)/admin/enseignants/actions.ts`, `src/styles/enseignant.css` (importé dans `globals.css`)

**Interfaces :**
- Consumes : `lireFormulaireOnboarding` (union), `lireProfil`, `lireCatalogue`, `lireDemandesEnseignant`, `messageErreur`.
- Produces : `EnTete({ prenom, role })`, la route `/cours` (catalogue), la route `/admin/enseignants`, et l'action `traiterDemande(_, form)`.

- [ ] **Step 1 : formulaire de bienvenue.** En tête du formulaire, ajouter un `fieldset` « Tu es… » avec deux radios `profil` : « Je suis élève » (`eleve`) et « J’enseigne » (`enseignant`).
  - Les champs élève (filière, niveau, moins de 15 ans) s'affichent si `profil = eleve`. Pour un enseignant, on affiche à la place un champ « Ton établissement » (`etablissement`).
  - Le basculement se fait côté client avec un état local.
  - Les champs masqués ne sont pas `required`. Ajouter `disabled` sur les champs masqués pour qu'ils ne soient pas envoyés.
  - Les valeurs renvoyées en cas d'erreur incluent `profil` et `etablissement`.

Dans `terminerOnboarding` :
- si `r.data.profil === 'enseignant'`, mettre à jour `nom`, `etablissement`, `demande_enseignant: true`, `onboarding_termine: true` ;
- sinon, garder le chemin élève actuel.

- [ ] **Step 2 : page d'attente.** `src/components/AttenteValidation.tsx` :

```tsx
export function AttenteValidation({ prenom }: { prenom: string | null }) {
  return (
    <section className="carte attente-validation" aria-labelledby="titre-attente">
      <h1 id="titre-attente">Merci{prenom ? ` ${prenom}` : ''} !</h1>
      <p>Ta demande de compte enseignant est en cours de vérification. Tu recevras l’accès à ton espace dès qu’elle sera validée.</p>
      <p className="vide">En attendant, tu peux te déconnecter et revenir plus tard.</p>
    </section>
  );
}
```

Dans `src/app/(app)/layout.tsx`, après la vérification de l'onboarding, si `profil.role === 'eleve' && profil.demande_enseignant`, rendre l'en-tête suivi de `<main className="conteneur"><AttenteValidation prenom={profil.nom} /></main>`, à la place des enfants et sans bannière d'essai. `lireProfil` sélectionne `demande_enseignant` en plus des colonnes actuelles.

- [ ] **Step 3 : navigation selon le rôle.** `EnTete` reçoit `role` :
  - élève : « Mes cours » (`/`) et « Mes classes » (`/classes`) ;
  - enseignant : « Mes classes » (`/enseignant`) et « Cours » (`/cours`) ;
  - admin_contenu : « Cours » (`/cours`) et « Demandes » (`/admin/enseignants`).
  - Sur mobile, la nav est déjà masquée sous 520 px : la remplacer par une nav compacte qui reste visible, avec des liens de 44 px au minimum et un défilement horizontal si nécessaire, pour que ces liens restent accessibles.

`src/app/(app)/page.tsx` : si le profil est `enseignant`, `redirect('/enseignant')`. Si c'est un `admin_contenu`, `redirect('/cours')`. Lire le profil avec `lireProfil`, avant le reste, et hors de tout try.

- [ ] **Step 4 : catalogue.** `src/app/(app)/cours/page.tsx` : réservé aux rôles `enseignant` et `admin_contenu` (sinon `redirect('/')`). La page liste les cours publiés groupés par filière, puis par niveau, avec `CarteCours` et `nbValides = 0`. Titre : « Catalogue des cours ».

- [ ] **Step 5 : administration des demandes.** `src/app/(app)/admin/enseignants/actions.ts` :

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';

export type EtatDemande = { erreur?: string; info?: string };

export async function traiterDemande(_: EtatDemande, form: FormData): Promise<EtatDemande> {
  const r = z.object({ profil: z.string().uuid(), decision: z.enum(['accepter', 'refuser']) })
    .safeParse({ profil: form.get('profil'), decision: form.get('decision') });
  if (!r.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('traiter_demande_enseignant', { p_profil: r.data.profil, p_accepter: r.data.decision === 'accepter' });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/admin/enseignants');
  return { info: r.data.decision === 'accepter' ? 'Compte enseignant validé.' : 'Demande refusée.' };
}
```

La page `/admin/enseignants` est réservée aux `admin_contenu` (sinon `notFound()`). Elle liste les demandes : nom, e-mail, établissement, date. Chaque ligne porte un petit formulaire client avec deux boutons `name="decision"`, « Valider » et « Refuser », qui utilise `useActionState(traiterDemande)`. Si la liste est vide : « Aucune demande en attente. »

- [ ] **Step 6 : README.** Ajouter une section « Rôles ». Elle doit expliquer comment désigner le premier administrateur du contenu, avec cette commande à lancer sur la base (en local : `docker exec supabase_db_app-lycee psql -U postgres`) :

```sql
update public.profil set role = 'admin_contenu' where email = 'ton.adresse@exemple.fr';
```

Elle doit aussi préciser que cet administrateur valide ensuite les comptes enseignants sur `/admin/enseignants`.

- [ ] **Step 7 : vérifier.** Run : `npm test && npm run typecheck && npm run build && npm run lint && npm run e2e`. Expected : PASS. Les tests existants passent par le profil élève : ajouter `await page.getByLabel('Je suis élève').check()` dans `terminerBienvenue` si le choix n'a pas de valeur par défaut. Il vaut mieux que « Je suis élève » soit coché par défaut.

Vérification visuelle avec un script jetable, à ne pas commiter :
- `/bienvenue` en mode élève puis en mode enseignant, à 375 px ;
- la page d'attente ;
- `/admin/enseignants`, avec une demande, pour un compte passé `admin_contenu` par la clé service_role.

- [ ] **Step 8 : commit.**

```bash
git add src README.md
git commit -m "Ajoute l'inscription enseignant, la page d'attente et la validation des demandes"
```

---

### Task 9 : élève — mes classes et échéances

**Files :**
- Create : `src/app/(app)/classes/page.tsx`, `src/app/(app)/classes/actions.ts`, `src/components/FormulaireRejoindre.tsx`
- Modify : `src/components/CarteEvaluation.tsx`, `src/app/(app)/cours/[slug]/evaluation/page.tsx`, `src/lib/erreurs.ts` (messages des statuts)

**Interfaces :**
- Produces : les actions `rejoindreClasse(_, form)` et `quitterClasse(form)`, et la route `/classes`.

- [ ] **Step 1 : actions.** `src/app/(app)/classes/actions.ts` :

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';

export type EtatRejoindre = { erreur?: string; info?: string; code?: string };

const MESSAGES_STATUT: Record<string, string> = {
  code_invalide: 'Ce code ne correspond à aucune classe. Vérifie-le auprès de ton enseignant.',
  trop_d_essais: 'Trop de codes incorrects. Réessaie dans une heure.',
};

export async function rejoindreClasse(_: EtatRejoindre, form: FormData): Promise<EtatRejoindre> {
  const code = String(form.get('code') ?? '');
  if (!/^[A-Za-z0-9\s]{6,12}$/.test(code)) return { erreur: 'Le code fait 6 caractères.', code };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('rejoindre_classe', { p_code: code });
  if (error) return { erreur: messageErreur(error.message), code };
  const r = data?.[0];
  if (!r) return { erreur: messageErreur(undefined), code };
  if (r.statut === 'ok' || r.statut === 'deja_inscrit') {
    revalidatePath('/classes');
    return { info: r.statut === 'ok' ? `Tu as rejoint « ${r.classe_nom} ».` : `Tu fais déjà partie de « ${r.classe_nom} ».` };
  }
  return { erreur: MESSAGES_STATUT[r.statut] ?? messageErreur(undefined), code };
}

export async function quitterClasse(form: FormData) {
  const id = z.string().uuid().safeParse(form.get('classe'));
  if (!id.success) return;
  const supabase = await creerClientServeur();
  await supabase.rpc('quitter_classe', { p_classe: id.data });
  revalidatePath('/classes');
}
```

- [ ] **Step 2 : page.** `/classes` est réservée aux élèves : sinon, `redirect('/')`. Elle contient :
  - le titre « Mes classes » ;
  - le formulaire « Rejoindre une classe », avec un champ « Code de la classe » (`autoComplete="off"`, `autoCapitalize="characters"`, `inputMode="text"`, `maxLength={12}`) et le bouton « Rejoindre » ;
  - la liste des classes : nom, enseignant, date d'arrivée. Chaque ligne a un bouton « Quitter », avec une confirmation côté client (« Quitter cette classe ? Ton enseignant ne verra plus ta progression. ») ;
  - un texte d'information : « Ton enseignant voit ta progression et tes notes pour les cours de la classe. Il ne voit ni tes réponses détaillées ni ton calendrier. »
  - Si `?code=` est présent dans l'URL, pré-remplir le champ, pour qu'un lien partagé par l'enseignant fonctionne.

- [ ] **Step 3 : échéances.** `CarteEvaluation` gère deux nouveaux états :
  - `pas_ouverte` : « 🔒 Ouverture le {date} » (date et heure à Paris) ;
  - `close` : « La date limite était le {date}. »

  L'état `disponible` affiche « À passer avant le {date} » quand une `limite` est fournie. Les emojis sont dans `aria-hidden`.

  La page `/cours/[slug]/evaluation` montre la même information dans la carte des règles quand des échéances existent. Elle liste les classes concernées, par exemple « Classe 1re ST2S B : avant le 20 novembre, 18:00 ».

- [ ] **Step 4 : vérifier.** Run : `npm test && npm run typecheck && npm run build && npm run lint`. Faire une vérification visuelle avec un script jetable : un élève rejoint une classe créée par la clé service_role, avec une échéance, puis on prend une capture de `/classes` et de la carte d'évaluation à 375 px.

- [ ] **Step 5 : commit.**

```bash
git add src
git commit -m "Ajoute la page Mes classes et l'affichage des échéances d'évaluation"
```

---

### Task 10 : enseignant — classes

**Files :**
- Create : `src/app/(app)/enseignant/page.tsx`, `src/app/(app)/enseignant/actions.ts`, `src/app/(app)/enseignant/classes/[id]/page.tsx`, `src/components/FormulaireClasse.tsx`, `src/components/FormulaireEcheance.tsx`, `src/components/CodeClasse.tsx`
- Modify : `src/styles/enseignant.css`

**Interfaces :**
- Produces :
  - actions `creerClasse(_, form)`, `regenererCode(form)`, `definirCours(_, form)`, `definirEcheance(_, form)`, `retirerEleve(form)` ;
  - routes `/enseignant` et `/enseignant/classes/[id]`.

Charger **frontend-design** et **ui-ux-pro-max**. Ces pages servent sur ordinateur autant que sur mobile, avec des tableaux lisibles qui défilent horizontalement sur mobile.

- [ ] **Step 1 : garde de rôle.** Chaque page `/enseignant/*` vérifie `lireProfil()?.role === 'enseignant'`, sinon `notFound()`. Factoriser cette vérification dans `src/lib/enseignant/garde.ts` (`exigerEnseignant()`), appelée hors de tout try.

- [ ] **Step 2 : actions.** `src/app/(app)/enseignant/actions.ts`. Toutes les entrées passent par zod. Les erreurs sont traduites avec `messageErreur`. On revalide la page concernée.
  - `creerClasse` : `nom` (2 à 60 caractères), `filiereId` (uuid facultatif), `niveau` (facultatif, parmi `NIVEAUX`), `cours` (`form.getAll('cours')`, au moins un uuid). Appelle `creer_classe`, puis `redirect('/enseignant/classes/' + id)`.
  - `regenererCode` : l'id de la classe. Appelle `regenerer_code_classe`.
  - `definirCours` : l'id de la classe et `cours[]`. Appelle `definir_cours_classe`.
  - `definirEcheance` : l'id de la classe, l'id du cours, `ouverture` et `limite` (`datetime-local`, interprétées à l'heure de Paris, vides = null). Appelle `definir_echeance`. La conversion depuis `datetime-local` est une fonction pure `heureParisVersIso(valeur: string): string | null` dans `src/lib/enseignant/dates.ts`, testée : `'2026-11-20T18:00'` en hiver donne `'2026-11-20T17:00:00.000Z'`, et `'2026-06-20T18:00'` en été donne `'2026-06-20T16:00:00.000Z'`. Utiliser `Intl.DateTimeFormat` pour le décalage. Aucune bibliothèque.
  - `retirerEleve` : l'id de la classe et l'id de l'élève. Appelle `retirer_eleve`.

- [ ] **Step 3 : page `/enseignant`.**
  - Titre « Mes classes ».
  - Pour chaque classe, une carte : nom, nombre d'élèves, code bien visible, cours. Un lien mène à la classe.
  - Formulaire « Créer une classe » : nom, filière (`select` facultatif), niveau (facultatif), cours (cases à cocher depuis `lireCatalogue()`, groupées par filière). Le bouton est « Créer la classe ».
  - Si l'enseignant n'a aucune classe : « Crée ta première classe, puis donne son code à tes élèves. »

- [ ] **Step 4 : page `/enseignant/classes/[id]`.** Si `lireClasseEnseignant(id)` vaut null : `notFound()`.
  - **Code** : `CodeClasse` est un composant client. Il affiche le code en grand, en `font-variant-numeric: tabular-nums` et en espacement large, avec un bouton « Copier le lien d’invitation » qui copie `${origin}/classes?code=XXXXXX`. Un retour « Lien copié » s'annonce dans un `role="status"`. Un bouton « Nouveau code » ouvre une confirmation (« L’ancien code ne fonctionnera plus. »).
  - **Élèves** : un tableau issu de `lireSuiviClasse`, avec une ligne par élève et un groupe de colonnes par cours. Les colonnes sont : chapitres validés (`n / N`, avec une petite `BarreProgression`), note d'évaluation (`formaterNote`, ou « — »), essais, dernière activité (date courte). Un bouton « Retirer » demande confirmation. Le tableau est un vrai `<table>` avec `<caption>`, `<th scope>` et un conteneur à défilement horizontal.
  - Pour chaque cours, un lien « Notes et questions ratées » mène à `/enseignant/classes/[id]/cours/[coursId]`.
  - **Cours de la classe** : un formulaire `definirCours` avec des cases à cocher.
  - **Échéances** : pour chaque cours, `FormulaireEcheance`, avec deux champs `datetime-local` (« Ouverture », « Date limite ») pré-remplis à l'heure de Paris et un bouton « Enregistrer ». Laisser les deux champs vides supprime l'échéance. Une aide l'indique : « Laisse les deux champs vides pour retirer l’échéance. »
  - S'il n'y a aucun élève : « Aucun élève pour l’instant. Partage le code {code} ou le lien d’invitation. »

- [ ] **Step 5 : vérifier.**
  - Lancer `npm test && npm run typecheck && npm run build && npm run lint`.
  - Faire une vérification visuelle avec un script jetable : un enseignant (rôle mis par service_role) crée une classe, un élève la rejoint, l'enseignant fixe une échéance. Prendre des captures de `/enseignant` et de la page de la classe à 375 et 1280 px, en clair et en sombre.
  - Vérifier qu'aucune page ne déborde horizontalement à 375 px. Seuls les tableaux défilent dans leur conteneur.

- [ ] **Step 6 : commit.**

```bash
git add src
git commit -m "Ajoute la gestion des classes par l'enseignant"
```

---

### Task 11 : enseignant — suivi par cours et export CSV

**Files :**
- Create : `src/app/(app)/enseignant/classes/[id]/cours/[coursId]/page.tsx`, `src/app/(app)/enseignant/classes/[id]/cours/[coursId]/export/route.ts`
- Modify : `src/styles/enseignant.css`

**Interfaces :**
- Consumes : `exigerEnseignant`, `lireClasseEnseignant`, `lireNotesCours`, `lireSuiviClasse`, `notesEnCsv`, `texteReponse`, `formaterNote`, `SEUIL_REUSSITE`.

Charger **dataviz** et **frontend-design**.

- [ ] **Step 1 : page de suivi.**
  - **Accès** : rôle enseignant requis. Si la classe est introuvable, ou si `coursId` n'est pas un uuid de `classe.cours_ids`, la page renvoie `notFound()`.
  - **Titre** : « {cours} — {classe} ».
  - **Tableau des notes** : une ligne par élève, une colonne par chapitre (« Ch. n »), plus une colonne « Évaluation ». Chaque cellule affiche la note, ou « — » si l'élève n'en a pas. On colore la cellule selon le seuil : validé ou non validé. La couleur s'accompagne toujours d'un indicateur textuel, ✓ pour un chapitre validé. Le contraste respecte le minimum de 4,5:1.
  - **Moyenne de la classe par chapitre** : affichée en pied de tableau, sur les élèves qui ont une note.
  - **Questions les plus ratées** : une liste avec, pour chaque question, le chapitre, l'énoncé, le taux d'erreur (avec une barre horizontale) et le nombre de réponses. La bonne réponse se trouve dans un `<details>` « Voir la bonne réponse ». Elle est rédigée avec `texteReponse` sur les propositions dans l'ordre d'origine, ou affiche les réponses acceptées pour une question à réponse courte. S'il n'y en a pas : « Pas encore assez de réponses (au moins 5 par question). »
  - **Bouton « Exporter les notes (CSV) »** : un lien vers la route d'export, avec l'attribut `download`.
- [ ] **Step 2 : route d'export.** `export/route.ts` (GET) :
  - vérifie le rôle et la classe comme la page. Sinon, répond 404 ;
  - lit `lireNotesCours` et `lireSuiviClasse` (pour la note d'évaluation de ce cours), puis construit l'entrée de `notesEnCsv` ;
  - répond avec `content-type: text/csv; charset=utf-8`, `content-disposition: attachment; filename="notes-{slug-classe}-{slug-cours}.csv"` et `cache-control: no-store`.

  Le nom de fichier est fabriqué à partir de `nom` en minuscules, sans accents. Seuls les caractères `[a-z0-9-]` sont gardés.

- [ ] **Step 3 : vérifier.**
  - Lancer `npm test && npm run typecheck && npm run build && npm run lint`.
  - Faire la vérification visuelle avec le script de la Task 10, étendu :
    1. l'élève fait deux quiz en ratant volontairement, grâce aux réponses lues par service_role ;
    2. capturer la page de suivi à 375 et 1280 px ;
    3. télécharger le CSV avec Playwright (`page.waitForEvent('download')`) et vérifier son en-tête et la ligne de l'élève.

- [ ] **Step 4 : commit.**

```bash
git add src
git commit -m "Ajoute le suivi des notes par cours, les questions ratées et l'export CSV"
```

---

### Task 12 : parcours de bout en bout et revue

**Files :**
- Create : `e2e/enseignant.spec.ts`
- Modify : `e2e/aide-db.ts` (nouvelles aides), `README.md`

- [ ] **Step 1 : aides.** Dans `e2e/aide-db.ts`, garde « base locale » comprise, ajouter :
  - `rendreAdmin(email)` : passe le profil à `admin_contenu` ;
  - `idProfil(email)`.

- [ ] **Step 2 : scénario complet.** `e2e/enseignant.spec.ts`, en un seul test séquentiel avec `test.setTimeout(240_000)`. Chaque acteur a son propre `browser.newContext()`.
  1. Une personne s'inscrit et choisit « J’enseigne » avec un établissement. La page d'attente s'affiche.
  2. Un admin (compte créé par le test, puis `rendreAdmin`) ouvre `/admin/enseignants` et clique sur « Valider » sur la demande.
  3. L'enseignant recharge, arrive sur `/enseignant` et crée la classe « 1re ST2S test » avec le cours BPH. Il lit le code affiché.
  4. Un élève s'inscrit, va sur `/classes`, saisit d'abord un code faux (message d'erreur), puis le bon code en minuscules. Le message « Tu as rejoint » s'affiche.
  5. L'élève fait le quiz de ch1 en répondant juste (`repondreJuste`).
  6. L'enseignant ouvre la classe : la ligne de l'élève affiche « 1 / 7 ». Il ouvre le suivi BPH : la note de Ch. 1 est 100 %. Il télécharge le CSV et vérifie que l'en-tête commence par `Élève;Ch. 1` et que la ligne de l'élève contient `;100;`.
  7. L'enseignant fixe une date limite passée sur BPH, avec une ouverture vide et une limite à hier 18:00. L'élève, après validation de ses chapitres par `validerTousLesChapitres`, voit « La date limite était le » sur la carte d'évaluation, et la page d'évaluation ne propose pas de bouton de démarrage.
  8. L'enseignant retire l'élève. Sur `/classes`, l'élève ne voit plus la classe.
- [ ] **Step 3 : lancer toute la chaîne.** Run : `npm run db:reset && npm test && npm run test:db && npm run typecheck && npm run lint && npm run e2e`, deux fois pour l'e2e. Expected : tout passe sur les deux projets, et le port 3000 est libre à la fin.

- [ ] **Step 4 : README.** Compléter la section « Rôles » :
  - le parcours enseignant : demande, validation, classes, code, suivi, export ;
  - ce qu'un enseignant voit : la progression et les notes ;
  - ce qu'il ne voit pas : les réponses détaillées, le calendrier, l'abonnement.

- [ ] **Step 5 : commit.**

```bash
git add e2e README.md
git commit -m "Ajoute le parcours de bout en bout de l'espace enseignant"
```

- [ ] **Step 6 : revue de fin d'étape (Opus).** Lancer d'abord **security-review**, centré sur :
  - l'isolation entre enseignants et classes, et entre élèves ;
  - les codes d'invitation : force et frein contre les essais au hasard ;
  - les RPC `security definer` : propriété, `search_path`, EXECUTE ;
  - la recréation de `demarrer_evaluation` ;
  - l'export CSV : injection de formules et en-têtes HTTP.

  Lancer ensuite **design:accessibility-review** sur les tableaux et formulaires de l'enseignant, puis **superpowers:requesting-code-review**. Corriger les points bloquants.

- [ ] **Step 7 : vérification finale.** Suivre **superpowers:verification-before-completion** : relancer la chaîne du Step 3 et `npm run build`, puis rédiger le bilan de l'étape 3a.
