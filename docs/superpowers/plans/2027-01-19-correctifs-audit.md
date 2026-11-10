# Correctifs des audits de sécurité et d'accessibilité — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** corriger les constats confirmés des deux audits de la nuit :
- `docs/audits/2027-01-12-audit-securite.md` : I1, I2, M2, M4, M5, M6 ;
- `docs/audits/2027-01-12-audit-accessibilite.md` : I1, I2, I4, I5, I6, et le lien d'évitement.

**Origine :** plan rédigé par le contrôleur pendant la session autonome de nuit. Il est à valider par l'enseignant. Les specs des étapes 5a, 5b et 6a font autorité : ce plan les fait respecter dans des cas qu'elles n'avaient pas couverts.

**Branche :** `correctifs-audit`, créée depuis `dette-5b-6a`. Sa PR visera `dette-5b-6a` (PR n° 11).

## Décisions prises dans ce plan

1. **Élève sans accord ou après retrait (sécurité I1) : on filtre au lieu de supprimer.** Les lectures de l'enseignant, la planification des rappels et le flux iCal **ignorent** un élève tant que `prive.consentement_requis(eleve)` est vrai. Les écritures d'un tel élève sont refusées avec le code existant `consentement_requis`. Rien n'est supprimé au retrait : si le parent annule son retrait, tout redevient visible. Cela respecte l'arrêt du traitement (RGPD, art. 7.3) sans détruire de données pendant le délai d'annulation.
2. **Journal d'Auth (sécurité I2)** : la purge quotidienne supprime les lignes de `auth.audit_log_entries` des comptes purgés, puis toute ligne de plus de 90 jours. La politique de confidentialité indique cette durée de conservation.
3. **Reportés, avec une note dans le bilan :**
   - sécurité M1 : l'accueil passerait par une RPC, ce qui change le parcours d'inscription ;
   - sécurité M3 : un CAPTCHA demande un compte chez un fournisseur, donc l'accord de l'utilisateur ;
   - accessibilité I3 : le focus perdu concerne une trentaine de formulaires et appelle un composant commun de bouton d'envoi, un choix de conception à valider.

## Contraintes globales

Ce sont celles de la section « Contraintes globales » de `docs/superpowers/plans/2027-01-05-etape-6a-banques-bph.md`, qui s'appliquent toutes.

- **Langue** : interface en français. On tutoie l'élève et l'administrateur, on vouvoie le parent, et les formulations ne sont pas genrées.
- **Typographie** : U+00A0 avant « : ; ! ? ».
- **Fonctions SQL** : RPC `security definer` avec `set search_path = ''`. Pour recréer une fonction, on recopie son corps actuel depuis la migration la plus récente qui la définit, avec ses droits.
- **Tests pgTAP** : chaque test utilise ses propres UUID, et on prouve que chaque nouvelle assertion discrimine.
- **Commandes** : préfixer les commandes shell par `export PATH="$HOME/.orbstack/bin:$PATH";` et les commandes git par `DEVELOPER_DIR=/Library/Developer/CommandLineTools`. Ne jamais afficher `.env.local`.
- **Commits** : chaque message se termine exactement par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Interface** : la CSP stricte et la revue axe restent vertes. Aucun composant client n'importe zod (la CSP le bloque, voir le bilan de la dette). Les pages restent utilisables à 375 px.

---

### Task 1 : aucun traitement d'un élève sans accord (sécurité I1)

**Files :** `supabase/migrations/20270119000001_accord_requis_partout.sql`, `supabase/tests/accord_requis_partout.test.sql`, `src/lib/supabase/types.ts`.

