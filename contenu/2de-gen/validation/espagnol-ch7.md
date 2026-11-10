# Validation de la banque du chapitre 7 d'espagnol : « Salvar el planeta »

Rapport produit le 10 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 7 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 7. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (16 vrais, 14 faux), 15 réponses courtes.
- Difficultés : 60 / 57 / 33.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 26 sur 75 (35 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 9 455 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : l'environnement | 19 |
| Vocabulaire : nature et gestes | 17 |
| Grammaire : former le subjonctif | 25 |
| Grammaire : emplois du subjonctif | 19 |
| Grammaire : défense et conseil | 21 |
| Compréhension de l'écrit | 21 |
| Culture : nature et écologie | 18 |
| S'exprimer : conseiller, débattre | 10 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 018 | Traduis « l'environnement » en espagnol (avec l'article). | el medio ambiente ; medio ambiente ; el medioambiente ; medioambiente |
| 019 | Traduis « la pollution » en espagnol (avec l'article). | la contaminación ; contaminación |
| 035 | Traduis « recycler » en espagnol. | reciclar |
| 036 | Traduis « la forêt » (tempérée) en espagnol (avec l'article). | el bosque ; bosque |
| 059 | Écris le subjonctif présent de « hablar » avec « yo ». | hable ; yo hable ; que hable ; que yo hable |
| 060 | Écris le subjonctif présent de « ser » avec « nosotros ». | seamos ; nosotros seamos ; que seamos |
| 061 | Écris le subjonctif présent de « proteger » avec « tú ». | protejas ; tú protejas ; que protejas |
| 079 | Complète d'un mot : « Ojalá ___ menos plástico. » (haber) | haya |
| 080 | Complète d'un mot : « Es necesario que todos ___ agua. » (ahorrar) | ahorren |
| 099 | Traduis « Ne jette pas » (tú, tirar). | no tires |
| 100 | Écris la défense de « haz » (hacer, tú). | no hagas |
| 101 | Écris la défense de « ve » (ir, tú). | no vayas |
| 122 | L'article vient d'un journal lycéen de Bogotá, qui parle de « nosotros, desde Bogotá ». Dans quel pays se trouve cette ville ? | Colombia ; Colombie ; en Colombia |
| 140 | Doñana est l'une des zones humides les plus importantes d'Europe. Comment dit-on « zone humide » en espagnol ? | humedal ; el humedal ; un humedal |
| 150 | Traduis « je suis pour » (opinion) en espagnol. | estoy a favor ; yo estoy a favor |

Relecture détaillée et points de doute : `banques/espagnol-ch7-relecture.md`.
