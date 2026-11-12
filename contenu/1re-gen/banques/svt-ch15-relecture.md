# Relecture de la banque du chapitre 15 de SVT (1re) contre le cours

Banque `svt-ch15.json`, 150 questions sur le chapitre 15 (« L'immunité innée »).

## Méthode

1. **Rédaction** : 150 questions écrites à partir du seul texte du chapitre, sans reprendre deux fois le même fait. Les mots demandés en réponse courte n'apparaissent dans aucun autre énoncé ni aucune autre proposition (vérifié par script).
2. **Auto-relecture** : chaque question relue contre le texte brut du chapitre. Les distracteurs ont été allongés pour corriger le biais de longueur, et les énoncés qui donnaient la réponse d'une autre question ont été reformulés.
3. **Relecture indépendante** : un sous-agent a résolu les 150 questions sans voir les réponses, avec le seul texte du chapitre.
4. **Comparaison automatique** de ses réponses avec les réponses attendues.
5. **Arbitrage** de chaque remarque, puis nouveau contrôle `verifierBanque`.

## Relecture indépendante

Accord initial : 150/150. Aucun écart ; 8 remarques sur des questions où le relecteur était d'accord.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch15:banque:037 | Les mastocytes pourraient aussi être qualifiés de sentinelles. | Gardée : les mastocytes ne figurent pas dans les propositions, et la réponse (macrophages et cellules dendritiques) est celle du tableau du cours. |
| svt:ch15:banque:049 | La question donne la définition de la diapédèse. | Gardée : aucune autre question ne demande ce mot. |
| svt:ch15:banque:080 | Les virus rangés parmi les « êtres vivants microscopiques » : discutable. | Corrigée : l'énoncé parle de « micro-organismes », comme le texte. |
| svt:ch15:banque:139 | Accepter « la rate ». | Déjà acceptée ; rien à changer. |
| svt:ch15:banque:142 | Accepter le singulier « pseudopode ». | Déjà accepté ; rien à changer. |
| svt:ch15:banque:143 | Variantes Élie Metchnikoff, Metchnikov, Mechnikov. | Corrigée : ajout de « Élie Mechnikov », « Elie Mechnikov », « Elie Metchnikov » et « Ilia Metchnikov ». |
| svt:ch15:banque:145 | Accepter « résolution de l'inflammation » et « la résolution ». | Déjà acceptées ; rien à changer. |
| svt:ch15:banque:146 | Variantes cyclooxygénase, cyclo-oxygénase, COX. | Corrigée : ajout de « COX », « la COX » et « cyclooxygenase » ; le chapitre mentionne désormais le sigle (« la cyclo-oxygénase, ou COX »), et l'explication aussi. |

## Totaux

- 150 questions ; types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux, 15 reponse_courte.
- Vrai/faux : 15 vrais, 15 faux.
- Difficultés : 61 (niveau 1), 61 (niveau 2), 28 (niveau 3).
- Biais de longueur : la bonne réponse est la plus longue dans 3 qcm_unique sur 75 (et la plus courte dans 21).
- Contrôle `verifierBanque` : « Banque du chapitre 15 conforme : 150 questions. »

## Questions laissées à relire

Aucune question ne reste douteuse. Les données des calculs (pourcentages de phagocytose, nombres de leucocytes) sont des exemples construits pour l'exercice, présentés comme tels.

À relire : aucune
