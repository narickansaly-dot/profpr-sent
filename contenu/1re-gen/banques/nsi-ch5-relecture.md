# Relecture de la banque du chapitre 5 de NSI (p-uplets, tableaux, dictionnaires)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et les a résolues lui-même. Il a **exécuté en Python 169 extraits** : tous les programmes des énoncés et toutes les propositions évaluables des QCM (alias et copies, grilles [[0] * 2] * 2, compréhensions, dictionnaires d'occurrences, items, get…). Comparaison automatique ensuite.

**Résultat.** 150 réponses identiques sur 150. Quatorze remarques ; corrections dans la banque et trois ajouts au texte du cours.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| 067, 134 | Compréhension à deux for absente du cours. | **Cours complété** (section « Construire un tableau par compréhension »), avec cet exemple. |
| 100, 133 | Copie superficielle : le cours présentait list(a) comme une « copie indépendante » sans nuance ; un élève qui s'y fie répondrait faux à 133. | **Cours corrigé** : list(a) fait une copie superficielle ; les lignes d'une matrice restent partagées. |
| 103, 105, 135, 147, 148 | sum, min et max absents du cours. | **Cours complété** (section « Les tableaux »). |
| 071 | Énoncé sur une ligne confus (dictionnaire non nommé, « is None » absent du cours). | Réécrite : d = {"x": 5, "y": 9, "z": 2}, m = "x", for k in d: if d[k] > d[m]: m = k ; réponse "y" vérifiée en Python. |
| 131 | Vrai/faux piégeux : la première moitié reprenait le cours. | Réécrite : « … doit exécuter deux instructions return » (faux, un seul return suffit). |
| 138, 139, 140 | Variantes « 0,9 », « append() », « keys() ». | Ajoutées. |

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; positions 19 / 19 / 19 / 18 ; bonne réponse strictement la plus longue dans 11 QCM sur 75.

## Points restants

Aucun : toutes les questions peuvent passer au statut `valide`.
