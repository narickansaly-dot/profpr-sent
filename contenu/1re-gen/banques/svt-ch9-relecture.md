# Relecture de la banque du chapitre 9 de SVT (1re spécialité) contre le cours

Banque `svt-ch9.json` (150 questions) du chapitre 9 « La dynamique des zones de divergence ».

## Méthode

1. Rédaction du chapitre puis de la banque, en quatre parties fusionnées (75 qcm_unique, 30 qcm_multiple, 30 vrai/faux, 15 réponses courtes).
2. Auto-relecture de chaque question contre le texte brut du chapitre : une seule bonne réponse, information présente dans le texte, aucune question qui donne la réponse d'une autre. Reformulation de plusieurs questions qui se recoupaient, distracteurs allongés pour limiter le biais de longueur, positions des bonnes réponses réparties.
3. **Relecture indépendante** : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses.
4. Comparaison automatique de ses réponses avec les réponses attendues, puis arbitrage de chaque écart et de chaque remarque.

## Relecture indépendante

Accord initial : **150/150** (aucun écart). Dix remarques sur des questions où le relecteur est d'accord :

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch9:banque:018 | « Comportement mécanique » appelle plutôt rigide/ductile, alors que la réponse porte sur l'état physique. | Corrigée : « Quel est l'état physique du manteau… ». |
| svt:ch9:banque:060 | Demi-vitesse (1 cm/an) et vitesse d'expansion (2 cm/an) toutes deux proposées. | Corrigée : 1 cm/an remplacé par 5 cm/an ; explication détaillée. Le chapitre (exemple 200 km en 10 Ma) était juste : 2 cm/an y est bien la demi-vitesse et 4 cm/an l'expansion ; un encadré « Attention » distinguant demi-vitesse et vitesse d'expansion a été ajouté. |
| svt:ch9:banque:073 | Réponse déduite (minéraux hydratés limités à la croûte et au manteau superficiel). | Chapitre complété (section Hydrothermalisme) : les minéraux hydratés se forment là où l'eau circule, sur les premiers kilomètres, pas plus bas ; explication ajustée. |
| svt:ch9:banque:107 | Thingvellir n'est pas nommé « vallée axiale » dans le cours. | Chapitre complété (section 1) : la vallée de Thingvellir est la vallée axiale de la dorsale médio-atlantique ; explication ajustée. |
| svt:ch9:banque:127 | Densité moyenne 3,26 contre 3,25 : bascule selon l'arrondi. | Corrigée : lithosphère de 12 km, densité 3,1, nettement inférieure à 3,25 (affirmation vraie, difficulté 3 conservée). |
| svt:ch9:banque:141 | Accepter « par conduction », « conduction thermique ». | Gardée : ces variantes étaient déjà acceptées. |
| svt:ch9:banque:144 | Accepter « la hornblende ». | Gardée : variante déjà acceptée. |
| svt:ch9:banque:147 | Accepter « pillow lava », « pillows », « pillow-lavas ». | Gardée : variantes déjà acceptées. |
| svt:ch9:banque:148 | Accepter « feldspath plagioclase », « le plagioclase ». | Gardée : variantes déjà acceptées. |
| svt:ch9:banque:149 | Réponse difficile à taper exactement. | Corrigée : ajout de « dorsale Pacifique Est », « ride est-pacifique », « ride est pacifique », « ride du Pacifique Est ». |

## Totaux

- 150 questions ; types 75 / 30 / 30 / 15 ; difficultés 61 / 62 / 27.
- Vrai/faux : 15 vrais, 15 faux.
- La bonne réponse des qcm_unique est la plus longue dans 16 cas sur 75.
- Contrôle (`verifierBanque`) : « Banque du chapitre 9 conforme : 150 questions. »


## Seconde vérification indépendante

Les 6 questions modifiées (`ch9-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 6/6**. Il confirme le calcul de la 127 (densité ≈ 3,1 < 3,25) ; les variantes demandées pour la 149 étaient déjà acceptées. Aucune modification.

## Questions laissées à relire

Aucune question ne reste douteuse. Les calculs reposent sur des valeurs choisies dans le cours : loi e ≈ 10 √t (le coefficient varie de 7 à 10 selon les manuels) et densités 2,9 (croûte), 3,3 (manteau lithosphérique) et 3,25 (asthénosphère). Les questions le rappellent dans l'énoncé quand le calcul en dépend.

À relire : aucune
