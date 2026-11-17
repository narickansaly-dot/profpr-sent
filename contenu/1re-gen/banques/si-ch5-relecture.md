# Relecture indépendante de la banque du chapitre 5 de SI (1re générale)

Méthode : résolution à l'aveugle des 150 questions à partir du seul texte du chapitre (énoncés et propositions sans réponses ni explications), tous les calculs refaits par script Python (unités et arrondis compris), comparaison automatique avec la banque, puis relecture complète des 150 questions avec leur réponse et leur explication (exactitude, lecture unique, distracteurs indéfendables, conformité au cours, unités, variantes des réponses courtes, doublons de fond, typographie).

Résultat de la phase 1 : 0 désaccord sur 150 (dont 0 erreur de la banque, 0 ambiguïté, 0 erreur du relecteur). Tous les résultats numériques de la banque (bonnes réponses et valeurs des distracteurs commentées dans les explications) ont été retrouvés.

## Questions corrigées

Aucune erreur scientifique. Les six corrections portent sur des doublons de fond : un vrai/faux qui reprenait presque mot pour mot une proposition d'un QCM du même chapitre, ce qui donne la réponse si les deux questions tombent dans le même quiz. Chaque vrai/faux remplacé garde son type, sa difficulté, sa notion et sa valeur.

| Source | Problème | Correction |
|---|---|---|
| si-1re:ch5:banque:014 | Doublon de la 013, proposition 2 (« Un ampèremètre se branche en dérivation »). | Remplacée (faux, difficulté 1) : à l'extérieur d'un générateur, le courant conventionnel va de la borne − vers la borne +. |
| si-1re:ch5:banque:032 | Doublon de la 009, proposition 1 (dans une branche, tous les dipôles ont le même courant), idée aussi en 021. | Remplacée (vrai, difficulté 1) : la loi des nœuds traduit le fait que les charges ne s'accumulent pas. |
| si-1re:ch5:banque:034 | Contraire mot pour mot de la 030, proposition 1 (signe d'une tension fléchée dans le sens du parcours). | Remplacée (faux, difficulté 2) : deux résistors en série ont toujours la même tension (faux sauf résistances égales). |
| si-1re:ch5:banque:107 | Doublon de la 103, proposition 2 (le condensateur transforme l'énergie en chaleur comme un résistor). | Remplacée (faux, difficulté 1) : une fois chargé, un condensateur ne peut plus restituer son énergie. |
| si-1re:ch5:banque:109 | Doublon de la 105, proposition 2 (bobine en continu établi = interrupteur ouvert), idée aussi en 096. | Remplacée (faux, difficulté 2) : en continu établi, une bobine idéale dissipe une puissance importante par effet Joule. |
| si-1re:ch5:banque:145 | Doublon de la 144, proposition 3 (les tensions indiquées sur les appareils sont des valeurs efficaces). | Remplacée (vrai, difficulté 1) : tension rectangulaire 10 V / 0 V de rapport cyclique 0,5, valeur moyenne 5 V. |

## Totaux

- Gardées sans changement : 144
- Corrigées (remplacées) : 6 (014, 032, 034, 107, 109, 145), toutes des vrai/faux, valeur et difficulté conservées.

Répartition finale : types 75 / 30 / 30 / 15 ; difficultés 58 / 60 / 32 ; vrai/faux : 15 vrais, 15 faux ; position de la bonne réponse des qcm_unique : 19 / 19 / 19 / 18. Notions : 17 à 20 questions chacune.

Dernière ligne du vérificateur : « Banque du chapitre 5 conforme : 150 questions ; types 75/30/30/15 ; difficultés 58/60/32 ; vrai/faux 15 vrais. »

Comparaison après corrections : 0 désaccord.

## Points de doute

Aucune question laissée « à relire ». Remarques mineures, sans correction :

- 071 et 072 (arrondi au centième) : marge absolue de 0,01, qui accepte aussi un arrondi d'une unité de centième d'écart ; acceptable.
- 012 : la proposition « ne compte que 2 mailles » est fausse selon la définition du cours (6 mailles pour 4 branches entre 2 nœuds) ; l'explication le justifie correctement.
- Quelques recoupements de fond subsistent entre questions de formats différents (053 et 046, 147 et 144, 033 et 030) sans reprise littérale ; jugés acceptables.

## Cours

Rien à signaler : les exemples résolus du chapitre ont été recalculés (pont diviseur 3,27 V, supercondensateur 364,5 J ≈ 0,1 Wh, 2 200 µF sous 12 V ≈ 0,16 J, bouilloire 8,7 A et 26,5 Ω, oscilloscope 17 V et 12 V efficaces, pertes de 25 W soit 4,2 %) et sont justes.
