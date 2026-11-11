# Relecture de la banque du chapitre 9 de mathématiques (2de) contre le cours

Relecture des 150 questions de `maths-ch9.json` contre le texte du chapitre « Variations, extremums et optimisation » (programme de 2026). Mêmes critères qu'aux chapitres précédents ; chaque lecture du tableau de variations du cours, chaque extremum et chaque comparaison ont été vérifiés.

## Répartition

- Types : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte`.
- Difficultés : 60 / 60 / 30.
- Notions (9) : Sens de variation ; Tableau de variations ; Maximum et minimum ; Variations des fonctions affines ; Fonctions carré et valeur absolue ; Fonction inverse ; Comparer des images ; Optimisation ; Balayage et dichotomie.

## Points de doute

| Énoncé | Doute | Proposition |
| --- | --- | --- |
| Questions « d'après le tableau du cours » (une dizaine) | Elles supposent que l'élève a le tableau sous les yeux ; dans un quiz, le tableau n'est pas affiché (les énoncés sont du texte brut). | Garder pour les quiz de révision ; à retirer des évaluations, ou recopier les valeurs dans l'énoncé (fait pour la fonction g et la fonction h). |
| Nombre de solutions de f(x) = k lu sur un tableau | Repose sur le fait (admis dans le cours) que les courbes sont tracées d'un seul trait ; le théorème des valeurs intermédiaires n'est pas au programme. | Garder. |
| « On balaie [0 ; 1] avec un pas de 0,1 pour f(x) = x(1 − x) » | En Python, les pas flottants peuvent produire 0,30000000000000004 ; le maximum trouvé reste 0,5 (à l'arrondi près). | Garder (difficulté 3). |
| Bénéfice B(q) = −q² + 60q − 500 | Forme canonique fournie dans la seconde question ; la première demande de la trouver (difficulté 3). | Garder. |

## Texte du cours

- Le tableau de variations est un tableau HTML avec des flèches ↗ et ↘ : il n'est pas possible de placer les valeurs en haut et en bas des flèches comme sur papier.
- Les démonstrations des variations des fonctions affines, carré et inverse, et la position de y = x et y = x², sont celles du programme de 2026 ([D8] à [D10]).
