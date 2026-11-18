# Relecture de la banque du chapitre 12 d'histoire-géographie (1re)

Banque : `histoire-geo-ch12.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « La métropolisation : un processus mondial différencié ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 12 (sortie de `outil.ts texte 12`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 143 questions sur 150. Il y a 7 écarts, tous sur des vrai/faux de la série 125-135, et 6 remarques.

Six des sept écarts portent sur des énoncés qui reprennent presque mot pour mot une définition ou un fait du chapitre (économie informelle, ségrégation socio-spatiale, quartiers fermés, métropole polycentrique, pauvreté dans les Nords, siège de la Banque centrale indienne). Les réponses du relecteur sont inversées sur une série continue de vrai/faux : c'est très probablement une erreur de saisie de sa part. Ces questions sont donc maintenues.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch12:banque:052 | Le distracteur « Pour se rapprocher de leur travail » est en partie défendable (emplois en périphérie). | **Corrigée** : le distracteur devient « Pour être plus près des commerces ». |
| ch12:banque:090 | Classement GaWC incomplet (Pékin et Dubaï sont aussi « alpha+ ») et non daté. | **Corrigée** avec le chapitre : énoncé daté (2020) et portant sur le rang « alpha+ » ; le chapitre donne la liste complète (Hong Kong, Singapour, Shanghai, Pékin, Dubaï, Paris, Tokyo). Les questions 035 et 119 sont aussi datées de 2020. |
| ch12:banque:121 | « Faux » défendable mais à nuancer : Amsterdam puis Paris ont dépassé Londres sur certains indicateurs après le Brexit. | **Remplacée** : « Le Brexit a fait craindre un déclin de la place financière de Londres » (vrai). Le chapitre ne dit plus que la City « reste la première place financière d'Europe ». |
| ch12:banque:125 (écart) | Le relecteur a répondu « faux ». | **Maintenue** : définition du chapitre (« activités non déclarées et non protégées ») ; erreur du relecteur. |
| ch12:banque:126 (écart) | Le relecteur a répondu « vrai ». | **Maintenue** : le chapitre dit que les métropoles des Nords connaissent aussi pauvreté et sans-abrisme ; erreur du relecteur. |
| ch12:banque:127 | Doublon partiel avec la 049 (définition de l'étalement urbain). | **Remplacée** : « La croissance urbaine des prochaines décennies se fera surtout en Europe » (faux, notion Urbanisation). |
| ch12:banque:128 (écart) | Le relecteur a répondu « faux » ; doublon partiel avec la 099 (densifier pour limiter l'étalement). | **Remplacée** : « La périurbanisation est une forme d'étalement urbain » (vrai). |
| ch12:banque:130 (écart) | Le relecteur a répondu « vrai ». | **Maintenue** : une métropole polycentrique a plusieurs centres ; erreur du relecteur. |
| ch12:banque:132 (écart) | Le relecteur a répondu « faux ». | **Maintenue** : c'est la définition du chapitre ; erreur du relecteur. |
| ch12:banque:133 (écart) | Le relecteur a répondu « faux ». | **Maintenue** : le chapitre décrit les quartiers fermés comme des « résidences protégées par des murs et des gardiens » ; erreur du relecteur. |
| ch12:banque:134 | Doublon manifeste avec la 073 (Mumbai, capitale économique de l'Inde). | **Remplacée** : « Heathrow est le nom du principal quartier d'affaires de Londres » (faux). |
| ch12:banque:135 (écart) | Le relecteur a répondu « vrai ». | **Maintenue** : la Reserve Bank of India a son siège à Mumbai, comme le dit le chapitre ; erreur du relecteur. |

La répartition reste de 15 vrais et 15 faux (121 passe à vrai, 134 à faux).

## Corrections du texte du chapitre

- Chiffres de l'ONU : précision que les chiffres des *World Urbanization Prospects* 2018 reposent sur les définitions nationales de la ville, et que la révision de 2025 utilise une autre méthode (le « degré d'urbanisation »), aux résultats non comparables.
- GaWC : « Dans son classement de 2020, seules Londres et New York sont au rang le plus élevé (« alpha++ ») ; suivent (« alpha+ ») Hong Kong, Singapour, Shanghai, Pékin, Dubaï, Paris et Tokyo. »
- Londres : « Le Brexit (2020) a fait craindre un déclin de la City » (on ne dit plus qu'elle « reste la première place financière d'Europe »).
- Coupes pour rester à 14 000 caractères de HTML : la phrase de renvoi sur la mégalopole dans l'encadré « Ne pas confondre » et la mention de la ligne Elizabeth.

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch12:banque:002, 005, 009, 136 (et le tableau des taux d'urbanisation) | Les chiffres viennent des *World Urbanization Prospects* 2018 (définitions nationales : 55 %, 33 mégapoles, Tokyo environ 37 millions, taux par continent). La révision 2025 de l'ONU, fondée sur le « degré d'urbanisation », donne des valeurs différentes. | Garder, en rappelant la source et l'année ; le chapitre le précise. |
| ch12:banque:069 (Mumbai, environ 4 habitants sur 10 en bidonville) | Estimation tirée du recensement de 2011 ; la définition du bidonville varie selon les sources. | Garder : c'est un ordre de grandeur. |
| ch12:banque:029 (mégalopole du Nord-Est, environ 50 millions d'habitants) | Ordre de grandeur, qui dépend des limites retenues pour la mégalopole. | Garder. |
| ch12:banque:006, 007 (seuils statistiques de la ville : France 2 000, Danemark 200, Japon 50 000) | Seuils usuels, mais ils dépendent des définitions administratives retenues. | Garder. |
| ch12:banque:090, 035, 119 (classement GaWC 2020) | Le GaWC publie de nouveaux classements ; les rangs « alpha+ » peuvent changer. | Garder la date de 2020 dans les énoncés. |

## Contrôles

- `verifier 12` : « Banque du chapitre 12 conforme : 150 questions. »
- `cours 12` : « Nettoyage HTML : rien n'est retiré. » ; 14 000 caractères de HTML.
- Biais de longueur : la bonne réponse est strictement la plus longue dans 22 des 75 `qcm_unique` (29,3 %).
- Positions de la bonne réponse (`qcm_unique`) : 19 / 19 / 19 / 18, tirées au hasard.
- Vrai/faux : 15 vrais, 15 faux.
- Réponses courtes : toutes présentes dans le texte du chapitre.
