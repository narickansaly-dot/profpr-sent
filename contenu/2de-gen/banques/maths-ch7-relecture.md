# Relecture de la banque du chapitre 7 de mathématiques (2de) contre le cours

Relecture des 150 questions de `maths-ch7.json` contre le texte du chapitre « Droites du plan et systèmes d'équations », question par question. Mêmes critères qu'aux chapitres précédents ; chaque équation, pente, point d'intersection et système a été vérifié en remplaçant les coordonnées.

## Répartition

- Types : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte`.
- Difficultés : 60 / 60 / 30.
- Notions (9) : Vecteur directeur ; Équation cartésienne ; Équation réduite ; Pente ; Tracer et lire une droite ; Alignement ; Droites parallèles ou sécantes ; Systèmes linéaires ; Point d'intersection.

## Corrections faites pendant la rédaction

- Sept questions de difficulté 3 retirées pour l'équilibre (dont « Pourquoi le test det == 0 peut-il échouer avec des flottants ? », jugée hors des attendus, et la question sur la démonstration de la forme générale, redondante avec la question sur le déterminant).
- Six énoncés trop proches reformulés.

## Points de doute

| Énoncé | Doute | Proposition |
| --- | --- | --- |
| « Que renvoie equation(1, 2, 4, 3) ? » → « (1, -3, 5) » | Python affiche bien `(1, -3, 5)` (tuple) ; l'élève doit savoir qu'une fonction peut renvoyer plusieurs valeurs, ce que le chapitre 3 ne détaille pas. | Garder en difficulté 3, ou retirer. |
| Notation des indices dans les énoncés (« x_B − x_A ») | Le texte brut ne permet pas l'indice ; le cours utilise `<sub>`. | Garder ; à harmoniser si l'affichage des énoncés évolue. |
| Réponses courtes négatives (« −9 », « −3 », « m = −3 ») | Variantes avec trait d'union et signe moins typographique. | Conforme. |
| Problème « cahiers et stylos » (QCM, c = 2,5) | Énoncé en décimaux ; la réponse est une proposition, pas une saisie. | Conforme. |

## Texte du cours

- Les fonctions Python `alignes` et `equation` réalisent les exemples d'algorithme [A6] et [A7].
- Le système est affiché sur deux lignes avec `<br>` (pas d'accolade : aucun moyen de la dessiner proprement avec le HTML autorisé).

## Mise à jour d'après le programme de 2026

Le programme de 2026 retire la résolution des systèmes de deux équations à deux inconnues ; il demande seulement le point d'intersection de deux droites sécantes données par leur équation réduite.

- Section « Systèmes de deux équations à deux inconnues » remplacée par « Point d'intersection de deux droites » (égalité des ordonnées), avec une mention « pour aller plus loin » des systèmes. Chapitre renommé « Droites du plan ».
- Les 22 questions de la notion « Systèmes linéaires » ont été remplacées par 22 questions « Intersection par le calcul » (problèmes de tarifs, de rattrapage, droites parallèles ou confondues), avec la même répartition.
- Reste dans la notion « Point d'intersection » une question avec des équations cartésiennes (x + y = 4 et 2x − y = 5), à la limite du nouveau programme : **point à trancher**.
