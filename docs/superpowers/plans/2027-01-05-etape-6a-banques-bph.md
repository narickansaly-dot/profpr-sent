# Étape 6a : banques de questions BPH — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** porter chacun des 7 chapitres du cours BPH (1re ST2S) à environ 150 questions. Les 910 nouvelles questions sont contrôlées automatiquement, relues par l'IA contre le cours, puis importées au statut « à relire ». L'enseignant les valide en lot dans l'admin.

**Architecture :**
- **Outils** :
  - une option d'import `--garder-statuts`, portée par `prive.ecrire_question` pour que le versionnage reste juste ;
  - une RPC `changer_statut_questions` (statut en lot) ;
  - un mode relecture dans l'admin ;
  - trois scripts de contenu : `texte-chapitre`, `verifier-banque` et `fusionner-banque`, dont la logique pure est testée dans `src/lib/contenu/banque/`.
- **Contenu** : un fichier de travail par chapitre (`contenu/1re-st2s/banques/bph-chN.json`), contrôlé, relu, puis fusionné dans `bph.json`, qui reste la seule source de vérité.

**Tech Stack :** Next.js 16, React 19, TypeScript, zod 4, Supabase (Postgres 17, plpgsql), tsx, Vitest, pgTAP, Playwright.

**Spec :** `docs/superpowers/specs/2027-01-05-etape-6a-banques-bph-design.md`. Le guide des auteurs `docs/guide-auteurs.md` reste la référence du format.

**Branche :** `etape-6a-banques-bph`, créée depuis `etape-5b-parents`. Sa PR visera `etape-5b-parents` (PR n° 9).

## Décisions prises dans ce plan

1. **`--garder-statuts` est appliqué en base, pas dans le script.** Le script ajoute `"garder_statut": true` à chaque question envoyée à `importer_cours`, et `prive.ecrire_question` en tient compte. Conserver le statut dans le script seul rendrait `valide` une nouvelle version créée par un changement de structure. Or la spec exige qu'elle reparte en `a_relire`. La règle en base est la suivante :
   - question existante au statut `valide`, structure inchangée : le statut `valide` est conservé ;
   - structure changée : nouvelle version en `a_relire` ;
   - sans `garder_statut`, rien ne change.
2. **Fichier de travail** : `{ "chapitre": N, "notions": [ … ], "questions": [ … ] }`. La spec parle d'un fichier qui ne contient que les questions. La liste fermée des notions (§ 3 de la spec) doit cependant vivre quelque part pour être contrôlée : elle est rangée dans ce même fichier. La fusion n'en copie que les questions.
3. **Biais de longueur** : mesuré sur les `qcm_unique`, où la « bonne réponse » est unique. Mesure : la bonne proposition est strictement la plus longue dans moins de 40 % des `qcm_unique` du fichier.
4. **Similarité** : coefficient de Jaccard sur les trigrammes de caractères des énoncés normalisés (minuscules, accents retirés, ponctuation et espaces multiples réduits à un espace). Une paire au-delà de 0,8 est signalée, entre nouvelles questions et avec les questions existantes du chapitre dans `bph.json`.
5. **Rédaction et relecture** : la rédaction d'un chapitre est confiée à un sous-agent **Sonnet**, et la relecture contre le cours à un sous-agent **Opus** (répartition de la feuille de route). Le contrôleur ne rédige pas de questions lui-même.
6. **Arrêt après le chapitre 1** : la tâche 5 se termine par un arrêt explicite. L'utilisateur relit le chapitre 1 dans l'admin, et ses remarques sont reportées au § 3 de la spec avant la tâche 6.

## Contraintes globales

- **Interface** : toute l'interface est en français. On tutoie l'élève et l'administrateur (comme les écrans admin existants), on vouvoie le parent. Formulations non genrées.
- **Typographie** : espace insécable U+00A0 avant « : ; ! ? » et à l'intérieur de « », y compris dans le texte des questions. On écrit ` ` dans les chaînes TypeScript et `&nbsp;` en JSX. Les textes produits en SQL évitent ces signes.
- **Base de données** :
  - écritures uniquement par RPC `security definer`, avec `set search_path = ''` et des noms qualifiés ;
  - `revoke execute … from public, anon` puis `grant execute … to authenticated` ;
  - les helpers vont dans `prive`, avec `revoke execute … from public`.
- **Fonctions existantes** : lors d'un `create or replace`, recopier le **corps actuel** depuis la migration la plus récente qui la définit, avec ses attributs et ses droits. N'ajouter que le changement décrit.
- **Codes d'erreur** : mots-clés `snake_case`, traduits dans `src/lib/erreurs.ts` avec un test du texte exact. Aucun nouveau code n'est sous-chaîne d'un code existant, ni l'inverse.
- **Tests pgTAP** : un test ne compte que ses propres lignes, avec ses propres UUID.
- **Commandes shell** : les préfixer par `export PATH="$HOME/.orbstack/bin:$PATH";`, et les commandes git par `DEVELOPER_DIR=/Library/Developer/CommandLineTools`. Ne jamais afficher ni commiter `.env.local`. La clé de service n'est utilisée que dans `scripts/` et les aides e2e, derrière la garde « base locale ».
- **Après chaque migration** : `npm run db:reset`, puis `npx supabase gen types typescript --local > src/lib/supabase/types.ts`.
- **CSP et accessibilité** : la CSP stricte reste en place (`e2e/securite.spec.ts`). Toute page modifiée passe la revue axe (`e2e/accessibilite.spec.ts`) et reste utilisable à 375 px.
- **Commits** : messages en français, à l'impératif présent, terminés exactement par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Règles de rédaction** : celles du § 3 de la spec, avec leurs valeurs exactes :
  - types 65 / 26 / 26 / 13 et difficultés 52 / 52 / 26, à plus ou moins 3 près ;
  - clé `bph:chN:banque:NNN` ;
  - explication et notion obligatoires ;
  - 4 propositions ; `qcm_multiple` avec 2 à 3 bonnes réponses et la mention « Coche toutes les réponses exactes. » ;
  - interdits : « toutes les réponses ci-dessus », « aucune des réponses », négations piège, réponse lisible dans l'énoncé, phrase du cours recopiée en entier comme bonne réponse.

