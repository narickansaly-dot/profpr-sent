# Relecture de la banque du chapitre 4 de physique-chimie (1re) : « Avancement et bilan de matière »

Méthode : relecture indépendante à l'aveugle par un sous-agent qui a résolu les 150 questions sans voir les réponses attendues ni les explications, calculs refaits par script (`ch4-calculs.py`) ; comparaison automatique (`pc.ts comparer 4`) ; arbitrage de chaque écart par la session principale ; calculs de l'auteur vérifiés par script (`verif/ch4.py` : 89 réponses chiffrées recalculées, 0 écart).

## Résultat de la relecture à l'aveugle

- Accords sans doute : 148 / 150 ; désaccords : 0 ; accords avec doute : 2.

## Écarts et décisions

| Source | Écart ou doute | Décision |
| --- | --- | --- |
| physique-chimie-1re:ch4:banque:061 | Proposition « 2,0 mol de CH₄ et 4,0 mol de O₂ » : mélange stœchiométrique ; le cours dit qu'un réactif au moins est entièrement consommé et que c'est le réactif limitant, donc cocher cette proposition est défendable. | Corrigée : proposition remplacée par « 2,0 mol de CH₄ et 3,0 mol de O₂ » (O₂ limitant, sans ambiguïté) ; explication mise à jour. |
| physique-chimie-1re:ch4:banque:150 | Même ambiguïté : « Le sodium est le réactif limitant » dans un mélange stœchiométrique. | Corrigée : proposition remplacée par « Le sodium est le seul réactif entièrement consommé » (fausse sans discussion). |
| physique-chimie-1re:ch4:banque:087 | Doute de l'auteur : le distracteur « 0,318 g » ne correspondait à aucun calcul net. | Corrigé : « 0,313 g » = masse de cuivre des ions Cu²⁺ restants ; explication précisée. |
| physique-chimie-1re:ch4:banque:119 | Doute de l'auteur : acide éthanoïque et ions H₃O⁺, un peu au-delà des exemples du cours. | Gardée : toutes les données sont dans l'énoncé et la question porte seulement sur la comparaison de x<sub>f</sub> et x<sub>max</sub>, au programme. |

## Corrections du cours

Aucune. (Le relecteur a été interrompu par la limite d'usage avant d'écrire sa note sur le cours ; l'auteur de la banque n'a signalé aucune erreur dans le texte du chapitre.)

## Totaux

- Gardées sans changement : 147 ; corrigées : 3 (061, 087, 150) ; remplacées : 0.
- Répartition finale : types 75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; positions des bonnes réponses des `qcm_unique` 19 / 19 / 19 / 18 ; bonne réponse la plus longue 2 / 75 ; vrai/faux 15 vrais sur 30.

## Statuts

- `valide` : 150 questions.
- `a_relire` : aucune.
- `brouillon` : aucune.

Remarque de forme : x<sub>f</sub> et n<sub>f</sub> s'écrivent « xf » et « nf » dans les énoncés (pas d'indice Unicode pour « f »), alors que xₘₐₓ a un indice.
