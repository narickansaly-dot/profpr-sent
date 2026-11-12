# Validation : espagnol 1re, chapitre 1 (Fronteras, viajes y migraciones)

Contrôles lancés le 12 novembre 2026 avec les fonctions du dépôt (`verifierBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`), appelées depuis un script hors dépôt (les scripts `npm run banque:*` ne connaissent que `bph` et `stss`).

## Chapitre

- Sections : 7 (lectura, vocabulario, preterito, preterito-irregular, imperfecto, cultura, para-expresarse) + « Je retiens ».
- Objectifs : 4. Durée indiquée : 6 semaines.
- Nettoyage HTML : rien n'est retiré (hors `tabindex="0"` ajouté aux tableaux).

## Banque

- `verifierBanque` : conforme, 150 questions (sources `espagnol:ch1:banque:001` à `150`).
- Types : 75 QCM à réponse unique, 30 QCM à plusieurs réponses, 30 vrai/faux (17 vrais, 13 faux), 15 réponses courtes.
- Difficultés : 60 / 62 / 28 (niveaux 1 / 2 / 3).
- Position de la bonne réponse des QCM à réponse unique : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 18 QCM sur 75.
- Statuts : valide 150.

## Relecture indépendante

Voir `banques/espagnol-ch1-relecture.md` : un sous-agent sans accès aux réponses a résolu les 150 questions ; 0 écart avec les réponses attendues ; les remarques fondées ont été corrigées avant la fusion.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : partir et arriver | 17 |
| Vocabulaire : exil, rêve, adaptation | 16 |
| Passé simple régulier | 16 |
| Passé simple : orthographe, e → i | 15 |
| Passé simple irrégulier | 18 |
| Imparfait ou passé simple | 16 |
| Marqueurs de temps | 15 |
| Compréhension : la travesía de Adriana | 13 |
| Repères culturels | 15 |
| Raconter et écrire | 9 |

## Réponses courtes et variantes acceptées

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 016 | Traduis en espagnol, avec l'article : « la frontière ». | la frontera |
| 017 | Écris l'infinitif espagnol qui signifie « fuir ». | huir |
| 032 | Traduis en espagnol, avec l'article : « le rêve ». | el sueño |
| 033 | Complète : « Mi familia está lejos y la echo de ___ » (elle me manque). | menos |
| 048 | Conjugue « llamar » au passé simple, à la personne « él ». | llamó |
| 049 | Conjugue « vivir » au passé simple, à la personne « ellos ». | vivieron |
| 063 | Écris « j'ai touché » en espagnol, au passé simple de « tocar ». | toqué |
| 064 | Conjugue « repetir » au passé simple, à la personne « ella ». | repitió |
| 081 | Conjugue « estar » au passé simple, à la personne « yo ». | estuve |
| 082 | Conjugue « venir » au passé simple, à la personne « él ». | vino |
| 098 | Conjugue « tener » à l'imparfait, à la personne « yo ». | tenía |
| 112 | Traduis en espagnol : « hier ». | ayer |
| 113 | Complète : « Trabajo en este restaurante desde ___ dos años » (depuis deux ans). | hace |
| 126 | Quel est le nom espagnol du train de marchandises qu'Adriana a pris au Mexique ? Écris-le avec l'article. | la Bestia ; Bestia |
| 141 | Comment s'appelle le programme européen d'échanges d'étudiants créé en 1987 ? | Erasmus ; Erasmus+ ; programa Erasmus ; el programa Erasmus |

Aucune réponse courte n'est un nombre avec séparateur de milliers ; aucune marge n'est utilisée (la seule réponse numérique, une année, est attendue exacte). Les accents et la casse sont ignorés par la correction.
