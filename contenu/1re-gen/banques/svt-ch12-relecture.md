# Relecture de la banque du chapitre 12 de SVT (1re spécialité) contre le cours

Banque `svt-ch12.json` (150 questions) du chapitre 12 « L'humanité et les écosystèmes : services et gestion ».

## Méthode

1. Rédaction du chapitre puis de la banque, en trois parties fusionnées (75 qcm_unique, 30 qcm_multiple, 30 vrai/faux, 15 réponses courtes).
2. Auto-relecture de chaque question contre le texte brut du chapitre : une seule bonne réponse, information présente dans le texte, aucune question qui donne la réponse d'une autre (contrôle automatique des réponses courtes et des réponses brèves dans les autres questions, puis relecture manuelle). Plusieurs questions qui se recoupaient ont été reformulées ou remplacées ; quelques faits ont été ajoutés au chapitre pour éviter les doublons ; distracteurs allongés pour limiter le biais de longueur ; positions des bonnes réponses réparties.
3. **Relecture indépendante** : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses.
4. Comparaison automatique de ses réponses avec les réponses attendues, puis arbitrage de chaque écart et de chaque remarque.

## Relecture indépendante

Accord initial : **150/150** (aucun écart). Neuf remarques sur des questions où le relecteur est d'accord :

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch12:banque:066 | L'énoncé demande un risque, mais les distracteurs sont des bénéfices : réponse évidente. | Corrigée : trois distracteurs formulés comme des risques mais faux d'après le cours (pollinisation du blé, essences locales rendues invasives, repousse impossible sur sol intact) ; explication complétée. |
| svt:ch12:banque:073 | Le paiement pour services environnementaux n'est pas défini dans le cours, seulement illustré (Vittel). | Chapitre complété (section Monétarisation) : définition explicite (somme versée à des acteurs pour qu'ils adoptent des pratiques qui préservent un service). Question inchangée. |
| svt:ch12:banque:099 | Le cours ne décrit aucune mesure avant la coupe à Hubbard Brook. | Chapitre complété (section Impacts) : les écologues ont d'abord mesuré pendant quelques années les pertes des deux bassins avant la coupe. Question inchangée. |
| svt:ch12:banque:137 | Accepter « vautour » et « le vautour fauve ». | Gardée : variantes déjà acceptées. |
| svt:ch12:banque:141 | Accepter le pluriel « îlots de sénescence ». | Gardée : variante déjà acceptée. |
| svt:ch12:banque:142 | Accepter « ONF » et « Office national des forêts ». | Gardée : variantes déjà acceptées. |
| svt:ch12:banque:144 | Accepter « One Health », « Une seule santé », « seule santé ». | Gardée : variantes déjà acceptées (avec ou sans guillemets). |
| svt:ch12:banque:149 | Le cours dit « prélever moins que l'accroissement » ; « ne pas dépasser 3000 » reste cohérent. | Gardée : le relecteur juge lui-même la formulation cohérente ; la réponse attendue (3000 m³) est la limite à ne pas dépasser. |
| svt:ch12:banque:150 | Accepter « la trame verte et bleue ». | Gardée : variante déjà acceptée. |

## Totaux

- 150 questions ; types 75 / 30 / 30 / 15 ; difficultés 61 / 62 / 27.
- Vrai/faux : 15 vrais, 15 faux.
- La bonne réponse des qcm_unique est la plus longue dans 13 cas sur 75.
- Contrôle (`verifierBanque`) : « Banque du chapitre 12 conforme : 150 questions. »

## Questions laissées à relire

Aucune question ne reste douteuse. Les chiffres demandés sont ceux du cours (un million d'espèces menacées selon l'IPBES 2019, environ 60 % de maladies infectieuses transmises par des animaux, 235 à 577 milliards de dollars pour la pollinisation, 33 000 milliards de dollars en 1997) ; les calculs (8,5 ; 7 ; 3000 ; rapport 4) donnent toutes leurs données dans l'énoncé.

À relire : aucune
