# Validation : espagnol 1re, chapitre 4 (Ciencia, innovación y responsabilidad)

Contrôles lancés le 12 novembre 2026 avec les fonctions du dépôt (`verifierBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`), appelées depuis un script hors dépôt (les scripts `npm run banque:*` ne connaissent que `bph` et `stss`).

## Chapitre

- Sections : 7 (lectura, vocabulario, futuro-condicional, perfecto, palabras, cultura, para-expresarse) + « Je retiens ».
- Objectifs : 5. Durée indiquée : 6 semaines.
- Nettoyage HTML : rien n'est retiré (hors `tabindex="0"` ajouté aux tableaux).

## Banque

- `verifierBanque` : conforme, 150 questions (sources `espagnol-1re:ch4:banque:001` à `150`).
- Types : 75 QCM à réponse unique, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 59 / 31 (niveaux 1 / 2 / 3).
- Position de la bonne réponse des QCM à réponse unique : 18 / 19 / 19 / 19 ; bonne réponse la plus longue dans 20 QCM sur 75.
- Statuts : valide 150.

## Relecture indépendante

Voir `banques/espagnol-ch4-relecture.md` : un sous-agent sans accès aux réponses a résolu les 150 questions ; 0 écart avec les réponses attendues ; les remarques fondées ont été corrigées avant la fusion.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : science et progrès | 16 |
| Vocabulaire : avenir et éthique | 14 |
| Futur : formes | 16 |
| Conditionnel : formes | 16 |
| Futur et conditionnel : emplois | 14 |
| Passé composé | 16 |
| Plus-que-parfait, choix du passé | 14 |
| Formation des mots | 16 |
| Compréhension : Ramón y Cajal | 13 |
| Repères culturels | 15 |

## Réponses courtes et variantes acceptées

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 015 | Traduis en espagnol, avec l'article : « la science ». | la ciencia |
| 016 | Traduis en espagnol, avec l'article : « la recherche » (scientifique). | la investigación ; investigación |
| 030 | Traduis en espagnol, avec l'article : « le recyclage ». | el reciclaje |
| 045 | Conjugue « trabajar » au futur, à la personne « nosotros ». | trabajaremos |
| 046 | Conjugue « poner » au futur, à la personne « tú ». | pondrás |
| 061 | Conjugue « gustar » au conditionnel, 3e personne du singulier (me ___). | gustaría |
| 062 | Conjugue « saber » au conditionnel, à la personne « yo ». | sabría |
| 076 | Complète le futur proche : « Voy ___ estudiar medicina ». | a |
| 091 | Écris le participe passé de « decir ». | dicho |
| 092 | Écris le participe passé de « poner ». | puesto |
| 106 | Complète au plus-que-parfait : « Cuando llegamos, la película ya ___ empezado ». | había |
| 121 | Écris le nom (avec l'article) qui désigne la personne qui invente. | el inventor ; inventor |
| 122 | Écris le nom composé (avec l'article) qui signifie « le bien-être ». | el bienestar ; bienestar |
| 135 | En quelle année Cajal a-t-il reçu le prix Nobel ? (en chiffres) | 1906 |
| 150 | Quel est le nom de famille de l'infirmière galicienne de l'expédition de la vaccine (Isabel…) ? | Zendal ; Isabel Zendal |

Aucune réponse courte n'est un nombre avec séparateur de milliers ; aucune marge n'est utilisée (la seule réponse numérique, une année, est attendue exacte). Les accents et la casse sont ignorés par la correction.
