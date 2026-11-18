# Relecture de la banque du chapitre 7 de NSI (parcours, tris, dichotomie)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et les a résolues lui-même. Il a recopié du cours les fonctions recherche, maximum, moyenne, tri_selection, tri_insertion et dichotomie, les a **instrumentées** (états du tableau après chaque tour, comparaisons entre éléments, indices m examinés, nombre de tours, échanges) et **exécutées en Python** sur environ 45 cas : tous les déroulés et comptages des énoncés, la variante fautive g = m (boucle infinie confirmée), l'algorithme d'Euclide, n // 2, etc. Comparaison automatique ensuite.

**Résultat.** 150 réponses justes sur 150 (la 140 a été répondue « 7.0 », acceptée par la comparaison numérique avec « 7 »). Douze remarques ; corrections dans la banque et trois ajouts au texte du cours.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| nsi-1re:ch7:banque:006 | Le distracteur « 10 » vaut 10.0 en Python. | Remplacé par « 12.0 ». |
| 016 | Énoncé « Quel est l'intérêt… ? » mal accordé aux propositions « À… ». | Reformulé : « À quoi sert-il de… ? ». |
| 050, 051, 114, 120 | « Comparaisons » ambigu pour la dichotomie (un ou deux tests par tour). | Énoncés et propositions en « tours de boucle » ; **cours précisé**. |
| 074 | Nombre d'échanges du tri par sélection absent du cours. | **Cours complété** : n − 1 échanges, un par tour. |
| 077 | « ce minimum » renvoyait à une autre proposition. | Reformulée : « le minimum trouvé ». |
| 096 | Dichotomie sur des chaînes non traitée dans le cours. | **Cours complété**. |
| 149 | Règle du nombre maximal de tours absente du cours (log₂ 100 ≈ 6,6). | **Cours complété** : nombre de chiffres de n en binaire (7 pour 100, 10 pour 1 000, 20 pour un million). |

## Remarques sans changement

- 115 : d − g devient −1 à la sortie ; le cours indique « d − g (ou la taille d − g + 1) », ce qui suffit.
- 138, 139 (« un variant », « invariant de boucle ») : variantes déjà acceptées. 140 : « 7 » et « 7.0 » acceptés.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; positions 19 / 19 / 19 / 18 ; bonne réponse strictement la plus longue dans 28 QCM sur 75.

## Points restants

Aucun : toutes les questions peuvent passer au statut `valide`.
