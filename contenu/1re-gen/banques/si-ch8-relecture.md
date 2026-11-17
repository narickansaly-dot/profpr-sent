# Relecture indépendante de la banque du chapitre 8 de SI (1re générale)

Méthode : résolution à l'aveugle des 150 questions à partir du seul texte du chapitre (énoncés et propositions sans réponses ni explications), tous les calculs refaits par script Python (unités et arrondis compris) et tous les programmes cités dans les énoncés réellement exécutés en Python (092, 094, 102, 105 à 107, 109, 110, 113, 116, 119), comparaison automatique avec la banque, puis relecture complète des 150 questions avec leur réponse et leur explication (exactitude, lecture unique, distracteurs indéfendables, conformité au cours, unités, variantes des réponses courtes, doublons de fond, typographie).

Résultat de la phase 1 : 0 désaccord sur 150 (dont 0 erreur de la banque, 0 ambiguïté, 0 erreur du relecteur). Tous les résultats numériques de la banque (bonnes réponses et valeurs des distracteurs commentées dans les explications) ont été retrouvés.

## Questions corrigées

Aucune erreur scientifique. Les corrections portent surtout sur des doublons de fond (un vrai/faux ou une proposition qui donne la réponse d'une autre question du même chapitre si les deux tombent dans le même quiz), plus une formulation discutable et un distracteur redondant. Chaque vrai/faux remplacé garde son type, sa difficulté, sa notion et sa valeur ; chaque QCM garde sa bonne réponse à la même position.

| Source | Problème | Correction |
|---|---|---|
| si-1re:ch8:banque:016 | « Même sans aucun capteur de position » : un bon élève pourrait défendre « vrai » (détection de butée par surintensité du moteur). | Énoncé reformulé : « Sans aucun retour d'information des capteurs… » (faux). |
| si-1re:ch8:banque:022 | Distracteurs 2 et 3 identiques sur le fond (1 989 m = 1,99 km). | Distracteur 3 remplacé par 0,99 m (division par 2 faite deux fois) ; explication complétée. |
| si-1re:ch8:banque:030 | Proposition 2 (« connaît l'angle dès la mise sous tension ») reprend mot pour mot la réponse de la 026. | Remplacée par « Sa résolution vaut 0,69° » (calcul inversé 250 / 360) ; explication mise à jour. |
| si-1re:ch8:banque:046 | Proposition 2 (résistance qui augmente avec la température) donne la réponse de la 020. | Remplacée par « Elle délivre un signal logique tout ou rien » (faux : signal analogique) ; explication mise à jour. |
| si-1re:ch8:banque:065 | Doublon de la 064, proposition 4 (un chiffre hexadécimal code 4 ou 8 bits). | Remplacée (vrai, difficulté 1) : le préfixe 0x signale un nombre hexadécimal. |
| si-1re:ch8:banque:066 | Même fait que la 080, propositions 0 et 4 (10 bits : de 0 à 1 023). | Remplacée (faux, difficulté 2) : 16 bits donnent 65 536 nombres « de 1 à 65 536 ». |
| si-1re:ch8:banque:085 | Énonce la règle de saturation et donne la réponse de la 076 (et de la 080, proposition 3). | Remplacée (vrai, difficulté 2) : une tension trop forte peut détruire l'entrée du microcontrôleur. |
| si-1re:ch8:banque:099 | Doublon de la 090, proposition 3 (« x = x + 3 est impossible »). | Remplacée (faux, difficulté 1) : après x = 5 puis x = 2, x contiendrait les deux valeurs. |
| si-1re:ch8:banque:100 | Donne la réponse de la 089 (21.5 et non 21,5). | Remplacée (vrai, difficulté 1) : en pseudo-code, temperature ← 21,5. |
| si-1re:ch8:banque:118 | Doublon de la 098, proposition 1 (bloc repéré par l'indentation). | Remplacée (faux, difficulté 1) : une boucle while dont la condition est fausse dès le départ s'exécuterait une fois. |
| si-1re:ch8:banque:127 | Ses quatre propositions recoupaient celles de la 128 (front, fin de temporisation, « moteur en marche »). | Nouvelles propositions : coupure du faisceau, arrivée d'un message, « portail en cours d'ouverture » (bonne réponse, toujours en position 2), échéance de 30 s. |
| si-1re:ch8:banque:131 | Doublon de la 130, proposition 1 (le système doit mémoriser son état). | Remplacée (vrai, difficulté 1) : ET, OU, NON s'écrivent and, or, not en Python. |
| si-1re:ch8:banque:148 | Donnée par la 137 (forme événement [garde] / action) et la 145. | Remplacée (faux, difficulté 2) : entry, do et exit s'écriraient sur les flèches des transitions. |

## Totaux

- Gardées sans changement : 137
- Corrigées : 13 (016, 022, 030, 046, 065, 066, 085, 099, 100, 118, 127, 131, 148), dont 9 vrais/faux (8 remplacés, 1 reformulé), 2 qcm_unique et 2 qcm_multiple modifiés sur une proposition.

Répartition finale : types 75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; vrai/faux : 15 vrais, 15 faux ; position de la bonne réponse des qcm_unique : 19 / 19 / 19 / 18. Notions : 15 à 19 questions chacune.

Dernière ligne du vérificateur : « Banque du chapitre 8 conforme : 150 questions ; types 75/30/30/15 ; difficultés 60/60/30 ; vrai/faux 15 vrais. »

Comparaison après corrections : 0 désaccord.

## Points de doute

Aucune question laissée « à relire ». Remarques mineures, sans correction :

- 087 (quantum arrondi au centième, 0,81 mV) : marge absolue de 0,01, acceptable.
- 112 : « rendre le programme plus lisible » n'est pas écrit dans le cours, mais c'est une conséquence évidente de « on l'écrit une fois » ; la proposition est juste et acceptée.
- 138 : « 30 s après l'entrée dans l'état » précise le cours, qui dit seulement « après 30 s » ; c'est la convention SysML, sans autre lecture possible parmi les propositions.
- Quelques recoupements de fond subsistent entre questions de formats différents sans reprise littérale (093 et 089, 115 et 114, 116 et 105, 039 / 040 / 044 / 051 sur le même capteur avec des valeurs différentes) ; jugés acceptables.

## Cours

Rien à signaler : les exemples résolus du chapitre ont été recalculés (drone 0,99 m, codeur 0,72° et 300 tr/min, station météo 50 mV/°C et 32 °C, 1011 0010 = 178, 200 = 0xC8, Arduino q ≈ 4,88 mV et N = 368 = 0x170, N = 700 → 3,42 V, résolution 0,098 °C et 0,39 °C, temperature(532) ≈ 31,95 °C, moyenne 13,75, lampe temporisée 18 s) et sont justes.
