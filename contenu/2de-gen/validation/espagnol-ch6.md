# Validation de la banque du chapitre 6 d'espagnol : « La creación y las artes »

Rapport produit le 10 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 6 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 6. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (16 vrais, 14 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 26 sur 75 (35 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 8 509 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : peinture et description | 19 |
| Vocabulaire : musique, danse, lettres | 15 |
| Grammaire : l'imparfait | 25 |
| Grammaire : imparfait ou passé simple | 19 |
| Grammaire : pronoms relatifs | 18 |
| Compréhension de l'écrit | 21 |
| Culture : artistes hispaniques | 23 |
| S'exprimer : présenter une œuvre | 10 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 018 | Traduis « le tableau » (une peinture) en espagnol, avec l'article. | el cuadro ; cuadro ; la pintura ; pintura |
| 019 | Traduis « l'autoportrait » en espagnol (avec l'article). | el autorretrato ; autorretrato |
| 033 | Traduis « danser » en espagnol. | bailar |
| 034 | Traduis « le roman » en espagnol (avec l'article). | la novela ; novela |
| 057 | Écris l'imparfait de « mirar » avec « yo ». | miraba ; yo miraba |
| 058 | Écris l'imparfait de « ser » avec « nosotros ». | éramos ; nosotros éramos ; nosotras éramos |
| 059 | Écris l'imparfait de « vivir » avec « ellos ». | vivían ; ellos vivían ; ellas vivían |
| 077 | Mets le verbe au temps qui convient : « Ayer ___ el Guernica. » (yo, ver) | vi ; yo vi |
| 078 | Mets le verbe au temps qui convient : « De niña, ___ mucho. » (yo, dibujar) | dibujaba ; yo dibujaba |
| 095 | Complète d'un mot : « Málaga es la ciudad ___ nació Picasso. » | donde ; en que ; en la que |
| 096 | Complète d'un mot : « Es una canción ___ me encanta. » | que |
| 117 | Notice : « Guernica (1937). » En quelle année Picasso a-t-il peint Guernica ? Réponds en chiffres. | 1937 |
| 139 | Qui a écrit « Don Quijote de la Mancha » ? Donne son nom de famille. | Cervantes ; Miguel de Cervantes ; Cervantès |
| 140 | Quel architecte a conçu la Sagrada Familia ? Donne son nom de famille. | Gaudí ; Antoni Gaudí ; Antonio Gaudí |
| 150 | Traduis « à l'arrière-plan » en espagnol. | al fondo ; en el fondo |

Relecture détaillée et points de doute : `banques/espagnol-ch6-relecture.md`.
