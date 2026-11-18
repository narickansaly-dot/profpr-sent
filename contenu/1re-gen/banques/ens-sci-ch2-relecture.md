# Relecture de la banque du chapitre 2 d'enseignement scientifique (1re)

Relecture indépendante à l'aveugle des 150 questions de `ens-sci-ch2.json` contre le texte du chapitre 2 (« Des édifices ordonnés : les cristaux ») : un sous-agent a résolu les 150 questions, calculs refaits, sans voir les réponses ; ses réponses ont été comparées automatiquement à celles de la banque, puis chaque écart et chaque remarque ont été examinés.

## Résultat de la relecture à l'aveugle

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées) : **27**.
- Répartition des remarques :
  - erreurs de la banque (réponse ou calcul faux) : 0 ;
  - ambiguïtés corrigées : 5 (048, 098 et 150 : arrondi non précisé ; 053 : « masse atomique » ; 025 : arrondi différent de celui du cours) ;
  - énoncé ou explication à améliorer : 3 (012 : maille irréaliste ; 022 : réseau hors cours ; 084 : explication approximative) ;
  - distracteurs défendables : 0 ;
  - variantes manquantes : 0 (047, 049, 096, 097, 100 et 147 acceptaient déjà les variantes signalées ; 050 : le point décimal est accepté par la comparaison numérique) ;
  - erreurs du relecteur : 1 (149 : accepter « 32 768 » avec espace irait contre la règle du guide, qui interdit tout séparateur de milliers dans une réponse acceptée ; l'énoncé précise « sans espace ») ;
  - simples confirmations de calcul ou de raisonnement, sans action : 11 (045, 052, 063, 075, 082, 094, 095, 115, 120, 132, 139).

## Corrections faites

| Source | Problème | Décision |
|---|---|---|
| ens-sci:ch2:banque:012 | Maille cubique portant des atomes seulement aux centres des faces : réseau irréaliste, absent du cours. | Remplacée (même type, même difficulté) : nombre d'ions Na⁺ apportés par les 12 milieux d'arêtes de la maille de NaCl (12 × 1/4 = 3). |
| ens-sci:ch2:banque:022 | Réseau cubique centré non étudié dans le cours. | Gardée (comptage déductible du tableau des contributions) ; l'explication le signale. |
| ens-sci:ch2:banque:025 | Proposition 8,98 × 10³ kg/m³ alors que le cours écrit 8,97 × 10³ (le cours arrondissait V à 4,70 × 10⁻²⁹ m³ mais divisait par la valeur exacte). | Énoncé et cours alignés sur V ≈ 4,705 × 10⁻²⁹ m³ ; bonne réponse 8,97 × 10³ kg/m³ ; distracteur N = 8 recalculé (1,79 × 10⁴). **Cours modifié** (section « De la maille à la masse volumique »). |
| ens-sci:ch2:banque:048 | Arrondi non précisé (2697,6 kg/m³). | Énoncé : « arrondie à la dizaine » ; réponses 2700 et 2698, marge relative 2 %. |
| ens-sci:ch2:banque:053 | « Masse atomique » évoque une masse molaire. | Remplacé par « la masse d'un atome de polonium ». |
| ens-sci:ch2:banque:084 | L'explication disait « un million de fois plus petite » alors que le rapport vaut 1,8 × 10⁶. | Explication précisée (environ 1,8 × 10⁶, de l'ordre du million). |
| ens-sci:ch2:banque:098 | Arrondi non précisé (2167,6 kg/m³) ; 2165 (valeur mesurée) acceptée comme référence. | Énoncé : « arrondie à la dizaine » ; réponses 2170 et 2168, marge relative 1 %. |
| ens-sci:ch2:banque:150 | Arrondi non précisé (19 258,7 kg/m³). | Énoncé : « arrondie à la centaine » ; réponses 19300 et 19259, marge relative 1 %. |

## Totaux

- 150 questions, sources `ens-sci:ch2:banque:001` à `150`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 60 / 59 / 31.
- Positions des bonnes réponses des qcm_unique : 19 / 19 / 19 / 18 (indices 0 à 3).
- La bonne réponse est strictement la plus longue dans 22 qcm_unique sur 75 (29 %).
- Contrôle du pilote : « Banque du chapitre 2 conforme : 150 questions. » ; cours : « Nettoyage HTML : rien n'est retiré. »

## Questions laissées à relire

Aucune.

## Points de doute pour l'enseignant

- Valeurs à aligner sur le manuel : masse volumique du graphite (2 250 kg/m³ ; de 2 090 à 2 260 selon les sources), profondeur de formation du diamant (plus de 150 km environ), part minérale de l'os (environ deux tiers) et de l'émail (environ 96 %), taille des cristaux de Naica (plus de 10 m).
- Paramètres de maille et masses d'atomes utilisés dans les calculs : Cu 361 pm, NaCl 564 pm, Po 335 pm, Al 405 pm, Ag 409 pm, Au 408 pm ; masses arrondies à 3 ou 4 chiffres significatifs.
- Le programme 2023 n'exige plus la compacité : elle n'est donnée qu'à titre d'information (74 % et 52 %), sans calcul.
- Le chapitre traite le réseau cubique simple et le cubique à faces centrées ; le cubique centré n'apparaît que dans une question de comptage (022).
- Exemple « science et société » retenu : l'amiante ; esprit critique : la lithothérapie, opposée à la propriété réelle du quartz des montres.