## Hors périmètre

- Les autres matières de 1re ST2S : étape 6b.
- La modification des 140 questions existantes.
- La validation finale des questions, faite par l'enseignant à son rythme.

## Répartition des modèles

| Tâche | Implémentation | Revue |
|---|---|---|
| 1 Import : garder les statuts validés | Sonnet | **Opus** |
| 2 RPC de statut en lot | Sonnet | **Opus** |
| 3 Admin : mode relecture | Sonnet | Sonnet |
| 4 Scripts de banque (texte, vérification, fusion) | Sonnet | Sonnet |
| 5 Chapitre 1, puis arrêt pour relecture | Sonnet rédige, **Opus** relit | contrôles + revue Sonnet |
| 6 à 11 Chapitres 2 à 7 | Sonnet rédige, **Opus** relit | contrôles + revue Sonnet |
| 12 Bilan, revue finale | Sonnet, puis revue finale **Opus** | — |

Les tâches 1 et 2 touchent la base locale partagée : elles s'exécutent l'une après l'autre.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `supabase/migrations/20270105000001_garder_statuts.sql` + `supabase/tests/garder_statuts.test.sql` | `prive.ecrire_question` avec `garder_statut` |
| `src/lib/contenu/donnees-question.ts` (+ test), `scripts/importer-contenu.ts`, `docs/guide-auteurs.md` | option `--garder-statuts` |
| `supabase/migrations/20270105000002_statut_en_lot.sql` + `supabase/tests/statut_en_lot.test.sql` | `changer_statut_questions` |
| `src/app/(app)/admin/chapitres/[id]/questions/page.tsx`, `src/app/(app)/admin/questions/actions.ts`, `src/components/admin/RelectureQuestions.tsx`, `src/lib/admin/relecture.ts` (+ test) | mode relecture |
| `src/lib/contenu/banque/*.ts` (+ tests), `scripts/texte-chapitre.ts`, `scripts/verifier-banque.ts`, `scripts/fusionner-banque.ts`, `package.json` | outils de banque |
| `contenu/1re-st2s/banques/bph-chN.json`, `bph-chN-relecture.md`, `contenu/1re-st2s/bph.json` | contenu |
| `e2e/relecture.spec.ts`, `e2e/accessibilite.spec.ts`, `e2e/securite.spec.ts` | bout en bout |

---

### Task 1 : import — garder les statuts validés

**Files :**
- Create : `supabase/migrations/20270105000001_garder_statuts.sql`, `supabase/tests/garder_statuts.test.sql`
- Modify : `src/lib/contenu/donnees-question.ts` (+ son test), `scripts/importer-contenu.ts`, `docs/guide-auteurs.md` (partie 6 « Import »), `src/lib/supabase/types.ts`

**Interfaces :**
- Consumes :
  - `prive.ecrire_question(p_chapitre uuid, p_question uuid, p jsonb, p_editeur boolean default false, out id_question uuid, out resultat text)`, corps actuel dans `supabase/migrations/20261124000003_ecriture_questions.sql`. Vérifier par `grep -l "function prive.ecrire_question" supabase/migrations/*.sql` qu'aucune migration plus récente ne la redéfinit ;
  - `public.importer_cours(p_cours jsonb, p_publier boolean)`, qui transmet chaque question telle quelle à `prive.ecrire_question` ;
  - `versDonneesCours(c: CoursImport)`.
- Produces :
  - la clé JSON `garder_statut` (booléen) reconnue par `prive.ecrire_question` ;
  - `versDonneesCours(c: CoursImport, options?: { garderStatuts?: boolean })` ;
  - l'option `--garder-statuts` de `npm run import:contenu`, qui affiche en plus `statuts_conserves: N`.

- [ ] **Step 1 : test pgTAP**

`supabase/tests/garder_statuts.test.sql` :

