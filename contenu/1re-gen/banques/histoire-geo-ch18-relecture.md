# Relecture de la banque du chapitre 18 d'histoire-géographie (1re)

Banque : `histoire-geo-ch18.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « La Chine : des recompositions spatiales multiples ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 18 (sortie de `outil.ts texte 18`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 149 questions sur 150. Il y a 1 écart et 5 remarques. Deux recoupements signalés par l'auteur ont aussi été corrigés (Trois-Gorges, impôt agricole).

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch18:banque:038 | La part des mingong dans la population (un cinquième) n'est pas dans le texte : il faut la calculer. | **Remplacée** (même type, même difficulté) : « Quel type de migrants les mingong sont-ils ? » (des migrants intérieurs). |
| ch18:banque:049 | Causalité simplifiée : le premier rang en CO2 tient aussi au poids de l'industrie et de la population. | **Corrigée** : « Quelle source d'énergie explique en grande partie les fortes émissions de CO2 de la Chine ? » (le charbon) ; l'explication cite aussi le poids de l'industrie. |
| ch18:banque:083 | Le relèvement de l'âge de la retraite répond au vieillissement plus qu'il ne le montre. | **Corrigée** : « Quels faits sont liés au vieillissement… » et « L'âge de départ à la retraite est relevé pour y faire face ». |
| ch18:banque:120 | « 18 % » est un peu élevé : 1,408 milliard sur environ 8,1 milliards, soit plutôt 17 % en 2024. | **Corrigée** avec le chapitre : « environ 17 % ». L'explication de la 042 et la bonne réponse de la 072 sont mises à jour (« plus d'un sixième de l'humanité »). |
| ch18:banque:147 | Réponse courte un peu ouverte (mer de Chine, mer Jaune). | **Maintenue** : l'énoncé demande déjà un « océan » ; les variantes avec et sans « océan » sont acceptées. |
| ch18:banque:150 (écart) | Réponse « Les « villages Taobao » » refusée à cause des guillemets intérieurs. | **Corrigée** : variantes avec guillemets et au singulier ajoutées ; la réponse de l'élève était juste. |
| ch18:banque:143 (auteur) | Recoupement : trois questions sur le même barrage (fleuve 044, personnes déplacées 043, nom 143). | **Remplacée** (réponse courte, même difficulté) : la province pauvre de l'Ouest comparée à Pékin (le Gansu). L'énoncé de la 029 ne nomme plus le Gansu. |
| ch18:banque:074 (auteur) | Recoupement : l'ancienneté de l'impôt agricole (074), l'année de sa suppression (149) et la mesure (QCM multiple 104). | **Remplacée** (même type, même difficulté) : dans quelles campagnes se développent les entreprises de bourg et de village (proches des villes et du littoral). |

## Corrections du texte du chapitre

- Part de la population mondiale : « environ 17 % » (au lieu de 18 %).
- Sécurité alimentaire : la Chine doit nourrir « plus d'un sixième de l'humanité » (au lieu de « près d'un cinquième »).
- HTML : 13 997 caractères.

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch18:banque:017, 020, 034, 050, 093 | Chiffres 2024 du Bureau national des statistiques donnés sans revérification : population (1,408 milliard), plus de 60 ans (22 %), urbanisation (67 %), mingong (près de 300 millions), part du charbon (environ 53 %). | Garder ; vérifier les chiffres du communiqué annuel. |
| ch18:banque:019, 031 | Fécondité « environ 1 » (ONU, 2023) et coefficient de Gini « environ 0,47 » : ordres de grandeur, qui varient selon les sources. | Garder ; ne pas exiger le chiffre exact. |
| ch18:banque:060 | Ligne Heihe-Tengchong : « 94 % de la population sur 43 % du territoire », chiffres usuels mais anciens. | Garder. |
| ch18:banque:125 | Premier émetteur de CO2 « depuis le milieu des années 2000 » (vers 2006 selon les sources). | Garder. |
| ch18:banque:126 | Grande Muraille verte « depuis 1978 » (programme des « Trois Nords »). | Garder. |

## Contrôles

- `verifier 18` : « Banque du chapitre 18 conforme : 150 questions. »
- `cours 18` : « Nettoyage HTML : rien n'est retiré. »
- Biais de longueur : la bonne réponse est la plus longue dans 29,3 % des `qcm_unique`.
- Positions de la bonne réponse (`qcm_unique`) : 19 / 19 / 19 / 18.
- Réponses courtes : toutes présentes dans le texte du chapitre.
