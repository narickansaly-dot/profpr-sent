# Bilan : cours de SVT (spécialité) de première générale

Dates : 11 au 12 novembre 2026. Branche : `claude/contenu-1re-svt-8c0211` (commits locaux, sans push ni PR).

## Programme suivi

- **Arrêté du 17 janvier 2019**, NOR **MENE1901648A**, JO du 20 janvier 2019, **BO spécial n° 1 du 22 janvier 2019** (programme d'enseignement de spécialité de SVT de première générale, 4 h par semaine). Texte lu dans l'annexe officielle du BO (`spe648_annexe_1063542.pdf`), résumé dans `programmes/svt-1re.md` (codes [N1] à [N70], [C1] à [C55], [P1] à [P18]).
- **Version en vigueur en 2026-2027** : aucun arrêté de 2025 ou 2026 ne remplace ni ne modifie ce programme. Eduscol le présente toujours comme en vigueur ; les textes récents trouvés concernent les langues vivantes, les mathématiques et l'enseignement scientifique. Vérification par Eduscol, le BO et des recherches web, sans dépouillement exhaustif des BO : à confirmer si l'enseignant connaît un texte plus récent.

## Fichiers produits

| Fichier | Contenu |
| --- | --- |
| `programmes/svt-1re.md` | résumé fidèle du programme, avec référence NOR / BO |
| `programmes/svt-1re-plan.md` | plan en 16 chapitres, sections, figures, notions, points à trancher |
| `svt.json` | cours `svt-1re-gen` (GEN, 1re, SVT, `#15803d`), 16 chapitres, 2400 questions `valide` |
| `banques/svt-chN.json` (16) | fichiers de travail des banques, 150 questions chacun |
| `banques/svt-chN-relecture.md` (16) | relecture indépendante, arbitrages, seconde vérification, totaux |
| `validation/svt-chN.md` (16) | rapport des contrôles de chaque chapitre |
| `validation/svt-bilan.md` | ce bilan |

## Chapitres

| N° | Titre | Durée | Sections | Figures | Questions |
| --- | --- | --- | --- | --- | --- |
| 1 | Les divisions cellulaires des eucaryotes | 2 sem. | 6 | 4 | 150 |
| 2 | La réplication de l'ADN | 2 sem. | 8 | 4 | 150 |
| 3 | Mutations de l'ADN et variabilité génétique | 2 sem. | 8 | 3 | 150 |
| 4 | L'histoire humaine lue dans son génome | 1 sem. | 6 | 3 | 150 |
| 5 | L'expression du patrimoine génétique | 3 sem. | 8 | 5 | 150 |
| 6 | Les enzymes, des biomolécules aux propriétés catalytiques | 1 sem. | 5 | 3 | 150 |
| 7 | Continents, océans et ondes sismiques : la structure du globe | 2 sem. | 6 | 5 | 150 |
| 8 | La chaleur interne de la Terre et la mobilité des plaques | 2 sem. | 6 | 3 | 150 |
| 9 | La dynamique des zones de divergence | 2 sem. | 6 | 5 | 150 |
| 10 | La dynamique des zones de convergence | 2 sem. | 6 | 6 | 150 |
| 11 | Les écosystèmes, des interactions dynamiques | 3 sem. | 5 | 5 | 150 |
| 12 | L'humanité et les écosystèmes : services et gestion | 2 sem. | 5 | 4 | 150 |
| 13 | Mutations, patrimoine génétique et santé | 2 sem. | 6 | 4 | 150 |
| 14 | Cancers et résistance aux antibiotiques | 2 sem. | 6 | 3 | 150 |
| 15 | L'immunité innée | 1 sem. | 6 | 3 | 150 |
| 16 | L'immunité adaptative et la vaccination | 3 sem. | 8 | 5 | 150 |
| | **Total** | **32 sem.** | **101** | **65** | **2400** |

Chaque chapitre a un résumé, un chapeau, des objectifs, des sections en HTML de la liste blanche (encadrés `.def` et `.warn`, tableaux `.tbl`, figures SVG `.fig` avec les classes de `chapitre.css`) et une zone « Je retiens ». Chaque banque compte 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux et 15 réponses courtes (± 1 selon les chapitres), avec environ 60 / 60 / 30 questions de difficulté 1 / 2 / 3.

## Validation

- `svt.json` passe le validateur d'import (`analyserImport`) ; **2,60 Mo** (limite 3 Mo : marge d'environ 13 %, voir les points à trancher).
- Couleur `#15803d` : contraste **5,02:1** avec le blanc (minimum 4,5:1).
- `nettoyerHtml` ne retire rien, sur les 16 chapitres.
- Les 16 banques sont conformes à `verifierBanque` dans leur version finale ; elles ont été fusionnées par `fusionnerBanque` ; l'import à blanc (`versDonneesCours`) construit la charge utile d'`importer_cours` (2,34 Mo). **L'import réel en base n'a pas été fait** (pas de `.env.local` ni de base locale dans le worktree).
- Les scripts npm `banque:*` ne connaissent que `bph` et `stss` : les contrôles ont été faits avec les mêmes fonctions, appelées par un pilote hors dépôt (celui de la session de 2de, copie dans le dossier de notes partagé `svt-outils/`). **Script à faire évoluer** (non modifié) : ajouter les cours de 1re générale à `COURS_BANQUE` (`src/lib/contenu/banque/cours.ts`) et dériver le dossier des banques du chemin du cours.