```sql
begin;
select plan(6);

insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000006a1', 'technologique', 'GST', 'Filière garder');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000006a1', 'cours-garder', '10000000-0000-0000-0000-0000000006a1', '1re', 'G', 'Cours garder', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000006a1', '20000000-0000-0000-0000-0000000006a1', 'ch1', 1, 'Chapitre 1', true);

-- Deux questions importées puis validées par l'enseignant.
select prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:1","type":"qcm_unique","enonce":"Question un","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"valide"}');
select prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:2","type":"qcm_unique","enonce":"Question deux","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"valide"}');

-- Réimport avec garder_statut et le statut a_relire du fichier : structure inchangée, le statut valide reste.
select is((select resultat from prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:1","type":"qcm_unique","enonce":"Question un","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"a_relire","garder_statut":true}')),
  'inchangee', 'structure inchangée : rien ne change');
select is((select statut::text from public.question where source = 'g:1'), 'valide', 'le statut valide est conservé');

-- Énoncé modifié, structure identique : modifiée en place, toujours valide.
select is((select resultat from prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:1","type":"qcm_unique","enonce":"Question un, reformulée","propositions":["A","B"],"bonnes_reponses":[0],"explication":"E","statut":"a_relire","garder_statut":true}')),
  'modifiee', 'énoncé modifié en place');
select is((select statut::text from public.question where source = 'g:1'), 'valide', 'toujours valide après une modification de texte');

-- Structure changée : nouvelle version à relire, même avec garder_statut.
select is((select resultat from prive.ecrire_question('30000000-0000-0000-0000-0000000006a1', null,
  '{"source":"g:2","type":"qcm_unique","enonce":"Question deux","propositions":["A","C"],"bonnes_reponses":[1],"explication":"E","statut":"a_relire","garder_statut":true}')),
  'versionnee', 'structure changée : nouvelle version');
select is((select statut::text from public.question where source = 'g:2'), 'a_relire', 'la nouvelle version part en relecture');

select * from finish();
rollback;
```

Vérifier dans le corps actuel de `ecrire_question` les valeurs exactes de `resultat` (`cree`, `modifiee`, `versionnee`, `inchangee`). Si un nom diffère, adapter l'assertion au nom réel et le signaler. Ajouter aussi une assertion de non-régression : sans `garder_statut`, un réimport `a_relire` d'une question valide la repasse à `a_relire`. Le plan passe alors à 7.

- [ ] **Step 2 : vérifier l'échec**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npx supabase test db supabase/tests/garder_statuts.test.sql`
Expected : FAIL. Le statut repasse à `a_relire`, et la deuxième assertion échoue.

- [ ] **Step 3 : migration**

`supabase/migrations/20270105000001_garder_statuts.sql` :
- `create or replace function prive.ecrire_question(…)` avec le **corps actuel recopié**, plus ces trois changements :

```sql
  -- dans declare :
  v_garder boolean := not p_editeur and coalesce((p->>'garder_statut')::boolean, false);
```

```sql
  -- juste après la lecture de v_ancienne et le test « question_archivee »,
  -- au même endroit que la règle des signalements ouverts (et avant le calcul de v_structure) :
  if v_garder and v_ancienne.statut = 'valide' then
    v_statut := 'valide';
  end if;
```

```sql
  -- dans la branche de versionnage (v_structure and (valide or déjà tirée)), avant l'insert de la nouvelle version :
  if v_garder and v_statut = 'valide' then
    v_statut := 'a_relire';
  end if;
```

