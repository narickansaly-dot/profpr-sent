# Étape 5b : bilan et points reportés

État final sur la branche `etape-5b-parents` :
- 440 tests unitaires (Vitest, 47 fichiers) ;
- 949 tests de la base (pgTAP, 33 fichiers) ;
- 70 exécutions de bout en bout (Playwright : 35 parcours, sur mobile et sur ordinateur, avec un build de production) : 63 réussies et 7 ignorées (la revue axe ne tourne que sur mobile), dont 5 nouveaux parcours ;
- typage et build sans erreur ; lint sans erreur (un avertissement `no-unused-vars` dans `src/app/mes-donnees/actions.ts`).

Commandes : `npm run db:reset`, `npm run test:db`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run e2e`.

## Ce qui a été livré

- **Comptes parents** : choix « Parent d'un élève » à l'inscription (RPC `devenir_parent`, refusée après une activité d'élève). Un parent n'a accès à aucun cours (`prive.acces_cours` ne l'ouvre qu'aux élèves, enseignants et admins).
- **Liaison** : par l'adresse qui a reçu la demande d'accord (`lier_par_email`, élèves de moins de 15 ans) ou par un code que l'élève de plus de 15 ans crée dans « Mes données » (`lier_par_code` : 8 caractères, 48 heures, usage unique, empreinte seule stockée, 5 essais par heure et par compte parent). Au plus deux parents par élève.
- **Suivi** : `/parent` (« Mes enfants », cartes, code) et `/parent/enfant/<id>` (progression par cours), par des RPC qui ne renvoient que les enfants reliés au parent appelant.
- **Retrait de l'accord** : le parent bloque le compte de son enfant (suppression à J+30), peut annuler le retrait, ou cesser de suivre l'enfant. Côté élève, `/consentement` affiche « Ton parent a retiré son accord » ; l'élève peut encore exporter ses données. L'élève peut délier un parent depuis « Mes données ».
- **Fondations des abonnements** (sans Stripe) : table `abonnement`, `prive.abonnement_actif`, abonné actif ou en délai de grâce = tous les cours, bannière « Le paiement de ton abonnement a échoué… ».
- **Pages légales** : trame des conditions de vente (`/conditions-vente`), lien dans le pied de page.
- **Export et purges** : l'export inclut parents et enfants ; les purges quotidiennes couvrent les nouvelles tables.
- **Parcours de bout en bout** : `e2e/parents.spec.ts` (accord puis compte parent, suivi, retrait et annulation ; code, liste côté élève, déliaison ; abonné puis délai de grâce), revue axe et CSP étendues (`/parent`, `/parent/enfant/<id>`, `/conditions-vente`). Aides : `confirmerEmail`, `simulerAbonnement`, `inscrireParent`, `relierParentEtEnfant`.

## Décisions prises dans le plan

1. Fonctions longues étendues sans recopie : l'ancienne devient `prive.<nom>_5a` (sans droit), la nouvelle la rappelle.
2. `lier_par_code` renvoie un statut (`lie`, `code_parent_invalide`, `essais_code_epuises`) plutôt qu'une exception, pour ne pas annuler le compteur d'essais.
3. Un compte parent n'a accès à aucun cours.
4. Nouveaux codes d'erreur : `reserve_15_ans`, `lien_introuvable`, `retrait_impossible`, `nom_parent_invalide`.
5. Annuler un retrait efface toute demande de suppression du compte de l'enfant.
6. Code parent : 31 signes, 8 caractères, sans casse, espaces ni tirets, affiché `ABCD-EFGH`.

## Écarts pendant l'exécution

Aucun défaut d'application n'est apparu pendant les parcours de bout en bout. Seul ajustement de test : le slug du cours `e2e-…` du parcours « abonné » porte un suffixe aléatoire, car les projets mobile et ordinateur tournent en parallèle et `Date.now()` seul entrait en collision.

## Limites connues et acceptées

- Spec § 12 : un élève peut créer lui-même un compte « parent » avec une seconde adresse (la fraude est plus visible, pas empêchée) ; le parent d'un moins de 15 ans doit s'inscrire avec l'adresse qui a reçu la demande d'accord, sinon il n'est pas relié (la page `/parent` le lui indique) ; les abonnements ne sont pas alimentés.
- Annuler un retrait efface aussi une demande de suppression faite par l'élève lui-même (décision 5).
- Si le parent qui a retiré l'accord supprime son propre compte, plus personne ne peut annuler le retrait (`retire_par` passe à nul) ; le compte de l'enfant est supprimé à J+30.
- Code parent : 5 essais par heure et par compte parent, 31⁸ codes, 48 h de validité ; une attaque par de très nombreux comptes parents reste théorique.
- La liaison par adresse suppose la confirmation d'e-mail activée en production (`docs/mise-en-ligne.md`). Localement, `enable_confirmations = false`.
- Aucun abonnement ne peut encore être créé hors des tests (étape 5c : Stripe).
- Les conditions de vente sont une trame à compléter et à faire relire par un juriste, comme les autres pages légales.

## Mise en ligne

- Aucune nouvelle variable d'environnement.
- Appliquer les trois migrations `20261229000001_abonnement.sql`, `20261229000002_parents.sql` et `20261229000003_suivi_parent.sql`.

## Revue finale

À faire : revue Opus de toute la branche depuis `etape-5a-rgpd` et `security-review` (menées par le contrôleur).
