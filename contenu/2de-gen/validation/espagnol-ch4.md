# Validation de la banque du chapitre 4 d'espagnol : « Crear y recrear »

Rapport produit le 11 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 4 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 4. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 59 / 31.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 27 sur 75 (36 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 12 150 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : peinture et description | 11 |
| Vocabulaire : créer, mode, musique | 16 |
| Grammaire : l'imparfait | 14 |
| Grammaire : imparfait ou passé simple | 17 |
| Grammaire : pronoms relatifs | 15 |
| Compréhension de l'écrit | 17 |
| Culture : créer et recréer | 27 |
| S'exprimer : présenter une œuvre | 7 |
| Grammaire : passé simple régulier | 13 |
| Grammaire : passé simple irrégulier | 13 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 011 | Traduis « l'autoportrait » en espagnol (avec l'article). | el autorretrato ; autorretrato |
| 018 | Traduis « le roman » en espagnol (avec l'article). | la novela ; novela |
| 031 | Écris l'imparfait de « mirar » avec « yo ». | miraba ; yo miraba |
| 032 | Écris l'imparfait de « ser » avec « nosotros ». | éramos ; nosotros éramos ; nosotras éramos |
| 049 | Mets le verbe au temps qui convient : « Ayer ___ el Guernica. » (yo, ver) | vi ; yo vi |
| 064 | Complète d'un mot : « Málaga es la ciudad ___ nació Picasso. » | donde ; en que ; en la que |
| 100 | Qui a écrit « Don Quijote de la Mancha » ? Donne son nom de famille. | Cervantes ; Miguel de Cervantes ; Cervantès |
| 118 | Conjugue « ganar » au passé simple avec « yo ». | gané ; yo gané |
| 119 | Écris le passé simple de « perder » avec « ellos ». | perdieron ; ellos perdieron ; ellas perdieron |
| 120 | Écris le passé simple de « jugar » avec « yo ». | jugué ; yo jugué |
| 131 | Écris le passé simple de « hacer » avec « él ». | hizo ; él hizo ; ella hizo |
| 132 | Écris le passé simple de « ir » avec « yo ». | fui ; yo fui |
| 133 | Écris le passé simple de « venir » avec « ellos ». | vinieron ; ellos vinieron ; ellas vinieron |
| 142 | Traduis « la légende » en espagnol (avec l'article). | la leyenda ; leyenda |
| 150 | Combien de tableaux compte la série de Picasso inspirée de « Las Meninas » ? Réponds en chiffres. | 58 ; cincuenta y ocho |

Relecture détaillée et points de doute : `banques/espagnol-ch4-relecture.md`.
