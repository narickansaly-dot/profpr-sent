# Relecture de la banque du chapitre 7 de SVT (1re spécialité) contre le cours

Banque `svt-ch7.json` : 150 questions sur le chapitre 7 (« Continents, océans et ondes sismiques : la structure du globe »).

## Méthode

1. Rédaction du chapitre puis de la banque, en vérifiant que chaque réponse est écrite dans le texte du chapitre.
2. Auto-relecture : chaque question confrontée au texte brut du chapitre ; suppression des énoncés ou propositions qui donnaient la réponse d'une autre question ; contrôle du biais de longueur et de la position des bonnes réponses.
3. Relecture indépendante : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues.
4. Comparaison automatique de ses réponses avec les réponses attendues.
5. Arbitrage de chaque écart et de chaque remarque (ci-dessous), puis nouveau contrôle `verifierBanque`.

## Relecture indépendante

Accord initial : 150/150 (aucun écart, aucune question sans réponse). Six remarques sur des questions où le relecteur était d'accord :

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt-1re:ch7:banque:087 | La densité 2,9 est donnée pour la croûte océanique, pas pour le basalte et le gabbro pris isolément. | Chapitre complété (section « Deux croûtes, deux roches ») : densité d'environ 2,9 indiquée pour le gabbro et pour le basalte ; explication précisée. |
| svt-1re:ch7:banque:088 | L'étape « diviser la masse par le volume » manque. | Proposition juste réécrite : « Diviser sa masse par son volume, puis le résultat par la masse volumique de l'eau ». |
| svt-1re:ch7:banque:136 | Accepter « bimodal ». | Déjà accepté (avec « bimodale », « bimodales », « répartition bimodale », « distribution bimodale ») : gardée. |
| svt-1re:ch7:banque:137 | Accepter « sismographe ». | Déjà accepté (« sismographe », « un sismographe », « le sismographe ») : gardée. |
| svt-1re:ch7:banque:147 | 71 % de 510 = 362,1 ; arrondi non précisé. | Énoncé : « Arrondis à l'unité » ; réponses « 362 » et « 362,1 », marge de 2 ; explication avec le calcul exact. |
| svt-1re:ch7:banque:149 | Accepter « métamorphiques » et « roches métamorphiques ». | Déjà acceptés : gardée. |

## Totaux

- 150 questions ; types 75 qcm_unique / 30 qcm_multiple / 30 vrai_faux / 15 reponse_courte.
- Vrai/faux : 15 vrais, 15 faux.
- Difficultés : 60 (1) / 60 (2) / 30 (3).
- Biais de longueur : la bonne réponse est la plus longue dans 15 qcm_unique sur 75 ; positions des bonnes réponses 20 / 20 / 19 / 16.
- Contrôle (`verifierBanque`) : « Banque du chapitre 7 conforme : 150 questions. »


## Seconde vérification indépendante

Les 3 questions modifiées (`ch7-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 3/3**. Il confirme le calcul de la 147 (71 % de 510 = 362,1). Aucune modification.

## Questions laissées à relire

Aucune question ne reste douteuse : les trois questions modifiées ont désormais une réponse incontestable d'après le texte du chapitre.

À relire : aucune
