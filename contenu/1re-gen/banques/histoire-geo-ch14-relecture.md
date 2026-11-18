# Relecture de la banque du chapitre 14 d'histoire-géographie (1re)

Banque : `histoire-geo-ch14.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « Une diversification des espaces et des acteurs de la production ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 14 (sortie de `outil.ts texte 14`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 149 questions sur 150. Il y a 1 écart et 4 remarques.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch14:banque:012 | Distracteur « Mumbai et Montréal » en partie trompeur : Airbus assemble aussi l'A220 à Mirabel, près de Montréal (depuis 2018). | **Corrigée** : la proposition devient « Mumbai et Dakar ». |
| ch14:banque:036 | Quasi-doublon de 031 (même statistique de la Brookings Institution, 2014 : l'une porte sur le PIB, l'autre sur la population). | **Remplacée** (même type, même difficulté, même notion) : quels équipements font des métropoles les espaces les mieux connectés (aéroports, ports, très haut débit). |
| ch14:banque:097 (écart) | Le relecteur a coché Nvidia au lieu de Google parmi les GAFAM. | **Maintenue** : le sigle est développé dans le chapitre (Google, Apple, Facebook devenu Meta, Amazon, Microsoft). Nvidia est un géant américain, situé dans la Silicon Valley, mais il ne fait pas partie du sigle. L'erreur vient sans doute de cette confusion. |
| ch14:banque:099 | L'énoncé « Parmi ces géants chinois… » est inexact (Microsoft et Nvidia sont américains) et donne un indice. | **Corrigée** : « Quelles entreprises le sigle BATX désigne-t-il ? » ; les distracteurs deviennent TSMC (taïwanaise) et Meta (américaine). |
| ch14:banque:121 | Généralisation discutable : le quartier d'affaires n'est pas toujours au centre (La Défense, Canary Wharf). | **Corrigée** avec le chapitre : « occupe souvent le centre ». Dans la 090 (QCM multiple sur la périphérie), le distracteur « Le quartier d'affaires » devient « Les centres historiques » pour éviter la même ambiguïté. |

## Corrections du texte du chapitre

- Espaces intra-métropolitains : « Le quartier d'affaires occupe **souvent** le centre » (au lieu de « occupe le centre »).
- Internautes : la source s'écrit « (UIT, Union internationale des télécoms) », formulation raccourcie pour rester sous 14 000 caractères de HTML (13 993).

## Points de doute (à trancher par l'enseignant)

Ces chiffres et ces dates ont été repris de mémoire, sans vérification en ligne. Les questions qui les utilisent restent à contrôler.

| Source | Doute | Proposition |
| --- | --- | --- |
| ch14:banque:031 | Brookings Institution (2014) : les 300 plus grandes économies métropolitaines produisent « près de la moitié » du PIB mondial pour environ 20 % de la population. | Vérifier dans le *Global Metro Monitor* 2014. |
| ch14:banque:022, 115 | CNUCED (2013) : environ 80 % du commerce mondial passe par les réseaux de production des FTN. | Vérifier dans le *World Investment Report* 2013. |
| ch14:banque:049, 054, 055, 096, 145 | Trafics portuaires de 2023 (Lloyd's List) : Shanghai 49, Singapour 39, Ningbo-Zhoushan 35, Shenzhen 30, Rotterdam 13 millions d'EVP. | Vérifier dans le classement *One Hundred Ports* 2024. |
| ch14:banque:053 | Commerce mondial de marchandises : environ 24 000 milliards de dollars en 2023 (OMC). | Vérifier. |
| ch14:banque:052 | Environ 12 milliards de tonnes transportées par mer en 2023 (CNUCED). | Vérifier dans la *Review of Maritime Transport* 2024. |
| ch14:banque:005 | Chine : près de 30 % de la valeur ajoutée manufacturière mondiale (ONU, 2023). | Vérifier. |
| ch14:banque:057 | Environ 5,5 milliards d'internautes en 2024 (UIT). | Vérifier. |
| ch14:banque:147 | Walmart, première entreprise mondiale par le chiffre d'affaires (*Fortune Global 500*, 2024). | Vérifier. |
| ch14:banque:112 | IDE d'environ 1 300 milliards de dollars en 2023 (CNUCED) : la question est un vrai/faux construit sur un chiffre très éloigné, donc peu sensible à l'arrondi. | Garder. |
| ch14:banque:132, 143 | Nom « Silicon Valley » popularisé en 1971 ; parc industriel de Stanford ouvert en 1951. | Vérifier. |
| ch14:banque:109 | « Courbe du sourire » de Stan Shih datée du « début des années 1990 ». | Garder la datation large. |

## Contrôles

- `verifier 14` : « Banque du chapitre 14 conforme : 150 questions. »
- `cours 14` : « Nettoyage HTML : rien n'est retiré. »
- Biais de longueur : la bonne réponse est la plus longue dans 33,3 % des `qcm_unique`.
- Positions de la bonne réponse (`qcm_unique`) : 19 / 19 / 19 / 18.
- Réponses courtes : toutes présentes dans le texte du chapitre.