- [ ] **Test pgTAP d'abord.** Le test prépare un élève de moins de 15 ans, dans un des deux états suivants :
  - (a) sans accord ;
  - (b) avec un accord donné puis retiré.

  Il vérifie ensuite les points suivants :
  - **Écritures refusées** : `rejoindre_classe`, `enregistrer_evenement`, `creer_jeton_ical`, `enregistrer_abonnement_push` et `accepter_plan_revision` lèvent `consentement_requis`. Lire leurs signatures exactes dans la migration la plus récente de chacune.
  - **Vue de l'enseignant** : pour un élève déjà inscrit dans une classe avant le retrait (cas b), l'enseignant ne voit plus cet élève dans `suivi_classe`, `notes_classe` et `questions_ratees_classe`, alors qu'il voit toujours un autre élève de la même classe.
  - **Rappels** : `prive.planifier_notifications` ne crée aucune notification pour cet élève (cas b, avec un événement à venir).
  - **Flux iCal** : `calendrier_ical(jeton)` ne renvoie rien pour cet élève (cas b).
  - **Annulation du retrait** : après `annuler_retrait_consentement`, l'élève redevient visible de l'enseignant.
  - **Régression** : un élève de 15 ans ou plus, ou un élève avec un accord valide, n'est pas affecté.
- [ ] **Migration.** Recréer chaque fonction à partir de son corps actuel, en vérifiant par `grep` la migration la plus récente de chacune :
  - en tête des 5 fonctions d'écriture, `if prive.consentement_requis(auth.uid()) then raise exception 'consentement_requis'; end if;` ;
  - dans les 3 lectures de l'enseignant, `prive.planifier_notifications` et `calendrier_ical`, le filtre `and not prive.consentement_requis(<id élève>)`.

  Les droits de chaque fonction restent ceux d'avant.
- [ ] **Interface.** Ajouter un message dans `src/lib/erreurs.ts` seulement si un nouveau code est nécessaire : `consentement_requis` est déjà traduit.
- [ ] **Vérifier** : `npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm test && npm run typecheck`, puis `npx playwright test e2e/consentement.spec.ts e2e/parents.spec.ts e2e/enseignant.spec.ts e2e/calendrier.spec.ts e2e/notifications.spec.ts`.
- [ ] **Commit** : « N'expose plus un élève sans accord parental et refuse ses écritures ».

---

### Task 2 : effacement et hygiène des droits (sécurité I2, M2, M4, M5)

**Files :**
- `supabase/migrations/20270119000002_effacement.sql` ;
- `supabase/tests/effacement.test.sql` ;
- `src/app/(legal)/confidentialite/page.tsx` ;
- `src/lib/supabase/types.ts`.

- [ ] **Test pgTAP d'abord** :
  - **I2** : après `prive.purges_quotidiennes()`, aucune ligne de `auth.audit_log_entries` ne se rapporte à un compte purgé (`payload->>'actor_id'` ou `payload->'traits'->>'user_id'`). Aucune ligne de plus de 90 jours ne reste. Une ligne récente d'un compte actif reste.
  - **M5** : une demande d'accord jamais donnée, de plus de 30 jours, n'a plus d'adresse : `email_parent` est nul, la colonne devient donc nullable et sa contrainte de longueur s'applique seulement si elle est renseignée. Une demande de 10 jours garde son adresse. Une demande dont l'accord est donné garde son adresse. Vérifier que `lier_par_email`, `demander_consentement` et l'export tolèrent une adresse nulle.
  - **M2** : `authenticated` n'a plus de droit d'écriture sur `public.niveau`. Toutes les tables de `public` ont `relrowsecurity = true`. Les droits par défaut de `postgres` dans `public` ne donnent plus rien à `anon` ni à `authenticated`.
  - **M4** : changer `auth.users.email` met à jour `profil.email`.
- [ ] **Migration.**
  - **Purge** : recréer `prive.purges_quotidiennes`, qui enveloppe aujourd'hui `prive.purges_quotidiennes_5a` (lire `20261229000003_suivi_parent.sql` et les suivantes). Ajouter, avant l'appel à `purges_quotidiennes_5a`, la suppression des lignes du journal pour les comptes qui vont être purgés : recalculer la même liste, avec la même règle que `_5a`, et la règle du dernier administrateur. Ajouter ensuite la rétention de 90 jours et l'effacement des adresses expirées. Garder la tâche `pg_cron` qui appelle `prive.purges_quotidiennes()`.
  - **Droits** : `revoke insert, update, delete on public.niveau from authenticated;` et `alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;`. Vérifier qu'aucune table créée plus tard par une migration ne dépendait de ces droits par défaut : relancer toute la suite.
  - **Adresse** : un déclencheur `security definer` (`after update of email on auth.users`) qui recopie l'adresse dans `profil.email`.
