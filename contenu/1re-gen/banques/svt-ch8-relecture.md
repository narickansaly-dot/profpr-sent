# Relecture de la banque du chapitre 8 de SVT (1re spécialité) contre le cours

Banque `svt-ch8.json` (150 questions) du chapitre 8, « La chaleur interne de la Terre et la mobilité des plaques ».

## Méthode

1. Rédaction du chapitre puis de la banque, en quatre parties fusionnées par script (espaces insécables, sources `svt-1re:ch8:banque:001` à `150`).
2. Auto-relecture de chaque question contre le texte brut du chapitre, avec une recherche automatique des réponses des réponses courtes dans les autres énoncés et propositions. Des questions inverses ou redondantes ont été remplacées.
3. Relecture indépendante : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues.
4. Comparaison automatique de ses réponses avec les réponses attendues.
5. Arbitrage de chaque écart et de chaque remarque, puis contrôle `verifierBanque`.

## Relecture indépendante

Accord initial : 150/150 (aucun écart, aucune question sans réponse). Le relecteur a fait 10 remarques sur des questions où il était d'accord.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt-1re:ch8:banque:004 | Deux distracteurs presque identiques (vieux continent stable, vieux bouclier continental). | Corrigée : le second est remplacé par « une plaine abyssale très ancienne, loin de toute dorsale » ; l'explication est complétée. |
| svt-1re:ch8:banque:104 | « Quels marqueurs distinguent… » peut se lire « diffèrent » : les quatre propositions conviendraient alors. | Corrigée : « Quels marqueurs caractérisent une zone de subduction, et non une dorsale ? ». |
| svt-1re:ch8:banque:110 | Le texte ne disait pas explicitement que le gradient varie à l'intérieur de la lithosphère. | Chapitre complété (section 2) : le gradient vaut environ 30 °C/km près de la surface, puis il diminue vers la base (environ 13 °C/km en moyenne sur 100 km). Question gardée telle quelle. |
| svt-1re:ch8:banque:138 | Le texte donne une fourchette (5000 à 6000 °C) mais la question attend un seul nombre. | Corrigée : l'énoncé demande une valeur de la fourchette ; la marge de 500 autour de 5500 accepte toute valeur de 5000 à 6000. Variantes de forme ajoutées (« 5000-6000 », « environ 5500 »). |
| svt-1re:ch8:banque:141 | Variantes du signe moins. | Corrigée : « - 2 », « − 2 », « - 2 % », « moins 2 % » ajoutés. « -0,02 » n'est pas accepté, car l'énoncé demande la valeur en %. |
| svt-1re:ch8:banque:142 | Accepter 12, douze, une douzaine. | Gardée : ces variantes figuraient déjà (marge de 1). |
| svt-1re:ch8:banque:143 | Confusion possible avec la demi-vitesse. | Corrigée : l'énoncé précise « écartement total, et non demi-vitesse » ; l'explication donne aussi la demi-vitesse (1 cm/an). |
| svt-1re:ch8:banque:147 | Variantes de « Glomar Challenger ». | Remplacée (même type, même difficulté) : l'énoncé (« traverser les sédiments… jusqu'au basalte ») donnait la réponse du vrai/faux 128 (« Les forages océaniques n'ont jamais atteint le basalte »). Nouvelle question : le flux géothermique des vieux continents stables, en mW/m² (40, marge de 10). |
| svt-1re:ch8:banque:148 | Variantes de « panache ». | Gardée : les variantes demandées figuraient déjà. |
| svt-1re:ch8:banque:150 | « magnétite » avec ou sans article. | Gardée : les variantes figuraient déjà. |

## Totaux

- 150 questions ; types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux, 15 reponse_courte.
- Vrai/faux : 15 vrais, 15 faux.
- Difficultés : 60 (niveau 1), 62 (niveau 2), 28 (niveau 3).
- Biais de longueur : la bonne réponse est la plus longue dans 3 qcm_unique sur 75. Positions des bonnes réponses : 21 / 18 / 20 / 16.
- Contrôle (`verifierBanque`) : « Banque du chapitre 8 conforme : 150 questions. »


## Seconde vérification indépendante

Les 7 questions modifiées (`ch8-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 7/7**. Ses remarques (138 : valeurs de la fourchette ; 141 : tiret ou signe moins) portaient sur des cas déjà acceptés (marge de 500 autour de 5500 ; variantes « -2 » et « −2 »). Aucune modification.

## Questions laissées à relire

Aucune question ne reste douteuse : les six questions modifiées passeront la seconde vérification prévue.

À relire : aucune
