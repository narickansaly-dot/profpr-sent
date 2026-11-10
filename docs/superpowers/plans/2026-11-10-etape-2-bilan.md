# Étape 2 : bilan et points reportés

État final sur la branche `etape-2-quiz` :
- 55 tests unitaires (Vitest) ;
- 187 tests de la base (pgTAP, 7 fichiers) ;
- 10 parcours de bout en bout (Playwright, sur mobile et sur ordinateur, avec un build de production) ;
- typage, lint et build sans erreur.

## Ce qui a été livré

- **Quiz de chapitre** : 15, 20 ou 30 questions tirées dans l'ordre suivant : jamais vues, puis ratées, puis les autres. Une seule tentative ouverte par chapitre. Ordre des propositions mélangé. Validation à 75 %. Correction détaillée une fois le quiz terminé.
- **Évaluation de cours** : se débloque quand tous les chapitres sont validés. 40 questions réparties entre les chapitres, 60 minutes contrôlées par le serveur, 3 essais, 24 h d'attente entre deux essais. Une évaluation expirée est corrigée avec les réponses déjà données et datée de sa limite.
- **Correction dans la base**, dans un schéma `prive` non exposé :
  - QCM sans point partiel ;
  - réponses courtes tolérantes sur les accents, la casse et la ponctuation, mais pas sur les charges d'ions, le signe % ou le signe ° (« Na+ » reste différent de « Na ») ;
  - nombres acceptés avec une virgule ou un point, avec une marge éventuelle.
- **Tableau de bord** : progression par cours, notes d'examen, derniers quiz, points faibles avec un bouton « Réviser », série de jours.
- **Lecteur** :
  - une question par écran ;
  - enregistrement immédiat, mis en file pour chaque question ;
  - renvoi automatique des réponses en attente ;
  - reprise après rechargement ;
  - focus géré au clavier ;
  - chrono annoncé aux lecteurs d'écran.

## Failles trouvées par les revues et corrigées

1. **Lire les 40 réponses pendant une évaluation**, de trois façons différentes :
   - en lançant puis en terminant des quiz de chapitre, et en lisant leurs corrections ;
   - en lisant la correction d'un essai d'évaluation précédent ;
   - en lisant directement la table `tentative_question` (permutation, réponse, juste ou faux).

   Pendant une évaluation, les quiz et les corrections du même cours sont maintenant bloqués. Les colonnes sensibles ne sont plus lisibles par les élèves.
2. **Ordre d'origine des propositions lisible.** Dans le contenu BPH, la bonne réponse est très souvent en 2e position. Les élèves ne lisent plus `question.enonce` ni `question.propositions` directement : les quiz passent uniquement par les fonctions.
3. **Suppression d'un contenu qui effaçait les notes des élèves** (cascade). Elle est maintenant refusée (`on delete restrict`).
4. **Réponses perdues** :
   - erreurs réseau non rattrapées ;
   - texte non enregistré quand l'élève quitte le champ ;
   - enregistrements dans le désordre ;
   - réponses jamais renvoyées.
5. **Dates d'évaluation et délai d'attente** calculés au moment de la clôture plutôt qu'à la date limite.

## Décisions prises pendant l'exécution

- **Tentatives** : une seule tentative ouverte par chapitre. Relancer un quiz reprend celle qui est en cours.
- **Accès au contenu** :
  - les élèves ne lisent de `question` que `id, chapitre_id, notion_id, type, statut, difficulte` ;
  - de `tentative_question`, ils ne lisent que `tentative_id, ordre, question_id, repondu_le`.
- **Évaluation** :
  - pendant une évaluation ouverte, les quiz de chapitre et les corrections des autres tentatives du même cours sont refusés (`evaluation_en_cours`) ;
  - une évaluation expirée prend fin à sa date limite, pas au moment où elle est clôturée ;
  - l'ordre final des 40 questions est mélangé.
- **Base de données** : les contenus liés à des résultats ne peuvent plus être supprimés. Il faut les dépublier.
- **Correction** :
  - `normaliser` ne retire en début et en fin de réponse que les espaces, les guillemets et la ponctuation de phrase ;
  - `en_nombre` n'accepte que des nombres décimaux simples.
- **Interface** :
  - la page cours, la page chapitre et le tableau de bord restent affichés même si la progression ne se charge pas ;
  - une page d'erreur commune a été ajoutée ;
  - les tests de bout en bout tournent sur un build de production et suppriment leurs comptes, avec une garde « base locale uniquement ».

## À trancher par toi

- **Apprendre les réponses par l'entraînement.** Les essais sont illimités et la correction est détaillée, comme le demande la spec. Avec seulement 20 questions par chapitre BPH, un élève peut donc apprendre les réponses en enchaînant les quiz. Les protections actuelles (un quiz ouvert par chapitre, évaluation verrouillée) limitent la triche, mais le vrai remède reste des banques d'environ 150 questions (étape 6). Autre piste : ne montrer les bonnes réponses qu'à partir d'un certain nombre d'essais.

## Points reportés, par étape

**Étape 3 (enseignant et éditeur)**
- L'éditeur doit passer par des fonctions `security definer` : les droits par colonne ne distinguent pas l'admin de l'élève.
- Bloquer ou versionner une question déjà utilisée dans des tentatives, sinon les permutations enregistrées ne correspondent plus.
- Interdire de déplacer vers un autre cours un chapitre qui a des résultats.
- Les nouvelles règles « enseignant » ne doivent pas réexposer `reponse` ni `permutation`.
- `peut_lire_cours` autorise aujourd'hui les enseignants à passer des quiz.
- Rattraper l'erreur 23505 quand deux `demarrer_quiz` ou `demarrer_evaluation` arrivent en même temps, et renvoyer la tentative ouverte.
- Retirer `security definer` de `prive.cloturer` et de `cloturer_si_expiree`.
- Guide pour les auteurs : séparateurs de milliers, « Na + » et « K⁺ », première valeur numérique des réponses acceptées.
- Tests unitaires des actions et des requêtes.
- Message d'erreur précis sur la page de résultat.
- Sélecteurs de test par rôle.
- Tester le chemin « réponse courte » dans un navigateur avant le premier contenu de ce type.

**Étape 4 (PWA, déploiement, accessibilité)**
- Annoncer « Question n / N » aux lecteurs d'écran.
- Contraste en mode sombre de la pastille de matière et de la piste de la barre.
- Légende flottante à tester sur Safari iOS.
- Quand toutes les réponses sont données, reprendre sur la dernière question.
- Le marqueur « lu » se déclenche vite sur les chapitres courts.
- Vérifier la version Postgres du projet hébergé : le droit MAINTAIN demande Postgres 17.

**Étape 5 (abonnement, RGPD)**
- Une tentative commencée pendant l'essai reste utilisable après la fin de l'essai.
- La reprise est impossible si l'essai expire pendant une évaluation.

**Étape 6 (contenu)**
- Banques d'environ 150 questions par chapitre. Rééquilibrer la position des bonnes réponses dans les QCM BPH.
- Révision ciblée par notion : le bouton « Réviser » vise aujourd'hui tout le chapitre.
- Définir « ratée » comme « ratée la dernière fois », et non plus « ratée au moins une fois ».

**Petits points ouverts dans le lecteur**
- Un texte retapé pendant un enregistrement déjà en cours peut être perdu si le chrono expire à cet instant précis.
- L'alerte « Non enregistré » peut rester affichée tant que le champ texte a le focus.
