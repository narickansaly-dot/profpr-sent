# Relecture de la banque du chapitre 1 d'histoire-géographie (1re)

Banque : `histoire-geo-ch1.json`, 150 questions (au statut `a_relire` après fusion). Chapitre : « La Révolution française et l'Empire : une nouvelle conception de la nation ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 1 (75 QCM à réponse unique, 30 QCM à réponses multiples, 30 vrai/faux, 15 réponses courtes ; difficultés 60 / 60 / 30), sur les 9 notions du plan.
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues.
- Comparaison automatique de ses réponses avec les réponses attendues, puis examen de chaque écart et de chaque remarque.
- Contrôles `verifierBanque` (quotas, positions, biais de longueur, similarité des énoncés, espaces insécables) ; présence de chaque réponse courte principale dans le texte du chapitre.

## Résultat de la relecture indépendante

Accord sur **150 questions sur 150** : **0 écart**, **7 remarques**.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch1:banque:087 | Le Tribunal révolutionnaire est créé en mars 1793, avant la « terreur à l'ordre du jour » : sa « création » pendant la Terreur dépend de la périodisation. | **Corrigée** : énoncé « Quelles mesures font partie de la politique de la Terreur (1793-1794) ? » et proposition « L'action du Tribunal révolutionnaire » ; explication précisée. |
| ch1:banque:098 | Le distracteur « La souveraineté populaire » est en partie vrai (légitimation par plébiscite). | **Corrigée** : distracteur remplacé par « Un exécutif confié à cinq directeurs », nettement faux. |
| ch1:banque:103 | Trafalgar est une défaite navale de Villeneuve, pas une bataille livrée par Napoléon. | **Corrigée** : énoncé « Quelles batailles sont des défaites françaises de l'époque napoléonienne ? » ; explication précisée. |
| ch1:banque:138 | Malesherbes n'est pas le seul défenseur : Tronchet et Raymond de Sèze (qui plaide) seraient défendables. | **Corrigée** : énoncé « Cite un défenseur de Louis XVI… » ; de Sèze et Tronchet ajoutés aux réponses acceptées. |
| ch1:banque:139 | Réponse ouverte, et recoupement avec la 046 (prénom usuel « Manon »). | **Maintenue**, toutes les variantes étant acceptées ; la **046 est remplacée** (même notion, type et difficulté) : « Dans quelle ville Madame Roland est-elle née ? ». La proposition « Fille d'un graveur parisien » (049) devient « Fille d'un graveur » pour ne pas souffler la réponse. |
| ch1:banque:141 | « L'un des principaux rédacteurs » admet aussi Tronchet, Bigot de Préameneu, Maleville. | **Corrigée** : énoncé « Cite un juriste de la commission qui prépare le Code civil. » ; les quatre membres de la commission sont acceptés. |
| ch1:banque:143 | Le Concordat est signé par des plénipotentiaires (Consalvi) puis ratifié par Pie VII. | **Corrigée** : énoncé « Avec quel pape Bonaparte conclut-il le Concordat de 1801 ? » ; explication sur la ratification. |

## Corrections du texte du chapitre

Aucune. Le texte ne nomme que Malesherbes et Portalis ; les autres noms acceptés en 138 et 141 ne sont pas exigés.

## Points de doute

| Source | Doute | Proposition |
| --- | --- | --- |
| ch1:banque:033 | « Environ 17 000 » condamnations à mort après jugement : ordre de grandeur classique (D. Greer), sans les exécutions sommaires ni la Vendée. | Garder ; le chiffre est arrondi. |
| ch1:banque:071, 135 | « 130 départements » vers 1811 et « environ 600 000 hommes, dont la moitié de Français » en 1812 : ordres de grandeur courants, les estimations varient. | Garder ; ne pas exiger de précision. |
| ch1:banque:002 | « Environ 98 % » de la population dans le tiers état : proportion usuelle et arrondie. | Garder. |
| ch1:banque:139 | Réponse courte ouverte (plusieurs formes du nom) : variantes listées, mais une forme imprévue pourrait être refusée. | Laisser à relire. |

## Contrôles

- `verifier 1` : « Banque du chapitre 1 conforme : 150 questions. »
- Biais de longueur : la bonne réponse est la plus longue dans 22 QCM à réponse unique sur 75 (29 %).
- Positions des bonnes réponses : 19 / 19 / 19 / 18.
- Vrai/faux : 15 vrais, 15 faux.
- Réponses courtes : les 15 réponses principales figurent dans le texte du chapitre.
