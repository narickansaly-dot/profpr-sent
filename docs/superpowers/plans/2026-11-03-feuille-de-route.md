# Feuille de route d'implémentation

**Spec :** `docs/superpowers/specs/2026-11-03-app-lycee-design.md`

La spec couvre sept étapes qui livrent chacune une version utilisable. Chaque étape a son propre plan détaillé, rédigé **juste avant de la commencer**. Ainsi chaque plan s'appuie sur le code réellement écrit aux étapes précédentes, et non sur des suppositions.

| Étape | Plan | Statut |
|---|---|---|
| 1. Socle : comptes, contenu, import BPH, lecture | `2026-11-03-etape-1-socle.md` (bilan : `2026-11-03-etape-1-bilan.md`) | Terminé (branche etape-1-socle) |
| 2. Quiz, évaluations, tableau de bord élève | `2026-11-10-etape-2-quiz.md` (bilan : `2026-11-10-etape-2-bilan.md`) | Terminé (branche etape-2-quiz) |
| 3a. Espace enseignant (classes, suivi, échéances) | `2026-11-17-etape-3a-enseignant.md` (bilan : `2026-11-17-etape-3a-bilan.md`) | Terminé (branche etape-3a-enseignant) |
| 3b. Gestion du contenu (éditeurs, signalements) | `2026-11-24-etape-3b-contenu.md` (bilan : `2026-11-24-etape-3b-bilan.md`) | Terminé (branche etape-3b-contenu) |
| 4a. Calendrier, planning de révision, PWA hors connexion | `2026-12-01-etape-4a-calendrier.md` (bilan : `2026-12-01-etape-4a-bilan.md`) | Terminé (branche etape-4a-calendrier) |
| 4b. Notifications Web Push | `2026-12-08-etape-4b-notifications.md` (bilan : `2026-12-08-etape-4b-bilan.md`) | Terminé (branche etape-4b-notifications) |
| 4c. En-têtes de sécurité, déploiement, accessibilité, dette | `2026-12-15-etape-4c-securite.md` (bilan : `2026-12-15-etape-4c-bilan.md`) | Terminé (branche etape-4c-securite) |
| 5a. Accès gratuit, consentement parental, données personnelles, pages légales | `2026-12-22-etape-5a-rgpd.md` (bilan : `2026-12-22-etape-5a-bilan.md`) | Terminé (branche etape-5a-rgpd) |
| 5b. Comptes parents, CGV, fondations des abonnements (sans paiement) | spec : `../specs/2026-12-29-etape-5b-parents-design.md`, plan : `2026-12-29-etape-5b-parents.md` (bilan : `2026-12-29-etape-5b-bilan.md`) | Terminé (branche etape-5b-parents) |
| 5c. Paiement Stripe | après la création d'un compte Stripe | — |
| 6a. Banques de questions BPH (environ 150 par chapitre) | `2027-01-05-etape-6a-banques-bph.md` (spec : `../specs/2027-01-05-etape-6a-banques-bph-design.md`) | En cours (branche etape-6a-banques-bph) |
| 6b. Autres matières de 1re ST2S | après l'étape 6a | — |
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
