# Relecture de la banque du chapitre 8 d'histoire-géographie (1re)

Banque : `histoire-geo-ch8.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « Métropole et colonies ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 8 (sortie de `outil.ts texte 8`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour les 150 questions : il n'y a aucun écart. Il a fait 7 remarques, toutes traitées ci-dessous.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch8:banque:040 | Quasi-doublon avec 036 (Guillaume II à Tanger en 1905). | **Remplacée** : conséquence des règles de la conférence de Berlin (elles accélèrent la course aux territoires), sans citer l'occupation effective, réponse de la 033. |
| ch8:banque:074 | Doublon partiel avec 021 (Cochinchine conquise sous le Second Empire, donc en 1859-1867). | **Remplacée** : quel traité établit un protectorat au Maghreb au temps de Jules Ferry (le traité du Bardo). |
| ch8:banque:109 | Bugeaud est nommé gouverneur général fin décembre 1840 ; on lit souvent 1840-1847. | **Corrigée** : « Bugeaud gouverne l'Algérie dans les années 1840 » (vrai) ; le chapitre dit « gouverneur général de la fin de 1840 à 1847 ». |
| ch8:banque:111 | Erreur de fait : le Laos devient protectorat en 1893 mais n'est rattaché à l'Union indochinoise qu'en 1899. | **Corrigée** avec le chapitre : « Le Laos devient un protectorat français en 1893 » (vrai) ; le chapitre dit « rejoints par le Laos, protectorat en 1893, rattaché en 1899 ». |
| ch8:banque:138 | Accepter aussi « le Tonkinois ». | **Corrigée** : « le Tonkinois » et « Tonkinois » ajoutés. |
| ch8:banque:140 | « Soudan » peut être confondu avec le Soudan français ; accepter « Soudan égyptien ». | **Corrigée** : « Soudan égyptien » et « Soudan anglo-égyptien » ajoutés (avec et sans article). L'énoncé parle de Fachoda, sur le haut Nil, ce qui lève l'ambiguïté. |
| ch8:banque:141 | Réponse un peu ouverte : accepter aussi « commandant de cercle ». | **Corrigée** : « commandant de cercle », « les administrateurs » et « administrateurs coloniaux » ajoutés. |

## Corrections du chapitre

- Algérie : Bugeaud est « gouverneur général de la fin de 1840 à 1847 » (au lieu de « de 1841 à 1847 »).
- Indochine : l'Union indochinoise de 1887 est « rejointe par le Laos, protectorat en 1893, rattaché en 1899 » (au lieu de « rejoints par le Laos en 1893 »).

## Points de doute

- 010 : « environ 750 000 Européens pour près de 5 millions d'Algériens musulmans en 1911 » ; ordres de grandeur du recensement, à confirmer.
- 020 : Dakar est donnée comme capitale de l'AOF, alors qu'elle ne l'est qu'à partir de 1902 (avant, c'est Saint-Louis) ; le chapitre ne donne pas de date.
- 140 : Fachoda est située « au Soudan », alors que la ville se trouve aujourd'hui au Soudan du Sud ; la question porte sur 1898.

## Contrôles

- `outil.ts verifier 8` : « Banque du chapitre 8 conforme : 150 questions. »
- `outil.ts cours 8` : « Nettoyage HTML : rien n'est retiré. »
- Types 75 / 30 / 30 / 15, difficultés 60 / 60 / 30, vrai/faux 15 / 15. Positions des bonnes réponses des `qcm_unique` : 19 / 19 / 19 / 18, tirées au hasard. La bonne réponse est strictement la plus longue dans 31 % des `qcm_unique`.
- Les 15 réponses courtes principales figurent dans le texte du chapitre.
