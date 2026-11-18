# Relecture de la banque du chapitre 16 d'histoire-géographie (1re)

Banque : `histoire-geo-ch16.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « Les espaces ruraux : multifonctionnalité ou fragmentation ? ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 16 (sortie de `outil.ts texte 16`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 149 questions sur 150 : 1 écart et 6 remarques.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch16:banque:027 | « Années 1960 » vaut pour l'Inde et les Philippines ; au Mexique, la révolution verte commence dès 1943. | **Corrigée** avec le chapitre : « Quand la révolution verte est-elle lancée en Inde ? » ; l'explication mentionne le Mexique dès les années 1940. |
| ch16:banque:055 | Le distracteur « …, riches en terres » se trahit lui-même. | **Corrigée** : la mention « riches en terres » est supprimée. |
| ch16:banque:077 | Le Nord du Canada est un espace peu peuplé et peu mis en valeur plutôt qu'un espace en déprise. | **Corrigée** avec le chapitre : l'exemple devient « l'intérieur de l'Espagne » ; le vrai/faux 108, qui citait aussi le Nord du Canada, porte désormais sur les moyennes montagnes européennes. |
| ch16:banque:087 | Le Mexique est une réponse fragile pour une révolution verte « lancée dans les années 1960 ». | **Corrigée** : « Dans quels pays du Sud la révolution verte a-t-elle été mise en œuvre ? » ; explication datée (Mexique dès les années 1940, Inde et Philippines dans les années 1960). |
| ch16:banque:117 | « L'agriculture nourrit 8 milliards d'êtres humains » est discutable (environ 700 millions de personnes souffrent de la faim). | **Corrigée** avec le chapitre : « L'agriculture doit aujourd'hui nourrir 8 milliards d'êtres humains. » (vrai). |
| ch16:banque:146 (écart) | Accepter le singulier « agriturismo ». | **Corrigée** : « agriturismo » était déjà accepté ; l'écart vient de la réponse « Agriturismi (agriturismo) », ajoutée avec ses variantes. |

Vérification demandée en plus de la relecture :

| Source | Constat | Décision |
| --- | --- | --- |
| ch16:banque:030 | « Environ un tiers » du maïs américain transformé en éthanol : l'USDA donne plutôt 35 à 40 %. | **Corrigée** avec le chapitre : « plus d'un tiers ». |

Explications harmonisées sans changement de réponse : 105 (en Inde, la révolution verte commence dans les années 1960) et 136 (Mexique dès les années 1940, Asie dans les années 1960).

## Corrections du texte du chapitre

- Révolution verte : « engagée dès les années 1940 au Mexique, puis dans les années 1960 en Asie (Inde, Philippines) » ; étude de cas : « lancée en Inde dans les années 1960 ».
- Tableau des types d'espaces ruraux : les espaces en déprise ont pour exemples « moyennes montagnes européennes, intérieur de l'Espagne » (au lieu du Nord du Canada).
- « L'agriculture doit nourrir 8 milliards d'êtres humains ».
- Éthanol de maïs aux États-Unis : « plus d'un tiers de la récolte ».
- Coupes de quelques mots pour rester sous 14 000 caractères de HTML (14 000).

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch16:banque:071 et 110 | Part des actifs agricoles indiens « environ 45 % » (enquête nationale sur l'emploi 2022-2023) et part du PIB « moins de 20 % » : chiffres repris de mémoire. | Garder ; vérifier avec la dernière enquête PLFS. |
| chapitre (Toscane) | Premier rang de la Toscane pour le nombre d'agritourismes (ISTAT) et population d'environ 3,7 millions (ISTAT, 2023) : non revérifiés. | Garder ; vérifier sur le site de l'ISTAT. |
| ch16:banque:039 et 040 | Aires protégées « environ 17,6 % » des terres (Protected Planet 2024) ; l'objectif de Kunming-Montréal (30 % d'ici 2030) vaut pour les terres et les mers, simplifié en « 30 % des terres ». | Garder. |
| ch16:banque:057 | Surfaces Land Matrix : « plusieurs dizaines de millions d'hectares » volontairement vague. | Garder : la question ne demande qu'un ordre de grandeur. |

## Contrôles

- `verifier 16` : « Banque du chapitre 16 conforme : 150 questions. »
- `cours 16` : « Nettoyage HTML : rien n'est retiré. »
- Biais de longueur : la bonne réponse est la plus longue dans 29,3 % des `qcm_unique` (égalités comprises).
- Positions de la bonne réponse (`qcm_unique`) : 19 / 19 / 19 / 18, tirées au hasard (`melanger.py`, graine fixe).
- Réponses courtes : toutes présentes dans le texte du chapitre.
