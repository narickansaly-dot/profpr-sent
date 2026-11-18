# Relecture de la banque du chapitre 17 d'histoire-géographie (1re)

Banque : `histoire-geo-ch17.json`, 150 questions. Chapitre : « La France : des espaces ruraux multifonctionnels, entre initiatives locales et politiques européennes ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 17 (sortie de `outil.ts texte 17`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 149 questions sur 150. Il y a 1 écart et 2 remarques.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch17:banque:027 | La raison des quotas laitiers (limiter les excédents) n'est pas écrite dans le texte ; elle se déduit de la phase 1962-1980. | **Corrigée avec le chapitre** : « 1984 : quotas laitiers pour limiter les excédents ». L'explication reprend cette formule. |
| ch17:banque:041 | Le solde migratoire est cité mais pas défini dans le texte. | **Corrigée avec le chapitre** : « solde migratoire (arrivées moins départs) ». L'explication reprend cette définition. |
| ch17:banque:147 (écart) | Réponse « Bassines (méga-bassines) ». | **Maintenue** : la réponse est juste, et l'écart ne vient que de sa forme double. Les variantes « méga bassines », « les méga-bassines » et « les mégabassines » sont ajoutées. |

## Corrections du texte du chapitre

- PAC : « 1984 : quotas laitiers pour limiter les excédents (supprimés en 2015) ».
- Renouveau rural : « grâce à un solde migratoire (arrivées moins départs) positif ».
- Biovallée : la phrase « La Drôme est l'un des premiers départements français pour l'agriculture biologique », sans question associée, est retirée pour rester sous 14 000 caractères de HTML (13 949).

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch17:banque:013 | Environ 1 million d'exploitations en 1988 : ordre de grandeur du recensement agricole, cité de mémoire. | Garder ; à vérifier sur Agreste. |
| ch17:banque:018 et 019 | Bio à environ 10 % de la surface agricole (Agence Bio, 2022) ; circuits courts dans « près d'un quart » des exploitations (2020). | Garder ; à vérifier. |
| ch17:banque:023 | « Un exploitant sur quatre a plus de 60 ans » en 2020. | Garder ; à vérifier sur Agreste. |
| ch17:banque:050 | Les manifestations de Sainte-Soline (Deux-Sèvres) ont eu lieu en octobre 2022 et en mars 2023 ; le chapitre ne cite que 2023. | Garder. |
| ch17:banque:056 | Plus de 2 500 guichets France services en 2023. | Garder ; à vérifier. |
| ch17:banque:069 | LEADER reçoit au moins 5 % du FEADER (règle européenne). | Garder ; à vérifier. |
| ch17:banque:084 et 115 | 387 milliards d'euros pour 2021-2027, environ un tiers du budget européen ; environ 9 milliards d'euros par an pour la France, première bénéficiaire. | Garder ; à vérifier. |

## Contrôles

- `verifier 17` : « Banque du chapitre 17 conforme : 150 questions. »
- `cours 17` : « Nettoyage HTML : rien n'est retiré. »
- Biais de longueur : la bonne réponse est la plus longue dans 29,3 % des `qcm_unique`.
- Positions de la bonne réponse (`qcm_unique`) : 19 / 19 / 19 / 18.
- Réponses courtes : toutes présentes dans le texte du chapitre.
