# Relecture de la banque du chapitre 4 de mathématiques (2de) contre le cours

Relecture des 150 questions de `maths-ch4.json` contre le texte du chapitre « Puissances, racines carrées et calcul littéral », question par question. Mêmes critères qu'aux chapitres précédents ; chaque développement et chaque factorisation ont été refaits à la main.

## Répartition

- Types : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte`.
- Difficultés : 60 / 60 / 30.
- Notions (9) : Puissances ; Écriture scientifique ; Racines carrées ; Développer et réduire ; Identités remarquables ; Factoriser ; Choisir la forme adaptée ; Expressions fractionnaires ; Exprimer une variable.

## Corrections faites pendant la rédaction

| Énoncé | Problème | Décision |
| --- | --- | --- |
| QCM multiple « Quelles écritures donnent le nombre 2√6 ? » | La proposition « 6/√6 × 2 » avait deux lectures (2√6 ou √6/2). | Remplacée par « √6 + √6 ». |
| Énoncés génériques (« Quelles égalités sont vraies ? » trois fois, « Quelles expressions sont égales à … ? » quatre fois) | Similarité supérieure à 0,8, ou égale à 1. | Reformulés avec le thème de la question. |

## Points de doute

| Énoncé | Doute | Proposition |
| --- | --- | --- |
| Écriture des puissances dans les énoncés (2⁵, 10⁻³, a⁻¹) | Les énoncés sont du texte brut : les exposants sont des caractères Unicode en exposant (⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿ). Ils s'affichent bien sur les systèmes courants, mais un exposant comme « n−p » ne peut pas s'écrire ainsi ; le cours utilise `<sup>`. | Garder ; à vérifier sur les téléphones des élèves. |
| « Écris 2⁻² sous forme décimale » (réponse courte) | Réponses acceptées 0,25 et 0.25 ; « 1/4 » est refusé, alors qu'il est juste. | Ajouter « 1/4 » si l'enseignant le souhaite (l'énoncé demande la forme décimale). |
| « Calcule 99² sans calculatrice. Réponds par un nombre sans espace. » | Le guide interdit l'espace des milliers dans la réponse ; l'énoncé le précise. | Conforme. |
| « Quelle est la hauteur d'un cylindre de volume 500 cm³ et de rayon 5 cm, arrondie au dixième ? » | La réponse dépend de l'arrondi demandé (6,4 cm) ; le QCM évite la marge. | Garder. |
| « On développe (x + 5)(x − 2) = x² + bx − 10. Donne b. » et semblables | Réponses courtes numériques seules : la marge n'est pas utile (entiers). | Conforme. |
| Comparaison par différence ou quotient (section « Expressions fractionnaires ») | Annoncée au chapitre 4, reprise au chapitre 5 : deux questions seulement ici. | Garder. |

## Texte du cours

- Les fractions sont écrites en ligne (a/b) : le HTML autorisé n'a pas de mise en forme de fraction ; les puissances utilisent `<sup>`.
- Le programme Python `premiere_puissance` réalise l'exemple d'algorithme [A5] du programme.
- L'illustration géométrique de (a + b)² est un SVG.
