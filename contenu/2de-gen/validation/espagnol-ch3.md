# Validation de la banque du chapitre 3 d'espagnol : « El pueblo, el barrio, la ciudad »

Rapport produit le 10 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 3 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 3. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (17 vrais, 13 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 27 sur 75 (36 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 9 152 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : la ville | 17 |
| Vocabulaire : village et orientation | 16 |
| Grammaire : hay et estar | 20 |
| Grammaire : lieu, muy et mucho | 19 |
| Grammaire : l'impératif affirmatif | 26 |
| Compréhension de l'écrit | 21 |
| Culture : villes et villages hispaniques | 20 |
| S'exprimer : décrire, guider | 11 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 016 | Traduis « la mairie » en espagnol (avec l'article). | el ayuntamiento ; ayuntamiento |
| 017 | Traduis « l'embouteillage » en espagnol (avec l'article). | el atasco ; atasco |
| 032 | Traduis « le village » en espagnol (avec l'article). | el pueblo ; pueblo |
| 033 | Traduis « les voisins » en espagnol (avec l'article). | los vecinos ; vecinos |
| 053 | Complète d'un mot : « En mi barrio ___ tres parques. » | hay |
| 071 | Traduis « loin de la gare » en espagnol. | lejos de la estación |
| 072 | Complète d'un mot : « Hay ___ tiendas en el centro. » (beaucoup de) | muchas |
| 095 | Écris l'impératif de « venir » avec « tú ». | ven |
| 096 | Écris l'impératif de « poner » avec « tú ». | pon |
| 097 | Écris l'impératif de « girar » avec « usted ». | gire ; gire usted |
| 098 | Écris l'impératif de « cruzar » avec « vosotros ». | cruzad |
| 119 | Texte : « El autobús pasa solo dos veces por semana. » Combien de fois par semaine passe le bus ? Réponds en chiffres. | 2 ; dos |
| 138 | Comment s'appelle le quartier de Buenos Aires célèbre pour ses maisons colorées ? | La Boca ; el barrio de La Boca ; barrio de La Boca |
| 139 | Comment appelle-t-on en espagnol la grande place centrale d'une ville espagnole ? | plaza mayor ; la plaza mayor |
| 150 | Traduis « à droite » en espagnol. | a la derecha ; derecha |

Relecture détaillée et points de doute : `banques/espagnol-ch3-relecture.md`.
