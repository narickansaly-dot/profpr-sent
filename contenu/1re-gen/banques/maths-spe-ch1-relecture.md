# Relecture de la banque du chapitre 1 (spécialité maths, 1re) : suites numériques

Banque : `maths-spe-ch1.json`, 150 questions, sources `maths-spe-1re:ch1:banque:001` à `150`.

## Méthode

1. **Rédaction** : questions générées par script Python ; valeurs des bonnes réponses et des distracteurs chiffrés recalculées ; tous les programmes Python (cours et énoncés) exécutés avec `exec`.
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant chaque calcul et en exécutant chaque programme, et a signalé les ambiguïtés.
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord.
- 7 doutes signalés malgré l'accord, tous examinés, aucune correction nécessaire :

| Question | Doute | Décision |
| --- | --- | --- |
| 005, 009 | « u_n + 1 » et « u_(n+1) » ne diffèrent que par les parenthèses | Maintenues : c'est précisément la distinction travaillée (erreur classique) ; les énoncés en texte brut l'affichent fidèlement. |
| 073 | Construction en escalier : on lit aussi u_(n+1) en ordonnée sur la courbe | Maintenue : les termes sont reportés sur l'axe des abscisses ; le distracteur dit « uniquement sur l'axe des ordonnées », faux. |
| 081 | Piège un peu artificiel (un seul entier dans [0 ; 0,4]) | Maintenue (affirmation fausse, justifiée dans l'explication). |
| 082 | Accepter « -3 » et « −3 » | Déjà le cas. |
| 101 | « Croissante à partir d'un rang » un peu au-delà du programme | Maintenue (difficulté 3 ; la définition est donnée dans l'énoncé). |
| 102 | Accepter 0,5, 0.5, 1/2 | Déjà le cas. |

## Points de doute du rédacteur

- Construction en escalier ajoutée (non citée par le programme) pour le registre graphique [C14].
- T_n = n(n + 1)/2 admis ici, démontré au chapitre 2.
- Code Python des énoncés avec le tiret ASCII « - » comme signe moins.
- Trois questions de difficulté 3 demandent des calculs un peu longs sans calculatrice (seuil n = 34, croissance à partir du rang 4, seuil de 0,8ⁿ).

## Statut

Aucune question douteuse restante : les 150 questions passent en `valide`.
