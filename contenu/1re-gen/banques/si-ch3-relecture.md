# Relecture indépendante de la banque du chapitre 3 de SI (1re générale)

Méthode : résolution à l'aveugle des 150 questions à partir du seul texte du chapitre, tous les calculs refaits par script Python (conversions, puissances, rendements de chaîne, énergies cinétique et potentielle, autonomies, valeurs des distracteurs calculés), comparaison automatique avec la banque, puis relecture complète des 150 questions avec leurs réponses et explications. Une attention particulière a été portée aux 26 QCM dont l'auteur avait allongé des distracteurs.

Résultat de la phase 1 : 0 désaccord sur 150 (donc 0 erreur de la banque, 0 ambiguïté de réponse, 0 erreur du relecteur). La relecture complète a tout de même relevé 7 défauts de forme ou de lecture, corrigés ci-dessous.

## Questions corrigées

| Source | Problème | Correction |
|---|---|---|
| si-1re:ch3:banque:035 | Distracteur « 41,5 W » (F + v) : addition sans sens physique, décimale artificielle qui trahit le distracteur allongé | Remplacé par « 6 W » (erreur de virgule) ; explication complétée (6 W, 600 W, 26,7 W = F / v) |
| si-1re:ch3:banque:037 | Distracteur « 250,4 W » (C + ω), même défaut | Remplacé par « 10 W » (erreur de virgule) ; explication complétée |
| si-1re:ch3:banque:075 | Le milliwatt n'apparaît pas dans le cours (préfixe connu depuis le collège, mais non utilisé dans le chapitre) | Conversion rappelée dans l'énoncé : « en milliwatts (1 mW = 0,001 W) » ; réponse 92 inchangée |
| si-1re:ch3:banque:095 | Distracteur « 300,75 W » (Pu + η), même défaut | Remplacé par « 75 W » (300 × 0,25) ; explication complétée (les vraies pertes valent 100 W) |
| si-1re:ch3:banque:100 | Proposition « Le moteur fournit plus de puissance qu'il n'en reçoit » : c'est exactement ce que dit le résultat erroné de l'élève, un élève pouvait la cocher de bonne foi | Remplacée par « Le moteur est simplement très performant », clairement fausse ; explication ajustée |
| si-1re:ch3:banque:110 | Distracteur « 210,7 W » (Pu + η), même défaut | Remplacé par « 63 W » (210 × 0,30) ; explication complétée (pertes réelles 90 W) |
| si-1re:ch3:banque:141 | Distracteur « 150,2 W » (F + v), même défaut | Remplacé par « 3 000 W » (erreur de virgule sur la vitesse) ; explication complétée |

Biais de longueur après correction (75 QCM à réponse unique) : la bonne réponse est la plus longue (ex æquo) dans 2 cas, la plus courte (ex æquo compris) dans 25 cas, et strictement la plus courte dans 8 cas seulement (11 %) : pas de biais inverse exploitable. Les autres distracteurs allongés (« environ 0,3 min », « environ 1,38 min », « environ 521,4 W », « environ 0,883 », « 134,7 W », « électrique → chimique → mécanique → thermique », etc.) correspondent à des erreurs typiques expliquées et restent naturels.

## Totaux

- Gardées sans changement : 143 ; corrigées : 7 (aucune question remplacée, aucune bonne réponse modifiée).
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux, 15 reponse_courte.
- Difficultés : 60 niveau 1, 60 niveau 2, 30 niveau 3.
- Vrai/faux : 15 vrais, 15 faux.
- Positions de la bonne réponse (qcm_unique) : 19 / 19 / 19 / 18.
- Vérificateur : « Banque du chapitre 3 conforme : 150 questions ; types 75/30/30/15 ; difficultés 60/60/30 ; vrai/faux 15 vrais. »
- Comparaison finale : 0 désaccord.

## Points de doute

Aucun. Remarques mineures sans correction : 117 et 114 (« toujours plus petit que le plus petit des rendements ») reprennent mot pour mot le cours ; le cas limite d'un constituant idéal (η = 1) n'est pas au programme. Les marges des réponses courtes (030, 059, 075, 105, 135) couvrent les arrondis honnêtes sans plus.

## Cours

Rien de faux à signaler. Imprécision mineure : « Le rendement global est toujours plus petit que le plus petit des rendements » serait strictement « inférieur ou égal » si un constituant était idéal (η = 1), cas qui n'existe pas en pratique. Tous les exemples résolus du chapitre ont été recalculés et sont justes (portail 6 090 J et 87 W, drone 18,5 min, trottinette 0,727 et 344 W, monte-charge 1 682 W, portail 49 W, etc.).

## Mise à jour après la relecture (17 novembre 2026)

La phrase du cours sur le rendement global a été corrigée en « inférieur ou égal au plus petit des rendements (strictement inférieur dès que deux constituants ont des pertes) ». Les questions 114 (proposition 2 et explication) et 117 (énoncé et explication) ont été alignées sur cette formulation ; leurs bonnes réponses sont inchangées.
