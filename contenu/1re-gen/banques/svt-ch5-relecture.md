# Relecture de la banque du chapitre 5 de SVT (1re, spécialité) contre le cours

Banque `svt-ch5.json` : 150 questions sur le chapitre 5 (« L'expression du patrimoine génétique »).

## Méthode

1. **Rédaction** de la banque à partir du seul texte du chapitre (texte brut produit par `texte`), par parties enregistrées en JSON.
2. **Auto-relecture** question par question contre ce texte : une seule bonne réponse, information présente dans le cours, aucune question qui donne la réponse d'une autre (recherche automatique des réponses attendues dans les énoncés et propositions des autres questions, puis lecture). Une quarantaine de questions ont été réécrites ou remplacées à cette étape.
3. **Relecture indépendante** par un sous-agent qui a résolu les 150 questions sans voir les réponses, avec le seul texte du chapitre.
4. **Comparaison automatique** de ses réponses avec les réponses attendues, puis **arbitrage** de chaque écart et de chaque remarque (ci-dessous).

## Relecture indépendante

Accord initial : **143/150** (7 écarts, 0 question sans réponse).

Les 7 écarts viennent d'un décalage du relecteur, pas d'une erreur de la banque. Il a interverti les réponses de trois paires de questions voisines (103 et 104, 122 et 123, 132 et 133) et a donné à la 128 la réponse de la 129. Ses remarques portent aussi un numéro décalé d'une unité : sa « 012 » est la 013, sa « 081 » la 082, etc. Elles sont rapportées ici aux bonnes sources. Chaque écart a été revérifié contre le texte.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch5:banque:103 | Écart : attendu [0, 2] (développement, hormones) ; relecteur [1, 3], c'est-à-dire la réponse de la 104. | Gardée : le texte cite le développement et les hormones comme facteurs internes ; le code génétique et le nombre de chromosomes ne varient pas d'une cellule à l'autre. |
| svt:ch5:banque:104 | Écart : attendu [1, 3] (gène humain introduit, ribosomes de la bactérie) ; relecteur [0, 2], c'est-à-dire la réponse de la 103. | Gardée : les cellules receveuses traduisent « avec leur propre équipement », au niveau des ribosomes, et les bactéries n'ont pas de noyau. |
| svt:ch5:banque:122 | Écart : attendu vrai ; relecteur faux (réponse de la 123). | Gardée : « Le ribosome se fixe sur l'ARNm et le parcourt » est écrit dans le cours. |
| svt:ch5:banque:123 | Écart : attendu faux ; relecteur vrai (réponse de la 122). | Gardée : le codon stop n'apporte aucun acide aminé. |
| svt:ch5:banque:128 | Écart : attendu vrai ; relecteur faux (réponse de la 129). | Gardée : le code binaire utilise deux symboles, 0 et 1. |
| svt:ch5:banque:132 | Écart : attendu vrai ; relecteur faux (réponse de la 133). | Gardée : seul le 6e acide aminé de la chaîne β est remplacé. |
| svt:ch5:banque:133 | Écart : attendu faux ; relecteur vrai (réponse de la 132). | Gardée : les personnes HbA//HbS n'ont en général pas de symptômes. |
| svt:ch5:banque:013 | Son énoncé (passage de l'hémoglobine fœtale à l'hémoglobine adulte) donne la réponse de la 058. | Remplacée par une question du même type et de la même difficulté : nombre de codons de la glycine (4, d'après le tableau du code). |
| svt:ch5:banque:038 | Syntaxe lourde. | Reformulée : « Quelle protéine humaine produisent des bactéries ayant reçu un gène humain, pour soigner des personnes diabétiques ? » |
| svt:ch5:banque:078 | On peut hésiter à cocher « cellules riches en ARN » (une observation de Brachet, pas le problème de localisation). | Réécrite : l'énoncé vise le problème de localisation, et les deux bonnes propositions sont « l'ADN reste dans le noyau » et « les protéines sont fabriquées dans le cytoplasme ». |
| svt:ch5:banque:082 | Son énoncé (maturation du pré-ARNm dans le noyau d'une cellule eucaryote) donne la réponse de la 066. | Réécrite sans la maturation : ADN et transcription dans le noyau, traduction et assemblage des acides aminés hors du noyau. |
| svt:ch5:banque:090 | « Une protéine peut être fabriquée sans cellule vivante » décrit une condition de l'expérience plutôt qu'un résultat. | Proposition remplacée par un résultat : « On obtient une chaîne formée uniquement de phénylalanine ». |
| svt:ch5:banque:118 | Une « chaîne » d'un seul acide aminé est un cas limite. | Gardée : la réponse découle directement de la règle du cours (le codon initiateur apporte la méthionine, le codon stop n'apporte rien), et le relecteur l'a trouvée. |
| svt:ch5:banque:136 | Variantes : « peptidique » seul et « liaison peptidique ». | Déjà acceptées ; « liaison peptide » et « lien peptidique » ajoutées. |
| svt:ch5:banque:137 | Variantes : « ARN polymérase », « ARN-polymérase », « l'ARN polymérase », « polymérase ». | Déjà acceptées ; « une ARN polymérase » ajoutée. |
| svt:ch5:banque:145 | Variantes : « transgénique », « OGM », « génétiquement modifié », « organisme transgénique ». | Déjà acceptées ; pluriels et « organisme génétiquement modifié (OGM) » ajoutés. |
| svt:ch5:banque:146 | Variantes : « valine », « Val », « la valine ». | Déjà acceptées ; « valine (Val) » ajoutée. |
| svt:ch5:banque:148 | Accepter « 1 » et « 1 million ». | Énoncé précisé (« en millions d'octets, par un nombre seul, par exemple 5 pour 5 millions d'octets ») ; « 1 million », « un million », « 1 million d'octets » et « 1000000 » ajoutées. |

## Totaux

- 150 questions ; types 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux`, 15 `reponse_courte`.
- Vrai/faux : 15 vrais, 15 faux.
- Difficultés : 60 (1), 62 (2), 28 (3).
- Biais de longueur : la bonne réponse est la plus longue dans 19 `qcm_unique` sur 75 en comptant les égalités (nombres de même longueur, comme « 64 » et « 12 »), et dans 5 sur 75 en ne comptant que les cas où elle est strictement la plus longue.
- Contrôle (`verifierBanque`) : « Banque du chapitre 5 conforme : 150 questions. »


## Seconde vérification indépendante

Les 17 questions modifiées ou contestées (`ch5-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 17/17**. Ses remarques (variantes de 137, 145, 146) portaient sur des variantes déjà acceptées ; la 128 (code binaire) est jugée peu utile en SVT mais juste : gardée.

## Questions laissées à relire

Aucune question ne reste réellement douteuse : les écarts venaient d'un décalage du relecteur, et chaque remarque a été corrigée ou justifiée ci-dessus.

À relire : aucune
