# Validation de la banque du chapitre 2 d'espagnol : « El mundo del trabajo »

Rapport produit le 10 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 2 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 2. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (17 vrais, 13 faux), 15 réponses courtes.
- Difficultés : 60 / 58 / 32.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 27 sur 75 (36 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 9 428 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : les métiers | 17 |
| Vocabulaire : études et emploi | 19 |
| Grammaire : le futur simple | 28 |
| Grammaire : l'obligation | 19 |
| Grammaire : souhaits et projets | 16 |
| Compréhension de l'écrit | 22 |
| Culture : travail et migrations | 18 |
| S'exprimer : projet et entretien | 11 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 016 | Traduis « le médecin » en espagnol (avec l'article). | el médico ; médico ; la médica ; médica |
| 017 | Traduis « l'ingénieure » en espagnol (avec l'article). | la ingeniera ; ingeniera |
| 035 | Traduis « le chômage » en espagnol (avec l'article). | el paro ; paro ; el desempleo ; desempleo |
| 036 | Traduis « le stage » en espagnol (avec l'article, au pluriel comme en espagnol). | las prácticas ; prácticas |
| 061 | Conjugue « trabajar » au futur avec « yo ». | trabajaré ; yo trabajaré |
| 062 | Écris le futur de « tener » avec « ellos ». | tendrán ; ellos tendrán ; ellas tendrán |
| 063 | Écris le futur de « poner » avec « nosotros ». | pondremos ; nosotros pondremos ; nosotras pondremos |
| 064 | Écris le futur de « vivir » avec « tú ». | vivirás ; tú vivirás |
| 082 | Traduis « Il faut travailler » en espagnol. | hay que trabajar |
| 083 | Traduis « Je dois étudier » avec « tener que ». | tengo que estudiar ; yo tengo que estudiar |
| 098 | Traduis « j'aimerais voyager » en espagnol. | me gustaría viajar ; a mí me gustaría viajar |
| 099 | Complète d'un mot : « ¿Qué ___ gustaría ser a tu hermana? » | le |
| 121 | Texte : « Javier tiene veintiséis años. » Quel âge a Javier ? Réponds en chiffres. | 26 ; veintiséis |
| 139 | Traduis par trois mots espagnols : « la fuite des cerveaux » (avec l'article). | la fuga de cerebros ; fuga de cerebros |
| 150 | Traduis « le CV » en espagnol (avec l'article). | el currículum ; currículum ; el currículo ; currículo ; el curriculum vitae ; el CV |

Relecture détaillée et points de doute : `banques/espagnol-ch2-relecture.md`.
