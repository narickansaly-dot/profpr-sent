# Validation de la banque du chapitre 3 d'espagnol : « España, más allá de los tópicos »

Rapport produit le 11 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 3 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 3. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 58 / 60 / 32.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 23 sur 75 (31 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 12 027 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : la ville | 9 |
| Vocabulaire : village et orientation | 9 |
| Grammaire : hay et estar | 16 |
| Grammaire : lieu, muy et mucho | 11 |
| Grammaire : l'impératif affirmatif | 19 |
| S'exprimer : décrire, guider | 9 |
| Compréhension de l'écrit | 21 |
| Culture : l'Espagne réelle | 22 |
| Vocabulaire : paysages, mer, tourisme | 18 |
| Grammaire : se, -ísimo, géographie | 16 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 009 | Traduis « la mairie » en espagnol (avec l'article). | el ayuntamiento ; ayuntamiento |
| 018 | Traduis « le village » en espagnol (avec l'article). | el pueblo ; pueblo |
| 034 | Complète d'un mot : « En mi barrio ___ tres parques. » | hay |
| 061 | Écris l'impératif de « venir » avec « tú ». | ven |
| 062 | Écris l'impératif de « poner » avec « tú ». | pon |
| 063 | Écris l'impératif de « girar » avec « usted ». | gire ; gire usted |
| 064 | Écris l'impératif de « cruzar » avec « vosotros ». | cruzad |
| 073 | Traduis « à droite » en espagnol. | a la derecha ; derecha |
| 094 | Texte : « Voy a ver a mis primos a Vigo, en Galicia. » Dans quelle région se trouve Vigo ? Réponds en espagnol ou en français. | Galicia ; Galice ; en Galicia ; la Galice ; en Galice |
| 115 | Comment s'appelle le grand plateau du centre de l'Espagne ? Réponds en espagnol. | meseta ; la meseta ; meseta central ; la meseta central |
| 116 | Quel port de Galice le cours présente-t-il comme l'un des grands ports de pêche d'Europe ? | Vigo |
| 133 | Traduis « la mer » en espagnol (avec l'article). | el mar ; mar ; la mar |
| 134 | Traduis « le paysage » en espagnol (avec l'article). | el paisaje ; paisaje |
| 149 | Écris le superlatif absolu de « grande » au masculin singulier. | grandísimo |
| 150 | Complète d'un mot : « En España se ___ muchas tapas. » (comer) | comen |

Relecture détaillée et points de doute : `banques/espagnol-ch3-relecture.md`.
