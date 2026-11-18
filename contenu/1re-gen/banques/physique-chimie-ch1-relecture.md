# Relecture de la banque du chapitre 1 de physique-chimie (1re) : « Mesure et incertitudes »

Méthode : relecture indépendante à l'aveugle par un sous-agent qui a résolu les 150 questions sans voir les réponses attendues ni les explications, calculs refaits par script ; comparaison automatique (`pc.ts comparer 1`) ; arbitrage de chaque écart par la session principale ; calculs de l'auteur vérifiés par script (81 vérifications, 0 écart).

## Résultat de la relecture à l'aveugle

- Accords sans doute : 148 / 150 ; désaccords : 0 ; accords avec doute : 2.

## Écarts et décisions

| Source | Écart ou doute | Décision |
| --- | --- | --- |
| physique-chimie-1re:ch1:banque:143 | « Près de dix incertitudes-types » : 4 / 0,41 = 9,8, mais 8 si l'on arrondit d'abord u à 0,5 mm. | Gardée : l'écart se compare à u non arrondie (0,41 mm) ; avec 0,41 ou 0,5 mm, il vaut 8 à 10 u, ce que « près de dix » décrit, et les trois distracteurs sont faux quelle que soit la lecture (« compatible », « plus de cent u »). |
| physique-chimie-1re:ch1:banque:146 | « Un produit garde le nombre de chiffres de la donnée la moins précise » : « moins précise » peut se lire « moins de décimales ». | Corrigée : « garde autant de chiffres significatifs que la donnée qui en a le moins », formulation du cours. |

## Corrections du cours

Signalées par l'auteur de la banque et par le relecteur, toutes appliquées :

1. Exemple de la règle graduée : u = 1 mm / √12 = 0,29 mm était arrondie à 0,3 mm alors que la règle du cours garde deux chiffres quand le premier est 1 ou 2 : écrit désormais L = 37,00 mm avec u(L) = 0,29 mm.
2. Exemple du voltmètre : u = 0,045 / √3 = 0,0260 V était arrondie à 0,03 V : désormais u(U) = 0,026 V et U = 5,070 V.
3. Exemple de la masse : u = 0,0172 g était arrondie à 0,02 g : désormais u = 0,018 g et m = 12,468 g ; l'encadré « Attention » qui suit est aligné.
4. « Environ 25 fois moins dispersée » → « environ 27 fois » (0,08 / 0,003).
5. « ≈ 8 incertitudes-types » → « ≈ 8,5 » (0,034 / 0,004), dans le texte et dans la figure.
6. Source d'erreur « bulle d'air sous la pipette » (elle donnerait un ρ trop petit) remplacée par « pipette remplie au-dessus du trait de jauge » (ρ trop grand, comme dans l'exemple).

## Totaux

- Gardées sans changement : 149 ; corrigées : 1 (146) ; remplacées : 0.
- Répartition finale : types 75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; positions des bonnes réponses des `qcm_unique` 19 / 19 / 19 / 18 ; bonne réponse la plus longue 9 / 75 ; vrai/faux 17 vrais sur 30.

## Statuts

- `valide` : 150 questions.
- `a_relire` : aucune.
- `brouillon` : aucune.

Point d'attention pour l'enseignant : les réponses courtes 034, 047, 110 et 144 demandent une incertitude-type « arrondie au plus proche » (consigne explicite de l'énoncé), et non la règle d'écriture par excès du cours ; c'est voulu, pour tester le calcul seul.
