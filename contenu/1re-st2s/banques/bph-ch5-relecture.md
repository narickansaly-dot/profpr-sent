# Relecture de la banque du chapitre 5 de BPH contre le cours

Relecture des 130 questions de `bph-ch5.json` contre le texte du chapitre (`npm run banque:texte -- 5`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, règles du § 3 de la spec (typographie avec espace insécable vérifiée par script). Les 20 questions existantes du chapitre dans `bph.json` ont été prises en compte pour les redites.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| bph:ch5:banque:014 | La bonne réponse recopiait en entier la définition du nutriment (phrase du cours) ; l'énoncé « quelle est la différence » ne correspondait pas à une réponse qui ne parle que du nutriment. Difficulté 3 pour un rappel. | Corrigée : énoncé « Quel lien existe-t-il entre un aliment et un nutriment ? », bonne réponse « Le nutriment est produit par la digestion de l'aliment », distracteurs repris ; difficulté 3 → 2. |
| bph:ch5:banque:017 | Bonne réponse = définition complète de l'enzyme recopiée du cours, et nettement la plus longue. | Corrigée : bonne réponse réduite à « Une protéine qui accélère une réaction ». |
| bph:ch5:banque:023 | Redite de la 074 (nutriments issus des lipides) et de « Je retiens ». | Remplacée : qcm_unique (difficulté 2, notion Gros intestin et microbiote) sur le nombre de bactéries du microbiote (environ 100 000 milliards). |
| bph:ch5:banque:026 | Distracteur « Dans le foie » hors de la question (le foie ne fait pas partie du tube digestif). | Corrigée : distracteur remplacé par « Dans la bouche ». |
| bph:ch5:banque:039 | Distracteur incohérent « Dans le foie, en acides aminés » (répond à une autre question). Difficulté 3 pour un rappel direct. | Corrigée : distracteur « Dans le cerveau » ; difficulté 3 → 2. |
| bph:ch5:banque:048 | « Complication aiguë » : le cours range l'acidocétose comme « urgence vitale », pas dans la liste des complications aiguës. | Corrigée : énoncé « Quelle urgence vitale, due aux corps cétoniques, peut survenir dans le diabète de type 1 ? ». |
| bph:ch5:banque:050 | « De première intention » n'est pas dans le cours. | Corrigée : énoncé « Quel traitement médicamenteux le cours cite-t-il, avec les règles hygiéno-diététiques, pour le diabète de type 2 ? ». |
| bph:ch5:banque:052 | Énoncé vague (« Que révèle le test… ») et deux distracteurs portant sur la glycémie à jeun, hors du test. | Corrigée : « Lors d'un test d'hyperglycémie provoquée par voie orale, quel résultat signe un diabète ? », distracteurs tous situés dans le test (avant l'ingestion, à 1 h, à 2 h sous le seuil). |
| bph:ch5:banque:056 | Le tableau de l'IMC vaut pour l'adulte ; l'énoncé disait « une personne » et « son interprétation ». | Corrigée : « Un adulte de 60 kg mesure 1,50 m. Comment interpréter son IMC ? ». |
| bph:ch5:banque:065 | Difficulté 3 pour un rappel direct. | Corrigée : difficulté 3 → 2. |
| bph:ch5:banque:089 | Difficulté 2 sous-estimée : il faut repérer la proposition inversée (« dépenses supérieures aux apports »). | Corrigée : difficulté 2 → 3. |
| bph:ch5:banque:093 | Redite de la 002 (musculeuse = muscle lisse). | Remplacée : vrai/faux (vrai, difficulté 1) sur la sous-muqueuse, qui contient vaisseaux et nerfs. |
| bph:ch5:banque:098 | Redite de la 030 (acides gras → lymphe), elle-même proche de la 107. | Remplacée : vrai/faux (vrai, difficulté 2, notion Foie et pancréas) sur la synthèse des protéines du plasma par le foie, rôle absent jusque-là de la banque. |
| bph:ch5:banque:099 | Application d'un seuil à une valeur (0,60 g/L) : difficulté 2 sous-estimée, à côté de la 051 qui demande le seuil lui-même. | Corrigée : difficulté 2 → 3. |
| bph:ch5:banque:103 | Redite de la 064 (les IPP réduisent la sécrétion acide). | Remplacée : vrai/faux (vrai, difficulté 2) sur l'ulcère du duodénum. |
| bph:ch5:banque:113 | Application du tableau de l'IMC à une valeur : cotée 3 pour compenser les baisses de 014, 039 et 065. | Corrigée : difficulté 2 → 3. |
| bph:ch5:banque:117 | Redite de la 127 (« reflète la glycémie moyenne des 3 derniers mois », écrit dans son énoncé) et de la question existante `bph:ch5:bis:9`. | Remplacée : vrai/faux (faux, difficulté 2, notion Foie et pancréas) : « La trypsine… est fabriquée par le foie ». |
| bph:ch5:banque:119 | Réponse lisible dans l'énoncé : « suc pancréatique » → pancréas. | Corrigée : énoncé « Quelle glande mixte possède des îlots de Langerhans qui sécrètent l'insuline et le glucagon ? ». |
| bph:ch5:banque:121 | Variante au pluriel « réactions d'hydrolyse » absente. | Corrigée : variante ajoutée. |
| bph:ch5:banque:123 | Troisième question sur « lipides = 9 kcal/g » (009, 112, 123), avec une marge 0 signalée par la rédaction. | Remplacée : réponse courte (difficulté 2, notion Gros intestin et microbiote) sur le côlon, où le microbiote fermente les fibres ; variantes « côlon », « le côlon », « colon », « le colon ». |

## Totaux

- Gardées sans changement : 110
- Corrigées : 14 (014, 017, 026, 039, 048, 050, 052, 056, 065, 089, 099, 113, 119, 121)
- Remplacées : 6 (023, 093, 098, 103, 117, 123)

Répartition après relecture : types 65 / 26 / 26 / 13 (vrai/faux : 13 vrais, 13 faux) ; difficultés 54 / 51 / 25 ; notions : Diabète 25, Régulation de la glycémie 15, Digestion mécanique et chimique 14, Absorption intestinale 12, Aliments et nutriments 11, Obésité et IMC 11, Anatomie du tube digestif 10, Ulcère gastrique 9, Foie et pancréas 8, Gros intestin et microbiote 8, Enzymes et leurs propriétés 7. `npm run banque:verifier -- 5` : « Banque du chapitre 5 conforme : 130 questions. »

Rééquilibrage : les remplacements font passer Foie et pancréas de 6 à 8 et Gros intestin et microbiote de 6 à 8, au détriment de Diabète (26 → 25), Aliments, Digestion et Absorption. Diabète reste la notion la plus fournie, ce qui correspond à la section la plus dense du chapitre ; la réduire davantage aurait obligé à écrire des redites sur des sections très courtes.

Points signalés par la rédaction et jugés acceptables :

- 056 et 124 (calculs d'IMC) : justes (60 / 1,5² ≈ 26,7 ; 64 / 1,6² = 25, marge 0,5).
- 046 et 029 : seuil de glycosurie (environ 1,8 g/L) et hauteur de villosité (environ 1 mm), valeurs données dans le texte.
- 058 et 111 : lecture directe du texte (60 minutes pour un adolescent ; pas de prévention possible du type 1).

## Points de doute pour l'enseignant

1. **025** : « l'amylase salivaire est peu efficace dans l'estomac » se déduit du pH optimal (7) et du pH de l'estomac (2, déduit de la pepsine « de l'estomac » qui fonctionne vers pH 2) ; le cours ne dit ni que l'estomac est à pH 2, ni que l'amylase y est inactive. Gardée en difficulté 3.
2. **048** : l'acidocétose est présentée par le cours comme une « urgence vitale » du type 1, pas dans la liste « Complications aiguës » ; l'énoncé a été aligné sur ce mot.
3. **097 et 117** : « la bile ne contient pas d'enzyme » reformule « bile (émulsion, sans enzyme) » du tableau ; à confirmer si la formule du tableau te suffit.
4. **011 et 060** : la bonne réponse reprend un fragment du cours (« rôle bâtisseur : muscles, enzymes, anticorps » ; « perte de substance profonde de la muqueuse de l'estomac ») et reste la plus longue ; ce n'est pas une phrase entière, gardées.
5. **Redites d'idée gardées** : 051 et 099 (seuil de l'hypoglycémie) ; 044 et 110 (terrain du type 1) ; 042, 091 et 127 sur l'HbA1c, avec la question existante `bph:ch5:bis:9` (127 en est la forme inverse) ; 017, 071 et 096 (enzyme non consommée) ; 024 et 106 (fibres non digérées) ; 075 et 104 (microbiote et immunité) ; 009 et 112 (lipides 9 kcal/g).
6. **013** : « Huiles, beurre, fromages » est donné comme source de lipides ; un élève pourrait objecter que le fromage apporte aussi des protides. La bonne réponse « Viande, poisson, œufs » reste la seule attendue d'après le tableau.
7. **Difficultés** : 003, 029, 034, 042, 046, 064, 126 et 128 sont cotées 3 pour un rappel direct (valeur ou terme précis) ; gardées pour respecter le quota de difficulté 3, à baisser si la répartition le permet.
