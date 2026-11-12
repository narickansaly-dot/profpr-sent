# Validation : espagnol 1re, chapitre 3 (Arte y poder)

Contrôles lancés le 12 novembre 2026 avec les fonctions du dépôt (`verifierBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`), appelées depuis un script hors dépôt (les scripts `npm run banque:*` ne connaissent que `bph` et `stss`).

## Chapitre

- Sections : 6 (lectura, vocabulario, imperativo, pronombres, cultura, para-expresarse) + « Je retiens ».
- Objectifs : 4. Durée indiquée : 6 semaines.
- Nettoyage HTML : rien n'est retiré (hors `tabindex="0"` ajouté aux tableaux).

## Banque

- `verifierBanque` : conforme, 150 questions (sources `espagnol:ch3:banque:001` à `150`).
- Types : 75 QCM à réponse unique, 30 QCM à plusieurs réponses, 30 vrai/faux (17 vrais, 13 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Position de la bonne réponse des QCM à réponse unique : 19 / 18 / 19 / 19 ; bonne réponse la plus longue dans 16 QCM sur 75.
- Statuts : valide 150.

## Relecture indépendante

Voir `banques/espagnol-ch3-relecture.md` : un sous-agent sans accès aux réponses a résolu les 150 questions ; 0 écart avec les réponses attendues ; les remarques fondées ont été corrigées avant la fusion.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : pouvoir et censure | 17 |
| Vocabulaire : engagement et œuvres | 16 |
| Impératif affirmatif | 16 |
| Impératifs irréguliers (tú) | 17 |
| Défense : no + subjonctif | 16 |
| Pronoms et enclise | 16 |
| Obligation, interdiction, lo + adj. | 15 |
| Compréhension : Víctor Jara | 13 |
| Repères culturels | 15 |
| Présenter une œuvre | 9 |

## Réponses courtes et variantes acceptées

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 016 | Traduis en espagnol, avec l'article : « la censure ». | la censura |
| 017 | Écris l'infinitif espagnol qui signifie « obéir ». | obedecer |
| 032 | Traduis en espagnol, avec l'article : « la résistance ». | la resistencia |
| 033 | Écris l'infinitif espagnol qui signifie « dénoncer ». | denunciar |
| 048 | Écris l'impératif de « pintar » à la personne « tú ». | pinta |
| 049 | Écris l'impératif de « escribir » à la personne « vosotros ». | escribid |
| 065 | Écris l'impératif « tú » de « venir ». | ven |
| 066 | Écris l'impératif « tú » de « poner ». | pon |
| 081 | Écris la défense de « mira » (tú), en deux mots. | no mires |
| 082 | Écris la défense de « id » (vosotros, ir), en deux mots. | no vayáis |
| 097 | Écris en un mot « Fais-le ! » (hacer, tú, + lo). | hazlo |
| 098 | Écris en un mot « Donne-le-moi » (dar, tú, + me + lo). | dámelo |
| 113 | Complète : « ___ que respetar las normas » (il faut). | hay |
| 126 | Quel est le prénom du président chilien que soutenait Víctor Jara (Salvador…) ? Écris son nom de famille. | Allende ; Salvador Allende |
| 141 | Quel peintre muraliste mexicain, cité dans le cours, a vu une de ses fresques détruite à New York en 1934 ? Écris son nom de famille. | Rivera ; Diego Rivera |

Aucune réponse courte n'est un nombre avec séparateur de milliers ; aucune marge n'est utilisée (la seule réponse numérique, une année, est attendue exacte). Les accents et la casse sont ignorés par la correction.
