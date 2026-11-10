# Relecture de la banque du chapitre 1 de STSS contre le cours

Relecture des 150 questions de `stss-ch1.json` contre le texte du chapitre (`npm run banque:texte -- 1 --cours stss`), question par question, sans échantillonnage. Critères : exactitude selon le cours seul, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, aucune donnée extérieure au chapitre, variantes des réponses courtes, interdits du § 3 de la spec, typographie (espace insécable U+00A0 vérifiée par script, aucune entité `&nbsp;`) et tutoiement.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| stss:ch1:banque:010 | La bonne réponse « La variation selon les cultures de chaque société » reprenait le mot « sociétés » de l'énoncé et était la plus longue. | Corrigée : bonne réponse réduite à « La variation selon les cultures ». |
| stss:ch1:banque:012 | Deux distracteurs se recoupaient (« Sa fatigue au réveil et ses maux de tête » et « Ses maux de tête »). | Corrigée : le second devient « Son épuisement et sa mauvaise humeur ». |
| stss:ch1:banque:019 | Variante « mental » absente (la 061 accepte « social »). | Corrigée : variante ajoutée. |
| stss:ch1:banque:020 | Distracteurs « Aucune des deux » et « Les deux de la même façon », proches des formules interdites par le § 3. | Corrigée : remplacés par « L'examen du patient par le médecin » et « Le repos conseillé au patient ». |
| stss:ch1:banque:029 | Reformulation proche de la 018 (le bien-être « complet » est un idéal presque inatteignable), idée reprise aussi en 124. | Remplacée : qcm_unique (difficulté 3) sur l'étape 4 de l'analyse du cas d'Inès (repérer une préoccupation de santé publique). |
| stss:ch1:banque:042 | Deux lectures : « la maladie qui touche tout le pays chaque hiver, comme la grippe » appelait aussi « la grippe » ; une épidémie n'est pas une maladie. | Corrigée : l'énoncé demande le nom du phénomène collectif ; explication reprise. |
| stss:ch1:banque:046 | Bonne réponse seule sans « Parce que » face à trois distracteurs qui commencent ainsi : repérable par la forme. | Corrigée : forme alignée. |
| stss:ch1:banque:047 | Doublon de la 046 (la santé collective n'est pas une addition de cas), en vrai/faux. | Remplacée : vrai/faux (faux, difficulté 3) sur « De l'analyse à l'action » : on n'agit pas de la même manière selon la façon dont on voit la santé. |
| stss:ch1:banque:054 | Doublon de la 085 (la méthode compte cinq étapes). | Remplacée : vrai/faux (vrai, difficulté 1) : l'approche biomédicale est indispensable pour soigner. |
| stss:ch1:banque:057 | Énoncé sans contexte (« Quelles sont des conséquences sociales et économiques ? ») ; explication qui ne justifiait rien. | Corrigée : énoncé situé dans les critères de repérage d'une préoccupation ; explication reprise avec les mots du cours. |
| stss:ch1:banque:066 | Même défaut de forme que la 046 (bonne réponse seule sans « Parce que »). | Corrigée : forme alignée. |
| stss:ch1:banque:068 | « Il garde le moral et vit mieux sa convalescence » est une conséquence, pas un « cas » où les liens jouent dans le bon sens : deux lectures. | Corrigée : énoncé « Qu'est-ce qui fait jouer les liens… » ; la proposition devient un distracteur (« Il reste seul chez lui, sans nouvelles de ses amis ») ; bonnes réponses 2 (amis qui viennent, aide pour les cours) ; explication reprise. |
| stss:ch1:banque:072 | Variante « O.M.S » (sans point final) absente. | Corrigée : variante ajoutée. |
| stss:ch1:banque:077 | Doublon de la 100 (santé ressentie = santé perçue). | Remplacée : vrai/faux (vrai, difficulté 1) : les vagues de chaleur risquent de devenir plus fréquentes avec le réchauffement climatique. |
| stss:ch1:banque:087 | Doublon de la 016 (une personne qui tousse ne dit rien de la santé d'une ville), phrase du cours recopiée. | Remplacée : vrai/faux (vrai, difficulté 2) : une question sanitaire concerne la santé d'une personne ou d'une population. |
| stss:ch1:banque:097 | Variante au singulier « déterminant » absente. | Corrigée : variante ajoutée. |
| stss:ch1:banque:106 | Doublon de la 063 (question simple, réponses de « très bon » à « très mauvais »). | Remplacée : qcm_unique (difficulté 2) : dans l'analyse d'Inès, « elle se sent épuisée et de mauvaise humeur » relève de la santé ressentie. |
| stss:ch1:banque:112 | Doublon de la 027 et de la 144 (mots « hausse », « plan national » comme indices). | Remplacée : vrai/faux (vrai, difficulté 3) : on peut avoir une maladie sans le savoir et se sentir bien (hypertension artérielle). |
| stss:ch1:banque:118 | Même défaut de forme que la 046 (bonne réponse seule sans « Que »). | Corrigée : forme alignée. |
| stss:ch1:banque:140 | Doublon de la 062 (la définition de l'OMS décrit un état fixe), idée reprise aussi en 124. | Remplacée : vrai/faux (vrai, difficulté 2) : le surpoids et l'obésité favorisent aussi les maladies cardiovasculaires. |
| stss:ch1:banque:145 | Deux lectures : l'énoncé commençait par « Sami se casse la jambe », donc la dimension physique était aussi touchée ; distracteurs « … seulement » et « Aucune dimension ». | Corrigée : la question porte sur les seules conséquences citées (entraînement, amis, cours) ; distracteurs « La dimension mentale », « La dimension physique », « La dimension économique » ; explication reprise. |

## Totaux

- Gardées sans changement : 129
- Corrigées : 13 (010, 012, 019, 020, 042, 046, 057, 066, 068, 072, 097, 118, 145)
- Remplacées : 8 (029, 047, 054, 077, 087, 106, 112, 140), avec le même type et la même difficulté ; les vrai/faux remplacés gardent leur valeur.

Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 15 vrais, 15 faux) ; difficultés 59 / 62 / 29 ; position de la bonne réponse des qcm_unique : 19 / 19 / 19 / 18. `npm run banque:verifier -- 1 --cours stss` : « Banque du chapitre 1 conforme : 150 questions. »

## Points de doute pour l'enseignant

1. **Paires inverses** : 015 et 035 (santé individuelle), 074 et 093 (enjeux), 031 et 113 (René Leriche), 013, 064 et 110 (données chiffrées de la santé collective), 036 et 138 (ce dont la santé varie), 104, 126 et 128 (le tabac selon les époques). Les énoncés diffèrent par le type ou le sens de la question, mais le contenu se répète.
2. **Critiques de l'OMS** : 018, 062 et 124 portent encore toutes sur les deux critiques (idéal, état fixe) ; gardées car de types différents.
3. **Vrai/faux qui recopient presque une phrase du cours** : 070 (définition de la santé globale), 110, 148. Admis comme dans la banque BPH ; à reformuler si tu veux appliquer strictement l'interdit du copier-coller.
4. **Difficultés** : 014 (dernière étape de la méthode) et 040 (buts de la santé publique) sont cotées 3 pour un rappel direct ; 112 (remplaçante) est cotée 3 pour garder la répartition. À baisser si les quotas le permettent.
5. **008** : la date 1946 figure dans le cours, mais une question de date pure a peu d'intérêt pédagogique.
6. **029** (remplaçante) : l'étape 4 du tableau d'Inès mentionne aussi que le sujet « concerne beaucoup de jeunes » ; l'énoncé ne retient que les conséquences et les possibilités d'agir, pour ne pas laisser « Changer d'échelle » défendable.
