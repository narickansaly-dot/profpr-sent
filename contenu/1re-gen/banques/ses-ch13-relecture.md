# Relecture de la banque du chapitre 13 de SES (1re) : outils quantitatifs

## Méthode

Relecture **indépendante et à l'aveugle** par un sous-agent relecteur : il a reçu le texte du chapitre (`texteChapitre`) et les questions **sans les réponses ni les explications**, a résolu chaque question, refait chaque calcul et vérifié les faits cités, puis signalé ambiguïtés, distracteurs défendables et variantes de réponse courte. Ses réponses ont été comparées automatiquement aux réponses attendues (`comparer.py`, mêmes règles de normalisation et de marge que la base). La banque avait été rédigée par un autre sous-agent, puis contrôlée par `verifierBanque`.

Résultat : **150 réponses identiques sur 150**, 0 écart(s), 49 remarques.

## Remarques du relecteur et décisions

| Source | Remarque | Décision |
|---|---|---|
| 008 | Jardin = 80 000/500 000 = 16 % (8 % faux, 18 % faux) : OK. | Calcul confirmé : aucune modification. |
| 013 | Variantes : ["35 %", "35%", "35,0"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 014 | 1 870/5 300 = 35,283 → 35,3. Variantes : ["35,3 %", "35,3%", "35.3"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 023 | 1/1,6 = 0,625 → −37,5 % : OK. | Calcul confirmé : aucune modification. |
| 032 | Variantes : ["−14", "-14 %", "−14 %", "-14%", "−14%"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 033 | Variantes : ["80 €", "80€", "80,00"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 034 | 260/320 − 1 = −18,75 % exactement : cas d'arrondi à mi-chemin ; −18,8 selon la règle usuelle, mais un élève peut taper −18,7 (troncature) ou −18,75. Proposer de changer les données (ex. 320 → 255 : −20,3) ou accepter ["−18,8", "-18,8 %", "−18,8 %", "-18.8", "-18,75", "−18,75"]. | Gardée : −18,75 était déjà accepté, et la marge de 0,05 accepte −18,7 et −18,8. |
| 038 | 1,08 × 0,95 = 1,026 : OK. | Calcul confirmé : aucune modification. |
| 040 | 1,1 × 1,1 × 0,8 = 0,968 : OK. | Calcul confirmé : aucune modification. |
| 043 | 1,1×0,95=1,045 ; 1,2×0,8=0,96 ; 1,5×0,5=0,75 ; 0,8×1,25=1 (ni hausse ni baisse) : OK. | Calcul confirmé : aucune modification. |
| 050 | 0,9² = 0,81. Variantes : ["−19", "-19 %", "−19 %", "-19%"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 051 | 1,05 × 1,04 = 1,092. Variantes : ["9,2 %", "+9,2", "+9,2 %", "9.2"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 052 | 1,02³ = 1,061208. Variantes : ["6,1 %", "+6,1", "+6,1 %", "6.1"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 055 | 135/120 = 1,125 : OK. | Calcul confirmé : aucune modification. |
| 067 | 121/110 = 1,1 : +10 %, l'énoncé est bien faux (11 points). | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 070 | 165/150 = 1,1. Variantes : ["10 %", "+10", "+10 %", "10%"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 071 | Variantes : ["54 000", "54000 €", "54 000 €"] (l'énoncé demande sans espace, mais accepter l'espace des milliers est prudent) | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 075 | (10+12+14+x)/4 = 13 → x = 16 : OK. | Calcul confirmé : aucune modification. |
| 077 | (28×11+32×14)/60 = 756/60 = 12,6 : OK. | Calcul confirmé : aucune modification. |
| 079 | 70/6 = 11,67 → 11,7 : OK. | Calcul confirmé : aucune modification. |
| 080 | Somme des produits = 8+28+33 = 69 (33 est le seul produit 11×3) : OK. | Calcul confirmé : aucune modification. |
| 082 | (45×1 900+5×5 900)/50 = 2 300 : OK. | Calcul confirmé : aucune modification. |
| 084 | (9×1 500+4 500)/10 = 1 800 € : l'énoncé est bien faux. | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 086 | Variantes : ["1 650", "1650 €", "1 650 €"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 087 | 74/6 = 12,33. Variantes : ["12.3", "12,33"] (au dixième : 12,3) | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 088 | Série classée 3,5,6,8,9,12,20 → 8 : OK. | Calcul confirmé : aucune modification. |
| 089 | Moyenne 15 000/5 = 3 000 : OK. | Calcul confirmé : aucune modification. |
| 091 | Nouvelle moyenne 3 820 € : OK. | Calcul confirmé : aucune modification. |
| 094 | Classée 12,20,28,35,50,90 → (28+35)/2 = 31,5 : OK. | Calcul confirmé : aucune modification. |
| 095 | Moyenne 4 500/5 = 900, médiane 600 : OK. | Calcul confirmé : aucune modification. |
| 097 | Moyenne 18 000/6 = 3 000 ; médiane (1 800+2 000)/2 = 1 900 ; 5 salaires sur 6 < 3 000 : OK. | Calcul confirmé : aucune modification. |
| 101 | (1 900+2 200)/2. Variantes : ["2 050", "2050 €", "2 050 €"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 106 | 1,06/1,02 = 1,0392 → +3,9 % : OK. | Calcul confirmé : aucune modification. |
| 107 | 2 300/1,15 = 2 000 € de 2015 : pouvoir d'achat inchangé. OK. | Calcul confirmé : aucune modification. |
| 111 | Avec +4 % de salaire et 4 % d'inflation, le pouvoir d'achat stagne (non coché) : OK. | Calcul confirmé : aucune modification. |
| 113 | Inflation de 3 % (taux réel nul) absente des propositions : bien. | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 114 | 2 160/1,25 = 1 728 € < 1 800 € (−4 %) ; nominal +20 % : OK. | Calcul confirmé : aucune modification. |
| 117 | 1 500/150×100 = 1 000 € de 2010 : énoncé bien faux. | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 119 | Variantes : ["2 400", "2400 €", "2 400 €"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 120 | Approximation du cours : 1 − 4 = −3. Calcul exact : 1,01/1,04 − 1 = −2,88 % ; un bon élève pourrait taper −2,9. Variantes : ["−3", "-3 %", "−3 %", "-3%", "-2,9", "−2,9", "-2,9 %"] | Variantes −2,9 ajoutées (calcul exact : 1,01 ÷ 1,04 ≈ 0,971) ; −3 reste la réponse de l'approximation du cours. |
| 124 | Filles sportives 120/(120+150) = 44,4 % : OK. | Calcul confirmé : aucune modification. |
| 129 | Les options 0 (52,5 %) et 3 (2,5 fois plus nombreux) supposent des effectifs inconnus : bien faux. | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 130 | 36/60 = 60 % ; 90/150 = 60 % ; 36/90 = 40 % ; 24/60 = 40 % (et non 24 %) : OK. | Calcul confirmé : aucune modification. |
| 136 | 20 cadres contre 200 : OK. | Calcul confirmé : aucune modification. |
| 137 | Δq/Δp = −60/2 = −30 unités par euro. Voir remarque sur la notion de « pente » (le cours parle d'unités par euro alors que le prix est en ordonnée ; géométriquement la pente vaut Δp/Δq = −1/30 €/unité). Préciser « la quantité demandée varie de … unités par euro » plutôt que « pente » ou aligner le cours. | Corrigée, ainsi que le cours : avec le prix en ordonnée, la pente géométrique est Δp/Δq ; l'énoncé demande désormais de combien d'unités la quantité varie par euro (sensibilité de la quantité au prix). Le chapitre 1 a été précisé de la même façon. |
| 138 | 60/3 = 20 : OK. | Calcul confirmé : aucune modification. |
| 139 | 1 200/40 = 30 € : OK. | Calcul confirmé : aucune modification. |
| 147 | −180/3 = −60 unités/€ ; −180/900 = −20 % : OK. | Calcul confirmé : aucune modification. |
| 149 | 120/4 = 30 unités par euro. Même réserve que 137 : avec le prix en ordonnée, la pente géométrique est Δp/Δq = 1/30 € par unité ; ici le vrai repose sur la convention du cours (unités par euro). | Corrigée : « la quantité augmente de 30 unités par euro » au lieu de « la pente est de 30 unités par euro ». |

Enrichissement automatique (appliqué à toutes les réponses courtes numériques) : pour un nombre seul, le convertisseur ajoute les formes avec espace des milliers, avec « % » si l'énoncé parle de pourcentage, avec « € » s'il parle d'euros, et les signes moins « - », « − » et « - » suivi d'une espace pour un nombre négatif. La virgule et le point décimaux sont déjà acceptés par la base pour un nombre seul.

## Bilan

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte` ; difficultés 60 / 60 / 30.
- `verifierBanque` : conforme.
- Statut : **150 validées**, aucune laissée « à relire ».

## Points de doute

Le relecteur a signalé un abus de langage dans le cours : « pente » pour un nombre d'unités par euro, alors que le prix est en ordonnée. Le cours (chapitres 1 et 13) et deux questions ont été précisés. Trois points mineurs signalés par la rédactrice : un QCM difficile sur le tableau des transports est faux seulement parce que les effectifs ne sont pas donnés (lecture attentive requise) ; un QCM demande le calcul exact du pouvoir d'achat (+3,9 %), l'approximation +4,0 % étant un distracteur ; une question de lecture (18 % de plus de 75 ans) est classée dans la notion « proportions ».
