# Validation de la banque du chapitre 6 d'espagnol : « Desafíos y transiciones »

Rapport produit le 11 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 6 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 6. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 23 sur 75 (31 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 14 050 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : l'environnement | 12 |
| Vocabulaire : nature et gestes | 10 |
| Grammaire : former le subjonctif | 19 |
| Grammaire : emplois du subjonctif | 15 |
| Grammaire : défense et conseil | 13 |
| Compréhension de l'écrit | 17 |
| Culture : défis du monde hispanique | 20 |
| S'exprimer : conseiller, débattre | 7 |
| Grammaire : le futur | 16 |
| Grammaire : l'obligation | 10 |
| Vocabulaire : défis et transitions | 11 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 012 | Traduis « la pollution » en espagnol (avec l'article). | la contaminación ; contaminación |
| 022 | Traduis « recycler » en espagnol. | reciclar |
| 040 | Écris le subjonctif présent de « hablar » avec « yo ». | hable ; yo hable ; que hable ; que yo hable |
| 041 | Écris le subjonctif présent de « proteger » avec « tú ». | protejas ; tú protejas ; que protejas |
| 056 | Complète d'un mot : « Ojalá ___ menos plástico. » (haber) | haya |
| 068 | Traduis « Ne jette pas » (tú, tirar). | no tires |
| 069 | Écris la défense de « haz » (hacer, tú). | no hagas |
| 086 | L'article vient d'un journal lycéen de Bogotá, qui parle de « nosotros, desde Bogotá ». Dans quel pays se trouve cette ville ? | Colombia ; Colombie ; en Colombia |
| 105 | Traduis « je suis pour » (opinion) en espagnol. | estoy a favor ; yo estoy a favor |
| 119 | Conjugue « trabajar » au futur avec « yo ». | trabajaré ; yo trabajaré |
| 120 | Écris le futur de « tener » avec « ellos ». | tendrán ; ellos tendrán ; ellas tendrán |
| 121 | Écris le futur de « vivir » avec « tú ». | vivirás ; tú vivirás |
| 131 | Traduis « Il faut travailler » en espagnol. | hay que trabajar |
| 142 | Traduis « le défi » en espagnol (avec l'article). | el desafío ; desafío |
| 150 | Comment s'appelle la ville du Pays basque élue Capitale verte européenne en 2012 ? | Vitoria ; Vitoria-Gasteiz ; Gasteiz |

Relecture détaillée et points de doute : `banques/espagnol-ch6-relecture.md`.
