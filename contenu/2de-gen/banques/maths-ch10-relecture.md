# Relecture de la banque du chapitre 10 de mathématiques (2de) contre le cours

Relecture des 150 questions de `maths-ch10.json` contre le texte du chapitre « Information chiffrée, statistiques et tableaux croisés » (programme de 2026). Chaque pourcentage, coefficient, moyenne et fréquence a été recalculé.

## Répartition

- Types : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte`.
- Difficultés : 60 / 60 / 30.
- Notions (9) : Proportions ; Pourcentage de pourcentage ; Évolutions et taux ; Évolutions successives et réciproques ; Moyenne et linéarité ; Écart type et dispersion ; Séries regroupées en classes ; Tableaux croisés ; Fréquences conditionnelles.

## Points de doute

| Énoncé | Doute | Proposition |
| --- | --- | --- |
| Réponses courtes en pourcentage (« Réponds par un nombre (sans le signe %) ») | Le guide signale que « 70 % » et « 70% » sont deux textes différents ; demander le nombre seul évite le problème. | Conforme. |
| Questions « d'après le tableau du cours » (tableau croisé des 400 élèves, tableau des tailles) | Le tableau n'est pas affiché dans le quiz. | Garder pour la révision ; recopier les effectifs dans l'énoncé si ces questions servent en évaluation. |
| Estimation de la médiane d'une série en classes (cours) | Le cours place la médiane entre la 15ᵉ et la 16ᵉ valeur (position 15,5) ; d'autres manuels prennent N/2 = 15. L'écart (171,3 contre 170,8 cm) est sans conséquence : aucune question ne demande cette valeur. | À harmoniser avec le manuel de la classe. |
| « Pour une série en cloche, environ 95 % des valeurs dans [x̄ − 2s ; x̄ + 2s] » | Ordre de grandeur, présenté comme tel ; le programme de 2026 ne le mentionne plus explicitement (il figurait en 2019). | Garder ou retirer. |
| Filtre Python avec `and`, `or`, `not` | Le programme de 2026 cite cet exemple d'algorithme à partir de deux listes ; la question ne demande pas de manipuler de liste. | Conforme. |

## Texte du cours

- Les fonctions Python `moyenne` et `ecart_type` utilisent `sum` et `len` sur une liste : le programme précise qu'aucune connaissance sur les listes n'est exigée ; le cours les présente en lecture seule.
- Pas d'histogramme dessiné : un tableau d'effectifs le remplace. Un SVG pourrait être ajouté.
