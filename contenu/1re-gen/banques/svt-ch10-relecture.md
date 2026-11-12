# Relecture de la banque du chapitre 10 de SVT (1re spécialité) contre le cours

Banque `svt-ch10.json` du chapitre 10 (« La dynamique des zones de convergence »).

## Méthode

1. **Rédaction** : 150 questions écrites à partir du texte du chapitre (six sections : subduction et plan de Wadati-Benioff, densité et moteur de la subduction, métamorphisme du panneau, magmatisme de subduction, collision, marqueurs du raccourcissement), sur les dix notions du plan.
2. **Auto-relecture** : chaque question relue contre le texte brut du chapitre (une seule bonne réponse, information présente dans le texte) ; recherche des questions qui donnent la réponse d'une autre (une quinzaine d'énoncés ou de propositions reformulés ou remplacés) ; réduction du biais de longueur.
3. **Relecture indépendante** : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues.
4. **Comparaison automatique** de ses réponses avec les réponses attendues, puis **arbitrage** de chaque écart et de chaque remarque.

## Relecture indépendante

Accord initial : **150/150** (aucun écart, aucune question sans réponse). Huit remarques ont été traitées.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch10:banque:040 | 300 °C entre dans la plage du faciès schiste vert du tableau du cours ; seule la profondeur oriente vers le schiste bleu. | Corrigée : la température chiffrée est retirée (« à 35 km de profondeur, à basse température ») ; l'explication rappelle les domaines des trois faciès. |
| svt:ch10:banque:092 | Énoncé « Quelles roches… » incohérent avec des distracteurs formulés en « Du noyau externe », « Des volcans de l'arc ». | Corrigée : toutes les propositions désignent des roches (« Les roches du noyau externe », « Les laves des volcans de l'arc »). |
| svt:ch10:banque:136 | Accepter « la glaucophane ». | Déjà acceptée ; ajout de « amphibole glaucophane » et « une glaucophane ». |
| svt:ch10:banque:137 | Accepter « coin mantellique », « coin du manteau ». | Déjà acceptées ; ajout de « coin de manteau hydraté » et du pluriel. |
| svt:ch10:banque:139 | Accepter « traction du panneau plongeant », « traction de la plaque ». | Ajout de « traction de la plaque », « traction du slab », « traction gravitaire du panneau » (« traction du panneau plongeant » et « slab pull » déjà acceptées). |
| svt:ch10:banque:142 | Double lecture : « épaississement crustal » (le phénomène) ou « racine crustale » (la partie profonde). | Corrigée : l'énoncé demande désormais le nom de « la partie épaissie de la croûte qui s'enfonce sous une chaîne », ce qui désigne sans ambiguïté la racine crustale. |
| svt:ch10:banque:144 | Accepter le pluriel et « surface de chevauchement ». | Ajout de « surface de chevauchement », « contact de chevauchement », « surface de contact anormal » (pluriel déjà accepté). |
| svt:ch10:banque:150 | Accepter le singulier et « serpentine ». | Singulier déjà accepté ; ajout de « serpentine », « la serpentine », « serpentines ». |

## Totaux

- 150 questions ; types 75 qcm_unique / 30 qcm_multiple / 30 vrai_faux / 15 reponse_courte.
- Vrai/faux : 15 vrais, 15 faux.
- Difficultés : 60 (1) / 60 (2) / 30 (3).
- Biais de longueur : la bonne réponse des qcm_unique est la plus longue dans 17 cas sur 75 ; positions des bonnes réponses 19 / 19 / 19 / 18.
- Contrôle (`verifierBanque`) : « Banque du chapitre 10 conforme : 150 questions. »


## Seconde vérification indépendante

Les 8 questions modifiées (`ch10-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 8/8**. Ses remarques (137 « coin mantellique », 150 « serpentinite ») portaient sur des variantes déjà acceptées. Aucune modification.

## Questions laissées à relire

Aucune question ne reste douteuse après arbitrage. Les valeurs numériques (densités, seuil de 25 à 30 Ma, solidus à 100 km, épaisseurs crustales) sont celles du cours et cohérentes avec le chapitre 9.

À relire : aucune
