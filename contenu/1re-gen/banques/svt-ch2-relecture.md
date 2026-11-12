# Relecture de la banque du chapitre 2 de SVT (1re, spécialité) contre le cours

Relecture des 150 questions de `svt-ch2.json` contre le texte du chapitre 2 (« La réplication de l'ADN »).

## Méthode

1. **Rédaction** : 150 questions écrites à partir du seul texte du chapitre (74 qcm_unique, 30 qcm_multiple, 30 vrai_faux, 16 réponses courtes), sur les 9 notions du plan.
2. **Auto-relecture** : chaque question relue contre le texte brut du chapitre (une seule bonne réponse ? information présente dans le texte ?).
3. **Relecture indépendante** : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues, et a laissé des remarques.
4. **Comparaison automatique** des réponses attendues et des siennes, puis **arbitrage** de chaque remarque (ci-dessous).
5. **Recherche des questions qui donnent la réponse d'une autre** : un énoncé ou une proposition qui nomme ce qu'une autre question demande (nom, donnée chiffrée, définition). Les fuites trouvées ont été supprimées (seconde partie du tableau).

## Relecture indépendante

Accord initial : **150/150** ; aucun écart, 12 remarques.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch2:banque:017 | Remarque : accepter « Chargaff » et « Erwin Chargaff ». | Déjà acceptées ; « E. Chargaff » ajoutée. |
| svt:ch2:banque:031 | Remarque : variantes d'accent et d'article. | Déjà couvertes (accents ignorés, « le désoxyribose » présent) ; « desoxyribose » ajoutée explicitement. |
| svt:ch2:banque:046 | Remarque : accepter « 6,4 » et « 6.4 ». | Déjà acceptées (marge de 0,1). Gardée. |
| svt:ch2:banque:047 | Remarque : accepter « 1,7 » et « 1.7 ». | Déjà acceptées (marge de 0,05). Gardée. |
| svt:ch2:banque:062 | Remarque : accord ambigu (« semi-conservatif » ou « semi-conservative ») et trait d'union facultatif. | Énoncé réécrit : « Quel adjectif complète l'expression « réplication … » ». Les deux accords, les formes avec et sans trait d'union et « réplication semi-conservative » sont acceptés. Le nouvel énoncé ne définit plus la notion, ce qui supprime aussi la fuite vers la 049. |
| svt:ch2:banque:079 | Remarque : accepter « 15N » ou « azote 15 ». | Déjà acceptées. La question a quand même été remplacée : la 072 et la 053 citaient le ¹⁵N et donnaient la réponse. Elle demande maintenant comment on qualifie l'ADN à un brin lourd et un brin léger (« hybride », avec variantes). |
| svt:ch2:banque:080 | Remarque : accepter « 6,25 », « 6.25 » et l'arrondi 6,3. | « 6,3 » et « 6.3 » ajoutées, marge portée à 0,06. « Des bactéries » est remplacé par « Des cellules », pour ne plus donner la réponse de la 064. |
| svt:ch2:banque:099 | Remarque : accepter « fourche », « fourche de réplication », « fourches ». | Déjà acceptées ; ajout des formes avec article (« une/la/les/des fourche(s) de réplication »). |
| svt:ch2:banque:100 | Remarque : le mot « modèle » de l'énoncé est aussi une réponse plausible. | Énoncé réécrit en expression à compléter (« brin … »), qui n'admet que « matrice » ; variantes « matrices » et « brin-matrice » ajoutées. Les 086, 087, 088 et 091, qui écrivaient « brin matrice » ou « sert de matrice », sont reformulées pour ne plus donner le mot. |
| svt:ch2:banque:130 | Remarque : sans la nuance « aux mutations près », l'affirmation est en tension avec la 123. | Énoncé réécrit : « Aux mutations près, les cellules d'un même clone ont la même information génétique… » (vrai, cohérent avec la 123). |
| svt:ch2:banque:145 | Remarque : la proposition « augmente de 2 » est ambiguë (ajout ou doublement). | Proposition réécrite : « Le nombre de copies augmente seulement de deux unités à chaque cycle » (fausse). On a aussi remplacé « 2ⁿ copies après n cycles… », qui donnait la réponse de la 149, et « La PCR copie tout le génome… », qui doublait la 148. |
| svt:ch2:banque:150 | Remarque : accepter « amorce » et « amorces ». | Déjà acceptées. La question a été remplacée : la 142 (« Deux amorces ») et la 140 donnaient le mot, et son énoncé donnait la réponse de la 137. Elle demande maintenant la température d'élongation, en °C (« 72 », « 72 °C », « 72°C »). |
| *Fuites entre questions* | | |
| svt:ch2:banque:004 | Donnée par la 012 (« La coloration de Feulgen… colore les chromosomes »). | Réécrite : quel chercheur a mis au point la coloration de 1924 ; la 012 ne nomme plus Feulgen. |
| svt:ch2:banque:005, 006, 007, 016 | Les énoncés « Dans l'expérience d'Avery… » donnaient la réponse de la 005. La 007 donnait aussi celle de la 006. | Les 006, 007 et 016 disent « l'expérience de 1944 sur la transformation des bactéries ». La 006 demande maintenant ce que deviennent les bactéries inoffensives. |
| svt:ch2:banque:010, 014 | Elles nommaient Chargaff et Franklin avec leurs résultats, ce qui donnait les 017 et 008. | Propositions et énoncé réécrits sans ces noms. |
| svt:ch2:banque:011, 012, 015 | Elles nommaient Miescher (nucléine, phosphore) et Flemming (chromatine), ce qui donnait les 001, 002 et 003. | Les 011 et 012 décrivent les découvertes sans les noms. La 015 porte maintenant sur l'ordre Avery (1944) / double hélice (1953). |
| svt:ch2:banque:020 | « Un phosphate, un désoxyribose et une base » donnait la 031. | Proposition réécrite (« un sucre »). |
| svt:ch2:banque:025, 026, 028 | Elles donnaient les 021 (appariement G–C), 018 et 019 (nombre de molécules par chromatide). | Réécrites : les bases de l'ADN ; de quoi une chromatide est formée ; le centromère qui relie les chromatides. |
| svt:ch2:banque:035, 038, 039, 041, 044, 045 | Les énoncés donnaient les 033 (3,2 milliards), 034 (2 m), 024 (rôle des protéines), 032 (0,34 nm) et 108 (250 millions de pb), et la 040 donnait la 041. | Données retirées des énoncés ou remplacées par d'autres valeurs. La 039 demande quand la compaction est maximale. La 045 porte sur la longueur de l'ADN d'E. coli comparée à la bactérie. |
| svt:ch2:banque:052, 053, 055, 058, 061 | Elles donnaient la phase S (081), les prévisions du modèle conservatif (056), le modèle retenu (075) et l'année 1953 (009). | Remplacées, à type et difficulté égaux : ce que représente une bande ; la réplication d'une molécule hybride sur ¹⁵N ; la découverte qui a permis les modèles ; les conditions pour départager les modèles (difficulté 1 → 2) ; l'ordre modèles / expérience. |
| svt:ch2:banque:066, 072, 073, 076, 077, 078 | La 067 et la 072 donnaient la technique de la 066 ; « bactéries » donnait la 064 ; les 070 et 071 donnaient les 073 et 077 ; la 078 donnait la 074. | La 066 demande la solution du gradient (chlorure de césium) ; « organismes » remplace « bactéries » ; les 073, 077 et 078 sont réécrites (formes d'ADN, absence d'ADN lourd dès la génération 1, baisse de la proportion d'hybride). |
| svt:ch2:banque:082, 084, 085, 093, 094, 096, 097, 098 | La 086 donnait l'enzyme de la 082 ; la 084 définissait l'origine (083) ; la 085 nommait les fourches (099) ; les 061, 094, 125 donnaient la phase S (081) ; la 091 donnait la 097 ; la 096 donnait la 100 ; la 094 donnait la 098. | La 082 demande le compartiment (noyau). Les énoncés des 084, 085 et 094 sont réécrits. La 093 a de nouvelles propositions. Les 096, 097 et 098 sont remplacées par d'autres affirmations du texte. |
| svt:ch2:banque:106, 107, 109, 110, 111, 113, 114, 116, 117 | Les énoncés de calcul reprenaient les données réelles demandées ailleurs : une origine et 1 000 nucléotides/s chez E. coli (102, 103), 50 nucléotides/s chez l'humain (104), 8 h de phase S (105), deux fourches par origine (115). La 109 donnait la 112 (chromosome circulaire). | Calculs refaits avec des valeurs fictives (bactérie de 2,4 ou 6 millions de pb, eucaryote à 40 ou 30 nucléotides/s), sans dire le nombre de fourches. Les 107 et 114 sont reformulées sans « 8 heures » ni « 6,4 milliards ». La 109 a un nouveau distracteur. |
| svt:ch2:banque:124, 125 | « Des vrais jumeaux » donnait la 122 ; « réplication semi-conservative pendant la phase S » donnait les 062 et 081. | Propositions remplacées (« les cellules de la peau d'une même personne », « la réplication de l'ADN avant chaque division »). |
| svt:ch2:banque:140, 142, 147, 148 | La 140 donnait 95 °C (134) ; la 142 donnait la 136 (polymérase résistante à la chaleur) ; la 147 était résolue par la 140 ; la 143 donnait la 148. | Propositions sans température (140) ; « Une ADN polymérase » (142) ; la 147 sans valeur ; la 148 porte sur le nombre d'étapes d'un cycle. |

Il reste des liens de vocabulaire : un mot technique (fourche, œil, hybride, semi-conservatif) apparaît dans d'autres énoncés, sans y être défini. Ils sont jugés acceptables, car la question qui demande le mot le fait à partir de sa définition.

## Totaux

- 150 questions ; types 74 / 30 / 30 / 16 ; difficultés 59 / 62 / 29.
- Vrai/faux : 15 vrais, 15 faux.
- La bonne réponse des qcm_unique est la plus longue dans 9 cas sur 74 ; positions des bonnes réponses : 19 / 18 / 19 / 18.
- Contrôle (`verifierBanque`) : « Banque du chapitre 2 conforme : 150 questions. »

## Questions laissées à relire

Aucune question ne reste douteuse : le relecteur était d'accord sur les 150 questions, ses remarques ont été appliquées, et les questions réécrites ou remplacées s'appuient sur des affirmations explicites du chapitre. Les 67 questions modifiées (liste dans `ch2-modifiees.txt`) passeront par la seconde vérification prévue.

Points d'attention pour l'enseignant, sans effet sur la validité :

- les questions de calcul 106, 110, 116 et 117 utilisent des valeurs fictives (génome bactérien, vitesse d'une fourche d'eucaryote) pour ne pas donner les valeurs réelles demandées ailleurs ;
- la 053 demande un raisonnement nouveau (molécule hybride répliquée sur ¹⁵N), déductible du modèle semi-conservatif.

À relire : aucune