- [ ] **Confidentialité.** Dans « Durées de conservation », ajouter : « Journaux techniques de connexion : 90 jours », et « Adresse d'un parent qui n'a pas donné son accord : effacée 30 jours après la demande ».
- [ ] **Vérifier** : `npm run db:reset && npm run test:db && npm test && npm run typecheck && npm run build`, puis `npx playwright test e2e/consentement.spec.ts e2e/mes-donnees.spec.ts e2e/securite.spec.ts`.
- [ ] **Commit** : « Efface les traces d'un compte supprimé et resserre les droits par défaut ».

---

### Task 3 : export complet (sécurité M6)

**Files :** une migration `20270119000003_export_complet.sql`, `supabase/tests/mes_donnees.test.sql` (la liste exacte des clés).

- [ ] Ajouter à `exporter_mes_donnees` les clés suivantes, sans aucune empreinte :
  - `deliaisons` (élève et parent, avec la date) ;
  - `jeton_ical` (seulement `cree_le`, s'il existe) ;
  - `code_parent` (seulement `expire_le`, s'il existe) ;
  - `retraits_faits` pour un parent (prénom de l'enfant, `retire_le`) ;
  - dans `consentement` : `dernier_envoi_le` et `envois_du_jour` ;
  - `connexion` : fournisseur ou fournisseurs d'Auth, `last_sign_in_at` et `created_at`, lus dans `auth.users` et `auth.identities`, sans jeton.

  Tester chaque clé.
- [ ] **Commit** : « Complète l'export des données personnelles ».

---

### Task 4 : accessibilité (audit I1, I2, I4, I5, I6, lien d'évitement)

**Files :** d'après l'audit : `src/app/not-found.tsx`, les jetons de couleur dans `src/app/globals.css` et les feuilles de style, `src/app/layout.tsx` (lien d'évitement), et les tests e2e axe et CSP.

- [ ] **I1** : créer `src/app/not-found.tsx`, en français, avec un `main`, un titre « Page introuvable », un lien « Retour à l'accueil », et les mêmes en-tête et pied que le reste du site si c'est possible sans données de session. Ajouter cette page à la revue axe et CSP, avec une URL inconnue.
- [ ] **I2, I5, I6** : ajuster les jetons de couleur.
  - `--danger` doit avoir un contraste d'au moins 4,5:1 sur le papier, en clair comme en sombre.
  - Les bordures de champs et des boutons secondaires doivent avoir un contraste d'au moins 3:1 avec le fond.
  - L'anneau de focus doit avoir un contraste d'au moins 3:1 en clair et en sombre, quelle que soit la couleur du cours : utiliser un double anneau, la couleur du cours plus un contour neutre contrasté.

  Calculer et noter les rapports obtenus dans le rapport.
- [ ] **I4** : donner aux liens-texte isolés (liens de retour, « Voir mon calendrier »…) une zone cliquable d'au moins 44 px de haut, par du rembourrage, sans changer la mise en page à 375 px.
- [ ] **Lien d'évitement** : ajouter « Aller au contenu » en premier élément focalisable, visible au focus, qui vise le `main` (ajouter `id="contenu"`).
- [ ] **Vérifier** : `npm test && npm run typecheck && npm run lint && npm run build && npm run e2e`.
- [ ] **Commit** : « Corrige la page 404, les contrastes, les cibles tactiles et ajoute un lien d'évitement ».

---

### Task 5 : bilan

- [ ] Committer les deux rapports d'audit (`docs/audits/`). Dans chacun, ajouter en tête une section « Suites données » qui donne, pour chaque constat, l'une de trois mentions : « corrigé (commit) », « reporté (raison) » ou « accepté ».
- [ ] Rédiger le bilan `docs/superpowers/plans/2027-01-19-correctifs-audit-bilan.md` : ce qui est corrigé, les tests, les migrations `20270119000001` à `20270119000003`, et les constats reportés : sécurité M1 et M3, accessibilité I3 et ses mineurs. Ajouter une ligne dans la feuille de route.
- [ ] Faire la vérification complète : `npm run db:reset && npm run test:db && npm test && npm run typecheck && npm run lint && npm run build && npm run e2e`.
- [ ] **Commit** : « Ajoute le bilan des correctifs d'audit ».
