# Validation de la banque du chapitre 5 d'espagnol : « El pasado en el presente »

Rapport produit le 11 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 5 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 5. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (17 vrais, 13 faux), 15 réponses courtes.
- Difficultés : 60 / 61 / 29.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 18 sur 75 (24 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 9 538 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : histoire et mémoire | 18 |
| Vocabulaire : fêtes et patrimoine | 15 |
| Grammaire : périphrases verbales | 21 |
| Grammaire : le gérondif | 15 |
| Grammaire : hace et desde hace | 16 |
| Grammaire : le passé composé | 19 |
| Compréhension de l'écrit | 21 |
| Culture : mémoire hispanique | 25 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 017 | Traduis « la mémoire » en espagnol (avec l'article). | la memoria ; memoria |
| 018 | Traduis « la dictature » en espagnol (avec l'article). | la dictadura ; dictadura |
| 032 | Traduis « la fête » en espagnol (avec l'article). | la fiesta ; fiesta |
| 033 | Traduis « le siècle » en espagnol (avec l'article). | el siglo ; siglo |
| 053 | Traduis « je viens d'arriver » en espagnol. | acabo de llegar ; yo acabo de llegar |
| 054 | Complète d'un mot : « Rosa ___ buscando a su nieta. » (seguir, présent) | sigue |
| 068 | Écris le gérondif de « luchar ». | luchando |
| 069 | Écris le gérondif de « decir ». | diciendo |
| 084 | Traduis « il y a trois ans » en espagnol. | hace tres años ; hace 3 años |
| 085 | Complète de deux mots : « Vivo en Madrid ___ diez años. » (depuis) | desde hace |
| 103 | Écris le participe passé de « decir ». | dicho |
| 104 | Écris le participe passé de « abrir ». | abierto |
| 125 | Texte : « En 1977, mi hija Laura desapareció. » En quelle année Laura a-t-elle disparu ? Réponds en chiffres. | 1977 |
| 149 | Comment s'appelle, en espagnol, la fête mexicaine des 1er et 2 novembre ? | Día de Muertos ; el Día de Muertos ; Día de los Muertos ; el Día de los Muertos |
| 150 | Dans quelle ville espagnole se trouve l'Alhambra ? | Granada ; Grenade |

Relecture détaillée et points de doute : `banques/espagnol-ch5-relecture.md`.
