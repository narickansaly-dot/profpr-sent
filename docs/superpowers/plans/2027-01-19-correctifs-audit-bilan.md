# Correctifs des audits de sécurité et d'accessibilité : bilan et points restants

État final sur la branche `correctifs-audit` :
- 514 tests unitaires (Vitest, 53 fichiers) ;
- 1086 tests de la base (pgTAP, 39 fichiers) ;
- 82 exécutions de bout en bout (Playwright, mobile et ordinateur, build de production) : 72 réussies et 10 ignorées (la revue axe ne tourne que sur mobile) ;
- typage et build sans erreur ; lint sans erreur (le même avertissement `no-unused-vars` dans `src/app/mes-donnees/actions.ts`) ;
- `npm run import:contenu -- contenu/1re-st2s/bph.json --garder-statuts`, rejoué après `npm run db:reset` : 1050 questions inchangées, rien de créé, modifié ni versionné.

Commandes : `npm run db:reset`, `npm run test:db`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run e2e`.

Rapports d'audit : `docs/audits/2027-01-12-audit-securite.md` et `docs/audits/2027-01-12-audit-accessibilite.md`, avec en tête une section « Suites données ».

## Ce qui est corrigé

- **Aucun traitement d'un élève sans accord parental (sécurité I1)** (`bb726c2`, `672f832`, migrations `20270119000001` et `20270119000004`) : garde `consentement_requis` sur 5 écritures (rejoindre une classe, enregistrer un événement, accepter un plan de révision, créer un jeton iCal, enregistrer un abonnement push) ; filtres sur les lectures de l'enseignant (`suivi_classe`, `notes_classe`, `questions_ratees_classe`), sur la planification des rappels et sur l'iCal ; les notifications déjà en attente sont retirées après un retrait d'accord. Réversible : l'annulation du retrait rétablit tout.
- **Effacement et droits par défaut (sécurité I2, M2, M4, M5)** (`f420979`, migration `20270119000005`) : la purge supprime les lignes du journal d'audit d'Auth du compte effacé et applique une rétention de 90 jours ; l'adresse d'un parent qui n'a pas donné son accord est effacée 30 jours après la demande ; écritures sur `niveau` retirées ; droits par défaut des tables retirés à `anon` et `authenticated` ; `profil.email` recopié par un déclencheur sur `auth.users`. La page de confidentialité indique les durées (journal de connexion de l'application : 90 jours ; journaux de la plateforme d'hébergement : toujours « [À compléter] »).
- **Export complet (sécurité M6)** (`97d47bd`, `8999fa8`, migration `20270119000006`) : déliaisons, jeton iCal (date), code parent (échéance), retraits faits, compteurs d'envoi de l'accord, données de connexion. L'assertion e2e sur les secrets est renforcée (clés d'empreinte, jetons et chaînes de 43 caractères interdits).
- **Accessibilité (I1, I2, I4, I5, I6, M2)** (`a95e71b`, `6219fc0`) : page 404 en français, avec repères et lien de retour ; `--danger` à 6,00:1 ; bordures de champs à 3:1 au moins (`--bord-champ`) ; anneau de focus à double trait ; cibles de 44 px pour les liens isolés (`.lien-action`) ; lien d'évitement « Aller au contenu ».

## Migrations

- `20270119000001` : gardes et filtres d'accord (10 fonctions).
- `20270119000004` : `prive.notification_encore_valide` tient compte de l'accord.
- `20270119000005` : purge du journal d'audit, rétention de 90 jours, effacement des adresses de parents, droits sur `niveau` et par défaut, déclencheur de l'adresse.
- `20270119000006` : `exporter_mes_donnees()` complète.

Décision du contrôleur : les numéros `000005` et `000006` remplacent `000002` et `000003` prévus au plan, pour respecter l'ordre des noms de fichier après `000004`. À appliquer avant la mise en ligne.

## Constats reportés

Sécurité :
- **M1** : mise à jour directe du profil (`onboarding_termine`, `demande_enseignant`) ; il faut passer l'onboarding par une RPC.
- **M3** : relais de spam par l'e-mail d'accord ; le CAPTCHA demande le compte du fournisseur de l'utilisateur.
- Course très étroite dans la purge (liste des comptes purgés, puis suppression du journal) ; la rétention de 90 jours la rattrape.
- Droits par défaut des fonctions et des séquences : non modifiés.
- Politique RLS enseignant « inscriptions visibles » : expose encore `eleve_id` et `rejoint_le` d'un élève retiré (ni nom ni résultats).
- Planification des rappels : les insertions 3 (nouvel essai) et 4 (révision du jour) n'ont pas d'assertion dédiée.

Accessibilité :
- **I3** : focus perdu après l'envoi d'environ 30 formulaires ; il faut un composant d'envoi partagé (décision de conception).
- Mineurs : espaces insécables dans les textes de l'interface, absence de `loading.tsx`, textes de 12 à 13 px, focus à l'arrivée sur la correction d'un quiz, « tu » et « vous » dans les CGV.
- Le `box-shadow` du focus remplace les ombres propres des éléments.

## Mise en ligne

- Appliquer les migrations `20270119000001`, `20270119000004`, `20270119000005` et `20270119000006`.
- Compléter dans la page de confidentialité la durée de conservation des journaux de la plateforme d'hébergement (Vercel, plateforme Supabase).
