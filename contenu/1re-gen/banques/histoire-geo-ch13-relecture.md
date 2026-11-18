# Relecture de la banque du chapitre 13 d'histoire-géographie (1re)

Banque : `histoire-geo-ch13.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « La France : la métropolisation et ses effets ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 13 (sortie de `outil.ts texte 13`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 149 questions sur 150. Il y a 1 écart et 4 remarques. Deux défauts relevés par l'auteur lui-même ont aussi été corrigés.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch13:banque:075 | « Premier port de France » contesté depuis la fusion HAROPA (Le Havre-Rouen-Paris, 2021) : le classement dépend de l'indicateur. | **Corrigée** avec le chapitre : « Quelle métropole régionale est le premier port français de Méditerranée ? » (Marseille). Dans la 085, la proposition « Le premier port de France » devient « Le premier port de Méditerranée ». |
| ch13:banque:099 | La loi SRU relève aussi de la politique du logement ; un élève peut hésiter à la cocher. | **Maintenue** ; l'explication précise que la politique de la ville s'appuie sur la loi SRU (logements sociaux et mixité), l'ANRU et les QPV, et que le Grand Paris Express est un projet de transport. |
| ch13:banque:113 | Présent employé pour un événement passé (JO de 2024). | **Corrigée** : « Paris a accueilli les Jeux olympiques de 2024. » |
| ch13:banque:142 (écart) | Réponse « mobilités (migrations) pendulaires » : accepter plusieurs formes. | **Corrigée** : variantes ajoutées (« les migrations pendulaires », « déplacements domicile-travail », « navettes domicile-travail », « trajets domicile-travail », « mobilités domicile-travail »). |
| ch13:banque:106 (auteur) | Trop proche de la 114 (les deux portent sur la place de Lyon face à Paris). | **Remplacée** : « Marseille-Aix est classée parmi les villes moyennes » (faux). |
| ch13:banque:150 (auteur) | La 058 (« Quel quartier nantais… », réponse « L'île de Nantes ») donnait la réponse de cette question courte sur le tramway de Nantes (1985). | **Remplacée** : « Quel sigle désigne les quartiers prioritaires de la politique de la ville ? » (QPV). |

## Corrections du texte du chapitre

- Métropoles en reconversion : « Marseille, premier port français de Méditerranée » (au lieu de « premier port de France »). HTML : 13 972 caractères.

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch13:banque:014 | « Environ 30 % du PIB » pour l'Île-de-France : ordre de grandeur INSEE (31 % selon les années). | Garder. |
| ch13:banque:149, 135 | La Défense « environ 180 000 salariés », Roissy « environ 70 millions de passagers en 2024 » : chiffres d'ordre de grandeur. | Garder ; ne pas exiger le chiffre exact. |
| ch13:banque:053, 129 | QPV : « environ 1 500 » et « environ 8 % de la population (INSEE, 2018) » ; la liste a été révisée en 2024. | Garder. |
| ch13:banque:008, 078 | Métropoles d'équilibre : « huit, en 1964 » ; la liste du chapitre est simplifiée (Lyon, Marseille, etc., sans leurs villes associées, comme Grenoble avec Lyon). | Garder ; la 078 n'oppose que Rennes et Montpellier, qui n'en font pas partie. |
| ch13:banque:138 | Nice Côte d'Azur, première métropole « fin 2011 » (création au 31 décembre 2011). | Garder. |

## Contrôles

- `verifier 13` : « Banque du chapitre 13 conforme : 150 questions. »
- `cours 13` : « Nettoyage HTML : rien n'est retiré. »
- Biais de longueur : la bonne réponse est la plus longue dans 29,3 % des `qcm_unique`.
- Positions de la bonne réponse (`qcm_unique`) : 19 / 19 / 19 / 18, tirées au hasard.
- Réponses courtes : toutes présentes dans le texte du chapitre.
