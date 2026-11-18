# Relecture de la banque du chapitre 8 de NSI (gloutons et k plus proches voisins)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et les a résolues lui-même. Il a recopié du cours rendu_monnaie, sac_glouton, distance et knn et les a **exécutées en Python** sur une soixantaine de calculs : 9 rendus en euros, 13 rendus dans d'autres systèmes, la canonicité de 5 systèmes, deux sacs à dos (glouton, autres critères, **optimum exact par force brute** avec itertools), 14 distances et 15 votes. Dates vérifiées : Fisher 1936, Fix et Hodges 1951, Cover et Hart 1967, Kruskal, Prim et Dijkstra 1956-1959. Comparaison automatique ensuite.

**Résultat.** 150 réponses identiques sur 150. Huit remarques, dont une erreur de conception importante, corrigée.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| 064, 100, 133, 148 | **Ex aequo** : X (5 kg, 10 €) et Z (3 kg, 6 €) avaient le même rapport valeur/masse (2). Selon l'ordre de départage, le glouton obtenait 10 € ou 13 € : deux réponses défendables. | **Données changées** : Z vaut désormais 5 € (rapport 1,67). Glouton : X seul, 10 € ; optimum : Y + Z, 12 € ; vérifié en Python (glouton et force brute). Valeurs des propositions mises à jour (12, 15, 22 €). La 133 (vrai/faux) affirme désormais « optimum 12 € ». |
| 047 | Le distracteur « 4 » vaut 4.0 en Python. | Remplacé par « 2.0 ». |
| 138 | Variante « gloutonne ». | Ajoutée. |

## Remarques sans changement

- 115 : « toujours la classe la plus nombreuse » ne tient pas en cas d'égalité entre classes ; c'est la formulation du cours, gardée (cas limite marginal).
- 147 : « supervisé » seul était déjà accepté.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; positions 18 / 19 / 19 / 19 ; bonne réponse strictement la plus longue dans 24 QCM sur 75 (après allongement de douze distracteurs).
- Avant la relecture, une proposition de la question sur les pièces 1, 3, 4 (« 9, rendu 4 + 4 + 1 ») était marquée fausse alors que ce rendu est optimal : corrigée (bonne réponse).

## Points restants

Les quatre questions du sac X, Y, Z ont été réécrites après la relecture ; leurs nouvelles valeurs ont été vérifiées en Python. Toutes les questions peuvent passer au statut `valide`.
