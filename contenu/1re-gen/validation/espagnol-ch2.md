# Validation : espagnol 1re, chapitre 2 (Diversidad e inclusión)

Contrôles lancés le 12 novembre 2026 avec les fonctions du dépôt (`verifierBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`), appelées depuis un script hors dépôt (les scripts `npm run banque:*` ne connaissent que `bph` et `stss`).

## Chapitre

- Sections : 7 (lectura, vocabulario, subjuntivo, usos-subjuntivo, frase, cultura, para-expresarse) + « Je retiens ».
- Objectifs : 4. Durée indiquée : 6 semaines.
- Nettoyage HTML : rien n'est retiré (hors `tabindex="0"` ajouté aux tableaux).

## Banque

- `verifierBanque` : conforme, 150 questions (sources `espagnol-1re:ch2:banque:001` à `150`).
- Types : 75 QCM à réponse unique, 30 QCM à plusieurs réponses, 30 vrai/faux (18 vrais, 12 faux), 15 réponses courtes.
- Difficultés : 60 / 59 / 31 (niveaux 1 / 2 / 3).
- Position de la bonne réponse des QCM à réponse unique : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 13 QCM sur 75.
- Statuts : valide 150.

## Relecture indépendante

Voir `banques/espagnol-ch2-relecture.md` : un sous-agent sans accès aux réponses a résolu les 150 questions ; 0 écart avec les réponses attendues ; les remarques fondées ont été corrigées avant la fusion.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : diversité | 17 |
| Vocabulaire : exclure ou intégrer | 16 |
| Subjonctif : verbes réguliers | 16 |
| Subjonctif : verbes irréguliers | 17 |
| Subjonctif : volonté et sentiment | 16 |
| Subjonctif : opinion, hypothèse, but | 16 |
| Construire sa phrase | 16 |
| Compréhension : un equipo de campeones | 13 |
| Repères culturels | 15 |
| Donner son avis | 8 |

## Réponses courtes et variantes acceptées

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 016 | Traduis en espagnol, avec l'article : « la diversité ». | la diversidad |
| 017 | Traduis en espagnol, avec l'article : « le handicap ». | la discapacidad ; discapacidad ; la minusvalía |
| 032 | Traduis en espagnol, avec l'article : « l'injustice ». | la injusticia |
| 033 | Écris l'infinitif espagnol qui signifie « se moquer » (forme pronominale). | burlarse ; burlarse de |
| 048 | Conjugue « mirar » au présent du subjonctif, à la personne « tú ». | mires |
| 049 | Conjugue « escribir » au présent du subjonctif, à la personne « nosotros ». | escribamos |
| 065 | Conjugue « tener » au présent du subjonctif, à la personne « ellos ». | tengan |
| 066 | Écris « que tu ailles » en espagnol (ir, présent du subjonctif). | vayas |
| 082 | Complète au subjonctif : « Es importante que todos ___ las diferencias » (respetar). | respeten |
| 097 | Complète : « No creo que ___ (ellos, saber) la verdad ». | sepan |
| 098 | Écris le mot espagnol, venu de l'arabe, qui signifie « pourvu que, si seulement ». | ojalá |
| 113 | Complète : « Tu equipo es bueno, pero el ___ es mejor » (le mien). | mío ; el mío |
| 114 | Complète : « En Galicia ___ habla gallego » (on parle galicien). | se |
| 127 | Quel est le titre du film de Javier Fesser cité dans l'article ? | Campeones |
| 142 | Quel nom, emprunté au basque lui-même, le cours donne-t-il à la langue basque ? | euskera ; euskara ; el euskera ; el euskara |

Aucune réponse courte n'est un nombre avec séparateur de milliers ; aucune marge n'est utilisée (la seule réponse numérique, une année, est attendue exacte). Les accents et la casse sont ignorés par la correction.
