# Validation de la banque du chapitre 5 d'espagnol : « Deporte y sociedad »

Rapport produit le 10 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 5 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 5. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (17 vrais, 13 faux), 15 réponses courtes.
- Difficultés : 60 / 61 / 29.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 15 sur 75 (20 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 8 048 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : les sports | 18 |
| Vocabulaire : compétition et valeurs | 19 |
| Grammaire : passé simple régulier | 26 |
| Grammaire : passé simple irrégulier | 26 |
| Grammaire : marqueurs de temps | 16 |
| Compréhension de l'écrit | 21 |
| Culture : le sport hispanique | 15 |
| S'exprimer : raconter un match | 9 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 017 | Traduis « nager » en espagnol. | nadar |
| 018 | Traduis « le cyclisme » en espagnol (avec l'article). | el ciclismo ; ciclismo |
| 036 | Traduis « le match » en espagnol (avec l'article). | el partido ; partido |
| 037 | Traduis « l'équipe » en espagnol (avec l'article). | el equipo ; equipo |
| 061 | Conjugue « ganar » au passé simple avec « yo ». | gané ; yo gané |
| 062 | Écris le passé simple de « perder » avec « ellos ». | perdieron ; ellos perdieron ; ellas perdieron |
| 063 | Écris le passé simple de « jugar » avec « yo ». | jugué ; yo jugué |
| 087 | Écris le passé simple de « hacer » avec « él ». | hizo ; él hizo ; ella hizo |
| 088 | Écris le passé simple de « ir » avec « yo ». | fui ; yo fui |
| 089 | Écris le passé simple de « venir » avec « ellos ». | vinieron ; ellos vinieron ; ellas vinieron |
| 104 | Traduis « hier » en espagnol. | ayer |
| 105 | Traduis « il y a deux ans » en espagnol. | hace dos años ; hace 2 años |
| 126 | Texte : « La capitana metió dos goles. » Combien de buts la capitaine a-t-elle marqués ? Réponds en chiffres. | 2 ; dos |
| 141 | En quelle année Barcelone a-t-elle accueilli les Jeux olympiques ? Réponds en chiffres. | 1992 |
| 150 | Traduis « deux fois par semaine » en espagnol. | dos veces por semana ; dos veces a la semana ; 2 veces por semana |

Relecture détaillée et points de doute : `banques/espagnol-ch5-relecture.md`.