## Méthode de vérification des quiz

Pour chaque chapitre :

1. Un sous-agent auteur rédige le chapitre, puis la banque, et la contrôle par `verifierBanque` ; il fait une première relecture (et retire les questions qui donnent la réponse d'une autre).
2. **Relecture indépendante** : un autre sous-agent, qui ne voit que le texte brut du chapitre et les questions **sans leurs réponses**, résout les 150 questions et signale ambiguïtés, distracteurs défendables, informations absentes du texte, variantes manquantes. Un script compare ses réponses aux réponses attendues (et, à partir du chapitre 6, vérifie l'alignement réponse / question par le début de l'énoncé).
3. L'auteur tranche chaque écart et chaque remarque : correction de la question ou du chapitre, ou maintien justifié. Tout est consigné dans `banques/svt-chN-relecture.md`.
4. **Seconde vérification indépendante** : toutes les questions modifiées ou contestées (184 en tout) sont résolues à nouveau par un nouveau relecteur indépendant, sans les réponses. Ses dernières remarques sont traitées et consignées.

Résultats :

| | Total |
| --- | --- |
| Accord initial avec le relecteur indépendant | 2387 / 2400 (99,5 %) |
| Écarts initiaux | 13 (ch. 1 : 6 ; ch. 5 : 7), **tous des erreurs du relecteur** (réponses décalées d'une question), vérifiés contre le cours |
| Remarques sur des questions où le relecteur était d'accord | 168 |
| Questions modifiées ou revérifiées après la relecture | 183 |
| Accord à la seconde vérification | 184 / 184 |
| Questions laissées `a_relire` | **0** |

Les 2400 questions ont donc le statut `valide`, celui que le dépôt applique aux questions relues (commits 67d1671 et 90bd11c ; guide, partie 2).

### Principales erreurs corrigées

- **Questions qui donnaient la réponse d'une autre** : le défaut le plus fréquent (une cinquantaine au ch. 2, plusieurs dans tous les chapitres) ; l'une des deux questions est réécrite.
- **Imprécisions scientifiques**, corrigées dans la question et dans le chapitre :
  - ch. 16 : la protection contre le tétanos repose sur les anticorps circulants (d'où les rappels), et une personne vaccinée transmet « beaucoup moins » l'agent, pas « jamais » ;
  - ch. 4 : le génome humain était « presque complet » en 2022, le chromosome Y achevé en 2023 ;
  - ch. 13 : un caractère dominant peut apparaître sans parent atteint (mutation nouvelle) ;
  - ch. 2 : un clone est ce qui descend d'une même cellule, pas « les cellules de la peau » ;
  - ch. 15 : les virus ne sont pas des « êtres vivants microscopiques ».
- **Ambiguïtés et distracteurs défendables** : par exemple la demi-vitesse et la vitesse d'expansion (ch. 9), les faciès métamorphiques (ch. 10), la règle des 10 % entre niveaux trophiques (ch. 11), « distinguent » lu comme « diffèrent » (ch. 8).
- **Données à la limite de l'arrondi** remplacées par des valeurs nettes (ch. 4 : 2²⁰ ; ch. 9 : densité 3,26 contre 3,25).
- **Réponses courtes** : variantes ajoutées (« œ » / « oe », sigles, singulier / pluriel, synonymes du texte), marges numériques pour les fourchettes (ch. 7 et 8).
- **Informations absentes du cours** : ajoutées au chapitre plutôt que retirées de la banque quand elles relèvent du programme (biais de la capture-marquage-recapture, définition du paiement pour services environnementaux, gradient géothermique dans la lithosphère, sigle COX…).

## Points à trancher par l'enseignant

1. **Validation humaine** : le statut `valide` a été appliqué à la suite de deux relectures indépendantes faites par des sous-agents, pas par un enseignant. Le guide réserve `valide` au contenu « déjà relu » : un contrôle par sondage avant publication reste recommandé, surtout pour les chapitres sensibles (13, 14, 16). Réimporter avec `--garder-statuts` conservera les validations faites ensuite dans l'éditeur.
2. **Taille du fichier** : 2,60 Mo pour 3 Mo autorisés. Les figures SVG pèsent lourd ; ajouter des questions ou des figures pourrait dépasser la limite (on pourrait alors scinder le cours ou alléger les SVG).
3. **Découpage** : 16 chapitres (regroupements expliqués dans le plan). Les chapitres 2, 3 et 5 ont 8 sections au lieu des 6 prévues, pour garder des sections de taille raisonnable ; plusieurs sections dépassent 5000 caractères à cause de leurs figures.
4. **Ordre** : celui du programme ; la géologie (ch. 7 à 10) ou l'immunologie (ch. 15 et 16) peuvent être déplacées.
5. **Valeurs choisies par convention**, cohérentes entre les chapitres 9 et 10 : loi épaisseur-âge e ≈ 10 √t (le coefficient varie de 7 à 10 selon les manuels), densités 2,9 / 3,3 / 3,25, plongement vers 25 à 30 Ma. Valeurs approchées signalées comme telles : profils PREM et altitudes (ch. 7), âges et distances d'Hawaï (ch. 8), expérience des levures et UV (ch. 3), nombres de segments V, D, J (ch. 16), fréquence de la mucoviscidose (1 sur 4000 à 5000, porteurs 1 sur 30 à 35 : le calcul avec 1/30 donne 1/3600, même ordre de grandeur).
6. **Données datées à actualiser** : chiffres de santé publique (cancers, antibiorésistance), obligation vaccinale (11 vaccins pour les enfants nés depuis le 1er janvier 2018), séquençage du génome humain, retour du loup (1992), estimation de la valeur des services écosystémiques (1997).
7. **Exemples** : forêt tempérée et hêtraie (ch. 11 et 12), mucoviscidose, drépanocytose et diabète de type 2 (ch. 13), grippe (ch. 16), Alpes et Himalaya (ch. 10) ; à remplacer par des exemples locaux si besoin.
8. **Tolérances de réponse discutables** : ch. 10:150 accepte « serpentine » (minéral) pour « serpentinite » (roche) ; ch. 6:143 accepte la faute fréquente « Fisher » pour Emil Fischer ; ch. 8:138 accepte toute valeur de 5000 à 6000 °C.
9. **Questions de mémoire ou peu utiles** gardées : ch. 5:128 (code binaire 0 et 1), questions de dates et de noms propres (Meselson et Stahl, Metchnikoff, Koshland / Fischer…) ; à retirer si l'on veut des quiz centrés sur la compréhension.
10. **Biais résiduels de forme** : au ch. 13, la bonne réponse des qcm_unique n'est presque jamais la plus longue (1 sur 75) ; au ch. 15, elle est souvent la plus courte. C'est conforme aux règles, mais repérable. La position des bonnes réponses dans les fichiers est sans effet : l'application permute les propositions à chaque tirage.
11. **Thèmes sensibles** (maladies génétiques, cancers, vaccination, médicaments) : rédigés de façon factuelle et neutre, sans conseil médical ; à relire en équipe.
