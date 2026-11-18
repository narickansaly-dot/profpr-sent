# Relecture de la banque du chapitre 7 d'histoire-géographie (1re)

Banque : `histoire-geo-ch7.json`, 150 questions. Chapitre : « Permanences et mutations de la société française jusqu'en 1914 ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 7.
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues.
- Comparaison automatique de ses réponses avec les réponses attendues (écarts et remarques).
- Contrôles automatiques : `verifierBanque` (quotas, positions, biais de longueur, insécables, similarité des énoncés) ; présence de chaque réponse courte dans le texte du chapitre ; aucune réponse courte donnée par l'énoncé ou les propositions d'une autre question.

## Résultat de la relecture indépendante

144 accords sur 150, 6 écarts et 7 remarques.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch7:banque:028 | Remarque : la loi de 1864 supprime le délit de coalition plutôt qu'elle ne « reconnaît » un droit de grève. | Corrigée : l'explication précise que la grève cesse d'être un délit. Réponse inchangée. |
| ch7:banque:034 | Remarque : l'appel de 1889 vise le 1er mai 1890 ; le caractère annuel est décidé plus tard. | Corrigée : énoncé « à manifester le 1er mai 1890 », explication et texte du chapitre corrigés. |
| ch7:banque:078 | Remarque : le distracteur « Schneider et Cie » est discutable (autobus Schneider dès 1906). | Corrigée : distracteur remplacé par « La Compagnie des salins du Midi ». |
| ch7:banque:079 | Écart : le relecteur coche aussi « Elle montre que la misère a disparu ». La formulation était ambiguë (ce que l'expression *suggère*). | Corrigée : distracteur remplacé par « Elle est employée dès 1890 par les contemporains », nettement faux. |
| ch7:banque:085 | Remarque : doublon partiel avec 023 (indépendance syndicale) et 029 (grève générale). | Remplacée : QCM multiple sur la SFIO (fondée en 1905, parti qui réunit les socialistes), même notion, même difficulté. |
| ch7:banque:109 | Remarque : doublon avec 149 (la dynamo de Gramme), chacune donne la réponse de l'autre. | Remplacée : vrai/faux faux sur le début de la deuxième industrialisation (« dès les années 1820 »). |
| ch7:banque:127 | Écart : le relecteur répond vrai à « environ 30 % d'étrangers en 1911 ». | Maintenue : le chapitre dit près de 3 % ; l'énoncé est nettement faux. Erreur probable du relecteur (inversion des réponses vrai/faux sur 127-135). |
| ch7:banque:131 | Écart : le relecteur répond faux à « la majorité des Français vit encore à la campagne en 1911 ». | Maintenue : 56 % de ruraux en 1911 ; la population urbaine ne l'emporte qu'en 1931. |
| ch7:banque:133 | Écart : le relecteur répond vrai à « le tarif Méline supprime les droits de douane ». | Maintenue : le tarif Méline établit des droits de douane protecteurs. |
| ch7:banque:134 | Écart : le relecteur répond vrai à « avant 1914, les femmes votent aux élections législatives ». | Maintenue : le droit de vote des femmes date de 1944. |
| ch7:banque:135 | Écart : le relecteur répond faux à « en 1892, le travail de nuit est interdit aux femmes ». | Maintenue : la loi du 2 novembre 1892 interdit le travail de nuit des femmes dans l'industrie. |
| ch7:banque:144 | Remarque : accepter « phylloxera » sans accent et sans article. | Maintenue : ces variantes étaient déjà acceptées (et la normalisation ignore les accents). |
| ch7:banque:149 | Remarque : doublon avec 109 ; le chapitre ne dit pas que Gramme est « ingénieur belge ». | Corrigée : énoncé « Qui invente la dynamo en 1869 ? » ; « Gramme » seul reste accepté. Le doublon est levé par le remplacement de 109. |

Les cinq écarts maintenus (127 à 135) portent tous sur des vrai/faux consécutifs dont l'énoncé est sans ambiguïté et conforme au chapitre : ils relèvent vraisemblablement d'une inversion dans les réponses du relecteur.

## Corrections du texte du chapitre

- Fourmies : « appelle les ouvriers du monde entier à manifester le 1er mai 1890 » (au lieu de « le 1er mai »).
- Le Creusot : « en 1838 sort du Creusot sa première locomotive » (au lieu de « la première locomotive construite en France », affirmation discutable : Marc Seguin construit des locomotives à Saint-Étienne dès 1829). Le vrai/faux 112 a été ajusté en conséquence.

## Points de doute

| Source | Doute | Proposition |
| --- | --- | --- |
| ch7:banque:013 | Marteau-pilon de 100 tonnes « mis en service en 1877 » : certaines sources donnent 1876 (construction) ou 1877 (mise en service). | Garder ; ne pas exiger l'année. |
| ch7:banque:096 | Aigues-Mortes : « au moins huit morts », bilan officiel ; d'autres estimations sont plus élevées. | Garder (la formulation « au moins » couvre l'incertitude). |
| ch7:banque:062, 074 | Chiffres arrondis : environ 4 actifs sur 10 dans l'agriculture en 1911 ; plus d'un tiers d'actives. | Garder ; ordres de grandeur. |
| ch7:banque:028 | Vocabulaire : « droit de grève reconnu en 1864 » est une simplification (suppression du délit de coalition). | Garder ; explication précisée. |

## Contrôles

- `verifierBanque` : conforme, 150 questions (75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; 15 vrais et 15 faux).
- Biais de longueur : la bonne réponse est la plus longue (égalités comprises) dans 22 QCM à réponse unique sur 75 (29 %).
- Positions de la bonne réponse : 19 / 19 / 19 / 18, tirées au hasard à graine fixe.
- Réponses courtes : toutes présentes dans le texte du chapitre.
- Nettoyage HTML du chapitre : rien n'est retiré.