- Conserver les droits actuels de la fonction (`revoke execute … from public`, comme dans la migration d'origine).

- [ ] **Step 4 : script et conversion**

`src/lib/contenu/donnees-question.ts` : `versDonneesCours(c, options = {})`. Quand `options.garderStatuts` est vrai, chaque question convertie reçoit `garder_statut: true`. Test dans le fichier de test existant de ce module (ou un nouveau `donnees-question.test.ts`) :

```ts
it('ajoute garder_statut aux questions seulement si demandé', () => {
  const sans = versDonneesCours(coursMinimal);
  const avec = versDonneesCours(coursMinimal, { garderStatuts: true });
  expect(sans.chapitres[0].questions[0]).not.toHaveProperty('garder_statut');
  expect(avec.chapitres[0].questions[0]).toMatchObject({ garder_statut: true });
});
```

`coursMinimal` : un `CoursImport` valide à un chapitre et une question, construit avec `schemaCoursImport.parse` à partir de l'exemple minimal du guide.

`scripts/importer-contenu.ts` :
- accepter `--garder-statuts` (l'ajouter à la liste des options et à `USAGE`) ;
- passer `{ garderStatuts }` à `versDonneesCours` ;
- après l'import, si l'option est active : compter, parmi les questions du fichier dont le statut est différent de `valide`, celles qui sont `valide` en base :

```ts
const sources = cours.chapitres.flatMap((ch) => ch.questions.filter((q) => (q.statut ?? 'a_relire') !== 'valide').map((q) => q.source));
let conserves = 0;
for (let i = 0; i < sources.length; i += 500) {
  const { count, error: e } = await db.from('question').select('id', { count: 'exact', head: true })
    .in('source', sources.slice(i, i + 500)).eq('statut', 'valide');
  if (e) echouer(`Bilan des statuts impossible : ${e.message}`);
  conserves += count ?? 0;
}
console.log(`  statuts_conserves: ${conserves}`);
```

`docs/guide-auteurs.md`, partie de l'import : documenter `--garder-statuts`, c'est-à-dire ce qu'elle conserve, le cas de la nouvelle version et la ligne du bilan.

- [ ] **Step 5 : vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm test && npm run typecheck && npm run lint`
Expected : PASS, dont `garder_statuts.test.sql` 7/7.

Puis, sur la base locale : `npm run import:contenu -- contenu/1re-st2s/bph.json --garder-statuts`. Le bilan doit indiquer 140 questions `inchangee` et `statuts_conserves: 0`.

- [ ] **Step 6 : commit**

```bash
git add supabase/migrations/20270105000001_garder_statuts.sql supabase/tests/garder_statuts.test.sql src/lib/contenu scripts/importer-contenu.ts docs/guide-auteurs.md src/lib/supabase/types.ts
git commit -m "Garde les statuts validés au réimport avec --garder-statuts

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2 : RPC de statut en lot

**Files :**
- Create : `supabase/migrations/20270105000002_statut_en_lot.sql`, `supabase/tests/statut_en_lot.test.sql`
- Modify : `src/lib/erreurs.ts`, `src/lib/erreurs.test.ts`, `src/lib/supabase/types.ts`

**Interfaces :**
- Consumes : `public.changer_statut_question(p_question uuid, p_statut public.statut_question_t) returns void` (`20261124000003_ecriture_questions.sql`), avec ses erreurs `question_introuvable` et `transition_invalide` ; `prive.exiger_admin()`.
- Produces : `public.changer_statut_questions(p_questions uuid[], p_statut public.statut_question_t) returns int`, et le code `trop_de_questions`.

- [ ] **Step 1 : test pgTAP**

`supabase/tests/statut_en_lot.test.sql` :

```sql
begin;
select plan(9);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000006b1', 'admin-lot@test.local'),
  ('00000000-0000-0000-0000-0000000006b2', 'eleve-lot@test.local');
update public.profil set role = 'admin_contenu', onboarding_termine = true where id = '00000000-0000-0000-0000-0000000006b1';
update public.profil set onboarding_termine = true where id = '00000000-0000-0000-0000-0000000006b2';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000006b1', 'technologique', 'LOT', 'Filière lot');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000006b1', 'cours-lot', '10000000-0000-0000-0000-0000000006b1', '1re', 'L', 'Cours lot', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000006b1', '20000000-0000-0000-0000-0000000006b1', 'ch1', 1, 'Chapitre 1', true);
create temporary table q_lot (n int, id uuid) on commit drop;
insert into q_lot
  select n, (prive.ecrire_question('30000000-0000-0000-0000-0000000006b1', null,
    jsonb_build_object('source', 'lot:' || n, 'type', 'vrai_faux', 'enonce', 'Énoncé ' || n, 'bonne_reponse', true,
                       'explication', 'E', 'statut', case when n = 4 then 'brouillon' else 'a_relire' end))).id_question
  from generate_series(1, 4) n;
grant select on q_lot to authenticated;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000006b2","role":"authenticated"}', true);
select throws_ok($$ select public.changer_statut_questions(array(select id from q_lot where n <= 2), 'valide') $$,
  'P0001', null, 'réservé à l''admin');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000006b1","role":"authenticated"}', true);
select is(public.changer_statut_questions(array(select id from q_lot where n <= 2) || array(select id from q_lot where n = 1), 'valide'),
  2, 'deux questions validées, doublon ignoré');
select is((select count(*)::int from public.question q join q_lot l on l.id = q.id where l.n <= 2 and q.statut = 'valide'), 2, 'statuts appliqués');
select throws_ok($$ select public.changer_statut_questions(array(select id from q_lot where n in (3, 4)), 'valide') $$,
  'P0001', 'transition_invalide', 'brouillon vers valide refusé');
select is((select statut::text from public.question q join q_lot l on l.id = q.id where l.n = 3), 'a_relire', 'tout ou rien : la 3 reste à relire');
select is(public.changer_statut_questions(array(select id from q_lot where n = 3), 'brouillon'), 1, 'repasser en brouillon');
select is(public.changer_statut_questions('{}'::uuid[], 'valide'), 0, 'liste vide : rien');
select throws_ok($$ select public.changer_statut_questions(array(select gen_random_uuid() from generate_series(1, 201)), 'valide') $$,
  'P0001', 'trop_de_questions', 'au plus 200');
select throws_ok($$ select public.changer_statut_questions(array[gen_random_uuid()], 'valide') $$,
  'P0001', 'question_introuvable', 'question inconnue');

select * from finish();
rollback;
```

Le premier `throws_ok` attend le code de `prive.exiger_admin()`. Remplacer `null` par ce code exact, lu dans sa définition.

Ajouter deux assertions sur une question signalée (spec § 8), et passer le plan à 11 :
- créer une 5e question `a_relire` et un signalement ouvert sur elle, en insérant dans `public.signalement` avec les colonnes requises lues dans `20261124000005_signalements.sql` ;
- la valider en lot ;
- vérifier que la question est `valide` et que le signalement est `traite`. C'est la règle héritée de `changer_statut_question`.

- [ ] **Step 2 : vérifier l'échec**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npx supabase test db supabase/tests/statut_en_lot.test.sql`
Expected : FAIL, car la fonction `changer_statut_questions` n'existe pas.

- [ ] **Step 3 : migration**

```sql
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
```

`src/lib/erreurs.ts`, avec un test du texte exact : `trop_de_questions: 'Sélectionne au plus 200 questions à la fois.'`

- [ ] **Step 4 : vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm test && npm run typecheck`
Expected : PASS, dont `statut_en_lot.test.sql` 9/9.

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20270105000002_statut_en_lot.sql supabase/tests/statut_en_lot.test.sql src/lib/erreurs.ts src/lib/erreurs.test.ts src/lib/supabase/types.ts
git commit -m "Ajoute le changement de statut d'une sélection de questions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3 : admin — mode relecture

**Files :**
- Create : `src/components/admin/RelectureQuestions.tsx`, `src/lib/admin/relecture.ts`, `src/lib/admin/relecture.test.ts`, `e2e/relecture.spec.ts`
- Modify :
  - `src/app/(app)/admin/chapitres/[id]/questions/page.tsx`
  - `src/app/(app)/admin/questions/actions.ts`
  - `e2e/accessibilite.spec.ts`, `e2e/securite.spec.ts`
  - la feuille de style admin existante (`src/app/admin.css` ou équivalent : la trouver par `grep -rl "compteurs-statut" src`)

**Interfaces :**
- Consumes : `changer_statut_questions(p_questions uuid[], p_statut)` (tâche 2) ; `lireQuestionsChapitre(id): Promise<QuestionAdmin[]>`, qui donne `id, statut, type, difficulte, notion, enonce, propositions, bonnes_reponses, reponses_acceptees, marge, marge_relative, explication` ; le composant existant `ApercuQuestion` s'il convient à l'affichage d'une carte ; `messageErreur`.
- Produces :
  - la route `/admin/chapitres/[id]/questions?relecture=1` ;
  - l'action `changerStatutSelection(etat: EtatLot, form: FormData): Promise<EtatLot>` ;
  - le type `EtatLot = { message?: string; erreur?: string }` ;
  - le module `relecture.ts` : `lireSelection(form: FormData)` et `messageLot(n: number, statut: 'valide' | 'brouillon'): string`.

- [ ] **Step 1 : tests unitaires**

`src/lib/admin/relecture.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { lireSelection, messageLot } from './relecture';

const U1 = '11111111-1111-4111-8111-111111111111';
const U2 = '22222222-2222-4222-8222-222222222222';

function form(ids: string[], statut: string) {
  const f = new FormData();
  ids.forEach((i) => f.append('ids', i));
  f.set('statut', statut);
  return f;
}

describe('relecture en lot', () => {
  it('lit les identifiants cochés et le statut', () => {
    expect(lireSelection(form([U1, U2], 'valide'))).toEqual({ ok: true, ids: [U1, U2], statut: 'valide' });
  });
  it('refuse une sélection vide', () => {
    expect(lireSelection(form([], 'valide'))).toEqual({ ok: false, erreur: 'Coche au moins une question.' });
  });
  it('refuse un identifiant invalide ou un statut non prévu', () => {
    expect(lireSelection(form(['x'], 'valide')).ok).toBe(false);
    expect(lireSelection(form([U1], 'archivee')).ok).toBe(false);
  });
  it('refuse plus de 200 questions', () => {
    const ids = Array.from({ length: 201 }, (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`);
    expect(lireSelection(form(ids, 'valide'))).toEqual({ ok: false, erreur: 'Sélectionne au plus 200 questions à la fois.' });
  });
  it('rédige le message de résultat', () => {
    expect(messageLot(1, 'valide')).toBe('1 question validée.');
    expect(messageLot(24, 'valide')).toBe('24 questions validées.');
    expect(messageLot(3, 'brouillon')).toBe('3 questions repassées en brouillon.');
  });
});
```

- [ ] **Step 2 : vérifier l'échec** (`npx vitest run src/lib/admin/relecture.test.ts` : le module n'existe pas).

- [ ] **Step 3 : implémenter**

- `src/lib/admin/relecture.ts` : zod. `ids` est un tableau d'UUID, de 1 à 200 éléments après suppression des doublons, et `statut` vaut `'valide'` ou `'brouillon'`. On renvoie `{ ok: true, ids, statut }` ou `{ ok: false, erreur }`, avec les textes exacts des tests. Pour un identifiant ou un statut invalide, le texte est `'Sélection invalide. Recharge la page.'`.
- `actions.ts`, nouvelle action `changerStatutSelection` :
  1. `exigerAdmin()` (garde existante) ;
  2. `lireSelection(form)` ;
  3. `rpc('changer_statut_questions', { p_questions: ids, p_statut: statut })` ;
  4. en cas d'erreur : `{ erreur: messageErreur(error.message) }` ;
  5. sinon : `revalidatePath('/admin/chapitres/' + chapitre + '/questions')`, où `chapitre` est un champ caché validé en UUID, puis `{ message: messageLot(n, statut) }`.
- `RelectureQuestions.tsx` (client, `useActionState`) :
  - un seul `<form>` qui contient :
    - un champ caché `chapitre` ;
    - un bouton « Tout cocher » ou « Tout décocher » (bouton `type="button"`, qui coche les cases des cartes affichées) ;
    - une liste de **cartes** `<article>` :
      - en-tête : case `name="ids" value={id}` avec un libellé accessible « Sélectionner la question N », l'étiquette du type, la notion et la difficulté (« facile », « moyenne », « difficile ») ;
      - l'énoncé ;
      - pour un QCM, les propositions en liste, la ou les bonnes réponses marquées du **texte** « Bonne réponse » (pas seulement une couleur) ;
      - pour un vrai/faux, « Réponse : Vrai » ou « Réponse : Faux » ;
      - pour une réponse courte, « Réponses acceptées : … » et la marge éventuelle ;
      - l'explication ;
      - le lien « Modifier » vers l'éditeur existant de la question ;
    - deux boutons `type="submit" name="statut"`, de valeurs `valide` (« Valider la sélection », bouton principal) et `brouillon` (« Repasser en brouillon »).
  - une région `role="status"` toujours rendue pour le message, et `role="alert"` pour l'erreur ;
  - pendant l'envoi, les boutons sont désactivés.
- Page : si `?relecture=1`, afficher `RelectureQuestions` avec les seules questions `a_relire`, à la place de la liste habituelle. Ajouter près des compteurs :
  - un lien « Relire les questions à relire (N) », visible si N > 0 ;
  - en mode relecture, un lien « Retour à la liste ».
- Style : cartes empilées, utilisables à 375 px, cases d'au moins 44 px de cible. Aucun attribut `style` en ligne.

- [ ] **Step 4 : e2e**

`e2e/relecture.spec.ts` :
1. Avec les aides existantes (`e2e/aide-db.ts` : `creerCoursPublie`, `rendreAdmin`, `idProfil`), créer un cours `e2e-…` avec un chapitre et 3 questions `a_relire`. Les créer avec le client service de `aide-db.ts` en appelant `importer_cours`, ou en insérant, selon ce que permettent les aides existantes.
2. Un admin connecté ouvre `/admin/chapitres/<id>/questions?relecture=1`, voit 3 cartes, en coche 2 et clique « Valider la sélection ».
3. Vérifier le message « 2 questions validées. », l'unique carte restante et le compteur « Validée » augmenté de 2.

Ajouter la page en mode relecture à `e2e/accessibilite.spec.ts` et à `e2e/securite.spec.ts`.

- [ ] **Step 5 : vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm test && npm run typecheck && npm run lint && npm run build && npx playwright test e2e/relecture.spec.ts e2e/accessibilite.spec.ts e2e/securite.spec.ts`
Expected : PASS.

- [ ] **Step 6 : commit**

```bash
git add src/lib/admin src/components/admin/RelectureQuestions.tsx "src/app/(app)/admin" e2e src/app/*.css
git commit -m "Ajoute la relecture en lot des questions dans l'admin

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4 : scripts de banque — texte, vérification, fusion

**Files :**
- Create :
  - `src/lib/contenu/banque/format.ts`, `src/lib/contenu/banque/verifier.ts`, `src/lib/contenu/banque/fusionner.ts`, `src/lib/contenu/banque/texte.ts`
  - leurs tests `*.test.ts`
  - `scripts/texte-chapitre.ts`, `scripts/verifier-banque.ts`, `scripts/fusionner-banque.ts`
  - `contenu/1re-st2s/banques/.gitkeep`
- Modify : `package.json` (scripts `banque:texte`, `banque:verifier`, `banque:fusionner`), `docs/guide-auteurs.md` (nouvelle partie « Banques de questions »)

**Interfaces :**
- Consumes : `schemaQuestionImport`, `schemaCoursImport` et `QuestionImport` de `src/lib/contenu/format-import.ts`.
- Produces :
  - `type FichierBanque = { chapitre: number; notions: string[]; questions: QuestionImport[] }` et `schemaFichierBanque` (zod) dans `format.ts` ;
  - `verifierBanque(f: FichierBanque, existantes: QuestionImport[]): string[]` dans `verifier.ts`, qui renvoie la liste des erreurs (vide si tout va bien) ;
  - `similarite(a: string, b: string): number` dans `verifier.ts` ;
  - `fusionnerBanque(cours: CoursImport, f: FichierBanque): CoursImport` dans `fusionner.ts`, qui lève une `Error` en français en cas de conflit ;
  - `texteChapitre(cours: CoursImport, numero: number): string` dans `texte.ts`, qui renvoie un texte brut sans HTML : titre, chapeau, objectifs, sections et « Je retiens », avec les titres de section ;
  - les commandes `npm run banque:texte -- N`, `npm run banque:verifier -- N` et `npm run banque:fusionner -- N`, qui travaillent sur `contenu/1re-st2s/banques/bph-chN.json` et `contenu/1re-st2s/bph.json`.

- [ ] **Step 1 : tests**

`verifier.test.ts` construit un fichier valide de 130 questions avec une fabrique (`fabriquer({ … })`), qui respecte les quotas exacts : 65 / 26 / 26 / 13, difficultés 52 / 52 / 26, positions des bonnes réponses en rotation 0-1-2-3, longueurs égales. Il vérifie :
- `verifierBanque(valide, [])` renvoie `[]` ;
- une erreur par règle, en altérant une seule chose à la fois, avec le message attendu (on vérifie la présence d'un fragment) :
  1. une question refusée par `schemaQuestionImport` : `question bph:ch1:banque:007 : …` (message du validateur) ;
  2. une source en double : `source en double : bph:ch1:banque:003` ;
  3. une source hors format : `source invalide : bph:ch1:quiz:1 (attendu bph:ch1:banque:NNN)` ;
  4. un numéro de chapitre de source différent de `chapitre` : même message que la règle 3 ;
  5. 70 `qcm_unique` : `répartition des types : qcm_unique 70 (attendu 65 ± 3)` ;
  6. 30 de difficulté 3 : `répartition des difficultés : 3 → 30 (attendu 26 ± 3)` ;
  7. une explication vide ou absente : `explication manquante : bph:ch1:banque:010` ;
  8. une notion hors liste : `notion inconnue « Foie » : bph:ch1:banque:011` ;
  9. une notion absente : `notion manquante : bph:ch1:banque:012` ;
  10. une proposition « Toutes les réponses ci-dessus » (insensible à la casse et aux accents ; aussi « aucune des réponses ») : `proposition interdite : bph:ch1:banque:013` ;
  11. un `qcm_multiple` avec 1 ou 4 bonnes réponses : `qcm_multiple avec 1 bonne réponse (attendu 2 ou 3) : bph:ch1:banque:014` ;
  12. un `qcm_multiple` sans la mention : `mention « Coche toutes les réponses exactes. » absente : bph:ch1:banque:015` ;
  13. plus de 40 % des `qcm_unique` avec la bonne réponse en position 0 : `biais de position : la position 1 porte 45 % des bonnes réponses (40 % au plus)` (positions affichées à partir de 1) ;
  14. la bonne réponse strictement la plus longue dans 40 % ou plus des `qcm_unique` : `biais de longueur : la bonne réponse est la plus longue dans 42 % des QCM (moins de 40 %)` ;
  15. deux énoncés presque identiques, entre eux ou avec une existante : `énoncés trop proches (0,91) : bph:ch1:banque:020 et bph:ch1:banque:021` (ou `… et bph:ch1:quiz:3`) ;
  16. un vrai/faux déséquilibré, à plus de 60 % de vrais ou de faux : `vrai/faux déséquilibrés : 20 vrais sur 26 (60 % au plus)` ;
  17. une espace normale avant « : ; ! ? » dans un énoncé, une proposition ou une explication : `espace insécable manquante : bph:ch1:banque:016`.
- `similarite('Quel organe produit la bile ?', 'Quel organe produit la bile ?')` vaut 1. `similarite` de deux énoncés sans rapport est inférieure à 0,3. Les accents et la ponctuation n'ont pas d'effet.

`fusionner.test.ts` :
- les questions s'ajoutent au chapitre N, au statut `a_relire`, sans toucher aux autres chapitres ni aux questions existantes ;
- une source déjà présente avec un contenu identique est ignorée, ce qui rend la fusion rejouable ;
- une source déjà présente avec un contenu différent lève `source déjà présente avec un contenu différent : bph:ch1:banque:004` ;
- un chapitre inconnu lève `chapitre 9 absent du cours`.

`texte.test.ts` : les balises HTML sont retirées et les entités décodées (`&nbsp;` devient une espace insécable, `&amp;` devient `&`). Les titres de section et « Je retiens » apparaissent.

- [ ] **Step 2 : vérifier l'échec**, puis **Step 3 : implémenter**

- **Normalisation de la similarité** :
  - `texte.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()` ;
  - trigrammes de caractères sur `' ' + t + ' '` ;
  - Jaccard = |A ∩ B| / |A ∪ B|.
- **Seuils** à placer en constantes exportées et nommées :
  - `TOLERANCE = 3` ;
  - `SEUIL_POSITION = 0.4` ;
  - `SEUIL_LONGUEUR = 0.4` ;
  - `SEUIL_SIMILARITE = 0.8` ;
  - `SEUIL_VRAI_FAUX = 0.6` ;
  - `QUOTAS_TYPES = { qcm_unique: 65, qcm_multiple: 26, vrai_faux: 26, reponse_courte: 13 }` ;
  - `QUOTAS_DIFFICULTE = { 1: 52, 2: 52, 3: 26 }`.
- **Scripts** (tsx, CommonJS comme `scripts/importer-contenu.ts`, sans `await` au niveau supérieur) : lire les fichiers et appeler la fonction pure.
  - `verifier-banque` affiche les erreurs et sort avec le code 1 s'il y en a. Sinon il affiche `Banque du chapitre N conforme : 130 questions.`
  - `fusionner-banque` réécrit `bph.json` avec une indentation de 2 espaces et un saut de ligne final, en gardant l'ordre des clés existantes.
  - `texte-chapitre` écrit le texte sur la sortie standard.
- **Guide des auteurs** : décrire le fichier de travail, les trois commandes et les règles contrôlées.

- [ ] **Step 4 : vérifier**

Run : `npm test && npm run typecheck && npm run lint`
Puis `npm run banque:texte -- 1 | head -20`, qui doit afficher le titre et le début du chapitre 1.

- [ ] **Step 5 : commit**

```bash
git add src/lib/contenu/banque scripts/texte-chapitre.ts scripts/verifier-banque.ts scripts/fusionner-banque.ts package.json docs/guide-auteurs.md contenu/1re-st2s/banques/.gitkeep
git commit -m "Ajoute les outils de production des banques de questions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tasks 5 à 11 : un chapitre de la banque BPH (chapitre N)

La même procédure s'applique à chaque chapitre : tâche 5 pour N = 1, tâche 6 pour N = 2, et ainsi de suite jusqu'à la tâche 11 pour N = 7. Chaque tâche est dispatchée et revue séparément.

**Files :**
- Create : `contenu/1re-st2s/banques/bph-chN.json`, `contenu/1re-st2s/banques/bph-chN-relecture.md`
- Modify : `contenu/1re-st2s/bph.json`

**Interfaces :**
- Consumes : `npm run banque:texte -- N`, `npm run banque:verifier -- N`, `npm run banque:fusionner -- N` (tâche 4) ; `npm run import:contenu -- contenu/1re-st2s/bph.json --garder-statuts` (tâche 1).
- Produces : 130 nouvelles questions `a_relire` dans le chapitre N de `bph.json`, importées en base locale.

Le contrôleur organise la tâche en trois sous-agents successifs.

- [ ] **Step 1 : rédaction (sous-agent Sonnet)**
  - Lire `npm run banque:texte -- N` et les 20 questions existantes du chapitre N dans `bph.json`.
  - Fixer de 5 à 12 notions, d'après les sections, chacune de 40 caractères au plus.
  - Écrire `contenu/1re-st2s/banques/bph-chN.json` : `{ "chapitre": N, "notions": [...], "questions": [130 questions] }`, avec les sources `bph:chN:banque:001` à `130`, sans champ `statut`.
  - Respecter **toutes** les règles de rédaction des Contraintes globales et du § 3 de la spec.
  - Itérer jusqu'à ce que `npm run banque:verifier -- N` passe.
  - Commit : `Rédige la banque de questions du chapitre N de BPH`.

- [ ] **Step 2 : relecture contre le cours (sous-agent Opus)**
  - Lire le texte du chapitre et le fichier de travail. Vérifier chaque question :
    - exacte selon le texte du chapitre ;
    - une seule lecture ;
    - bonne(s) réponse(s) justes et seules justes ;
    - explication juste ;
    - niveau 1re ST2S ;
    - pas de connaissance hors du chapitre.
  - Corriger directement les questions fautives.
  - Remplacer les questions écartées par de nouvelles questions, avec les mêmes sources libérées, pour garder 130 questions et les quotas.
  - Écrire `bph-chN-relecture.md` :
    - un tableau des questions **corrigées** et **remplacées** (source, problème, décision) ;
    - les totaux gardées / corrigées / remplacées ;
    - les points de doute laissés à l'enseignant.
  - Relancer `npm run banque:verifier -- N`, qui doit passer.
  - Commit : `Relit la banque du chapitre N de BPH contre le cours`.

- [ ] **Step 3 : fusion et import (sous-agent Sonnet, ou le même que le Step 1)**

```bash
npm run banque:fusionner -- N
npm run import:contenu -- contenu/1re-st2s/bph.json --garder-statuts
```

Le bilan d'import doit indiquer `cree: 130`, rien de `modifiee`, `versionnee`, `archivee` ni `supprimee`, et `statuts_conserves` égal au nombre de questions déjà validées par l'enseignant (0 au premier passage). Relancer le même import : le bilan doit indiquer 0 question créée.
Commit : `Ajoute 130 questions à relire au chapitre N de BPH`.

- [ ] **Step 4 : revue de la tâche** (sous-agent Sonnet, rubrique de revue habituelle)
  - Échantillon de 20 questions tirées au hasard, plus toutes les questions marquées « doute » dans le rapport.
  - Cohérence du rapport avec le diff.
  - Quotas et contrôles : relancer `banque:verifier`.

- [ ] **Step 5, pour la tâche 5 (N = 1) seulement : arrêt**

Le contrôleur s'arrête et demande à l'utilisateur de relire le chapitre 1 dans `/admin` (mode relecture), puis de donner ses remarques de style. Ses remarques sont reportées dans le § 3 de la spec et dans les Contraintes globales de ce plan (un commit), avant la tâche 6.

---

### Task 12 : bilan, feuille de route, revue finale

**Files :**
- Create : `docs/superpowers/plans/2027-01-05-etape-6a-bilan.md`
- Modify : `docs/superpowers/plans/2026-11-03-feuille-de-route.md`, `README.md`

- [ ] **Step 1 : vérification complète**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npm run test:db && npm test && npm run typecheck && npm run lint && npm run build && npm run e2e`, puis `for n in 1 2 3 4 5 6 7; do npm run banque:verifier -- $n; done`, puis `npm run import:contenu -- contenu/1re-st2s/bph.json --garder-statuts`, deux fois. Le second import ne doit rien créer.

- [ ] **Step 2 : bilan**, sur la forme de `2026-12-29-etape-5b-bilan.md` :
  - ce qui est livré ;
  - les nombres de tests ;
  - un tableau par chapitre : questions existantes, nouvelles, gardées, corrigées et remplacées à la relecture, nombre de notions ;
  - les limites (§ 9 de la spec) ;
  - « Mise en ligne » :
    - migrations `20270105000001` et `20270105000002` ;
    - import de production avec `--garder-statuts --distant`, à faire volontairement par l'utilisateur ;
    - rappel que les nouvelles questions restent invisibles tant qu'elles ne sont pas validées.

  Mettre aussi à jour :
  - la feuille de route : 6a « Terminé (branche etape-6a-banques-bph) » ;
  - le README : les commandes de banque.

- [ ] **Step 3 : commit**, puis revue finale de la branche par **Opus** (le contrôleur, hors de cette tâche).

```bash
git add docs README.md
git commit -m "Ajoute le bilan de l'étape 6a

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
