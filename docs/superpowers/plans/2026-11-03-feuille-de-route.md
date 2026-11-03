# Feuille de route d'implémentation

**Spec :** `docs/superpowers/specs/2026-11-03-app-lycee-design.md`

La spec couvre sept étapes qui livrent chacune une version utilisable. Chaque étape a son propre plan détaillé, rédigé **juste avant de la commencer**. Ainsi chaque plan s'appuie sur le code réellement écrit aux étapes précédentes, et non sur des suppositions.

| Étape | Plan | Statut |
|---|---|---|
| 1. Socle : comptes, contenu, import BPH, lecture | `2026-11-03-etape-1-socle.md` (bilan : `2026-11-03-etape-1-bilan.md`) | Terminé (branche etape-1-socle) |
| 2. Quiz, évaluations, tableau de bord élève | à rédiger après l'étape 1 | — |
| 3. Espace enseignant et gestion du contenu | à rédiger après l'étape 2 | — |
| 4. Calendrier, planning de révision, PWA, notifications | à rédiger après l'étape 3 | — |
| 5. Abonnements Stripe et RGPD | à rédiger après l'étape 4 | — |
| 6. Contenu 1re ST2S complet | à rédiger après l'étape 5 | — |
| 7. Stores, nouveaux types de questions, établissements, autres filières | plus tard | — |

## Répartition des modèles (économie de tokens)

L'exécution suit `superpowers:subagent-driven-development` : un sous-agent neuf par tâche, puis une revue. Chaque sous-agent reçoit seulement sa tâche, la section « Contraintes globales » et les interfaces dont il dépend, jamais tout l'historique. C'est la principale source d'économie. Le modèle est choisi selon le risque de la tâche :

| Type de tâche | Modèle | Exemples |
|---|---|---|
| Mécanique, guidée par un code fourni dans le plan | **Haiku** | initialisation du projet, configuration, seed, pages simples, vérification de conformité au plan |
| Implémentation courante avec tests | **Sonnet** | composants, server actions, script d'import, requêtes, éditeurs |
| Sécurité, argent, données de mineurs, architecture | **Opus** (moi) | règles d'accès (RLS), correction des quiz côté serveur, webhooks Stripe, consentement parental, revue finale de chaque étape |
| Génération de contenu pédagogique en masse | **Sonnet** pour produire, **Opus** pour relire par échantillons | banques de 150 questions, cours des autres matières |

Les revues de tâche (conformité à la spec, qualité) passent par Sonnet. La revue de fin d'étape passe par Opus.

## Skills utilisés

| Skill | Quand |
|---|---|
| `superpowers:subagent-driven-development` | exécution de chaque plan |
| `superpowers:test-driven-development` | toute tâche de code (test qui échoue → code → test qui passe) |
| `context7` (documentation à jour) | avant d'écrire du code Next.js, Supabase (`@supabase/ssr`), Stripe, Web Push : leurs API changent souvent |
| `frontend-design` + `ui-ux-pro-max` | système visuel (étape 1), puis chaque nouvel écran important |
| `dataviz` | graphiques des tableaux de bord (étapes 2 et 3) |
| `security-review` | fin des étapes 1, 3 et 5 (RLS, rôles, paiements, données de mineurs) |
| `superpowers:requesting-code-review` | fin de chaque étape |
| `superpowers:verification-before-completion` | avant de déclarer une tâche ou une étape terminée |
| `superpowers:finishing-a-development-branch` | intégration de chaque étape |
| `design:accessibility-review` | fin des étapes 2 et 4 (public scolaire, mobile) |
