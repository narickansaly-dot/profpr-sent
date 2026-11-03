# Étape 1 : bilan et points reportés

État final sur la branche `etape-1-socle` :
- 26 tests unitaires (Vitest) ;
- 43 tests des règles d'accès (pgTAP) ;
- 4 parcours de bout en bout (Playwright, mobile et ordinateur, sur build de production) ;
- typage et build sans erreur.

## Décisions prises pendant l'exécution

1. **Ordre d'exécution.** Docker était absent au départ, donc les tâches 1 et 5 ont été faites en premier.
2. **Option de cache de Next.js.** `cacheComponents` est désactivé : le code lit les cookies dans des layouts serveur sans `<Suspense>`. On peut le réactiver plus tard.
3. **Page par défaut.** Celle de create-next-app (`src/app/page.tsx`) est supprimée, pour éviter deux routes « / ».
4. **Configuration Vitest.** Le fichier est renommé en `vitest.config.mts`, ce qui supprime un avertissement ESM/CJS.
5. **Droits de la base.** Les droits par défaut de Supabase sont resserrés : plus de TRUNCATE, MAINTAIN ni EXECUTE pour anon, ni de SELECT anonyme sur le contenu. Les tests pgTAP ont été complétés en conséquence, au-delà de ce que prévoyait le plan.
6. **Chapitres brouillons.** Leur protection est rendue explicite dans les politiques de `notion` et `question` (`c.publie`).
7. **Isolation des tests pgTAP.** Les comptages sont limités aux données de test, pour qu'ils restent valides avec le cours BPH importé. Des vérifications globales « 0 corrigé » restent en place pour l'élève et l'enseignant.
8. **Script d'import.** Le code du plan contenait un bug (`publie` au lieu de `publie: publier`). Il est corrigé.
9. **Styles des chapitres.** Les styles de texte (titres, listes) de l'ancien site sont repris.
10. **Accessibilité et contraste.** Le libellé du bouton de déconnexion est corrigé (WCAG 2.5.3). Les couleurs de cours en mode sombre sont mélangées à 60 %, ce qui donne un contraste d'au moins 5,6:1.
11. **Tests de bout en bout.** Ils tournent sur un build de production : la perte de saisie à l'inscription n'existait qu'en mode dev.
12. **Confirmation d'inscription.** Elle passe par une nouvelle route `/auth/confirm` (`verifyOtp`). Sans elle, le lien de l'e-mail menait à une impasse.
13. **Petites corrections.** Mot de passe de 8 caractères minimum côté Supabase, formulations non genrées, rapports Playwright ignorés par git.

## À faire avant toute mise en ligne publique

- **Étape 3** : nettoyer le HTML des chapitres avec une liste blanche, au moment de l'enregistrement (risque XSS dès qu'un éditeur existe), et ajouter une contrainte CHECK sur `cours.couleur`.
- **Étape 4** :
  - mettre la région Vercel en UE (`cdg1` ou `fra1`) et ajouter une CSP et `frame-ancestors` ;
  - configurer Google et `NEXT_PUBLIC_SITE_URL`, au lieu de l'en-tête Origin ;
  - sur le projet hébergé : modèle d'e-mail « Confirm signup », URL de redirection et mot de passe d'au moins 8 caractères.
- **Étape 5** : bloquer l'accès des moins de 15 ans sans consentement parental, et verrouiller `moins_de_15_ans` après l'onboarding.

## Points reportés, par étape

**Étape 2 (quiz)**
- Correction côté serveur uniquement : fonction security definer dans un schéma non exposé, ou module `server-only`. Ne jamais renvoyer les corrigés avant la clôture.
- `vrai_faux` : corrigé booléen et `propositions` vides, donc l'interface affiche elle-même Vrai et Faux.
- Environ 20 questions par chapitre BPH : prévoir une règle si l'élève demande un quiz de 30 questions.
- Entourer `auth.uid()`, `role_actuel()` et `peut_lire_cours()` de `(select …)` dans les politiques. Dédupliquer `getUser()` et `lireChapitre` avec `React.cache`.
- Validation : refuser les indices en double en `qcm_multiple` et `marge_relative` sans `marge`.
- Formulaires : les garder remplis après une erreur. Vérifier le nombre de lignes modifiées par l'update du profil.
- Tests : longueur du prénom, test du proxy, `forbidOnly`, suppression des utilisateurs de test, avertissement sur `reuseExistingServer`.

**Étape 3 (enseignant et gestion du contenu)**
- Retour à la page demandée après connexion, en n'acceptant qu'un chemin relatif.
- Erreur de la requête des filières à afficher.
- Index sur `cours.filiere_id`. Trigger sur `modifie_le`.
- Import : vérifier les variables d'environnement, ne plus dépublier en cas de réimport, supprimer les éléments retirés du JSON, rendre l'import transactionnel.
- Garde `Array.isArray` sur `sections`. Éviter les collisions d'ids de section.
- Tests de format manquants. Contraste des couleurs de cours vérifié à l'enregistrement.

**Étape 4 (PWA, notifications, déploiement)**
- Le matcher du proxy doit exclure le manifest, les polices et `robots.txt`.
- Recopier les en-têtes de cache de `setAll`.
- Ajouter `aria-invalid` et `aria-describedby`.
- `:focus-visible` : retirer le `border-radius` global.
- Vérifier les variables d'environnement au démarrage.

**Étape 5 (abonnement, RGPD)**
- Message clair quand l'essai est fini (au lieu d'une 404 sur un chapitre et de « 0 chapitre » sur la carte).
- `profil.email` dupliqué.
- Tests des bornes de l'essai.
