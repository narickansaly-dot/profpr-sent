# Validation : espagnol 1re, chapitre 6 (Los Andes, la columna vertebral de Sudamérica)

Contrôles lancés le 12 novembre 2026 avec les fonctions du dépôt (`verifierBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`), appelées depuis un script hors dépôt (les scripts `npm run banque:*` ne connaissent que `bph` et `stss`).

## Chapitre

- Sections : 7 (lectura, vocabulario, situar, tiempo-numeros, perifrasis, cultura, para-expresarse) + « Je retiens ».
- Objectifs : 5. Durée indiquée : 7 semaines.
- Nettoyage HTML : rien n'est retiré (hors `tabindex="0"` ajouté aux tableaux).

## Banque

- `verifierBanque` : conforme, 150 questions (sources `espagnol:ch6:banque:001` à `150`).
- Types : 75 QCM à réponse unique, 30 QCM à plusieurs réponses, 30 vrai/faux (18 vrais, 12 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Position de la bonne réponse des QCM à réponse unique : 18 / 19 / 19 / 19 ; bonne réponse la plus longue dans 21 QCM sur 75.
- Statuts : valide 150.

## Relecture indépendante

Voir `banques/espagnol-ch6-relecture.md` : un sous-agent sans accès aux réponses a résolu les 150 questions ; 0 écart avec les réponses attendues ; les remarques fondées ont été corrigées avant la fusion.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : géographie andine | 16 |
| Vocabulaire : peuples et histoire | 14 |
| Ser, estar, hay | 15 |
| Lieu : adverbes, démonstratifs | 15 |
| Nombres, dates, siècles | 16 |
| Apocope et superlatif | 15 |
| Périphrases verbales | 16 |
| Phrase emphatique | 13 |
| Compréhension : vivir allí arriba | 14 |
| Repères culturels | 16 |

## Réponses courtes et variantes acceptées

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 015 | Traduis en espagnol, avec l'article : « le sommet ». | la cima ; el pico ; la cumbre ; cima ; cumbre |
| 016 | Traduis en espagnol, avec l'article : « le volcan ». | el volcán |
| 030 | Traduis en espagnol, avec l'article : « l'héritage » (mot de la famille de « heredar »). | la herencia |
| 045 | Complète avec un verbe : « Machu Picchu ___ en Perú ». | está ; se encuentra ; queda |
| 059 | Traduis en espagnol : « ici ». | aquí ; acá |
| 060 | Traduis en espagnol la locution « en face de ». | enfrente de ; en frente de ; frente a |
| 075 | Comment s'écrit en toutes lettres le nombre 200, au masculin ? | doscientos |
| 076 | Écris en lettres le nombre 700 (masculin). | setecientos |
| 090 | Écris le superlatif absolu de « alto » (masculin singulier). | altísimo |
| 091 | Écris la forme apocopée de « ninguno » devant un nom masculin singulier (« no hay ___ problema »). | ningún |
| 106 | Écris le gérondif de « construir ». | construyendo |
| 107 | Écris le gérondif de « ir ». | yendo |
| 120 | Complète : « Fue en Cuzco ___ se celebró la fiesta » (relatif de lieu). | donde |
| 134 | Comment s'appelle la montagne sacrée de La Paz citée dans le texte ? | Illimani ; el Illimani |
| 150 | Comment s'appelle la citadelle inca révélée au monde en 1911 ? | Machu Picchu ; Machu Pichu ; el Machu Picchu ; Machupicchu |

Aucune réponse courte n'est un nombre avec séparateur de milliers ; aucune marge n'est utilisée (la seule réponse numérique, une année, est attendue exacte). Les accents et la casse sont ignorés par la correction.
