# Bilan : cours d'histoire-géographie, 1re générale (enseignement commun)

Branche `claude/contenu-1re-histoire-geo-5cce54`, 18 novembre 2026. Tout est commité, sans push ni PR.

## Programme suivi

- **Arrêté du 17 janvier 2019**, annexe 2 « Programme d'histoire-géographie de première générale », BO spécial n° 1 du 22 janvier 2019, **NOR MENE1901577A**. Il reste applicable en 2026-2027.
- La **note de service du 21 avril 2026** (NOR MENE2610780N, BO n° 20 du 14 mai 2026) n'adapte que les thèmes des classes préparant le Baccalauréat franco-allemand (BFI-allemand) : elle ne change pas l'enseignement commun.
- Le texte officiel a été lu en entier (PDF de l'annexe 2, 16 pages). Le résumé est dans `programmes/histoire-geo-1re.md`, le découpage dans `programmes/histoire-geo-1re-plan.md`.
- **Limite** : Légifrance n'a pas pu être consulté directement. L'absence de modification est à confirmer sur la version consolidée de l'arrêté.

## Fichiers

| Fichier | Contenu |
| --- | --- |
| `programmes/histoire-geo-1re.md` | résumé de l'annexe 2 et vérification du texte applicable |
| `programmes/histoire-geo-1re-plan.md` | découpage en 18 chapitres, avec objectifs, sections et notions |
| `histoire-geo.json` | le cours : 18 chapitres rédigés, 2 700 questions (2 644 `valide`, 56 `a_relire`) |
| `banques/histoire-geo-chN.json` | 18 fichiers de travail de 150 questions |
| `banques/histoire-geo-chN-relecture.md` | 18 comptes rendus de relecture indépendante, avec la décision prise pour chaque écart et chaque remarque |
| `validation/histoire-geo-cours.md` | validation du cours (import, HTML, couleur, import à blanc) |
| `validation/histoire-geo-chN.md` | 18 rapports de contrôle des banques |

## Chapitres

| N° | Chapitre | Programme | Écarts / remarques à la relecture | `a_relire` |
| --- | --- | --- | --- | --- |
| 1 | La Révolution française et l'Empire | H1 (P1-P3) | 0 / 7 | 1 |
| 2 | L'Europe entre restauration et révolution (1814-1848) | H2 (P4-P6) | 4 / 15 | 4 |
| 3 | La Deuxième République et le Second Empire | H3 (P7-P9) | 0 / 7 | 0 |
| 4 | L'industrialisation et les transformations économiques et sociales | H4 (P10-P12) | 0 / 7 | 0 |
| 5 | La France et la construction de nouveaux États | H5 (P13-P14) | 0 / 6 | 2 |
| 6 | La mise en œuvre du projet républicain | H6 (P15-P17) | 0 / 5 | 0 |
| 7 | Permanences et mutations de la société française jusqu'en 1914 | H7 (P18-P20) | 6 / 7 | 0 |
| 8 | Métropole et colonies | H8 (P21-P23) | 0 / 7 | 3 |
| 9 | Un embrasement mondial et ses grandes étapes | H9 (P24-P27) | 5 / 7 | 5 |
| 10 | Les sociétés en guerre | H10 (P28-P30) | 1 / 8 | 6 |
| 11 | Sortir de la guerre | H11 (P31-P33) | 1 / 4 | 7 |
| 12 | La métropolisation : un processus mondial différencié | G1, G2 | 7 / 6 | 11 |
| 13 | La France : la métropolisation et ses effets | G3 | 1 / 4 | 8 |
| 14 | Une diversification des espaces et des acteurs de la production | G4, G5 | 1 / 4 | 0 |
| 15 | La France : les systèmes productifs | G6 | 7 / 16 | 6 |
| 16 | Les espaces ruraux : multifonctionnalité ou fragmentation ? | G7, G8 | 1 / 6 | 2 |
| 17 | La France : des espaces ruraux multifonctionnels | G9 | 1 / 2 | 1 |
| 18 | La Chine : des recompositions spatiales multiples | G10-G12 | 1 / 5 | 0 |
| | **Total** | | **36 / 123** | **56** |

Les 2 700 questions se répartissent en 1 350 QCM à réponse unique, 540 QCM à réponses multiples, 540 vrai/faux et 270 réponses courtes ; 1 080 de niveau 1, 1 080 de niveau 2 et 540 de niveau 3.

## Méthode de vérification des quiz

1. Chaque chapitre et sa banque ont été rédigés par un sous-agent, à partir du texte officiel et du plan.
2. **Relecture indépendante à l'aveugle** : un autre sous-agent, qui n'a vu que le texte du chapitre et les questions **sans les réponses**, a résolu les 150 questions de chaque banque. Une comparaison automatique a listé les écarts (réponse différente) et les remarques (même réponse, mais erreur, ambiguïté, doublon ou indice signalés).
3. Chaque écart et chaque remarque ont été examinés, puis corrigés ou maintenus avec une justification (tableau dans chaque `-relecture.md`). Le texte du chapitre a été corrigé quand l'erreur venait de lui.
4. Sur 36 écarts, 14 (chapitres 12 et 15) étaient des séries de vrai/faux inversées par le relecteur, décalage de saisie vérifié à la main : les énoncés ont une réponse évidente et sont maintenus (un seul, doublon par ailleurs, a été remplacé). Les autres écarts ont conduit à des corrections ou à l'ajout de variantes de réponse.
5. `verifierBanque` a été relancé après correction : les 18 banques sont conformes. Le cours complet passe `analyserImport`, `nettoyerHtml` et l'import à blanc.
6. **Statuts** : comme pour BPH et STSS (commits `67d1671` et `90bd11c`), les questions relues et retenues sont passées en `valide`. Seules 56 questions réellement douteuses restent `a_relire` (liste ci-dessous).

## Erreurs corrigées grâce à la relecture (principales)

- **Positions des bonnes réponses** : dans les banques 3 à 6, les bonnes réponses des QCM suivaient un cycle fixe (signalé à la relecture du chapitre 3). Les propositions des QCM de ces quatre banques ont été mélangées (graine fixe, contenu inchangé), et la règle « positions au hasard » a été ajoutée aux consignes des banques suivantes.
- **Chapitre 2** : le printemps des peuples commence à Palerme en janvier 1848, pas à Paris (texte et question).
- **Chapitre 7** : l'appel de 1889 vise le 1er mai 1890 ; doublon sur Zénobe Gramme ; Schneider fabriquait des autobus dès 1906.
- **Chapitre 8** : le Laos devient protectorat en 1893 et n'est rattaché à l'Union indochinoise qu'en 1899 (texte et question) ; dates de Bugeaud.
- **Chapitre 9** : la phrase « aucun soldat allié en Allemagne » était fausse (Haute-Alsace occupée dès 1914) ; vrai/faux qui alternaient strictement.
- **Chapitre 10** : âge d'Irène Curie en août 1914 corrigé (16 ans ; texte et questions).
- **Chapitre 11** : distracteurs en partie vrais (Rhénanie, Mourmansk) ; prix Nobel de la paix de 1919 de Wilson.
- **Chapitre 12** : chiffres de l'ONU datés (World Urbanization Prospects 2018) ; classement GaWC 2020 complété ; trois doublons.
- **Chapitre 13** : Marseille est le « premier port français de Méditerranée » (HAROPA est désormais le premier ensemble portuaire).
- **Chapitre 15** : la France est le premier producteur de blé de l'UE (pas du continent) ; Toulouse est le siège opérationnel d'Airbus ; doublons et énoncés qui donnaient la réponse d'une réponse courte.
- **Chapitre 16** : la révolution verte commence au Mexique dès les années 1940.
- **Chapitre 18** : la Chine compte environ 17 % de la population mondiale.
- Les autres corrections (distracteurs, réponses courtes élargies, doublons) sont détaillées question par question dans chaque `-relecture.md`.

## Questions laissées `a_relire` (56)

Ce sont surtout des chiffres arrondis ou des estimations discutées, et des données qui changent d'une année à l'autre.

- ch1 : 139 (réponse courte ouverte).
- ch2 : 030 (électeurs en 1846), 056 (population de Chios), 108 (interprétation), 117 (âge de vote et cens, Charte de 1830 et loi de 1831).
- ch5 : 100 (détail du tableau de von Werner), 110 (nom du peintre, pointu).
- ch8 : 010 (Européens en Algérie en 1911), 020 (Dakar capitale de l'AOF en 1902), 140 (Fachoda « au Soudan »).
- ch9 : 025, 141 (« première grande attaque aux gaz »), 029 (« saigner à blanc »), 043 (morts des Dardanelles), 052 (soldats coloniaux).
- ch10 : 030, 087 (action de Marie Curie), 050 (civils tués en 1914), 059, 063 (bilans des massacres et du génocide des Arméniens), 134 (exécutions de 1917).
- ch11 : 002, 010, 076, 079 (pertes par pays), 048, 123 (indice de l'une pour l'autre), 128 (échange gréco-turc).
- ch12 : 002, 005, 009, 136 (chiffres ONU 2018, changés par la révision 2025), 006, 007 (seuils statistiques de la ville), 029 (BosWash), 035, 090, 119 (classement GaWC 2020), 069 (bidonvilles de Mumbai).
- ch13 : 008, 078 (métropoles d'équilibre), 014 (part du PIB de l'Île-de-France), 053, 129 (QPV), 135 (Roissy), 138 (Nice, 2011), 149 (La Défense).
- ch15 : 013, 026, 027, 090 (ordres de grandeur), 101 (classement EY), 136 (réponse lisible dans le titre du chapitre).
- ch16 : 040 (objectif de 30 % : terres et mers), 057 (surfaces Land Matrix).
- ch17 : 050 (Sainte-Soline, 2022 et 2023).

Pour les chapitres 14, 16, 17 et 18, des chiffres que les rédacteurs avaient signalés comme donnés de mémoire ont été contrôlés par la session principale (trafics portuaires 2023, CNUCED, UIT, recensements agricoles 1988 et 2020, Agence Bio, Bureau national des statistiques chinois 2024, ligne Heihe-Tengchong…) et jugés justes : les questions correspondantes sont validées.

## Points à trancher par l'enseignant

1. **Découpage** : 11 chapitres d'histoire (un par chapitre du programme) et 7 de géographie (questions générales d'un thème réunies, question France à part, la Chine seule). Les durées suivent les fourchettes du programme.
2. **Chiffres de l'urbanisation (ch12)** : le cours garde la série des World Urbanization Prospects 2018 (définitions nationales : 55 % d'urbains en 2018), celle des manuels. La révision 2025 de l'ONU utilise le « degré d'urbanisation » et donne d'autres valeurs : à actualiser si la classe utilise les nouveaux chiffres.
3. **Chiffres à actualiser chaque année**, surtout en géographie : trafics portuaires, classements (GaWC, EY, Fortune), population chinoise, France services, PAC.
4. **Ordre des vrai/faux** : dans la banque 4, les 15 vrais précèdent les 15 faux dans l'ordre des sources. C'est sans effet si les quiz tirent les questions au hasard ; à vérifier.
5. **Validation** : les 2 644 questions `valide` ont été relues par un sous-agent indépendant, pas par une personne. Une relecture humaine par échantillon reste souhaitable avant un usage en évaluation.

## À changer dans les scripts (non modifiés, comme demandé)

- `banque:texte`, `banque:verifier` et `banque:fusionner` ne connaissent que `bph` et `stss`, avec des chemins écrits en dur sur `contenu/1re-st2s/` (`src/lib/contenu/banque/cours.ts`). Il faudrait y ajouter les cours de 2de et de 1re générale (préfixe, fichier, total) et rendre le dossier des banques paramétrable.
- En attendant, les contrôles et la fusion ont été faits en appelant directement `verifierBanque`, `fusionnerBanque`, `serialiserCours`, `texteChapitre`, `analyserImport`, `nettoyerHtml` et `versDonneesCours`, avec la configuration `{ prefixe: 'histoire-geo', total: 150 }`.
- **Import réel** non fait (pas de base dans le worktree) : `npm run import:contenu -- contenu/1re-gen/histoire-geo.json`.
