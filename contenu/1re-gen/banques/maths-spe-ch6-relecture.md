# Relecture de la banque du chapitre 6 (spécialité maths, 1re) : variations, extremums et courbes

Banque : `maths-spe-ch6.json`, 150 questions, sources `maths-spe-1re:ch6:banque:001` à `150`.

## Méthode

1. **Rédaction** : questions générées par script Python ; extremums, volumes, coûts moyens, itérés de Newton et contre-exemples contrôlés par des assertions ; distracteurs et items des QCM multiples relus à la main.
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant chaque calcul avec Python (sympy, fractions), et a signalé les ambiguïtés.
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord.
- 6 doutes signalés malgré l'accord :

| Question | Doute | Décision |
| --- | --- | --- |
| 021 | Maximum 5 atteint deux fois (en 1 et en 4) | Maintenue : la question porte sur la valeur du maximum, unique. |
| 023 | Suppose f strictement monotone sur chaque morceau | Maintenue : « décroît » et « croît » sont pris au sens strict, comme dans le cours. |
| 092 | « Au-dessus sur ℝ » vrai seulement au sens large (contact en 2) | **Reformulée** : « la courbe de f n'est jamais au-dessous de celle de g » ; explication complétée. |
| 095 | Même difficulté (contact en 1 avec la tangente) | **Reformulée** : « la parabole n'est jamais au-dessous de cette tangente ». |
| 125 | « f est paire » : le « pour tout » est dans la définition, pas dans la phrase | **Corrigée** : proposition remplacée par « il existe un réel dont le carré vaut 3 » (existentielle) ; bonnes réponses 1 et 3 ; explication réécrite. |
| 150 | Accepter 2,5 et 2.5 | Déjà le cas (et 5/2). |

## Points de doute du rédacteur

- Q010 : l'item « f′(1) = 0 » suppose f dérivable sur ]−5 ; 5[, ce que précise l'énoncé.
- Q123, Q131 : vocabulaire de logique, confirmés par le relecteur.

## Statut

Après corrections, aucune question douteuse restante : les 150 questions passent en `valide`.
