# Relecture de la banque du chapitre 6 d'enseignement scientifique (1re)

Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions de `ens-sci-ch6.json` sans voir les réponses, en refaisant les calculs ; ses réponses ont été comparées automatiquement à celles de la banque, puis chaque écart et chaque remarque ont été examinés contre le texte du chapitre 6 (« De la photosynthèse à l'énergie des êtres vivants »).

## Résultat de la relecture à l'aveugle

- Concordance initiale : **150/150**, aucun écart.
- Remarques : 33 (questions concordantes commentées ou de confiance inférieure à 3).
- Répartition : 0 erreur de la banque ; 2 faits absents du cours (longueurs d'onde) ; 4 ambiguïtés (eau produite par la photosynthèse, égalité exacte, fibres dans deux questions) ; 1 distracteur peu crédible ; 1 question de pure restitution d'un exemple du cours ; 12 variantes de réponse courte à ajouter ; 13 remarques sans conséquence (distracteur ou détail du cours absent des propositions, sans effet sur la réponse) ; 0 erreur du relecteur.

## Corrections faites

| Source | Problème | Décision |
|---|---|---|
| (cours) section `energie-captee` | Les longueurs d'onde du spectre d'absorption n'apparaissaient que sur la figure 6.2. | Ajout dans le texte : bleu vers 430 nm, rouge vers 660 nm, vert entre 500 et 600 nm. |
| (cours) section `photosynthese` | L'équation-bilan n'était pas dite simplifiée (la photosynthèse produit aussi de l'eau). | « équation-bilan simplifiée ». |
| (cours) section `aliments` | « Les fibres n'apportent pas d'énergie » : inexact (faible apport). | « les fibres n'en apportent presque pas » ; eau, ions minéraux et vitamines : aucune énergie. |
| ens-sci:ch6:banque:017 | Longueurs d'onde absentes du cours ; les couleurs entre parenthèses donnaient la réponse. | Valeurs désormais dans le cours ; couleurs retirées des propositions (430, 450, 660, 550 nm) ; explication renvoyant au cours. |
| ens-sci:ch6:banque:135 | Longueurs d'onde absentes du cours. | Valeurs ajoutées au cours ; explication reformulée. |
| ens-sci:ch6:banque:028 | « L'eau » défendable comme produit (bilan complet). | Énoncé « d'après l'équation-bilan simplifiée du cours » ; l'eau remplacée par « les ions minéraux ». |
| ens-sci:ch6:banque:082 | Fibres : faible apport énergétique réel. | Option « les fibres » remplacée par « les vitamines ». |
| ens-sci:ch6:banque:128 | Même réserve sur les fibres. | Option « les fibres » remplacée par « l'eau ». |
| ens-sci:ch6:banque:099 | Piège sur une égalité exacte (6 × 350 = 2 100 kJ). | Sept heures assises : 7 × 350 = 2 450 kJ > 2 100 kJ ; réponse toujours « faux ». |
| ens-sci:ch6:banque:150 | Données identiques à l'exemple résolu du cours (yaourt, 322 kJ). | Nouvelles données : 15 g de glucides, 3 g de lipides, 4 g de protides → 437 kJ. |
| ens-sci:ch6:banque:119 | Distracteurs « type 3 » et « type 4 » peu crédibles. | Question réécrite : quel déséquilibre touche environ 800 millions d'adultes (diabète ; distracteurs : obésité, dénutrition, maladies cardiovasculaires, tous dans le tableau du cours). |
| ens-sci:ch6:banque:046 | Variantes au pluriel. | Ajout de « chlorophylles », « les chlorophylles ». |
| ens-sci:ch6:banque:047, 100 | Réponse en toutes lettres. | Ajout de « dioxyde de carbone », « le dioxyde de carbone », « du dioxyde de carbone ». |
| ens-sci:ch6:banque:048, 049, 101, 102, 104, 149, 150 | Nombre suivi de l'unité. | Ajout de « N kJ » / « NkJ » (« N g » / « Ng » pour la 104) ; pour la 149, aussi « 1 575 » avec espace. |
| ens-sci:ch6:banque:050 | Variante avec article. | « le phytoplancton » déjà présent ; ajout de « du phytoplancton ». |
| ens-sci:ch6:banque:147 | Nombre en lettres. | « cinq » déjà présent ; ajout de « 5 lettres », « cinq lettres ». |
| ens-sci:ch6:banque:148 | Variantes « 1 milliard », « un ». | Ajoutées. |

Remarques sans correction (la réponse reste univoque) : 010, 027, 032, 037, 060, 065, 086, 088, 105, 120, 129, 130, 133.

## Totaux

- 150 questions.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (16 vrais, 14 faux), 15 reponse_courte.
- Difficultés : 59 / 61 / 30.
- Positions des bonnes réponses des qcm_unique : 19 / 19 / 19 / 18 (indices 0 à 3).
- La bonne réponse est strictement la plus longue dans 12 qcm_unique sur 75.
- Contrôle du pilote (mêmes règles que `npm run banque:verifier`) : « Banque du chapitre 6 conforme : 150 questions. » ; cours : « Nettoyage HTML : rien n'est retiré. »

## Questions laissées à relire

Aucune.

## Points de doute pour l'enseignant

- Valeur énergétique des lipides : 38 kJ/g dans tout le chapitre ; l'étiquetage européen utilise 37 kJ/g.
- Ordres de grandeur mondiaux (OMS, FAO, données 2022-2023) : environ 730 millions de personnes sous-alimentées, plus d'un milliard de personnes obèses, environ 800 millions d'adultes diabétiques, environ 18 millions de décès cardiovasculaires par an. Ces chiffres évoluent d'une année à l'autre.
- Énergie stockée par la photosynthèse : environ 4 × 10²¹ J par an (moins de 0,1 % des 5,4 × 10²⁴ J reçus) ; production primaire d'environ 100 milliards de tonnes de carbone par an : les manuels donnent des valeurs voisines mais pas identiques.
- Dépenses horaires (adolescent de 60 kg), métabolisme de base (5 500 à 7 000 kJ/jour) et besoins (9 000 à 12 000 kJ/jour) : valeurs indicatives à aligner sur le manuel.
- Transfert de 10 % entre maillons : ordre de grandeur moyen (souvent 5 à 20 %).
- Repères de l'Anses (glucides 40 à 55 %, lipides 35 à 40 %, protides 10 à 20 %) et de l'OMS (moins de 5 g de sel par jour).
