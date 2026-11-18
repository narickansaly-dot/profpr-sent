# Relecture de la banque du chapitre 15 d'histoire-géographie (1re)

Banque : `histoire-geo-ch15.json`, 150 questions. Chapitre : « La France : les systèmes productifs entre valorisation locale et intégration européenne et mondiale ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 15 (sortie de `outil.ts texte 15`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre et recherche des énoncés ou propositions qui livrent la réponse d'une réponse courte.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 143 questions sur 150. Il y a 7 écarts, tous sur des vrai/faux consécutifs (125 à 135), et 16 remarques.

Les 7 écarts portent sur des énoncés nets, chacun repris mot pour mot du chapitre ou contredisant nettement le chapitre. Le relecteur a inversé la réponse sur tous ces vrai/faux d'une même série, alors que ses autres réponses sont justes : c'est très probablement un décalage dans sa saisie, pas une ambiguïté des questions. Les questions sont donc maintenues.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch15:banque:008 | Proche doublon de 134 (part du primaire dans l'emploi). | **Remplacée** : « Dans quel secteur classe-t-on la pêche ? » (le primaire). |
| ch15:banque:022 | « Premier producteur européen de blé » est faux à l'échelle du continent (Russie, Ukraine). | **Corrigée** avec le chapitre : « premier producteur de blé de l'Union européenne ». |
| ch15:banque:026 | Son énoncé donne la réponse de 033 (« depuis la fin des années 1970 »). | **Maintenue** ; c'est la 033 qui est remplacée. |
| ch15:banque:028 | Doublon de 111 (régions les plus touchées par la désindustrialisation). | **Remplacée** : ce que fabriquent les usines de la vallée de la batterie. |
| ch15:banque:033 | Réponse donnée par l'énoncé de 026. | **Remplacée** : un exemple de tâche externalisée (le nettoyage). |
| ch15:banque:045 | Doublon partiel de 095 : l'énoncé donne la date de l'AOC (1935). | **Remplacée** : où certains territoires valorisent un savoir-faire industriel ancien (dans de petites villes). |
| ch15:banque:054 | Le siège juridique d'Airbus SE est à Leyde (Pays-Bas) ; Toulouse est le siège opérationnel. | **Corrigée** avec le chapitre : « siège opérationnel et principales chaînes d'assemblage ». |
| ch15:banque:066 | Doublon de 130 (les DROM, régions ultrapériphériques de l'UE). | **Remplacée** : ce que désignent les transferts publics (salaires des fonctionnaires, prestations sociales). |
| ch15:banque:109 | Le chapitre ne dit pas que Lactalis produit des produits laitiers. | **Corrigée** : « Lactalis est une firme mondiale de l'agroalimentaire. » |
| ch15:banque:125 (écart) | Le relecteur a répondu « faux » sur les quatre libertés du marché unique. | **Maintenue** : l'énoncé reprend le chapitre ; décalage de saisie probable. |
| ch15:banque:126 (écart) | Le relecteur a répondu « vrai » à « Le FEDER est un fonds de la PAC ». | **Maintenue** : le FEDER est le Fonds européen de développement régional, développé dans le chapitre. |
| ch15:banque:130 (écart) | Le relecteur a répondu « faux » à « Les DROM font partie de l'Union européenne ». | **Maintenue** : les DROM sont des régions ultrapériphériques de l'UE. |
| ch15:banque:131 (écart) | Le relecteur a répondu « vrai » à « Le chômage est plus faible dans les DROM ». | **Maintenue** : il y est souvent deux fois supérieur. |
| ch15:banque:132 (écart) | Le relecteur a répondu « faux » à « Les fusées Ariane décollent de Kourou depuis 1979 ». | **Maintenue** (fait exact, premier lancement en décembre 1979) ; énoncé reformulé « de Guyane » pour ne pas livrer la réponse de 148. |
| ch15:banque:133 (écart) | Le relecteur a répondu « vrai » à « Mayotte est devenue un département dès 1946 ». | **Maintenue** : Mayotte est un département depuis 2011. |
| ch15:banque:135 (écart) | Le relecteur a répondu « faux » à « La construction fait partie du secteur secondaire ». | **Maintenue** : le tableau du chapitre range la construction dans le secondaire. |
| ch15:banque:138 | Réponse (La Défense) donnée par une proposition de 041 et par 079. | **Corrigée** dans les questions fautives : « La Défense » remplacée par « Lyonbiopôle » en 041, par « Minalogic » en 039 (même défaut), et 079 parle des « quartiers d'affaires ». |
| ch15:banque:140 | Réponse (France 2030) donnée par l'énoncé de 088. | **Corrigée** : 088 parle du « plan de réindustrialisation annoncé en octobre 2021 ». |
| ch15:banque:144 | 1970 est exact (GIE Airbus Industrie), mais l'accord franco-allemand date de 1969. | **Maintenue** : le chapitre donne 1970, date de naissance d'Airbus. |
| ch15:banque:146 | Réponse (HAROPA) donnée par une proposition de 089. | **Corrigée** : la proposition devient « Marseille-Fos ». |
| ch15:banque:148 | Réponse (Kourou) donnée par les énoncés de 070 et 071. | **Corrigée** : 070 et 071 parlent du Centre spatial guyanais ou de la base spatiale de Guyane ; le même défaut est corrigé en 085, 099, 105 et 132. |
| ch15:banque:149 | Réponse (chlordécone) donnée par l'énoncé de 074 et une proposition de 019. | **Corrigée** : 074 parle de « l'insecticide qui a pollué les sols antillais » ; en 019, la proposition devient « L'ensablement des ports bretons ». |
| ch15:banque:150 | Réponse (vie chère) donnée par une proposition de 078. | **Corrigée** : la proposition devient « Le tourisme international ». |

Corrections supplémentaires, même défaut (réponse courte 143, AOP) : en 093, la proposition « L'AOP » est retirée (deux bonnes réponses : AOC et IGP) ; en 095, « L'AOP est créée en 1992 » devient « Le label européen équivalent de l'AOC est créé en 1992 », et le distracteur « pôles lancés en 1969 » devient « pôles lancés en 1992 ».

## Corrections du texte du chapitre

- Blé : « le premier producteur de blé de l'UE » (au lieu de « premier producteur européen de blé »).
- Airbus : « Son siège opérationnel et ses principales chaînes d'assemblage sont à Toulouse ».
- Coupe de « à elle seule » pour rester sous 14 000 caractères de HTML (13 997).

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch15:banque:026 | « Environ 2 millions d'emplois industriels perdus depuis la fin des années 1970 » : ordre de grandeur, variable selon les sources et les bornes. | Garder ; le distracteur le plus proche (500 000) en est loin. |
| ch15:banque:027 | Industrie manufacturière « environ 10 % de la valeur ajoutée » : ordre de grandeur. | Garder. |
| ch15:banque:013 | « Environ 18 % de la production agricole de l'UE » : la part varie selon l'année. | Garder. |
| ch15:banque:090 | « Environ 55 pôles de compétitivité » : leur nombre change à chaque phase de labellisation. | Vérifier le chiffre de la phase en cours. |
| ch15:banque:101 | Classement EY « premier pays européen depuis 2019 » : à confirmer pour les dernières années. | Vérifier le dernier baromètre. |
| ch15:banque:144 | Airbus : 1969 (accord) ou 1970 (GIE). | Garder 1970 ; 1969 n'est pas accepté. |
| ch15:banque:136 | Le terme « système productif » apparaît dans le titre du chapitre et dans d'autres énoncés (009, 056, 077, 078) : la réponse courte est facile. | Garder : c'est la notion centrale du chapitre. |

## Contrôles

- `verifier 15` : « Banque du chapitre 15 conforme : 150 questions. »
- `cours 15` : « Nettoyage HTML : rien n'est retiré. »
- Biais de longueur : la bonne réponse est strictement la plus longue dans 29,3 % des `qcm_unique`.
- Positions de la bonne réponse (`qcm_unique`) : 19 / 19 / 19 / 18, tirées au hasard.
- Réponses courtes : toutes présentes dans le texte du chapitre ; aucun autre énoncé ni aucune autre proposition ne livre leur réponse, sauf « système productif » (voir les points de doute).
