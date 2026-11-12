# Relecture de la banque du chapitre 6 de SVT (1re) contre le cours

Banque `svt-ch6.json` : 150 questions sur le chapitre 6 (« Les enzymes, des biomolécules aux propriétés catalytiques »).

## Méthode

1. Rédaction des 150 questions à partir du seul texte du chapitre (texte brut produit par `pilote.ts texte`).
2. Auto-relecture question par question contre ce texte : neuf questions qui faisaient doublon ou inverse d'une autre ont été remplacées avant la relecture indépendante.
3. Relecture indépendante : un sous-agent a résolu les 150 questions sans voir les réponses attendues, avec le seul texte du chapitre, et a noté ses remarques.
4. Comparaison automatique de ses réponses avec les réponses attendues, puis arbitrage de chaque remarque (texte du chapitre et exactitude scientifique).

## Relecture indépendante

Accord initial : 150/150 (aucun écart, aucune question sans réponse). Quinze remarques sur des questions où le relecteur est d'accord :

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch6:banque:001 | Les bonnes réponses des qcm_unique suivent le cycle de positions 0, 1, 2, 3. | Gardée : l'application permute les propositions à chaque tirage (`tentative_question.permutation`), donc l'ordre du fichier n'a pas d'effet. |
| svt:ch6:banque:048 | Un plateau pourrait aussi traduire un équilibre chimique. | Gardée : le chapitre explique explicitement que le plateau signifie l'épuisement du substrat, et aucun distracteur ne parle d'équilibre. |
| svt:ch6:banque:065 | Gamètes et globules rouges matures font exception à « toutes les cellules ont les mêmes gènes ». | Corrigée : l'énoncé porte maintenant sur une cellule du foie et une cellule du pancréas d'un même individu. |
| svt:ch6:banque:074 | Réponse (phénylalanine) donnée par la 105 et par l'énoncé de la 150. | Remplacée : « Par quelles cellules la lactase est-elle produite ? » (intestin grêle), même type et même difficulté. |
| svt:ch6:banque:099 | « Au-delà de l'optimum, dénaturation irréversible » est une simplification. | Gardée : c'est la formulation du chapitre, au niveau de la 1re, et les distracteurs sont nettement faux. |
| svt:ch6:banque:125 | Réponse donnée par l'énoncé de la 126 (hexokinase et phosphorylation). | Remplacée : « Une enzyme peut catalyser indifféremment plusieurs types de transformations de son substrat » (faux). |
| svt:ch6:banque:126 | Son énoncé donne la réponse des 125 et 145. | Réécrite : « Une même molécule peut subir plusieurs transformations différentes, chacune catalysée par une enzyme différente » (vrai). |
| svt:ch6:banque:140 | L'énoncé de la 021 cite le lysozyme. | Gardée : la 021 ne donne pas le nombre d'acides aminés (129). |
| svt:ch6:banque:141 | Prévoir la variante sans accent. | Gardée : la normalisation ignore les accents et la casse. |
| svt:ch6:banque:142 | Variantes « complexe ES », « complexe enzyme substrat ». | Gardée : ces variantes figurent déjà dans les réponses acceptées. |
| svt:ch6:banque:143 | Réponse (ajustement induit, Koshland 1958) donnée par la 088 et la 027. | Remplacée : « Quel chimiste a comparé, en 1894, une enzyme et son substrat à une serrure et à sa clé ? » (Fischer, Emil Fischer). |
| svt:ch6:banque:144 | Réponse donnée par l'énoncé de la 011 ; variante « invertase ». | 144 gardée ; la 011 est réécrite (produits de l'hydrolyse des lipides par la lipase). « Invertase » est absent du chapitre. |
| svt:ch6:banque:145 | Réponse donnée par la 126 et par la 093 ; variante « glucokinase ». | Remplacée : « Par quel suffixe se termine en général le nom d'une enzyme ? » (-ase, avec variantes). |
| svt:ch6:banque:147 | « Quantité de produit » exprimée en mmol/L est une concentration. | Corrigée : « concentration en produit » ; « 2,25 » et « 2.25 » sont acceptées. |
| svt:ch6:banque:149 | Variantes sans accent et pluriel. | Gardée : accents ignorés par la normalisation, pluriels déjà présents. |
| svt:ch6:banque:150 | Énoncé qui donne la réponse de la 074 ; sigle « PCU ». | Remplacée : « Si l'on divise par quatre la quantité d'enzyme (substrat en excès), par combien la vitesse initiale est-elle divisée ? » (4, par 4, quatre). |

Questions modifiées : 011, 065, 074, 125, 126, 143, 145, 147, 150.

## Totaux

- 150 questions ; types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux, 15 reponse_courte.
- Vrai/faux : 15 vrais, 15 faux.
- Difficultés : 60 (niveau 1), 60 (niveau 2), 30 (niveau 3).
- Biais de longueur : la bonne réponse est la plus longue dans 20 qcm_unique sur 75.
- Contrôle `verifierBanque` : « Banque du chapitre 6 conforme : 150 questions. »


## Seconde vérification indépendante

Les 9 questions modifiées (`ch6-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 9/9**. Suite à ses remarques, la 143 accepte aussi la faute fréquente « Fisher » ; les autres variantes demandées (145) étaient déjà acceptées.

## Questions laissées à relire

Aucune question ne reste douteuse. Points de vigilance pour l'enseignant : l'effet de la température et du pH (FA) est hors exigibles selon le programme [P6] et figure ici à titre d'exemple ; les valeurs de pH optimal (pepsine 2, amylase salivaire 7, trypsine 8) sont des valeurs de manuel arrondies.

À relire : aucune
