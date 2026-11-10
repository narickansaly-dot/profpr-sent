# Relecture de la banque du chapitre 2 de BPH contre le cours

Relecture des 130 questions de `bph-ch2.json` contre le texte du chapitre (`npm run banque:texte -- 2`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication (probabilités recalculées), niveau 1re ST2S, règles du § 3 de la spec (typographie avec espace insécable vérifiée par script), doublons d'idée avec les autres questions de la banque et les 20 questions existantes du chapitre.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| bph:ch2:banque:008 | Doublon de la 001 : composition d'un nucléotide (sucre, phosphate, base), en qcm_multiple. | Remplacée : qcm_multiple (difficulté 2) sur l'ADN (brins = chaînes de nucléotides, nom complet ; l'ADN ne quitte pas le noyau, ses brins ne sont pas des acides aminés). |
| bph:ch2:banque:011 | Variante sans accent avec article absente. | Corrigée : ajout de « la replication ». |
| bph:ch2:banque:013 | Difficulté 2 pour une lecture directe de l'exemple du groupe sanguin. | Corrigée : difficulté 2 → 1 (compense les replacements cotés 2). |
| bph:ch2:banque:019 | Doublon de la 013 (allèles A, B, O du groupe sanguin). Les deux distracteurs disaient la même chose (« chaque allèle est un gène différent », « O est un gène différent »), comme les deux bonnes réponses. L'explication ajoutait « le même locus », non écrit dans le cours. | Remplacée : qcm_multiple (difficulté 2), génotype (A//O) du groupe sanguin → deux allèles différents, hétérozygote. |
| bph:ch2:banque:028 | Doublon de la 030 (gamètes haploïdes à 23 chromosomes), elle-même proche de la question existante quiz:3. | Remplacée : vrai/faux (vrai, difficulté 1) sur la signification de « +21 » dans 47,XX,+21. |
| bph:ch2:banque:030 | Distracteur « Ils possèdent 22 paires d'autosomes » : faux seulement par une déduction fine (n = 23, pas de paires), source de confusion avec les 22 paires du caryotype. | Corrigée : distracteur remplacé par « Ils sont produits par la mitose » ; explication complétée (méiose). |
| bph:ch2:banque:034 | Redite de la 045 (transcription → ARN messager, dans les deux sens). | Remplacée : qcm_unique (difficulté 1) sur les ribosomes qui lisent l'ARNm codon par codon. |
| bph:ch2:banque:039 | Doublon de la 033 (lieu de la transcription), aussi repris dans la 043. | Remplacée : vrai/faux (faux, difficulté 2) : le phénotype ne s'observe pas « uniquement à l'échelle de l'organisme » (échelles moléculaire, cellulaire, organisme). |
| bph:ch2:banque:044 | Doublon de la 037 (codons stop). | Remplacée : qcm_multiple (difficulté 2) sur l'ARN messager (sortie par les pores nucléaires, traduction en acides aminés ; ni thymine, ni fabrication dans le cytoplasme). |
| bph:ch2:banque:053 | Doublon de la 051 (mutation spontanée par erreur de réplication). | Remplacée : vrai/faux (faux, difficulté 2) : ΔF508 n'est pas une insertion mais une délétion. |
| bph:ch2:banque:059 | Bonne réponse recopiant presque toute la phrase du cours sur la télophase, et la plus longue. | Corrigée : bonne réponse réduite à « un noyau se reforme à chaque pôle ». |
| bph:ch2:banque:063 | Doublon de la 066 (rôles de la mitose, dont la cicatrisation) et de la question existante bis:6. | Remplacée : vrai/faux (faux, difficulté 2) : chaque cellule fille reçoit une chromatide de chaque chromosome, pas les deux (figure 2.4). |
| bph:ch2:banque:066 | Doublon de la question existante bis:6 (rôles de la mitose : croissance, renouvellement des tissus). Relevé à la revue de la tâche. | Remplacée : qcm_multiple (difficulté 1) sur les traitements du cancer (immunothérapie, radiothérapie, chirurgie ; la kinésithérapie respiratoire relève de la mucoviscidose). |
| bph:ch2:banque:068 | Redite de la 057 : « l'enveloppe du noyau disparaît en prophase » était testé deux fois. | Corrigée : bonnes réponses « condensation » et « fuseau » ; nouveau distracteur « alignement sur la plaque équatoriale » (métaphase) ; explication reprise. |
| bph:ch2:banque:080 | Doublon de la 086 (définition de l'hétérozygote) et de la question existante bis:5. | Remplacée : vrai/faux (faux, difficulté 1) : un allèle dominant est noté en majuscule. |
| bph:ch2:banque:084 | Doublon de la 072 (allèle récessif : ne s'exprime que chez l'homozygote), signalé par la rédaction. | Remplacée : qcm_multiple (difficulté 3) : génotypes de phénotype [sain] pour une maladie autosomique récessive, (A//A) et (A//a). |
| bph:ch2:banque:085 | Doublon de la question existante quiz:5 (risque de 1/4 pour deux parents porteurs), ici en pourcentage. Relevé à la revue de la tâche. | Remplacée : réponse courte (difficulté 3) : la division du cytoplasme en télophase s'appelle la cytodiérèse. |
| bph:ch2:banque:086 | Doublon de la question existante bis:5 (définition de l'hétérozygote). Relevé à la revue de la tâche. | Remplacée : réponse courte (difficulté 1) : les chromosomes sexuels s'appellent aussi gonosomes. |
| bph:ch2:banque:093 | Difficulté 2 pour un rappel direct (hématies détruites plus vite). | Corrigée : difficulté 2 → 1. |
| bph:ch2:banque:096 | Variante sans accent absente. | Corrigée : ajout de « hemoglobine S ». |
| bph:ch2:banque:097 | `marge_relative` de 10 % : 1 800 ou 2 200 acceptés pour une valeur du cours (1 sur 2 000), trop permissif. | Corrigée : `marge` 0, sans marge relative. |
| bph:ch2:banque:107 | Doublon de la 100 (le canal CFTR laisse sortir les ions chlorure). | Remplacée : réponse courte (difficulté 2) : le gène CFTR est sur le chromosome 7. |
| bph:ch2:banque:112 | Énoncé « Que dit le cours du… » maladroit. | Corrigée : « Quel est le statut du dépistage prénatal de la trisomie 21 ? ». |
| bph:ch2:banque:113 | Doublon de la 117 (47 chromosomes dans la trisomie 21). | Remplacée : vrai/faux (vrai, difficulté 1) : la scolarisation adaptée fait partie de l'accompagnement. |
| bph:ch2:banque:120 | Distracteur « le VIH » défendable comme vrai : l'infection par le VIH est un cofacteur reconnu du cancer du col de l'utérus. | Corrigée : distracteur remplacé par « le virus de la varicelle » ; explication précisée. |
| bph:ch2:banque:125 | Doublon de la 128 (vaccination = prévention primaire). | Remplacée : vrai/faux (vrai, difficulté 2) : l'amiante, facteur de risque de cancer de la plèvre. |
| bph:ch2:banque:126 | Doublon de la 121 (chimiothérapie : médicaments et non rayons ; le distracteur « rayons » y figure déjà). | Remplacée : vrai/faux (faux, difficulté 2) : le dépistage du cancer du côlon repose sur un test immunologique, pas sur une mammographie. |

## Totaux

- Gardées sans changement : 103
- Corrigées : 10 (011, 013, 030, 059, 068, 093, 096, 097, 112, 120)
- Remplacées : 17 (008, 019, 028, 034, 039, 044, 053, 063, 066, 080, 084, 085, 086, 107, 113, 125, 126), dont 066, 085 et 086 au second tour, après la revue de la tâche

Répartition après relecture : types 64 / 26 / 27 / 13 (vrai/faux : 13 vrais, 14 faux, contre 16 / 11 avant) ; difficultés 50 / 54 / 26 ; `npm run banque:verifier -- 2` : « Banque du chapitre 2 conforme : 130 questions. »

Probabilités recalculées : 073 (enfant (A//a) : 1/4 + 1/4 = 1/2), 074 (enfant sain porteur : 2 cases sur 3 = 2/3), 078 (gamètes A et a, 1/2 chacun), 083 (génotypes possibles), 081 (risque inchangé à chaque grossesse) : toutes justes et conformes à l'échiquier du cours.

Points signalés par la rédaction et jugés acceptables :

- 003 et 009 (complémentarité TAGC → ATCG) : application directe de A–T, C–G.
- 087 : les distracteurs « glycine » et « méthionine » viennent de la figure 2.3.
- 102 et 012 : distracteurs chiffrés proches d'autres valeurs du cours, voulus.
- 048 : la bonne réponse reprend une cellule du tableau des mutations, pas une phrase entière.

## Points de doute pour l'enseignant

1. **073** : la probabilité 1/2 d'avoir un enfant (A//a) n'est pas écrite dans le cours ; elle se compte dans l'échiquier (deux cases sur quatre). À garder si tu veux faire lire l'échiquier.
2. **003** : même compétence que la question existante quiz:0 (écrire le brin complémentaire), avec une autre séquence. Gardée comme exercice d'application.
3. **081** : même idée que la question existante quiz:5 (risque de 1/4 à chaque grossesse, quel que soit l'état des enfants précédents), dans l'autre sens (premier enfant sain). Gardée faute d'autre matière, à écarter si tu la juges redondante.
4. **085** : la cytodiérèse n'apparaît qu'entre parenthèses dans le cours ; la question est cotée 3 pour cette raison.
5. **120** : le distracteur « hépatite A » est absent du cours (qui cite les hépatites B et C) ; il reste faux. « VIH » a été retiré, car c'est un cofacteur réel du cancer du col.
6. **019** : le génotype (A//O) applique la notation (A//a) du cours aux allèles du groupe sanguin ; la déduction « deux allèles différents → hétérozygote » relie deux définitions.
7. **053 et 099** : toutes deux portent sur ΔF508 (type de mutation pour la 053, conséquence sur la protéine pour la 099) ; angles différents, mais même exemple.
8. **015** : la définition du chromosome est rangée dans la notion « Gènes et allèles » (section « Gènes, allèles et chromosomes » du cours) ; on peut la passer en « Caryotype et chromosomes ».
9. **Quasi-doublons avec les questions existantes, laissés à ta décision** :
   - 104 (mucus épais et collant) et quiz:7 (pourquoi le mucus est épais) ;
   - 114 (la trisomie 21 n'est pas une substitution) et quiz:8 (mauvaise séparation des chromosomes pendant la méiose) ;
   - 124 (cellules cancéreuses dans le sang ou la lymphe) et quiz:9 (définition d'une métastase) ;
   - 030 (gamètes haploïdes à 23 chromosomes) et quiz:3 (nombre de chromosomes d'un spermatozoïde).
